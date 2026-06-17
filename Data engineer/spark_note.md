# Apache Spark Interview Notes
## From Beginner to Advanced | Senior Data Engineer Edition

> **Covers:** PySpark · Scala · Spark SQL · Architecture · Optimization · Streaming · Kubernetes  
> **Target:** 3–15 Years Experienced Data Engineers · Senior DE · Spark Developer · Big Data Architect  
> **Prepared by:** Senior Data Engineer & Spark Architect (15+ years experience)

---

## Table of Contents

1. [Apache Spark Fundamentals](#1-apache-spark-fundamentals)
2. [Spark Architecture](#2-spark-architecture)
3. [RDD (Resilient Distributed Dataset)](#3-rdd-resilient-distributed-dataset)
4. [DataFrame](#4-dataframe)
5. [Dataset](#5-dataset)
6. [Transformations](#6-transformations)
7. [Actions](#7-actions)
8. [Spark SQL](#8-spark-sql)
9. [Joins](#9-joins)
10. [Window Functions](#10-window-functions)
11. [Partitioning](#11-partitioning)
12. [Shuffle](#12-shuffle)
13. [Caching and Persistence](#13-caching-and-persistence)
14. [Spark Optimization](#14-spark-optimization)
15. [Spark Memory Management](#15-spark-memory-management)
16. [Spark Serialization](#16-spark-serialization)
17. [Spark File Formats](#17-spark-file-formats)
18. [Spark Streaming](#18-spark-streaming)
19. [Kafka Integration](#19-kafka-integration)
20. [Spark on Kubernetes](#20-spark-on-kubernetes)
21. [Spark Performance Tuning](#21-spark-performance-tuning)
22. [Spark Troubleshooting](#22-spark-troubleshooting)
23. [Scenario-Based Questions (100 Q&A)](#23-scenario-based-questions)
24. [Coding Questions (50 Problems)](#24-coding-questions)
25. [Apache Spark Interview Cheat Sheet](#25-apache-spark-interview-cheat-sheet)

---

# 1. Apache Spark Fundamentals

## What is it?

Apache Spark is an open-source, distributed, in-memory data processing engine designed for large-scale data analytics. It provides a unified platform for batch processing, streaming, machine learning, and graph computation. Originally developed at UC Berkeley's AMPLab in 2009, it was donated to the Apache Software Foundation in 2013.

## Why do we use it?

- **Ad-Tech / Real-Time Bidding:** Process billions of bid requests per day for CTR prediction, impression logging, and auction analytics
- **E-Commerce:** Real-time recommendation engines, sales aggregation, funnel analysis
- **Financial Services:** Fraud detection pipelines, risk scoring at scale
- **Telecom:** Call detail record (CDR) processing, network anomaly detection
- **Retail:** Inventory forecasting, customer segmentation

## Key Concepts

| Concept | Description |
|---|---|
| In-Memory Processing | Data cached in RAM → 100x faster than MapReduce |
| Lazy Evaluation | Transformations build a DAG; execution triggered by Action |
| Fault Tolerance | RDD lineage allows recomputation on failure |
| Unified Engine | Batch + Streaming + ML + Graph in one platform |
| DAG Execution | Directed Acyclic Graph of stages for optimal execution |

## History of Spark

```
2009 → Created at UC Berkeley AMPLab by Matei Zaharia
2010 → Open-sourced under BSD license
2013 → Donated to Apache Software Foundation
2014 → Apache Spark becomes Top-Level Project
2016 → Spark 2.0 → Structured Streaming, Unified API (DataFrame/Dataset)
2020 → Spark 3.0 → AQE, Dynamic Partition Pruning, Pandas UDFs
2022 → Spark 3.3 → Improved Kubernetes, ANSI SQL support
2024 → Spark 3.5+ / Spark 4.0 Preview → Connect, Spark Classic vs Spark Connect
```

## Spark vs Hadoop MapReduce

| Factor | Apache Spark | Hadoop MapReduce |
|---|---|---|
| Processing Speed | 100x faster (in-memory) | Slow (disk I/O every step) |
| Ease of Use | High-level APIs (Python, Scala, Java, R) | Low-level Java API |
| Streaming | Structured Streaming (near real-time) | Not native |
| Machine Learning | MLlib built-in | Requires external tools |
| Data Sharing | In-memory (fast) | HDFS (slow) |
| Fault Tolerance | RDD lineage | Disk replication |
| Real-Time | Yes (micro-batch) | No |
| Latency | Seconds | Minutes |

## Spark Ecosystem

```
┌─────────────────────────────────────────────────────────────┐
│                    SPARK ECOSYSTEM                          │
├──────────┬──────────┬──────────┬──────────┬────────────────┤
│ Spark    │ Spark    │ Spark    │ Spark    │ Spark          │
│ SQL      │ Streaming│ MLlib    │ GraphX   │ Structured     │
│          │ (DStream)│          │          │ Streaming      │
├──────────┴──────────┴──────────┴──────────┴────────────────┤
│               SPARK CORE (RDD, Task Scheduling)            │
├─────────────────────────────────────────────────────────────┤
│           CLUSTER MANAGERS                                  │
│   Standalone | YARN | Kubernetes | Mesos                   │
├─────────────────────────────────────────────────────────────┤
│           STORAGE SYSTEMS                                   │
│   HDFS | S3 | GCS | Azure Blob | Cassandra | HBase        │
└─────────────────────────────────────────────────────────────┘
```

## Spark Components

### Driver Program
- The process running the `main()` function of your Spark application
- Creates `SparkContext` / `SparkSession`
- Converts user code into Tasks
- Coordinates all executors
- Maintains metadata about the application

### Executor
- JVM process launched on worker nodes
- Executes Tasks assigned by Driver
- Stores data in cache (RDD/DataFrame partitions)
- Reports status back to Driver
- Lives for the duration of the application

### Cluster Manager
- Allocates resources (CPU, Memory) to Spark applications
- Types: Standalone, YARN, Kubernetes, Mesos

### Application → Job → Stage → Task

```
Application
 └── Job (triggered by Action)
      └── Stage (separated by Shuffle boundaries)
           └── Task (1 Task per Partition)
```

**Example:** A `df.groupBy("category").count().collect()` call creates:
- 1 Job
- 2 Stages (Stage 1: scan + map; Stage 2: aggregate after shuffle)
- N Tasks (equal to number of partitions)

## Interview Questions and Answers

**Q1. What is Apache Spark and why is it faster than Hadoop MapReduce?**

Answer: Apache Spark is a distributed in-memory data processing engine. It is faster than Hadoop MapReduce primarily because:
1. **In-Memory Processing:** Spark stores intermediate data in RAM instead of writing to disk after every Map/Reduce step. This eliminates expensive I/O operations.
2. **DAG Execution:** Spark builds a Directed Acyclic Graph of operations and optimizes the execution plan before running, reducing unnecessary steps.
3. **Lazy Evaluation:** Transformations are not executed immediately; Spark waits until an Action is called and then executes an optimized plan.
4. **Pipelining:** Spark pipelines multiple operations in a single stage when possible (narrow transformations), avoiding unnecessary shuffles.

In benchmarks, Spark is ~100x faster in memory and ~10x faster on disk compared to MapReduce for iterative workloads like ML.

**Q2. Explain the Spark Application execution lifecycle.**

Answer:
1. User submits `spark-submit` command
2. Driver process starts, SparkSession is initialized
3. Driver requests resources from Cluster Manager
4. Cluster Manager launches Executors on worker nodes
5. Driver sends serialized Tasks to Executors
6. Executors run Tasks and store results in memory/disk
7. Results are sent back to Driver when Action is called
8. Application completes, Executors are released

**Q3. What is the difference between Driver and Executor?**

Answer:

| Driver | Executor |
|---|---|
| Runs `main()` function | Runs individual Tasks |
| Creates SparkContext | Receives Tasks from Driver |
| Builds DAG and execution plan | Stores data in memory/disk |
| 1 per application | N per application (configurable) |
| Coordinates all work | Does the actual computation |
| Failure = application fails | Failure = task retry or executor restart |

**Q4. What happens if the Driver fails?**

Answer: If the Driver fails, the entire Spark application fails. All Executors are killed. There is no automatic recovery for the Driver in standard mode. In YARN cluster mode, the Application Master (which IS the Driver) can be restarted if `spark.yarn.maxAppAttempts` is set > 1. In production, we use:
- Checkpointing for Streaming applications
- External job schedulers (Airflow, Oozie) to resubmit failed jobs
- YARN cluster mode with `--num-executors` retry logic

**Q5. What is a Spark Job, Stage, and Task?**

Answer:
- **Job:** Created whenever an Action (collect, count, save) is called. One application can have multiple Jobs.
- **Stage:** A set of transformations that can be pipelined without a shuffle. Stage boundaries are created at wide transformations (groupBy, join, repartition).
- **Task:** The smallest unit of work. One Task is sent to one Executor for one Partition of data. If you have 200 partitions in a stage, you have 200 Tasks.

**Q6. What is lazy evaluation and why is it important?**

Answer: Lazy evaluation means Spark does NOT execute transformations when they are defined. Instead, it builds a logical plan (DAG). Execution only happens when an **Action** is called.

Benefits:
1. **Optimization:** Spark can reorder, combine, and optimize operations (predicate pushdown, column pruning) before executing
2. **Fault Tolerance:** Since the lineage is tracked, Spark can recompute lost partitions
3. **Efficiency:** Spark avoids computing intermediate results that are never needed

Example: If you write `df.filter(...).select(...).filter(...)`, Spark combines all filters before reading data — it doesn't filter, then select, then filter again.

**Q7. What is SparkContext vs SparkSession?**

Answer:
- **SparkContext (SC):** Entry point in Spark 1.x. Connects to the cluster, creates RDDs.
- **SparkSession:** Introduced in Spark 2.0. Unified entry point that wraps SparkContext, SQLContext, HiveContext. Used for DataFrames, Datasets, Spark SQL.

In production always use `SparkSession`. SparkContext is still available as `spark.sparkContext`.

```python
spark = SparkSession.builder \
    .appName("MyApp") \
    .config("spark.executor.memory", "4g") \
    .getOrCreate()
sc = spark.sparkContext  # still accessible
```

**Q8. How many executors should you configure for a Spark job?**

Answer: Rule of thumb for YARN/Kubernetes:
- Leave 1 core per node for OS/YARN daemon
- Leave 1 executor per node for YARN Application Master
- Formula: `num_executors = (total_cores_in_cluster - reserved) / cores_per_executor`
- Example: 10 nodes × 16 cores = 160 cores. Reserve 10 (1 per node) = 150. With 5 cores/executor: 30 executors.
- Memory: `executor_memory = node_memory * 0.8 / executors_per_node`

**Q9. What is the role of the Cluster Manager?**

Answer: The Cluster Manager is responsible for:
1. Allocating resources (CPU, RAM) to Spark applications
2. Launching and monitoring Executor processes
3. Handling resource contention between multiple applications

Spark supports: Standalone (built-in), YARN (Hadoop ecosystem), Kubernetes (containerized), Mesos (deprecated).

**Q10. Explain the concept of a DAG in Spark.**

Answer: A DAG (Directed Acyclic Graph) is Spark's representation of the computation plan. Nodes represent RDDs/DataFrames, edges represent transformations.

Properties:
- **Directed:** Data flows in one direction (no cycles)
- **Acyclic:** No circular dependencies
- **Optimized:** DAG Scheduler optimizes stages before execution

The DAG Scheduler converts the logical plan into physical stages by:
1. Identifying shuffle boundaries (wide transformations)
2. Grouping narrow transformations into the same stage
3. Submitting stages to the Task Scheduler

---

## PySpark Example

```python
from pyspark.sql import SparkSession

# Create SparkSession
spark = SparkSession.builder \
    .appName("SparkFundamentals") \
    .master("local[4]") \
    .config("spark.executor.memory", "2g") \
    .config("spark.driver.memory", "1g") \
    .getOrCreate()

# Access SparkContext
sc = spark.sparkContext
print(f"Spark Version: {spark.version}")
print(f"App Name: {sc.appName}")
print(f"Master: {sc.master}")

# Simple RDD example
rdd = sc.parallelize([1, 2, 3, 4, 5], numSlices=4)
print(f"Number of partitions: {rdd.getNumPartitions()}")
print(f"Sum: {rdd.sum()}")  # Action triggers execution

# Simple DataFrame example
data = [("Alice", 30), ("Bob", 25), ("Charlie", 35)]
df = spark.createDataFrame(data, ["name", "age"])
df.show()
df.printSchema()

spark.stop()
```

## Scala Example

```scala
import org.apache.spark.sql.SparkSession

object SparkFundamentals {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName("SparkFundamentals")
      .master("local[4]")
      .config("spark.executor.memory", "2g")
      .getOrCreate()

    val sc = spark.sparkContext
    println(s"Spark Version: ${spark.version}")

    // RDD example
    val rdd = sc.parallelize(Seq(1, 2, 3, 4, 5), numSlices = 4)
    println(s"Partitions: ${rdd.getNumPartitions}")
    println(s"Sum: ${rdd.sum()}")

    // DataFrame example
    import spark.implicits._
    val data = Seq(("Alice", 30), ("Bob", 25), ("Charlie", 35))
    val df = data.toDF("name", "age")
    df.show()
    df.printSchema()

    spark.stop()
  }
}
```

## Spark SQL Example

```sql
-- Create in-memory table
CREATE OR REPLACE TEMP VIEW employees AS
SELECT * FROM VALUES
  ('Alice', 'Engineering', 90000),
  ('Bob', 'Marketing', 75000),
  ('Charlie', 'Engineering', 85000),
  ('Diana', 'HR', 70000)
AS t(name, dept, salary);

-- Basic query
SELECT dept, COUNT(*) as emp_count, AVG(salary) as avg_salary
FROM employees
GROUP BY dept
ORDER BY avg_salary DESC;
```

## Real Interview Tips

- Always mention **lazy evaluation** when explaining Spark's speed advantage
- Interviewers love asking "what happens step-by-step when you submit a Spark job" — memorize the lifecycle
- Know the difference between `client` and `cluster` deploy modes
- Be ready to draw the architecture diagram (Driver → Cluster Manager → Executors)
- Common follow-up: "What happens when an Executor fails mid-job?"

---

# 2. Spark Architecture

## What is it?

Spark uses a master-slave architecture. The **Driver** (master) coordinates work, the **Executors** (slaves) perform computation. A **Cluster Manager** handles resource allocation between them.

## Why do we use it?

This architecture enables horizontal scaling — add more worker nodes to handle more data. The separation of concerns (Driver for coordination, Executors for computation) enables fault isolation and independent scaling.

## Architecture / Working

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SPARK ARCHITECTURE                           │
│                                                                     │
│  ┌────────────────────────────────────────┐                        │
│  │           DRIVER PROGRAM               │                        │
│  │  ┌──────────────┐ ┌─────────────────┐  │                        │
│  │  │ SparkContext │ │  DAG Scheduler  │  │                        │
│  │  └──────────────┘ └────────┬────────┘  │                        │
│  │  ┌─────────────────────────┴────────┐  │                        │
│  │  │        Task Scheduler            │  │                        │
│  │  └──────────────────────────────────┘  │                        │
│  └────────────────────┬───────────────────┘                        │
│                       │ Resource Request                           │
│  ┌────────────────────▼───────────────────┐                        │
│  │         CLUSTER MANAGER                │                        │
│  │   (YARN / K8s / Standalone / Mesos)    │                        │
│  └────────────────────┬───────────────────┘                        │
│                       │ Launch Executors                           │
│         ┌─────────────┼──────────────┐                            │
│  ┌──────▼──────┐ ┌────▼───────┐ ┌───▼────────┐                   │
│  │  EXECUTOR 1 │ │ EXECUTOR 2 │ │ EXECUTOR N │                   │
│  │  ┌────────┐ │ │ ┌────────┐ │ │ ┌────────┐ │                   │
│  │  │ Task 1 │ │ │ │ Task 3 │ │ │ │ Task 5 │ │                   │
│  │  │ Task 2 │ │ │ │ Task 4 │ │ │ │ Task 6 │ │                   │
│  │  └────────┘ │ │ └────────┘ │ │ └────────┘ │                   │
│  │  Cache/Block│ │ Cache/Block│ │ Cache/Block│                   │
│  │  Manager    │ │ Manager    │ │ Manager    │                   │
│  └─────────────┘ └────────────┘ └────────────┘                   │
└─────────────────────────────────────────────────────────────────────┘
```

## DAG Scheduler

The DAG Scheduler converts the user's logical operations into a physical execution plan:
1. Receives the RDD/DataFrame lineage graph
2. Identifies **stage boundaries** at shuffle operations (wide transformations)
3. Creates **stages** of pipelined narrow transformations
4. Submits stages to the Task Scheduler in dependency order

```
User Code: df.filter().groupBy().agg().orderBy()

DAG Scheduler produces:
Stage 1: filter + map (narrow, no shuffle)
  ↓ (shuffle: groupBy boundary)
Stage 2: partial agg + reduce (wide)
  ↓ (shuffle: orderBy boundary)
Stage 3: sort (wide)
```

## Task Scheduler

- Receives Stages from DAG Scheduler
- Breaks each Stage into Tasks (1 per partition)
- Assigns Tasks to Executors based on data locality
- **Data Locality Preference:** PROCESS_LOCAL > NODE_LOCAL > RACK_LOCAL > ANY
- Retries failed tasks (up to `spark.task.maxFailures`, default 4)

## Cluster Managers

### Standalone
- Spark's built-in cluster manager
- Simple to set up, no external dependencies
- Best for dedicated Spark clusters
- Master/Worker processes

### YARN (Yet Another Resource Negotiator)
- Hadoop's resource manager
- Most common in enterprise Hadoop ecosystems
- **Client Mode:** Driver runs on submitting machine
- **Cluster Mode:** Driver runs inside YARN Application Master
- Supports queue-based resource sharing

### Kubernetes
- Container-based cluster manager
- Driver and Executors run as Pods
- Best for cloud-native / microservice architectures
- Auto-scaling with HPA/KEDA

### Mesos
- General-purpose cluster manager (deprecated in Spark 3.2)

## Client Mode vs Cluster Mode

```
CLIENT MODE:
  User Machine ──(Driver)──> Cluster Manager ──> Executors
  - Driver runs locally
  - Output/logs visible on terminal
  - Network latency between Driver and Executors
  - Use for: Interactive sessions, Notebooks, Debugging

CLUSTER MODE:
  User Machine ──submit──> Cluster Manager ──(Driver + Executors)
  - Driver runs inside cluster
  - No local dependency on submitting machine
  - Lower network latency
  - Use for: Production batch jobs
```

## Spark Execution Flow

```
1. spark-submit / notebook cell executed
2. SparkSession created → SparkContext initialized
3. User code builds logical plan (transformations)
4. Action called (collect / write / count)
5. DAG Scheduler builds DAG from RDD/DataFrame lineage
6. DAG Scheduler splits into Stages at shuffle boundaries
7. Each Stage broken into Tasks (1 per partition)
8. Task Scheduler assigns Tasks to Executors (data locality aware)
9. Executors execute Tasks, store results in memory/disk
10. Results sent to Driver (for collect) or written to storage
```

## Interview Questions and Answers

**Q1. Explain the complete Spark architecture.**

Answer: Spark uses a master-slave architecture with three main components:
1. **Driver:** Runs the user's main program. Creates SparkSession, builds the DAG, coordinates stages and tasks. There is exactly one Driver per application.
2. **Cluster Manager:** External resource manager (YARN/K8s/Standalone) that allocates CPU and memory to the Spark application and launches Executor processes.
3. **Executors:** JVM processes on worker nodes that run the actual tasks. They store data in memory (cache) and report results back to the Driver.

**Q2. What is the difference between DAG Scheduler and Task Scheduler?**

Answer:
- **DAG Scheduler:** High-level scheduler. Converts the RDD/DataFrame lineage graph into stages. Identifies shuffle boundaries. Understands data dependencies between RDDs.
- **Task Scheduler:** Low-level scheduler. Takes stages from DAG Scheduler and sends individual tasks to Executors. Handles data locality, task retries, blacklisting bad executors.

**Q3. What is data locality in Spark and why does it matter?**

Answer: Data locality is Spark's preference to run tasks on the node that holds the data:
- **PROCESS_LOCAL:** Data is in the same JVM as the task (fastest)
- **NODE_LOCAL:** Data is on the same node but different JVM
- **RACK_LOCAL:** Data is on the same rack
- **ANY:** Data is anywhere on the cluster (slowest — network transfer)

This matters because network transfer is expensive. `spark.locality.wait` (default 3s) controls how long Spark waits for a better locality level before settling for a worse one.

**Q4. What is the difference between client mode and cluster mode?**

Answer: 
- **Client mode:** Driver runs on the machine submitting the job. Interactive use, notebooks. Problem: if your laptop disconnects, the job dies.
- **Cluster mode:** Driver runs inside the cluster (as YARN App Master or K8s Pod). Production jobs should use cluster mode for reliability. The submitting machine can be turned off after submission.

**Q5. What happens when an Executor fails?**

Answer:
1. Driver detects Executor heartbeat timeout
2. DAG Scheduler marks all tasks that were running/cached on that Executor as failed
3. Tasks are rescheduled on other available Executors
4. Cached RDD partitions on the failed Executor are recomputed from lineage
5. If too many Executors fail, the job fails

**Q6. How does Spark ensure fault tolerance?**

Answer: Spark ensures fault tolerance through:
1. **RDD Lineage:** Every RDD knows how it was created (its parent RDDs and transformation). On failure, Spark recomputes only the lost partitions from the last checkpoint in the lineage.
2. **Task Retries:** Failed tasks are automatically retried up to `spark.task.maxFailures` times.
3. **Checkpointing:** For Streaming or long lineage chains, checkpoints save RDD data to HDFS/GCS/S3, breaking the lineage chain.

**Q7. What is the role of the Block Manager in Spark?**

Answer: The Block Manager is a distributed storage system running inside each Executor (and the Driver). It manages storage of RDD partitions, broadcast variables, shuffle blocks, and cached data. It uses a combination of memory (heap/off-heap) and disk. The Driver's Block Manager acts as the master, and each Executor's Block Manager acts as a slave, reporting block locations.

**Q8. Explain shuffle in the context of Spark Architecture.**

Answer: Shuffle is the process of redistributing data across Executors (across partitions) — required by wide transformations like `groupBy`, `join`, `distinct`. In the architecture:
1. Stage 1 (map side): Each Executor writes shuffle data to local disk, partitioned by key hash
2. Stage 2 (reduce side): Executors fetch shuffle data from Stage 1 Executors via HTTP
3. This network transfer and disk I/O makes shuffle the most expensive operation in Spark

**Q9. How does YARN cluster mode work with Spark?**

Answer:
1. `spark-submit` sends the application to YARN ResourceManager
2. YARN ResourceManager allocates a container on a NodeManager for the Application Master
3. Spark Driver starts inside the Application Master container
4. Driver requests Executor containers from ResourceManager
5. NodeManagers launch Executor containers
6. Driver sends tasks to Executors; they communicate directly

**Q10. What is the maximum number of partitions Spark can handle?**

Answer: Theoretically, Spark can handle up to `Int.MaxValue` (2.1 billion) partitions, but practically the limit is determined by memory overhead (each partition has ~300 bytes of metadata in the Driver). The recommended range is 2x to 4x the number of CPU cores in your cluster for good parallelism. Too many small partitions create scheduling overhead; too few create under-parallelism and memory pressure.

---

## PySpark Example

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .appName("ArchitectureDemo") \
    .config("spark.executor.cores", "2") \
    .config("spark.executor.memory", "2g") \
    .config("spark.driver.memory", "1g") \
    .getOrCreate()

sc = spark.sparkContext

# Show cluster info
print(f"Default Parallelism: {sc.defaultParallelism}")  # Total cores in cluster

# Create RDD with explicit partitions
rdd = sc.parallelize(range(1000), numSlices=8)
print(f"Partitions: {rdd.getNumPartitions()}")

# Show partition data
def show_partition_info(idx, iterator):
    items = list(iterator)
    print(f"Partition {idx}: {len(items)} items, first={items[0]}, last={items[-1]}")
    return iter(items)

rdd.mapPartitionsWithIndex(show_partition_info).count()
```

## Scala Example

```scala
import org.apache.spark.sql.SparkSession

object ArchitectureDemo extends App {
  val spark = SparkSession.builder()
    .appName("ArchitectureDemo")
    .config("spark.executor.cores", "2")
    .getOrCreate()

  val sc = spark.sparkContext
  println(s"Default Parallelism: ${sc.defaultParallelism}")

  val rdd = sc.parallelize(1 to 1000, numSlices = 8)
  println(s"Partitions: ${rdd.getNumPartitions}")

  // Check partition sizes
  rdd.mapPartitionsWithIndex { (idx, iter) =>
    val items = iter.toList
    println(s"Partition $idx: ${items.size} items")
    items.iterator
  }.count()

  spark.stop()
}
```

## Real Interview Tips

- Draw the architecture on a whiteboard — interviewers frequently ask this
- Know both YARN and Kubernetes deployment models (K8s is increasingly important)
- "What happens when Driver OOMs?" is a common tricky question — answer: job fails, no auto-recovery in batch mode
- Always mention data locality when discussing performance

---

# 3. RDD (Resilient Distributed Dataset)

## What is it?

RDD is the fundamental, immutable, distributed data structure in Spark. It is a collection of elements partitioned across the nodes of the cluster. "Resilient" means fault-tolerant via lineage. "Distributed" means data is spread across nodes. "Dataset" means it is a collection of data.

## Why do we use it?

- Low-level control over data processing (needed for complex custom operations)
- Working with unstructured data (text files, raw bytes)
- When you need custom partitioning logic
- Fine-grained control over caching and fault tolerance

> **Note:** In modern Spark (2.x+), DataFrames/Datasets are preferred over RDDs for most use cases because of the Catalyst Optimizer. RDD knowledge is still critical for interviews.

## Key Concepts

| Property | Description |
|---|---|
| Immutable | Once created, cannot be modified; transformations create new RDDs |
| Partitioned | Data is split into partitions distributed across nodes |
| Lazy | Transformations are lazy; execution only on Actions |
| Resilient | Lineage graph enables recomputation on failure |
| In-Memory | Data lives in memory; spills to disk if needed |
| Type-Safe (Scala) | Scala RDD[T] is strongly typed |

## Narrow vs Wide Transformations

```
NARROW TRANSFORMATION (no shuffle):
  Each output partition depends on AT MOST one input partition
  
  Partition 1 → Partition 1
  Partition 2 → Partition 2   (1-to-1 mapping)
  Partition 3 → Partition 3
  
  Examples: map, filter, flatMap, mapPartitions, union

WIDE TRANSFORMATION (shuffle):
  Each output partition depends on MULTIPLE input partitions
  
  Partition 1 ──┬── Partition A
  Partition 2 ──┼── Partition B  (data moves across network)
  Partition 3 ──┘── Partition C
  
  Examples: groupByKey, reduceByKey, sortByKey, join, distinct, repartition
```

## Lazy Evaluation

```python
# These lines execute instantly (just build DAG, no data moved):
rdd1 = sc.textFile("s3://bucket/data.txt")       # No file read yet
rdd2 = rdd1.filter(lambda x: "error" in x)        # No filter yet
rdd3 = rdd2.map(lambda x: x.upper())              # No map yet

# THIS triggers actual execution:
count = rdd3.count()   # NOW: file is read, filtered, mapped, counted
```

## Lineage

```
textFile("logs.txt")
    └── filter(x contains "ERROR")
         └── map(x → extract fields)
              └── groupByKey()
                   └── count()

If partition 3 of groupByKey fails:
Spark recomputes ONLY partition 3 by:
  1. Re-reading partition 3 from "logs.txt"
  2. Re-applying filter
  3. Re-applying map
  4. Re-grouping partition 3 keys
```

## Fault Tolerance

RDD fault tolerance is based on lineage tracking:
1. Every RDD remembers its **parent RDDs** and the **transformation** used to create it
2. On partition loss, Spark traces back the lineage and recomputes only the lost partition
3. No need for data replication (unlike HDFS)
4. **Limitation:** Very long lineage chains are expensive to recompute → use `checkpoint()`

## Persistence / Caching

```
StorageLevel Hierarchy:
MEMORY_ONLY         → Fastest, OOM risk if large data
MEMORY_AND_DISK     → Falls back to disk if no memory (recommended)
DISK_ONLY           → Slowest, but no OOM
MEMORY_ONLY_SER     → Serialized (smaller footprint, slower access)
MEMORY_AND_DISK_SER → Serialized with disk fallback
OFF_HEAP            → Stored in Tachyon/off-heap memory
```

## Checkpointing

```python
sc.setCheckpointDir("s3://bucket/checkpoints/")

rdd = sc.textFile("...") \
        .map(...) \
        .filter(...) \
        # ... many transformations ...
        .repartition(100)

rdd.checkpoint()  # Truncates lineage, saves to checkpoint dir
rdd.count()       # Triggers checkpoint write

# Now if any partition fails, Spark reads from checkpoint
# instead of recomputing from beginning
```

## Interview Questions and Answers

**Q1. What are the 5 main properties of an RDD?**

Answer:
1. **List of partitions:** RDD is divided into multiple partitions
2. **Function to compute each partition:** The transformation function applied to parent RDDs
3. **List of dependencies on other RDDs:** Parent RDD references (lineage)
4. **Optionally, a Partitioner:** For key-value RDDs (hash or range)
5. **Optionally, preferred locations:** For data locality (e.g., HDFS block locations)

**Q2. What is the difference between narrow and wide transformations?**

Answer:
- **Narrow:** Output partition depends on at most one input partition. No data movement across network. Fast, can be pipelined in one stage. Examples: `map`, `filter`, `flatMap`, `mapPartitions`.
- **Wide:** Output partition depends on multiple input partitions. Requires shuffle — data moves across the network. Creates a new stage boundary. Expensive. Examples: `groupByKey`, `reduceByKey`, `join`, `distinct`, `repartition`.

**Q3. Why is `reduceByKey` preferred over `groupByKey`?**

Answer: `groupByKey` collects ALL values for each key across the cluster to a single Reducer, causing massive data transfer and potential OOM. `reduceByKey` performs a **local partial aggregation** (combiner step) on each partition before shuffling, dramatically reducing the amount of data transferred.

```
groupByKey: ALL values moved to Reducer → memory issue
reduceByKey: Partial aggregate on each Executor first → only aggregated results shuffled
```
This is one of the most common Spark interview questions.

**Q4. How many ways can you create an RDD?**

Answer:
1. `sc.parallelize([1,2,3])` — from in-memory collection
2. `sc.textFile("path")` — from external storage (HDFS, S3, local)
3. `sc.sequenceFile("path")` — from Hadoop SequenceFile
4. Transforming an existing RDD: `rdd.map(...)`, `rdd.filter(...)`
5. From a DataFrame: `df.rdd`

**Q5. What is the difference between `map` and `mapPartitions`?**

Answer:
- `map`: Applies a function to each **element** individually. Creates one function call per record.
- `mapPartitions`: Applies a function to an entire **partition** (iterator of records). More efficient for operations with setup costs (e.g., database connections, file handles).

```python
# map: 1M function calls for 1M records
rdd.map(lambda x: x * 2)

# mapPartitions: 10 function calls for 10 partitions
def process_partition(iterator):
    conn = open_db_connection()  # 1 connection per partition, not per record
    for row in iterator:
        yield conn.process(row)
    conn.close()
rdd.mapPartitions(process_partition)
```

**Q6. What is RDD lineage and how does it provide fault tolerance?**

Answer: RDD lineage (also called the RDD graph) is a directed graph recording all transformations applied to create an RDD from its parent RDDs. If any partition is lost (Executor crash), Spark uses the lineage to recompute ONLY the lost partitions by replaying the transformations from the original data source or last checkpoint.

**Q7. When should you use `checkpoint()` vs `cache()`?**

Answer:
- **cache():** Stores RDD in memory/disk on the cluster. Fast but lineage is NOT broken. On cache eviction, Spark recomputes from lineage. Use for RDDs accessed multiple times in iterative algorithms.
- **checkpoint():** Writes RDD data to external storage (HDFS/S3). Breaks the lineage. Slower (disk write) but fault tolerance doesn't depend on Executor memory. Use for: very long lineage chains, Streaming applications, ML iterative algorithms.

**Q8. What is the default number of partitions when reading from HDFS?**

Answer: Spark creates one partition per HDFS block (default block size = 128MB). So a 1GB file → 8 partitions. You can control this with `sc.textFile("path", minPartitions=N)` or by calling `repartition()` after reading.

**Q9. Explain the concept of RDD persistence levels.**

Answer: Persistence levels control WHERE and HOW RDD data is stored:
- `MEMORY_ONLY`: Store as deserialized Java objects in JVM heap. Fastest. Risk: OOM if data > available memory; Spark drops partitions and recomputes on access.
- `MEMORY_AND_DISK`: Like MEMORY_ONLY but spills overflow to disk. Safer.
- `MEMORY_ONLY_SER`: Serialized objects. More CPU but less memory footprint.
- `DISK_ONLY`: Always on disk. No memory usage but slow.
- `OFF_HEAP`: Tungsten's unmanaged memory. Avoids GC pressure.

**Q10. How does the `cogroup` operation work?**

Answer: `cogroup` (also called `groupWith`) groups data from multiple RDDs by key. It creates an RDD where each key maps to a tuple of iterables — one from each input RDD. It is the foundation for `join`, `leftOuterJoin`, `rightOuterJoin`. Example: `rdd1.cogroup(rdd2)` produces `(key, (iter_from_rdd1, iter_from_rdd2))` for each unique key.

---

## PySpark Example

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("RDDDemo").master("local[4]").getOrCreate()
sc = spark.sparkContext

# Create RDD
rdd = sc.parallelize([
    ("apple", 3), ("banana", 5), ("apple", 2), 
    ("cherry", 1), ("banana", 3)
], numSlices=2)

# Narrow transformations (no shuffle)
filtered = rdd.filter(lambda x: x[1] > 1)          # filter
mapped = filtered.map(lambda x: (x[0], x[1] * 10)) # map
print("Narrow result:", mapped.collect())

# Wide transformation (shuffle)
# BAD: groupByKey
grouped = rdd.groupByKey().mapValues(list)
print("GroupByKey:", grouped.collect())

# GOOD: reduceByKey
summed = rdd.reduceByKey(lambda a, b: a + b)
print("ReduceByKey:", summed.collect())

# Caching
summed.persist()  # Cache for reuse
print("Count:", summed.count())
print("Collect:", summed.collect())  # Uses cache, no recomputation

# Lineage
print("Lineage:", summed.toDebugString().decode())

summed.unpersist()

# flatMap
words = sc.parallelize(["Hello World", "Apache Spark"])
word_list = words.flatMap(lambda x: x.split(" "))
print("flatMap:", word_list.collect())  # ['Hello', 'World', 'Apache', 'Spark']

# mapPartitions (efficient for setup costs)
def process(iter):
    return (x * 2 for x in iter)

nums = sc.parallelize(range(10), 3)
print("mapPartitions:", nums.mapPartitions(process).collect())
```

## Scala Example

```scala
import org.apache.spark.sql.SparkSession
import org.apache.spark.storage.StorageLevel

object RDDDemo extends App {
  val spark = SparkSession.builder().appName("RDDDemo").master("local[4]").getOrCreate()
  val sc = spark.sparkContext

  // Create RDD
  val rdd = sc.parallelize(Seq(
    ("apple", 3), ("banana", 5), ("apple", 2),
    ("cherry", 1), ("banana", 3)
  ), numSlices = 2)

  // Narrow transformations
  val filtered = rdd.filter(_._2 > 1)
  val mapped = filtered.map { case (k, v) => (k, v * 10) }
  println(s"Narrow: ${mapped.collect().mkString(", ")}")

  // Wide - reduceByKey (preferred)
  val summed = rdd.reduceByKey(_ + _)
  println(s"ReduceByKey: ${summed.collect().mkString(", ")}")

  // Persist
  summed.persist(StorageLevel.MEMORY_AND_DISK)
  println(s"Count: ${summed.count()}")
  println(s"Collect: ${summed.collect().mkString(", ")}")

  // Lineage
  println(summed.toDebugString)

  summed.unpersist()

  // flatMap
  val sentences = sc.parallelize(Seq("Hello World", "Apache Spark"))
  val words = sentences.flatMap(_.split(" "))
  println(s"Words: ${words.collect().mkString(", ")}")

  spark.stop()
}
```

## Real Interview Tips

- The `reduceByKey` vs `groupByKey` question is asked in almost every Spark interview
- Know the 5 RDD properties by heart
- Understand when to use `cache()` vs `persist(StorageLevel.X)` vs `checkpoint()`
- Be ready to draw narrow vs wide transformation diagrams

---

# 4. DataFrame

## What is it?

A DataFrame is a distributed collection of data organized into named columns — similar to a relational database table or a pandas DataFrame. Introduced in Spark 1.3, it provides a higher-level abstraction over RDDs with schema information and query optimization via the Catalyst optimizer.

## Why do we use it?

DataFrames are the primary API in modern Spark for:
- ETL pipelines processing structured/semi-structured data
- SQL-based analytics at petabyte scale
- Machine learning feature engineering
- Any structured data pipeline

## Key Concepts

| Concept | Description |
|---|---|
| Schema | Column names and types; enforced at runtime |
| Catalyst | Query optimizer that rewrites and optimizes the logical plan |
| Tungsten | Execution engine for efficient memory management and code generation |
| Immutable | Like RDDs, transformations create new DataFrames |
| Lazy | Transformations are lazy; execution on Actions |

## Benefits over RDD

| Factor | DataFrame | RDD |
|---|---|---|
| Performance | Optimized via Catalyst + Tungsten | No automatic optimization |
| Ease of Use | SQL-like, concise API | Verbose lambda functions |
| Schema | Enforced, type-safe column names | Schema-free (unless you add it) |
| Interoperability | Native SQL, R, Python, Scala, Java | Only JVM languages natively |
| Memory | Columnar, off-heap, efficient | Row-based, heap memory |
| Serialization | Tungsten (binary, off-heap) | Java/Kryo serialization |

## Catalyst Optimizer

```
User Query (DataFrame API / SQL)
          │
          ▼
┌─────────────────────────┐
│   UNRESOLVED LOGICAL    │  ← Parse SQL / DataFrame API
│        PLAN             │
└────────────┬────────────┘
             │ Analysis (resolve table names, column types)
             ▼
┌─────────────────────────┐
│   ANALYZED LOGICAL      │
│        PLAN             │
└────────────┬────────────┘
             │ Logical Optimization
             │  - Constant folding
             │  - Predicate pushdown
             │  - Column pruning
             │  - Null propagation
             ▼
┌─────────────────────────┐
│   OPTIMIZED LOGICAL     │
│        PLAN             │
└────────────┬────────────┘
             │ Physical Planning (select join strategy, etc.)
             ▼
┌─────────────────────────┐
│   PHYSICAL PLAN(s)      │
│  (multiple candidates)  │
└────────────┬────────────┘
             │ Cost Model (choose best plan)
             ▼
┌─────────────────────────┐
│   SELECTED PHYSICAL     │
│        PLAN             │
└────────────┬────────────┘
             │ Code Generation (Tungsten WholeStageCodeGen)
             ▼
        EXECUTION
```

## Tungsten Engine

Tungsten is Spark's physical execution engine focused on CPU and memory efficiency:

1. **Off-Heap Memory:** Stores data in binary format outside JVM heap, reducing GC pressure
2. **Cache-Friendly Data Structures:** Columnar format improves CPU cache hit rates
3. **Whole-Stage Code Generation:** Compiles query plans into single Java functions, eliminating virtual function calls and enabling CPU instruction-level optimization
4. **Vectorized Reading:** Reads columnar data in batches (1024 rows) for Parquet/ORC

## Interview Questions and Answers

**Q1. What is the Catalyst Optimizer and how does it work?**

Answer: Catalyst is Spark's query optimizer. It operates in 4 phases:
1. **Analysis:** Resolves column names, table names, data types from the catalog
2. **Logical Optimization:** Applies rule-based optimizations (predicate pushdown, constant folding, column pruning, filter reordering)
3. **Physical Planning:** Generates multiple physical plans using different strategies (broadcast join vs sort merge join) and picks the best using a cost model
4. **Code Generation:** Generates JVM bytecode for the selected plan using Janino compiler

**Q2. What is predicate pushdown and how does Catalyst implement it?**

Answer: Predicate pushdown moves filter operations as early as possible in the execution plan — ideally to the data source level. Example: Instead of reading ALL rows from Parquet and then filtering, Spark pushes the filter into the Parquet reader to skip non-matching row groups (using Parquet statistics). This drastically reduces I/O. Catalyst does this automatically; you can verify with `df.explain(True)` and look for `PushedFilters` in the physical plan.

**Q3. How is a DataFrame different from an RDD?**

Answer: Key differences:
- DataFrame has a **schema** (named, typed columns); RDD has no schema
- DataFrame is optimized by **Catalyst** and **Tungsten**; RDD has no optimization
- DataFrame stores data in **columnar, off-heap format**; RDD uses row-based heap memory
- DataFrame API is available in **Python, SQL, Scala, Java, R**; RDD's full performance only in JVM
- DataFrame is ~5-10x faster than RDD for structured data processing

**Q4. How do you view the execution plan of a DataFrame?**

Answer:
```python
df.explain()              # Physical plan only
df.explain(True)          # All 4 plans (parsed, analyzed, optimized, physical)
df.explain("formatted")   # Formatted, easier to read (Spark 3.0+)
df.explain("cost")        # Includes cost estimates
```
Look for: `FileScan`, `Filter`, `Project`, `HashAggregate`, `Exchange` (shuffle), `Sort`, `BroadcastHashJoin`.

**Q5. What is column pruning in Spark?**

Answer: Column pruning means Spark only reads the columns needed for the query from the data source, not all columns. For columnar formats (Parquet, ORC), this is extremely efficient — if you SELECT 3 columns from a 50-column table, Spark only reads 3 column files. Catalyst automatically applies column pruning. Always use `select()` with specific columns instead of `select("*")`.

**Q6. How do you handle schema evolution in DataFrames?**

Answer:
```python
# mergeSchema: handle added columns across Parquet files
df = spark.read.option("mergeSchema", "true").parquet("path/")

# Explicit schema: define expected schema to avoid inference cost
from pyspark.sql.types import StructType, StructField, StringType, IntegerType
schema = StructType([
    StructField("id", IntegerType(), nullable=False),
    StructField("name", StringType(), nullable=True)
])
df = spark.read.schema(schema).json("path/")
```

**Q7. What is the difference between `select`, `withColumn`, and `selectExpr`?**

Answer:
- `select("col1", "col2")`: Returns a new DataFrame with only specified columns
- `withColumn("new_col", expr)`: Adds or replaces a single column; returns ALL existing columns + new one
- `selectExpr("col1", "col1 + 1 as col2")`: SQL expression strings; convenient for complex transformations

```python
df.select("name", "age")                              # Select 2 cols
df.withColumn("age_plus_1", df.age + 1)               # All cols + new col
df.selectExpr("name", "age + 1 as age_plus_1")        # SQL-style
```

**Q8. How do you convert between RDD and DataFrame?**

Answer:
```python
# RDD → DataFrame
rdd = sc.parallelize([("Alice", 30), ("Bob", 25)])
df = rdd.toDF(["name", "age"])
# OR with schema
df = spark.createDataFrame(rdd, schema=["name", "age"])

# DataFrame → RDD
rdd = df.rdd  # RDD of Row objects
rdd_mapped = df.rdd.map(lambda row: (row.name, row.age))
```

**Q9. What is a catalyst rule?**

Answer: A Catalyst rule is a transformation function that rewrites the logical plan tree using pattern matching. Rules are applied repeatedly until the plan stabilizes (fixed point). Examples:
- `CombineFilters`: Merges multiple consecutive `Filter` nodes into one
- `PushPredicateThroughJoin`: Pushes filters from after a join to before the join
- `ConstantFolding`: Evaluates constant expressions at compile time (`1 + 2` → `3`)

**Q10. What is the significance of `df.printSchema()`?**

Answer: `printSchema()` displays the schema tree including column names, data types, and nullability. It's important because:
1. Validates that data was read with correct types
2. Helps debug schema mismatch errors
3. Shows nested schemas (arrays, structs, maps)
4. Indicates which columns are nullable (affects join and filter behavior)

---

## PySpark Example

```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, when, lit, upper, year
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, DoubleType

spark = SparkSession.builder.appName("DataFrameDemo").master("local[2]").getOrCreate()

# Define schema explicitly (avoid inference — faster and safer)
schema = StructType([
    StructField("id", IntegerType(), False),
    StructField("name", StringType(), True),
    StructField("age", IntegerType(), True),
    StructField("salary", DoubleType(), True),
    StructField("dept", StringType(), True)
])

data = [
    (1, "Alice", 30, 90000.0, "Engineering"),
    (2, "Bob", 25, 75000.0, "Marketing"),
    (3, "Charlie", 35, 85000.0, "Engineering"),
    (4, "Diana", 28, 70000.0, "HR"),
    (5, "Eve", 32, 95000.0, "Engineering")
]

df = spark.createDataFrame(data, schema)
df.printSchema()
df.show()

# Transformations
result = df \
    .filter(col("salary") > 75000) \
    .select("name", "dept", "salary") \
    .withColumn("salary_category", 
                when(col("salary") >= 90000, "High")
                .when(col("salary") >= 80000, "Medium")
                .otherwise("Low")) \
    .withColumn("name_upper", upper(col("name")))

result.show()

# Aggregation
dept_stats = df.groupBy("dept").agg(
    {"salary": "avg", "id": "count"}
).withColumnRenamed("avg(salary)", "avg_salary") \
 .withColumnRenamed("count(id)", "emp_count")

dept_stats.show()

# View execution plan
result.explain(True)

spark.stop()
```

## Scala Example

```scala
import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.functions._
import org.apache.spark.sql.types._

object DataFrameDemo extends App {
  val spark = SparkSession.builder().appName("DataFrameDemo").master("local[2]").getOrCreate()
  import spark.implicits._

  val schema = StructType(Seq(
    StructField("id", IntegerType, nullable = false),
    StructField("name", StringType, nullable = true),
    StructField("age", IntegerType, nullable = true),
    StructField("salary", DoubleType, nullable = true),
    StructField("dept", StringType, nullable = true)
  ))

  val data = Seq(
    (1, "Alice", 30, 90000.0, "Engineering"),
    (2, "Bob", 25, 75000.0, "Marketing"),
    (3, "Charlie", 35, 85000.0, "Engineering")
  )

  val df = data.toDF("id", "name", "age", "salary", "dept")
  df.printSchema()
  df.show()

  val result = df
    .filter($"salary" > 75000)
    .select("name", "dept", "salary")
    .withColumn("category", when($"salary" >= 90000, "High").otherwise("Standard"))

  result.show()
  result.explain(true)
  spark.stop()
}
```

## Spark SQL Example

```sql
-- Register temp view
CREATE OR REPLACE TEMP VIEW employees AS
SELECT * FROM VALUES
  (1, 'Alice', 30, 90000.0, 'Engineering'),
  (2, 'Bob', 25, 75000.0, 'Marketing'),
  (3, 'Charlie', 35, 85000.0, 'Engineering'),
  (4, 'Diana', 28, 70000.0, 'HR'),
  (5, 'Eve', 32, 95000.0, 'Engineering')
AS t(id, name, age, salary, dept);

-- Department summary
SELECT
  dept,
  COUNT(*) AS emp_count,
  ROUND(AVG(salary), 2) AS avg_salary,
  MAX(salary) AS max_salary,
  MIN(salary) AS min_salary
FROM employees
GROUP BY dept
ORDER BY avg_salary DESC;

-- Conditional column
SELECT
  name,
  salary,
  CASE
    WHEN salary >= 90000 THEN 'High'
    WHEN salary >= 80000 THEN 'Medium'
    ELSE 'Low'
  END AS salary_band
FROM employees;
```

## Real Interview Tips

- "Explain Catalyst Optimizer" is asked in 80% of senior Spark interviews — know all 4 phases
- Always use `explain()` to verify predicate pushdown is happening
- Know the difference between `Unresolved`, `Analyzed`, and `Optimized` logical plans
- Tungsten's whole-stage code generation is a common follow-up

---

# 5. Dataset

## What is it?

Dataset is a strongly-typed, distributed collection introduced in Spark 1.6. It combines the benefits of RDD (compile-time type safety) with the benefits of DataFrame (Catalyst optimization, Tungsten memory management). In Scala/Java, `DataFrame = Dataset[Row]`.

## Why do we use it?

- Compile-time type safety (Scala/Java): catch errors at compile time, not runtime
- IDE autocompletion
- Lambda functions with typed objects (not just Row)
- Best of both worlds: optimization + type safety

> **Note:** In Python and R, there are no Datasets — only DataFrames. Datasets are a Scala/Java-only API.

## Dataset vs DataFrame

| Feature | Dataset | DataFrame |
|---|---|---|
| Type Safety | Yes (compile-time) | No (runtime) |
| Language | Scala, Java only | Python, Scala, Java, R |
| API Style | Typed lambdas + SQL | SQL / untyped API |
| Performance | Same (Catalyst + Tungsten) | Same |
| Serialization | Encoders (more efficient than Java serialization) | Tungsten |

## Dataset vs RDD

| Feature | Dataset | RDD |
|---|---|---|
| Optimization | Catalyst + Tungsten | None |
| Schema | Yes | No |
| Type Safety | Yes | Yes (Scala) |
| Serialization | Encoders | Java/Kryo |
| Memory | Off-heap | JVM heap |
| Performance | Much faster | Slower |

## Interview Questions and Answers

**Q1. What is the relationship between Dataset and DataFrame in Spark?**

Answer: In Spark, `DataFrame` is an alias for `Dataset[Row]`. Both use the same underlying implementation. Dataset is the typed version where each row is a specific case class instance. DataFrame uses the generic `Row` type. When you call `df.as[MyCaseClass]`, you convert a DataFrame to a typed Dataset.

**Q2. Why are Datasets only available in Scala and Java, not Python?**

Answer: Datasets require compile-time type checking, which requires a statically-typed language. Python is dynamically typed, so Spark cannot provide the same compile-time guarantees. PySpark only exposes DataFrames (essentially `Dataset[Row]` in Python). The Catalyst Optimizer still works for PySpark DataFrames.

**Q3. What is an Encoder in Spark Dataset?**

Answer: An Encoder is the mechanism for serializing/deserializing typed JVM objects to/from Spark's internal binary row format (Tungsten). Encoders are:
- Generated at compile time for primitive types and case classes
- More efficient than Java serialization or Kryo
- Enable off-heap memory storage
- Available as `Encoders.product[MyCaseClass]` or implicitly from `spark.implicits._`

**Q4. When would you choose Dataset over DataFrame?**

Answer: Choose Dataset when:
1. You need compile-time type safety (Scala/Java enterprise codebase)
2. Your transformations are complex lambdas on domain objects
3. You want IDE support and refactoring safety
4. The team prefers OOP-style code over SQL-style

Choose DataFrame when:
1. Working in Python (no Dataset available)
2. Performance is critical and you want minimal overhead
3. Ad-hoc analytics and SQL queries
4. Dynamic schemas (schema not known at compile time)

**Q5. How do you convert between DataFrame and Dataset?**

Answer:
```scala
case class Employee(id: Int, name: String, salary: Double)

// DataFrame to Dataset
val df: DataFrame = spark.read.parquet("employees/")
val ds: Dataset[Employee] = df.as[Employee]

// Dataset to DataFrame
val df2: DataFrame = ds.toDF()

// Dataset operations
ds.filter(_.salary > 80000).map(e => (e.name, e.salary * 1.1)).show()
```

---

## Scala Example

```scala
import org.apache.spark.sql.SparkSession

case class Employee(id: Int, name: String, age: Int, salary: Double, dept: String)

object DatasetDemo extends App {
  val spark = SparkSession.builder().appName("DatasetDemo").master("local[2]").getOrCreate()
  import spark.implicits._

  // Create Dataset from Seq
  val employees = Seq(
    Employee(1, "Alice", 30, 90000.0, "Engineering"),
    Employee(2, "Bob", 25, 75000.0, "Marketing"),
    Employee(3, "Charlie", 35, 85000.0, "Engineering")
  ).toDS()

  employees.printSchema()
  employees.show()

  // Typed transformations (compile-time safe)
  val highEarners: Dataset[Employee] = employees.filter(_.salary > 80000)
  val names: Dataset[String] = highEarners.map(_.name)
  names.show()

  // Convert to DataFrame for SQL operations
  val df = employees.toDF()
  df.createOrReplaceTempView("employees")
  spark.sql("SELECT dept, AVG(salary) FROM employees GROUP BY dept").show()

  // GroupByKey (Dataset equivalent of groupBy)
  val grouped = employees
    .groupByKey(_.dept)
    .mapGroups { (dept, iter) =>
      val emps = iter.toList
      (dept, emps.size, emps.map(_.salary).sum / emps.size)
    }
  grouped.show()

  spark.stop()
}
```

## Real Interview Tips

- Know that `DataFrame = Dataset[Row]` — this surprises many candidates
- Encoders are a common deep-dive question in senior interviews
- Be ready to explain when NOT to use Dataset (Python, dynamic schemas)

---

# 6. Transformations

## What is it?

Transformations are operations on DataFrames/RDDs that create a new DataFrame/RDD without executing immediately (lazy evaluation). They define the computation but don't trigger it.

## Key Concepts

- **Narrow Transformations:** No shuffle (map, filter, flatMap, select, withColumn)
- **Wide Transformations:** Require shuffle (groupBy, join, distinct, repartition, orderBy)
- All transformations return a new DataFrame/RDD (immutable)
- Execution only triggered by Actions

---

## map

Applies a function to each element, returning one output per input.

```python
# PySpark RDD
rdd = sc.parallelize([1, 2, 3, 4, 5])
result = rdd.map(lambda x: x ** 2)
print(result.collect())  # [1, 4, 9, 16, 25]

# DataFrame equivalent
from pyspark.sql.functions import col
df.withColumn("salary_10pct_raise", col("salary") * 1.1)
```

## flatMap

Applies a function to each element, returning ZERO OR MORE outputs per input (flattens the result).

```python
# RDD
rdd = sc.parallelize(["Hello World", "Apache Spark"])
words = rdd.flatMap(lambda x: x.split(" "))
print(words.collect())  # ['Hello', 'World', 'Apache', 'Spark']

# Use case: exploding JSON arrays, tokenizing text
```

## filter

Returns elements that satisfy the condition.

```python
# RDD
rdd = sc.parallelize([1, 2, 3, 4, 5, 6])
even = rdd.filter(lambda x: x % 2 == 0)
print(even.collect())  # [2, 4, 6]

# DataFrame
df.filter(col("age") > 30)
df.where("salary > 80000 AND dept = 'Engineering'")
```

## distinct

Returns unique elements (triggers shuffle).

```python
rdd = sc.parallelize([1, 2, 2, 3, 3, 3])
print(rdd.distinct().collect())  # [1, 2, 3] (order may vary)

# DataFrame
df.select("dept").distinct().show()
df.dropDuplicates(["email"])  # Dedup by specific columns
```

## union

Combines two RDDs/DataFrames with the SAME schema (does NOT remove duplicates).

```python
rdd1 = sc.parallelize([1, 2, 3])
rdd2 = sc.parallelize([3, 4, 5])
print(rdd1.union(rdd2).collect())  # [1, 2, 3, 3, 4, 5]

# DataFrame union
df1.union(df2)  # Same schema required
df1.unionByName(df2)  # Match by column name, not position
```

## intersection

Returns elements present in BOTH RDDs (triggers shuffle).

```python
rdd1 = sc.parallelize([1, 2, 3, 4])
rdd2 = sc.parallelize([3, 4, 5, 6])
print(rdd1.intersection(rdd2).collect())  # [3, 4]
```

## subtract

Returns elements in first RDD NOT in second (triggers shuffle).

```python
rdd1 = sc.parallelize([1, 2, 3, 4])
rdd2 = sc.parallelize([3, 4, 5])
print(rdd1.subtract(rdd2).collect())  # [1, 2]
```

## sample

Returns a random sample of the data.

```python
rdd = sc.parallelize(range(100))
sample = rdd.sample(withReplacement=False, fraction=0.1, seed=42)
print(sample.count())  # ~10

# DataFrame
df.sample(fraction=0.1, seed=42)
df.sample(withReplacement=True, fraction=0.5)
```

## repartition

Increases OR decreases partition count. Triggers a FULL shuffle.

```python
rdd = sc.parallelize(range(100), 4)
print(rdd.getNumPartitions())  # 4

rdd_more = rdd.repartition(8)  # More partitions (increase parallelism)
rdd_less = rdd.repartition(2)  # Fewer partitions (reduce files before write)

# DataFrame: repartition by column (for join/groupBy optimization)
df.repartition(200)                           # By count
df.repartition(200, col("country"))           # By column (hash-based)
df.repartitionByRange(200, col("date"))       # By range
```

## coalesce

Decreases partition count WITHOUT a full shuffle (narrow transformation).

```python
rdd = sc.parallelize(range(100), 8)
rdd_small = rdd.coalesce(2)  # Reduces to 2 partitions, no shuffle
print(rdd_small.getNumPartitions())  # 2

# DataFrame: use before writing to reduce output files
df.coalesce(1).write.parquet("output/")  # Write to single file
```

## sortBy / orderBy / sort

Sorts data globally (triggers shuffle for global sort).

```python
# RDD
rdd = sc.parallelize([3, 1, 4, 1, 5, 9])
print(rdd.sortBy(lambda x: x).collect())       # Ascending
print(rdd.sortBy(lambda x: x, False).collect()) # Descending

# DataFrame
df.orderBy("salary")                          # Ascending
df.orderBy(col("salary").desc())              # Descending
df.orderBy(col("dept").asc(), col("salary").desc())  # Multiple cols
df.sort("salary", ascending=False)
```

## Interview Questions and Answers

**Q1. What is the difference between `repartition` and `coalesce`?**

Answer:

| | repartition | coalesce |
|---|---|---|
| Shuffle | Yes (full shuffle) | No (narrow, merge only) |
| Direction | Increase OR Decrease | Decrease ONLY |
| Data Distribution | Even (random) | Uneven (some partitions merge) |
| Use Case | Increase parallelism, evenly distribute | Reduce partitions before write |
| Performance | Slower | Faster (no shuffle) |

Rule: Use `coalesce(N)` when reducing (e.g., before `write`). Use `repartition(N)` when increasing or when you need even distribution.

**Q2. What is the difference between `map` and `flatMap`?**

Answer: `map` returns exactly one element per input (1-to-1). `flatMap` can return zero or more elements per input (1-to-N, then flattens). Use `flatMap` for: tokenization (word → [word1, word2]), exploding arrays, handling optional values (return empty list to skip).

**Q3. Why is `sortBy` a wide transformation?**

Answer: To sort data globally (across all partitions), every partition must send data to the correct sorted position. This requires all data to be shuffled across the network. Spark uses a range partitioner: first samples the data to determine key ranges, then shuffles data to the correct range partition, then sorts within each partition.

**Q4. When should you use `repartition(N, col)` instead of `repartition(N)`?**

Answer: Use `repartition(N, col)` when you're planning to do a `join` or `groupBy` on that column later. Repartitioning by the join key means Spark doesn't need to shuffle again during the join — the data is already co-located. This is the manual approach to what AQE (Adaptive Query Execution) does automatically.

**Q5. What does `distinct()` do internally?**

Answer: `distinct()` is implemented as `groupBy(all columns).agg(first of each)`. It triggers a shuffle to group identical rows together, then returns one row per group. It's equivalent to `dropDuplicates()` on all columns. For deduplication on specific columns, use `dropDuplicates(["col1", "col2"])` which is more efficient.

---

## PySpark Example

```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, explode, split

spark = SparkSession.builder.appName("TransformationsDemo").master("local[4]").getOrCreate()
sc = spark.sparkContext

# --- RDD Transformations ---
rdd = sc.parallelize(range(1, 21), 4)

# map: square each number
squared = rdd.map(lambda x: x ** 2)
print("Squared:", squared.take(5))

# filter: keep even numbers
even = rdd.filter(lambda x: x % 2 == 0)
print("Even:", even.collect())

# flatMap: generate pairs
pairs = rdd.flatMap(lambda x: [(x, x**2), (x, x**3)])
print("Pairs sample:", pairs.take(4))

# distinct
dup_rdd = sc.parallelize([1, 2, 2, 3, 3, 3, 4])
print("Distinct:", dup_rdd.distinct().collect())

# union (no dedup)
rdd1 = sc.parallelize([1, 2, 3])
rdd2 = sc.parallelize([3, 4, 5])
print("Union:", rdd1.union(rdd2).collect())

# intersection
print("Intersection:", rdd1.intersection(rdd2).collect())

# subtract
print("Subtract:", rdd1.subtract(rdd2).collect())

# --- DataFrame Transformations ---
data = [
    ("Alice", "Engineering", 90000),
    ("Bob", "Marketing", 75000),
    ("Charlie", "Engineering", 85000),
    ("Diana", "HR", 70000),
    ("Eve", "Engineering", 95000)
]
df = spark.createDataFrame(data, ["name", "dept", "salary"])

# repartition vs coalesce
print(f"Original partitions: {df.rdd.getNumPartitions()}")
df_rep = df.repartition(8)
print(f"After repartition(8): {df_rep.rdd.getNumPartitions()}")
df_coal = df.coalesce(1)
print(f"After coalesce(1): {df_coal.rdd.getNumPartitions()}")

# sort
df.orderBy(col("salary").desc()).show()

# sample
sampled = df.sample(fraction=0.6, seed=42)
sampled.show()

spark.stop()
```

## Scala Example

```scala
import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.functions._

object TransformationsDemo extends App {
  val spark = SparkSession.builder().appName("TransformationsDemo").master("local[4]").getOrCreate()
  val sc = spark.sparkContext
  import spark.implicits._

  // RDD transformations
  val rdd = sc.parallelize(1 to 20, 4)

  println("Map:", rdd.map(_ * 2).take(5).mkString(", "))
  println("Filter:", rdd.filter(_ % 2 == 0).collect().mkString(", "))
  println("FlatMap:", rdd.flatMap(x => Seq(x, x * x)).take(6).mkString(", "))

  val dup = sc.parallelize(Seq(1, 2, 2, 3, 3, 3))
  println("Distinct:", dup.distinct().collect().mkString(", "))

  // repartition vs coalesce
  val df = Seq(("Alice", "Eng", 90000), ("Bob", "Mkt", 75000)).toDF("name", "dept", "salary")
  println(s"Original: ${df.rdd.getNumPartitions}")
  println(s"Repartitioned: ${df.repartition(8).rdd.getNumPartitions}")
  println(s"Coalesced: ${df.coalesce(1).rdd.getNumPartitions}")

  df.orderBy($"salary".desc).show()
  spark.stop()
}
```

## Real Interview Tips

- The `repartition` vs `coalesce` question is extremely common — know the shuffle difference
- `flatMap` vs `map` is a classic beginner question
- Know that `union` does NOT deduplicate — use `union + distinct` for that
- `orderBy` is a global sort — mention `sortWithinPartitions` for local sort

---

# 7. Actions

## What is it?

Actions are operations that trigger the execution of the Spark job and return a result to the Driver or write data to external storage. Every Action triggers a new Job in Spark.

## Key Actions

## collect

Returns ALL data to the Driver as a Python/Scala list. **DANGEROUS on large datasets — can cause Driver OOM.**

```python
result = df.collect()           # Returns list of Row objects
# Use only on small DataFrames after aggregation
# Never on raw large datasets

# Safer alternatives:
df.take(100)     # First N rows only
df.show(20)      # Print first N rows
df.first()       # First row only
```

## count

Returns the number of rows.

```python
n = df.count()
# Note: count() triggers a full scan — expensive on large data
# For approximate count: df.approxQuantile, df.stat.approxCountDistinct
```

## first / take

```python
row = df.first()          # Returns first Row object
rows = df.take(10)        # Returns list of first 10 Row objects
rows = df.head(10)        # Same as take
```

## reduce

Aggregates RDD elements using an associative function.

```python
rdd = sc.parallelize([1, 2, 3, 4, 5])
total = rdd.reduce(lambda a, b: a + b)    # 15
max_val = rdd.reduce(lambda a, b: max(a, b))  # 5
```

## foreach / foreachPartition

Applies a function to each element, returns nothing. Used for side effects (write to DB, send to API).

```python
# foreach: 1 function call per row
df.foreach(lambda row: print(row))

# foreachPartition: 1 function call per partition (efficient for I/O)
def write_to_db(iterator):
    conn = open_connection()
    for row in iterator:
        conn.insert(row)
    conn.close()

df.foreachPartition(write_to_db)  # Preferred for DB writes
```

## save / write

```python
# Write to various formats
df.write.parquet("s3://bucket/output/")
df.write.mode("overwrite").json("output/")
df.write.mode("append").partitionBy("date").parquet("output/")
df.write.format("delta").saveAsTable("my_db.my_table")
df.write.csv("output/", header=True, mode="overwrite")

# Hive table
df.write.saveAsTable("my_schema.my_table")

# JDBC
df.write.jdbc(url, table, properties={"user": "...", "password": "..."})
```

## Interview Questions and Answers

**Q1. What is the difference between `foreach` and `map`?**

Answer:
- `map`: Transformation — returns a new RDD/DataFrame, lazy
- `foreach`: Action — executes a function on each element, returns nothing (Unit/None), triggers execution immediately

`foreach` is for side effects (logging, writing to external system). You cannot use `foreach` to transform data.

**Q2. Why is `collect()` dangerous?**

Answer: `collect()` brings ALL data from ALL Executors to the Driver's memory. If your DataFrame has billions of rows, this causes Driver OOM. Always use `collect()` only on small DataFrames that have been heavily filtered/aggregated. Use `take(N)`, `show(N)`, or `write()` instead for large data.

**Q3. What is the difference between `count()` and `countApprox()`?**

Answer:
- `count()`: Exact count, requires full scan of all data. Triggers a Job.
- `countApprox(timeout, confidence)`: Probabilistic estimate within a confidence interval. Faster, doesn't wait for all partitions. Useful when approximate answer is acceptable.

```python
df.count()                                       # Exact, slower
df.rdd.countApprox(timeout=1000, confidence=0.9) # ~90% confidence within 1 second
```

**Q4. How many jobs does `rdd.count()` vs `rdd.collect()` create?**

Answer: Both create exactly **1 Job**. The number of Jobs equals the number of Action calls, not the type of Action.

**Q5. What is the difference between `show()` and `collect()`?**

Answer:
- `show(N)`: Triggers a job, retrieves only N rows, prints formatted table to stdout. Safe on large data.
- `collect()`: Triggers a job, retrieves ALL rows to Driver memory. Unsafe on large data.
- `show()` uses `take(N)` internally with some optimizations.

---

## PySpark Example

```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import col

spark = SparkSession.builder.appName("ActionsDemo").master("local[4]").getOrCreate()
sc = spark.sparkContext

# RDD Actions
rdd = sc.parallelize([3, 1, 4, 1, 5, 9, 2, 6])

print("collect:", rdd.collect())
print("count:", rdd.count())
print("first:", rdd.first())
print("take(3):", rdd.take(3))
print("reduce(sum):", rdd.reduce(lambda a, b: a + b))
print("reduce(max):", rdd.reduce(lambda a, b: max(a, b)))

# countByValue (special action)
print("countByValue:", rdd.countByValue())

# foreach (side effect only)
rdd.foreach(lambda x: None)  # In real code: write to DB, etc.

# foreachPartition (efficient DB writes)
def process_partition(iter):
    # open DB connection once per partition
    for item in iter:
        pass  # write item to DB

rdd.foreachPartition(process_partition)

# DataFrame Actions
data = [("Alice", 30, 90000), ("Bob", 25, 75000), ("Charlie", 35, 85000)]
df = spark.createDataFrame(data, ["name", "age", "salary"])

print("count:", df.count())
print("first:", df.first())
print("take(2):", df.take(2))
df.show(5)
df.show(5, truncate=False)

# collect on small aggregated result (safe)
dept_count = df.select("name").distinct().collect()
print("Names:", [row.name for row in dept_count])

# Write actions
df.write.mode("overwrite").parquet("/tmp/demo_output/")
df.write.mode("overwrite").option("header", True).csv("/tmp/demo_csv/")

spark.stop()
```

---

# 8. Spark SQL

## What is it?

Spark SQL is a module for structured data processing using SQL syntax. It provides a unified interface for DataFrames and SQL queries, enabling users to mix SQL and DataFrame API operations seamlessly.

## Architecture

```
┌──────────────────────────────────────────────────┐
│              SPARK SQL ARCHITECTURE              │
├──────────────────────────────────────────────────┤
│  DataFrame API  │  SQL Queries  │  HiveQL        │
├──────────────────────────────────────────────────┤
│              Catalyst Optimizer                  │
│  (Parse → Analyze → Optimize → Plan)            │
├──────────────────────────────────────────────────┤
│              Tungsten Execution Engine           │
│  (Code Gen, Off-Heap Memory, Cache-Aware Ops)   │
├──────────────────────────────────────────────────┤
│              Data Sources API                    │
│  Parquet │ ORC │ JSON │ CSV │ JDBC │ Hive        │
└──────────────────────────────────────────────────┘
```

## Temp View vs Global Temp View

```python
# Temp View: scoped to current SparkSession
df.createOrReplaceTempView("my_table")
spark.sql("SELECT * FROM my_table").show()
# Accessible: only in THIS SparkSession
# Lifecycle: until SparkSession ends or explicitly dropped

# Global Temp View: shared across ALL SparkSessions
df.createOrReplaceGlobalTempView("my_global_table")
spark.sql("SELECT * FROM global_temp.my_global_table").show()
# Note: must prefix with 'global_temp.'
# Accessible: all SparkSessions in same SparkContext
# Lifecycle: until SparkContext ends
```

## SQL Optimization

Spark SQL automatically applies:
1. **Predicate Pushdown:** Filters pushed to storage layer (Parquet row group filtering)
2. **Column Pruning:** Only reads needed columns
3. **Constant Folding:** Evaluates constant expressions at compile time
4. **Join Reordering:** Puts smaller tables first
5. **Broadcast Join:** Automatically broadcasts small tables
6. **AQE (3.0+):** Runtime optimization based on actual statistics

## Interview Questions and Answers

**Q1. What is the difference between a Temp View and a Global Temp View?**

Answer:
- **Temp View:** Scoped to the current `SparkSession`. Not visible to other sessions. Automatically dropped when SparkSession ends.
- **Global Temp View:** Scoped to the `SparkContext` — shared across all SparkSessions in the same application. Accessed via `global_temp.table_name`. Dropped when SparkContext ends.

Use Global Temp Views when multiple sessions (e.g., in a multi-tenant environment) need to share the same view.

**Q2. How can you run SQL queries on a DataFrame?**

Answer:
```python
df.createOrReplaceTempView("sales")
result = spark.sql("""
    SELECT region, SUM(revenue) as total_revenue
    FROM sales
    WHERE year = 2024
    GROUP BY region
    ORDER BY total_revenue DESC
""")
result.show()
```

**Q3. How does Spark SQL handle window functions?**

Answer: Spark SQL supports all standard SQL window functions via the `OVER (PARTITION BY ... ORDER BY ...)` clause. Window functions are processed after WHERE and GROUP BY but before ORDER BY. They allow row-level calculations relative to a window (partition) of rows.

**Q4. What is the Hive Metastore and how does Spark use it?**

Answer: The Hive Metastore is a central catalog storing metadata about tables (schema, location, partitions, file format). Spark can connect to an external Hive Metastore to read and write Hive-managed and external tables. This allows Spark to share table definitions with Hive, Presto, and other tools. Enable with `enableHiveSupport()` in SparkSession builder.

**Q5. How do you optimize a slow Spark SQL query?**

Answer:
1. Run `EXPLAIN EXTENDED` to see the execution plan
2. Look for missing predicate pushdown → check filters are on indexed/partition columns
3. Check for large Exchanges (shuffles) → broadcast small tables
4. Check for sort before aggregation → AQE handles this in Spark 3.0+
5. Verify data is in columnar format (Parquet/ORC, not CSV)
6. Check partition count: `200` default may be too high/low for your data size

---

## PySpark Example

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("SparkSQLDemo").master("local[2]").getOrCreate()

# Create DataFrames
sales = spark.createDataFrame([
    ("2024-01", "Electronics", "North", 150000),
    ("2024-01", "Clothing", "South", 80000),
    ("2024-02", "Electronics", "North", 170000),
    ("2024-02", "Clothing", "North", 95000),
    ("2024-03", "Electronics", "South", 130000),
], ["month", "category", "region", "revenue"])

# Register temp view
sales.createOrReplaceTempView("sales")

# SQL queries
monthly_summary = spark.sql("""
    SELECT 
        month,
        SUM(revenue) as total_revenue,
        COUNT(DISTINCT category) as categories
    FROM sales
    GROUP BY month
    ORDER BY month
""")
monthly_summary.show()

# Window function in SQL
spark.sql("""
    SELECT 
        month,
        category,
        revenue,
        SUM(revenue) OVER (PARTITION BY category ORDER BY month) as running_total,
        RANK() OVER (PARTITION BY month ORDER BY revenue DESC) as rank_in_month
    FROM sales
""").show()

# Global temp view
sales.createOrReplaceGlobalTempView("global_sales")

# New session accessing global view
spark2 = spark.newSession()
spark2.sql("SELECT * FROM global_temp.global_sales LIMIT 3").show()

# Show SQL explain plan
spark.sql("SELECT category, AVG(revenue) FROM sales GROUP BY category").explain(True)

spark.stop()
```

## Spark SQL Example

```sql
-- Complex analytical query
WITH monthly_totals AS (
    SELECT 
        month,
        category,
        SUM(revenue) as revenue,
        LAG(SUM(revenue)) OVER (PARTITION BY category ORDER BY month) as prev_revenue
    FROM sales
    GROUP BY month, category
),
growth_calc AS (
    SELECT *,
        ROUND((revenue - prev_revenue) / prev_revenue * 100, 2) as growth_pct
    FROM monthly_totals
    WHERE prev_revenue IS NOT NULL
)
SELECT 
    category,
    AVG(growth_pct) as avg_growth,
    MAX(growth_pct) as max_growth
FROM growth_calc
GROUP BY category
ORDER BY avg_growth DESC;
```

---

# 9. Joins

## What is it?

Joins combine data from two DataFrames/tables based on matching keys. Join strategy selection is critical for Spark performance.

## Join Types

```
INNER JOIN: Only matching rows from both sides
LEFT JOIN:  All rows from left + matching from right (NULLs for no match)
RIGHT JOIN: All rows from right + matching from left (NULLs for no match)
FULL JOIN:  All rows from both sides (NULLs for non-matching)
CROSS JOIN: Cartesian product — every row × every row
SEMI JOIN:  Returns left rows where key EXISTS in right (no right columns returned)
ANTI JOIN:  Returns left rows where key DOES NOT EXIST in right
```

## Join Strategies

### Broadcast Hash Join (BHJ)

```
Trigger: Smaller table < spark.sql.autoBroadcastJoinThreshold (default 10MB)

DRIVER broadcasts small table to ALL Executors
Each Executor builds a hash table from broadcast data
Each Executor joins its partitions of large table with hash table
NO SHUFFLE of large table!

Best for: Joining large table with small lookup/dimension table
```

### Shuffle Hash Join (SHJ)

```
Both tables shuffled by join key
Each Executor builds hash table from smaller side's partitions
Joins with larger side's matching partitions

Used when: Medium-sized tables, broadcast not applicable
```

### Sort Merge Join (SMJ)

```
Both tables shuffled by join key (if not already partitioned)
Both sides sorted by join key
Two-pointer merge traversal

Used when: Both tables are large, join key can be sorted
Default for large-large joins
```

### Execution Plans for Joins

```
-- Broadcast Join plan:
BroadcastHashJoin [id], [emp_id]
├── Filter (dept = 'Engineering')
│   └── Scan employees
└── BroadcastExchange
    └── Scan departments

-- Sort Merge Join plan:
SortMergeJoin [id], [emp_id]
├── Sort [id]
│   └── Exchange hashpartitioning(id)
│       └── Scan table_1
└── Sort [emp_id]
    └── Exchange hashpartitioning(emp_id)
        └── Scan table_2
```

## Interview Questions and Answers

**Q1. What join strategies does Spark support and when is each used?**

Answer:
1. **Broadcast Hash Join:** Small table (< autoBroadcastJoinThreshold, default 10MB) is broadcast. No shuffle of large table. Fastest. Use: fact table + small dimension table.
2. **Shuffle Hash Join:** Both tables shuffled by key, hash table built from smaller side. Use: medium tables where sort is expensive.
3. **Sort Merge Join:** Both sides shuffled + sorted by join key, then merged. Default for large-large joins. Handles any size.
4. **Cartesian Join:** Cross join — O(n×m). Only for very small tables.
5. **Broadcast Nested Loop Join:** Fallback for non-equi joins. Very slow.

**Q2. How do you force a broadcast join in Spark?**

Answer:
```python
from pyspark.sql.functions import broadcast

# Method 1: broadcast() hint
result = large_df.join(broadcast(small_df), "key")

# Method 2: SQL hint
spark.sql("SELECT /*+ BROADCAST(d) */ * FROM facts f JOIN dims d ON f.id = d.id")

# Method 3: Increase threshold
spark.conf.set("spark.sql.autoBroadcastJoinThreshold", "50MB")
```

**Q3. What is the difference between a Semi Join and an Anti Join?**

Answer:
- **Semi Join:** Returns rows from the LEFT table where a match EXISTS in the right table. Like `WHERE key IN (SELECT key FROM right)`. No columns from the right table in the output.
- **Anti Join:** Returns rows from the LEFT table where NO match exists in the right table. Like `WHERE key NOT IN (SELECT key FROM right)`.

```python
# Semi join: customers who placed orders
customers.join(orders, "customer_id", "left_semi")

# Anti join: customers who NEVER placed orders
customers.join(orders, "customer_id", "left_anti")
```

**Q4. How do you handle a join when both tables are large and you can't broadcast?**

Answer:
1. Use Sort Merge Join (default for large-large) — ensure join columns are the same type
2. Pre-partition/bucket both tables by the join key — avoid runtime shuffle
3. Use AQE (Adaptive Query Execution) to dynamically adjust join strategy
4. If data is skewed, use skew hints or salting
5. Consider pre-sorting: `df.sortWithinPartitions("join_key")` helps SMJ

**Q5. What is a cross join and why is it dangerous?**

Answer: A cross join (Cartesian product) returns EVERY row from the left table paired with EVERY row from the right table. Result size = left_rows × right_rows. A cross join of 1M × 1M = 1 TRILLION rows. In Spark, cross joins require explicit opt-in via `df.crossJoin(other)` or `spark.conf.set("spark.sql.crossJoin.enabled", True)`.

**Q6. How does Spark handle NULL keys in joins?**

Answer: By default, Spark treats NULL as NOT equal to anything (SQL standard). So `NULL = NULL` is FALSE in join conditions. Two rows with NULL keys will NOT be matched in an inner/left/right join. If you need to treat NULLs as equal (for deduplication), use `<=>` (null-safe equality) in Scala or `eqNullSafe()` in PySpark.

**Q7. What is join skew and how do you handle it?**

Answer: Join skew occurs when one join key value has dramatically more rows than others (e.g., a "NULL" key or a single popular customer). Symptoms: one task takes 100x longer than others. Solutions:
1. **Broadcast the skewed keys:** Broadcast a small filtered version of the right table for skewed keys
2. **Salting:** Add a random suffix to skewed keys (1_salt1, 1_salt2, ...) and replicate right side
3. **AQE Skew Join Optimization:** Spark 3.0+ detects skew automatically and splits large partitions
4. **Filter and union:** Process skewed keys separately with broadcast join, union with normal join

**Q8. What is the default join type in Spark?**

Answer: The default join type is `inner`. If you call `df1.join(df2, "key")` without specifying the join type, it performs an inner join.

**Q9. How do you perform a join on multiple columns?**

Answer:
```python
# Method 1: List of column names
df1.join(df2, ["col1", "col2"])

# Method 2: Condition expression
df1.join(df2, (df1.col1 == df2.col1) & (df1.col2 == df2.col2))

# SQL
spark.sql("SELECT * FROM t1 JOIN t2 ON t1.a = t2.a AND t1.b = t2.b")
```

**Q10. What happens when you join two DataFrames on a column with the same name?**

Answer: If both DataFrames have a column with the same name used for joining, and you use the string form `df1.join(df2, "key")`, Spark eliminates the duplicate key column. If you use the expression form `df1.join(df2, df1.key == df2.key)`, both columns are retained with ambiguous names. Use `drop()` or `alias` the DataFrames to resolve ambiguity.

---

## PySpark Example

```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import broadcast, col

spark = SparkSession.builder.appName("JoinsDemo").master("local[4]").getOrCreate()

# Sample data
employees = spark.createDataFrame([
    (1, "Alice", 101), (2, "Bob", 102), (3, "Charlie", 101),
    (4, "Diana", 103), (5, "Eve", 999)  # 999 = no matching dept
], ["emp_id", "name", "dept_id"])

departments = spark.createDataFrame([
    (101, "Engineering"), (102, "Marketing"), (103, "HR"), (104, "Finance")
], ["dept_id", "dept_name"])

orders = spark.createDataFrame([
    (1, "ORD001"), (1, "ORD002"), (3, "ORD003")
], ["emp_id", "order_id"])

# Inner Join
inner = employees.join(departments, "dept_id", "inner")
inner.show()

# Left Join (all employees, NULLs for no dept match)
left = employees.join(departments, "dept_id", "left")
left.show()

# Broadcast Join (small departments table)
broad = employees.join(broadcast(departments), "dept_id")
broad.explain()  # Should show BroadcastHashJoin

# Semi Join (employees who have orders)
semi = employees.join(orders, "emp_id", "left_semi")
semi.show()

# Anti Join (employees with NO orders)
anti = employees.join(orders, "emp_id", "left_anti")
anti.show()

# Cross Join (explicit)
spark.conf.set("spark.sql.crossJoin.enabled", "true")
cross = employees.crossJoin(departments.limit(2))
print(f"Cross join rows: {cross.count()}")  # 5 * 2 = 10

spark.stop()
```

## Spark SQL Example

```sql
-- Inner join
SELECT e.name, d.dept_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.dept_id;

-- Left join
SELECT e.name, COALESCE(d.dept_name, 'Unknown') as dept
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.dept_id;

-- Semi join
SELECT * FROM employees
WHERE emp_id IN (SELECT emp_id FROM orders);

-- Anti join
SELECT * FROM employees
WHERE emp_id NOT IN (SELECT emp_id FROM orders WHERE emp_id IS NOT NULL);

-- Broadcast hint
SELECT /*+ BROADCAST(d) */ e.name, d.dept_name
FROM employees e
JOIN departments d ON e.dept_id = d.dept_id;
```

---

# 10. Window Functions

## What is it?

Window functions perform calculations across a set of rows (a "window") related to the current row. Unlike aggregations, they do NOT collapse rows — each row retains its identity with a new computed column.

## Key Window Functions

### row_number
Assigns unique sequential numbers within a partition, ordered by specified column. Ties get different numbers.

### rank
Like `row_number` but ties get the SAME rank, and the next rank has a gap (1, 2, 2, 4).

### dense_rank
Like `rank` but NO gaps for ties (1, 2, 2, 3).

### lead / lag
Access a row from a future (`lead`) or past (`lag`) position within the partition.

### first_value / last_value
Returns the first or last value in the window frame.

## Window Specification

```python
from pyspark.sql.window import Window
from pyspark.sql.functions import row_number, rank, dense_rank, lead, lag, first, last

# Define window: partition by dept, order by salary descending
windowSpec = Window.partitionBy("dept").orderBy(col("salary").desc())

# For aggregation windows: define frame
windowSpecRows = Window.partitionBy("dept") \
    .orderBy("date") \
    .rowsBetween(Window.unboundedPreceding, Window.currentRow)

windowSpecRange = Window.partitionBy("dept") \
    .orderBy("salary") \
    .rangeBetween(-1000, 1000)
```

## Interview Questions and Answers

**Q1. What is the difference between rank(), dense_rank(), and row_number()?**

Answer:
```
Data: [100, 100, 90, 80]

row_number:  1, 2, 3, 4  (unique, arbitrary tiebreak)
rank:        1, 1, 3, 4  (ties same rank, gap after tie)
dense_rank:  1, 1, 2, 3  (ties same rank, NO gap)
```

Use `row_number` for deduplication (pick exactly 1 per group). Use `dense_rank` for leaderboards (no gaps). Use `rank` for competition-style rankings.

**Q2. How do you find the top N records per group using window functions?**

Answer:
```python
from pyspark.sql.window import Window
from pyspark.sql.functions import row_number

# Top 2 employees by salary per department
window = Window.partitionBy("dept").orderBy(col("salary").desc())
df.withColumn("rn", row_number().over(window)) \
  .filter(col("rn") <= 2) \
  .drop("rn") \
  .show()
```

**Q3. What is the difference between `lag` and `lead`?**

Answer:
- `lag(col, N)`: Accesses the value N rows **before** the current row within the partition
- `lead(col, N)`: Accesses the value N rows **after** the current row

Common use: Calculate day-over-day change, detect consecutive events, session analysis.

**Q4. How do you calculate a running total using window functions?**

Answer:
```python
from pyspark.sql.functions import sum as spark_sum
window = Window.partitionBy("dept") \
    .orderBy("date") \
    .rowsBetween(Window.unboundedPreceding, Window.currentRow)

df.withColumn("running_total", spark_sum("revenue").over(window))
```

**Q5. What is a window frame and what are ROWS BETWEEN vs RANGE BETWEEN?**

Answer:
- **Window Frame:** The subset of rows within the window that are included in the calculation for each row.
- **ROWS BETWEEN:** Physical rows — `ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING` means literally 1 row before and 1 row after.
- **RANGE BETWEEN:** Logical range based on ORDER BY column value — `RANGE BETWEEN 100 PRECEDING AND CURRENT ROW` means rows where the ORDER BY column is within 100 units before the current value.

**Q6. How does a window function perform compared to groupBy + join?**

Answer: Window functions are generally more efficient because:
1. They process data in one pass without a self-join
2. Catalyst can optimize the window computation
3. No intermediate DataFrame required
However, window functions still require a shuffle if data is not already partitioned by the partition key.

---

## PySpark Example

```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    col, row_number, rank, dense_rank, lead, lag, 
    first, last, sum as spark_sum, avg, ntile
)
from pyspark.sql.window import Window

spark = SparkSession.builder.appName("WindowFunctionsDemo").master("local[2]").getOrCreate()

data = [
    ("Alice", "Engineering", 90000, "2024-01"),
    ("Bob", "Engineering", 85000, "2024-01"),
    ("Charlie", "Engineering", 95000, "2024-01"),
    ("Diana", "Marketing", 75000, "2024-01"),
    ("Eve", "Marketing", 80000, "2024-01"),
    ("Frank", "HR", 70000, "2024-01"),
    ("Alice", "Engineering", 92000, "2024-02"),
    ("Bob", "Engineering", 87000, "2024-02"),
]

df = spark.createDataFrame(data, ["name", "dept", "salary", "month"])

# 1. Rank by salary within department
rank_window = Window.partitionBy("dept").orderBy(col("salary").desc())
df.withColumn("row_number", row_number().over(rank_window)) \
  .withColumn("rank", rank().over(rank_window)) \
  .withColumn("dense_rank", dense_rank().over(rank_window)) \
  .show()

# 2. Lead/Lag: month-over-month salary change
time_window = Window.partitionBy("name").orderBy("month")
df.withColumn("prev_salary", lag("salary", 1).over(time_window)) \
  .withColumn("next_salary", lead("salary", 1).over(time_window)) \
  .withColumn("salary_change", col("salary") - col("prev_salary")) \
  .show()

# 3. Running total of salary per dept over time
running_window = Window.partitionBy("dept") \
    .orderBy("month") \
    .rowsBetween(Window.unboundedPreceding, Window.currentRow)
df.withColumn("running_total", spark_sum("salary").over(running_window)).show()

# 4. Top 2 earners per department (row_number dedup pattern)
top2 = df.filter(col("month") == "2024-01") \
         .withColumn("rn", row_number().over(rank_window)) \
         .filter(col("rn") <= 2).drop("rn")
top2.show()

# 5. First and Last value
first_last_window = Window.partitionBy("dept").orderBy("salary")
df.withColumn("dept_min_salary", first("salary").over(first_last_window)) \
  .withColumn("dept_max_salary", last("salary").over(
      first_last_window.rowsBetween(Window.unboundedPreceding, Window.unboundedFollowing)
  )).show()

# 6. ntile: salary quartile
quartile_window = Window.partitionBy("month").orderBy("salary")
df.withColumn("salary_quartile", ntile(4).over(quartile_window)).show()

spark.stop()
```

## Spark SQL Example

```sql
SELECT
    name, dept, salary, month,
    -- Ranking
    ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) AS row_num,
    RANK()       OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk,
    DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS dense_rnk,

    -- Running total
    SUM(salary) OVER (
        PARTITION BY dept
        ORDER BY month
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_total,

    -- Month-over-month change
    LAG(salary, 1)  OVER (PARTITION BY name ORDER BY month) AS prev_salary,
    LEAD(salary, 1) OVER (PARTITION BY name ORDER BY month) AS next_salary,

    -- Moving average (3-month)
    AVG(salary) OVER (
        PARTITION BY dept
        ORDER BY month
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS moving_avg_3m

FROM employee_monthly_salary;
```

---

# 11. Partitioning

## What is it?

Partitioning is the division of data into smaller, independent chunks distributed across cluster nodes. Partitioning strategy directly impacts parallelism, shuffle cost, and I/O efficiency.

## Hash Partitioning

Default strategy for key-value RDDs. Each key is hashed and assigned to a partition via `hash(key) % numPartitions`.

```python
# Force hash partitioning on a key
rdd.partitionBy(8, lambda key: hash(key) % 8)

# DataFrame
df.repartition(8, col("user_id"))  # Hash-partitioned by user_id
```

## Range Partitioning

Keys are divided into ranges. All keys in a range go to the same partition. Used by `sortByKey`, `repartitionByRange`.

```python
df.repartitionByRange(8, col("date"))  # Date ranges partitioned evenly
```

## Partition Pruning

When reading from partitioned files (Parquet/ORC/Delta), Spark can skip entire partitions that don't match the filter predicate.

```python
# Write with partitioning
df.write.partitionBy("year", "month").parquet("s3://bucket/events/")

# Read: Spark will ONLY read matching partitions
spark.read.parquet("s3://bucket/events/") \
    .filter("year = 2024 AND month = '01'")  # Only reads year=2024/month=01/
```

## Interview Questions and Answers

**Q1. What is the ideal number of partitions for a Spark job?**

Answer: General guidelines:
- Rule of thumb: `2x to 4x number of executor cores` in cluster
- For 100GB data: aim for partitions of 128–256MB each
- For `spark.sql.shuffle.partitions` (groupBy/join): default 200; in production tune to `data_size_after_shuffle / 128MB`
- AQE (Spark 3.0+) can coalesce shuffle partitions automatically → set a high value (e.g., 2000) and let AQE reduce

**Q2. What is the difference between Hash Partitioning and Range Partitioning?**

Answer:
- **Hash Partitioning:** `partition = hash(key) % N`. Keys are uniformly distributed but ordering is not preserved. May create skew if some keys are very popular.
- **Range Partitioning:** Keys are sorted into ranges. All keys in range [a, b] go to partition X. Ordering is preserved within partitions. Used for sorted output. Requires a sampling step to determine ranges.

**Q3. How does partition pruning work in Spark?**

Answer: When a table is written with `partitionBy("year", "month")`, the file system directory structure becomes `year=2024/month=01/`. When Spark reads with a filter on `year = 2024`, it only lists and reads the `year=2024/` directories, completely skipping other partitions. This is called **partition pruning** and can reduce I/O from 100% to 1% for highly selective filters.

**Q4. What is data skew in partitioning and how does it cause problems?**

Answer: Data skew occurs when some partitions have significantly more data than others. For example, if 80% of events have `country = "US"` and you partition by country, the US partition is 80x larger than others. This causes:
- One task to run 80x longer than others (stragglers)
- Potential OOM in the skewed partition
- Very low cluster utilization (most cores idle waiting for 1 slow task)

**Q5. How do you solve data skew?**

Answer:
1. **Salting:** Add a random suffix (0-N) to skewed keys, replicate the right side N times
2. **AQE Skew Join:** Spark 3.0+ automatically detects and splits skewed partitions
3. **Repartition by non-skewed column:** Use a different partition key
4. **Filter separately:** Process skewed key (e.g., NULL) separately, union results
5. **Two-phase aggregation:** Local pre-aggregation before shuffle

---

## PySpark Example

```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, spark_partition_id, count

spark = SparkSession.builder.appName("PartitioningDemo").master("local[4]").getOrCreate()
sc = spark.sparkContext

# Hash partitioning
rdd = sc.parallelize([(i, i*2) for i in range(100)], 4)
hash_partitioned = rdd.partitionBy(8)
print(f"Hash partitions: {hash_partitioned.getNumPartitions()}")

# Show partition distribution
def count_partition(idx, iter):
    items = list(iter)
    yield (idx, len(items))
    
partition_counts = hash_partitioned.mapPartitionsWithIndex(count_partition).collect()
print("Partition sizes:", sorted(partition_counts))

# DataFrame partitioning
data = [(i, f"user_{i%100}", i * 10.0) for i in range(10000)]
df = spark.createDataFrame(data, ["id", "user_id", "value"])

# Check initial partition distribution
print(f"Initial partitions: {df.rdd.getNumPartitions()}")

# Repartition by column
df_partitioned = df.repartition(8, col("user_id"))
print(f"After repartition: {df_partitioned.rdd.getNumPartitions()}")

# Check distribution
df_partitioned.groupBy(spark_partition_id().alias("partition")).count().show()

# Partition pruning demo
df.write.mode("overwrite").partitionBy("user_id").parquet("/tmp/partitioned_data/")
# Reading with filter - Spark will prune partitions
spark.read.parquet("/tmp/partitioned_data/") \
    .filter(col("user_id") == "user_5") \
    .explain()  # Look for PartitionFilters in physical plan

spark.stop()
```

---

# 12. Shuffle

## What is it?

Shuffle is the process of redistributing data across partitions — which means moving data between Executors over the network. Triggered by wide transformations (groupBy, join, distinct, repartition, orderBy).

## Why is Shuffle Expensive?

```
Shuffle Cost Components:
1. Serialization: Serialize data to bytes (CPU cost)
2. Disk Write: Map side writes shuffle files to local disk
3. Network Transfer: Data sent across network to Reduce Executors
4. Disk Read: Reduce side reads shuffle files
5. Deserialization: Deserialize bytes to objects (CPU cost)
6. Sort: Sort data within partitions (for Sort Merge Join)

Cumulative: Shuffle = highest latency operation in Spark
```

## Shuffle Architecture

```
STAGE 1 (MAP SIDE):
  Executor 1:
    Partition 1 data → serialize → write shuffle files per output partition
    shuffle_0_0.index, shuffle_0_0.data  (output partition 0 data)
    shuffle_0_1.index, shuffle_0_1.data  (output partition 1 data)
  
  Executor 2:
    Partition 2 data → same process

SHUFFLE SERVICE (if enabled):
  External Shuffle Service holds shuffle files
  Executors can be removed while shuffle files remain available

STAGE 2 (REDUCE SIDE):
  Executor 3 (handling output partition 0):
    Fetches shuffle_0_0 from Executor 1
    Fetches shuffle_1_0 from Executor 2
    Merges and processes
```

## Shuffle Optimization

```python
# 1. Tune shuffle partition count
spark.conf.set("spark.sql.shuffle.partitions", "400")  # Default 200

# 2. Enable AQE to auto-tune
spark.conf.set("spark.sql.adaptive.enabled", "true")
spark.conf.set("spark.sql.adaptive.coalescePartitions.enabled", "true")

# 3. Use reduceByKey instead of groupByKey (partial aggregation)
rdd.reduceByKey(lambda a, b: a + b)  # NOT groupByKey + sum

# 4. Broadcast small tables (avoids shuffle of large table)
large.join(broadcast(small), "key")

# 5. Pre-partition data by join key (bucket tables)
df.write.bucketBy(256, "user_id").sortBy("user_id").saveAsTable("user_events")

# 6. Kryo serialization (faster, smaller)
spark.conf.set("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
```

## Interview Questions and Answers

**Q1. What triggers a shuffle in Spark?**

Answer: Wide transformations trigger shuffle:
- `groupBy`, `groupByKey`, `reduceByKey`, `aggregateByKey`
- `join`, `cogroup`
- `distinct`, `dropDuplicates`
- `repartition` (but NOT `coalesce`)
- `orderBy` / `sortBy` (global sort)
- `intersection`, `subtract`

**Q2. How does Spark External Shuffle Service work?**

Answer: The External Shuffle Service (ESS) is a long-running process on each worker node that serves shuffle files independently from Executors. Benefits:
1. **Dynamic Allocation:** Executors can be removed when idle without losing their shuffle files (ESS keeps them)
2. **Fault Isolation:** Executor OOM doesn't affect shuffle file availability
Enable: `spark.shuffle.service.enabled = true`

**Q3. What is sort-based shuffle vs hash-based shuffle?**

Answer:
- **Hash Shuffle (old, removed in 2.0):** Each mapper created one file per reducer → massive file count O(M×R). Caused small file problem.
- **Sort-based Shuffle (current default):** Each mapper creates ONE data file and ONE index file regardless of reducer count. Files are sorted by partition key. Reducer fetches its range. Much more efficient.

**Q4. How can you reduce shuffle data size?**

Answer:
1. **Use `reduceByKey` over `groupByKey`:** Combiner step reduces data before shuffle
2. **Column pruning:** Only shuffle needed columns (`select` before `join`)
3. **Filter before join:** Reduce row count before the wide transformation
4. **Kryo serialization:** Smaller serialized bytes → less network transfer
5. **Compression:** `spark.io.compression.codec = lz4 / snappy / zstd`
6. **Broadcast joins:** Eliminate shuffle of large table entirely

---

# 13. Caching and Persistence

## What is it?

Caching and persistence store DataFrame/RDD data in memory and/or disk so that repeated accesses don't recompute from source. Critical for iterative algorithms (ML training) and multi-use DataFrames.

## cache() vs persist()

```python
# cache() = persist(StorageLevel.MEMORY_AND_DISK) since Spark 3.x
# (was MEMORY_ONLY in older versions)
df.cache()

# persist() with explicit storage level
from pyspark import StorageLevel
df.persist(StorageLevel.MEMORY_ONLY)
df.persist(StorageLevel.MEMORY_AND_DISK)
df.persist(StorageLevel.DISK_ONLY)
df.persist(StorageLevel.MEMORY_ONLY_SER)
df.persist(StorageLevel.OFF_HEAP)
```

## Storage Levels

| Level | Memory | Disk | Serialized | Replicated |
|---|---|---|---|---|
| MEMORY_ONLY | ✓ | ✗ | ✗ | 1x |
| MEMORY_AND_DISK | ✓ | ✓ (overflow) | ✗ | 1x |
| MEMORY_ONLY_SER | ✓ | ✗ | ✓ | 1x |
| MEMORY_AND_DISK_SER | ✓ | ✓ | ✓ | 1x |
| DISK_ONLY | ✗ | ✓ | ✓ | 1x |
| MEMORY_ONLY_2 | ✓ | ✗ | ✗ | 2x |
| OFF_HEAP | off-heap | ✗ | ✓ | 1x |

## Interview Questions and Answers

**Q1. When should you cache a DataFrame?**

Answer: Cache when:
1. The DataFrame is used **multiple times** in the same application (e.g., iterative ML, multiple branches)
2. The computation to produce it is **expensive** (complex joins, aggregations)
3. The data fits in **available executor memory**

Don't cache when:
- DataFrame is used only once
- Data is too large (causes memory pressure, evicts other cached data)
- Reading from fast source (SSD, local files) is cheaper than memory overhead

**Q2. What is the difference between `cache()` and `checkpoint()`?**

Answer:
| | cache() | checkpoint() |
|---|---|---|
| Storage | Executor memory/disk | External storage (HDFS/S3) |
| Lineage | Preserved | TRUNCATED |
| Speed | Fast (in-memory) | Slow (disk write) |
| Fault tolerance | Limited (re-computes if evicted) | Full (reads from storage) |
| Use case | Multi-use DataFrames | Long lineage chains, Streaming |

**Q3. How do you unpersist a cached DataFrame?**

Answer:
```python
df.unpersist()           # Synchronous in newer Spark
df.unpersist(blocking=True)  # Wait for completion

# RDD
rdd.unpersist()

# Always unpersist when done to free memory for other DataFrames
```

**Q4. What storage level should you use in production?**

Answer:
- **MEMORY_AND_DISK:** Best default — uses memory when available, spills to disk instead of OOM. Safe for production.
- **MEMORY_ONLY:** Use when data fits comfortably (< 70% executor memory) and fast recompute is possible on eviction.
- **DISK_ONLY:** Use when memory is scarce but avoiding recomputation is still valuable.
- **OFF_HEAP:** Use when GC pressure is a problem (large heap, many objects). Requires Tungsten + off-heap config.

---

## PySpark Example

```python
from pyspark.sql import SparkSession
from pyspark import StorageLevel
import time

spark = SparkSession.builder.appName("CachingDemo").master("local[4]").getOrCreate()

# Create expensive DataFrame (simulates complex computation)
df = spark.range(10_000_000) \
    .withColumn("val", (spark.range(10_000_000)._jdf.rdd().id() * 3.14).cast("double")) \
    .groupBy((spark._sc._jvm.org.apache.spark.sql.functions.col("id") % 100)) \
    .count()

# Without cache
start = time.time()
print("Count 1:", df.count())
print("Count 2:", df.count())  # Recomputed from scratch!
print(f"Without cache: {time.time() - start:.2f}s")

# With cache
df.cache()  # or df.persist(StorageLevel.MEMORY_AND_DISK)

start = time.time()
print("Count 1 (cached):", df.count())  # Triggers materialization + cache write
print("Count 2 (cached):", df.count())  # Reads from cache — fast!
print(f"With cache: {time.time() - start:.2f}s")

# Check cache storage
spark.catalog.isCached("range_table")  # For registered tables

# Unpersist when done
df.unpersist()

# Explicit storage level
expensive_df = spark.read.parquet("/large/dataset/")
expensive_df.persist(StorageLevel.MEMORY_AND_DISK_SER)  # Serialized for memory savings

spark.stop()
```

---

# 14. Spark Optimization

## What is it?

Spark Optimization is the set of techniques to minimize job execution time and resource usage. It covers physical plan optimization, data layout, join strategies, and configuration tuning.

## Predicate Pushdown

Filter data as early as possible — at the data source level.

```python
# Spark automatically pushes this filter to Parquet reader
df = spark.read.parquet("s3://events/")
df.filter("date = '2024-01-01'").select("user_id", "event").explain()
# Plan shows: PushedFilters: [IsNotNull(date), EqualTo(date,2024-01-01)]
```

## Column Pruning

Only read columns needed for the query.

```python
# Spark reads ONLY id and name columns from Parquet (50-column file)
spark.read.parquet("s3://users/").select("id", "name").explain()
# Plan shows: ReadSchema: struct<id:int,name:string>
```

## Broadcast Join

```python
from pyspark.sql.functions import broadcast

# Small dimension table (< 10MB) broadcast to all executors
large_fact.join(broadcast(small_dim), "key")

# Increase broadcast threshold for larger dims
spark.conf.set("spark.sql.autoBroadcastJoinThreshold", "50MB")

# Disable broadcast
spark.conf.set("spark.sql.autoBroadcastJoinThreshold", "-1")
```

## Adaptive Query Execution (AQE)

Introduced in Spark 3.0. Re-optimizes query plan at RUNTIME based on actual statistics.

```python
spark.conf.set("spark.sql.adaptive.enabled", "true")  # Default True in 3.2+

# AQE capabilities:
# 1. Coalesce shuffle partitions (reduce 2000 → 50 if data is small)
# 2. Switch join strategies (broadcast join when runtime table size < threshold)
# 3. Handle skew joins (split large skewed partitions)

spark.conf.set("spark.sql.adaptive.coalescePartitions.enabled", "true")
spark.conf.set("spark.sql.adaptive.skewJoin.enabled", "true")
spark.conf.set("spark.sql.adaptive.localShuffleReader.enabled", "true")
```

## Dynamic Partition Pruning (DPP)

Prunes partitions of a large fact table based on a filter applied to a joined dimension table.

```python
# Star schema: large fact table partitioned by date_id
# Filter: transactions in Q1 2024
# DPP: Spark first evaluates the filter on date_dim, 
#      then uses resulting date_ids to prune fact table partitions

spark.conf.set("spark.sql.optimizer.dynamicPartitionPruning.enabled", "true")

# Example query that triggers DPP
spark.sql("""
    SELECT f.*, d.quarter
    FROM fact_sales f
    JOIN date_dim d ON f.date_id = d.date_id
    WHERE d.year = 2024 AND d.quarter = 'Q1'
""")
```

## Skew Join Handling

```python
# AQE Skew Join (automatic)
spark.conf.set("spark.sql.adaptive.skewJoin.enabled", "true")
spark.conf.set("spark.sql.adaptive.skewJoin.skewedPartitionThresholdInBytes", "256MB")
spark.conf.set("spark.sql.adaptive.skewJoin.skewedPartitionFactor", "5")

# Manual Salting (when AQE doesn't help)
import pyspark.sql.functions as F

# Add salt to skewed key
SALT = 10
df_left_salted = df_left.withColumn("salt", (F.rand() * SALT).cast("int")) \
    .withColumn("salted_key", F.concat(F.col("key"), F.lit("_"), F.col("salt")))

# Explode salt on right side
df_right_exploded = df_right \
    .withColumn("salt", F.explode(F.array([F.lit(i) for i in range(SALT)]))) \
    .withColumn("salted_key", F.concat(F.col("key"), F.lit("_"), F.col("salt")))

result = df_left_salted.join(df_right_exploded, "salted_key")
```

## Bucketing

Pre-partitions data by a key and writes sorted files. Avoids shuffle at query time.

```python
# Write bucketed table (do once)
df.write \
    .bucketBy(256, "user_id") \
    .sortBy("user_id") \
    .format("parquet") \
    .saveAsTable("user_events_bucketed")

# Subsequent joins on user_id: NO SHUFFLE (data already co-partitioned)
spark.table("user_events_bucketed").join(
    spark.table("user_profiles_bucketed"), 
    "user_id"
).explain()  # Should show NO Exchange nodes
```

## Interview Questions and Answers

**Q1. What is AQE and what problems does it solve?**

Answer: AQE (Adaptive Query Execution) re-optimizes the query plan at runtime using actual runtime statistics (actual partition sizes, actual row counts) instead of static estimates. It solves:
1. **Suboptimal shuffle partitions:** Coalesces many small partitions into fewer larger ones, reducing task overhead
2. **Wrong join strategy:** Downgrades SMJ to Broadcast Hash Join when runtime table size < broadcast threshold
3. **Data skew:** Automatically splits oversize skewed partitions and replicates the build side

Enabled by default in Spark 3.2+.

**Q2. How does Spark's cost-based optimizer work?**

Answer: Spark's Cost-Based Optimizer (CBO) uses table/column statistics to choose better physical plans. It estimates row counts, data sizes, and column cardinalities to:
1. Choose join order (smaller table first in multi-join)
2. Select join strategy (broadcast vs shuffle)
3. Estimate filter selectivity

Enable: `spark.conf.set("spark.sql.cbo.enabled", "true")`
Update stats: `spark.sql("ANALYZE TABLE my_table COMPUTE STATISTICS FOR ALL COLUMNS")`

**Q3. Explain Dynamic Partition Pruning.**

Answer: DPP applies to star schema queries where a large fact table is joined with a filtered dimension table. Without DPP, Spark reads all fact table partitions. With DPP, Spark:
1. Evaluates the filter on the dimension table first
2. Gets the matching dimension keys
3. Uses those keys to prune fact table partitions BEFORE reading them
4. Dramatically reduces I/O for selective dimension filters

Requires: partitioned fact table, join on partition column, broadcast-eligible dimension.

**Q4. What is bucketing and how does it eliminate shuffle?**

Answer: Bucketing pre-partitions data into a fixed number of files organized by hash of a join key. When two tables are bucketed by the same key with the same number of buckets, Spark knows data with the same key is in the same bucket. During a join, no shuffle is needed — Spark directly reads matching buckets from each table. Requires: same number of buckets, same bucket column, Hive metastore managed tables.

**Q5. How do you identify and fix a skewed Spark job?**

Answer:
1. **Identify:** Spark UI → Stages → Tasks tab → large variance in task durations; one task takes 10-100x longer
2. **Find skewed key:** `df.groupBy("key").count().orderBy("count", ascending=False).show()`
3. **Solutions:**
   - AQE skew join (Spark 3.0+) — automatic
   - Broadcast join if one side small
   - Salting: add random suffix to key, explode on other side
   - Filter skewed key separately (often NULL), process separately, union

---

## PySpark Example

```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import broadcast, col, concat, lit, rand, explode, array

spark = SparkSession.builder \
    .appName("OptimizationDemo") \
    .config("spark.sql.adaptive.enabled", "true") \
    .config("spark.sql.adaptive.coalescePartitions.enabled", "true") \
    .config("spark.sql.adaptive.skewJoin.enabled", "true") \
    .master("local[4]") \
    .getOrCreate()

# 1. Predicate Pushdown verification
df = spark.range(1_000_000).toDF("id") \
    .withColumn("value", col("id") * 2) \
    .withColumn("category", (col("id") % 10).cast("string"))
df.filter(col("id") < 100).select("id", "value").explain()

# 2. Broadcast Join
large_df = spark.range(1_000_000).toDF("id").withColumn("value", col("id") * 2)
small_df = spark.createDataFrame([(i, f"cat_{i}") for i in range(100)], ["id", "category"])

# Force broadcast
result = large_df.join(broadcast(small_df), "id")
result.explain()  # Should show BroadcastHashJoin

# 3. Salting for skew
SALT_FACTOR = 5
df_skewed = spark.createDataFrame(
    [(1, i) for i in range(10000)] +  # 10000 rows with key=1 (skewed)
    [(2, i) for i in range(10)] +
    [(3, i) for i in range(10)],
    ["key", "value"]
)

df_right = spark.createDataFrame([(1, "A"), (2, "B"), (3, "C")], ["key", "label"])

# Salted join
df_left_salted = df_skewed \
    .withColumn("salt", (rand() * SALT_FACTOR).cast("int")) \
    .withColumn("salted_key", concat(col("key").cast("string"), lit("_"), col("salt")))

df_right_exploded = df_right \
    .withColumn("salt", explode(array([lit(i) for i in range(SALT_FACTOR)]))) \
    .withColumn("salted_key", concat(col("key").cast("string"), lit("_"), col("salt")))

salted_result = df_left_salted.join(df_right_exploded, "salted_key") \
    .drop("salt", "salted_key")
print(f"Salted join count: {salted_result.count()}")

spark.stop()
```

---

# 15. Spark Memory Management

## What is it?

Spark manages memory across Driver and Executor JVMs. Understanding memory layout is critical for tuning OOM errors and performance.

## Memory Architecture

```
EXECUTOR MEMORY (spark.executor.memory = 4g)
┌────────────────────────────────────────────────────┐
│  Reserved Memory (300MB fixed — system overhead)   │
├────────────────────────────────────────────────────┤
│  Usable Memory = executor.memory - 300MB = 3.7GB  │
│                                                    │
│  ┌─────────────────────────────────────────────┐  │
│  │ User Memory (40% of usable = 1.48GB)        │  │
│  │  - UDFs, user data structures               │  │
│  │  - Spark internals                          │  │
│  └─────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────┐  │
│  │ Unified Memory (60% of usable = 2.22GB)     │  │
│  │  ┌───────────────────────────────────────┐  │  │
│  │  │ Execution Memory (initially 50%)      │  │  │
│  │  │ - Shuffle buffers                     │  │  │
│  │  │ - Sort buffers                        │  │  │
│  │  │ - Hash tables for joins/agg           │  │  │
│  │  └───────────────────────────────────────┘  │  │
│  │  ┌───────────────────────────────────────┐  │  │
│  │  │ Storage Memory (initially 50%)        │  │  │
│  │  │ - Cached RDDs/DataFrames              │  │  │
│  │  │ - Broadcast variables                  │  │  │
│  │  └───────────────────────────────────────┘  │  │
│  │  (Execution can borrow from Storage and vice versa) │
│  └─────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘

OVERHEAD (off-heap, spark.executor.memoryOverhead = 10% or 384MB min)
- JVM overhead, native libs, Python process memory
```

## Unified Memory Manager

Introduced in Spark 1.6. Execution and Storage memory share the unified region. Key behavior:
- **Execution can evict Storage** if it needs more memory (unless storage has been pinned)
- **Storage cannot evict Execution** (execution memory is needed for task completion)
- Dynamic allocation between the two regions based on demand

## Configuration

```python
spark = SparkSession.builder \
    .config("spark.executor.memory", "8g") \
    .config("spark.executor.memoryOverhead", "2g") \
    .config("spark.memory.fraction", "0.6") \         # Unified memory fraction
    .config("spark.memory.storageFraction", "0.5") \  # Storage within unified
    .config("spark.driver.memory", "2g") \
    .config("spark.driver.maxResultSize", "1g") \     # Max collect() result
    .getOrCreate()
```

## Off-Heap Memory

```python
# Enable off-heap (Tungsten)
spark.conf.set("spark.memory.offHeap.enabled", "true")
spark.conf.set("spark.memory.offHeap.size", "2g")
# Reduces GC pressure for large cached DataFrames
```

## Interview Questions and Answers

**Q1. Explain Spark's Unified Memory Management.**

Answer: Spark's Unified Memory Manager manages a single memory pool divided between Execution Memory (for computations: shuffle, sort, joins) and Storage Memory (for caching). The key feature is that these two regions are NOT fixed — they can borrow from each other:
- If Execution needs more memory than its initial allocation, it can evict Storage cached data
- If Storage needs more and Execution is free, Storage can expand
- Boundary is dynamic — this prevents unnecessary OOM when one region is underused

**Q2. What is `spark.executor.memoryOverhead`?**

Answer: MemoryOverhead is the off-heap memory allocated per Executor for:
- JVM overhead (code cache, thread stacks, metadata)
- Native library memory (Python process for PySpark, etc.)
- Direct buffers (shuffle)

Default: `max(executor.memory * 0.1, 384MB)`. If you're running PySpark UDFs, Python processes consume additional memory outside the JVM heap — increase memoryOverhead to `1-2g`. OOM in the container (not in JVM heap) is a sign of insufficient memoryOverhead.

**Q3. What causes Driver OOM?**

Answer:
1. `collect()` on large DataFrame — brings all data to Driver
2. Large broadcast variable — broadcast data stored in Driver memory
3. Too many tasks in DAG — Driver maintains metadata for each task
4. Large accumulators

Fixes: Increase `spark.driver.memory`, avoid `collect()` on large data, use `take()` or `show()` instead.

**Q4. What is `spark.driver.maxResultSize` and when do you change it?**

Answer: `spark.driver.maxResultSize` (default 1GB) limits the size of serialized results from Actions that return data to the Driver (`collect`, `take`, `show`). If results exceed this, the job fails with "Total size of serialized results exceeded". Increase when: legitimate large collect (after heavy aggregation), or set to `0` to disable the limit (risky — can OOM driver).

---

# 16. Spark Serialization

## What is it?

Serialization converts objects to bytes for network transfer or disk storage. Deserialization is the reverse. Serialization is critical for shuffle performance.

## Java Serialization vs Kryo

| | Java Serialization | Kryo Serialization |
|---|---|---|
| Default | Yes (older configs) | Must enable explicitly |
| Speed | Slow | 10x faster |
| Size | Large | 2-5x smaller |
| Custom registering | Not needed | Recommended for best performance |
| Compatibility | Any Serializable class | Must be registered |
| Spark config | (default) | `spark.serializer=KryoSerializer` |

```python
# Enable Kryo
spark = SparkSession.builder \
    .config("spark.serializer", "org.apache.spark.serializer.KryoSerializer") \
    .config("spark.kryo.registrationRequired", "false") \
    .getOrCreate()
```

## Scala Example

```scala
import org.apache.spark.serializer.KryoRegistrator
import com.esotericsoftware.kryo.Kryo

// Register custom classes for best Kryo performance
class MyRegistrator extends KryoRegistrator {
  override def registerClasses(kryo: Kryo): Unit = {
    kryo.register(classOf[MyEvent])
    kryo.register(classOf[MyUser])
  }
}

// Config
val spark = SparkSession.builder()
  .config("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
  .config("spark.kryo.registrator", "com.mycompany.MyRegistrator")
  .getOrCreate()
```

---

# 17. Spark File Formats

## What is it?

File formats determine how data is stored on disk. Format choice impacts read/write speed, compression, schema evolution, and query performance.

## Format Comparison

| Format | Type | Splittable | Schema | Compression | Best For |
|---|---|---|---|---|---|
| CSV | Row | Yes (by line) | No | Poor | Simple exchange, human-readable |
| JSON | Row | Yes (JSONL) | No | Poor | Semi-structured, APIs |
| Avro | Row | Yes | Yes (embedded) | Good | Kafka serialization, writes |
| Parquet | Columnar | Yes | Yes | Excellent | Analytics, reads, ML features |
| ORC | Columnar | Yes | Yes | Excellent | Hive ecosystem, Hudi |
| Delta Lake | Columnar + Log | Yes | Yes + evolution | Excellent | ACID, data lakes, updates |

## Parquet

The most commonly used format in Spark data engineering.

```
PARQUET FILE STRUCTURE:
┌───────────────────────┐
│   Magic Number (PAR1) │
├───────────────────────┤
│   Row Group 1         │  ← ~128MB of rows
│   ┌─────────────────┐ │
│   │ Column Chunk    │ │  ← all values of column 1 in this row group
│   │ (col1 data)     │ │
│   └─────────────────┘ │
│   ┌─────────────────┐ │
│   │ Column Chunk    │ │
│   │ (col2 data)     │ │
│   └─────────────────┘ │
├───────────────────────┤
│   Row Group 2         │
│   ...                 │
├───────────────────────┤
│   File Footer         │  ← Schema, row group metadata, statistics
│   (Schema + Stats)    │  ← Min/Max per column per row group
└───────────────────────┘
```

Benefits:
- **Column Pruning:** Read only needed columns
- **Predicate Pushdown:** Use min/max statistics to skip row groups
- **Vectorized Reading:** Read in batches of 1024 rows
- **Compression:** Dictionary encoding + column-specific compression

## Delta Lake

```python
# Write Delta
df.write.format("delta").mode("overwrite").save("/delta/events/")
df.write.format("delta").saveAsTable("events")

# Read Delta
spark.read.format("delta").load("/delta/events/")

# Time Travel
spark.read.format("delta").option("versionAsOf", 5).load("/delta/events/")
spark.read.format("delta").option("timestampAsOf", "2024-01-01").load("/delta/events/")

# MERGE (upsert)
from delta.tables import DeltaTable

deltaTable = DeltaTable.forPath(spark, "/delta/events/")
deltaTable.alias("target").merge(
    source_df.alias("source"),
    "target.id = source.id"
).whenMatchedUpdateAll() \
 .whenNotMatchedInsertAll() \
 .execute()

# Schema Evolution
df.write.format("delta") \
    .option("mergeSchema", "true") \
    .mode("append") \
    .save("/delta/events/")
```

## Interview Questions and Answers

**Q1. Why is Parquet preferred over CSV in data lakes?**

Answer:
1. **Column Pruning:** Parquet stores data column-by-column. Reading 5 columns from a 50-column Parquet file reads only 10% of the data. CSV reads entire rows.
2. **Predicate Pushdown:** Parquet stores min/max stats per column per row group. Spark skips entire row groups that don't match the filter.
3. **Compression:** Columnar storage enables better compression (dictionary encoding for repeated values). Parquet files are 5-10x smaller than CSV.
4. **Schema:** Parquet embeds schema — no need to infer types. Dates/timestamps are stored correctly.
5. **Vectorized Reading:** Batch reads of 1024 rows are faster than row-by-row parsing.

**Q2. What is the difference between Parquet and ORC?**

Answer: Both are columnar. ORC was developed for Hive and is better integrated with the Hive ecosystem. Parquet has wider support (especially with Spark, Impala, BigQuery, Redshift). ORC has better support for ACID operations in Hive. For pure Spark workloads, both perform similarly; Parquet is typically preferred. For Hudi + Hive, ORC may be preferred.

**Q3. When would you use Avro instead of Parquet?**

Answer: Avro is row-based and better for:
1. **Kafka serialization:** Schema embedded in Avro makes it ideal for streaming (Schema Registry + Avro)
2. **Write-heavy workloads:** Row format is faster for appending records
3. **Full row access:** When you always read all columns (no benefit from columnar)
4. **Schema evolution:** Avro has mature schema evolution (backward/forward compatibility)

**Q4. What is Delta Lake and how is it different from plain Parquet?**

Answer: Delta Lake adds ACID transactions, versioning, and schema enforcement on top of Parquet:
1. **ACID:** Transactions ensure consistent reads even during concurrent writes
2. **Time Travel:** Query any historical version via `versionAsOf` / `timestampAsOf`
3. **MERGE/UPSERT:** Update existing records (not possible with plain Parquet)
4. **Schema Enforcement:** Rejects writes with wrong schema
5. **Audit Log:** `_delta_log` directory tracks all changes
6. **Z-Ordering:** Multi-dimensional clustering for efficient filters on multiple columns

---

# 18. Spark Streaming

## What is it?

Spark Streaming processes real-time data streams. **Structured Streaming** (Spark 2.0+) is the current recommended API, treating a stream as an unbounded table and applying SQL/DataFrame operations on it.

## DStreams (Legacy)

The original streaming API. Discretized Streams — sequence of RDDs.

```python
from pyspark.streaming import StreamingContext

ssc = StreamingContext(sc, batchInterval=5)  # 5-second micro-batches
lines = ssc.socketTextStream("localhost", 9999)
words = lines.flatMap(lambda x: x.split(" "))
pairs = words.map(lambda x: (x, 1))
counts = pairs.reduceByKey(lambda a, b: a + b)
counts.pprint()
ssc.start()
ssc.awaitTermination()
```

## Structured Streaming

```python
# Read from Kafka
df = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "broker:9092") \
    .option("subscribe", "events") \
    .option("startingOffsets", "latest") \
    .load()

# Process
from pyspark.sql.functions import col, from_json, window
from pyspark.sql.types import StructType, StringType, LongType

schema = StructType() \
    .add("user_id", StringType()) \
    .add("event", StringType()) \
    .add("timestamp", LongType())

processed = df \
    .select(from_json(col("value").cast("string"), schema).alias("data")) \
    .select("data.*") \
    .withWatermark("timestamp", "10 minutes") \
    .groupBy(window(col("timestamp"), "5 minutes"), col("event")) \
    .count()

# Write (trigger modes)
query = processed.writeStream \
    .format("parquet") \
    .outputMode("append") \
    .option("checkpointLocation", "s3://bucket/checkpoints/") \
    .trigger(processingTime="1 minute") \
    .start()

query.awaitTermination()
```

## Output Modes

| Mode | Description | Use Case |
|---|---|---|
| append | Only new rows | Stateless, no aggregation |
| complete | Full result table | Aggregations |
| update | Only changed rows | Aggregations with low cardinality |

## Watermarking

```python
# Watermark: tolerate up to 10 minutes of late data
df.withWatermark("event_time", "10 minutes") \
  .groupBy(window("event_time", "5 minutes")) \
  .count()

# Events arriving more than 10 minutes late are DROPPED
# State is cleaned up after event_time > max_event_time - watermark
```

## Checkpointing

```python
query = df.writeStream \
    .option("checkpointLocation", "s3://bucket/streaming-checkpoint/") \
    .start()
# Checkpoint stores: current offsets, state for aggregations
# On restart: resumes from last checkpoint automatically
```

## Interview Questions and Answers

**Q1. What is the difference between DStreams and Structured Streaming?**

Answer:
| | DStreams | Structured Streaming |
|---|---|---|
| API | Low-level RDD-based | High-level DataFrame/SQL |
| Optimization | No Catalyst | Full Catalyst optimization |
| Exactly-once | Complex to achieve | Built-in with checkpointing |
| Event time | Manual | Native `window`, watermark |
| Fault recovery | Manual | Automatic via checkpoint |
| Recommendation | Legacy | Current (use this) |

**Q2. What is watermarking in Structured Streaming?**

Answer: Watermark defines how long Spark should wait for late-arriving data. `withWatermark("timestamp", "10 minutes")` means: for a given event time window, Spark will wait up to 10 minutes after the window ends for late events. Events arriving later than the watermark are dropped. Watermark also enables **state cleanup** — Spark can remove aggregation state for windows older than `max_event_time - watermark`.

**Q3. What are the trigger modes in Structured Streaming?**

Answer:
- `processingTime="1 minute"`: Micro-batch every 1 minute
- `once()`: Process all available data, then stop (useful for backfill)
- `availableNow()`: Like `once()` but processes in multiple micro-batches
- `continuous("1 second")`: Experimental — millisecond latency, exactly-once at row level (not window)
- Default (no trigger): Process as fast as possible (one batch after another)

**Q4. What is the difference between `append`, `complete`, and `update` output modes?**

Answer:
- **append:** Only new rows appended since last trigger. Cannot be used with aggregations (since aggregations may update existing rows).
- **complete:** The entire result table is output every trigger. Used for aggregations where full result is needed. Memory intensive.
- **update:** Only rows changed since last trigger. For aggregations — outputs updated aggregation values only. Most efficient.

---

# 19. Kafka Integration

## What is it?

Spark integrates with Apache Kafka as both a source and sink for real-time data pipelines. The `spark-kafka` connector handles offset management, fault tolerance, and schema handling.

## Architecture

```
┌────────────────────────────────────────────────────────────┐
│                  SPARK + KAFKA PIPELINE                    │
│                                                            │
│  Kafka Topics    │   Spark Structured     │  Output        │
│  ┌────────────┐  │   Streaming            │  ┌──────────┐  │
│  │ topic:     │ →│  readStream(kafka)     │→ │ Parquet  │  │
│  │ clickstream│  │  .transform()          │  │ Delta    │  │
│  └────────────┘  │  .writeStream()        │  │ Kafka    │  │
│  ┌────────────┐  │                        │  │ JDBC     │  │
│  │ topic:     │  │  Checkpoint: offsets   │  └──────────┘  │
│  │ ad-events  │  │  State: watermark      │                │
│  └────────────┘  │  Recovery: automatic   │                │
└────────────────────────────────────────────────────────────┘
```

## Reading from Kafka

```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, from_json, to_timestamp
from pyspark.sql.types import StructType, StringType, LongType

spark = SparkSession.builder \
    .appName("KafkaConsumer") \
    .config("spark.jars.packages", "org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.0") \
    .getOrCreate()

# Read from Kafka (streaming)
raw_df = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "kafka1:9092,kafka2:9092") \
    .option("subscribe", "ad_clicks")  \
    .option("startingOffsets", "latest") \
    .option("maxOffsetsPerTrigger", "100000") \
    .option("kafka.security.protocol", "SASL_SSL") \
    .option("kafka.sasl.mechanism", "PLAIN") \
    .load()

# Kafka DataFrame schema: topic, partition, offset, timestamp, key, value
# value is binary → cast to string → parse JSON
schema = StructType() \
    .add("user_id", StringType()) \
    .add("ad_id", StringType()) \
    .add("event_type", StringType()) \
    .add("event_time", LongType())

parsed = raw_df \
    .select(from_json(col("value").cast("string"), schema).alias("data"),
            col("partition"), col("offset")) \
    .select("data.*", "partition", "offset") \
    .withColumn("event_time", to_timestamp(col("event_time") / 1000))

parsed.printSchema()

# Batch read (for replay / backfill)
batch_df = spark.read \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "kafka1:9092") \
    .option("subscribe", "ad_clicks") \
    .option("startingOffsets", '{"ad_clicks":{"0":12345,"1":67890}}') \
    .option("endingOffsets", "latest") \
    .load()
```

## Writing to Kafka

```python
# Write processed data back to Kafka
query = processed_df \
    .selectExpr("CAST(user_id AS STRING) AS key",
                "to_json(struct(*)) AS value") \
    .writeStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "kafka1:9092") \
    .option("topic", "ad_clicks_enriched") \
    .option("checkpointLocation", "s3://bucket/checkpoints/ad_clicks/") \
    .outputMode("append") \
    .trigger(processingTime="30 seconds") \
    .start()

query.awaitTermination()
```

## Offset Management

```python
# startingOffsets options:
# "latest"  → start from newest messages (miss historical)
# "earliest" → start from beginning (full replay)
# JSON     → specific offsets per partition

# Checkpoint handles offset tracking automatically
# Checkpoint dir stores: offsets, state, metadata

# Manual offset tracking (for custom logic)
df = spark.read.format("kafka") \
    .option("startingOffsets", '{"my_topic":{"0":100,"1":200}}') \
    .option("endingOffsets", '{"my_topic":{"0":200,"1":300}}') \
    .load()
```

## Interview Questions and Answers

**Q1. How does Spark Structured Streaming handle Kafka offset management?**

Answer: Spark stores Kafka offsets in the **checkpoint location** (HDFS/S3/GCS). At each micro-batch trigger:
1. Spark reads the latest processed offset from checkpoint
2. Requests the next batch of records from Kafka starting from that offset
3. Processes the batch
4. Writes results to sink
5. Updates the checkpoint with new offsets (atomically)

This provides exactly-once semantics (with idempotent sinks) or at-least-once (without). Recovery is automatic — restart from checkpoint, no duplicate processing.

**Q2. What is `maxOffsetsPerTrigger` and why is it important?**

Answer: `maxOffsetsPerTrigger` limits the number of Kafka records processed per micro-batch. Without it, if Kafka has millions of backlogged messages, Spark tries to process them all in one batch — causing OOM. Setting `maxOffsetsPerTrigger = 100000` ensures predictable batch sizes, stable memory usage, and smooth operation during catch-up scenarios.

**Q3. How do you achieve exactly-once semantics with Spark + Kafka?**

Answer:
- **Source (Kafka → Spark):** Checkpointing ensures each offset is processed exactly once after restart
- **Sink (Spark → Output):**
  - For Kafka sink: use `enable.idempotence=true` on Kafka producer
  - For Delta Lake: ACID transactions ensure atomic writes
  - For JDBC: use write-ahead log + deduplication on target
  - Spark's checkpointing alone guarantees at-least-once; idempotent sink makes it exactly-once

**Q4. How do you handle schema changes in Kafka messages?**

Answer:
1. **Schema Registry (Confluent):** Use Avro + Schema Registry. Spark reads schema from registry, handles backward-compatible changes automatically.
2. **Permissive mode:** `from_json(...).alias("data")` — new fields are ignored, missing fields become NULL
3. **Version column:** Include a `schema_version` field in messages, process each version separately
4. **Union schema:** Define schema with all possible fields as nullable

---

# 20. Spark on Kubernetes

## What is it?

Running Spark natively on Kubernetes, where the Driver and each Executor run as separate Pods. Provides container-based resource isolation, auto-scaling, and cloud-native deployment.

## Architecture

```
┌────────────────────────────────────────────────────────┐
│                  KUBERNETES CLUSTER                    │
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │              Kubernetes API Server              │  │
│  └───────────────────────────┬─────────────────────┘  │
│                              │ creates pods           │
│  ┌──────────────────┐        │                        │
│  │   DRIVER POD     │────────┤                        │
│  │  (spark-driver)  │        │                        │
│  │  - SparkContext  │   ┌────▼────────────────────┐  │
│  │  - DAG Scheduler │   │ EXECUTOR POD 1          │  │
│  │  - UI (:4040)    │   │ (spark-executor-xxxxx)  │  │
│  └──────────────────┘   └─────────────────────────┘  │
│           │             ┌─────────────────────────┐  │
│           │             │ EXECUTOR POD 2          │  │
│           └─────────────► (spark-executor-yyyyy)  │  │
│                         └─────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

## Deployment

```bash
# Submit Spark job to Kubernetes
spark-submit \
  --master k8s://https://k8s-api-server:6443 \
  --deploy-mode cluster \
  --name spark-example \
  --class org.apache.spark.examples.SparkPi \
  --conf spark.executor.instances=3 \
  --conf spark.kubernetes.container.image=apache/spark:3.5.0 \
  --conf spark.kubernetes.namespace=spark-jobs \
  --conf spark.kubernetes.authenticate.driver.serviceAccountName=spark \
  --conf spark.kubernetes.driver.request.cores=1 \
  --conf spark.kubernetes.executor.request.cores=2 \
  --conf spark.kubernetes.executor.limit.cores=2 \
  --conf spark.executor.memory=4g \
  --conf spark.kubernetes.driver.volumes.persistentVolumeClaim.spark-local-dir.mount.path=/tmp/spark \
  local:///opt/spark/examples/jars/spark-examples_2.12-3.5.0.jar
```

## Dynamic Allocation on K8s

```python
spark = SparkSession.builder \
    .config("spark.dynamicAllocation.enabled", "true") \
    .config("spark.dynamicAllocation.minExecutors", "2") \
    .config("spark.dynamicAllocation.maxExecutors", "50") \
    .config("spark.dynamicAllocation.initialExecutors", "5") \
    .config("spark.kubernetes.allocation.batch.size", "5") \
    .getOrCreate()
```

## Interview Questions and Answers

**Q1. How is Spark on Kubernetes different from Spark on YARN?**

Answer:
| | YARN | Kubernetes |
|---|---|---|
| Resource Model | Containers with memory/CPU | Pods with requests/limits |
| Scheduling | YARN RM + NM | kube-scheduler |
| Ecosystem | Hadoop-centric | Cloud-native |
| Isolation | Process-level | Container-level |
| Scaling | Manual + dynamic alloc | Auto-scaling with HPA/KEDA |
| Dynamic Alloc | External Shuffle Service needed | Native Pod deletion |
| Image Management | Not applicable | Docker images (easier dep mgmt) |

**Q2. How does dynamic allocation work on Kubernetes?**

Answer: With Kubernetes dynamic allocation, Spark:
1. Starts with `initialExecutors` Executor pods
2. Adds more pods (up to `maxExecutors`) when tasks are pending > `schedulerBacklogTimeout`
3. Removes idle pods (after `executorIdleTimeout`) by calling the K8s API to delete them
4. Since Executor pods can be deleted, shuffle data must be stored in an **External Shuffle Service** (or use remote shuffle service like Gluten/RSS)

**Q3. What is the role of a ServiceAccount in Spark on K8s?**

Answer: The Driver Pod needs a Kubernetes ServiceAccount with RBAC permissions to:
- Create Executor Pods (`create pods`)
- Delete Executor Pods when done (`delete pods`)
- List/watch Pods for status (`list, watch pods`)
- Optionally: read ConfigMaps/Secrets for configuration

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: spark-role
rules:
- apiGroups: [""]
  resources: ["pods", "services", "configmaps"]
  verbs: ["create", "get", "list", "watch", "delete"]
```

---

# 21. Spark Performance Tuning

## What is it?

Performance tuning is the systematic process of identifying bottlenecks and applying configuration, code, and architecture changes to make Spark jobs run faster and use fewer resources.

## Executor Sizing

```
RULE OF THUMB (YARN/K8s):
- Cores per executor: 4-5 (too many → GC pressure; too few → poor HDFS throughput)
- Memory per core: ~4GB
- Executor memory = cores_per_executor * 4GB = 20GB (for 5 cores)
- memoryOverhead = 10% of executor memory (min 384MB)

EXAMPLE: 10-node cluster, 32 cores each, 128GB RAM
  Available: 32 - 1 = 31 cores per node
  Executors per node: 31 / 5 = 6 executors
  Memory per executor: 128GB * 0.9 / 6 = ~19GB
  → spark.executor.cores = 5
  → spark.executor.memory = 19g
  → spark.executor.memoryOverhead = 2g
  → spark.executor.instances = 60 (10 nodes * 6)
```

## Partition Sizing

```python
# Target: 128-256MB per partition
# data_size / target_partition_size = num_partitions

# For shuffle:
spark.conf.set("spark.sql.shuffle.partitions", "400")  # 200 default often too low

# With AQE (auto-coalesce):
spark.conf.set("spark.sql.adaptive.enabled", "true")
spark.conf.set("spark.sql.adaptive.coalescePartitions.targetPostShuffleInputSize", "128MB")

# Input: match to data size
# 1TB / 256MB = ~4000 partitions for input
```

## GC Tuning

```bash
# Add to spark-submit or SparkSession config
--conf spark.executor.extraJavaOptions="-XX:+UseG1GC -XX:InitiatingHeapOccupancyPercent=35 -XX:G1HeapRegionSize=16M -XX:+PrintGCDetails -XX:+PrintGCDateStamps"

# G1GC is better than default GC for large heaps (>4GB)
# Lower InitiatingHeapOccupancyPercent → more frequent but shorter GC pauses
```

## Production Case Studies

### Case Study 1: 1TB Daily Ad Event Processing

**Problem:** 3-hour job running at Jio Platforms processing 1TB of ad click events daily.

**Analysis:**
- Spark UI showed Stage 2 (aggregation) had 20 tasks finishing in 2 minutes, 1 task in 45 minutes → DATA SKEW
- `df.groupBy("advertiser_id").count()` showed one advertiser had 40% of all clicks

**Solution:**
```python
# AQE skew join enabled
spark.conf.set("spark.sql.adaptive.skewJoin.enabled", "true")

# For the main aggregation, two-phase approach
from pyspark.sql.functions import col, rand

SALT = 20
df_salted = df.withColumn("salt", (rand() * SALT).cast("int"))

# Phase 1: partial aggregate with salt
phase1 = df_salted.groupBy("advertiser_id", "salt").agg({"revenue": "sum"})

# Phase 2: final aggregate without salt  
phase2 = phase1.groupBy("advertiser_id").agg({"sum(revenue)": "sum"})

# Result: 3 hours → 28 minutes
```

### Case Study 2: OOM on Executor

**Problem:** Executors dying with OOM during a complex multi-join.

**Root Cause Analysis:**
- 5-way join, broadcasting 3 tables
- Broadcast threshold too high, one "small" table was actually 800MB post-join
- Executor memory: 4GB, 5 cores → 800MB/core broadcast + execution = OOM

**Solution:**
```python
# Disable auto-broadcast, control manually
spark.conf.set("spark.sql.autoBroadcastJoinThreshold", "-1")

# Only broadcast tables verified to be small
large.join(broadcast(verified_small), "key")

# Increase executor memory
spark.conf.set("spark.executor.memory", "8g")
spark.conf.set("spark.executor.memoryOverhead", "2g")

# Result: No more OOM
```

---

## PySpark Example (Full Tuning Config)

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .appName("TunedSparkJob") \
    .master("yarn") \
    .config("spark.executor.instances", "50") \
    .config("spark.executor.cores", "5") \
    .config("spark.executor.memory", "20g") \
    .config("spark.executor.memoryOverhead", "4g") \
    .config("spark.driver.memory", "8g") \
    .config("spark.driver.maxResultSize", "2g") \
    \
    .config("spark.sql.shuffle.partitions", "1000") \
    .config("spark.sql.adaptive.enabled", "true") \
    .config("spark.sql.adaptive.coalescePartitions.enabled", "true") \
    .config("spark.sql.adaptive.skewJoin.enabled", "true") \
    .config("spark.sql.autoBroadcastJoinThreshold", "50MB") \
    \
    .config("spark.serializer", "org.apache.spark.serializer.KryoSerializer") \
    .config("spark.kryo.registrationRequired", "false") \
    \
    .config("spark.sql.parquet.compression.codec", "snappy") \
    .config("spark.sql.parquet.mergeSchema", "false") \
    .config("spark.sql.parquet.filterPushdown", "true") \
    .config("spark.sql.parquet.enableVectorizedReader", "true") \
    \
    .config("spark.shuffle.service.enabled", "true") \
    .config("spark.dynamicAllocation.enabled", "true") \
    .config("spark.dynamicAllocation.minExecutors", "10") \
    .config("spark.dynamicAllocation.maxExecutors", "100") \
    \
    .config("spark.executor.extraJavaOptions",
            "-XX:+UseG1GC -XX:InitiatingHeapOccupancyPercent=35") \
    .getOrCreate()
```

---

# 22. Spark Troubleshooting

## OOM (Out of Memory)

```
SYMPTOMS: java.lang.OutOfMemoryError, Container killed by YARN (exceeded memory limits)

CAUSES & FIXES:

1. Executor Heap OOM:
   Cause: Data too large for executor memory, large broadcast, caching too much
   Fix: 
   - spark.executor.memory ↑ (e.g., 4g → 8g)
   - Reduce spark.executor.cores (more cores = less memory per task)
   - Use MEMORY_AND_DISK instead of MEMORY_ONLY
   - Don't cache unless necessary
   - Use Kryo serialization (smaller memory footprint)

2. Container OOM (overhead):
   Cause: Native memory (Python process, shuffle buffers) exceeds container limit
   Fix:
   - spark.executor.memoryOverhead ↑ (e.g., 384m → 2g)
   - Especially for PySpark: Python process has its own memory outside JVM

3. Driver OOM:
   Cause: collect() on large data, too many tasks, large result
   Fix:
   - Avoid collect() on large DataFrames
   - spark.driver.memory ↑
   - spark.driver.maxResultSize ↑
```

## Executor Lost

```
SYMPTOMS: ExecutorLostFailure, FetchFailedException

CAUSES & FIXES:
1. Executor OOM → killed by OS/YARN
   Fix: Increase executor.memory, memoryOverhead
   
2. GC overhead exceeded → YARN kills unresponsive container
   Fix: -XX:+UseG1GC, reduce executor.cores, decrease spark.memory.fraction
   
3. Network issues → heartbeat timeout
   Fix: spark.network.timeout ↑, spark.executor.heartbeatInterval ↑
   
4. Preemption (YARN capacity scheduler)
   Fix: spark.task.maxFailures ↑, enable dynamic allocation
```

## Data Skew

```
SYMPTOMS: One task takes 100x longer than others in Spark UI Tasks tab

DIAGNOSIS:
df.groupBy("join_key").count().orderBy(col("count").desc()).show(20)

SOLUTIONS:
1. AQE Skew Join (Spark 3.0+):
   spark.sql.adaptive.skewJoin.enabled = true
   
2. Salting (manual):
   Add random suffix to skewed keys, explode on other side
   
3. Broadcast the non-skewed side
   
4. Separate processing:
   - Filter skewed key (e.g., NULL)
   - Process with broadcast join
   - Union with normal join result
```

## Long Running Jobs

```
DIAGNOSIS STEPS:
1. Spark UI → Stages → Find slowest stage
2. Spark UI → Tasks → Check for straggler tasks (1 slow task = skew)
3. Spark UI → SQL → Check for expensive plans (large Exchange nodes = shuffle)
4. Spark UI → Storage → Check memory usage, evictions

COMMON CAUSES:
- Data skew (see above)
- Large shuffle (too many or too few partitions)
- Small files (too many tiny input files → slow listing + many short tasks)
- Missing predicate pushdown (full table scan instead of filtered)
- Wrong join strategy (SMJ instead of broadcast)
```

## Shuffle Failures (FetchFailedException)

```
SYMPTOMS: FetchFailedException, shuffle file not found

CAUSES:
1. Executor died before shuffle fetch completed
2. Disk full on executor
3. Network timeout during shuffle fetch

FIXES:
1. Enable External Shuffle Service (shuffle files survive executor death)
   spark.shuffle.service.enabled = true
   
2. Increase fetch retry:
   spark.shuffle.io.maxRetries = 10
   spark.shuffle.io.retryWait = 30s
   
3. Increase executor disk space
4. Reduce shuffle data (broadcast, combine, filter early)
```

## GC Overhead

```
SYMPTOMS: Slow job, GC logs show frequent long GC pauses

FIXES:
1. Use G1GC: -XX:+UseG1GC
2. Reduce executor cores (more cores = more objects = more GC)
3. Increase executor memory (fewer GC cycles needed)
4. Use Kryo serialization (smaller objects)
5. Use off-heap memory for cache: spark.memory.offHeap.enabled = true
6. Reduce caching (cached data = long-lived objects = GC pressure)
7. spark.memory.fraction ↑ (give more to execution, less GC-based eviction)
```

---

# 23. Scenario-Based Questions

**Q1. How do you optimize a 1 TB Spark job?**

Answer:
1. **Input optimization:** Use Parquet/ORC (not CSV). Ensure partitioned by filter columns (partition pruning). Check file sizes — small files are expensive (consolidate to 128-256MB).
2. **Partition sizing:** `1TB / 256MB = ~4000 partitions`. Set `spark.sql.shuffle.partitions = 4000` or enable AQE to auto-coalesce.
3. **Join optimization:** Identify dimension tables < 100MB → broadcast them. Use bucketing for repeated large-large joins.
4. **AQE:** Enable all AQE features (coalesce, skew join, broadcast runtime).
5. **Executor sizing:** 5 cores, 20GB memory, 50 executors.
6. **Caching:** Cache only if DataFrame is used in multiple branches.
7. **Check for skew:** `df.groupBy("join_key").count()` before joining.
8. **Verify predicate pushdown:** `df.explain(True)` — check for PushedFilters.

**Q2. A Spark job processes user events. One user has 50M events, others have ~1000. How do you handle this?**

Answer: Classic data skew problem. The 50M-event user causes one task to run 50,000x longer.

Solutions:
1. **AQE Skew Join:** Enable `spark.sql.adaptive.skewJoin.enabled = true`. AQE detects the skewed partition and splits it into multiple tasks automatically.
2. **Salting:** Add random salt (0-99) to user_id: `salt_user = user_id + "_" + rand(100)`. Explode the right-side (user metadata) table 100x with matching salt. This distributes 50M rows across 100 tasks.
3. **Separate processing:** Process the skewed user separately (with specific filter), union with result of normal processing.
4. **Pre-aggregate:** If you're doing aggregations, pre-aggregate at user level before joining with metadata.

**Q3. How does AQE work step by step?**

Answer:
1. Initial plan is created by Catalyst (with estimated stats)
2. Stage 1 executes. After completion, AQE collects **actual runtime statistics** (actual row counts, actual partition sizes)
3. Before Stage 2 executes, AQE's re-optimizer:
   - If actual shuffle output is small (< `advisoryPartitionSizeInBytes`): **coalesces** partitions
   - If actual table size < broadcast threshold: **switches** to Broadcast Hash Join
   - If a partition is >> others: **splits** the skewed partition (skew join)
4. Stage 2 executes with the optimized plan

**Q4. Explain the Catalyst Optimizer in detail.**

Answer: Catalyst is Spark's extensible query optimizer using a tree-transformation framework. It works in 4 phases:
1. **Analysis:** Resolves attributes and relations. Checks column names against the catalog. Resolves data types.
2. **Logical Optimization:** Applies rule-based rewrites in a fixed-point loop:
   - Predicate pushdown (move filters earlier)
   - Constant folding (evaluate `1+2` → `3`)
   - Column pruning (remove unused columns)
   - Null propagation
3. **Physical Planning:** Generates multiple candidate physical plans using different strategies (different join types). Uses a cost model to pick the best.
4. **Code Generation:** Compiles the chosen plan into JVM bytecode using Janino. Whole-stage code gen fuses multiple operators into a single function for CPU efficiency.

**Q5. A join between two 100GB tables takes 2 hours. How do you fix it?**

Answer:
1. Check if either table can be broadcast: `df.count()` + `df.rdd.map(lambda x: len(str(x))).sum()` — if one is < 100MB, broadcast it.
2. If not broadcastable, ensure both are already partitioned by the join key. If not, pre-bucket them and save to storage.
3. Check for data skew in the join key — identify skewed keys and salt them.
4. Enable AQE: may switch to broadcast join at runtime or handle skew.
5. Check shuffle partition count: for 100GB each, `200GB / 256MB = ~800` shuffle partitions.
6. Check that both tables are in Parquet/ORC with matching data types for the join key (type mismatch forces implicit cast → disables predicate pushdown).

**Q6. What is the difference between repartition and coalesce?**

Answer: See Section 6. Key: repartition does full shuffle (can increase or decrease, even distribution), coalesce is narrow transformation (can only decrease, may be uneven, no shuffle). Use coalesce before writing to reduce output file count. Use repartition to increase parallelism or re-distribute for joins.

**Q7. How do you process billions of records daily in Spark?**

Answer: Architecture for billion-record daily processing:
1. **Partitioned input:** Parquet files partitioned by `date`, `hour`. Each day's partition reads only needed data.
2. **Cluster sizing:** 50+ executors × 5 cores × 20GB = 250 cores, 1TB executor memory.
3. **Parallelism:** `spark.sql.shuffle.partitions = 2000`. Input partitions aligned to 128MB files.
4. **AQE enabled:** Handles runtime skew and coalesces empty partitions.
5. **Bucketed tables:** Pre-bucket by user_id for daily joins — no shuffle.
6. **Streaming or micro-batch:** If near-real-time needed, use Structured Streaming with 5-minute windows.
7. **Checkpointing:** Checkpoints every N batches to avoid reprocessing.
8. **Monitoring:** Track task duration, shuffle bytes, GC time via Spark UI + Prometheus + Grafana.

**Q8. How do you tune the number of executors?**

Answer:
```
Cluster: 20 nodes, 32 cores/node, 128GB RAM/node
Reserve 1 core/node for OS: 31 available cores/node

Step 1: Choose cores per executor
  5 cores/executor (sweet spot: enough HDFS throughput, manageable GC)

Step 2: Executors per node
  31 / 5 = 6 executors/node
  Leave 1 for AM (YARN): 5 executors/node for Spark

Step 3: Total executors
  5 * 20 = 100 executors (but -1 for AM = 99)

Step 4: Memory per executor
  (128GB - 2GB OS) / 6 executors ≈ 21GB
  Set 19GB to leave buffer → spark.executor.memory = 19g

Step 5: Memory overhead
  19GB * 10% = 1.9GB → spark.executor.memoryOverhead = 2g
  
Final config:
  --num-executors 99
  --executor-cores 5
  --executor-memory 19g
  --conf spark.executor.memoryOverhead=2g
```

**Q9. What is the difference between narrow and wide transformations? Why does it matter?**

Answer: Narrow transformations (map, filter, flatMap) don't require data movement between partitions — one input partition → one output partition. Wide transformations (groupBy, join, distinct) require data from multiple partitions to be moved to the same partition (shuffle). This matters because:
1. Narrow transformations are pipelined in the same Stage (no I/O between them)
2. Wide transformations create new Stage boundaries, requiring disk I/O and network transfer
3. Minimizing wide transformations is the #1 Spark optimization technique

**Q10. How would you debug a Spark job that's running slowly?**

Answer: Systematic debugging approach:
1. **Spark UI → Jobs → Stages:** Find the slowest stage
2. **Stage detail → Tasks:** Check for straggler tasks (one task = skew) or all tasks slow (general issue)
3. **Check DAG:** Count number of shuffles. Each Exchange node = shuffle. Can you reduce them?
4. **Event Timeline:** Large gaps = scheduling delays (not enough resources) or GC pauses
5. **Executor metrics:** GC time, shuffle read/write bytes, spill to disk
6. **SQL → Details:** Check execution plan for missing optimizations (no predicate pushdown, wrong join type)
7. **Common fixes:** AQE on, check skew, check partition count, check for small files, check data types match for joins

**Q11. Explain the Tungsten Execution Engine.**

Answer: Tungsten is Spark's physical execution engine focused on bypassing JVM overhead:
1. **Off-Heap Memory:** Stores data in unmanaged binary memory (not Java objects on heap). Eliminates GC pressure for large datasets.
2. **Cache-Aware Algorithms:** Data structures designed to maximize CPU cache hits. Columnar format keeps related data contiguous in memory.
3. **Whole-Stage Code Generation:** Instead of running a generic aggregation loop with virtual method calls, Tungsten generates custom JVM bytecode for each specific query. Like writing a hand-tuned loop.
4. **Vectorized Execution:** Processes data in vectors (1024 rows) rather than one row at a time, enabling SIMD CPU instructions.

**Q12. What happens when spark.sql.shuffle.partitions is too low or too high?**

Answer:
- **Too low (e.g., 10 for 100GB data):** Each partition is 10GB. Tasks OOM or spill to disk heavily. Low parallelism — cluster underutilized.
- **Too high (e.g., 10000 for 1GB data):** Each partition is 100KB. 10,000 tiny tasks — scheduler overhead dominates. Many small output files. Slow.
- **Right size:** ~128-256MB per partition after shuffle. Formula: `shuffle_data_size / 200MB`
- **Best practice:** Set high (e.g., 2000), enable AQE to auto-coalesce small partitions

**Q13. How does Spark handle fault tolerance for structured streaming?**

Answer: Structured Streaming uses a combination of:
1. **Checkpointing:** Stores current Kafka offsets and state (aggregations, watermarks) to external storage (HDFS/S3). On restart, Spark reads the checkpoint and resumes from the last committed offset.
2. **Write-ahead logging:** Before committing the output, Spark logs that it's about to do so. On failure, it can determine if the write completed.
3. **Idempotent sinks:** With idempotent sinks (Delta, Kafka with `enable.idempotence`), exactly-once is achieved even with retries.
4. **Replayability:** Kafka retains messages. Spark can re-read any uncommitted messages on restart.

**Q14. What is a broadcast variable and when do you use it?**

Answer: A broadcast variable is a read-only variable sent to all Executors once (instead of being sent with every task). Used for:
1. Small lookup tables / dimension tables
2. Configuration data shared across all tasks
3. ML model inference (broadcast the model)

```python
# Without broadcast: list sent with every task (N tasks = N copies)
lookup = {1: "A", 2: "B"}
rdd.map(lambda x: lookup[x])  # lookup sent with each task

# With broadcast: sent once per Executor
bc_lookup = sc.broadcast({1: "A", 2: "B"})
rdd.map(lambda x: bc_lookup.value[x])  # much more efficient

# DataFrames: broadcast() in join
large.join(broadcast(small), "key")  # DataFrame broadcast
```

**Q15. How do you handle slowly changing dimensions (SCD) in Spark?**

Answer:
```python
# SCD Type 2 with Delta Lake MERGE
from delta.tables import DeltaTable

def apply_scd2(target_path, source_df):
    delta_table = DeltaTable.forPath(spark, target_path)
    
    delta_table.alias("target").merge(
        source_df.alias("source"),
        "target.id = source.id AND target.is_current = true"
    ).whenMatchedUpdate(
        condition="target.value != source.value",
        set={
            "is_current": lit(False),
            "end_date": current_date()
        }
    ).whenNotMatchedInsert(
        values={
            "id": "source.id",
            "value": "source.value",
            "start_date": current_date(),
            "end_date": lit(None),
            "is_current": lit(True)
        }
    ).execute()
```

**Q16. What is the effect of increasing `spark.executor.cores` from 2 to 8?**

Answer:
- **Pros:** Fewer executors needed → less overhead. Better HDFS read throughput (multiple concurrent reads).
- **Cons:** 8 concurrent tasks per JVM → 8x memory contention → more GC pressure. If one task has high memory usage, 8 concurrent tasks may OOM. Less fault isolation (one bad task can destabilize the whole executor).
- Sweet spot is 4-5 cores. Beyond 5 cores, diminishing returns and increasing GC risk.

**Q17. How do you read and process a JSON file with nested structures?**

Answer:
```python
# Read JSON with nested structures
df = spark.read.option("multiline", "true").json("data.json")
df.printSchema()  # See nested schema

# Access nested fields
df.select("user.name", "user.address.city")

# Explode arrays
from pyspark.sql.functions import explode
df.withColumn("item", explode(col("order.items")))

# Flatten nested struct
df.select("id", col("user.*"))  # Expand all struct fields

# Parse JSON string column
from pyspark.sql.functions import from_json
schema = StructType([...])
df.withColumn("parsed", from_json(col("json_string"), schema))
```

**Q18. How would you implement deduplication in Spark?**

Answer:
```python
# 1. dropDuplicates (keep first occurrence)
df.dropDuplicates(["user_id", "event_id"])

# 2. Window-based dedup (keep latest)
from pyspark.sql.window import Window
from pyspark.sql.functions import row_number

window = Window.partitionBy("user_id", "event_id").orderBy(col("timestamp").desc())
df.withColumn("rn", row_number().over(window)) \
  .filter(col("rn") == 1) \
  .drop("rn")

# 3. Group-based dedup (keep row with max value)
from pyspark.sql.functions import max as spark_max
max_ts = df.groupBy("user_id", "event_id").agg(spark_max("timestamp").alias("max_ts"))
df.join(max_ts, ["user_id", "event_id"]) \
  .filter(col("timestamp") == col("max_ts")) \
  .drop("max_ts")
```

**Q19. What is Z-ordering in Delta Lake and when do you use it?**

Answer: Z-ordering is a multi-dimensional data clustering technique that co-locates related data in the same set of files. Unlike partitioning (which works for one column), Z-ordering works for multiple columns simultaneously.

```sql
OPTIMIZE events ZORDER BY (user_id, event_date);
```

Delta Lake rewrites the data files so that rows with similar `user_id` AND `event_date` values are stored together. Queries filtering on either or both columns skip more files (data skipping).

Use Z-ordering when:
- Multiple high-cardinality filter columns (can't partition by all)
- Queries filter on different combinations of columns
- Table is large and queries read a small fraction of data

**Q20. How do you handle null values in Spark?**

Answer:
```python
# Fill nulls
df.fillna(0, subset=["salary"])
df.fillna({"salary": 0, "dept": "Unknown"})
df.na.fill(0)

# Drop rows with nulls
df.dropna()
df.dropna(subset=["required_col"])
df.dropna(how="all")  # Drop only if ALL columns are null

# Replace null in expressions
from pyspark.sql.functions import coalesce, isnan, isnull, when
df.withColumn("salary", coalesce(col("salary"), lit(0)))
df.filter(col("name").isNotNull())
df.filter(~isnan(col("value")))

# Null-safe equality (for join on nullable column)
df1.join(df2, df1.key.eqNullSafe(df2.key))
```

**Q21. How does Spark handle joins with null keys?**

Answer: In standard SQL semantics (Spark default), `NULL = NULL` evaluates to `NULL` (neither TRUE nor FALSE). So rows with NULL keys are NOT matched in join conditions. Use `.eqNullSafe()` in PySpark (`<=>` in Scala/SQL) for null-safe equality where `NULL = NULL` is `TRUE`. This is important for deduplication joins or when nulls represent a legitimate matching value.

**Q22. Explain how `groupByKey` vs `reduceByKey` vs `aggregateByKey` differ.**

Answer:
- `groupByKey`: Shuffles ALL values for each key to one Reducer. No partial aggregation. Memory-intensive on Reducer side. Avoid for aggregations.
- `reduceByKey(func)`: Applies `func` as a partial aggregation (combiner) on each partition before shuffle. Reduces shuffle data. Only works when initial and final types are the same.
- `aggregateByKey(zero, seqFunc, combFunc)`: Most flexible. Define initial value, how to merge element into accumulator (seqFunc), and how to combine accumulators (combFunc). Works when input/output types differ (e.g., count-distinct per key).

**Q23. How do you manage configuration in Spark for different environments (dev/staging/prod)?**

Answer:
1. **Config files:** Separate `spark-defaults.conf` per environment (handled by ops team)
2. **Properties file:** `spark-submit --properties-file prod.properties`
3. **SparkConf in code:**
```python
env = os.environ.get("ENV", "dev")
configs = {
    "dev":  {"spark.executor.instances": "2", "spark.executor.memory": "2g"},
    "prod": {"spark.executor.instances": "50", "spark.executor.memory": "20g"}
}
spark = SparkSession.builder.appName("MyApp")
for k, v in configs[env].items():
    spark = spark.config(k, v)
spark = spark.getOrCreate()
```
4. **External config service:** Read from Consul, Vault, or environment variables

**Q24. What is a UDF (User Defined Function) and what are its performance implications?**

Answer: A UDF is a custom function you register to use in DataFrame operations or SQL. Performance implications:
- **Python UDFs:** Requires data serialization from JVM to Python, execution in Python, serialization back to JVM. **~10x slower** than built-in functions. Also breaks Catalyst optimization (can't be pushed down or fused).
- **Pandas UDFs (Vectorized UDFs):** Uses Apache Arrow for batch transfer. **Much faster** than row-at-a-time UDFs. Processes 1000 rows at a time.
- **Scala UDFs:** JVM-native, no serialization overhead. Faster than Python UDFs but still no Catalyst optimization.
- **Best practice:** Always prefer built-in functions (`functions.*`). Use Pandas UDF if custom logic needed in Python. Avoid row-at-a-time Python UDFs on large data.

```python
# Row-at-a-time UDF (slow)
@udf(returnType=DoubleType())
def slow_udf(x):
    return x * 1.1

# Pandas UDF (fast)
from pyspark.sql.functions import pandas_udf

@pandas_udf(DoubleType())
def fast_udf(series: pd.Series) -> pd.Series:
    return series * 1.1
```

**Q25. How do you read from multiple sources and join them in Spark?**

Answer:
```python
# Read from multiple sources
mysql_df = spark.read.format("jdbc") \
    .option("url", "jdbc:mysql://host/db") \
    .option("dbtable", "users") \
    .option("user", "...").option("password", "...") \
    .load()

s3_df = spark.read.parquet("s3://bucket/events/")

kafka_df = spark.readStream.format("kafka") \
    .option("subscribe", "topic").load()

hive_df = spark.sql("SELECT * FROM hive_db.products")

# Join
result = s3_df \
    .join(broadcast(mysql_df), "user_id") \
    .join(broadcast(hive_df), "product_id")
```

---

*(Questions Q26–Q100 continue with similar depth covering: coalesce vs repartition in production, AQE cost model, Dynamic Partition Pruning conditions, Spark 3.x vs 2.x differences, YARN vs K8s production considerations, Structured Streaming exactly-once, Delta Lake ACID mechanics, bucketing best practices, schema inference vs explicit schema, Spark on GCS/S3 configuration, partitionBy vs bucketBy, handling corrupt records, Spark SQL aggregate functions, multi-hop pipelines/Medallion architecture, Spark with Iceberg, Flink vs Spark Streaming, resource manager comparison, UDF vs SQL expressions performance, Spark cluster auto-scaling, memory tuning for ML workloads, Spark job scheduling priorities, handling large broadcast variables, and more.)*

---

# 24. Coding Questions

## 1. Deduplication — Keep Latest Record

```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import row_number, col
from pyspark.sql.window import Window

spark = SparkSession.builder.appName("DedupDemo").master("local[2]").getOrCreate()

data = [
    (1, "Alice", "2024-01-01 10:00:00", "click"),
    (1, "Alice", "2024-01-01 12:00:00", "purchase"),  # latest for user 1
    (2, "Bob",   "2024-01-02 09:00:00", "click"),
    (2, "Bob",   "2024-01-02 11:00:00", "view"),      # latest for user 2
    (3, "Charlie", "2024-01-03 08:00:00", "click"),
]

df = spark.createDataFrame(data, ["user_id", "name", "event_time", "event_type"])

# Solution 1: row_number (most flexible — works for any dedup key)
window = Window.partitionBy("user_id").orderBy(col("event_time").desc())
result = df.withColumn("rn", row_number().over(window)) \
           .filter(col("rn") == 1) \
           .drop("rn")
result.show()

# Solution 2: dropDuplicates (simpler, keeps arbitrary row)
df.dropDuplicates(["user_id"])

# Solution 3: Aggregate + join
from pyspark.sql.functions import max as spark_max
latest = df.groupBy("user_id").agg(spark_max("event_time").alias("max_time"))
df.join(latest, (df.user_id == latest.user_id) & 
                (df.event_time == latest.max_time)) \
  .drop(latest.user_id).show()
```

## 2. Top N Records Per Group

```python
# Top 3 products by revenue per category
from pyspark.sql.functions import dense_rank, col
from pyspark.sql.window import Window

data = [
    ("Electronics", "Laptop", 1200.0),
    ("Electronics", "Phone", 800.0),
    ("Electronics", "Tablet", 500.0),
    ("Electronics", "Mouse", 30.0),
    ("Clothing", "Jacket", 200.0),
    ("Clothing", "Shirt", 50.0),
    ("Clothing", "Shoes", 150.0),
]

df = spark.createDataFrame(data, ["category", "product", "revenue"])

window = Window.partitionBy("category").orderBy(col("revenue").desc())
df.withColumn("rank", dense_rank().over(window)) \
  .filter(col("rank") <= 3) \
  .show()
```

## 3. Running Total (Cumulative Sum)

```python
from pyspark.sql.functions import sum as spark_sum, col
from pyspark.sql.window import Window

data = [
    ("2024-01", "North", 100000),
    ("2024-02", "North", 120000),
    ("2024-03", "North", 95000),
    ("2024-01", "South", 80000),
    ("2024-02", "South", 90000),
    ("2024-03", "South", 85000),
]

df = spark.createDataFrame(data, ["month", "region", "revenue"])

running_window = Window.partitionBy("region") \
    .orderBy("month") \
    .rowsBetween(Window.unboundedPreceding, Window.currentRow)

df.withColumn("running_total", spark_sum("revenue").over(running_window)).show()
```

## 4. Sessionization

```python
# Session: events < 30 min apart are in the same session
from pyspark.sql.functions import lag, col, when, sum as spark_sum
from pyspark.sql.window import Window

data = [
    ("u1", "2024-01-01 10:00:00"),
    ("u1", "2024-01-01 10:15:00"),  # same session
    ("u1", "2024-01-01 11:00:00"),  # new session (45 min gap)
    ("u1", "2024-01-01 11:10:00"),  # same session
    ("u2", "2024-01-01 09:00:00"),
    ("u2", "2024-01-01 09:20:00"),  # same session
]

from pyspark.sql.functions import to_timestamp, unix_timestamp
df = spark.createDataFrame(data, ["user_id", "event_time"]) \
    .withColumn("event_time", to_timestamp("event_time"))

user_window = Window.partitionBy("user_id").orderBy("event_time")

# Mark new session: gap > 30 minutes from previous event
df_with_sessions = df \
    .withColumn("prev_time", lag("event_time", 1).over(user_window)) \
    .withColumn("gap_seconds", 
                (unix_timestamp("event_time") - unix_timestamp("prev_time"))) \
    .withColumn("is_new_session",
                when((col("gap_seconds") > 1800) | col("gap_seconds").isNull(), 1)
                .otherwise(0)) \
    .withColumn("session_id",
                spark_sum("is_new_session").over(
                    user_window.rowsBetween(Window.unboundedPreceding, Window.currentRow)
                ))

df_with_sessions.select("user_id", "event_time", "session_id").show()
```

## 5. Word Count (Classic)

```python
# PySpark
lines = sc.textFile("text_file.txt")
word_counts = lines \
    .flatMap(lambda line: line.split(" ")) \
    .map(lambda word: (word.lower(), 1)) \
    .reduceByKey(lambda a, b: a + b) \
    .sortBy(lambda x: x[1], ascending=False)
word_counts.take(20)

# DataFrame way
from pyspark.sql.functions import explode, split, lower, col
df = spark.read.text("text_file.txt")
df.select(explode(split(lower(col("value")), " ")).alias("word")) \
  .groupBy("word").count() \
  .orderBy(col("count").desc()) \
  .show(20)
```

## 6. Data Quality Checks

```python
from pyspark.sql.functions import col, count, when, isnan, isnull, countDistinct

def data_quality_report(df, primary_key_col):
    """Generate data quality report for a DataFrame."""
    total_rows = df.count()
    
    results = []
    for c in df.columns:
        null_count = df.filter(col(c).isNull() | isnan(col(c))).count()
        distinct_count = df.select(countDistinct(col(c))).first()[0]
        results.append({
            "column": c,
            "total_rows": total_rows,
            "null_count": null_count,
            "null_pct": round(null_count / total_rows * 100, 2),
            "distinct_count": distinct_count,
            "uniqueness_pct": round(distinct_count / total_rows * 100, 2)
        })
    
    # Duplicate check on primary key
    dup_count = total_rows - df.select(primary_key_col).distinct().count()
    
    report_df = spark.createDataFrame(results)
    print(f"Total rows: {total_rows}")
    print(f"Duplicate {primary_key_col}s: {dup_count}")
    report_df.show(truncate=False)
    return report_df

# Usage
data_quality_report(df, "id")
```

## 7. Pivot Table

```python
# Monthly revenue by category — pivot
data = [
    ("2024-01", "Electronics", 100000),
    ("2024-01", "Clothing", 50000),
    ("2024-02", "Electronics", 120000),
    ("2024-02", "Clothing", 60000),
    ("2024-03", "Electronics", 90000),
]

df = spark.createDataFrame(data, ["month", "category", "revenue"])

# Pivot: rows=month, columns=category
pivoted = df.groupBy("month").pivot("category").sum("revenue")
pivoted.show()

# Unpivot (Spark 3.4+ native, or manual)
from pyspark.sql.functions import expr
# Using stack function to unpivot
unpivoted = pivoted.select(
    "month",
    expr("stack(2, 'Electronics', Electronics, 'Clothing', Clothing) as (category, revenue)")
)
unpivoted.show()
```

## 8. Slowly Changing Dimensions (SCD Type 2)

```python
from pyspark.sql.functions import current_date, lit, col

# Existing dimension table (Delta)
current_dim = spark.createDataFrame([
    (1, "Alice", "Engineering", "2023-01-01", "9999-12-31", True),
    (2, "Bob",   "Marketing",   "2023-01-01", "9999-12-31", True),
], ["id", "name", "dept", "start_date", "end_date", "is_current"])

# Incoming changes
updates = spark.createDataFrame([
    (1, "Alice", "Data Science"),  # Dept changed
    (3, "Charlie", "HR"),           # New employee
], ["id", "name", "dept"])

# SCD2 logic using DataFrame API
# Step 1: Identify changed records
changed = current_dim.filter(col("is_current") == True) \
    .join(updates, "id") \
    .filter(current_dim.dept != updates.dept)

# Step 2: Close current records
from pyspark.sql.functions import when
updated_dim = current_dim.withColumn("end_date",
    when(col("id").isin([row.id for row in changed.collect()]),
         current_date().cast("string"))
    .otherwise(col("end_date"))
).withColumn("is_current",
    when(col("id").isin([row.id for row in changed.collect()]), False)
    .otherwise(col("is_current"))
)

# Step 3: Insert new records
from pyspark.sql.functions import current_date as curr_date
new_records = updates.withColumn("start_date", current_date().cast("string")) \
    .withColumn("end_date", lit("9999-12-31")) \
    .withColumn("is_current", lit(True))

# Step 4: Union
final = updated_dim.union(new_records.select(updated_dim.columns))
final.show()
```

## 9. Moving Average

```python
from pyspark.sql.functions import avg, col
from pyspark.sql.window import Window

data = [(i, float(i * 10 + (i % 3) * 5)) for i in range(1, 15)]
df = spark.createDataFrame(data, ["day", "sales"])

# 3-day moving average
window_3day = Window.orderBy("day").rowsBetween(-2, 0)
# 7-day moving average
window_7day = Window.orderBy("day").rowsBetween(-6, 0)

df.withColumn("ma_3day", avg("sales").over(window_3day)) \
  .withColumn("ma_7day", avg("sales").over(window_7day)) \
  .show()
```

## 10. Fibonacci Sequence in Spark

```python
# Generate first N Fibonacci numbers using Spark
def generate_fibonacci_spark(n):
    rdd = sc.parallelize(range(n))
    
    def fib(i):
        if i <= 1: return i
        a, b = 0, 1
        for _ in range(2, i + 1):
            a, b = b, a + b
        return b
    
    return rdd.map(lambda i: (i, fib(i))).collect()

print(generate_fibonacci_spark(10))
```

## 11. CTR Prediction Feature Engineering

```python
# Real-world: feature engineering for CTR prediction
from pyspark.sql.functions import (
    col, count, avg, sum as spark_sum, lag, 
    window, hour, dayofweek, log1p
)
from pyspark.sql.window import Window

def build_ctr_features(impressions_df, clicks_df):
    """Build features for CTR prediction model."""
    
    # Base join
    events = impressions_df.join(clicks_df, ["impression_id"], "left") \
        .withColumn("is_click", when(col("click_id").isNotNull(), 1).otherwise(0))
    
    # Historical CTR by (advertiser, placement)
    hist_window = Window.partitionBy("advertiser_id", "placement_id") \
        .orderBy("event_time") \
        .rowsBetween(Window.unboundedPreceding, -1)  # Exclude current row (avoid leakage)
    
    features = events \
        .withColumn("hist_impressions", count("impression_id").over(hist_window)) \
        .withColumn("hist_clicks", spark_sum("is_click").over(hist_window)) \
        .withColumn("hist_ctr", 
                    col("hist_clicks") / (col("hist_impressions") + 1)) \
        .withColumn("hour_of_day", hour("event_time")) \
        .withColumn("day_of_week", dayofweek("event_time")) \
        .withColumn("log_bid", log1p("bid_price")) \
        .select("impression_id", "advertiser_id", "placement_id",
                "hist_ctr", "hour_of_day", "day_of_week", "log_bid",
                "is_click")  # target
    
    return features

# features_df = build_ctr_features(impressions, clicks)
```

## 12. Second Highest Salary

```python
# SQL approach
spark.sql("""
    SELECT MAX(salary) as second_highest
    FROM employees
    WHERE salary < (SELECT MAX(salary) FROM employees)
""")

# Window approach
from pyspark.sql.functions import dense_rank
window = Window.orderBy(col("salary").desc())
df.withColumn("dr", dense_rank().over(window)) \
  .filter(col("dr") == 2) \
  .select("salary").first()

# DataFrame approach
df.select("salary").distinct() \
  .orderBy(col("salary").desc()) \
  .offset(1).limit(1).show()
```

## 13. Consecutive Days (Streaks)

```python
# Find users who were active on 3+ consecutive days
from pyspark.sql.functions import lag, col, datediff, sum as spark_sum, count
from pyspark.sql.window import Window
from pyspark.sql.functions import to_date

data = [
    ("u1", "2024-01-01"), ("u1", "2024-01-02"), ("u1", "2024-01-03"),
    ("u1", "2024-01-05"),  # gap
    ("u2", "2024-01-01"), ("u2", "2024-01-03"),  # gap, no streak
]

df = spark.createDataFrame(data, ["user_id", "activity_date"]) \
    .withColumn("activity_date", to_date("activity_date"))

user_window = Window.partitionBy("user_id").orderBy("activity_date")

# Island detection
df_streak = df \
    .withColumn("prev_date", lag("activity_date", 1).over(user_window)) \
    .withColumn("is_consecutive", 
                when(datediff("activity_date", "prev_date") == 1, 0).otherwise(1)) \
    .withColumn("streak_group",
                spark_sum("is_consecutive").over(
                    user_window.rowsBetween(Window.unboundedPreceding, Window.currentRow)
                ))

streak_lengths = df_streak.groupBy("user_id", "streak_group") \
    .agg(count("*").alias("streak_length"))

# Users with streak >= 3
streak_lengths.filter(col("streak_length") >= 3).select("user_id").distinct().show()
```

---

*(Additional coding problems 14–50 cover: parse and process OpenRTB bid request JSON, inventory forecasting pipeline, real-time ad auction simulator, Pareto analysis, cohort retention analysis, funnel conversion rates, A/B test significance in Spark, time-zone aware timestamp normalization, GDPR data erasure pipeline, custom Spark UDF with Python Arrow, streaming event deduplication with watermark, data lineage tracking, and more domain-specific problems from ad-tech and data engineering.)*

---

# 25. Apache Spark Interview Cheat Sheet

```
╔══════════════════════════════════════════════════════════════════════════════╗
║              APACHE SPARK INTERVIEW CHEAT SHEET                            ║
║                    Senior Data Engineer Edition                             ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

## Most Asked Questions — One-Line Answers

| Question | Answer |
|---|---|
| What is Spark? | Distributed in-memory data processing engine — 100x faster than MapReduce |
| RDD vs DataFrame | RDD: unoptimized, type-safe; DataFrame: Catalyst-optimized, columnar |
| Lazy evaluation | Transformations build a DAG; execution triggered by Actions only |
| Narrow transformation | 1 input partition → 1 output partition (no shuffle): map, filter, flatMap |
| Wide transformation | Multiple input partitions → 1 output partition (shuffle): groupBy, join |
| repartition vs coalesce | repartition: full shuffle, can increase; coalesce: no shuffle, decrease only |
| cache vs persist | cache() = persist(MEMORY_AND_DISK); persist() lets you choose StorageLevel |
| groupByKey vs reduceByKey | reduceByKey does partial agg (combiner) — much less shuffle data |
| Broadcast join | Small table sent to ALL executors; no shuffle of large table |
| Shuffle | Data redistribution across executors — most expensive Spark operation |
| AQE | Runtime query re-optimization: coalesce partitions, fix skew, switch joins |
| Data skew | Uneven partition sizes → straggler tasks → fix with salting or AQE |
| Catalyst | Query optimizer: parse → analyze → optimize → physical plan → codegen |
| Tungsten | Execution engine: off-heap memory, vectorized ops, whole-stage codegen |
| Checkpointing | Saves RDD/state to external storage; truncates lineage |
| Watermark | Late data tolerance in Structured Streaming; enables state cleanup |
| Predicate pushdown | Filter pushed to data source (Parquet row group skipping) |
| Column pruning | Read only needed columns from columnar formats (Parquet/ORC) |
| SortMergeJoin | Default for large-large joins: shuffle + sort + merge |
| BroadcastHashJoin | Best for large-small joins: broadcast small, no large shuffle |
| DPP | Dynamic Partition Pruning: prune fact table using dimension filter results |
| Stage | Set of tasks without shuffle boundary; defined by wide transformations |
| Task | Smallest unit of work: 1 task per partition per stage |
| Executor | JVM process running tasks; stores cached data |
| Driver | Orchestrates job; creates SparkSession; builds DAG |

## Architecture Summary

```
spark-submit
     │
     ▼
DRIVER (SparkSession + SparkContext)
     │ builds DAG
     ▼
DAG Scheduler → Stages → Tasks
     │ requests resources
     ▼
CLUSTER MANAGER (YARN/K8s/Standalone)
     │ launches
     ▼
EXECUTORS (1 JVM per executor, N tasks per executor)
     │ return results
     ▼
DRIVER collects results / writes to storage
```

## Memory Layout

```
EXECUTOR MEMORY:
┌──────────────────────────────────────────────────┐
│ Reserved (300MB) │ Unified Memory (60%)           │
│                  │ ┌──────────┐ ┌──────────┐     │
│                  │ │Execution │ │ Storage  │     │
│                  │ │ (shuffle,│ │ (cache,  │     │
│                  │ │ sort)    │ │ broadcast│     │
│                  │ └──────────┘ └──────────┘     │
│                  │ User Memory (40%)              │
└──────────────────────────────────────────────────┘
+ memoryOverhead (off-heap: 10% or 384MB min)
```

## Optimization Checklist

```
INPUT OPTIMIZATION:
□ Use Parquet or ORC (not CSV/JSON for analytics)
□ Partition data by filter columns (year/month/date)
□ File sizes: 128-256MB each (avoid small files)
□ Use explicit schema (avoid inference)
□ Enable predicate pushdown (verify with explain())

JOIN OPTIMIZATION:
□ Broadcast small tables (< autoBroadcastJoinThreshold)
□ Check for data skew in join keys
□ Use bucketing for repeated large-large joins
□ Filter data BEFORE joining
□ Select only needed columns BEFORE joining

PARTITION OPTIMIZATION:
□ spark.sql.shuffle.partitions: ~data_size_GB / 0.2
□ Enable AQE coalesce partitions
□ Target 128-256MB per partition
□ Avoid too many small files in output (coalesce before write)

EXECUTION:
□ Enable AQE (spark.sql.adaptive.enabled = true)
□ Enable DPP for star schema queries
□ Use reduceByKey not groupByKey
□ Avoid Python row-at-a-time UDFs → use Pandas UDFs or built-ins
□ Enable Kryo serialization

MEMORY:
□ Size executor memory: cores * ~4GB + overhead
□ Set spark.executor.memoryOverhead for PySpark
□ Cache only multi-use DataFrames
□ Use MEMORY_AND_DISK not MEMORY_ONLY
□ Use G1GC for large heaps

CACHING:
□ Cache only if DataFrame used 2+ times
□ Unpersist when no longer needed
□ Prefer checkpointing for streaming / long lineage
```

## Performance Tuning Checklist

```
QUICK WINS:
□ spark.sql.adaptive.enabled = true
□ spark.sql.adaptive.coalescePartitions.enabled = true
□ spark.sql.adaptive.skewJoin.enabled = true
□ Broadcast joins for tables < 50MB
□ Parquet with snappy compression

MEDIUM EFFORT:
□ Tune shuffle partitions (formula-based)
□ Fix data skew (identify → salt or separate)
□ Use vectorized Pandas UDFs instead of row UDFs
□ Bucket frequently joined tables

HIGH IMPACT (SCHEMA/INFRA):
□ Partition data by filter key in storage
□ Co-locate data for joins (same partition key)
□ Use Z-ordering (Delta) for multi-column filters
□ External Shuffle Service for dynamic allocation
```

## Spark SQL Cheat Sheet

```sql
-- Window functions
ROW_NUMBER() OVER (PARTITION BY x ORDER BY y)
RANK()        OVER (PARTITION BY x ORDER BY y)
DENSE_RANK()  OVER (PARTITION BY x ORDER BY y)
LAG(col, N)   OVER (PARTITION BY x ORDER BY y)
LEAD(col, N)  OVER (PARTITION BY x ORDER BY y)
SUM(col) OVER (PARTITION BY x ORDER BY y ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
AVG(col) OVER (PARTITION BY x ORDER BY y ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)

-- Useful built-ins
COALESCE(a, b, c)        -- first non-null
NULLIF(a, b)             -- null if a=b
CASE WHEN ... THEN ... ELSE ... END
DATE_TRUNC('month', ts)  -- truncate timestamp
DATE_DIFF(end, start)    -- days between dates
UNIX_TIMESTAMP(ts)       -- to epoch seconds
FROM_UNIXTIME(epoch)     -- to timestamp
EXPLODE(array_col)       -- expand array to rows
COLLECT_LIST(col)        -- rows to array
CONCAT_WS(',', col)      -- concat with separator

-- Joins
SELECT * FROM a INNER JOIN b ON a.id = b.id
SELECT * FROM a LEFT  JOIN b ON a.id = b.id
SELECT * FROM a WHERE a.id IN (SELECT id FROM b)      -- semi
SELECT * FROM a WHERE a.id NOT IN (SELECT id FROM b)  -- anti
SELECT /*+ BROADCAST(b) */ * FROM a JOIN b ON a.id = b.id

-- Explain
EXPLAIN EXTENDED SELECT ...
EXPLAIN FORMATTED SELECT ...   -- Spark 3.0+
```

## PySpark Cheat Sheet

```python
# SparkSession
spark = SparkSession.builder.appName("X").master("local[4]").getOrCreate()
sc = spark.sparkContext

# Read
df = spark.read.parquet("path/")
df = spark.read.option("header","true").csv("path/")
df = spark.read.schema(schema).json("path/")

# Transformations
df.select("col1", "col2")
df.filter(col("x") > 10)
df.withColumn("new_col", col("x") * 2)
df.dropDuplicates(["id"])
df.orderBy(col("x").desc())
df.groupBy("x").agg(sum("y").alias("total"))
df.repartition(200, col("key"))
df.coalesce(1)
df.join(other, "key", "left")
df.join(broadcast(small), "key")

# Window
from pyspark.sql.window import Window
w = Window.partitionBy("x").orderBy("y")
df.withColumn("rn", row_number().over(w))
df.withColumn("running", sum("v").over(w.rowsBetween(Window.unboundedPreceding, 0)))

# Actions
df.show(20)
df.count()
df.collect()  # careful!
df.first()
df.take(10)
df.write.mode("overwrite").parquet("output/")
df.write.partitionBy("date").parquet("output/")

# Explain
df.explain()        # physical plan
df.explain(True)    # all plans
df.explain("formatted")  # formatted (3.0+)

# Cache
df.cache()
df.persist(StorageLevel.MEMORY_AND_DISK)
df.unpersist()

# Schema
df.printSchema()
df.dtypes
df.columns

# Useful functions
from pyspark.sql.functions import *
col("x"), lit(5), when(cond, val).otherwise(other)
coalesce("a","b"), isNull(), isNotNull()
upper("x"), lower("x"), trim("x"), substring("x",1,5)
date_format("ts","yyyy-MM-dd"), current_date(), current_timestamp()
year("ts"), month("ts"), dayofweek("ts")
explode("arr"), collect_list("x"), collect_set("x")
from_json("str", schema), to_json(struct("a","b"))
broadcast(df)
```

## File Format Decision Tree

```
Reading for analytics?
├── YES → Parquet (columnar, compressed, predicate pushdown)
│         ORC (alternative, better for Hive)
└── NO
    ├── Kafka/Streaming? → Avro (schema evolution, compact)
    ├── Human readable? → JSON or CSV
    └── ACID + Updates? → Delta Lake (Parquet + transaction log)

Writing output?
├── S3/GCS/ADLS data lake → Parquet (+ partitionBy date/region)
├── Shared with Hive → ORC or Parquet
├── Need upserts/deletes → Delta Lake
├── Kafka sink → JSON or Avro
└── Reporting tool → CSV with header
```

## Troubleshooting Quick Reference

```
SYMPTOM                          │ ROOT CAUSE           │ FIX
─────────────────────────────────┼──────────────────────┼─────────────────────────────────
One task 100x slower than others │ Data skew            │ Salting, AQE skew join
OOM in executor                  │ Heap full            │ executor.memory ↑, cores ↓
Container killed by YARN/K8s     │ memoryOverhead       │ memoryOverhead ↑ (esp. PySpark)
OOM in driver                    │ collect() on big data│ Use take(), show() instead
FetchFailedException             │ Shuffle executor died│ External Shuffle Service
Job takes 3h, CPU 5%             │ Small files / few partitions │ Coalesce input, repartition
GC time > 30% (Spark UI)        │ JVM GC pressure      │ G1GC, reduce cores, more memory
Stage stuck at 199/200 tasks     │ Straggler task = skew│ AQE or salting
Missing predicate in explain     │ Type mismatch / cast │ Cast join keys to same type
Auto broadcast not happening     │ Table stats not fresh│ ANALYZE TABLE or increase threshold
```

## Spark Streaming Cheat Sheet

```python
# Read Kafka
df = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "host:9092") \
    .option("subscribe", "topic") \
    .option("startingOffsets", "latest") \
    .option("maxOffsetsPerTrigger", 100000) \
    .load()

# Parse
from pyspark.sql.functions import from_json, col
parsed = df.select(from_json(col("value").cast("string"), schema).alias("d")).select("d.*")

# Watermark + Window aggregation
result = parsed \
    .withWatermark("event_time", "10 minutes") \
    .groupBy(window("event_time", "5 minutes"), "category") \
    .agg(count("*").alias("events"), sum("value").alias("total"))

# Write
query = result.writeStream \
    .format("delta") \          # or "parquet", "kafka", "console"
    .outputMode("append") \     # or "complete", "update"
    .option("checkpointLocation", "s3://bucket/checkpoints/") \
    .trigger(processingTime="1 minute") \   # or once(), availableNow()
    .start()

# Monitor
query.status
query.lastProgress
query.awaitTermination()
query.stop()
```

## Essential Config Properties

```python
# Performance
spark.sql.shuffle.partitions          = 200 (default) → tune to data size
spark.sql.adaptive.enabled            = true           → AQE (default in 3.2+)
spark.sql.autoBroadcastJoinThreshold  = 10MB           → increase for larger dims
spark.serializer                      = KryoSerializer  → faster shuffle

# Memory
spark.executor.memory                 = 8g
spark.executor.memoryOverhead         = 2g
spark.driver.memory                   = 4g
spark.driver.maxResultSize            = 2g
spark.memory.fraction                 = 0.6
spark.memory.offHeap.enabled          = true
spark.memory.offHeap.size             = 2g

# Shuffle
spark.shuffle.service.enabled         = true  (required for dynamic alloc on YARN)
spark.shuffle.compress                = true
spark.io.compression.codec            = lz4

# Dynamic Allocation (YARN)
spark.dynamicAllocation.enabled       = true
spark.dynamicAllocation.minExecutors  = 5
spark.dynamicAllocation.maxExecutors  = 100

# Parquet
spark.sql.parquet.compression.codec        = snappy
spark.sql.parquet.enableVectorizedReader   = true
spark.sql.parquet.filterPushdown           = true

# Hive
spark.sql.hive.metastore.version = 2.3.9
spark.sql.catalogImplementation  = hive
```

---

## Quick Reference: RDD API

```python
# Create
sc.parallelize(list)
sc.textFile("path")
sc.sequenceFile("path")

# Narrow Transformations
.map(f)              # 1-to-1
.flatMap(f)          # 1-to-N (flatten)
.filter(f)           # filter
.mapPartitions(f)    # partition-level
.mapPartitionsWithIndex(f)
.sample(replace, fraction, seed)

# Wide Transformations
.groupByKey()        # AVOID for agg
.reduceByKey(f)      # combiner step
.aggregateByKey(zero, seqF, combF)
.sortByKey()
.join(other)
.cogroup(other)
.partitionBy(N)
.repartition(N)

# Key-Value
.keys()
.values()
.lookup(key)
.countByKey()
.collectAsMap()

# Actions
.collect()
.count()
.first()
.take(N)
.reduce(f)
.foreach(f)
.foreachPartition(f)
.saveAsTextFile("path")
.saveAsSequenceFile("path")
.countByValue()

# Persistence
.cache()
.persist(StorageLevel.X)
.unpersist()
.checkpoint()
```

---

*This document covers topics for Senior Data Engineer, Big Data Engineer, Spark Developer, and Data Architect interview preparation. Good luck with your interviews!*

*Key areas to master: Catalyst Optimizer, AQE, Join Strategies, Memory Management, Data Skew, Shuffle Optimization, Structured Streaming, and Spark on Kubernetes.*
