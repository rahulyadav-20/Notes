# Deep Technical Round — API, Kafka, Spark, Airflow, Python, ETL, Monitoring, Linux

> Goes beyond syntax. Focus: internals, why-not-just-X trade-offs, failure behavior, and operational reasoning for each tool in a real data platform.

---

## Table of Contents
1. [API — In Depth](#1-api--in-depth)
2. [Kafka — In Depth](#2-kafka--in-depth)
3. [Spark — In Depth](#3-spark--in-depth)
4. [Airflow — In Depth](#4-airflow--in-depth)
5. [Python — In Depth](#5-python--in-depth)
6. [ETL Job Design](#6-etl-job-design)
7. [Monitoring & Observability](#7-monitoring--observability)
8. [Linux — In Depth](#8-linux--in-depth)
9. [Cross-Cutting Scenario Questions](#9-cross-cutting-scenario-questions)
10. [Rapid-Fire Q&A](#10-rapid-fire-qa)

---

## 1. API — In Depth

### Connection Mechanics
- TCP handshake (SYN, SYN-ACK, ACK) happens once per connection — this is why **connection reuse** (`requests.Session`, HTTP keep-alive, connection pooling) matters at scale: avoids repeating the handshake + TLS negotiation per call.
- TLS handshake adds extra round trips (cert exchange, key negotiation) — TLS session resumption / HTTP/2 multiplexing reduces this cost for repeated calls to the same host.
- **HTTP/1.1** = one request in flight per connection (head-of-line blocking) unless pipelining (rarely used). **HTTP/2** = multiplexed streams over one connection — many concurrent requests, no per-request connection overhead.

### Connection Pooling — Why It Matters Under Load
```python
import requests
from requests.adapters import HTTPAdapter

session = requests.Session()
adapter = HTTPAdapter(pool_connections=20, pool_maxsize=50)
session.mount("https://", adapter)
```
`pool_connections` = number of distinct hosts to cache connections for; `pool_maxsize` = max connections per host. Undersized pools under high concurrency cause connection queuing/latency spikes even though the API itself is healthy.

### Timeouts — the Detail Interviewers Probe
`requests.get(url, timeout=5)` sets **one** timeout number but really there are two:
```python
requests.get(url, timeout=(3, 10))  # (connect_timeout, read_timeout)
```
- **Connect timeout**: time to establish TCP connection
- **Read timeout**: time between bytes once connected (server can be slow to respond even after connecting)
A single number applies to both — senior answer: set them separately, since a hanging read is a different failure mode than an unreachable host.

### Backpressure at the API Layer
When a server is overloaded, correct behavior is to **shed load explicitly** (`429`/`503` + `Retry-After`) rather than silently queueing requests until it falls over — this is the server-side mirror of client backpressure handling.

### Connection-Level Failure Modes
| Symptom | Likely cause |
|---|---|
| `ConnectionError` | DNS failure, host unreachable, connection refused |
| `Timeout` (connect) | Firewall drop, host overloaded and not accepting new connections |
| `Timeout` (read) | Server accepted connection but is slow to process (DB lock, GC pause, downstream call hanging) |
| Connection reset mid-response | Load balancer idle-timeout killed a long-lived connection, server crashed mid-write |
| Intermittent 502/504 | Upstream (behind a load balancer/gateway) unhealthy or timing out |

### API Gateway Internals (what actually happens per request)
```
Client → LB → API Gateway (auth, rate limit, routing) → Service → (DB/cache/other services)
```
Each hop adds latency — a senior discussion point: "why is p99 latency high but p50 fine?" often traces to one hop's tail latency (e.g., GC pauses, a specific downstream call, connection pool exhaustion at one layer) rather than average load.

### Idempotency Keys — Implementation Detail
```python
# Server-side dedup logic (simplified)
def handle_post(idempotency_key, payload):
    cached = redis.get(f"idem:{idempotency_key}")
    if cached:
        return json.loads(cached)          # return prior result, don't reprocess
    result = process(payload)
    redis.setex(f"idem:{idempotency_key}", 86400, json.dumps(result))
    return result
```
Key subtlety: the idempotency store write and the business-logic write should ideally be in the same transaction (or use a two-phase approach) — otherwise a crash between "process payment" and "store idempotency result" can still cause a duplicate on retry.

### gRPC vs REST (depth comparison)
| | REST/JSON | gRPC/Protobuf |
|---|---|---|
| Payload | Text, larger, human-readable | Binary, smaller, faster to (de)serialize |
| Contract | Loose (OpenAPI optional) | Strict (`.proto` schema, code-generated) |
| Streaming | Awkward (SSE/websockets bolted on) | Native (client/server/bidi streaming) |
| Browser support | Native | Needs grpc-web proxy |
| Best for | Public APIs, human debugging | Internal service-to-service, high throughput |

---

## 2. Kafka — In Depth

### Core Concepts
- **Topic**: a named stream of records, split into **partitions** for parallelism
- **Partition**: an ordered, immutable log; order is guaranteed *within* a partition, not across the topic
- **Offset**: a record's position within its partition — consumers track offsets to know what's been read
- **Broker**: a Kafka server; a cluster is many brokers
- **Replication factor**: how many broker copies each partition has (durability)
- **Leader/Follower**: each partition has one leader broker (handles reads/writes) and follower replicas that sync from it
- **Consumer Group**: a set of consumers sharing the work of a topic — each partition is consumed by exactly one consumer *within* a group (this is how Kafka achieves both pub/sub across groups and work-distribution within a group)

### Why Partitioning Matters (frequent depth question)
Throughput scales with partition count (more parallel consumers), but:
- Ordering is only guaranteed **within a partition** — if you need ordering per entity (e.g., all events for `order_id=42` in order), you must partition by that key: `producer.send(topic, key=order_id, value=event)`. Kafka hashes the key to a consistent partition.
- Increasing partitions later is possible but **cannot decrease** them, and repartitioning changes key→partition mapping — breaking ordering guarantees for existing keys. Plan partition count with future scale in mind.

### Producer Acknowledgment Levels (`acks`) — classic depth question
| `acks` | Meaning | Durability | Latency |
|---|---|---|---|
| `0` | Fire and forget | Weakest — can lose data | Fastest |
| `1` | Leader acknowledges write | Lost if leader dies before followers replicate | Medium |
| `all` (`-1`) | All in-sync replicas acknowledge | Strongest | Slowest |

### Delivery Semantics
- **At-most-once**: `acks=0`, no retries — fastest, can lose messages
- **At-least-once**: retries on producer + manual offset commit after processing on consumer — default safe choice, requires idempotent consumers
- **Exactly-once**: Kafka's idempotent producer (`enable.idempotence=true`) + transactional API (`transactional.id`) — dedupes producer retries and allows atomic read-process-write across topics; still requires idempotent handling for any *external* side effects outside Kafka (e.g., writing to a DB)

### Consumer Offset Management
```python
consumer = KafkaConsumer(
    "orders",
    enable_auto_commit=False,   # manual control — critical for correctness
    group_id="orders-processor"
)
for msg in consumer:
    process(msg.value)
    consumer.commit()   # commit only AFTER successful processing
```
**Why manual commit matters:** auto-commit on a timer can commit an offset for a message that hasn't actually finished processing yet (crash between commit and completion = data loss), or can double-process if commit happens after processing but before the next poll (fine, that's at-least-once — the danger is the *reverse* order).

### Consumer Lag (the #1 operational metric)
Lag = (latest offset in partition) − (consumer's committed offset). Rising lag means the consumer can't keep up with the producer — either scale consumers (add more, up to partition count), speed up per-message processing, or investigate a stuck/slow consumer.

### Rebalancing (frequently misunderstood)
When a consumer joins/leaves a group (deploy, crash, scale event), Kafka reassigns partitions among the remaining consumers — during this, consumption pauses ("stop the world" in older protocols). Modern Kafka (cooperative rebalancing, `CooperativeStickyAssignor`) minimizes disruption by only reassigning the specific partitions that need to move instead of pausing everyone.

### Kafka vs Traditional Message Queue (RabbitMQ/SQS)
| | Kafka | Traditional MQ |
|---|---|---|
| Message retention | Log retained for a configured time (or forever), replayable | Message deleted once consumed/acked |
| Multiple independent consumers | Natural (separate consumer groups, each reads full stream) | Needs fan-out config (exchanges/topics) |
| Ordering | Per-partition | Often per-queue |
| Best for | Event streaming, replay, high throughput | Task/work queues, simpler point-to-point |

### Schema Management — Avro + Schema Registry
Kafka messages are just bytes — a **Schema Registry** (Confluent) enforces a schema contract (Avro/Protobuf) per topic, checks compatibility on schema changes (backward/forward/full compatibility modes), preventing a producer's schema change from silently breaking consumers.

### Common Kafka Failure Scenarios (say these in interviews)
- **Under-replicated partitions**: a follower fell behind or is down — reduced durability until it catches up
- **ISR (in-sync replica) shrinkage**: if too many replicas fall out of sync, `acks=all` writes slow down or fail depending on `min.insync.replicas`
- **Consumer stuck in rebalance loop**: usually caused by processing taking longer than `max.poll.interval.ms` — Kafka thinks the consumer died and keeps rebalancing
- **Poison pill message**: a malformed message that repeatedly crashes the consumer on every retry — needs a dead-letter topic and skip-and-continue logic, or the whole partition stalls

---

## 3. Spark — In Depth

### Core Architecture
```
Driver (runs your main program, builds the DAG, schedules tasks)
   │
   ▼
Cluster Manager (YARN / Kubernetes / Spark Standalone) — allocates resources
   │
   ▼
Executors (run on worker nodes — execute tasks, hold cached data in memory)
```
- **Driver**: single point of coordination; if it dies, the whole job dies (in cluster mode, this is on a cluster node, not your laptop — important for long jobs)
- **Executor**: JVM process on a worker node running many tasks in parallel threads
- **Task**: smallest unit of work, operates on one partition of data

### Lazy Evaluation — Transformations vs Actions
- **Transformations** (`map`, `filter`, `join`, `groupBy`) are **lazy** — they just build a logical execution plan (DAG), nothing runs yet
- **Actions** (`collect`, `count`, `write`, `show`) trigger actual execution
- Why this matters: Spark can **optimize the whole DAG** before running anything (predicate pushdown, combining filters, choosing join strategy) — this is why you should avoid unnecessary actions mid-pipeline (each one forces (re)computation unless cached).

### RDD vs DataFrame vs Dataset
| | RDD | DataFrame | Dataset (Scala/Java only) |
|---|---|---|---|
| Type safety | Low (generic objects) | Low (Row objects) | High (compile-time typed) |
| Optimization | None (no Catalyst) | Catalyst optimizer + Tungsten execution | Same as DataFrame |
| Use case | Low-level control, unstructured data | Structured/semi-structured data, SQL-like ops (default choice today) | Type-safe pipelines (JVM langs) |

**Interview point:** almost always use DataFrames (PySpark) — RDDs bypass Catalyst's query optimization and are slower for structured workloads; RDDs are mainly relevant for legacy code or very custom partition-level logic.

### Partitioning & Shuffling (the #1 performance topic)
- **Partition**: a chunk of a distributed dataset processed by one task
- **Shuffle**: redistributing data across partitions/executors — required by `groupBy`, `join`, `distinct`, `repartition` — this is **the most expensive operation** in Spark (disk I/O + network transfer + serialization)

```python
df.repartition(200)          # full shuffle, use to increase parallelism
df.coalesce(10)               # no full shuffle (merges partitions), use to reduce partitions cheaply
```
`coalesce` avoids a full shuffle when *reducing* partition count (it just merges), while `repartition` always shuffles (needed to *increase* partitions or rebalance skewed data).

### Data Skew (classic depth question)
If one key has vastly more records than others (e.g., one `customer_id` dominates), the task processing that partition becomes a straggler — the whole job waits on it.
**Mitigations:**
- **Salting**: append a random suffix to the skewed key to spread it across more partitions, then aggregate in two stages
- **Broadcast join**: if one side of a join is small, broadcast it to all executors instead of shuffling both sides (`broadcast(small_df)`) — avoids shuffle entirely for that join
- Use `spark.sql.adaptive.enabled=true` (Adaptive Query Execution) — Spark can detect skew at runtime and split skewed partitions automatically

### Join Strategies
| Strategy | When used | Cost |
|---|---|---|
| Broadcast Hash Join | One side fits in memory (small table) | Cheap — no shuffle |
| Sort Merge Join | Both sides large | Expensive — full shuffle + sort |
| Shuffle Hash Join | Medium-sized data | Shuffle, no sort |

```python
from pyspark.sql.functions import broadcast
result = large_df.join(broadcast(small_df), "key")
```

### Caching / Persistence
```python
df.cache()                     # MEMORY_AND_DISK by default via .cache()
df.persist(StorageLevel.MEMORY_ONLY)
```
Cache when a DataFrame is reused across multiple actions (avoids recomputing the whole lineage each time) — but caching too much causes memory pressure/spill to disk, which can be slower than just recomputing. `unpersist()` when done.

### Adaptive Query Execution (AQE) — modern Spark depth topic
At runtime, Spark can:
- Coalesce shuffle partitions dynamically (avoid too many tiny partitions)
- Switch join strategy based on actual runtime data size (not just the static plan estimate)
- Optimize skewed joins by splitting large partitions automatically

### Common Spark Failure Modes
| Symptom | Likely cause |
|---|---|
| `OutOfMemoryError` on executor | Data skew, too-large broadcast join, insufficient executor memory, caching too much |
| Job stuck on one task ("straggler") | Data skew — one partition much larger than others |
| Slow shuffle stage | Too few/many partitions, network bottleneck, disk spill |
| Driver OOM | Calling `.collect()` on a huge DataFrame — pulls all data to the single driver JVM |
| Small file problem | Too many tiny output files (e.g., over-partitioned writes) — hurts downstream read performance |

### PySpark ETL Example
```python
from pyspark.sql import SparkSession
from pyspark.sql import functions as F

spark = SparkSession.builder.appName("orders_etl").getOrCreate()

df = spark.read.json("s3://bucket/raw/orders/dt=2026-08-12/")

cleaned = (
    df.filter(F.col("status").isNotNull())
      .withColumn("amount", F.col("amount").cast("double"))
      .dropDuplicates(["order_id"])
)

agg = cleaned.groupBy("customer_id").agg(
    F.sum("amount").alias("total_spent"),
    F.count("order_id").alias("order_count")
)

agg.write.mode("overwrite").partitionBy("dt").parquet("s3://bucket/curated/customer_orders/")
```

---

## 4. Airflow — In Depth

### Core Concepts
- **DAG**: Directed Acyclic Graph — defines task dependencies, not a schedule of literal execution order beyond what dependencies dictate
- **Task**: a unit of work (an Operator instance)
- **Operator**: a template for a task type (`PythonOperator`, `BashOperator`, `KubernetesPodOperator`, sensors)
- **Scheduler**: parses DAGs, decides what should run and when, based on schedule + dependencies
- **Executor**: determines *how/where* tasks actually run (`LocalExecutor`, `CeleryExecutor`, `KubernetesExecutor`)
- **Metadata DB**: stores DAG run history, task state, XComs — the source of truth for the whole system

### Execution Date Confusion (very commonly misunderstood — good depth signal to explain correctly)
Airflow's `execution_date` (aka `data_interval_start` in newer versions) represents the **start of the interval being processed**, not the time the DAG actually runs. A `@daily` DAG scheduled for `2026-08-12` actually **runs after** `2026-08-13 00:00` completes (i.e., after the interval it's responsible for has fully elapsed) — this trips up almost everyone at first and is a great "I understand this deeply" answer.

### Idempotency & Backfills
Because Airflow re-runs failed tasks and supports backfilling historical dates, every task **must** be idempotent (re-running for the same `data_interval` should not create duplicates) — same principle from the ingestion notes, but here it's a first-class Airflow concern via `catchup=True/False` and manual backfill commands.

### XCom — Passing Data Between Tasks
```python
def extract(**kwargs):
    data = fetch_data()
    kwargs["ti"].xcom_push(key="raw_data", value=data)

def load(**kwargs):
    data = kwargs["ti"].xcom_pull(key="raw_data", task_ids="extract")
    load_to_db(data)
```
**Depth point:** XCom stores data in the metadata DB — it's meant for small metadata (a filename, a row count, a cursor value), **not** large datasets. Passing a large DataFrame through XCom is a common anti-pattern; instead, write to intermediate storage (S3) and pass the *path* via XCom.

### Sensors vs Regular Tasks
A **sensor** polls for a condition (file exists, external DAG finished, API returns success) before letting downstream tasks run.
```python
from airflow.sensors.filesystem import FileSensor
wait_for_file = FileSensor(task_id="wait", filepath="/data/incoming/file.csv", poke_interval=30, timeout=3600, mode="reschedule")
```
`mode="poke"` holds a worker slot the whole time it waits (wasteful); `mode="reschedule"` frees the worker slot between checks — important at scale with many sensors.

### TaskFlow API (modern Airflow style)
```python
from airflow.decorators import dag, task
from datetime import datetime

@dag(schedule="@daily", start_date=datetime(2026, 1, 1), catchup=False)
def orders_pipeline():
    @task
    def extract():
        return fetch_records()

    @task
    def transform(records):
        return clean(records)

    @task
    def load(records):
        upsert_postgres(records, "orders", conn_params)

    load(transform(extract()))

orders_pipeline()
```
Cleaner than manual `PythonOperator` + XCom wiring — dependencies inferred from function calls, XCom handled automatically under the hood.

### Retries, SLAs, and Alerting
```python
default_args = {
    "retries": 3,
    "retry_delay": timedelta(minutes=5),
    "retry_exponential_backoff": True,
    "max_retry_delay": timedelta(minutes=30),
    "on_failure_callback": alert_slack,
    "sla": timedelta(hours=2),
}
```
`sla` triggers an alert (not a retry) if a task hasn't finished within the expected window — useful for catching "silently slow, not failed" pipelines.

### Idempotent DAG Design Patterns
- Use `data_interval_start`/`data_interval_end` (not "now") to compute what window of data to process — makes reruns/backfills deterministic
- Write with `overwrite`/upsert semantics keyed on the interval, not append-only, so reruns replace rather than duplicate
- Keep task boundaries at natural retry/checkpoint points (e.g., separate "extract" from "load" so a load failure doesn't force re-extraction)

### Airflow Failure Modes
| Symptom | Cause |
|---|---|
| Scheduler not picking up new DAG | DAG parse error (check scheduler logs), or DAG file sync delay |
| Tasks stuck in "queued" | Not enough worker slots/executor capacity, or executor misconfiguration |
| Zombie tasks | Worker died without updating task state — Airflow has zombie detection but delays exist |
| DAG runs pile up | `catchup=True` with a long-stopped DAG suddenly resumes and tries to backfill every missed interval at once |
| Metadata DB overloaded | Too many DAGs/tasks/XComs; DB becomes the bottleneck for a large Airflow deployment |

---

## 5. Python — In Depth

### GIL (Global Interpreter Lock) — Precisely
Only one thread executes Python bytecode at a time *per process*. It does **not** mean threads are useless:
- I/O-bound work (network calls, file I/O, DB queries): the GIL is released during the underlying I/O wait, so `threading` still gives real concurrency benefit
- CPU-bound work (heavy computation, parsing, hashing): threads don't help — use `multiprocessing` (separate processes, separate GILs) or push the work to a lower-level library that releases the GIL internally (NumPy, Spark)

```python
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

# I/O-bound: threads work well
with ThreadPoolExecutor(max_workers=20) as ex:
    results = list(ex.map(fetch_url, urls))

# CPU-bound: use processes
with ProcessPoolExecutor(max_workers=4) as ex:
    results = list(ex.map(cpu_heavy_fn, data_chunks))
```

### `asyncio` — What Actually Happens
A single-threaded **event loop** runs coroutines cooperatively — a coroutine yields control (via `await`) at I/O points, letting the loop run other coroutines while waiting. Nothing runs in true parallel; it's concurrency via cooperative scheduling, ideal for many concurrent I/O-bound tasks (thousands of open connections) with lower overhead than one-thread-per-task.

```python
import asyncio

async def fetch(session, url):
    async with session.get(url) as resp:
        return await resp.json()

async def main(urls):
    async with aiohttp.ClientSession() as session:
        return await asyncio.gather(*(fetch(session, u) for u in urls))
```
**Trap to call out:** a blocking call (`time.sleep`, `requests.get`, heavy CPU work) inside an `async def` blocks the *entire event loop*, stalling every other coroutine — must use async-native libraries (`aiohttp`, `asyncpg`) or offload to a thread pool (`loop.run_in_executor`).

### Generators & Memory Efficiency
```python
def read_large_file(path):
    with open(path) as f:
        for line in f:
            yield process(line)     # lazy — one line in memory at a time, not the whole file
```
Generators matter for ETL: streaming millions of API/file records through a pipeline without loading everything into memory at once.

### Decorators (commonly asked to write live)
```python
import functools
import time

def timing(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.perf_counter() - start:.3f}s")
        return result
    return wrapper
```
`functools.wraps` preserves the original function's name/docstring — omitting it is a common subtle bug interviewers check for.

### Context Managers (resource safety — DB/file connections)
```python
class DBConnection:
    def __enter__(self):
        self.conn = create_connection()
        return self.conn
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.conn.close()
        return False   # don't suppress exceptions

with DBConnection() as conn:
    conn.execute(query)
```
Guarantees cleanup (closing connections/files) even if an exception occurs mid-block — critical in long-running ETL jobs that open many resources.

### Memory Management Basics
- CPython uses **reference counting** + a **cycle-detecting garbage collector** for reference cycles reference counting alone can't clean up
- Large in-memory data structures (huge lists/dicts of records) are a common ETL memory blowup — prefer generators/chunked processing, or push heavy transforms to Spark/DB instead of pure Python for large volumes

### Common Python Interview Depth Questions
- **Mutable default arguments** (`def f(x=[])`) — the list is created once at function definition time and shared across calls, a classic bug
- **Shallow vs deep copy** — `copy.copy()` vs `copy.deepcopy()`, matters when mutating nested structures
- **`is` vs `==`** — identity vs equality; small integers/strings may be cached (interned) by CPython, causing `is` to "work" by coincidence — never rely on it for value comparison

---

## 6. ETL Job Design

### Idempotency at the Job Level (recap + deeper)
An ETL job should be safe to re-run for the same window without side effects compounding — implemented via:
- **Overwrite by partition** (delete+insert or `INSERT OVERWRITE` for that date partition) rather than blind append
- **Merge/upsert** keyed on a natural or surrogate key
- **Idempotency/control table** tracking `(job, window, status)`

### Checkpointing
Long-running jobs should checkpoint progress (e.g., last successfully processed batch/offset) so a crash mid-job resumes from the checkpoint instead of restarting from zero — critical for very large or slow-source jobs.

### Job Failure Handling Strategy
```
Extract fails → don't touch target at all, retry extract
Transform fails on some records → quarantine bad records, continue with good ones (partial success)
Load fails mid-batch → rely on upsert/idempotent write + retry the whole batch safely
```
Decide explicitly: does a partial failure mean the whole job fails (strict correctness) or does it proceed with what succeeded plus a quarantine/alert (availability-favoring)? This is a business decision, not just a technical one — say this explicitly in interviews.

### Data Quality Gates
```python
def validate_before_load(df):
    row_count = df.count()
    null_pct = df.filter(df["customer_id"].isNull()).count() / row_count
    assert null_pct < 0.01, f"Too many nulls: {null_pct:.2%}"
    assert row_count > MIN_EXPECTED_ROWS, "Suspiciously low row count — possible upstream failure"
```
Fail loudly and stop the pipeline (or quarantine) rather than silently loading bad/incomplete data downstream — a "silent failure" in a data pipeline (job succeeds, data is wrong) is worse than a loud one.

### Orchestrating Multi-Stage ETL (Airflow + Spark + a warehouse, tied together)
```
Airflow DAG:
  sensor (wait for source file/API readiness)
   → extract_task (pull API → land raw in S3)
   → spark_transform_task (Spark job reads raw, writes curated Parquet to S3)
   → load_task (warehouse bulk loads curated Parquet)
   → data_quality_task (row count / null checks against warehouse table)
   → notify_task (success/failure alert)
```
This is the canonical "explain your ETL stack" answer tying every tool in this note together into one coherent pipeline.

---

## 7. Monitoring & Observability

### The Three Pillars, Applied to Data Pipelines
| Pillar | ETL/pipeline example |
|---|---|
| Logs | Task-level stdout/stderr, structured JSON logs with a `run_id` for correlation |
| Metrics | Rows processed, job duration, consumer lag, error rate, freshness (time since last successful load) |
| Traces | Follow one record's journey from API pull → landing → transform → warehouse (less common in batch ETL, more relevant in service architectures) |

### Key Metrics to Actually Track in a Data Pipeline
- **Freshness**: time since the last successful load — the #1 metric stakeholders care about ("is the dashboard data current?")
- **Volume/row count anomalies**: today's load is 50% smaller/larger than the trailing average — often signals an upstream break, not a real business change
- **Latency/duration**: job runtime trending upward over time signals a scaling problem before it becomes an outage
- **Error rate**: failed records / total records per run
- **Consumer lag** (Kafka): growing lag = falling behind
- **Schema drift events**: unexpected new/missing fields detected

### Alerting Philosophy (depth signal)
- Alert on **symptoms that matter to someone** (data is stale, pipeline failed, SLA breached) — not on every possible internal metric (alert fatigue makes real alerts get ignored)
- Prefer **actionable** alerts — every alert should map to a runbook step, not just "something's wrong"
- Use different severities: page for "data is late/wrong right now," ticket/Slack for "trending in a bad direction, look tomorrow"

### Dashboards vs Alerts
Dashboards are for humans actively investigating; alerts are for the system telling you something needs attention *now*. Don't rely on someone staring at a dashboard to catch failures — a pipeline needs automated freshness/failure alerting regardless of dashboard existence.

### Health Checks & Synthetic Monitoring
For APIs/services: a `/health` endpoint that checks real dependencies (DB reachable, cache reachable), not just "process is running." For pipelines: a synthetic canary record pushed through the pipeline periodically to confirm end-to-end health independent of real traffic volume.

### Common Tools (know names + rough role, not deep expertise required)
| Tool | Role |
|---|---|
| Prometheus + Grafana | Metrics collection + dashboards/alerting |
| ELK / OpenSearch | Log aggregation and search |
| Datadog / New Relic | Full-stack APM (logs+metrics+traces combined, commercial) |
| Airflow UI / Astronomer | Pipeline-specific run history, task state, SLA misses |
| Great Expectations / dbt tests | Data-quality-specific validation and monitoring |

---

## 8. Linux — In Depth

### Process Management (frequent ETL debugging context)
```bash
ps aux | grep python          # list processes
top / htop                     # live resource usage
kill -15 <pid>                 # SIGTERM — graceful shutdown, process can clean up
kill -9 <pid>                  # SIGKILL — immediate, no cleanup, last resort
nohup python job.py &          # keep running after terminal closes
```
**Depth point:** always prefer `SIGTERM` (15) first — it lets the process catch the signal and clean up (close DB connections, flush buffers, commit final state); `SIGKILL` (9) can't be caught, risking corrupted state in an ETL job mid-write.

### File Descriptors & "Too Many Open Files"
```bash
ulimit -n                      # current open-file limit for the shell
lsof -p <pid> | wc -l          # count open file descriptors for a process
```
A common ETL production bug: a job opens many files/connections (e.g., one per API call or DB connection) without closing them, eventually hitting the OS file descriptor limit — symptoms look like random connection failures. Fix: always use context managers (`with open(...)`, connection pooling) to guarantee closure.

### Disk & I/O
```bash
df -h                          # disk space per filesystem
du -sh /path/*                 # size of each item in a directory
iostat -x 1                    # disk I/O stats, refreshed every second
```
Slow ETL jobs are sometimes disk-bound, not CPU-bound (e.g., writing many small files, or a spinning disk under heavy random I/O) — `iostat` distinguishes this from a CPU or network bottleneck.

### Memory Diagnostics
```bash
free -h                        # total/used/free memory
vmstat 1                       # memory + swap + CPU stats over time
```
If `si`/`so` (swap in/out) in `vmstat` are nonzero and climbing, the system is swapping — a major performance killer, common cause of a suddenly-slow job that used to run fine (data volume grew past available RAM).

### Networking Basics
```bash
netstat -tulnp                 # listening ports and owning processes (or `ss -tulnp` on modern systems)
curl -v https://api.example.com   # verbose — see the actual handshake/headers, useful for debugging API issues
telnet host port / nc -zv host port   # test raw TCP connectivity (is the port even reachable?)
dig api.example.com            # DNS resolution debugging
```
Debugging flow for "my API call is failing" from a Linux box: DNS resolves? (`dig`) → port reachable? (`nc -zv`) → TLS/handshake succeeding? (`curl -v`) → actual HTTP response/status? — isolates network-layer vs application-layer failure.

### Cron & Scheduling (legacy but still asked)
```bash
crontab -e
0 2 * * * /usr/bin/python3 /opt/etl/daily_job.py >> /var/log/etl.log 2>&1
```
Know the caveats vs Airflow: no built-in retry/backfill/dependency management, silent failures unless you build your own alerting on the log — this comparison itself is a good interview answer for "why would you use Airflow instead of cron?"

### Permissions (quick but sometimes tested)
```bash
chmod 750 script.sh            # owner: rwx, group: r-x, others: none
chown user:group file
```
`750` = read/write/execute for owner, read/execute for group, nothing for others — relevant when ETL scripts/config files (with credentials) must not be world-readable.

### Log Inspection Under Pressure (common live-debugging ask)
```bash
tail -f /var/log/app.log                 # live tail
grep -i "error" app.log | tail -50       # recent errors
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head   # top offenders pattern
journalctl -u myservice -f               # systemd service logs, live
```

### Environment & Process Isolation
```bash
env                              # show environment variables
export API_KEY=xxxx              # set for current shell/children
source venv/bin/activate         # Python virtualenv isolation
```
Depth point: a very common "why did it work on my machine but not in prod" bug is environment variable/dependency version drift — containers (Docker) exist largely to eliminate this class of failure by packaging the exact runtime environment.

---

## 9. Cross-Cutting Scenario Questions

### Scenario 1: "Design an end-to-end pipeline: ingest events from a third-party API, process at scale, and land in a warehouse — name every tool and why."
- **Airflow** DAG triggers on schedule → **Python** extraction task pulls paginated API data with retry/backoff → lands raw NDJSON in **S3**
- **Spark** job reads raw S3 data, cleans/dedupes/aggregates at scale (handles data skew, partitioning)
- Curated Parquet written back to S3, partitioned by date
- Warehouse (Snowflake/BigQuery) bulk-loads from S3
- **Monitoring**: Airflow SLA alerts on lateness, row-count/freshness checks as a data-quality gate task, Prometheus/Grafana or Datadog dashboards for job duration trends
- If the source is high-volume/continuous rather than batch-friendly: swap the polling extraction for a **Kafka** consumer instead, with a streaming Spark job

### Scenario 2: "Your daily Airflow ETL job that used to take 20 minutes now takes 4 hours. Walk through your investigation."
1. Check Airflow task duration history — which specific task regressed (extract vs transform vs load)?
2. If Spark transform: check Spark UI — is there a skewed stage/straggler task, has data skew increased, is a broadcast join no longer fitting in memory as data grew, is there excessive shuffling?
3. If extraction: has the API gotten slower, are you hitting rate limits and backing off more, has data volume grown?
4. If load: is the warehouse doing row-by-row inserts, has the target table's indexing/partitioning strategy stopped matching the data pattern?
5. Check Linux-level resource metrics on the workers (`vmstat`/`iostat`) for swap/disk bottlenecks
6. Form a hypothesis, verify with data before changing anything (don't guess-and-check in prod)

### Scenario 3: "A Kafka consumer's lag is steadily climbing. Diagnose and fix."
- Is the consumer actually alive and committing offsets, or stuck/crashed (poison pill message, exception loop)?
- Is per-message processing too slow (a slow downstream DB write per message)? → batch writes instead of one-at-a-time
- Is producer throughput simply exceeding total consumer capacity? → scale consumers up to partition count, or increase partitions (with the ordering caveat)
- Check for rebalancing thrashing (processing time exceeding `max.poll.interval.ms`) causing repeated reassignment and wasted reprocessing

### Scenario 4: "How would you make an existing batch ETL pipeline near-real-time?"
- Identify what's actually driving the batch delay — usually the scheduling interval itself, not the processing logic
- Replace polling extraction with an event-driven trigger: **webhook** or **Kafka** stream from the source instead of a scheduled API pull
- Move from full-table Spark batch transforms to **Spark Structured Streaming** (micro-batch) or a lighter per-event transform
- Reconsider the warehouse load pattern — near-real-time usually means smaller, more frequent loads (or streaming inserts) rather than one big daily bulk load
- Discuss trade-off explicitly: added operational complexity (state management, exactly-once concerns, more moving parts) vs the actual business need for freshness — don't over-engineer if hourly batch would satisfy the requirement

### Scenario 5: "One of your Spark executors keeps OOM-crashing on a specific job. Diagnose."
- Check Spark UI: is one task/partition much larger than others (skew) causing that executor to hold disproportionate data?
- Is a `broadcast()` join being applied to a table too large to fit in executor memory?
- Is `.collect()` or `.toPandas()` being called on a large DataFrame, unintentionally pulling everything to the driver (different symptom: driver OOM, not executor)?
- Is caching (`df.cache()`) being applied too broadly, holding unnecessary data in memory across the job's lifetime?
- Fix candidates: repartition to fix skew, increase executor memory, enable AQE, salवt skewed keys, avoid unnecessary caching/collect

---

## 10. Rapid-Fire Q&A

**Q: Why can Kafka guarantee ordering only within a partition, not a whole topic?**
Because partitions are consumed independently and in parallel across a consumer group; enforcing global order across partitions would eliminate the parallelism that's the whole point of partitioning.

**Q: What's the practical difference between `coalesce` and `repartition` in Spark?**
`coalesce` merges partitions without a full shuffle (cheap, only reduces count); `repartition` always triggers a full shuffle (needed to increase partition count or fix skew/rebalance data).

**Q: Why is Airflow's `execution_date` often confusing?**
It represents the start of the data interval being processed, not the actual wall-clock time the DAG runs — a `@daily` run for date X actually executes after day X has fully completed.

**Q: Why should XComs not be used for large data?**
XCom values are stored in Airflow's metadata database, which isn't designed for large payloads — pass a reference (e.g., an S3 path) instead of the data itself.

**Q: What's the real difference between threading and multiprocessing in Python, given the GIL?**
Threading gives concurrency benefit for I/O-bound work because the GIL releases during I/O waits; it gives no benefit for CPU-bound work since only one thread executes Python bytecode at a time — multiprocessing sidesteps this with separate processes/GILs.

**Q: What causes Spark data skew and how do you fix it?**
An uneven key distribution (one key has far more rows than others) causes one task/partition to be a straggler; fixed via salting the key, using a broadcast join if one side is small, or enabling Adaptive Query Execution to split skewed partitions at runtime.

**Q: Why prefer SIGTERM over SIGKILL when stopping a running job?**
SIGTERM can be caught by the process to clean up (close connections, flush buffers, commit final state) before exiting; SIGKILL terminates immediately with no chance to clean up, risking corrupted or inconsistent state.

**Q: What's the danger of Kafka's `acks=1` vs `acks=all`?**
With `acks=1`, only the partition leader must acknowledge — if the leader crashes before followers replicate the message, it's lost even though the producer thought it succeeded; `acks=all` waits for in-sync replicas too, trading latency for durability.

**Q: Why does `catchup=True` in Airflow matter operationally?**
If a DAG was paused or the scheduler was down, resuming with `catchup=True` triggers a run for every missed interval at once — can overwhelm resources or a rate-limited source API if not anticipated; often `catchup=False` combined with a manual backfill command is safer.

**Q: What's the core reason a "job succeeded" doesn't guarantee "data is correct" in ETL?**
Silent data loss (e.g., a join dropping unmatched rows, a filter too aggressive, an API returning a partial/truncated page without erroring) can make a job complete successfully while producing wrong or incomplete output — which is why explicit data-quality checks (row counts, null rates, checksums) are a required pipeline stage, not optional.

**Q: Why does swap usage (`si`/`so` in `vmstat`) matter for a suddenly-slow ETL job?**
Swapping means the OS is paging memory to disk because physical RAM is exhausted — disk is orders of magnitude slower than RAM, so any job that starts swapping degrades sharply; this often signals data volume has outgrown the machine's allocated memory.

---

### Quick Prep Tip
For this round, always connect the tool to the **failure mode and the trade-off**, not just "what it does." Interviewers are listening for: *"I chose X over Y because of Z trade-off, and here's what breaks if the assumption behind that choice stops holding."*
