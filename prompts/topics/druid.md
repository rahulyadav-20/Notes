# Topic Block — Apache Druid

FILE:           src/pages/notes/data-engineer/Druid.jsx
PRIMARY_COLOR:  #29ABE2
GRAD_START:     #29ABE2
GRAD_END:       #0D6EFD
ICON_LETTER:    D
BRAND:          Apache Druid
EDITION:        Apache Druid 28 · Production Reference 2025

COVER:
  title:    "Apache Druid"
  subtitle: "Real-Time OLAP at Petabyte Scale"
  tagline:  "Sub-second queries on streaming and batch data — architecture, ingestion,
             segments, clustering, and production tuning"
  stats:    6 Parts · 20 Sections · 160+ Concepts

FRESHER ANALOGY:
  Druid is like a library that pre-indexes every book by every keyword before you ask.
  When you search, it knows exactly which shelf and page to look at — no scanning.
  New books (streaming data) are added to a "new arrivals" shelf and indexed overnight.

CODE LANGUAGES: SQL (primary) · JSON ingestion specs · druid-shell API

---

## Parts & Sections

Part 1 — Architecture & Data Model
  1 — Why Druid Exists
    1.1 OLAP vs OLTP vs Druid
    1.2 Time-Series as First-Class Citizen
    1.3 Druid vs ClickHouse vs Pinot
  2 — Cluster Services
    2.1 Coordinator, Overlord, Broker, Historical, MiddleManager
    2.2 Deep Storage: S3, HDFS, GCS
    2.3 Metadata Store: Derby vs MySQL vs PostgreSQL
    2.4 ZooKeeper Role in Druid

Part 2 — Ingestion & Indexing
  3 — Batch Ingestion
    3.1 Native Batch Ingestion Spec
    3.2 Hadoop-Based Ingestion
    3.3 Rollup: Pre-aggregation at Ingest Time
  4 — Streaming Ingestion
    4.1 Kafka Indexing Service
    4.2 Kinesis Indexing
    4.3 Supervisor Tasks and Handoff
    4.4 Exactly-Once Semantics with Kafka

Part 3 — Querying & SQL
  5 — Druid SQL
    5.1 Time-Based Filtering and __time Column
    5.2 Approximate Algorithms: HyperLogLog, Theta Sketch
    5.3 TopN vs GroupBy Queries
    5.4 Lookup Joins
  6 — Native Queries
    6.1 Timeseries, TopN, GroupBy Query Types
    6.2 Scan Queries
    6.3 Query Context and Tuning Parameters

Part 4 — Segments & Storage
  7 — Segment Architecture
    7.1 Segment Files: Column Store Layout
    7.2 Bitmap Indexes and CONCISE
    7.3 Segment Granularity vs Query Granularity
    7.4 Compaction: Merging Small Segments
  8 — Data Lifecycle
    8.1 Segment Versioning and Overshadowing
    8.2 Retention Rules
    8.3 Tiered Storage: Hot vs Cold Historical

Part 5 — Cluster Configuration
  9 — Sizing and Deployment
    9.1 Hardware Sizing Guidelines
    9.2 Docker Compose vs Kubernetes Operator
    9.3 Configuring Memory Pools per Service
  10 — High Availability
    10.1 Coordinator and Overlord HA
    10.2 Broker Load Balancing
    10.3 Historical Replication Factor

Part 6 — Production Tuning
  11 — Query Performance
    11.1 Rollup Design for Query Speed
    11.2 Dimension Cardinality and Bitmap Efficiency
    11.3 Broker Cache: Local and Memcached
  12 — Ingestion Tuning
    12.1 Task Slots and Parallelism
    12.2 Tuning maxRowsInMemory and maxBytesInMemory
    12.3 Compaction Scheduling
  13 — Monitoring
    13.1 Druid Metrics Emitter (Prometheus)
    13.2 Alerting on Query Latency and Segment Load

---

## Required Diagrams

1. Part 1 — Cluster Architecture (3D IsoBox): all 5 service types + Deep Storage
2. Part 2 — Ingestion Pipeline (Flat SVG): Kafka → MiddleManager → Segment → Historical
3. Part 4 — Segment Column Layout (Flat SVG): dimensions, metrics, timestamp columns, bitmap index
4. Part 4 — Data Lifecycle (Flat SVG): realtime → published → compacted → tiered
5. Part 6 — Query Path (3D IsoBox): Broker → Router → Historical + Realtime nodes
6. Part 1 — Druid vs Alternatives (Flat SVG table): Druid / ClickHouse / Pinot / BigQuery comparison
