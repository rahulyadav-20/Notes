# Topic Block — Apache Flink

FILE:           src/pages/notes/data-engineer/Flink.jsx
PRIMARY_COLOR:  #E6522C
GRAD_START:     #E6522C
GRAD_END:       #F5A623
ICON_LETTER:    F
BRAND:          Apache Flink
EDITION:        Apache Flink 1.18 · Java & PyFlink · Production Reference 2025

COVER:
  title:    "Apache Flink"
  subtitle: "Stateful Stream Processing at Scale"
  tagline:  "From first principles to production mastery — windows, state, fault
             tolerance, Flink SQL, CEP, and Kubernetes deployment"
  stats:    18 Parts · 68 Sections · 320+ Concepts

FRESHER ANALOGY:
  Flink is like a water treatment plant. Water (events) flows in continuously
  from rivers (Kafka). Each tank (operator) does exactly one job: filter,
  transform, or count. Checkpoints are photos of every tank's water level —
  if a pipe bursts you restart from the last photo, not from the source river.

CODE LANGUAGES: Java (primary) · Python / PyFlink (secondary) · Flink SQL

---

## Parts & Sections

Part 1 — Foundations & Motivation
  1 — Why Apache Flink Exists
    1.1 The Stream Processing Problem
    1.2 Batch vs True Streaming
    1.3 Where Flink Excels
    1.4 Where Flink Is NOT the Right Tool
    1.5 CAP Theorem Positioning
    1.6 History: Stratosphere → Apache TLP

Part 2 — Architecture
  2 — Cluster Components
    2.1 JobManager — Brain of the Cluster
    2.2 TaskManager & Task Slots
    2.3 ResourceManager & Dispatcher
    2.4 High Availability with ZooKeeper
    2.5 REST API & Flink Web UI
  3 — Execution Model
    3.1 JobGraph → ExecutionGraph → Physical Graph
    3.2 Operator Chaining
    3.3 Parallelism & Slot Sharing
    3.4 Network Buffers & Backpressure

Part 3 — DataStream API
  4 — Fundamentals
    4.1 StreamExecutionEnvironment Setup
    4.2 Sources: Collection, File, Kafka, Custom
    4.3 Transformations: map, flatMap, filter, union
    4.4 Sinks & Output Formats
  5 — Keyed Streams
    5.1 keyBy and the KeyedStream
    5.2 Partitioning Strategies
    5.3 Broadcast State Pattern

Part 4 — Windows
  6 — Window Fundamentals
    6.1 What Windows Are and Why They Exist
    6.2 Tumbling Windows
    6.3 Sliding Windows
    6.4 Session Windows
    6.5 Global Windows & Custom Triggers
    6.6 Window Functions: reduce, aggregate, ProcessWindowFunction

Part 5 — Time & Watermarks
  7 — Time Semantics
    7.1 Event Time vs Processing Time vs Ingestion Time
    7.2 Why Event Time Is Hard
    7.3 Configuring Event Time
  8 — Watermarks
    8.1 What Watermarks Are (with analogy)
    8.2 Monotonous vs BoundedOutOfOrderness
    8.3 Watermark Propagation Through the DAG
    8.4 Late Data: Allowed Lateness & Side Outputs

Part 6 — State Management
  9 — Stateful Processing
    9.1 Keyed State vs Operator State
    9.2 ValueState, ListState, MapState, ReducingState
    9.3 State TTL & Automatic Cleanup
    9.4 QueryableState
  10 — State Backends
    10.1 HashMapStateBackend (in-memory)
    10.2 EmbeddedRocksDBStateBackend
    10.3 Choosing the Right Backend
    10.4 RocksDB Tuning for Production

Part 7 — Fault Tolerance
  11 — Checkpointing
    11.1 How Checkpoint Barriers Work (step by step)
    11.2 Aligned vs Unaligned Checkpoints
    11.3 Configuration: interval, timeout, min pause
    11.4 Incremental Checkpoints with RocksDB
  12 — Savepoints & Recovery
    12.1 Savepoints vs Checkpoints
    12.2 Taking & Restoring Savepoints
    12.3 Exactly-Once vs At-Least-Once
    12.4 End-to-End Exactly-Once with Kafka

Part 8 — Connectors
  13 — Kafka Source & Sink
    13.1 KafkaSource: Offset Strategies & Partition Discovery
    13.2 KafkaSink: Delivery Guarantees
    13.3 Schema Registry Integration (Avro, Protobuf)
  14 — Other Connectors
    14.1 JDBC Sink
    14.2 Filesystem Source & Sink (Parquet, ORC)
    14.3 Custom Source with SourceReader API
    14.4 Custom Sink with SinkWriter API

Part 9 — Table API & Flink SQL
  15 — Table API
    15.1 Table vs DataStream: When to Use Each
    15.2 Unified TableEnvironment
    15.3 Dynamic Tables & Continuous Queries
    15.4 Converting Between DataStream and Table
  16 — Flink SQL
    16.1 DDL: CREATE TABLE with Connectors
    16.2 DML: INSERT INTO, SELECT, EXPLAIN
    16.3 Windowed Aggregations in SQL
    16.4 Temporal Joins
    16.5 MATCH_RECOGNIZE: Pattern Detection in SQL

Part 10 — Advanced Patterns
  17 — CEP: Complex Event Processing
    17.1 What CEP Solves
    17.2 Pattern API: begin, next, followedBy
    17.3 Quantifiers & Conditions
    17.4 Real-World: Fraud Detection Pattern (full example)
  18 — Async I/O
    18.1 The Blocking I/O Problem
    18.2 AsyncDataStream API
    18.3 Ordered vs Unordered Mode
    18.4 Timeout Handling

Part 11 — Performance & Tuning
  19 — Backpressure
    19.1 How Backpressure Works in Flink
    19.2 Identifying Backpressure with Web UI
    19.3 Fixing Slow Operators
  20 — Tuning
    20.1 Tuning Framework: Impact Hierarchy
    20.2 Parallelism & Task Slot Sizing
    20.3 Network Buffer Tuning
    20.4 RocksDB & State Backend Tuning
    20.5 GC Tuning (G1GC / ZGC)

Part 12 — Deployment
  21 — Deployment Modes
    21.1 Session vs Per-Job vs Application Mode
    21.2 Standalone Cluster
    21.3 YARN Deployment
    21.4 Kubernetes Deployment
    21.5 Flink Operator on Kubernetes
  22 — Configuration
    22.1 flink-conf.yaml Key Parameters
    22.2 Dynamic Properties
    22.3 Resource Profiles

Part 13 — Monitoring & Debugging
  23 — Observability
    23.1 Built-in Metrics System
    23.2 Prometheus + Grafana Stack
    23.3 Flink Web UI Deep Dive
    23.4 Debugging Backpressure & Slow Jobs
    23.5 Common Production Failure Patterns

Part 14 — Flink vs Alternatives
  24 — Ecosystem Comparison
    24.1 Flink vs Apache Spark Structured Streaming
    24.2 Flink vs Kafka Streams
    24.3 Flink vs Apache Storm
    24.4 When to Choose Flink

Part 15 — Real-World Architectures
  25 — Production Patterns
    25.1 Lambda Architecture with Flink
    25.2 Kappa Architecture (Flink only)
    25.3 CDC Pipeline: Debezium → Kafka → Flink → Sink
    25.4 Real-Time Feature Store with Flink
    25.5 Flink in the Modern Lakehouse Stack

Part 16 — Security
  26 — Security
    26.1 Kerberos Authentication
    26.2 SSL/TLS Encryption
    26.3 Network Isolation Patterns

Part 17 — Migration & Upgrades
  27 — Production Operations
    27.1 Zero-Downtime Upgrades via Savepoints
    27.2 State Migration & Schema Evolution
    27.3 Capacity Planning Framework

Part 18 — Quick Reference
  28 — Reference
    28.1 Configuration Cheat Sheet
    28.2 Common Errors & Fixes
    28.3 Decision Guide: Flink vs Alternatives

---

## Required Diagrams

1. Part 2 — Cluster Architecture (3D IsoBox)
   JobManager (top-center, orange), two TaskManagers (bottom row, blue),
   ZooKeeper (right, gray), REST API client (left, purple),
   arrows: heartbeat TM→JM, task dispatch JM→TM, state snapshots TM→Storage

2. Part 3 — DAG Execution Pipeline (3D IsoBox)
   Source → Map → KeyBy → Window → Sink
   left-to-right IsoBoxes, IsoArrows with event count labels

3. Part 5 — Watermark Flow (Flat SVG inside Diagram)
   Horizontal timeline, events as circles with timestamps,
   watermark as advancing vertical dashed line,
   late events in red with "side output" arrow

4. Part 7 — Checkpoint Barriers (3D IsoBox)
   3 operator boxes in a row, barrier as dashed IsoArrow flowing through,
   state snapshot arrows going up to a Storage box above each operator

5. Part 10 — State Backend Comparison (Flat SVG bar chart inside Diagram)
   3 groups: Latency / Max State Size / Recovery Speed
   Bars for HashMapStateBackend vs RocksDB, color-coded

6. Part 15 — Ecosystem Integration Map (3D IsoBox)
   Flink as large center box, surrounded by:
   Kafka (left), HDFS/S3 (top-left), Cassandra (top-right),
   Elasticsearch (right), Kubernetes (bottom), Hive (bottom-left)
