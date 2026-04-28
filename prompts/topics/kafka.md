# Topic Block — Apache Kafka

FILE:           src/pages/notes/data-engineer/Kafka.jsx
PRIMARY_COLOR:  #4A90D9
GRAD_START:     #4A90D9
GRAD_END:       #7EC8E3
ICON_LETTER:    K
BRAND:          Apache Kafka
EDITION:        Apache Kafka 3.6 · Java & Python · Production Reference 2025

COVER:
  title:    "Apache Kafka"
  subtitle: "Distributed Event Streaming at Scale"
  tagline:  "From first principles to production mastery — topics, partitions, replication,
             consumer groups, Kafka Streams, Schema Registry, and production operations"
  stats:    6 Parts · 22 Sections · 200+ Concepts

FRESHER ANALOGY:
  Kafka is like a post office with infinite storage. Producers drop letters (events)
  into labeled mailboxes (topics). Consumers pick up letters at their own pace,
  keeping a bookmark (offset) of where they stopped reading. Multiple consumer groups
  are like different departments — each reads all the mail independently.

CODE LANGUAGES: Java (primary) · Python / kafka-python (secondary) · Kafka CLI

---

## Parts & Sections

Part 1 — Architecture & Core Concepts
  1 — Why Apache Kafka Exists
    1.1 The Message Queue Problem
    1.2 Kafka as an Event Log
    1.3 Kafka vs Traditional Brokers (RabbitMQ, ActiveMQ)
    1.4 Core Guarantees: Durability, Ordering, Scalability
  2 — Topics, Partitions & Segments
    2.1 Topics and Partition Layout on Disk
    2.2 Segment Files and Indexes
    2.3 Log Compaction vs Retention
    2.4 Partition Sizing Guidelines
  3 — Brokers & Cluster Metadata
    3.1 Broker Roles and Responsibilities
    3.2 KRaft Mode: Removing ZooKeeper Dependency
    3.3 Controller Election
    3.4 Cluster Health Metrics

Part 2 — Producers & Consumer Groups
  4 — Producer Internals
    4.1 Record Batching and Linger.ms
    4.2 Partitioner Strategies (round-robin, sticky, custom)
    4.3 Compression: lz4 vs snappy vs zstd
    4.4 Idempotent Producers and Exactly-Once
    4.5 Producer Configuration Reference
  5 — Consumer Groups & Offsets
    5.1 Consumer Group Protocol
    5.2 Partition Assignment Strategies
    5.3 Offset Management: Auto vs Manual Commit
    5.4 Consumer Lag Monitoring
    5.5 Rebalancing: Eager vs Cooperative Sticky

Part 3 — Brokers, Topics & Replication
  6 — Replication Deep Dive
    6.1 Leader and Follower Replicas
    6.2 In-Sync Replicas (ISR) and acks
    6.3 Unclean Leader Election Trade-offs
    6.4 min.insync.replicas Configuration
  7 — Delivery Semantics
    7.1 At-Most-Once, At-Least-Once, Exactly-Once
    7.2 Transactions API: beginTransaction, commitTransaction
    7.3 Transactional Producers and Consumers

Part 4 — Kafka Streams
  8 — Streams Architecture
    8.1 Stream Processing Topology
    8.2 KStream vs KTable vs GlobalKTable
    8.3 Stateless Transformations: map, filter, flatMap
    8.4 Stateful: aggregate, reduce, count
  9 — Windows & Joins
    9.1 Tumbling, Hopping, Session Windows
    9.2 Stream-Stream Joins
    9.3 Stream-Table Joins
    9.4 Interactive Queries

Part 5 — Schema Registry & Kafka Connect
  10 — Schema Registry
    10.1 Why Schema Evolution Matters
    10.2 Avro, Protobuf, JSON Schema Formats
    10.3 Compatibility Modes: BACKWARD, FORWARD, FULL
    10.4 Schema Registry HA Setup
  11 — Kafka Connect
    11.1 Connect Architecture: Workers, Tasks, Connectors
    11.2 Source Connectors: Debezium CDC
    11.3 Sink Connectors: JDBC, Elasticsearch, S3
    11.4 SMTs: Single Message Transforms
    11.5 Error Handling and Dead Letter Queues

Part 6 — Production Operations & Tuning
  12 — Performance Tuning
    12.1 Tuning Impact Hierarchy
    12.2 Producer Throughput Tuning
    12.3 Consumer Throughput Tuning
    12.4 Broker OS and JVM Tuning
  13 — Monitoring & Observability
    13.1 Key JMX Metrics
    13.2 Prometheus + Grafana Stack
    13.3 Consumer Lag Alerting
  14 — Operations Runbook
    14.1 Rolling Restarts with Zero Downtime
    14.2 Partition Reassignment
    14.3 Disk Space Management
    14.4 Common Production Failures and Fixes

---

## Required Diagrams

1. Part 1 — Cluster Architecture (3D IsoBox)
   3 Brokers in a row, ZooKeeper/KRaft (top-right), Producer (left), Consumer Group (right)
   arrows: write to leader, replicate to followers, consume with offset

2. Part 1 — Topic Partition Layout (Flat SVG)
   Topic with 3 partitions, each partition as a horizontal log with offset numbers,
   leader replica highlighted, follower replicas shown below

3. Part 2 — Producer Record Flow (Flat SVG swimlane)
   Application → Serializer → Partitioner → RecordAccumulator → NetworkClient → Broker
   labels showing batch.size and linger.ms thresholds

4. Part 2 — Consumer Group Rebalancing (3D IsoBox)
   Before: 3 consumers, 6 partitions assigned. After: 2 consumers, partitions reassigned.
   Show cooperative sticky rebalancing delta

5. Part 3 — ISR and Replication (Flat SVG)
   Leader partition, 2 ISR replicas, 1 lagging replica outside ISR circle
   HW (High Watermark) line, LEO (Log End Offset) per replica

6. Part 6 — Ecosystem Integration Map (3D IsoBox)
   Kafka center, surrounded by: Producers (microservices, IoT, CDC),
   Consumers (Flink, Spark, Elasticsearch, S3), Schema Registry, Kafka Connect
