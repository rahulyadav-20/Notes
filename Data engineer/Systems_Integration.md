# Systems & Integration — Interview Notes

> Architectural reasoning round: systems thinking, data flow understanding, integration patterns, failure analysis, and technical depth. Builds on the API + data ingestion notes — this round tests *how you reason*, not just what you know.

---

## Table of Contents
1. [How This Round Differs](#1-how-this-round-differs)
2. [Systems Thinking](#2-systems-thinking)
3. [Data Flow Understanding](#3-data-flow-understanding)
4. [Integration Patterns](#4-integration-patterns)
5. [Failure Analysis](#5-failure-analysis)
6. [Technical Depth Topics](#6-technical-depth-topics)
7. [Scenario-Based Design Questions](#7-scenario-based-design-questions)
8. [Rapid-Fire Theory Q&A](#8-rapid-fire-theory-qa)
9. [How to Structure Any Answer](#9-how-to-structure-any-answer)
10. [Checklist — What to Say Out Loud](#10-checklist--what-to-say-out-loud)

---

## 1. How This Round Differs

| Coding round | Systems & Integration round |
|---|---|
| "Does this function work?" | "Does this **design** hold up under load, failure, and change?" |
| Local correctness | System-wide behavior, trade-offs |
| One component | Multiple components + the connections between them |
| Fix the bug | Anticipate the bug **class** before it exists |

**What interviewers are actually scoring:**
- Do you think in terms of *components + the contracts between them*, not just code?
- Can you reason about what happens when a dependency is slow, down, or returns garbage?
- Do you make trade-offs explicit (consistency vs availability, latency vs throughput, simplicity vs flexibility) instead of pretending there's one right answer?
- Can you zoom out (whole architecture) and zoom in (why *this* queue, why *this* retry policy) on demand?

---

## 2. Systems Thinking

### Core Mental Model
A system = **components** + **connections** (contracts/interfaces) + **emergent behavior** (what happens when you compose them, which is often not obvious from any single component).

### Key Habits to Demonstrate
1. **Draw the boxes and arrows first.** Before code, before database schema — what are the components, what data crosses each boundary, who owns each piece.
2. **Identify the bottleneck, not just the flow.** Every system has a slowest/weakest link — find it before someone else does.
3. **Think in states, not just steps.** A "create order" isn't one action — it has states: `pending → paid → shipped → delivered → refunded`, each with its own failure modes.
4. **Ask what changes over time.** Traffic grows 10x, a new team owns a service, a dependency deprecates an API — does the design bend or break?
5. **Separate the "happy path" design from the "what if" design.** Senior-level answers spend more time on the "what if" than the happy path.

### Coupling & Cohesion (classic systems-thinking axis)
- **Tight coupling**: services know too much about each other's internals (shared DB, synchronous chains, shared code that must deploy together) → change in one breaks another
- **Loose coupling**: services communicate via stable contracts (APIs, events) and don't share internal state → can evolve/scale independently
- **High cohesion**: a component does one well-defined thing; **low cohesion** = a component doing unrelated things is harder to reason about and test

### CAP Theorem (near-guaranteed question)
In a distributed system, during a network partition you can only have 2 of 3:
- **Consistency**: every read gets the latest write
- **Availability**: every request gets a (non-error) response
- **Partition tolerance**: system keeps working despite network splits

Since partitions *will* happen in any real distributed system, the real choice is **CP vs AP** during a partition:
- **CP** (e.g., traditional RDBMS with sync replication, ZooKeeper, etcd): refuse to answer rather than serve stale/conflicting data
- **AP** (e.g., DynamoDB, Cassandra): stay available, may serve stale data, reconcile later (eventual consistency)

### Consistency Models (say the right word at the right time)
| Model | Guarantee |
|---|---|
| Strong consistency | Read always sees latest write |
| Eventual consistency | Reads converge to latest write *eventually*, may be stale briefly |
| Read-your-writes | You always see your own writes, even if others don't yet |
| Causal consistency | Causally related operations seen in order by everyone |

### Scaling Vocabulary
- **Vertical scaling**: bigger machine (simple, has a ceiling)
- **Horizontal scaling**: more machines (needs statelessness / partitioning)
- **Sharding**: splitting data across nodes by a key (customer_id, region) — introduces cross-shard query complexity
- **Replication**: copying data for availability/read-scaling — introduces consistency lag
- **Load shedding**: deliberately dropping/rejecting low-priority requests under overload to protect the system as a whole

---

## 3. Data Flow Understanding

### Trace the Data, Not Just the Request
For any system, be able to answer: *where does a piece of data originate, what transforms it, where does it rest, who reads it, and how does it get invalidated/deleted?*

```
Source of truth → Transformation(s) → Storage → Consumers → Feedback/invalidation
```

### Sync vs Async Data Flow
| | Synchronous | Asynchronous |
|---|---|---|
| Caller waits? | Yes | No |
| Coupling | Tighter (caller depends on callee's uptime/latency) | Looser (via queue/event) |
| Failure mode | Caller fails if callee fails | Caller succeeds; consumer catches up later |
| Use when | Need immediate result (auth check, payment authorization) | Can tolerate delay (email send, analytics, ingestion) |

### Push vs Pull (recap from data ingestion, applies system-wide)
- **Pull**: consumer polls for data on its own schedule — simple, but adds latency and can miss bursts if polling too infrequently
- **Push**: producer sends data immediately — lower latency, but producer must handle backpressure if consumer is slow

### Backpressure (important, often missed)
What happens when a downstream consumer can't keep up with an upstream producer?
- **Buffer/queue**: absorb bursts (but queue can grow unbounded if sustained mismatch — need alerting on queue depth)
- **Drop**: shed load, sacrifice completeness (fine for metrics, not for orders)
- **Block/slow the producer**: apply backpressure upstream (works within one system, harder across service boundaries)
- **Scale the consumer**: add more workers (only helps if consumer scaling matches queue growth rate)

### Data Flow Failure Points (walk these explicitly in interviews)
1. At the **source**: source system is down, slow, or returns malformed/partial data
2. In **transit**: network timeout, partial write, message lost or duplicated
3. At **transformation**: bug in transform logic, schema mismatch, silent data loss (e.g., a join that drops unmatched rows)
4. At **rest**: storage full, write conflicts, stale/expired data served
5. At **consumption**: consumer crashes mid-processing, double-processes on retry, misinterprets schema

### Idempotency & Ordering in Data Flow
- **Idempotency**: reprocessing the same data point twice shouldn't change the end state (dedupe key, upsert, idempotency token)
- **Ordering**: does the consumer need events in order? (e.g., "created" must be processed before "updated") — if yes, you need a partition key that routes related events to the same ordered stream (e.g., Kafka partition by `order_id`)

### Data Lineage & Observability
Being able to answer "where did this number come from?" — track:
- Which job/version produced this row
- What upstream sources it depended on
- When it was last refreshed
This matters for debugging incorrect data and for trust in the system.

---

## 4. Integration Patterns

### Synchronous Integration
- **Request/Response (REST/gRPC)**: simplest, but caller blocked, failure propagates immediately
- **RPC**: tighter contract (typed), often lower overhead (gRPC/Protobuf) than REST/JSON, less human-debuggable

### Asynchronous / Event-Driven Integration
| Pattern | Description | Example |
|---|---|---|
| Message Queue | Point-to-point, one consumer processes each message | SQS, RabbitMQ |
| Pub/Sub | One producer, many independent subscribers | Kafka, SNS, Google Pub/Sub |
| Event Sourcing | Store state as a sequence of events, derive current state by replay | Ledger/audit systems |
| CQRS | Separate write model (commands) from read model (queries), often paired with event sourcing | High-read systems needing optimized read views |
| Webhook | Provider pushes an event to a consumer's HTTP endpoint | Stripe payment events |
| Saga | Coordinate a multi-step distributed transaction via a sequence of local transactions + compensating actions | Order → Payment → Inventory across services |

### Choosing Queue vs Pub/Sub (common question)
- **Queue**: one logical consumer group processes each message exactly once (work distribution) — e.g., "process this order"
- **Pub/Sub**: many independent consumers each need their own copy of the event — e.g., "order created" triggers billing, analytics, and notifications independently

### Saga Pattern Detail (frequently probed at "architectural" depth)
Two flavors:
- **Choreography**: each service listens for events and reacts, no central coordinator — simpler, but hard to see the overall flow, risk of implicit coupling
- **Orchestration**: a central coordinator explicitly calls each step and handles compensation — easier to reason about and monitor, but the orchestrator becomes a critical component

Compensating transactions: since distributed systems can't do a single ACID transaction across services, each step must have a matching "undo" (e.g., `reserve_inventory` ↔ `release_inventory`) to unwind partial failures.

### API Gateway / BFF (Backend-for-Frontend)
- **API Gateway**: single entry point, centralizes auth, rate limiting, routing, and can aggregate calls to multiple backend services
- **BFF**: a gateway tailored per client type (mobile vs web) so each gets a shape of data suited to it, avoiding one-size-fits-all payload bloat

### Strangler Fig Pattern (legacy migration — common "how would you migrate" question)
Gradually replace a legacy system by routing an increasing share of traffic to the new system through a facade, until the old system can be fully retired — avoids a risky big-bang rewrite.

### Anti-Corruption Layer
A translation layer between two systems with different data models/semantics (e.g., your clean domain model vs. a messy legacy or third-party API), so internal code isn't polluted by external quirks.

### Idempotency in Integration (ties back to earlier notes)
Every integration point that can be retried (network blip, timeout, at-least-once delivery) needs an idempotency strategy: idempotency keys, upserts, or naturally idempotent operations (`PUT` vs `POST`).

---

## 5. Failure Analysis

### Failure Modes to Always Consider
| Failure | Symptom | Mitigation |
|---|---|---|
| Dependency down | Timeouts, 5xx | Circuit breaker, fallback, cached response |
| Dependency slow | Latency spikes cascade upstream | Timeouts, bulkheads, async decoupling |
| Partial failure | Some records succeed, some fail mid-batch | Idempotent retries at the record level, dead-letter queue |
| Network partition | Nodes can't see each other, split brain | Quorum/consensus (Raft/Paxos), leader election |
| Data corruption | Downstream consumers get bad data silently | Schema validation, checksums, data quality checks |
| Thundering herd | Many clients retry simultaneously after an outage, overwhelming recovery | Jittered backoff, load shedding, gradual traffic ramp-up |
| Cascading failure | One service's failure/slowness exhausts resources (threads/connections) in callers, spreading the outage | Bulkheads (isolate resource pools per dependency), circuit breakers, timeouts |

### Cascading Failure — Walk Through the Mechanism (common deep-dive)
1. Service B becomes slow (e.g., DB under load)
2. Service A's calls to B start taking longer, tying up A's thread pool/connections
3. A's thread pool exhausts → A can't serve *any* request, even ones unrelated to B
4. A becomes slow/unavailable → A's callers (Service C) suffer the same fate
5. Outage spreads across the system from one weak link

**Mitigations, in order of impact:**
- **Timeouts** everywhere (a hung call is worse than a fast failure)
- **Circuit breaker**: stop calling B after N consecutive failures, fail fast for a cool-down period, then probe again (half-open state)
- **Bulkhead isolation**: separate thread/connection pools per dependency so B's slowness can't consume resources meant for other calls
- **Retries with backoff + jitter** — but cap total retry budget; naive retries can *worsen* an overload (retry storm)
- **Load shedding**: reject excess requests early (cheap) rather than let them queue up and time out expensively later

### Circuit Breaker States
```
CLOSED (normal) --failures exceed threshold--> OPEN (fail fast, no calls to B)
OPEN --after cool-down timer--> HALF-OPEN (allow a few test calls)
HALF-OPEN --success--> CLOSED   |   HALF-OPEN --failure--> OPEN
```

### Root Cause Analysis Framework (say this structure explicitly)
1. **Detect**: how did we know something was wrong? (alert, customer report, dashboard)
2. **Timeline**: what changed right before the symptom appeared? (deploy, config change, traffic spike, dependency incident)
3. **Isolate**: which component/layer is actually failing vs. just showing symptoms (don't fix the symptom, find the source)
4. **Blast radius**: what else does this affect, is it still spreading?
5. **Mitigate**: fastest safe way to stop the bleeding (rollback, feature flag, scale out, failover) — not necessarily the permanent fix
6. **Root cause**: the actual underlying reason, often several layers deep ("five whys")
7. **Prevent recurrence**: fix + guardrail (test, alert, automated safeguard) so the same class of failure can't silently repeat

### Single Point of Failure (SPOF) Analysis
Walk the architecture diagram and ask of every box: *"If this dies right now, what happens?"* A good design has no unmitigated SPOFs in the critical path — either redundancy (multiple instances, leader election) or a documented, accepted trade-off (e.g., "this batch job can be 10 minutes late, we accept that risk").

### Failure Analysis in Data Pipelines specifically
- Silent failures are the most dangerous: a job "succeeds" but drops rows quietly (e.g., a join that filters out unmatched records) — mitigate with row-count/checksum validation between stages
- Partial batch failure: don't fail the whole batch for one bad record — quarantine bad records, keep good ones flowing (see dead-letter pattern from ingestion notes)
- Late-arriving data: what happens if a record arrives after its processing window already closed? (watermarking / late-data handling in streaming systems)

---

## 6. Technical Depth Topics

Interviewers probe depth by asking "why this, not that" — always have a reason and a trade-off ready.

### Trade-off Pairs to Have Ready Opinions On
| A | B | Trade-off axis |
|---|---|---|
| SQL (RDBMS) | NoSQL | Strong consistency + joins vs flexible schema + horizontal scale |
| Synchronous | Asynchronous | Simplicity/immediate result vs resilience/decoupling |
| Monolith | Microservices | Simplicity/easy transactions vs independent scaling/deployment |
| Strong consistency | Eventual consistency | Correctness guarantees vs availability/latency |
| Push | Pull | Low latency vs simplicity/backpressure control |
| Batch | Streaming | Simplicity/cost vs freshness |
| Normalization | Denormalization | Write consistency/storage vs read performance |

### Monolith vs Microservices (classic depth question)
- Monolith: simpler to develop/test/deploy early, ACID transactions across the whole domain, but scales as one unit and a bug can bring down everything
- Microservices: independent scaling/deployment/tech choices, fault isolation, but adds network overhead, distributed transaction complexity (sagas), operational overhead (more moving parts to monitor/deploy)
- **Good answer**: "Start with a well-modularized monolith; split into services when a specific scaling, team-ownership, or reliability need justifies the added operational complexity" — shows judgment, not dogma.

### Consistency vs Availability in Practice
- Payments/inventory reservation → lean **consistent** (better to reject than double-sell)
- Social media likes/view counts → lean **available**, eventual consistency is fine

### Caching Depth
- Cache invalidation is famously hard — know the strategies: TTL expiry, write-through (update cache on write), write-behind (async), cache-aside (app checks cache, falls back to DB, populates cache)
- **Stale-while-revalidate**: serve stale data immediately while refreshing in the background — good latency/freshness trade-off for many read-heavy systems
- Cache stampede: many clients miss cache simultaneously (e.g., on expiry) and hammer the DB at once — mitigate with request coalescing/locking or staggered TTLs (jitter)

### Observability (depth signal)
Three pillars:
- **Logs**: discrete events, good for debugging specifics
- **Metrics**: aggregated numeric signals over time (latency, error rate, throughput) — good for dashboards/alerting
- **Traces**: follow one request across service boundaries — critical for diagnosing where latency/errors originate in a distributed call chain

### Capacity Planning / Back-of-Envelope Reasoning
Interviewers love seeing you estimate: *"If we get 1M requests/day, that's ~12 req/s average, but peak could be 5-10x that — so design for ~100 req/s. If each response is 2KB, that's ~200KB/s bandwidth at peak..."* — shows you can translate business numbers into system requirements.

### Security as a Systems Concern
- Defense in depth (no single control is the only thing standing between an attacker and data)
- Principle of least privilege between services (service A's credentials shouldn't be able to do everything service B can)
- Trust boundaries: know exactly where data crosses from "untrusted" (external input) to "trusted" (internal) and validate at that boundary

---

## 7. Scenario-Based Design Questions

### Scenario 1: "Two services need to stay in sync — one owns Orders, another owns Inventory. How do you keep them consistent without a shared database?"
- Reject shared-DB coupling (kills independent deployability)
- Use an **event-driven** approach: Orders service publishes `OrderCreated`, Inventory service consumes it and reserves stock, publishes `InventoryReserved`/`InventoryFailed`
- If inventory fails, publish a compensating event (`OrderCancelled`) — this is a **saga**
- Discuss trade-off: eventual consistency window where order exists but inventory isn't confirmed yet — decide if that's acceptable or if you need a synchronous reservation check on the critical path first

### Scenario 2: "A downstream service you depend on has become unreliable (intermittent 5xx and timeouts). Walk through your response, both immediate and long-term."
- Immediate: confirm it's actually them (not your network/config), check your circuit breaker is tripping correctly, check if fallback/cache is serving reasonable data, check blast radius (is it cascading?)
- Short-term: ensure timeouts+retries+circuit breaker are properly configured so the failure doesn't cascade into your own outage; consider serving degraded/cached responses
- Long-term: discuss SLA with the team owning that service, consider a fallback data source, evaluate if this dependency should move from synchronous to asynchronous (decouple with a queue) if business logic tolerates delay

### Scenario 3: "Design a system where multiple internal services need the same third-party data (e.g., exchange rates) without every service calling the external API independently."
- Centralize: one ingestion service pulls from the API on a schedule, publishes to an internal event stream / writes to a shared cache (Redis) or internal API
- Downstream services **pull from the internal source**, not the external API directly — reduces external rate-limit pressure, centralizes retry/error-handling logic, single point to add caching/monitoring
- This is essentially an **anti-corruption layer + cache** combined

### Scenario 4: "Your data pipeline processes 10x more volume than last year. What breaks first, and how do you find out before it does in production?"
- Reason about each stage: extraction (rate limits scale with volume?), landing storage (fine, cloud storage scales), staging load (bulk loader throughput, warehouse compute size), transform (SQL/dbt job runtime may grow non-linearly if not partitioned well)
- Answer approach: load-test with realistic 10x synthetic volume in staging, monitor each stage's duration/resource usage, look for anything that scales worse than linearly (e.g., a full-table scan transform, or a single-threaded loader)
- Fix candidates: partition pruning, incremental transforms instead of full recompute, horizontal scaling of workers, batching size tuning

### Scenario 5: "You need to migrate a legacy monolith's user-management module to a new microservice without downtime. How?"
- **Strangler fig**: put a facade/gateway in front of the legacy system, implement the new service, route a small % of traffic (or read-only traffic first) to the new service, validate correctness by comparing outputs (shadow traffic), gradually increase routed percentage, retire old code path once fully migrated
- Data migration: dual-write or CDC-based sync to keep both systems' data consistent during the transition window
- Rollback plan at every stage — never a one-way door

### Scenario 6: "How would you detect and prevent a cascading failure before it takes down the whole platform?"
- Detection: latency/error-rate dashboards per service, dependency graphs showing blast radius, alert on thread-pool/connection-pool saturation, not just on final failure
- Prevention: timeouts on every call, circuit breakers per dependency, bulkhead isolation (separate resource pools), load shedding at the edge, chaos testing (deliberately kill a dependency in staging to verify the system degrades gracefully instead of cascading)

### Scenario 7: "Design an integration where a partner's webhook can arrive out of order or be duplicated."
- Give every event a unique ID + timestamp/sequence number
- Deduplicate using the event ID (store recently seen IDs, e.g., in Redis with TTL) before processing
- For ordering: if order matters, buffer/reorder using the sequence number within a time window, or design the consumer logic to be commutative (applying events in any order yields the same final state) where possible — this avoids needing strict ordering at all
- Always design the webhook handler to be idempotent regardless, since "no duplicates" can never be fully guaranteed by the sender

---

## 8. Rapid-Fire Theory Q&A

**Q: What's the difference between coupling and cohesion?**
Coupling = how much components depend on each other's internals (want low). Cohesion = how focused a single component's responsibility is (want high).

**Q: Explain CAP theorem in one sentence.**
During a network partition, a distributed system must choose between consistency (reject requests to avoid stale data) and availability (keep responding, possibly with stale data).

**Q: What causes cascading failures, and what's the single most effective mitigation?**
A slow/failing dependency ties up callers' finite resources (threads, connections), starving unrelated requests; the most effective single mitigation is aggressive timeouts paired with circuit breakers.

**Q: Queue vs Pub/Sub — when would you choose each?**
Queue when exactly one consumer (or consumer group) should process each message (work distribution). Pub/Sub when multiple independent consumers each need their own copy of every event.

**Q: What is a saga, and why not just use a distributed transaction?**
A saga is a sequence of local transactions with compensating actions to undo partial progress, used because true ACID distributed transactions across services (2PC) are slow, reduce availability, and don't scale well across service/network boundaries.

**Q: What's backpressure and why does it matter?**
Backpressure is the mechanism (or the problem) of a fast producer overwhelming a slower consumer; without handling it (buffering, dropping, scaling consumers, or slowing producers) you get unbounded queue growth, memory exhaustion, or cascading failures.

**Q: Strong vs eventual consistency — give one example of when you'd pick each.**
Strong: bank balance / inventory reservation (correctness over availability). Eventual: social media like counts / search index updates (availability and low latency over instant accuracy).

**Q: What's a bulkhead, in systems design terms (not the ship analogy)?**
Isolating resources (thread pools, connection pools) per dependency so that one failing/slow dependency can't exhaust resources needed to serve other, healthy parts of the system.

**Q: Why is idempotency so central to distributed systems design?**
Because at-least-once delivery (retries, redelivery after crash) is the realistic guarantee in distributed systems — without idempotent operations, retries cause duplicate side effects (double charges, duplicate rows).

**Q: What's the difference between horizontal and vertical scaling, and what's the practical limit of each?**
Vertical = bigger machine, limited by hardware ceiling and creates a single point of failure. Horizontal = more machines, requires statelessness/partitioning but scales much further and improves fault tolerance.

**Q: What is the strangler fig pattern used for?**
Incrementally migrating a legacy system to a new one by routing increasing traffic through a facade, avoiding a risky big-bang rewrite.

**Q: What's the difference between logs, metrics, and traces?**
Logs = discrete event records for debugging specifics. Metrics = aggregated numeric time-series for dashboards/alerting. Traces = the path of a single request across service boundaries, used to pinpoint where in a distributed call chain latency/errors originate.

**Q: What's a thundering herd, and how do you prevent it?**
Many clients retry or reconnect simultaneously (e.g., after an outage or cache expiry), overwhelming the recovering system; prevented with jittered/randomized backoff and staggered TTLs/retries instead of synchronized ones.

---

## 9. How to Structure Any Answer

For **any** "design X" or "how would you handle Y" question in this round, narrate this structure out loud:

1. **Clarify scope & constraints** — scale, latency requirements, consistency requirements, existing systems to integrate with
2. **Draw the high-level components** — name them, describe what each owns
3. **Trace the data flow** — where does data enter, transform, rest, and exit; sync or async at each hop
4. **Call out the integration pattern** you're using and why (queue vs pub/sub, sync vs async, saga if multi-service transaction)
5. **Proactively raise failure modes** — "what happens if X is down/slow/returns garbage" for at least 2-3 components, and your mitigation
6. **State the trade-off explicitly** — "I'm choosing eventual consistency here because availability matters more than instant accuracy for this use case, but that means..."
7. **Mention how you'd know it's working** — monitoring/alerting signals you'd want

This structure alone demonstrates systems thinking even before the content is perfect — interviewers are grading the *process*, not just the final diagram.

---

## 10. Checklist — What to Say Out Loud

- [ ] Named the failure modes before being asked ("what if this service is down?")
- [ ] Used the right vocabulary precisely (idempotent, backpressure, coupling, saga, bulkhead — not vaguely)
- [ ] Made at least one trade-off explicit rather than presenting a single "correct" design
- [ ] Distinguished sync vs async and explained why
- [ ] Considered what changes at 10x scale
- [ ] Mentioned how you'd detect a problem (observability), not just how you'd fix it
- [ ] Asked a clarifying question about scale/consistency requirements before diving in
- [ ] Avoided over-engineering — justified complexity only where the requirements demand it (a senior signal: knowing when *not* to add a queue/microservice/cache)
