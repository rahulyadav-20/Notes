# GCP Data Engineer Interview Notes
## Google Cloud Platform · Data Engineering · Big Data · ML Pipelines · Architecture

> **Covers:** BigQuery · Dataflow · Pub/Sub · Dataproc · Cloud Storage · Bigtable · Spanner · Firestore · Dataplex · Vertex AI · Data Fusion · Composer · Looker · IAM · Networking · Architecture Patterns  
> **Target:** GCP Data Engineer · Cloud Architect · Senior DE · ML Engineer · 3–15 years experience  
> **Certification Aligned:** Professional Data Engineer · Professional Cloud Architect

---

## Table of Contents

1. [GCP Core Concepts and Architecture](#1-gcp-core-concepts-and-architecture)
2. [Cloud Storage (GCS)](#2-cloud-storage-gcs)
3. [BigQuery — Deep Dive](#3-bigquery--deep-dive)
4. [Cloud Pub/Sub](#4-cloud-pubsub)
5. [Cloud Dataflow (Apache Beam)](#5-cloud-dataflow-apache-beam)
6. [Cloud Dataproc (Managed Spark/Hadoop)](#6-cloud-dataproc-managed-sparkhadoop)
7. [Cloud Bigtable](#7-cloud-bigtable)
8. [Cloud Spanner](#8-cloud-spanner)
9. [Cloud Firestore and Datastore](#9-cloud-firestore-and-datastore)
10. [Cloud Data Fusion](#10-cloud-data-fusion)
11. [Cloud Composer (Managed Airflow)](#11-cloud-composer-managed-airflow)
12. [Dataplex — Data Mesh on GCP](#12-dataplex--data-mesh-on-gcp)
13. [Vertex AI — ML Platform](#13-vertex-ai--ml-platform)
14. [Looker and BI Engine](#14-looker-and-bi-engine)
15. [IAM, Security, and Governance](#15-iam-security-and-governance)
16. [GCP Networking for Data Engineers](#16-gcp-networking-for-data-engineers)
17. [Data Architecture Patterns on GCP](#17-data-architecture-patterns-on-gcp)
18. [Scenario-Based Questions](#18-scenario-based-questions)
19. [GCP Data Engineer Cheat Sheet](#19-gcp-data-engineer-cheat-sheet)

---

# 1. GCP Core Concepts and Architecture

## Theory

Google Cloud Platform (GCP) is built on the same infrastructure that powers Google Search, YouTube, and Gmail. Understanding GCP's organisation model and global infrastructure is essential for designing resilient, cost-efficient data pipelines.

**Global Infrastructure Hierarchy:**

```
┌──────────────────────────────────────────────────────────────────────┐
│                     GCP INFRASTRUCTURE                               │
├──────────────────────────────────────────────────────────────────────┤
│  Multi-Region (e.g., US, EU, ASIA)                                   │
│  ├── Region (e.g., us-central1, asia-south1, europe-west1)          │
│  │   ├── Zone A  (independent failure domain, 1 datacenter)         │
│  │   ├── Zone B                                                      │
│  │   └── Zone C                                                      │
│  └── Region (e.g., us-east1)                                        │
└──────────────────────────────────────────────────────────────────────┘

Data residency:
- Zonal resource:      lives in one zone (VM, Persistent Disk)
- Regional resource:   replicated across zones (GCS regional bucket, GKE)
- Multi-regional:      replicated across regions (GCS multi-region, BigQuery)
- Global:              single global endpoint (VPC, IAM, Cloud DNS)
```

**Resource Hierarchy:**

```
Organization (e.g., jioplatforms.com)
├── Folder (e.g., DataEngineering)
│   ├── Project: ads-data-prod
│   │   ├── BigQuery datasets
│   │   ├── GCS buckets
│   │   └── Dataflow jobs
│   └── Project: ads-data-dev
└── Folder (e.g., MLPlatform)
    └── Project: ml-serving-prod

Key principle:
- IAM policies are INHERITED downward (org → folder → project → resource)
- Resources (BQ datasets, GCS buckets) live in Projects
- Billing is per Project
- Service accounts are per Project
- Quotas and limits are per Project
```

**Shared Responsibility Model:**

```
GCP manages:             Customer manages:
- Physical hardware      - IAM and access control
- Network fabric         - Data encryption (keys optional)
- Hypervisor             - Application code and configs
- Base OS (managed svcs) - Data classification
- Service availability   - Compliance obligations
```

## Core GCP Services for Data Engineers

```
┌──────────────────────────────────────────────────────────────────────┐
│              GCP DATA SERVICES LANDSCAPE                             │
├────────────────────┬─────────────────────────────────────────────────┤
│ INGEST             │ Pub/Sub (streaming), Transfer Service (batch),  │
│                    │ Datastream (CDC), Storage Transfer, BigQuery DTS│
├────────────────────┼─────────────────────────────────────────────────┤
│ STORE              │ GCS (object), BigQuery (analytical), Bigtable   │
│                    │ (NoSQL wide-col), Spanner (NewSQL), Firestore   │
│                    │ (document), Memorystore (Redis/Memcached)       │
├────────────────────┼─────────────────────────────────────────────────┤
│ PROCESS            │ Dataflow (Beam, stream+batch), Dataproc         │
│                    │ (Spark/Hadoop), Data Fusion (ETL GUI),          │
│                    │ BigQuery (serverless SQL), Dataform (SQL ELT)   │
├────────────────────┼─────────────────────────────────────────────────┤
│ ORCHESTRATE        │ Cloud Composer (Airflow), Cloud Scheduler,      │
│                    │ Workflows, Eventarc                             │
├────────────────────┼─────────────────────────────────────────────────┤
│ GOVERN             │ Dataplex (data mesh), Data Catalog, DLP API,   │
│                    │ BigQuery Column-level security                  │
├────────────────────┼─────────────────────────────────────────────────┤
│ ANALYSE / SERVE    │ BigQuery ML, Looker, Looker Studio, BI Engine,  │
│                    │ Vertex AI, Vertex AI Feature Store              │
└────────────────────┴─────────────────────────────────────────────────┘
```

## Key GCP Concepts

```bash
# gcloud CLI — the universal GCP command-line tool
gcloud config set project ads-data-prod
gcloud config set compute/region asia-south1
gcloud auth application-default login

# Projects
gcloud projects list
gcloud projects create ads-data-prod --folder=FOLDER_ID

# Service Accounts (non-human identities for services/pipelines)
gcloud iam service-accounts create dataflow-runner \
  --display-name="Dataflow Pipeline Runner" \
  --project=ads-data-prod

# Grant role to service account
gcloud projects add-iam-policy-binding ads-data-prod \
  --member="serviceAccount:dataflow-runner@ads-data-prod.iam.gserviceaccount.com" \
  --role="roles/dataflow.worker"

# Impersonate a service account (for local development)
gcloud auth application-default login \
  --impersonate-service-account=dataflow-runner@ads-data-prod.iam.gserviceaccount.com

# Key GCP environment variables
export GOOGLE_CLOUD_PROJECT=ads-data-prod
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

## Interview Questions and Answers

**Q1. What is the difference between a Zone, a Region, and a Multi-Region in GCP?**

Answer: A **Zone** is a single independent failure domain (essentially one datacenter) — VM, Persistent Disk, and Zonal GKE are zone-specific. A **Region** is a geographic area containing 3+ zones — regional resources (Cloud SQL, regional GCS) replicate across zones within the region, surviving single-zone failures. A **Multi-Region** (US, EU, ASIA) spans multiple geographic regions — multi-regional GCS and BigQuery data is replicated across at least two regions within the multi-region, surviving entire regional outages. For data engineering: use multi-regional storage for globally-served data or disaster recovery, regional for latency-sensitive analytics co-located with compute.

**Q2. How does IAM policy inheritance work in GCP?**

Answer: IAM policies are inherited hierarchically: Organisation → Folder → Project → Resource. A role granted at a higher level applies to all resources below. You cannot use a lower-level policy to deny a permission granted at a higher level — GCP IAM is additive only (no explicit DENY like AWS). For data governance: grant broad viewer roles at the folder level, grant sensitive data access (specific BigQuery datasets, GCS buckets) at the resource level via dataset/bucket-level IAM.

---

# 2. Cloud Storage (GCS)

## Theory

Cloud Storage is GCP's unified object storage — the backbone of all GCP data pipelines. Every data pipeline on GCP touches GCS: as a data lake landing zone, as staging between processing steps, as a checkpoint store, and as a model artefact registry.

GCS stores data as **objects** in **buckets**. An object consists of data (the file content) and metadata (key-value pairs including content-type, custom metadata, and system metadata). Objects are immutable — you replace, not modify. The "directory" structure is an illusion: `gs://bucket/path/to/file.csv` is one object whose name contains `/` characters.

**Storage classes** trade access frequency against cost:

```
┌─────────────────┬──────────────┬────────────────┬─────────────────────────┐
│ Storage Class   │ Min Duration │ Access Cost    │ Use Case                │
├─────────────────┼──────────────┼────────────────┼─────────────────────────┤
│ Standard        │ None         │ None           │ Hot data, frequent reads │
│ Nearline        │ 30 days      │ Per GB read    │ Once/month access        │
│ Coldline        │ 90 days      │ Per GB read    │ Once/quarter access      │
│ Archive         │ 365 days     │ Per GB read    │ Annual/compliance        │
└─────────────────┴──────────────┴────────────────┴─────────────────────────┘
```

**Object versioning** keeps previous versions on overwrite/delete — essential for data lake snapshots and accidental deletion protection. **Lifecycle rules** automate transitions between storage classes and deletion of old objects/versions — critical for cost management.

**Consistency model:** GCS provides **strong consistency** for all operations since November 2020 — read-after-write, list-after-write, and read-after-delete are all immediately consistent. This eliminates the eventual consistency workarounds previously needed.

## GCS Operations

```bash
# Create bucket
gsutil mb -p ads-data-prod -c STANDARD -l asia-south1 gs://jioads-data-lake-prod
gsutil mb -p ads-data-prod -c NEARLINE -l US gs://jioads-archive

# Upload / download
gsutil cp local_file.csv gs://jioads-data-lake-prod/raw/2024/01/
gsutil cp gs://bucket/path/file.parquet ./local_path/
gsutil -m cp -r gs://bucket/directory/ ./local/  # parallel recursive

# List objects
gsutil ls gs://jioads-data-lake-prod/raw/2024/
gsutil ls -l gs://jioads-data-lake-prod/raw/      # with sizes
gsutil ls -lh gs://jioads-data-lake-prod/raw/     # human readable

# Sync (like rsync)
gsutil -m rsync -r gs://source/ gs://destination/
gsutil -m rsync -r -d gs://source/ gs://dest/     # delete from dest if not in src

# Set lifecycle policy (JSON file)
gsutil lifecycle set lifecycle.json gs://jioads-data-lake-prod

# Signed URL (temporary public access)
gsutil signurl -d 1h service-account-key.json gs://bucket/private-file.pdf

# Object composition (combine multiple objects into one)
gsutil compose gs://bucket/part-0 gs://bucket/part-1 gs://bucket/output

# Set bucket-level IAM
gsutil iam ch serviceAccount:dataflow-runner@proj.iam.gserviceaccount.com:roles/storage.objectViewer gs://my-bucket
```

```python
# Python client library
from google.cloud import storage
import json
from datetime import timedelta

client = storage.Client(project="ads-data-prod")

# Upload with metadata
bucket = client.bucket("jioads-data-lake-prod")
blob = bucket.blob("raw/events/2024/01/15/events.parquet")
blob.metadata = {"source": "kafka", "schema_version": "v2.1"}
blob.upload_from_filename("events.parquet",
                           content_type="application/octet-stream")

# Upload with retry and timeout
from google.api_core import retry
blob.upload_from_filename(
    "large_file.parquet",
    retry=retry.Retry(deadline=300),
    timeout=300
)

# Download to memory
import io
content = blob.download_as_bytes()

# Streaming read (for large files)
with blob.open("rb") as f:
    import pyarrow.parquet as pq
    table = pq.read_table(f)

# List with prefix
blobs = client.list_blobs("jioads-data-lake-prod",
                           prefix="raw/events/2024/01/",
                           delimiter="/")  # simulates directory listing

# Generate signed URL (valid 1 hour)
url = blob.generate_signed_url(
    version="v4",
    expiration=timedelta(hours=1),
    method="GET"
)

# Lifecycle rules programmatically
bucket.add_lifecycle_delete_rule(age=365)   # delete after 1 year
bucket.add_lifecycle_set_storageclass_rule(
    "NEARLINE",
    age=30,           # transition to Nearline after 30 days
    matches_storage_class=["STANDARD"]
)
bucket.patch()
```

```json
// lifecycle.json — complete lifecycle policy
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "SetStorageClass", "storageClass": "NEARLINE"},
        "condition": {"age": 30, "matchesStorageClass": ["STANDARD"]}
      },
      {
        "action": {"type": "SetStorageClass", "storageClass": "COLDLINE"},
        "condition": {"age": 90, "matchesStorageClass": ["NEARLINE"]}
      },
      {
        "action": {"type": "SetStorageClass", "storageClass": "ARCHIVE"},
        "condition": {"age": 365, "matchesStorageClass": ["COLDLINE"]}
      },
      {
        "action": {"type": "Delete"},
        "condition": {"age": 2555, "isLive": false}
      }
    ]
  }
}
```

## GCS as a Data Lake

```
GCS Data Lake folder convention:
gs://company-data-lake/
├── raw/                           ← Exact copy of source, never modified
│   ├── kafka_events/
│   │   └── year=2024/month=01/day=15/hour=14/
│   │       └── events_1705330000.parquet
│   └── mysql_export/
│       └── year=2024/month=01/day=15/
│           └── orders_snapshot.parquet
├── curated/                       ← Cleaned, schema-enforced, validated
│   ├── events/
│   └── orders/
├── processed/                     ← Business-level aggregations
│   ├── campaign_daily_stats/
│   └── user_segments/
└── archive/                       ← Historical raw data (Coldline/Archive)
    └── ...
```

## Interview Questions and Answers

**Q1. What is the difference between GCS storage classes and when would you use each?**

Answer: Standard for hot data accessed frequently (daily Dataflow jobs, BigQuery external tables). Nearline for data accessed ~monthly (monthly reports, recent archive). Coldline for data accessed ~quarterly (compliance archives, quarterly audits). Archive for data accessed ~annually or less (regulatory retention, legal hold). Cost model: Standard has highest storage cost but no retrieval cost; Archive has lowest storage but highest retrieval cost. Use Object Lifecycle Management to automatically transition objects through classes as they age.

**Q2. How do you handle large file uploads reliably to GCS?**

Answer: For files > 5MB, use **resumable uploads** (default in `gsutil` and the Python client) — they split into chunks and can resume from the last successful chunk after network failures. For parallel uploads of many files: `gsutil -m cp -r` uses parallel composite uploads (splits large files into parts, uploads concurrently, then composes). For programmatic pipelines: use the storage client's `upload_from_filename` with `retry` and exponential backoff. For streaming data: write to GCS in chunks using the blob's write API.

**Q3. What is GCS object versioning and when should you enable it?**

Answer: Versioning keeps non-current versions when an object is overwritten or deleted. Use when: (1) you need to recover from accidental overwrite/delete of important data files, (2) you want point-in-time snapshots of data lake files, (3) for compliance requiring data immutability with audit trail. Trade-off: storage cost increases as non-current versions accumulate. Always pair versioning with a lifecycle rule that deletes non-current versions after N days (e.g., 30-day version retention) to control costs.

---

# 3. BigQuery — Deep Dive

## Theory

BigQuery is GCP's fully managed, serverless, columnar analytical data warehouse. It is the central hub of almost every GCP data architecture. Understanding BigQuery's architecture deeply is the most important topic for the GCP Data Engineer exam and interviews.

**Architecture: Storage + Compute Separation**

```
┌─────────────────────────────────────────────────────────────────────┐
│                   BIGQUERY ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Client (SQL / API / gcloud)                                        │
│           │                                                         │
│           ▼                                                         │
│  ┌─────────────────┐                                                │
│  │  Dremel Engine  │  ← Query planner and coordinator               │
│  │  (distributed   │    Decomposes query into execution tree         │
│  │   query engine) │    Dispatches to thousands of workers           │
│  └────────┬────────┘                                                │
│           │                                                         │
│  ┌────────▼────────────────────────────────────┐                   │
│  │           Colossus (Columnar Storage)        │                   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐     │                   │
│  │  │ Column 1│  │ Column 2│  │ Column 3│     │                   │
│  │  │ encoded │  │ encoded │  │ encoded │     │                   │
│  │  └─────────┘  └─────────┘  └─────────┘     │                   │
│  │  (Capacitor file format — BQ proprietary)   │                   │
│  └─────────────────────────────────────────────┘                   │
│                                                                     │
│  Compute (Dremel workers) and Storage (Colossus) are               │
│  DECOUPLED and connected by Jupiter network (petabit bandwidth)    │
└─────────────────────────────────────────────────────────────────────┘
```

**Key architectural properties:**
- **Serverless:** No clusters to manage. BQ auto-scales workers to query complexity.
- **Columnar + compressed:** Only columns referenced in the query are read from disk — 10-100× less I/O than row stores for analytics.
- **Dremel distributed execution:** Queries run on thousands of workers in parallel — a query over 1TB can complete in seconds.
- **Separation of storage and compute:** Storage in Colossus (GCS-like distributed filesystem), compute elastic. Pay separately.
- **Capacitor format:** BQ's internal columnar format with column-level encoding (RLE, dictionary, delta) and nested/repeated field support (Protocol Buffers inspiration).

**Pricing models:**

```
ON-DEMAND (Pay per query):
  $5 per TB of data scanned
  First 1 TB/month free
  Billed on bytes READ, not rows
  Use LIMIT, SELECT specific columns, partitioning/clustering to reduce scanned bytes

CAPACITY (FLAT-RATE / RESERVATIONS):
  Purchase "slots" (units of compute)
  1 slot = 1 virtual CPU
  Queries compete for assigned slots
  Editions: Standard, Enterprise, Enterprise Plus
  Autoscaler: buy baseline + burst capacity

STORAGE:
  Active storage:   $0.02/GB/month (modified in last 90 days)
  Long-term storage: $0.01/GB/month (not modified in 90+ days, auto)
  Streaming inserts: $0.01 per 200 MB
```

## BigQuery SQL and Features

```sql
-- ── Dataset and table operations ─────────────────────────────────────
-- Create dataset
CREATE SCHEMA IF NOT EXISTS `ads-data-prod.ad_analytics`
OPTIONS (
    location = 'asia-south1',
    description = 'JioAds analytics dataset',
    labels = [("env","prod"), ("team","data-eng")]
);

-- Create partitioned clustered table
CREATE TABLE IF NOT EXISTS `ads-data-prod.ad_analytics.ad_events`
(
    event_id     STRING NOT NULL,
    campaign_id  INT64,
    ad_id        INT64,
    user_id      INT64,
    event_type   STRING,   -- impression, click, purchase
    bid_price    FLOAT64,
    placement    STRING,
    event_time   TIMESTAMP NOT NULL,
    date_        DATE,
    hour_        INT64,
    payload      JSON,
    -- nested/repeated field
    user_props   STRUCT<age INT64, gender STRING, city STRING>,
    tag_ids      ARRAY<INT64>
)
PARTITION BY DATE(event_time)           -- date-based partition
CLUSTER BY campaign_id, event_type      -- clustering columns (up to 4)
OPTIONS (
    require_partition_filter = TRUE,    -- force queries to filter on partition
    partition_expiration_days = 365,    -- auto-delete partitions after 1 year
    description = 'Ad server events, partitioned by event date'
);

-- ── Partitioning options ──────────────────────────────────────────────
-- Time-based partitioning (most common)
PARTITION BY DATE(event_time)                -- daily (default)
PARTITION BY TIMESTAMP_TRUNC(event_time, HOUR)  -- hourly
PARTITION BY TIMESTAMP_TRUNC(event_time, MONTH) -- monthly

-- Integer range partitioning
PARTITION BY RANGE_BUCKET(campaign_id, GENERATE_ARRAY(0, 100000, 1000))

-- Ingestion-time partitioning (uses _PARTITIONTIME pseudo-column)
PARTITION BY _PARTITIONDATE

-- ── Clustering ─────────────────────────────────────────────────────────
-- BQ sorts data within each partition by the clustering columns
-- Reduces bytes scanned for queries filtering on these columns
-- Up to 4 clustering columns, order matters (leftmost is most selective)
CLUSTER BY campaign_id, event_type, placement

-- ── Querying with partition and cluster pruning ─────────────────────
SELECT
    campaign_id,
    COUNT(*) AS impressions,
    SUM(bid_price) AS total_spend
FROM `ads-data-prod.ad_analytics.ad_events`
WHERE DATE(event_time) BETWEEN '2024-01-01' AND '2024-01-31'  -- partition filter
  AND event_type = 'impression'    -- cluster filter
  AND campaign_id IN (101, 102, 103)  -- cluster filter
GROUP BY campaign_id;

-- Check bytes scanned before running (dry run)
-- Use bq CLI: bq query --dry_run --use_legacy_sql=false 'SELECT ...'

-- ── INFORMATION_SCHEMA for metadata ──────────────────────────────────
-- Table metadata
SELECT * FROM `ads-data-prod.ad_analytics.INFORMATION_SCHEMA.TABLES`;

-- Partition information
SELECT partition_id, total_rows, total_logical_bytes, last_modified_time
FROM `ads-data-prod.ad_analytics.INFORMATION_SCHEMA.PARTITIONS`
WHERE table_name = 'ad_events'
ORDER BY partition_id DESC
LIMIT 30;

-- Column info with clustering
SELECT column_name, data_type, is_partitioning_column, clustering_ordinal_position
FROM `ads-data-prod.ad_analytics.INFORMATION_SCHEMA.COLUMNS`
WHERE table_name = 'ad_events';

-- Job history and bytes billed
SELECT job_id, query, total_bytes_processed, total_bytes_billed, creation_time
FROM `region-asia-south1`.INFORMATION_SCHEMA.JOBS_BY_PROJECT
WHERE creation_time > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 DAY)
ORDER BY total_bytes_billed DESC
LIMIT 20;

-- ── BigQuery ML ───────────────────────────────────────────────────────
-- Train a logistic regression model directly in SQL
CREATE OR REPLACE MODEL `ad_analytics.ctr_prediction_model`
OPTIONS (
    model_type = 'logistic_reg',
    input_label_cols = ['clicked'],
    max_iterations = 100,
    l2_reg = 0.01,
    enable_global_explain = TRUE
) AS
SELECT
    campaign_id,
    hour_,
    placement,
    bid_price,
    user_props.age,
    user_props.city,
    IF(event_type = 'click', 1, 0) AS clicked
FROM `ad_analytics.ad_events`
WHERE DATE(event_time) BETWEEN '2023-01-01' AND '2023-12-31';

-- Predict CTR
SELECT campaign_id, predicted_clicked, predicted_clicked_probs
FROM ML.PREDICT(
    MODEL `ad_analytics.ctr_prediction_model`,
    (SELECT campaign_id, hour_, placement, bid_price, user_props.age, user_props.city
     FROM `ad_analytics.ad_events`
     WHERE DATE(event_time) = CURRENT_DATE())
);

-- Evaluate model
SELECT * FROM ML.EVALUATE(MODEL `ad_analytics.ctr_prediction_model`);
-- Returns: precision, recall, accuracy, f1_score, log_loss, roc_auc

-- Other BQML model types:
-- 'linear_reg', 'kmeans', 'matrix_factorization', 'time_series' (ARIMA+),
-- 'boosted_tree_classifier', 'dnn_classifier', 'automl_classifier',
-- 'tensorflow' (import TF model), 'xgboost'

-- ── Nested and repeated fields ──────────────────────────────────────
-- Unnest array
SELECT event_id, tag
FROM `ad_analytics.ad_events`
CROSS JOIN UNNEST(tag_ids) AS tag
WHERE DATE(event_time) = '2024-01-15';

-- Access struct fields
SELECT
    event_id,
    user_props.age,
    user_props.city,
    user_props.gender
FROM `ad_analytics.ad_events`;

-- Aggregate within struct/array
SELECT
    event_id,
    (SELECT COUNT(*) FROM UNNEST(tag_ids)) AS tag_count,
    (SELECT MAX(t) FROM UNNEST(tag_ids) AS t) AS max_tag_id
FROM `ad_analytics.ad_events`;

-- ── Scheduled queries ─────────────────────────────────────────────────
-- Via BigQuery UI / API / bq CLI:
-- bq mk --transfer_config \
--   --project_id=ads-data-prod \
--   --data_source=scheduled_query \
--   --display_name='Daily campaign stats' \
--   --schedule='every 24 hours' \
--   --target_dataset=ad_analytics \
--   --params='{"query":"SELECT ...", "destination_table_name_template":"campaign_stats_{run_date}"}'

-- ── Row-level security ────────────────────────────────────────────────
-- Row access policy: region-based data isolation
CREATE ROW ACCESS POLICY india_only
ON `ad_analytics.ad_events`
GRANT TO ("group:india-team@company.com")
FILTER USING (region = 'IN');

-- ── Column-level security ─────────────────────────────────────────────
-- Use policy tags (Data Catalog) to restrict PII columns
-- Tag column with "PII/Email" policy tag
-- Grant Fine-Grained Reader role to specific users for that tag
ALTER TABLE `ad_analytics.ad_events`
ALTER COLUMN user_id SET OPTIONS (privacy_policy_tag = 'PII/UserId');
```

## BigQuery Data Loading Patterns

```python
from google.cloud import bigquery
from google.cloud.bigquery import LoadJobConfig, WriteDisposition, SourceFormat

client = bigquery.Client(project="ads-data-prod")

# ── Load from GCS ─────────────────────────────────────────────────────
job_config = LoadJobConfig(
    source_format=SourceFormat.PARQUET,
    write_disposition=WriteDisposition.WRITE_APPEND,
    schema_update_options=[bigquery.SchemaUpdateOption.ALLOW_FIELD_ADDITION],
    time_partitioning=bigquery.TimePartitioning(
        type_=bigquery.TimePartitioningType.DAY,
        field="event_time"
    ),
    clustering_fields=["campaign_id", "event_type"],
    ignore_unknown_values=True
)

load_job = client.load_table_from_uri(
    "gs://jioads-data-lake-prod/curated/ad_events/2024/01/15/*.parquet",
    "ads-data-prod.ad_analytics.ad_events",
    job_config=job_config
)
load_job.result()  # wait for completion

# ── Streaming inserts (for real-time, low latency) ─────────────────────
# NOTE: streaming inserts cost $0.01/200MB and have a small buffer latency
# Prefer batch loading via GCS for cost efficiency
table = client.get_table("ads-data-prod.ad_analytics.ad_events")
errors = client.insert_rows_json(table, [
    {"event_id": "ev001", "campaign_id": 101, "event_type": "click",
     "event_time": "2024-01-15T14:30:00Z", "bid_price": 2.5}
])
if errors:
    raise RuntimeError(f"Streaming insert errors: {errors}")

# ── BigQuery Storage Write API (recommended over streaming inserts) ────
# Exactly-once semantics, lower latency, batch commit
from google.cloud.bigquery_storage_v1 import BigQueryWriteClient, types

write_client = BigQueryWriteClient()
parent = write_client.table_path("ads-data-prod", "ad_analytics", "ad_events")

# Committed stream (default, immediately visible)
write_stream = types.WriteStream()
write_stream.type_ = types.WriteStream.Type.COMMITTED
write_stream = write_client.create_write_stream(parent=parent,
                                                 write_stream=write_stream)

# ── External tables (query GCS directly without loading) ──────────────
external_config = bigquery.ExternalConfig("PARQUET")
external_config.source_uris = ["gs://jioads-data-lake-prod/raw/events/*.parquet"]
external_config.hive_partitioning_options = bigquery.HivePartitioningOptions(
    mode="CUSTOM",
    source_uri_prefix="gs://jioads-data-lake-prod/raw/events/",
    require_partition_filter=True
)
# Field definitions for Hive partitions:
# gs://...events/year=2024/month=01/day=15/file.parquet

table = bigquery.Table("ads-data-prod.ad_analytics.ad_events_external")
table.external_data_configuration = external_config
client.create_table(table, exists_ok=True)

# ── BigLake (unified table over GCS/S3/Azure Blob) ─────────────────────
# BigLake extends external tables with fine-grained security, row/col-level policies
# Works with Iceberg, Delta, Parquet, ORC, Avro on GCS
```

## Interview Questions and Answers

**Q1. How does BigQuery partition pruning work and what prevents it?**

Answer: BigQuery reads only partitions matching the `WHERE` clause predicate on the partition column. For a `PARTITION BY DATE(event_time)` table, `WHERE DATE(event_time) = '2024-01-15'` reads only that day's partition — 1/365th of the data. Partition pruning is prevented by: (1) applying a function to the partition column that BQ can't resolve at plan time (e.g., `WHERE EXTRACT(YEAR FROM event_time) = 2024`); (2) using a subquery value instead of a constant; (3) for `require_partition_filter = TRUE` tables — the query fails with an error instead of doing a full scan, which is safer.

**Q2. What is the difference between partitioning and clustering in BigQuery?**

Answer: **Partitioning** divides the table into physically separate storage units by a partition column — BQ can completely skip reading non-matching partitions. The partition column must have low cardinality (date, integer ranges). **Clustering** sorts data within each partition by the clustering columns — BQ can skip blocks within a partition where the cluster column values don't match the filter. Clustering handles higher-cardinality columns like `campaign_id`. They are complementary: partition by date, cluster by campaign_id and event_type. Partition pruning is always applied first (eliminates entire partitions), clustering pruning then eliminates blocks within the remaining partitions.

**Q3. When should you use BigQuery streaming inserts vs batch loads?**

Answer: **Streaming inserts** for: data that must be queryable within seconds, real-time dashboards, fraud detection. Downsides: costs 100× more than batch loads, cannot use DML to UPDATE/DELETE streaming buffer rows immediately, slight latency before data is consistent. **Batch loads** (via GCS) for: end-of-day pipelines, Dataflow/Dataproc output, cost-sensitive workloads — loading is free, only storage is billed. **Storage Write API** is the modern recommendation for streaming — supports exactly-once semantics, is faster and cheaper than legacy streaming inserts, and supports pending stream (batch commit for consistency).

**Q4. Explain BigQuery slots and how they affect query performance.**

Answer: A **slot** is a unit of BigQuery computational capacity — approximately one virtual CPU with associated memory and I/O. BQ decomposes queries into execution stages, each consuming slots. With on-demand pricing, BQ auto-assigns slots based on query complexity and project quota (2,000 default; requestable up to 20,000). With capacity reservations, you buy a fixed number of slots and queries compete within your allocation. **Slot contention** (many concurrent heavy queries on a fixed slot pool) causes queue delays. Solutions: increase reservation, use workload management to assign slot pools to different query groups, or schedule heavy queries during off-peak hours.

**Q5. What is BigQuery OMNI and when would you use it?**

Answer: BigQuery Omni extends BigQuery's query engine to run across multi-cloud data in AWS S3 and Azure Blob Storage without moving data to GCP. It uses Anthos to run BQ compute in customer-managed cloud environments. Use when: regulatory requirements prevent data movement, data is generated natively on AWS/Azure, or for cost analysis before full migration to GCP. It shares the same BQ SQL interface, pricing model, and IAM — but queries run in the remote cloud region to minimise egress costs.

---

# 4. Cloud Pub/Sub

## Theory

Cloud Pub/Sub is GCP's fully managed asynchronous messaging service for event streaming. It is the standard ingest layer for real-time data pipelines on GCP — decoupling event producers (ad servers, mobile apps, IoT devices) from event consumers (Dataflow, BigQuery, Cloud Functions).

**Core concepts:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PUB/SUB ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Publisher (Ad Server)                                              │
│       │  publish(message, topic)                                    │
│       ▼                                                             │
│  ┌──────────────────┐                                               │
│  │      Topic       │  ← Named message channel                     │
│  │  ad-events-topic │    Messages stored durably for retention period│
│  └──────┬───────────┘                                               │
│         │  fan-out                                                  │
│    ┌────┴────────────────────┐                                      │
│    ▼                         ▼                                      │
│  ┌──────────────────┐  ┌──────────────────┐                        │
│  │   Subscription A │  │   Subscription B │  ← Independent cursors │
│  │ (Dataflow job)   │  │ (BigQuery direct)│                        │
│  └────────┬─────────┘  └──────────────────┘                        │
│           │ pull / push                                             │
│           ▼                                                         │
│  Subscriber (Dataflow)                                              │
│       acknowledge(message_id)  ← MUST ack within ack deadline       │
│                                  or message redelivered              │
└─────────────────────────────────────────────────────────────────────┘

Key properties:
- At-least-once delivery (duplicates possible)
- Messages retained for 7 days by default (configurable 10 min - 7 days)
- Up to 10 MB per message
- Global service (no region selection needed — messages replicated)
- Throughput: millions of messages/second globally
- Ordering guarantee: only with Ordering Keys within a region
```

**Delivery semantics:**
- **At-least-once (default):** Message delivered at least once; duplicates possible if ack times out. Consumers must be idempotent.
- **Exactly-once (Pub/Sub Lite only):** Exactly-once with ordering within a partition, but reduced throughput and regional-only.

## Pub/Sub Operations

```python
from google.cloud import pubsub_v1
from google.protobuf import duration_pb2
import json, time, concurrent.futures

project_id = "ads-data-prod"
topic_id   = "ad-events-topic"
sub_id     = "ad-events-dataflow-sub"

# ── Publisher ─────────────────────────────────────────────────────────
publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(project_id, topic_id)

# Create topic with schema
# (use gcloud or console to attach a schema for validation)
publisher.create_topic(request={"name": topic_path})

# Publish single message with attributes
def publish_ad_event(event: dict) -> str:
    data = json.dumps(event).encode("utf-8")
    future = publisher.publish(
        topic_path,
        data,
        # Ordering key: all messages with same key are delivered in order
        ordering_key=str(event.get("campaign_id", "")),
        # Custom attributes (filterable on subscription)
        event_type=event["event_type"],
        source="ad-server-v2"
    )
    return future.result(timeout=30)  # returns message_id

# Batch publish (optimise for throughput)
publisher_options = pubsub_v1.types.BatchSettings(
    max_bytes=1024 * 1024,    # 1 MB max batch size
    max_latency=0.01,         # 10ms max batching delay
    max_messages=1000
)
batch_publisher = pubsub_v1.PublisherClient(
    batch_settings=publisher_options
)

# Async publish with callback
futures = []
for event in events_batch:
    data = json.dumps(event).encode("utf-8")
    future = batch_publisher.publish(topic_path, data)
    futures.append(future)

# Wait for all publishes
for future in concurrent.futures.as_completed(futures):
    try:
        msg_id = future.result()
    except Exception as e:
        print(f"Publish failed: {e}")

# ── Subscriber (pull) ─────────────────────────────────────────────────
subscriber = pubsub_v1.SubscriberClient()
sub_path = subscriber.subscription_path(project_id, sub_id)

# Streaming pull (recommended for high-throughput)
def process_message(message: pubsub_v1.types.ReceivedMessage) -> None:
    try:
        data = json.loads(message.data.decode("utf-8"))
        process_event(data)
        message.ack()                      # acknowledge on success
    except Exception as e:
        print(f"Processing failed: {e}")
        message.nack()                     # nack: re-deliver after delay

flow_control = pubsub_v1.types.FlowControl(
    max_messages=1000,          # max in-flight messages
    max_bytes=100 * 1024 * 1024 # 100 MB max in-flight
)

streaming_pull_future = subscriber.subscribe(
    sub_path,
    callback=process_message,
    flow_control=flow_control
)

with subscriber:
    try:
        streaming_pull_future.result(timeout=300)
    except Exception:
        streaming_pull_future.cancel()

# ── Create subscription with DLQ ─────────────────────────────────────
# Dead Letter Topic: messages that fail delivery N times go here
subscriber.create_subscription(
    request={
        "name": sub_path,
        "topic": topic_path,
        "ack_deadline_seconds": 60,         # 10-600s; increase for slow consumers
        "enable_exactly_once_delivery": False,
        "dead_letter_policy": {
            "dead_letter_topic": f"projects/{project_id}/topics/ad-events-dlq",
            "max_delivery_attempts": 5      # nack 5 times → send to DLQ
        },
        "retry_policy": {
            "minimum_backoff": duration_pb2.Duration(seconds=10),
            "maximum_backoff": duration_pb2.Duration(seconds=600)
        },
        "message_retention_duration": duration_pb2.Duration(seconds=7*24*3600),
        # Filter: only receive click events (reduces cost)
        "filter": 'attributes.event_type = "click"'
    }
)

# ── BigQuery subscription (no code needed for BQ ingestion!) ──────────
# Pub/Sub → BigQuery Direct — automatically writes to BQ table
# gcloud pubsub subscriptions create bq-direct-sub \
#   --topic=ad-events-topic \
#   --bigquery-table=ads-data-prod:ad_analytics.ad_events_raw \
#   --use-topic-schema \
#   --drop-unknown-fields
```

## Pub/Sub Lite vs Pub/Sub

```
┌──────────────────┬──────────────────────────┬─────────────────────────┐
│ Feature          │ Pub/Sub                  │ Pub/Sub Lite            │
├──────────────────┼──────────────────────────┼─────────────────────────┤
│ Delivery         │ At-least-once            │ At-least-once           │
│ Ordering         │ Per ordering key         │ Per partition key       │
│ Exactly-once     │ No                       │ Yes (within partition)  │
│ Retention        │ 7 days                   │ Configurable (GCS)      │
│ Scope            │ Global                   │ Zonal or Regional       │
│ Capacity         │ Auto-scaled              │ Pre-provisioned         │
│ Cost model       │ Per message              │ Per provisioned capacity│
│ Replays          │ Limited (seek by time)   │ Full replay via seek    │
│ Use case         │ Standard event streaming │ Kafka-like, cost-opt.   │
└──────────────────┴──────────────────────────┴─────────────────────────┘
```

## Interview Questions and Answers

**Q1. What is the difference between a Pub/Sub Topic and a Subscription?**

Answer: A **Topic** is the named channel to which publishers send messages — it is the source of truth for published messages and retains them for the retention period. A **Subscription** is an independently-maintained cursor into a topic's message stream. Multiple subscriptions on the same topic each receive ALL messages independently (fan-out pattern). Within a subscription, messages are distributed across all connected subscribers (competing consumers pattern — load balancing). A message is only deleted from storage when ALL subscriptions have acknowledged it (or the retention period expires).

**Q2. How do you guarantee message ordering in Pub/Sub?**

Answer: Use **Ordering Keys**: set the `ordering_key` attribute when publishing — all messages with the same ordering key from the same region are delivered in the order published, to the same subscriber instance. The subscription must have `enable_message_ordering=True`. Limitation: when a message fails delivery, subsequent messages with the same ordering key are paused until the failed message succeeds or is nacked with `nack()` and re-queued. For strict global ordering across all messages, consider Pub/Sub Lite with a single partition — but this caps throughput.

**Q3. What is the dead letter topic pattern and when should you implement it?**

Answer: A Dead Letter Topic (DLT) captures messages that cannot be processed successfully after N delivery attempts (`max_delivery_attempts`). Without a DLT, a persistently failing message blocks the subscription cursor (for ordered subscriptions) or is re-delivered indefinitely. With a DLT: the problematic message is forwarded to the DLT after N attempts, allowing the main subscription to continue. Monitor the DLT with alerts to detect systemic processing failures. Common causes requiring DLT handling: schema changes in incoming data, downstream service outages, or corrupt messages.

---

# 5. Cloud Dataflow (Apache Beam)

## Theory

Cloud Dataflow is GCP's fully managed execution engine for Apache Beam pipelines. It handles the hardest distributed processing problems — autoscaling, fault tolerance, exactly-once processing, dynamic work rebalancing — while you write business logic in Beam's unified batch+streaming model.

**Apache Beam programming model:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                 BEAM PIPELINE MODEL                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Pipeline (p)                                                       │
│       │                                                             │
│  ┌────▼────────────────────────────────────────────────────┐       │
│  │  Read (Source)                                          │       │
│  │  PubSub / GCS / BigQuery / Kafka / Custom               │       │
│  └────┬────────────────────────────────────────────────────┘       │
│       │ PCollection<T>                                              │
│  ┌────▼────────────────────────────────────────────────────┐       │
│  │  Transforms                                             │       │
│  │  ParDo → GroupByKey → Combine → Window → Flatten...    │       │
│  └────┬────────────────────────────────────────────────────┘       │
│       │ PCollection<U>                                              │
│  ┌────▼────────────────────────────────────────────────────┐       │
│  │  Write (Sink)                                           │       │
│  │  BigQuery / GCS / Pub/Sub / Bigtable / Custom           │       │
│  └─────────────────────────────────────────────────────────┘       │
│                                                                     │
│  Key abstractions:                                                  │
│  PCollection: immutable distributed dataset (bounded or unbounded)  │
│  PTransform: data transformation (stateless or stateful)            │
│  DoFn: user-defined function applied per element in a ParDo         │
│  Window: time-based grouping of streaming elements                  │
│  Trigger: controls when window results are emitted                  │
│  Watermark: progress indicator for event time                       │
└─────────────────────────────────────────────────────────────────────┘
```

**Streaming concepts — Windowing:**

```
Event time vs Processing time:
  Event time:      when the event actually occurred (in the data)
  Processing time: when the pipeline processes the event
  Watermark:       estimate of how far behind real time event data is
                   "we believe all events before T-2min have arrived"

Tumbling window:   fixed, non-overlapping (1 min windows: [0-1], [1-2], [2-3])
Sliding window:    overlapping (5 min window every 1 min: [0-5], [1-6], [2-7])
Session window:    gap-based (window closes after N min inactivity per key)
Global window:     all data in one window (for unbounded with triggers)

Late data handling:
  allowed_lateness: accept late elements up to N seconds after window closes
  triggers: when to emit: AfterWatermark, AfterProcessingTime, AfterCount
  accumulation_mode: ACCUMULATING (add to prev result) or DISCARDING
```

## Dataflow Pipeline Code

```python
import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions, StandardOptions
from apache_beam.transforms.window import FixedWindows, SlidingWindows, Sessions
from apache_beam.transforms.trigger import AfterWatermark, AfterProcessingTime, AccumulationMode
import json
from typing import Dict, Any, Tuple, Iterator

# ── Pipeline options ─────────────────────────────────────────────────
options = PipelineOptions([
    "--project=ads-data-prod",
    "--region=asia-south1",
    "--runner=DataflowRunner",
    "--temp_location=gs://jioads-data-lake-prod/dataflow/temp",
    "--staging_location=gs://jioads-data-lake-prod/dataflow/staging",
    "--job_name=ad-events-processing",
    "--num_workers=4",
    "--max_num_workers=20",
    "--machine_type=n1-standard-4",
    "--disk_size_gb=100",
    "--autoscaling_algorithm=THROUGHPUT_BASED",
    "--enable_streaming_engine",             # offload state to Google infra
    "--experiments=use_runner_v2",
    "--save_main_session"
])
options.view_as(StandardOptions).streaming = True

# ── DoFn: parse and enrich events ────────────────────────────────────
class ParseAdEventDoFn(beam.DoFn):
    """Parse Pub/Sub message, validate, enrich."""

    # Dead letter output tag
    DEAD_LETTER_TAG = beam.pvalue.TaggedOutput("dead_letter")

    def setup(self):
        """Called once per worker — initialise expensive resources."""
        # Load campaign metadata from GCS/Bigtable
        self.campaign_cache = {}  # production: load from Bigtable

    def process(self, element: bytes,
                timestamp=beam.DoFn.TimestampParam,
                window=beam.DoFn.WindowParam) -> Iterator:
        try:
            event = json.loads(element.decode("utf-8"))
            # Validate required fields
            if not all(k in event for k in ["event_id", "campaign_id", "event_type"]):
                yield self.DEAD_LETTER_TAG, {"raw": element.decode(), "error": "missing fields"}
                return

            # Enrich with campaign data
            event["campaign_name"] = self.campaign_cache.get(
                event["campaign_id"], "unknown"
            )
            event["processing_timestamp"] = str(timestamp)
            yield event

        except json.JSONDecodeError as e:
            yield self.DEAD_LETTER_TAG, {"raw": element.decode(), "error": str(e)}

    def teardown(self):
        """Called when worker shuts down — cleanup."""
        pass


# ── Stateful DoFn: per-key state and timers ───────────────────────────
class CTRComputeDoFn(beam.DoFn):
    """Compute running CTR per campaign using Beam state."""

    IMPRESSIONS = beam.transforms.userstate.CombiningValueStateSpec(
        "impressions", beam.transforms.combinefn.TopCombineFn(100)
    )
    CLICKS = beam.transforms.userstate.CombiningValueStateSpec(
        "clicks", sum
    )
    FLUSH_TIMER = beam.transforms.timeutil.TimerSpec(
        "flush", beam.transforms.timeutil.TimeDomain.PROCESSING_TIME
    )

    def process(self, element: Tuple[int, Dict],
                impressions=beam.DoFn.StateParam(IMPRESSIONS),
                clicks=beam.DoFn.StateParam(CLICKS),
                flush_timer=beam.DoFn.TimerParam(FLUSH_TIMER)):
        campaign_id, event = element
        if event["event_type"] == "impression":
            impressions.add(1)
        elif event["event_type"] == "click":
            clicks.add(1)

        # Set flush timer 30 seconds from now (or reset existing)
        flush_timer.set(beam.utils.timestamp.Timestamp.now() + 30)

    @beam.DoFn.on_timer(FLUSH_TIMER)
    def flush(self, impressions=beam.DoFn.StateParam(IMPRESSIONS),
              clicks=beam.DoFn.StateParam(CLICKS)):
        imp_count = sum(impressions.read() or [0])
        clk_count = clicks.read() or 0
        ctr = clk_count / max(imp_count, 1)
        yield {"impressions": imp_count, "clicks": clk_count, "ctr": ctr}
        impressions.clear()
        clicks.clear()


# ── Main pipeline ─────────────────────────────────────────────────────
with beam.Pipeline(options=options) as p:

    # Read from Pub/Sub
    raw_events = (
        p
        | "ReadPubSub" >> beam.io.ReadFromPubSub(
            subscription="projects/ads-data-prod/subscriptions/ad-events-dataflow-sub",
            with_attributes=True,
            timestamp_attribute="event_time"  # use event time, not processing time
        )
        | "ExtractData" >> beam.Map(lambda msg: msg.data)
    )

    # Parse with dead-letter routing
    parsed = (
        raw_events
        | "ParseEvents" >> beam.ParDo(ParseAdEventDoFn())
              .with_outputs(ParseAdEventDoFn.DEAD_LETTER_TAG,
                            main="valid_events")
    )

    valid_events = parsed.valid_events
    dead_letter  = parsed.dead_letter

    # Window: 1-minute tumbling windows with 10-second allowed lateness
    windowed = (
        valid_events
        | "ApplyWindow" >> beam.WindowInto(
            FixedWindows(60),                              # 60-second tumbling window
            trigger=AfterWatermark(
                late=AfterProcessingTime(delay=30)         # fire again 30s after watermark
            ),
            allowed_lateness=10,                           # accept data up to 10s late
            accumulation_mode=AccumulationMode.DISCARDING  # don't accumulate late results
        )
    )

    # Aggregate per campaign per window
    campaign_stats = (
        windowed
        | "KeyByCampaign"  >> beam.Map(lambda e: (e["campaign_id"], e))
        | "GroupByCampaign">> beam.GroupByKey()
        | "AggregateStats" >> beam.Map(lambda kv: {
            "campaign_id":  kv[0],
            "impressions":  sum(1 for e in kv[1] if e["event_type"] == "impression"),
            "clicks":       sum(1 for e in kv[1] if e["event_type"] == "click"),
            "total_spend":  sum(e.get("bid_price", 0) for e in kv[1])
        })
    )

    # Write valid events to BigQuery
    valid_events | "WriteToBQ" >> beam.io.WriteToBigQuery(
        table="ads-data-prod:ad_analytics.ad_events",
        schema="AUTO_DETECT",
        write_disposition=beam.io.BigQueryDisposition.WRITE_APPEND,
        create_disposition=beam.io.BigQueryDisposition.CREATE_IF_NEEDED,
        method=beam.io.WriteToBigQuery.Method.STORAGE_WRITE_API,  # exactly-once
        triggering_frequency=60  # commit every 60 seconds
    )

    # Write stats to BigQuery
    campaign_stats | "WriteStatsToBQ" >> beam.io.WriteToBigQuery(
        table="ads-data-prod:ad_analytics.campaign_window_stats",
        schema="AUTO_DETECT",
        write_disposition=beam.io.BigQueryDisposition.WRITE_APPEND
    )

    # Write dead letters to GCS for inspection
    dead_letter | "WriteDeadLetter" >> beam.io.WriteToText(
        "gs://jioads-data-lake-prod/dead-letter/ad-events/",
        file_name_suffix=".json"
    )
```

## Interview Questions and Answers

**Q1. What is the difference between event time and processing time in Dataflow?**

Answer: **Event time** is when the event actually occurred (recorded in the event's timestamp field). **Processing time** is when the pipeline receives and processes the event. In real-world streaming, events arrive late — a mobile app event with event_time 14:30:00 might arrive at the pipeline at 14:32:30 (2.5 minutes late due to network, buffering, offline mode). The **watermark** is Dataflow's estimate of how far behind real-time the event data is — "we believe all events before T-W have arrived." Windowing by event time gives correct business metrics (what happened at 14:30) even with late data; windowing by processing time gives only pipeline throughput metrics.

**Q2. Explain Dataflow's exactly-once processing guarantee.**

Answer: Dataflow achieves exactly-once semantics through three mechanisms: (1) **Checkpointing** — pipeline state is durably saved; on failure, workers restart from the last checkpoint and reprocess from there. (2) **Idempotent writes** — BigQuery's Storage Write API with pending streams uses unique stream IDs to deduplicate re-submitted batches. (3) **Shuffle service** — Dataflow's managed shuffle service (for GroupByKey operations) handles failures by tracking exactly which data has been shuffled. This is why the recommended sink is `STORAGE_WRITE_API` with `triggering_frequency` — it buffers writes and commits atomically, enabling exactly-once delivery to BigQuery.

**Q3. What is Dataflow Prime and Streaming Engine?**

Answer: **Streaming Engine** offloads pipeline state and window state management from worker VMs to Google's managed backend (Bigtable-like). Benefits: workers use significantly less memory (state is remote), faster autoscaling (no state to migrate when adding workers), and more stable performance. **Dataflow Prime** is the next-generation runner (formerly Runner v2) with: vertical autoscaling (right-size worker VMs), horizontal autoscaling, and improved performance. Both are enabled with `--enable_streaming_engine` and `--experiments=use_runner_v2`. Always enable these for production streaming pipelines.

---

# 6. Cloud Dataproc (Managed Spark/Hadoop)

## Theory

Cloud Dataproc is GCP's managed service for running Apache Spark, Hadoop, Hive, Flink, and Presto clusters. Unlike Dataflow (purpose-built for Beam), Dataproc runs existing Spark/Hadoop workloads with minimal migration effort — it provisions clusters in 90 seconds, compared to on-premises clusters that take hours to days.

**When to use Dataproc vs Dataflow:**

```
┌─────────────────────────────────┬──────────────────────────────────┐
│ Use Dataproc when:              │ Use Dataflow when:               │
├─────────────────────────────────┼──────────────────────────────────┤
│ Migrating existing Spark code   │ Writing new pipelines from scratch│
│ Complex Spark ML (MLlib, XGBoost│ Unified batch+stream in one code │
│ Spark SQL with complex UDFs     │ Serverless (no cluster mgmt)     │
│ Hive metastore integration      │ Auto-scaling for spiky workloads │
│ Cost-sensitive batch jobs       │ Exactly-once streaming semantics │
│ Spark Structured Streaming      │ No Spark/Java expertise in team  │
│ Fine-grained cluster control    │                                  │
└─────────────────────────────────┴──────────────────────────────────┘
```

**Dataproc cluster types:**
- **Standard cluster:** Master + worker nodes (VMs). Persistent, reusable. Good for long-running workloads.
- **Single-node cluster:** Master only (no workers). Development, testing, small jobs.
- **High-availability cluster:** 3 masters. Production-grade, survives master failures.
- **Dataproc Serverless (Spark Serverless):** No cluster management. Submit Spark batch jobs directly. GCP provisions, scales, and tears down infrastructure automatically. Pay per vCPU-second. Best for infrequent, variable-size jobs.

**Cost optimisation — Preemptible VMs (Spot VMs):**
Workers can be preemptible (Spot) VMs — 60-91% cheaper than regular VMs. GCP can reclaim them with 30-second notice. Dataproc handles preemption gracefully by requeuing failed tasks. Use preemptible workers for processing workers (not master, not primary workers). Rule of thumb: preemptible workers for 2/3 of total workers; regular VMs for 1/3.

## Dataproc Operations

```bash
# ── Create cluster ────────────────────────────────────────────────────
gcloud dataproc clusters create jioads-spark-cluster \
  --project=ads-data-prod \
  --region=asia-south1 \
  --zone=asia-south1-a \
  --master-machine-type=n1-standard-8 \
  --master-boot-disk-size=500GB \
  --num-workers=4 \
  --worker-machine-type=n1-standard-8 \
  --worker-boot-disk-size=500GB \
  --num-secondary-workers=8 \           # preemptible workers
  --secondary-worker-type=preemptible \
  --image-version=2.1-debian11 \        # Spark 3.3, Hadoop 3.3
  --properties=spark:spark.executor.memory=6g,spark:spark.driver.memory=4g \
  --initialization-actions=gs://goog-dataproc-initialization-actions-asia-south1/python/pip-install.sh \
  --metadata=PIP_PACKAGES="lightgbm scikit-learn pandas" \
  --enable-component-gateway \          # Web UIs (Spark UI, YARN) via IAP
  --optional-components=JUPYTER \
  --bucket=jioads-data-lake-prod

# ── Submit Spark job ─────────────────────────────────────────────────
gcloud dataproc jobs submit pyspark \
  gs://jioads-data-lake-prod/jobs/ctr_feature_engineering.py \
  --cluster=jioads-spark-cluster \
  --region=asia-south1 \
  --properties=spark.executor.instances=8,spark.executor.memory=6g \
  -- --input_date=2024-01-15 --output_table=ad_analytics.features

# Submit Spark JAR job
gcloud dataproc jobs submit spark \
  --class=com.jioads.InventoryRanker \
  --jars=gs://jioads-data-lake-prod/jars/inventory-ranker-1.0.jar \
  --cluster=jioads-spark-cluster \
  --region=asia-south1 \
  -- --date=2024-01-15

# Submit Hive query
gcloud dataproc jobs submit hive \
  --cluster=jioads-spark-cluster \
  --region=asia-south1 \
  -f gs://jioads-data-lake-prod/hive/daily_stats.hql \
  -hivevar date=2024-01-15

# ── Dataproc Serverless (no cluster needed) ────────────────────────
gcloud dataproc batches submit pyspark \
  gs://jioads-data-lake-prod/jobs/batch_scoring.py \
  --project=ads-data-prod \
  --region=asia-south1 \
  --deps-bucket=gs://jioads-data-lake-prod/dataproc-serverless/ \
  --service-account=dataproc-runner@ads-data-prod.iam.gserviceaccount.com \
  --subnet=projects/ads-data-prod/regions/asia-south1/subnetworks/dataproc-subnet \
  --properties=spark.executor.cores=4,spark.executor.memory=8g \
  --py-files=gs://jioads-data-lake-prod/libs/utils.zip \
  -- --date=2024-01-15

# ── Ephemeral cluster pattern (create → run → delete) ────────────────
# Cost-optimised: cluster exists only during job execution
gcloud dataproc clusters create temp-cluster-$(date +%Y%m%d) \
  --region=asia-south1 \
  --single-node \
  --max-idle=30m \       # auto-delete after 30min idle
  --expiration-time=$(date -d '+2 hours' --iso-8601=seconds)
```

```python
# PySpark on Dataproc — best practices
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import StructType, StructField, StringType, DoubleType

spark = SparkSession.builder \
    .appName("AdCTRFeatureEngineering") \
    .config("spark.sql.adaptive.enabled", "true") \
    .config("spark.sql.adaptive.coalescePartitions.enabled", "true") \
    .config("spark.sql.shuffle.partitions", "400") \
    .config("temporaryGcsBucket", "jioads-data-lake-prod") \
    .getOrCreate()

# Read from BigQuery (BigQuery Spark connector)
events_df = spark.read \
    .format("bigquery") \
    .option("table", "ads-data-prod:ad_analytics.ad_events") \
    .option("filter", "DATE(event_time) = '2024-01-15'") \
    .option("parallelism", 200) \
    .load()

# Read from GCS Parquet
raw_df = spark.read.parquet(
    "gs://jioads-data-lake-prod/raw/events/year=2024/month=01/day=15/"
)

# Write back to BigQuery
features_df.write \
    .format("bigquery") \
    .option("table", "ads-data-prod:ad_analytics.features") \
    .option("temporaryGcsBucket", "jioads-data-lake-prod") \
    .option("partitionField", "feature_date") \
    .option("clusteredFields", "campaign_id") \
    .mode("overwrite") \
    .save()

# Write to GCS as Parquet with Hive partitioning
output_df.write \
    .mode("overwrite") \
    .partitionBy("year", "month", "day") \
    .parquet("gs://jioads-data-lake-prod/processed/features/")
```

## Interview Questions and Answers

**Q1. How do you optimise Dataproc costs?**

Answer: (1) **Preemptible/Spot workers** for processing workers — 60-91% cheaper. Use 1/3 regular + 2/3 preemptible. (2) **Dataproc Serverless** for infrequent batch jobs — no cluster idle cost. (3) **Ephemeral clusters** — create for a job, auto-delete when idle (`--max-idle` flag). (4) **Right-size machines** — use `n1-highmem` for memory-heavy Spark jobs, `n2` for CPU-heavy. (5) **Enable autoscaling** — scales worker count based on YARN pending containers. (6) **Dataproc Metastore** — shared Hive metastore across ephemeral clusters avoids re-creating schemas. (7) **Use SSD boot disks** for shuffle-intensive Spark jobs (faster I/O reduces job time, offsetting higher disk cost).

---

# 7. Cloud Bigtable

## Theory

Cloud Bigtable is GCP's fully managed, petabyte-scale NoSQL wide-column database — the same technology that powers Google Search index, Google Maps, and Gmail. It is designed for **single-digit millisecond latency** at billions of rows, making it the right choice for high-throughput read/write workloads that relational databases cannot handle at scale.

**Data model:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    BIGTABLE DATA MODEL                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Table                                                              │
│  ├── Row (identified by Row Key — the only index)                  │
│  │   ├── Column Family: cf1 (defined at table creation)            │
│  │   │   ├── Column Qualifier: "impressions"                       │
│  │   │   │   └── Cell: value + timestamp (multiple versions)       │
│  │   │   └── Column Qualifier: "clicks"                            │
│  │   │       └── Cell: value + timestamp                           │
│  │   └── Column Family: cf2                                        │
│  │       └── Column Qualifier: "ctr"                               │
│  └── Row key: "campaign#10001#2024-01-15"                          │
│                                                                     │
│  Key properties:                                                    │
│  - Row key is the ONLY index — design it carefully                 │
│  - Lexicographically sorted by row key                             │
│  - Rows read sequentially by key range (range scan = fast)         │
│  - No JOINs, no aggregations, no secondary indexes (by default)    │
│  - Cells store multiple timestamped versions (configurable GC)     │
│  - Max 100MB per row; max 10MB per cell                            │
└─────────────────────────────────────────────────────────────────────┘
```

**Row key design is the most critical design decision:**

```
Avoid hotspotting — don't use sequential keys (timestamps, incrementing IDs)
as the leading part, or all writes will go to one tablet server.

Patterns:
1. Reverse timestamp:     campaign#10001#<MAX_LONG - unix_ts>
   → Latest records appear first in range scan

2. Hash prefix:           MD5(user_id)[:4] + user_id + date
   → Even distribution, still queryable by user

3. Composite key:         region#campaign_id#date#event_type
   → Efficient range scans for common query patterns

4. Salted key:            <salt_bucket> + entity_id
   → Distribute hot entities across buckets

Bad: user_id as-is for high-frequency users (hotspot)
Bad: timestamp alone (monotonically increasing → hotspot)
Good: hash_prefix + user_id + reverse_timestamp
```

## Bigtable Operations

```python
from google.cloud import bigtable
from google.cloud.bigtable import column_family, row_filters
from google.cloud.bigtable.row_set import RowSet
import struct, time

client = bigtable.Client(project="ads-data-prod", admin=True)
instance = client.instance("jioads-bigtable")
table = instance.table("ad-serving-features")

# ── Create table with column families ────────────────────────────────
# (Admin operations — do once at setup)
table.create()
# Column family with max 1 version (overwrite on update)
cf_features = table.column_family("cf_features",
    gc_rule=column_family.MaxVersionsGCRule(1))
cf_features.create()
# Column family with 10 version history
cf_history = table.column_family("cf_history",
    gc_rule=column_family.MaxVersionsGCRule(10))
cf_history.create()

# ── Write single row ──────────────────────────────────────────────────
def write_ad_features(campaign_id: int, date: str, features: dict):
    # Row key: campaign_id (padded) + reverse_date for latest-first scans
    row_key = f"{campaign_id:010d}#{date}".encode()
    row = table.direct_row(row_key)

    ts = int(time.time() * 1000)  # microseconds
    for feature_name, value in features.items():
        row.set_cell(
            "cf_features",
            feature_name.encode(),
            str(value).encode(),
            timestamp_micros=ts
        )
    row.commit()

# ── Batch write (mutate_rows — more efficient) ───────────────────────
rows = []
for event in events_batch:
    row_key = f"{event['campaign_id']:010d}#{event['date']}".encode()
    row = table.direct_row(row_key)
    row.set_cell("cf_features", b"impressions", str(event["impressions"]).encode())
    row.set_cell("cf_features", b"clicks",      str(event["clicks"]).encode())
    row.set_cell("cf_features", b"ctr",         str(event["ctr"]).encode())
    rows.append(row)

response = table.mutate_rows(rows)
for i, status in enumerate(response):
    if status.code != 0:
        print(f"Row {i} failed: {status.message}")

# ── Read single row ───────────────────────────────────────────────────
row_key = b"0000010001#2024-01-15"
row = table.read_row(row_key)
if row:
    ctr = row.cells["cf_features"][b"ctr"][0].value.decode()

# ── Range scan (most efficient read pattern) ─────────────────────────
# Read all rows for campaign 10001 in January 2024
start_key = b"0000010001#2024-01-01"
end_key   = b"0000010001#2024-02-01"

rows = table.read_rows(
    start_key=start_key,
    end_key=end_key,
    filter_=row_filters.ColumnQualifierRegexFilter(b"(impressions|clicks|ctr)"),
    limit=1000
)

for row in rows:
    campaign_data = {
        col.decode(): cells[0].value.decode()
        for col, cells in row.cells["cf_features"].items()
    }

# ── Complex filters ───────────────────────────────────────────────────
# Interleave filter (OR)
filter_or = row_filters.RowFilterUnion(filters=[
    row_filters.ColumnQualifierRegexFilter(b"impressions"),
    row_filters.ColumnQualifierRegexFilter(b"clicks"),
])

# Chain filter (AND)
filter_and = row_filters.RowFilterChain(filters=[
    row_filters.CellsColumnLimitFilter(1),   # only latest version
    row_filters.ValueRangeFilter(           # filter by value
        start_value=b"1000", end_value=b"9999"
    )
])

# ── Conditional mutation (check-and-mutate) ───────────────────────────
# Only update if current value matches condition (optimistic concurrency)
row = table.conditional_row(b"0000010001#2024-01-15")
row.set_cell_if_equals("cf_features", b"status", b"processed",
                        b"status", b"pending")  # if current=pending, set=processed
```

## Interview Questions and Answers

**Q1. What makes a good Bigtable row key? What is hotspotting?**

Answer: A good row key: (1) encodes all query dimensions needed for your read patterns — Bigtable only supports row key lookups and range scans; (2) distributes writes evenly across tablets — monotonically increasing keys (timestamps, sequential IDs) cause all writes to go to the last tablet = **hotspot**. Solutions: hash-prefix the key (e.g., `MD5(id)[:4] + id`), use reverse timestamp for latest-first reads, or use a composite key with a high-cardinality prefix (region, shard bucket). Design the row key for your most frequent query pattern — it's the only index.

**Q2. When would you choose Bigtable over BigQuery or Spanner?**

Answer: Choose Bigtable when: (1) you need **<10ms latency** for individual row reads at high throughput (millions of reads/second) — BigQuery is optimised for analytics (seconds per query), not point lookups; (2) the data model is time-series or event-based with a natural row key (sensor data, user activity, feature store serving); (3) you need to handle billions to trillions of rows — Bigtable scales linearly; (4) workload is write-heavy (Bigtable is optimised for high write throughput). Not suitable for: complex SQL queries, JOINs, aggregations (use BigQuery), or strongly-consistent relational transactions (use Spanner).

---

# 8. Cloud Spanner

## Theory

Cloud Spanner is GCP's globally distributed, strongly consistent, horizontally scalable relational database — the only database in the world that offers both ACID transactions and horizontal scale across global regions. It powers Google's own Ads inventory system, Google Pay, and other mission-critical global applications.

**The CAP theorem context:** Traditional databases sacrifice either Consistency (Cassandra/Bigtable) or Availability (traditional RDBMS under partition) to achieve scale. Spanner uses **TrueTime** (GPS + atomic clocks in every datacenter) to provide external consistency with globally bounded clock uncertainty, effectively achieving CP with very high availability (99.999% SLA).

```
┌─────────────────────────────────────────────────────────────────────┐
│               SPANNER ARCHITECTURE                                  │
├─────────────────────────────────────────────────────────────────────┤
│  Spanner Instance                                                   │
│  ├── Configuration: regional / multi-regional / dual-regional       │
│  │   regional:       1 region  (lower latency, lower cost)          │
│  │   multi-regional: 3+ regions (highest availability, global)      │
│  │                                                                  │
│  ├── Database                                                       │
│  │   ├── Tables (relational schema, foreign keys, secondary indexes)│
│  │   ├── Splits (auto-sharded by primary key range)                 │
│  │   │   Each split replicated across Paxos groups                 │
│  │   └── Change Streams (CDC — capture all DML changes)            │
│  │                                                                  │
│  └── TrueTime API:                                                  │
│      TT.now() → [earliest, latest] — bounded clock uncertainty      │
│      Ensures global transaction ordering without a central clock    │
└─────────────────────────────────────────────────────────────────────┘
```

```sql
-- ── Spanner DDL ───────────────────────────────────────────────────────
-- Primary key must be explicitly chosen (determines physical sort order)
CREATE TABLE Campaigns (
    CampaignId   INT64 NOT NULL,
    AdvertiserId INT64 NOT NULL,
    Name         STRING(200),
    Budget       NUMERIC,
    Status       STRING(20),
    CreatedAt    TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp=true)
) PRIMARY KEY (CampaignId);

-- Interleaved table (child rows stored physically adjacent to parent)
-- Critical for parent-child joins — avoids distributed joins
CREATE TABLE Ads (
    CampaignId  INT64 NOT NULL,
    AdId        INT64 NOT NULL,
    Placement   STRING(100),
    BidPrice    NUMERIC,
    IsActive    BOOL
) PRIMARY KEY (CampaignId, AdId),
  INTERLEAVE IN PARENT Campaigns ON DELETE CASCADE;

-- Secondary index
CREATE INDEX AdsByPlacement ON Ads (Placement, CampaignId);
CREATE INDEX AdsByBid ON Ads (BidPrice DESC) STORING (Placement, IsActive);
-- STORING: include extra columns in index to avoid parent table lookups

-- ── Spanner SQL (ANSI SQL + extensions) ──────────────────────────────
-- Read-only transaction (strong read — most recent committed data)
SELECT c.Name, COUNT(a.AdId) AS ad_count, AVG(a.BidPrice) AS avg_bid
FROM Campaigns c
JOIN Ads a ON c.CampaignId = a.CampaignId
WHERE c.Status = 'ACTIVE'
GROUP BY c.CampaignId, c.Name
HAVING COUNT(a.AdId) > 0;

-- Stale read (reads data from N seconds ago — lower latency, lighter load)
-- Use for non-critical reads where strong consistency isn't required
SELECT * FROM Campaigns @{STALENESS = EXACT_STALENESS 15s};

-- ── Change Streams (CDC) ──────────────────────────────────────────────
ALTER DATABASE MyDatabase SET OPTIONS (
    version_retention_period = '7d'
);

CREATE CHANGE STREAM CampaignChanges
FOR Campaigns(Name, Budget, Status),  -- specific columns
    Ads                                -- full table
OPTIONS (
    retention_period = '7d',
    value_capture_type = 'NEW_VALUES'  -- or 'OLD_AND_NEW_VALUES'
);
-- Dataflow Spanner Change Streams connector reads these for real-time sync
```

```python
from google.cloud import spanner
from google.cloud.spanner_v1 import param_types

client = spanner.Client(project="ads-data-prod")
instance = client.instance("jioads-spanner")
database = instance.database("ad-inventory-db")

# ── Read-only transaction ─────────────────────────────────────────────
with database.snapshot() as snapshot:
    results = snapshot.execute_sql(
        """SELECT CampaignId, Name, Budget
           FROM Campaigns
           WHERE Status = @status AND Budget > @min_budget""",
        params={"status": "ACTIVE", "min_budget": 10000},
        param_types={
            "status": param_types.STRING,
            "min_budget": param_types.NUMERIC
        }
    )
    for row in results:
        print(row)

# Stale read (15 seconds behind — lower latency)
import datetime
with database.snapshot(
    exact_staleness=datetime.timedelta(seconds=15)
) as snapshot:
    results = snapshot.read(
        table="Campaigns",
        columns=["CampaignId", "Name", "Budget"],
        keyset=spanner.KeySet(all_=True)
    )

# ── Read-write transaction ────────────────────────────────────────────
def update_campaign_budget(transaction, campaign_id, new_budget):
    # Read then write (check-and-set pattern)
    row = transaction.read(
        table="Campaigns",
        columns=["Budget", "Status"],
        keyset=spanner.KeySet(keys=[[campaign_id]])
    ).one_or_none()

    if row is None:
        raise ValueError(f"Campaign {campaign_id} not found")
    if row[1] != "ACTIVE":
        raise ValueError("Cannot update budget for inactive campaign")

    transaction.update(
        table="Campaigns",
        columns=["CampaignId", "Budget"],
        values=[[campaign_id, new_budget]]
    )

database.run_in_transaction(update_campaign_budget, 10001, 50000)

# ── Mutations (blind writes — no read required, faster) ───────────────
with database.batch() as batch:
    batch.insert_or_update(
        table="Campaigns",
        columns=["CampaignId", "Name", "Budget", "Status"],
        values=[[10001, "Summer Sale", 50000, "ACTIVE"]]
    )
    batch.delete(
        table="Ads",
        keyset=spanner.KeySet(keys=[[10001, 99]])  # delete specific ad
    )
```

## Interview Questions and Answers

**Q1. When would you choose Spanner over Cloud SQL or Bigtable?**

Answer: Choose Spanner when you need all three: (1) **global distribution** across multiple regions with strong consistency (not possible with Cloud SQL which is single-region); (2) **horizontal scalability** beyond what a single server can handle (Cloud SQL max ~30TB, limited IOPS); (3) **ACID transactions** with relational schema (not possible with Bigtable). Use cases: global inventory systems, financial ledgers, global user profiles needing consistent reads worldwide, large-scale e-commerce platforms. Cost: significantly higher than Cloud SQL (~3-10× for equivalent data). Don't use Spanner if: single-region is sufficient (Cloud SQL), non-relational workload (Bigtable/Firestore), or cost is a primary constraint.

**Q2. What is TrueTime and why does it matter?**

Answer: TrueTime is Google's globally synchronised clock API that provides `TT.now()` returning an interval `[earliest, latest]` with a bounded uncertainty (typically 0-7ms). Spanner uses TrueTime to assign commit timestamps to transactions — a transaction committed after `TT.after(t)` can be guaranteed to have occurred after any transaction committed before `t`. This gives **external consistency** (the real-world equivalent of serialisable isolation) without a central lock server. It's why Spanner can achieve globally-consistent reads without distributed locking overhead that would make it impractically slow.

---

# 9. Cloud Firestore and Datastore

## Theory

Cloud Firestore is GCP's fully managed serverless document database — the next generation of Cloud Datastore. It stores data as **documents** organised into **collections**, supports real-time listeners, and provides ACID transactions.

```
Firestore data model:
Collection: "campaigns"
  Document: "campaign_10001"
    Field: name = "Summer Sale"
    Field: budget = 50000
    Field: status = "active"
    Subcollection: "ads"
      Document: "ad_001"
        Field: placement = "banner_top"
        Field: bid_price = 2.5
```

**When to use Firestore vs BigQuery vs Bigtable:**

```
Firestore:    document model, mobile/web real-time sync, <1M QPS, complex queries
Bigtable:     wide-column, >1M QPS, time-series, no complex queries
BigQuery:     analytical, batch, SQL, no millisecond latency
Cloud SQL:    relational OLTP, moderate scale, full SQL
Spanner:      global, strongly consistent, relational at massive scale
```

```python
from google.cloud import firestore

db = firestore.Client(project="ads-data-prod")

# Write document
doc_ref = db.collection("campaigns").document("campaign_10001")
doc_ref.set({
    "name": "Summer Sale 2024",
    "budget": 50000.0,
    "status": "active",
    "created_at": firestore.SERVER_TIMESTAMP
})

# Atomic field update (merge=True: don't overwrite other fields)
doc_ref.update({
    "budget": firestore.Increment(5000),  # atomic increment
    "last_updated": firestore.SERVER_TIMESTAMP
})

# Read
doc = doc_ref.get()
if doc.exists:
    data = doc.to_dict()

# Query with composite filter
# NOTE: composite queries require a composite index (auto-suggested by Firestore)
results = (db.collection("campaigns")
             .where("status", "==", "active")
             .where("budget", ">=", 10000)
             .order_by("budget", direction=firestore.Query.DESCENDING)
             .limit(10)
             .stream())

# Batch write (atomic — all or nothing)
batch = db.batch()
for campaign_id, data in campaigns.items():
    ref = db.collection("campaigns").document(campaign_id)
    batch.set(ref, data)
batch.commit()

# Transaction (read-then-write with optimistic locking)
@firestore.transactional
def update_budget(transaction, doc_ref, delta):
    doc = doc_ref.get(transaction=transaction)
    current = doc.to_dict()["budget"]
    transaction.update(doc_ref, {"budget": current + delta})

update_budget(db.transaction(), doc_ref, 5000)
```

---

# 10. Cloud Data Fusion

## Theory

Cloud Data Fusion is GCP's fully managed, cloud-native ETL/ELT platform based on the open-source **CDAP (Cask Data Application Platform)**. It provides a visual pipeline designer (drag-and-drop) for building data integration pipelines without writing code — making it accessible to data analysts and data engineers who prefer GUI-based development.

**When to use Data Fusion:**
- Rapid ETL pipeline development with visual interface
- Connecting to 150+ pre-built connectors (SAP, Salesforce, Oracle, JDBC, etc.)
- Migration of on-premises ETL (Informatica, Talend, DataStage) to GCP
- Teams without deep coding expertise
- Self-service data integration for business users

**Editions:**

```
Developer:   Single node, up to 3 pipelines, dev/test only
Basic:       Multi-tenant, limited features, smaller workloads
Enterprise:  Full features, SLA, lineage, metadata management, streaming
```

**Underlying execution:** Data Fusion pipelines compile to Apache Spark or MapReduce jobs and run on Dataproc clusters. You design visually; the platform generates and executes the Spark code.

```bash
# Create Data Fusion instance
gcloud data-fusion instances create jioads-datafusion \
  --project=ads-data-prod \
  --location=asia-south1 \
  --edition=ENTERPRISE \
  --enable-stackdriver-logging \
  --enable-stackdriver-monitoring

# Deploy pipeline from JSON spec (exported from UI)
curl -X POST \
  "https://datafusion.googleapis.com/v1/projects/ads-data-prod/locations/asia-south1/instances/jioads-datafusion/namespaces/default/pipelines" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  -d @pipeline_spec.json

# Start pipeline run
curl -X POST \
  ".../pipelines/ad-events-etl/start" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)"
```

---

# 11. Cloud Composer (Managed Airflow)

## Theory

Cloud Composer is GCP's fully managed Apache Airflow service. Airflow is the industry-standard workflow orchestrator — it defines, schedules, and monitors data pipelines as Directed Acyclic Graphs (DAGs) of tasks. Composer manages the Airflow infrastructure (GKE, Cloud SQL for metadata, Cloud Storage for DAGs) while you focus on pipeline logic.

**Composer architecture:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                 CLOUD COMPOSER ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Cloud Composer Environment                                         │
│  ├── GKE Cluster (Airflow components)                              │
│  │   ├── Airflow Webserver (UI)                                    │
│  │   ├── Airflow Scheduler (parses DAGs, schedules tasks)         │
│  │   ├── Airflow Workers (run tasks — KubernetesPodOperator)      │
│  │   └── Redis (task queue)                                        │
│  ├── Cloud SQL (PostgreSQL) — Airflow metadata DB                  │
│  ├── Cloud Storage — DAG files, plugins, logs                     │
│  │   gs://asia-south1-composer-env-XXXXX-bucket/                  │
│  │   ├── dags/          ← place .py DAG files here               │
│  │   ├── plugins/       ← custom operators                        │
│  │   └── logs/                                                     │
│  └── Secret Manager — Airflow Connections & Variables              │
└─────────────────────────────────────────────────────────────────────┘
```

## DAG Development

```python
from airflow import DAG
from airflow.providers.google.cloud.operators.bigquery import (
    BigQueryInsertJobOperator, BigQueryCheckOperator, BigQueryValueCheckOperator
)
from airflow.providers.google.cloud.operators.dataproc import (
    DataprocCreateClusterOperator, DataprocSubmitJobOperator,
    DataprocDeleteClusterOperator
)
from airflow.providers.google.cloud.operators.gcs import GCSListObjectsOperator
from airflow.providers.google.cloud.sensors.gcs import GCSObjectExistenceSensor
from airflow.providers.google.cloud.transfers.gcs_to_bigquery import GCSToBigQueryOperator
from airflow.operators.python import PythonOperator, BranchPythonOperator
from airflow.operators.empty import EmptyOperator
from airflow.utils.dates import days_ago
from airflow.models import Variable
from datetime import datetime, timedelta
import pendulum

# ── Default args ────────────────────────────────────────────────────
default_args = {
    "owner":            "data-engineering",
    "depends_on_past":  False,
    "retries":          3,
    "retry_delay":      timedelta(minutes=5),
    "retry_exponential_backoff": True,
    "email_on_failure": True,
    "email":            ["de-alerts@jio.com"],
    "sla":              timedelta(hours=4)
}

# ── DAG definition ───────────────────────────────────────────────────
with DAG(
    dag_id="ad_events_daily_pipeline",
    description="Daily ad event processing: GCS → Dataproc → BigQuery",
    schedule_interval="0 2 * * *",       # 2 AM UTC daily
    start_date=pendulum.datetime(2024, 1, 1, tz="UTC"),
    catchup=False,                        # don't backfill missed runs
    max_active_runs=1,                    # prevent concurrent runs
    tags=["ad-tech", "daily", "production"],
    default_args=default_args,
    on_failure_callback=lambda ctx: alert_slack(ctx),
    render_template_as_native_obj=True,
    params={
        "gcs_bucket": "jioads-data-lake-prod",
        "bq_project": "ads-data-prod",
        "bq_dataset": "ad_analytics"
    }
) as dag:

    # Task 1: Wait for source file (sensor)
    wait_for_file = GCSObjectExistenceSensor(
        task_id="wait_for_events_file",
        bucket="jioads-data-lake-prod",
        object="raw/events/{{ ds_nodash }}/events_complete.flag",
        timeout=3600,
        poke_interval=60,    # check every 60s
        mode="reschedule"    # release worker slot while waiting (not 'poke')
    )

    # Task 2: Create Dataproc cluster
    create_cluster = DataprocCreateClusterOperator(
        task_id="create_spark_cluster",
        project_id="ads-data-prod",
        region="asia-south1",
        cluster_name="ad-events-cluster-{{ ds_nodash }}",
        cluster_config={
            "master_config": {"num_instances": 1, "machine_type_uri": "n1-standard-8"},
            "worker_config": {"num_instances": 4, "machine_type_uri": "n1-standard-8"},
            "secondary_worker_config": {
                "num_instances": 8,
                "is_preemptible": True
            }
        }
    )

    # Task 3: Submit Spark job
    run_spark = DataprocSubmitJobOperator(
        task_id="run_feature_engineering",
        project_id="ads-data-prod",
        region="asia-south1",
        job={
            "placement": {"cluster_name": "ad-events-cluster-{{ ds_nodash }}"},
            "pyspark_job": {
                "main_python_file_uri": "gs://jioads-data-lake-prod/jobs/feature_eng.py",
                "args": ["--date={{ ds }}", "--output_table=ad_analytics.features"]
            }
        }
    )

    # Task 4: Load to BigQuery
    load_to_bq = GCSToBigQueryOperator(
        task_id="load_events_to_bq",
        bucket="jioads-data-lake-prod",
        source_objects=["curated/ad_events/{{ ds_nodash }}/*.parquet"],
        destination_project_dataset_table="ads-data-prod:ad_analytics.ad_events${{ ds_nodash }}",
        source_format="PARQUET",
        write_disposition="WRITE_TRUNCATE",
        time_partitioning={"type": "DAY", "field": "event_time"},
        cluster_fields=["campaign_id", "event_type"]
    )

    # Task 5: Data quality check
    check_row_count = BigQueryValueCheckOperator(
        task_id="check_row_count",
        sql="""SELECT COUNT(*) FROM `ads-data-prod.ad_analytics.ad_events`
               WHERE DATE(event_time) = '{{ ds }}'""",
        pass_value=1000,          # must have at least 1000 rows
        tolerance=0.0,
        use_legacy_sql=False
    )

    # Task 6: Delete cluster (always run, even if previous tasks fail)
    delete_cluster = DataprocDeleteClusterOperator(
        task_id="delete_spark_cluster",
        project_id="ads-data-prod",
        region="asia-south1",
        cluster_name="ad-events-cluster-{{ ds_nodash }}",
        trigger_rule="all_done"    # run even if upstream failed
    )

    # Task 7: BigQuery transformation
    run_aggregation = BigQueryInsertJobOperator(
        task_id="compute_campaign_stats",
        configuration={
            "query": {
                "query": """
                    INSERT INTO `ads-data-prod.ad_analytics.campaign_daily_stats`
                    SELECT
                        campaign_id,
                        DATE(event_time)                           AS event_date,
                        COUNTIF(event_type = 'impression')         AS impressions,
                        COUNTIF(event_type = 'click')              AS clicks,
                        COUNTIF(event_type = 'click') / NULLIF(COUNTIF(event_type = 'impression'), 0) AS ctr,
                        SUM(bid_price)                             AS total_spend
                    FROM `ads-data-prod.ad_analytics.ad_events`
                    WHERE DATE(event_time) = '{{ ds }}'
                    GROUP BY campaign_id, DATE(event_time)
                """,
                "useLegacySql": False,
                "writeDisposition": "WRITE_APPEND"
            }
        }
    )

    # ── Task dependencies ─────────────────────────────────────────────
    wait_for_file >> create_cluster >> run_spark >> load_to_bq >> check_row_count >> run_aggregation
    run_spark >> delete_cluster  # delete cluster after spark (even if load fails)
```

## Interview Questions and Answers

**Q1. What is the difference between `poke` and `reschedule` mode in Airflow sensors?**

Answer: In **`poke` mode**, the sensor occupies a worker slot continuously while checking — the worker process runs in a loop sleeping between checks. With many concurrent sensors, this exhausts the worker pool. In **`reschedule` mode**, the sensor releases the worker slot between checks — it marks itself as "up_for_reschedule" and the scheduler re-queues it after `poke_interval` seconds. `reschedule` mode is almost always preferable for production pipelines with many concurrent long-running sensors (waiting for files, external triggers).

**Q2. How do you handle DAG failures and ensure data quality in Composer?**

Answer: Multiple layers: (1) **Retries with exponential backoff** (`retries=3`, `retry_exponential_backoff=True`) for transient failures; (2) **SLA monitoring** (`sla=timedelta(hours=4)`) to alert if a DAG doesn't complete within the expected window; (3) **`trigger_rule="all_done"`** for cleanup tasks (cluster deletion) so they run even if processing fails; (4) **Data quality checks** using `BigQueryCheckOperator` or `BigQueryValueCheckOperator` before downstream tasks; (5) **Callbacks** (`on_failure_callback`) for custom alerting (Slack, PagerDuty); (6) **`depends_on_past=True`** to prevent a DAG run from starting if the previous run failed (for sequential, stateful pipelines).

---

# 12. Dataplex — Data Mesh on GCP

## Theory

Dataplex is GCP's unified data governance platform that implements the **Data Mesh** architecture — organising data by business domain, enabling domain teams to own and publish data products while maintaining central governance.

**Core concepts:**

```
Lake (top-level organisational unit → business domain)
├── Zone (data readiness layer — raw, curated, etc.)
│   ├── Asset (maps to a GCS bucket or BigQuery dataset)
│   │   ├── Data files / tables (discovered automatically)
│   │   └── Metadata (schema, lineage, quality scores)
│   └── Asset
└── Zone

Data Quality: scan tasks that run SQL-based quality rules on BQ tables
Data Discovery: auto-discovers schema from GCS (Parquet, ORC, Avro, CSV)
Data Lineage: tracks data flow between BQ jobs, Dataproc, Dataflow
Metadata: integrates with Data Catalog for business glossary, tagging
```

```bash
# Create a Dataplex lake
gcloud dataplex lakes create jioads-data-lake \
  --project=ads-data-prod \
  --location=asia-south1 \
  --display-name="JioAds Data Lake" \
  --labels="team=data-eng,env=prod"

# Create zones
gcloud dataplex zones create raw-zone \
  --lake=jioads-data-lake \
  --location=asia-south1 \
  --type=RAW \
  --resource-spec-type=STORAGE_BUCKET

gcloud dataplex zones create curated-zone \
  --lake=jioads-data-lake \
  --location=asia-south1 \
  --type=CURATED \
  --resource-spec-type=BIGQUERY_DATASET

# Attach GCS bucket as asset
gcloud dataplex assets create raw-events-asset \
  --lake=jioads-data-lake \
  --zone=raw-zone \
  --location=asia-south1 \
  --resource-spec-type=STORAGE_BUCKET \
  --resource-spec-name=projects/ads-data-prod/buckets/jioads-raw-events

# Create data quality scan
gcloud dataplex datascans create ad-events-quality-scan \
  --location=asia-south1 \
  --data-source-resource="//bigquery.googleapis.com/projects/ads-data-prod/datasets/ad_analytics/tables/ad_events" \
  --data-quality-spec-file=dq_rules.yaml
```

```yaml
# dq_rules.yaml — Data quality rules for ad_events table
rules:
  - column: campaign_id
    rule_type: NOT_NULL
    threshold: 1.0   # 100% of rows must be non-null

  - column: bid_price
    rule_type: RANGE_CHECK
    min_value: 0.0
    max_value: 1000.0
    threshold: 0.99  # 99% of rows must be in range

  - column: event_type
    rule_type: SET_CHECK
    allowed_values: ["impression", "click", "purchase", "view"]
    threshold: 1.0

  - rule_type: CUSTOM_SQL_EXPR
    sql_expression: "TIMESTAMP_DIFF(CURRENT_TIMESTAMP(), event_time, HOUR) < 48"
    threshold: 0.999  # 99.9% of events must be within last 48 hours
    description: "Events should be recent"

  - rule_type: CUSTOM_SQL_STATEMENT
    sql_statement: |
      SELECT COUNT(*) as failed_count
      FROM (
        SELECT event_id, COUNT(*) as cnt
        FROM ad_events_data
        GROUP BY event_id HAVING cnt > 1
      )
    dimension: UNIQUENESS
    description: "event_id must be unique"
```

---

# 13. Vertex AI — ML Platform

## Theory

Vertex AI is GCP's unified ML platform — it consolidates Google's ML products (AI Platform, AutoML, Explainable AI, Feature Store, Pipelines, Model Monitoring) into a single consistent API. For data engineers, the key components are Feature Store, Pipelines, and Model Monitoring.

```bash
# ── Vertex AI Feature Store ────────────────────────────────────────
# Central repository for ML features — serves features for both
# training (batch) and inference (online, low-latency)

gcloud ai featurestores create jioads-featurestore \
  --project=ads-data-prod \
  --region=asia-south1 \
  --online-serving-fixed-node-count=2

# Create entity type (campaign features)
gcloud ai featurestores entity-types create campaigns \
  --featurestore=jioads-featurestore \
  --region=asia-south1 \
  --monitoring-config-snapshot-analysis-disabled=false

# Create features
gcloud ai featurestores entity-types features create ctr_7d \
  --entity-type=campaigns \
  --featurestore=jioads-featurestore \
  --region=asia-south1 \
  --value-type=DOUBLE

gcloud ai featurestores entity-types features create impression_count \
  --entity-type=campaigns \
  --featurestore=jioads-featurestore \
  --region=asia-south1 \
  --value-type=INT64
```

```python
from google.cloud import aiplatform
from google.cloud.aiplatform import Featurestore

aiplatform.init(project="ads-data-prod", location="asia-south1")

# ── Batch ingest features ─────────────────────────────────────────────
featurestore = Featurestore("jioads-featurestore")
entity_type = featurestore.get_entity_type("campaigns")

# Ingest from BigQuery
entity_type.ingest_from_bq(
    feature_ids=["ctr_7d", "impression_count", "click_rate_30d"],
    feature_time="feature_timestamp",
    bq_source_uri="bq://ads-data-prod.ad_analytics.campaign_features_latest",
    entity_id_field="campaign_id",
    worker_count=2
)

# ── Online serving (low-latency reads for inference) ──────────────────
# Fetch features for a campaign at inference time
features = entity_type.read(entity_ids=["10001", "10002", "10003"])
# Returns DataFrame with features for all campaigns

# Single entity
feature_values = entity_type.read(entity_ids=["10001"])

# ── Batch serving (for training dataset creation) ─────────────────────
featurestore.batch_serve_to_bq(
    bq_destination_output_uri="bq://ads-data-prod.ad_analytics.training_dataset",
    serving_feature_ids={
        "campaigns": ["ctr_7d", "impression_count"],
        "users":     ["age_group", "city", "device_type"]
    },
    read_instances_uri="bq://ads-data-prod.ad_analytics.training_instances"
)

# ── Vertex AI Pipelines (Kubeflow Pipelines on GCP) ──────────────────
from kfp import dsl
from kfp.v2 import compiler
from google.cloud.aiplatform import pipeline_jobs

@dsl.component(base_image="python:3.10", packages_to_install=["pandas", "lightgbm"])
def train_ctr_model(
    input_data: dsl.Input[dsl.Dataset],
    model: dsl.Output[dsl.Model],
    n_estimators: int = 100
):
    import lightgbm as lgb
    import pandas as pd
    import joblib

    df = pd.read_parquet(input_data.path)
    X = df.drop(columns=["label"])
    y = df["label"]
    clf = lgb.LGBMClassifier(n_estimators=n_estimators)
    clf.fit(X, y)
    joblib.dump(clf, model.path)

@dsl.pipeline(name="ctr-training-pipeline")
def ctr_pipeline(date: str = "2024-01-15"):
    fetch_data_task = fetch_features(date=date)
    train_task = train_ctr_model(
        input_data=fetch_data_task.outputs["output_data"],
        n_estimators=200
    )
    evaluate_task = evaluate_model(model=train_task.outputs["model"])

compiler.Compiler().compile(ctr_pipeline, "ctr_pipeline.json")

job = pipeline_jobs.PipelineJob(
    display_name="ctr-training-daily",
    template_path="ctr_pipeline.json",
    parameter_values={"date": "2024-01-15"}
)
job.submit()
```

---

# 14. Looker and BI Engine

## Theory

**BigQuery BI Engine** is an in-memory analysis service that caches BigQuery data for sub-second query performance. It intercepts SQL queries from Looker, Looker Studio, or custom applications, executes them against the in-memory cache when possible, and falls back to BigQuery for cache misses. Reserve 1-100GB of BI Engine capacity per project. Best for dashboards with predictable, repeated queries on the same tables.

**Looker** is GCP's enterprise BI and analytics platform based on **LookML** — a modelling layer that defines metrics, dimensions, and relationships in version-controlled YAML-like code. Looker generates optimised SQL from LookML models, enabling consistent metric definitions across all analytics tools.

```yaml
# LookML model example
view: ad_events {
  sql_table_name: `ads-data-prod.ad_analytics.ad_events` ;;

  # Dimensions
  dimension: campaign_id {
    type: number
    sql: ${TABLE}.campaign_id ;;
  }

  dimension_group: event {
    type: time
    timeframes: [date, week, month, quarter, year]
    sql: ${TABLE}.event_time ;;
  }

  dimension: event_type {
    type: string
    sql: ${TABLE}.event_type ;;
  }

  # Measures (aggregations)
  measure: impressions {
    type: count
    filters: [event_type: "impression"]
    description: "Total ad impressions"
  }

  measure: clicks {
    type: count
    filters: [event_type: "click"]
  }

  measure: ctr {
    type: number
    sql: ${clicks} / NULLIF(${impressions}, 0) ;;
    value_format: "0.00%"
    description: "Click-through rate"
  }

  measure: total_spend {
    type: sum
    sql: ${TABLE}.bid_price ;;
    filters: [event_type: "click"]
    value_format: "$#,##0.00"
  }
}
```

---

# 15. IAM, Security, and Governance

## Theory

Security and governance on GCP is built around four pillars: **Identity** (who), **Access** (what permissions), **Data Protection** (encryption, DLP), and **Audit** (what happened).

**IAM Roles hierarchy:**

```
Primitive Roles (legacy, avoid):
  Owner / Editor / Viewer — too broad, grant project-wide access

Predefined Roles (use these):
  roles/bigquery.dataViewer       — read BQ tables/views
  roles/bigquery.dataEditor       — read + write BQ tables
  roles/bigquery.jobUser          — run BQ queries (no data access)
  roles/bigquery.admin            — full BQ admin
  roles/storage.objectViewer      — read GCS objects
  roles/storage.objectCreator     — create GCS objects
  roles/dataflow.worker           — run Dataflow jobs
  roles/dataproc.worker           — run Dataproc jobs
  roles/pubsub.publisher          — publish to topics
  roles/pubsub.subscriber         — consume from subscriptions

Custom Roles: combine specific permissions for least-privilege
```

```bash
# ── VPC Service Controls (perimeter security) ─────────────────────────
# Prevents data exfiltration — even if credentials are stolen,
# data cannot leave the defined perimeter

gcloud access-context-manager perimeters create jioads-perimeter \
  --policy=POLICY_ID \
  --title="JioAds Data Perimeter" \
  --resources="projects/12345678" \
  --restricted-services="bigquery.googleapis.com,storage.googleapis.com" \
  --access-levels="accessPolicies/POLICY_ID/accessLevels/corp_network"

# ── Customer-Managed Encryption Keys (CMEK) ──────────────────────────
# Control your own encryption keys via Cloud KMS
gcloud kms keyrings create jioads-keyring \
  --location=asia-south1

gcloud kms keys create bq-encryption-key \
  --keyring=jioads-keyring \
  --location=asia-south1 \
  --purpose=encryption

# Apply CMEK to BigQuery dataset
bq update --encryption_key=projects/ads-data-prod/locations/asia-south1/keyRings/jioads-keyring/cryptoKeys/bq-encryption-key ads-data-prod:ad_analytics

# ── Cloud DLP (Data Loss Prevention) — PII detection ────────────────
from google.cloud import dlp_v2

dlp = dlp_v2.DlpServiceClient()

# Inspect text for PII
response = dlp.inspect_content(
    request={
        "parent": "projects/ads-data-prod",
        "inspect_config": {
            "info_types": [
                {"name": "EMAIL_ADDRESS"},
                {"name": "PHONE_NUMBER"},
                {"name": "INDIA_AADHAAR_INDIVIDUAL"},
                {"name": "IP_ADDRESS"}
            ],
            "min_likelihood": dlp_v2.Likelihood.LIKELY
        },
        "item": {"value": "Contact alice@example.com or +91-9876543210"}
    }
)

# De-identify: mask PII before storing
deidentify_config = {
    "info_type_transformations": {
        "transformations": [{
            "primitive_transformation": {
                "replace_with_info_type_config": {}  # replace with [EMAIL_ADDRESS]
            }
        }]
    }
}

# ── Audit Logging ─────────────────────────────────────────────────────
# Cloud Audit Logs: Admin Activity (always on), Data Access (enable explicitly)
gcloud projects get-iam-policy ads-data-prod --format=json | \
  python3 -c "import json,sys; p=json.load(sys.stdin); print(p.get('auditConfigs','not set'))"

# Enable BigQuery Data Access logs
gcloud projects set-iam-policy ads-data-prod policy_with_audit_logs.json
# {
#   "auditConfigs": [{
#     "service": "bigquery.googleapis.com",
#     "auditLogConfigs": [
#       {"logType": "DATA_READ"},
#       {"logType": "DATA_WRITE"}
#     ]
#   }]
# }
```

## Interview Questions and Answers

**Q1. What is the principle of least privilege and how do you implement it on GCP?**

Answer: Least privilege means granting only the minimum permissions required for a task. On GCP: (1) Use **predefined roles** (not primitive Owner/Editor/Viewer); (2) Grant roles at the **lowest resource level** (table-level BigQuery access, not project-level); (3) Use **service accounts** for each pipeline/application with only the roles that specific service needs; (4) Regularly audit with **IAM Recommender** (suggests unused permission removal); (5) Use **Workload Identity** for GKE workloads instead of service account keys; (6) **VPC Service Controls** for network-level data access boundaries.

**Q2. What is the difference between CMEK and CSEK in GCP?**

Answer: **CMEK (Customer-Managed Encryption Keys):** You create and manage keys in Cloud KMS; GCP handles the encryption/decryption operations but uses your key. You can rotate or disable keys, but you still rely on GCP to access data. **CSEK (Customer-Supplied Encryption Keys):** You supply the raw encryption key with each API request; GCP never stores the key. Maximum control but highest operational burden. CMEK is the standard choice for regulated industries; CSEK for highest-sensitivity data where GCP having any access to the key material is unacceptable.

---

# 16. GCP Networking for Data Engineers

## Theory

Data engineers need to understand GCP networking to design secure, performant, and cost-efficient data pipelines — particularly around private connectivity, VPC peering, and avoiding expensive public internet egress.

```
Key networking concepts for data engineers:

VPC (Virtual Private Cloud):
  - Private network for GCP resources
  - Subnets per region (resources in subnet have private IPs)
  - Firewall rules control traffic (stateful)

Private Google Access:
  - Allows resources WITHOUT public IPs to reach Google APIs
  - Enable on subnets: gcloud compute networks subnets update ... --enable-private-ip-google-access
  - Essential for Dataflow workers, Dataproc workers talking to GCS/BQ/PubSub without public IPs

Private Service Connect:
  - Access GCP services (BQ, GCS, PubSub) via private endpoint in your VPC
  - No traffic leaves your VPC to the public internet
  - Lowest latency, highest security

VPC Peering:
  - Connect two VPCs (same or different projects) privately
  - Dataflow job in VPC-A can access databases in VPC-B
  - No transitive peering (A-B-C does NOT allow A-C)

Shared VPC (XPN):
  - One host project owns the VPC; service projects attach to it
  - Centralised network management; resources in service projects use host VPC
  - Best pattern for large enterprise GCP deployments

Cloud NAT:
  - Allows resources without public IPs to reach the internet (for pip installs, etc.)
  - No inbound connections allowed — secure egress only

Data egress costs:
  - Within same region: free
  - Between regions: $0.01-$0.08/GB
  - Internet egress: $0.08-$0.23/GB
  - Minimise by co-locating compute and data in same region
```

```bash
# Create VPC for data pipelines
gcloud compute networks create data-pipeline-vpc \
  --project=ads-data-prod \
  --subnet-mode=custom \
  --bgp-routing-mode=regional

# Create subnet with Private Google Access enabled
gcloud compute networks subnets create dataflow-subnet \
  --project=ads-data-prod \
  --network=data-pipeline-vpc \
  --region=asia-south1 \
  --range=10.0.0.0/24 \
  --enable-private-ip-google-access \
  --enable-flow-logs

# Dataflow job in private network (no public IPs)
gcloud dataflow jobs run ad-events-job \
  --region=asia-south1 \
  --network=data-pipeline-vpc \
  --subnetwork=regions/asia-south1/subnetworks/dataflow-subnet \
  --no-use-public-ips \                # workers use private IPs only
  --disable-public-ips
```

---

# 17. Data Architecture Patterns on GCP

## Theory

Understanding common architecture patterns and when to apply each is the key to data engineer interviews and the Professional Data Engineer certification.

## Lambda Architecture on GCP

```
Raw Events (Pub/Sub)
        │
   ┌────┴────────────────────────────────────┐
   │                                          │
   ▼ (Speed Layer)                           ▼ (Batch Layer)
Dataflow Streaming                       GCS (Data Lake)
   │  (micro-batch or streaming)              │
   │  enrich + window aggregate              Dataproc / Dataflow Batch
   ▼                                          │
BigQuery Streaming Table              BigQuery Batch Table
   │                                          │
   └──────────────────┬───────────────────────┘
                      ▼ (Serving Layer)
                  BigQuery View (union of batch + speed tables)
                      │
                  Looker / BI Engine Dashboard
```

## Kappa Architecture on GCP (Recommended for new systems)

```
Raw Events (Pub/Sub)
        │
        ▼
Dataflow Streaming Pipeline
(single pipeline for both real-time and historical replay)
        │
        ├── Real-time sink: BigQuery (streaming inserts / Storage Write API)
        └── Historical sink: GCS Parquet (for replay and time-travel)

Replay: re-read from GCS → Dataflow → BigQuery (replay window)

Simpler than Lambda: one codebase, one pipeline, no batch/speed reconciliation
Possible because Dataflow handles both bounded (batch) and unbounded (streaming) inputs
```

## Medallion Architecture (Bronze → Silver → Gold)

```
BRONZE (Raw):                    GCS + BigQuery External Tables
  Exact copy of source data      No transformation, schema as-is
  Never modified                 Parquet, ORC, Avro, JSON as-is

SILVER (Cleaned):                BigQuery Partitioned Tables
  Schema enforced                Null handling, dedup, type casting
  Quality-validated              DLP for PII masking
  Partitioned + Clustered

GOLD (Business):                 BigQuery Materialised Views / Tables
  Aggregations and joins         Optimised for analytics
  Business metric definitions    Pre-computed for dashboard speed
  Served via Looker/BI Engine
```

## Event-Driven Architecture on GCP

```
Source System → Pub/Sub → Eventarc → Cloud Functions / Cloud Run → BigQuery

Pattern: Datastream (CDC) → Pub/Sub → Dataflow → BigQuery
  Datastream: replicates MySQL/PostgreSQL/Oracle changes in real-time
  via CDC (Change Data Capture) → publishes to Pub/Sub → Dataflow enriches
  → BigQuery for analytics

Near real-time analytics with 30-60 second latency
Without Kafka (fully managed, no infrastructure)
```

---

# 18. Scenario-Based Questions

**Q1. Design a real-time ad click pipeline processing 1 million events/second on GCP.**

Answer:
```
Architecture:
Ad Server → Pub/Sub (1M events/sec easily handled)
         → Dataflow Streaming (Streaming Engine enabled)
              ├── Parse + validate (ParDo with dead-letter)
              ├── 1-min tumbling windows → campaign CTR
              ├── 15-min sliding windows → budget pacing
              └── Fanout:
                  ├── BigQuery (Storage Write API, exactly-once, 60s commit)
                  ├── Bigtable (real-time serving for bid optimisation, <10ms)
                  └── Pub/Sub output topic (downstream consumers)

Key decisions:
- Pub/Sub: no infrastructure to manage, auto-scales, 7-day retention for replay
- Dataflow with Streaming Engine: offload state, auto-scale workers
- BigQuery write: Storage Write API with pending streams for exactly-once
- Bigtable: for live campaign feature serving to bidding service
- GCS: dead-letter sink + raw event archival (Nearline after 30 days)
```

**Q2. A BigQuery query on a 10TB table runs in 2 minutes. How do you optimise it to under 10 seconds?**

Answer:
1. **Add partitioning:** `PARTITION BY DATE(event_time)` — if query filters by date, reads only relevant partitions (e.g., 1 day = 27GB instead of 10TB)
2. **Add clustering:** `CLUSTER BY campaign_id, event_type` — filters on these columns skip blocks within partitions
3. **Column projection:** Replace `SELECT *` with specific columns — BQ is columnar, unread columns cost zero
4. **Materialised view:** Pre-compute the aggregation if this query runs frequently
5. **BI Engine:** For dashboard queries, reserve BI Engine capacity for in-memory execution
6. **Partition expiration + archival:** Move old data to cheaper storage, reducing scan range
7. **Slots:** If on flat-rate, ensure sufficient slots are reserved for this workload

**Q3. How do you migrate an on-premises Hadoop/Spark workload to GCP with minimal risk?**

Answer: Phased migration:
1. **Lift-and-shift:** Move existing Spark code to Dataproc with minimal changes — same Spark version, same APIs. Validates that code works on GCP. Use Dataproc Metastore for Hive schema persistence.
2. **Optimise for GCP:** Replace HDFS paths with GCS (`gs://`), use BigQuery Spark connector for direct BQ reads/writes, enable autoscaling, switch to ephemeral clusters + preemptible workers for cost.
3. **Modernise:** Evaluate migrating to Dataflow (Beam) for new pipelines to get serverless autoscaling and unified batch+stream. Use BigQuery for SQL-heavy transformations (no Spark needed). Use Dataproc Serverless for remaining Spark jobs.
4. **Validation:** Run parallel (old + new) for 2 weeks, compare output record counts and sample values before cutover.

**Q4. Explain how you would implement a complete data governance framework on GCP for PII data.**

Answer:
1. **Discovery:** Use Cloud DLP to scan GCS and BigQuery for PII automatically. Schedule weekly scans.
2. **Classification:** Tag sensitive columns in Data Catalog with policy tags (e.g., `PII/Email`, `PII/PhoneNumber`).
3. **Access control:** Column-level security via BigQuery — grant `Fine-Grained Reader` role only to authorised users/groups for PII policy tags.
4. **Masking:** Dynamic data masking for non-authorised users — they see `XXXXX` instead of actual values.
5. **Encryption:** CMEK for all datasets containing PII.
6. **Perimeter:** VPC Service Controls to prevent data exfiltration.
7. **Audit:** Enable BigQuery Data Access audit logs. Export to Cloud Logging → BigQuery for analysis.
8. **Lineage:** Dataplex Data Lineage tracks where PII flows through pipelines.
9. **Retention:** Lifecycle rules auto-delete PII data after retention period.

---

# 19. GCP Data Engineer Cheat Sheet

## Service Selection Quick Reference

```
┌─────────────────────────────────────────────────────────────────────┐
│                  STORAGE SELECTION GUIDE                            │
├──────────────────────────┬──────────────────────────────────────────┤
│ Use Case                 │ Service                                  │
├──────────────────────────┼──────────────────────────────────────────┤
│ Object / file storage    │ Cloud Storage (GCS)                      │
│ Analytics / data warehouse│ BigQuery                               │
│ Time-series / IoT        │ Bigtable                                 │
│ Global relational OLTP   │ Spanner                                  │
│ Regional relational OLTP │ Cloud SQL (PostgreSQL/MySQL)             │
│ Document / NoSQL         │ Firestore                                │
│ In-memory cache          │ Memorystore (Redis / Memcached)          │
│ Feature serving (ML)     │ Vertex AI Feature Store                  │
└──────────────────────────┴──────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                  PROCESSING SELECTION GUIDE                         │
├──────────────────────────┬──────────────────────────────────────────┤
│ Use Case                 │ Service                                  │
├──────────────────────────┼──────────────────────────────────────────┤
│ New stream + batch       │ Dataflow (Beam)                          │
│ Existing Spark code      │ Dataproc                                 │
│ Serverless Spark batch   │ Dataproc Serverless                      │
│ SQL ELT in BigQuery      │ BigQuery + Dataform                      │
│ Visual ETL (no-code)     │ Data Fusion                              │
│ Event-driven functions   │ Cloud Functions / Cloud Run             │
└──────────────────────────┴──────────────────────────────────────────┘
```

## BigQuery Quick Reference

```sql
-- Partitioning
PARTITION BY DATE(ts_col)            -- daily partition
PARTITION BY TIMESTAMP_TRUNC(ts, HOUR) -- hourly partition
PARTITION BY RANGE_BUCKET(int_col, GENERATE_ARRAY(0, 1000000, 1000))

-- Clustering (up to 4 cols, leftmost most selective)
CLUSTER BY col1, col2, col3, col4

-- Query optimisation checklist
□ Filter on partition column (no functions on it)
□ SELECT only needed columns (not *)
□ Use clustering column filters
□ Use LIMIT for exploration
□ Check bytes scanned with dry_run before running
□ Use APPROX_COUNT_DISTINCT for cardinality estimates
□ Use BI Engine for repeated dashboard queries

-- BigQuery ML
CREATE OR REPLACE MODEL dataset.model_name
OPTIONS (model_type='logistic_reg', input_label_cols=['label'])
AS SELECT features..., label FROM training_data;

SELECT * FROM ML.PREDICT(MODEL dataset.model_name, (SELECT features FROM new_data));
SELECT * FROM ML.EVALUATE(MODEL dataset.model_name);
```

## Pub/Sub Quick Reference

```
Topic:        message channel; publishers write here
Subscription: independent cursor into topic; can be pull or push
              push: Pub/Sub calls your HTTPS endpoint (Cloud Run, Cloud Functions)
              pull: your subscriber calls Pub/Sub API

Ordering key: guarantee delivery order within key (enable_message_ordering=True)
Dead letter:  failed messages (nacked N times) → DLQ topic for inspection
Filter:       subscription-level filter on message attributes (reduce cost/load)
Retention:    7 days default; seek by time for replay
BigQuery sub: direct write to BQ table, no code needed (use topic schema)
```

## Dataflow Quick Reference

```
Runner:        DataflowRunner (production), DirectRunner (local test)
Key options:   --enable_streaming_engine, --experiments=use_runner_v2
               --autoscaling_algorithm=THROUGHPUT_BASED
               --no-use-public-ips (private networking)

Window types:  FixedWindows(seconds), SlidingWindows(size, period), Sessions(gap)
Triggers:      AfterWatermark(), AfterProcessingTime(delay), AfterCount(n)
Late data:     allowed_lateness=N (seconds), accumulation_mode=DISCARDING/ACCUMULATING
State/Timers:  per-key state for complex aggregations, timer for periodic flush

BQ write:      method=STORAGE_WRITE_API + triggering_frequency → exactly-once
Dead letter:   .with_outputs() to route bad records to separate sink
```

## IAM Roles Quick Reference

```
BigQuery:
  bigquery.viewer          → browse datasets, no query
  bigquery.dataViewer      → read table data
  bigquery.dataEditor      → read + write
  bigquery.jobUser         → run queries (needs dataViewer for data)
  bigquery.admin           → full control

GCS:
  storage.objectViewer     → read objects
  storage.objectCreator    → create objects (no read!)
  storage.objectAdmin      → read + write + delete
  storage.admin            → full control including bucket create

Dataflow:
  dataflow.developer       → submit and manage jobs
  dataflow.worker          → run as worker (assign to service account)

Pub/Sub:
  pubsub.publisher         → publish to topics
  pubsub.subscriber        → consume from subscriptions
  pubsub.viewer            → view metadata
```

## Common gcloud Commands

```bash
# BigQuery
bq ls                                        # list datasets
bq query --use_legacy_sql=false 'SELECT ...' # run query
bq --location=asia-south1 mk --dataset project:dataset
bq load --source_format=PARQUET dataset.table gs://bucket/file.parquet
bq query --dry_run --use_legacy_sql=false 'SELECT ...'  # estimate bytes

# GCS
gsutil mb -p proj -c STANDARD -l asia-south1 gs://bucket-name
gsutil -m cp -r gs://src/ gs://dst/
gsutil ls -lh gs://bucket/prefix/

# Dataflow
gcloud dataflow jobs list --region=asia-south1
gcloud dataflow jobs cancel JOB_ID --region=asia-south1
gcloud dataflow jobs describe JOB_ID --region=asia-south1

# Dataproc
gcloud dataproc clusters list --region=asia-south1
gcloud dataproc jobs submit pyspark gs://bucket/job.py --cluster=CLUSTER
gcloud dataproc clusters delete CLUSTER --region=asia-south1

# Pub/Sub
gcloud pubsub topics list
gcloud pubsub subscriptions pull SUBSCRIPTION --auto-ack --limit=10
gcloud pubsub topics publish TOPIC --message='{"key":"value"}'
```

## Architecture Decision Cheat Sheet

```
Batch vs Streaming?
  → Need results in seconds? → Streaming (Dataflow/Pub/Sub)
  → Minutes to hours OK?     → Batch (Dataproc/Dataflow batch/BQ)

Dataflow vs Dataproc?
  → New code, serverless, unified batch+stream → Dataflow
  → Existing Spark code, Spark ML             → Dataproc

BigQuery vs Bigtable?
  → SQL analytics, minutes query time → BigQuery
  → Key-value, <10ms, high QPS        → Bigtable

Cloud SQL vs Spanner?
  → Single region, standard RDBMS     → Cloud SQL
  → Global, horizontal scale, ACID    → Spanner

Stream ingest: Pub/Sub (global, managed) vs Pub/Sub Lite (regional, cheaper, ordering)
Change capture: Datastream (CDC from Oracle/MySQL/PG → BQ/GCS)
ELT in BQ: Dataform (SQL transformations, version control, lineage)
```

---

*GCP Data Engineer Notes cover the full Professional Data Engineer certification scope.*  
*Key areas to master: BigQuery (partitioning, clustering, BQML, pricing), Dataflow (Beam model, windowing, exactly-once), Pub/Sub (ordering, DLQ, BQ subscription), IAM (least privilege, CMEK, VPC-SC), and architecture patterns (Lambda/Kappa/Medallion).*
