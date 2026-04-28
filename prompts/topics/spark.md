# Topic Block — Apache Spark

FILE:           src/pages/notes/data-engineer/Spark.jsx
PRIMARY_COLOR:  #E25A1C
GRAD_START:     #E25A1C
GRAD_END:       #F5A623
ICON_LETTER:    S
BRAND:          Apache Spark
EDITION:        Apache Spark 3.5 · Python & Scala · Production Reference 2025

COVER:
  title:    "Apache Spark"
  subtitle: "Unified Analytics Engine at Scale"
  tagline:  "From RDDs to Structured Streaming — internals, optimization, MLlib,
             and production deployment on Kubernetes and cloud platforms"
  stats:    8 Parts · 28 Sections · 280+ Concepts

FRESHER ANALOGY:
  Spark is like a factory assembly line. Raw materials (data) arrive on trucks (HDFS/S3).
  The foreman (Driver) plans the work order (DAG). Workers (Executors) in parallel
  workstations process batches. If one station breaks, only that batch reruns —
  not the whole factory.

CODE LANGUAGES: Python / PySpark (primary) · Scala (secondary) · Spark SQL

---

## Parts & Sections

Part 1 — Architecture & Execution Model
  1 — Spark Architecture
    1.1 Driver, Executor, Cluster Manager
    1.2 SparkContext vs SparkSession
    1.3 Execution Flow: Job → Stage → Task
    1.4 DAG Scheduler and Task Scheduler
    1.5 Shuffle: The Most Expensive Operation

Part 2 — RDDs, DataFrames & Datasets
  2 — RDD Fundamentals
    2.1 What RDDs Are and When to Use Them
    2.2 Transformations vs Actions
    2.3 Narrow vs Wide Dependencies
    2.4 Persistence and Caching
  3 — DataFrames and Spark SQL
    3.1 Schema Inference and Enforcement
    3.2 Column Expressions and Functions
    3.3 Window Functions
    3.4 UDFs and Pandas UDFs

Part 3 — Spark SQL & Query Optimization
  4 — Catalyst Optimizer
    4.1 Logical Plan → Optimized Plan → Physical Plan
    4.2 Predicate Pushdown
    4.3 Column Pruning
    4.4 Cost-Based Optimizer (CBO)
  5 — Adaptive Query Execution (AQE)
    5.1 Dynamic Partition Coalescing
    5.2 Skew Join Optimization
    5.3 Broadcast Hash Join vs Sort-Merge Join

Part 4 — Structured Streaming
  6 — Streaming Fundamentals
    6.1 Micro-Batch vs Continuous Processing
    6.2 Trigger Types
    6.3 Output Modes: Append, Update, Complete
    6.4 Checkpointing and Fault Tolerance
  7 — Streaming Sources & Sinks
    7.1 Kafka Source
    7.2 File Source with Schema Evolution
    7.3 Delta Lake Sink
    7.4 Streaming Joins and Watermarks

Part 5 — MLlib & Feature Engineering
  8 — MLlib Pipelines
    8.1 Transformer, Estimator, Pipeline
    8.2 Feature Engineering: VectorAssembler, StringIndexer
    8.3 Classification and Regression Algorithms
    8.4 Model Evaluation and Cross-Validation
  9 — Spark with Pandas and scikit-learn
    9.1 Pandas API on Spark (pyspark.pandas)
    9.2 Koalas Migration
    9.3 MLflow Integration

Part 6 — GraphX & Graph Processing
  10 — GraphX
    10.1 Graph Representation in Spark
    10.2 Pregel API
    10.3 PageRank Implementation
    10.4 GraphFrames Alternative

Part 7 — Performance Tuning
  11 — Memory Model
    11.1 Unified Memory Manager
    11.2 Execution vs Storage Memory
    11.3 Off-Heap Memory
  12 — Tuning Strategies
    12.1 Partitioning: repartition vs coalesce
    12.2 Broadcast Variables and Accumulators
    12.3 Skew Handling Techniques
    12.4 Configuration Reference Table

Part 8 — Production Deployment & Cloud
  13 — Deployment Options
    13.1 YARN, Standalone, Kubernetes
    13.2 Spark on Kubernetes Deep Dive
    13.3 Dynamic Resource Allocation
  14 — Cloud Platforms
    14.1 Databricks: Delta Engine and Photon
    14.2 GCP Dataproc
    14.3 AWS EMR
    14.4 Cost Optimization Strategies

---

## Required Diagrams

1. Part 1 — Cluster Architecture (3D IsoBox): Driver + 3 Executors + Cluster Manager
2. Part 1 — DAG Stages (Flat SVG): Stage boundaries at shuffle points
3. Part 3 — Catalyst Pipeline (Flat SVG): Unresolved → Resolved → Optimized → Physical Plans
4. Part 4 — Structured Streaming Micro-Batch (Flat SVG): trigger intervals, offset tracking
5. Part 7 — Memory Partitioning (Flat SVG bar): Execution vs Storage vs Overhead regions
6. Part 8 — Ecosystem Map (3D IsoBox): Spark center, HDFS/S3, Kafka, Delta, MLflow around it
