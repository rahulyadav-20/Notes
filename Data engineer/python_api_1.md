# API Data Ingestion — Database, Data Warehouse & Cloud Storage (Interview Notes)

> Covers: ingestion theory, batch vs streaming, loading into databases/warehouses/cloud storage, coding patterns, and scenario-based interview questions.

---

## Table of Contents
1. [Data Ingestion Fundamentals](#1-data-ingestion-fundamentals)
2. [Ingestion Patterns & Architecture](#2-ingestion-patterns--architecture)
3. [Pulling Data from APIs Reliably](#3-pulling-data-from-apis-reliably)
4. [Loading into Relational Databases](#4-loading-into-relational-databases)
5. [Loading into NoSQL Databases](#5-loading-into-nosql-databases)
6. [Loading into Data Warehouses](#6-loading-into-data-warehouses)
7. [Loading into Cloud Storage](#7-loading-into-cloud-storage)
8. [Orchestration & Scheduling](#8-orchestration--scheduling)
9. [Streaming Ingestion](#9-streaming-ingestion)
10. [Data Quality, Idempotency & Schema Evolution](#10-data-quality-idempotency--schema-evolution)
11. [Coding Interview Questions](#11-coding-interview-questions)
12. [Scenario-Based Design Questions](#12-scenario-based-design-questions)
13. [Rapid-Fire Theory Q&A](#13-rapid-fire-theory-qa)
14. [Best Practices Checklist](#14-best-practices-checklist)

---

## 1. Data Ingestion Fundamentals

### What is Data Ingestion?
The process of pulling data from a source (API, file, database, event stream) and moving it into a target storage system (database, warehouse, data lake) for storage, analysis, or downstream processing.

### ETL vs ELT (very common interview question)
| | ETL | ELT |
|---|---|---|
| Order | Extract → **Transform** → Load | Extract → Load → **Transform** |
| Where transform happens | In a separate processing engine before loading | Inside the target warehouse (SQL/dbt) |
| Best for | Legacy systems, smaller data, strict schemas | Modern cloud warehouses (Snowflake, BigQuery) with cheap compute/storage |
| Tooling | Informatica, Talend, custom Python | Fivetran/Airbyte + dbt |

### Batch vs Streaming vs Micro-batch
| Mode | Description | Example |
|---|---|---|
| Batch | Data pulled/loaded on a schedule (hourly/daily) | Nightly API pull into a warehouse table |
| Streaming | Continuous, event-by-event ingestion | Kafka consumer writing to a DB in real time |
| Micro-batch | Small time-windowed batches, near-real-time | Spark Structured Streaming every 30s |

### Push vs Pull Ingestion
- **Pull**: your system calls the API on a schedule (polling) — simplest, but has latency and can hit rate limits
- **Push**: the source sends data to you (webhooks, event streams) — lower latency, but you must expose a reliable receiving endpoint

---

## 2. Ingestion Patterns & Architecture

### Typical Pipeline Stages
```
API Source
   │
   ▼
Extract (paginated HTTP calls, auth, retries)
   │
   ▼
Raw / Landing Zone  (cloud storage — S3/GCS, as JSON/Parquet, immutable)
   │
   ▼
Staging (load raw into DB/warehouse staging tables, minimal transform)
   │
   ▼
Transform (clean, dedupe, join, type-cast — SQL/dbt/Spark)
   │
   ▼
Curated / Warehouse Tables (used by BI, ML, applications)
```

### Why land raw data first (very common "why" interview question)
- **Replayability**: if a downstream transform has a bug, you can reprocess from raw data instead of re-calling the API (which may have rate limits, or the data may have changed/expired)
- **Auditability**: you keep an unaltered copy of exactly what the source returned
- **Decoupling**: extraction and transformation can fail/scale independently

### Full Load vs Incremental Load
| Type | Description | When to use |
|---|---|---|
| Full load | Pull the entire dataset every run | Small datasets, no reliable "updated_at" field |
| Incremental load | Pull only new/changed records since last run | Large datasets, API supports filtering by timestamp/cursor |

Incremental strategies:
- **Timestamp-based**: `GET /orders?updated_after=2026-08-11T00:00:00Z`
- **Cursor/token-based**: API returns a `next_cursor`, store it, resume from there next run
- **Change Data Capture (CDC)**: for DB sources — read the transaction log (Debezium) instead of querying the table

---

## 3. Pulling Data from APIs Reliably

### Handling Pagination During Ingestion
```python
import requests
import time

def fetch_all_pages(base_url, headers, page_size=100):
    all_records = []
    cursor = None
    while True:
        params = {"limit": page_size}
        if cursor:
            params["cursor"] = cursor

        resp = requests.get(base_url, headers=headers, params=params, timeout=10)
        resp.raise_for_status()
        payload = resp.json()

        all_records.extend(payload["data"])
        cursor = payload.get("next_cursor")

        if not cursor:
            break
        time.sleep(0.2)   # be polite / respect rate limits

    return all_records
```

### Handling Rate Limits Gracefully During Bulk Ingestion
```python
import requests
import time

def get_with_rate_limit_handling(url, headers, max_retries=5):
    for attempt in range(max_retries):
        resp = requests.get(url, headers=headers, timeout=10)
        if resp.status_code == 429:
            retry_after = int(resp.headers.get("Retry-After", 2 ** attempt))
            time.sleep(retry_after)
            continue
        resp.raise_for_status()
        return resp.json()
    raise RuntimeError("Max retries exceeded due to rate limiting")
```

### Incremental Extraction with a Watermark (very common real pattern)
```python
import json
from pathlib import Path

WATERMARK_FILE = Path("watermark.json")

def get_watermark():
    if WATERMARK_FILE.exists():
        return json.loads(WATERMARK_FILE.read_text())["last_updated_at"]
    return "1970-01-01T00:00:00Z"

def set_watermark(value):
    WATERMARK_FILE.write_text(json.dumps({"last_updated_at": value}))

def incremental_pull():
    last_ts = get_watermark()
    resp = requests.get(
        "https://api.example.com/orders",
        params={"updated_after": last_ts, "limit": 500},
        timeout=10
    )
    resp.raise_for_status()
    records = resp.json()["data"]
    if records:
        max_ts = max(r["updated_at"] for r in records)
        set_watermark(max_ts)
    return records
```
*In production the watermark is stored in a DB table or a metadata store (e.g., Airflow Variables, DynamoDB), not a local file — needed for durability across runs/containers.*

---

## 4. Loading into Relational Databases

### Using SQLAlchemy (common ORM ingestion pattern)
```python
from sqlalchemy import create_engine, text
import pandas as pd

engine = create_engine("postgresql://user:pass@host:5432/mydb")

def load_to_postgres(records: list[dict], table_name: str):
    df = pd.DataFrame(records)
    df.to_sql(table_name, engine, if_exists="append", index=False, method="multi", chunksize=1000)
```

### Bulk Insert (faster than row-by-row `INSERT`)
```python
import psycopg2
from psycopg2.extras import execute_values

def bulk_insert_postgres(records: list[dict], table: str, conn_params: dict):
    conn = psycopg2.connect(**conn_params)
    cur = conn.cursor()
    columns = records[0].keys()
    values = [[r[c] for c in columns] for r in records]

    query = f"INSERT INTO {table} ({', '.join(columns)}) VALUES %s"
    execute_values(cur, query, values, page_size=1000)
    conn.commit()
    cur.close()
    conn.close()
```

### Upsert (idempotent load — critical for re-runnable pipelines)
```python
def upsert_postgres(records: list[dict], table: str, conn_params: dict, conflict_key="id"):
    conn = psycopg2.connect(**conn_params)
    cur = conn.cursor()
    columns = list(records[0].keys())
    update_cols = [c for c in columns if c != conflict_key]

    query = f"""
        INSERT INTO {table} ({', '.join(columns)})
        VALUES %s
        ON CONFLICT ({conflict_key})
        DO UPDATE SET {', '.join(f"{c} = EXCLUDED.{c}" for c in update_cols)}
    """
    values = [[r[c] for c in columns] for r in records]
    execute_values(cur, query, values)
    conn.commit()
    cur.close()
    conn.close()
```

### MySQL Upsert Equivalent
```python
query = f"""
    INSERT INTO {table} ({', '.join(columns)})
    VALUES ({', '.join(['%s'] * len(columns))})
    ON DUPLICATE KEY UPDATE {', '.join(f"{c}=VALUES({c})" for c in update_cols)}
"""
```

---

## 5. Loading into NoSQL Databases

### MongoDB (bulk upsert)
```python
from pymongo import MongoClient, UpdateOne

client = MongoClient("mongodb://localhost:27017")
collection = client["mydb"]["orders"]

def upsert_mongo(records: list[dict]):
    operations = [
        UpdateOne({"_id": r["id"]}, {"$set": r}, upsert=True)
        for r in records
    ]
    if operations:
        result = collection.bulk_write(operations)
        return result.upserted_count, result.modified_count
```

### DynamoDB (batch write)
```python
import boto3

dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
table = dynamodb.Table("orders")

def batch_write_dynamo(records: list[dict]):
    with table.batch_writer(overwrite_by_pkeys=["id"]) as batch:
        for r in records:
            batch.put_item(Item=r)
```

### Redis (caching layer, not primary store — common follow-up)
```python
import redis
import json

r = redis.Redis(host="localhost", port=6379, db=0)

def cache_api_response(key: str, data: dict, ttl_seconds=300):
    r.setex(key, ttl_seconds, json.dumps(data))
```

---

## 6. Loading into Data Warehouses

### Snowflake
```python
import snowflake.connector
import pandas as pd
from snowflake.connector.pandas_tools import write_pandas

conn = snowflake.connector.connect(
    user="USER", password="PASS", account="ACCOUNT",
    warehouse="WH", database="DB", schema="SCHEMA"
)

def load_to_snowflake(records: list[dict], table_name: str):
    df = pd.DataFrame(records)
    success, num_chunks, num_rows, _ = write_pandas(conn, df, table_name)
    return success, num_rows
```

### BigQuery
```python
from google.cloud import bigquery

client = bigquery.Client()

def load_to_bigquery(records: list[dict], table_id: str):
    job_config = bigquery.LoadJobConfig(
        write_disposition="WRITE_APPEND",
        autodetect=True,
        source_format=bigquery.SourceFormat.NEWLINE_DELIMITED_JSON,
    )
    job = client.load_table_from_json(records, table_id, job_config=job_config)
    job.result()   # wait for completion
    return job.output_rows
```

### Redshift (via COPY from S3 — the standard high-volume pattern)
```python
import psycopg2

def copy_from_s3_to_redshift(conn_params, table, s3_path, iam_role):
    conn = psycopg2.connect(**conn_params)
    cur = conn.cursor()
    cur.execute(f"""
        COPY {table}
        FROM '{s3_path}'
        IAM_ROLE '{iam_role}'
        FORMAT AS JSON 'auto'
        TIMEFORMAT 'auto';
    """)
    conn.commit()
    cur.close()
    conn.close()
```
**Key interview point:** for warehouses, don't do row-by-row `INSERT` at scale. Land files in cloud storage (S3/GCS) first, then use the warehouse's native bulk loader (`COPY`, `write_pandas`, `load_table_from_json`) — far faster and cheaper than per-row API/SQL calls.

---

## 7. Loading into Cloud Storage

### AWS S3 (boto3)
```python
import boto3
import json
from datetime import datetime

s3 = boto3.client("s3")

def upload_json_to_s3(records: list[dict], bucket: str, prefix: str):
    ts = datetime.utcnow().strftime("%Y/%m/%d/%H%M%S")
    key = f"{prefix}/{ts}.json"
    body = "\n".join(json.dumps(r) for r in records)   # newline-delimited JSON
    s3.put_object(Bucket=bucket, Key=key, Body=body.encode("utf-8"))
    return key
```

### Writing Partitioned Parquet to S3 (efficient for warehouse querying later)
```python
import pandas as pd

def save_partitioned_parquet(records: list[dict], base_path: str, partition_col="event_date"):
    df = pd.DataFrame(records)
    df.to_parquet(
        base_path,
        partition_cols=[partition_col],
        engine="pyarrow"
    )
    # base_path can be a local dir or an s3:// path (with s3fs installed)
```

### Google Cloud Storage
```python
from google.cloud import storage
import json

def upload_json_to_gcs(records: list[dict], bucket_name: str, blob_path: str):
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_path)
    body = "\n".join(json.dumps(r) for r in records)
    blob.upload_from_string(body, content_type="application/json")
```

### Azure Blob Storage
```python
from azure.storage.blob import BlobServiceClient
import json

def upload_json_to_azure(records: list[dict], connection_string, container, blob_name):
    service = BlobServiceClient.from_connection_string(connection_string)
    blob_client = service.get_blob_client(container=container, blob=blob_name)
    body = "\n".join(json.dumps(r) for r in records)
    blob_client.upload_blob(body, overwrite=True)
```

### File Formats Comparison (frequently asked)
| Format | Type | Compression | Best for |
|---|---|---|---|
| CSV | Row-based, text | Low | Simple exports, human-readable |
| JSON / NDJSON | Row-based, text | Low | Semi-structured API data, nested fields |
| Parquet | Columnar, binary | High | Warehouse queries, analytics (reads only needed columns) |
| Avro | Row-based, binary | Medium | Schema evolution, streaming (Kafka) |
| ORC | Columnar, binary | High | Hive/Spark ecosystems |

**Why Parquet for analytics:** columnar storage means a query scanning 3 of 50 columns only reads those 3 columns' data — massive I/O savings vs row-based formats.

---

## 8. Orchestration & Scheduling

### Why Orchestration Tools (Airflow, Prefect, Dagster) Matter
- Manage **dependencies** between tasks (extract → land → load → transform)
- **Retry** failed tasks automatically
- **Alerting** on failures (Slack/email)
- **Backfilling** historical runs
- Centralized **scheduling** and monitoring/logging

### Simple Airflow DAG for API Ingestion
```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

default_args = {
    "retries": 3,
    "retry_delay": timedelta(minutes=5),
}

def extract_task(**kwargs):
    records = fetch_all_pages(...)
    kwargs["ti"].xcom_push(key="records", value=records)

def load_task(**kwargs):
    records = kwargs["ti"].xcom_pull(key="records", task_ids="extract")
    upsert_postgres(records, "orders", conn_params)

with DAG(
    "api_ingestion_pipeline",
    default_args=default_args,
    schedule_interval="@hourly",
    start_date=datetime(2026, 1, 1),
    catchup=False,
) as dag:
    extract = PythonOperator(task_id="extract", python_callable=extract_task)
    load = PythonOperator(task_id="load", python_callable=load_task)
    extract >> load
```

### Idempotent DAG Design (interview favorite)
Every task should be safe to re-run without creating duplicates or corrupting state — achieved via upserts, partition overwrites (`WRITE_TRUNCATE` on a specific partition), or watermark-based extraction that doesn't double-count.

---

## 9. Streaming Ingestion

### Kafka Producer (API → Kafka)
```python
from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

def publish_record(topic: str, record: dict):
    producer.send(topic, value=record)
    producer.flush()
```

### Kafka Consumer (Kafka → Database)
```python
from kafka import KafkaConsumer
import json

consumer = KafkaConsumer(
    "orders_topic",
    bootstrap_servers="localhost:9092",
    value_deserializer=lambda m: json.loads(m.decode("utf-8")),
    auto_offset_reset="earliest",
    enable_auto_commit=False,
    group_id="orders_ingestion_group"
)

def consume_and_load():
    batch = []
    for message in consumer:
        batch.append(message.value)
        if len(batch) >= 500:
            upsert_postgres(batch, "orders", conn_params)
            consumer.commit()   # commit offset only after successful write
            batch = []
```
**Key point:** commit the Kafka offset **after** the DB write succeeds (at-least-once delivery) — committing before risks losing data on crash; committing too eagerly with auto-commit can silently drop messages.

### Webhooks as a Streaming Ingestion Source
```python
from fastapi import FastAPI, Request, BackgroundTasks

app = FastAPI()

@app.post("/webhooks/orders")
async def receive_webhook(request: Request, background_tasks: BackgroundTasks):
    payload = await request.json()
    background_tasks.add_task(process_and_store, payload)
    return {"status": "received"}, 200   # ack immediately, process async
```
Always **acknowledge fast** (2xx within a few seconds) and process asynchronously — most webhook providers retry aggressively if you're slow, causing duplicate deliveries.

---

## 10. Data Quality, Idempotency & Schema Evolution

### Deduplication on Load
```python
def dedupe_records(records: list[dict], key="id") -> list[dict]:
    seen = {}
    for r in records:
        seen[r[key]] = r   # last write wins — keeps most recent occurrence
    return list(seen.values())
```

### Schema Validation Before Load (Pydantic)
```python
from pydantic import BaseModel, ValidationError

class OrderRecord(BaseModel):
    id: int
    customer_id: int
    amount: float
    status: str

def validate_records(records: list[dict]) -> tuple[list[dict], list[dict]]:
    valid, invalid = [], []
    for r in records:
        try:
            OrderRecord(**r)
            valid.append(r)
        except ValidationError as e:
            invalid.append({"record": r, "error": str(e)})
    return valid, invalid
```

### Handling Schema Drift (API adds/removes/renames fields — very common real issue)
- Land raw JSON as-is in cloud storage (schema-on-read) so nothing is lost even if it doesn't fit today's table schema
- Use `autodetect`/schema merging on load (BigQuery `autodetect=True`, Spark `mergeSchema`)
- Add new columns as `NULLABLE` so old rows aren't broken
- Track schema versions; alert when an unexpected new field appears

### Idempotency Key Pattern for Ingestion Jobs
Store `(source, extraction_window, status)` in a control table so a re-run of the same job for the same window doesn't duplicate data:
```sql
CREATE TABLE ingestion_runs (
    source VARCHAR,
    window_start TIMESTAMP,
    window_end TIMESTAMP,
    status VARCHAR,   -- 'running' | 'success' | 'failed'
    row_count INT,
    PRIMARY KEY (source, window_start)
);
```

---

## 11. Coding Interview Questions

### Q1: Write a function that ingests paginated API data and loads it into Postgres in batches, handling partial failures
```python
def ingest_and_load(base_url, headers, table, conn_params, batch_size=500):
    cursor = None
    total_loaded = 0
    while True:
        params = {"limit": batch_size}
        if cursor:
            params["cursor"] = cursor
        resp = requests.get(base_url, headers=headers, params=params, timeout=10)
        resp.raise_for_status()
        payload = resp.json()
        records = payload["data"]

        if records:
            try:
                upsert_postgres(records, table, conn_params)
                total_loaded += len(records)
            except Exception as e:
                # log and continue, or write failed batch to a dead-letter location
                log_failed_batch(records, e)

        cursor = payload.get("next_cursor")
        if not cursor:
            break
    return total_loaded
```

### Q2: Implement exactly-once-ish loading using an idempotency/control table
```python
def run_ingestion_window(source, window_start, window_end, conn):
    cur = conn.cursor()
    cur.execute(
        "SELECT status FROM ingestion_runs WHERE source=%s AND window_start=%s",
        (source, window_start)
    )
    row = cur.fetchone()
    if row and row[0] == "success":
        return "already processed, skipping"

    cur.execute(
        """INSERT INTO ingestion_runs (source, window_start, window_end, status)
           VALUES (%s,%s,%s,'running')
           ON CONFLICT (source, window_start) DO UPDATE SET status='running'""",
        (source, window_start, window_end)
    )
    conn.commit()

    try:
        records = fetch_window(source, window_start, window_end)
        upsert_postgres(records, "orders", conn_params)
        cur.execute(
            "UPDATE ingestion_runs SET status='success', row_count=%s WHERE source=%s AND window_start=%s",
            (len(records), source, window_start)
        )
    except Exception:
        cur.execute(
            "UPDATE ingestion_runs SET status='failed' WHERE source=%s AND window_start=%s",
            (source, window_start)
        )
        raise
    conn.commit()
```

### Q3: Write a generator to stream large API results without loading everything into memory
```python
def stream_records(base_url, headers, page_size=500):
    cursor = None
    while True:
        params = {"limit": page_size}
        if cursor:
            params["cursor"] = cursor
        resp = requests.get(base_url, headers=headers, params=params, timeout=10)
        resp.raise_for_status()
        payload = resp.json()
        for record in payload["data"]:
            yield record
        cursor = payload.get("next_cursor")
        if not cursor:
            return

# Usage: process/write in chunks without holding the full dataset in memory
buffer = []
for rec in stream_records(url, headers):
    buffer.append(rec)
    if len(buffer) >= 1000:
        upsert_postgres(buffer, "orders", conn_params)
        buffer = []
if buffer:
    upsert_postgres(buffer, "orders", conn_params)
```

### Q4: Detect and quarantine malformed records during ingestion
```python
def ingest_with_quarantine(records, schema_model, s3_bucket, quarantine_prefix):
    valid, invalid = validate_records(records)  # from Section 10
    if invalid:
        upload_json_to_s3(invalid, s3_bucket, quarantine_prefix)
    return valid, len(invalid)
```

### Q5: Merge/upsert a batch of records into a warehouse table using a staging table (common SQL pattern)
```python
def merge_via_staging(conn, records, staging_table, target_table, key="id"):
    df = pd.DataFrame(records)
    df.to_sql(staging_table, conn, if_exists="replace", index=False)

    cols = list(df.columns)
    update_set = ", ".join(f"{c} = s.{c}" for c in cols if c != key)
    insert_cols = ", ".join(cols)
    insert_vals = ", ".join(f"s.{c}" for c in cols)

    merge_sql = f"""
        MERGE INTO {target_table} t
        USING {staging_table} s
        ON t.{key} = s.{key}
        WHEN MATCHED THEN UPDATE SET {update_set}
        WHEN NOT MATCHED THEN INSERT ({insert_cols}) VALUES ({insert_vals});
    """
    conn.execute(text(merge_sql))
```

---

## 12. Scenario-Based Design Questions

### Scenario 1: "Design a pipeline to ingest data from a rate-limited third-party API into a data warehouse daily"
1. **Extract**: scheduled job (Airflow) calls API with pagination + exponential backoff on 429s, respects `Retry-After`
2. **Land**: write raw NDJSON to S3 partitioned by `dt=YYYY-MM-DD` (immutable, replayable)
3. **Stage**: warehouse loads raw files via native bulk loader (`COPY`/`load_table_from_json`) into a staging table
4. **Transform**: dbt/SQL model dedupes, casts types, joins reference data → curated table
5. **Validate**: row count checks, null checks, schema checks before marking the run successful
6. **Observability**: alert on failures, track SLA (data must land by X AM)

### Scenario 2: "The API only returns the last 30 days of data, but you need full history — how do you not lose data?"
- Run ingestion frequently enough (e.g., daily) that the 30-day window always overlaps with the last successful run
- Store every raw pull as an **immutable, timestamped snapshot** in cloud storage — never overwrite
- Load incrementally into the warehouse with **upsert** semantics so re-fetched overlapping records just update, not duplicate
- If a gap is ever missed (outage > 30 days), you can't recover that data from the API — mitigate by keeping ingestion highly available and alerting fast on failures

### Scenario 3: "How would you ingest data from an API that has no updated_at field and no pagination cursor for changes?"
- Fall back to **full snapshot loads**: pull the entire dataset each run
- Land each snapshot separately in cloud storage (`dt=2026-08-12/full.json`)
- Compute a **diff** between today's and yesterday's snapshot (hash each record, compare) to detect inserts/updates/deletes for the warehouse (this is essentially manual CDC)

### Scenario 4: "Design ingestion for a source that pushes data via webhooks, at high, bursty volume"
- Webhook endpoint does minimal work: validate signature, **enqueue** the raw payload (SQS/Kafka), return `200` immediately
- A separate consumer/worker pool processes the queue asynchronously, decoupling ingestion rate from processing rate
- Use dead-letter queues for payloads that repeatedly fail processing
- Autoscale consumers based on queue depth

### Scenario 5: "How do you handle a breaking schema change from the API mid-pipeline?"
- Since raw data was landed as-is (schema-on-read), nothing is lost even if the new field breaks the strict-schema warehouse table
- Add monitoring that diffs the observed JSON schema against the expected one and pages the team when it changes
- Evolve the warehouse table (`ALTER TABLE ADD COLUMN ... NULLABLE`) and re-run the transform layer against already-landed raw data — no need to re-call the API

### Scenario 6: "Data warehouse costs are spiking from this ingestion job — what do you check?"
- Are you using `SELECT *` / row-based formats instead of Parquet + column pruning?
- Are you doing row-by-row inserts instead of bulk `COPY`/staging-table merges?
- Is the table partitioned/clustered appropriately so incremental loads only touch relevant partitions?
- Is compute (e.g., Snowflake warehouse size) oversized for the job, or running longer than needed due to inefficient joins?

---

## 13. Rapid-Fire Theory Q&A

**Q: Why land raw data before transforming it?**
For replayability, auditability, and to decouple extraction (which can hit rate limits/downtime) from transformation logic that may need to change or be re-run.

**Q: What's the difference between a data lake and a data warehouse?**
A data lake stores raw, often unstructured/semi-structured data cheaply (schema-on-read, e.g., S3). A data warehouse stores structured, curated, query-optimized data (schema-on-write, e.g., Snowflake/BigQuery) for analytics.

**Q: What is CDC (Change Data Capture)?**
A technique to capture row-level inserts/updates/deletes from a source database's transaction log (e.g., via Debezium) instead of repeatedly querying the whole table — efficient for near-real-time replication.

**Q: Why use Parquet over CSV/JSON for warehouse-bound data?**
Parquet is columnar and compressed, so analytical queries that touch a subset of columns read far less data — much faster and cheaper to query than row-based text formats.

**Q: What does "idempotent ingestion" mean and why is it critical?**
Running the same ingestion job twice (e.g., after a retry or backfill) produces the same end state, not duplicated data — achieved via upserts, partition overwrites, or watermark/control tables.

**Q: Explain at-least-once vs exactly-once vs at-most-once delivery.**
- At-most-once: message may be lost, never duplicated
- At-least-once: message is never lost, but may be duplicated (most common — combined with idempotent writes to approximate exactly-once)
- Exactly-once: message processed precisely once — hard to guarantee end-to-end, usually achieved via idempotency + transactional writes, not true exactly-once delivery

**Q: What's a watermark in the context of ingestion?**
A stored checkpoint (usually a timestamp or cursor) marking how far a pipeline has successfully processed, so the next run knows where to resume incrementally.

**Q: Why use a staging table before merging into a target warehouse table?**
Bulk-load raw data quickly into staging (no constraints, fast load), then run a single `MERGE`/`UPSERT` SQL statement against the target — much faster than row-by-row updates and keeps the target table's constraints/indexes intact during load.

**Q: How do you avoid losing data if your ingestion job crashes mid-run?**
Design for idempotency (safe to re-run), commit progress incrementally (watermarks per micro-batch, not just at the end), and use a control/state table to know exactly what succeeded before the crash.

**Q: What's the difference between `WRITE_APPEND`, `WRITE_TRUNCATE`, and `WRITE_EMPTY` (BigQuery load semantics — but concept is universal)?**
- Append: add new rows to existing table
- Truncate: replace all existing data (often per-partition for incremental-but-idempotent full refresh of a day's data)
- Empty: only load if the table is currently empty (safety check)

**Q: How would you handle PII in data being ingested from an API?**
Mask/tokenize/hash sensitive fields before landing in shared storage, apply column-level access controls in the warehouse, and ensure encryption at rest and in transit; also check data retention/compliance requirements (GDPR right-to-delete etc.).

**Q: What's backfilling, and why is it tricky?**
Re-running a pipeline for historical date ranges (e.g., to fix a bug or add a new column). Tricky because: source API may not support historical windows, rate limits make large backfills slow, and it must not duplicate data already loaded — idempotent design solves this.

---

## 14. Best Practices Checklist

- [ ] Land raw data immutably in cloud storage before transforming
- [ ] Use incremental extraction (watermark/cursor) instead of full pulls when possible
- [ ] Always set timeouts + retries with backoff on API calls
- [ ] Respect `Retry-After` / rate-limit headers during bulk ingestion
- [ ] Use bulk loaders (`COPY`, `write_pandas`, staging + `MERGE`) — avoid row-by-row inserts at scale
- [ ] Make every ingestion job idempotent (safe to re-run)
- [ ] Validate schema/data quality before loading into curated tables
- [ ] Use columnar formats (Parquet) for warehouse-bound data
- [ ] Track ingestion runs in a control/metadata table
- [ ] Alert on failures, schema drift, and SLA breaches
- [ ] Partition storage/tables by date for efficient incremental processing
- [ ] Keep secrets (API keys, DB creds) out of code — use a secrets manager
- [ ] Document data lineage (source → raw → staging → curated)

---

### Quick Prep Tip
When asked "design an ingestion pipeline for X" in an interview, structure your answer as:
1. **Source characteristics** (rate limits, pagination, auth, full vs incremental support)
2. **Landing strategy** (raw storage format, partitioning)
3. **Loading strategy** (bulk loader, staging + merge, idempotency)
4. **Orchestration** (schedule, retries, dependencies)
5. **Data quality & monitoring** (validation, alerting, schema drift handling)
6. **Failure/scale considerations** (what breaks first, backfill strategy)
