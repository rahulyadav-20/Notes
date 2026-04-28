# Topic Block — GCP Data & AI

FILE:           src/pages/notes/data-engineer/GCP.jsx
PRIMARY_COLOR:  #4285F4
GRAD_START:     #4285F4
GRAD_END:       #34A853
ICON_LETTER:    G
BRAND:          GCP Data & AI
EDITION:        Google Cloud Platform 2025 · BigQuery · Dataflow · Vertex AI

COVER:
  title:    "GCP Data & AI"
  subtitle: "Google Cloud Platform — Full Data Stack"
  tagline:  "BigQuery, Dataflow, Pub/Sub, Vertex AI, Dataproc, and the complete
             GCP data engineering and MLOps platform"
  stats:    8 Parts · 26 Sections · 240+ Concepts

FRESHER ANALOGY:
  GCP is like a city of specialized skyscrapers. BigQuery is the library (analytics),
  Pub/Sub is the post office (messaging), Dataflow is the factory (processing),
  Vertex AI is the research lab (ML), and IAM is the security desk checking every
  door badge.

CODE LANGUAGES: SQL (BigQuery) · Python (Dataflow/Vertex) · Terraform (IaC)

---

## Parts & Sections

Part 1 — Core Services Overview
  1 — GCP Data Platform Architecture
    1.1 Choosing the Right GCP Service
    1.2 IAM: Roles, Service Accounts, and Least Privilege
    1.3 VPC and Private Service Access
    1.4 Cost Model and Committed Use Discounts

Part 2 — BigQuery Deep Dive
  2 — BigQuery Architecture
    2.1 Dremel Execution Engine
    2.2 Capacitor: Columnar Storage Format
    2.3 Slots and Reservations
    2.4 Storage Pricing: Active vs Long-Term
  3 — BigQuery SQL Patterns
    3.1 Partitioning Strategies: Time, Range, Ingestion
    3.2 Clustering for Query Cost Reduction
    3.3 Materialized Views and BI Engine
    3.4 BigQuery ML: Training in SQL
  4 — BigQuery Performance & Cost
    4.1 Query Optimization Techniques
    4.2 Monitoring with INFORMATION_SCHEMA
    4.3 Slot Utilization and Quota Management

Part 3 — Dataflow & Apache Beam
  5 — Dataflow Fundamentals
    5.1 Apache Beam Programming Model
    5.2 PCollection, PTransform, Pipeline
    5.3 Windowing and Triggers
    5.4 Side Inputs and Joins
  6 — Dataflow in Production
    6.1 Flex Templates vs Classic Templates
    6.2 Auto-scaling Configuration
    6.3 Dataflow SQL and Notebooks
    6.4 Dataflow Prime and GPU Support

Part 4 — Cloud Pub/Sub & Streaming
  7 — Pub/Sub Architecture
    7.1 Topics, Subscriptions, and Message Retention
    7.2 Push vs Pull Delivery
    7.3 Exactly-Once Delivery
    7.4 BigQuery Subscription (direct write)
  8 — Streaming Architecture Patterns
    8.1 Pub/Sub → Dataflow → BigQuery Pattern
    8.2 Pub/Sub → Cloud Functions (event-driven)
    8.3 Dead Letter Topics and Error Handling

Part 5 — Vertex AI & ML Pipelines
  9 — Vertex AI Platform
    9.1 Managed Datasets and Feature Store
    9.2 AutoML vs Custom Training
    9.3 Vertex AI Workbench
  10 — MLOps on Vertex AI
    10.1 Vertex Pipelines (Kubeflow-based)
    10.2 Model Registry and Endpoint Deployment
    10.3 Continuous Evaluation and Monitoring
    10.4 Vertex AI Vector Search

Part 6 — Data Pipeline Orchestration
  11 — Cloud Composer (Airflow)
    11.1 Composer Architecture
    11.2 DAG Design for GCP Operators
    11.3 Composer 2 vs Composer 1
  12 — Dataproc (Managed Spark/Hadoop)
    12.1 Cluster vs Serverless Dataproc
    12.2 Dataproc Metastore
    12.3 Dataproc + BigQuery Integration

Part 7 — GCP Networking & IAM
  13 — Networking for Data Engineers
    13.1 VPC Service Controls
    13.2 Private Google Access
    13.3 Shared VPC Patterns
  14 — Security Patterns
    14.1 Data Encryption at Rest and in Transit
    14.2 Customer-Managed Encryption Keys (CMEK)
    14.3 Audit Logging with Cloud Logging

Part 8 — Cost Optimization & Production
  15 — Cost Management
    15.1 BigQuery Cost Controls (max bytes billed)
    15.2 Committed Use Discounts for Compute
    15.3 Storage Class Lifecycle Rules
  16 — Production Reference
    16.1 GCP Data Stack Decision Guide
    16.2 Common Production Failures and Fixes
    16.3 Configuration Cheat Sheet

---

## Required Diagrams

1. Part 1 — GCP Data Platform Overview (3D IsoBox): all major services as boxes, data flows
2. Part 2 — BigQuery Architecture (Flat SVG): Dremel tree, Mixer nodes, Leaf servers
3. Part 3 — Dataflow Beam Pipeline (Flat SVG swimlane): Read → Transform → Window → Write
4. Part 4 — Streaming Architecture (3D IsoBox): Pub/Sub → Dataflow → BigQuery + DLT
5. Part 5 — Vertex AI MLOps Loop (Flat SVG): Data → Train → Evaluate → Deploy → Monitor → retrain
6. Part 8 — GCP Service Selection Guide (Flat SVG decision tree): use-case driven branching
