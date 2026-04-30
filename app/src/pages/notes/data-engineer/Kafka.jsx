import Cover     from '../../../components/content/Cover'
import PartHeader from '../../../components/content/PartHeader'
import Section    from '../../../components/content/Section'
import SubSection from '../../../components/content/SubSection'
import CodeBlock  from '../../../components/content/CodeBlock'
import Callout    from '../../../components/content/Callout'
import DataTable  from '../../../components/content/DataTable'
import Divider    from '../../../components/content/Divider'
import Diagram    from '../../../components/diagrams/Diagram'
import IsoBox     from '../../../components/diagrams/IsoBox'
import IsoArrow   from '../../../components/diagrams/IsoArrow'

/* ── SubSubSection — local helper ── */
function S3({ title, children }) {
  return (
    <div className="sss">
      <h4>{title}</h4>
      <div>{children}</div>
    </div>
  )
}

/* ── SVG arrow-head + glow, shared across all diagrams ── */
function Defs() {
  return (
    <defs>
      <marker id="arr" markerWidth="9" markerHeight="7" refX="7" refY="3.5" orient="auto">
        <polygon points="0 0, 9 3.5, 0 7" fill="rgba(200,215,240,0.85)"/>
      </marker>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
  )
}

/* ─────────────────────────────────────────────
   PART 1 — Architecture & Core Concepts
───────────────────────────────────────────── */
function Part1() {
  return (
    <div className="gc">
      <PartHeader
        label="Part 1"
        title="Architecture & Core Concepts"
        subtitle="Why Kafka exists, how data lives on disk, and how the cluster manages itself without ZooKeeper"
      />

      {/* ── Section 1 ── */}
      <Section title="1 — Why Apache Kafka Exists">
        <SubSection title="1.1 The Message Queue Problem">
          <p>
            Before Kafka, teams connected microservices with point-to-point HTTP calls or
            traditional queues like RabbitMQ. At 10 services this is manageable.
            At 500 it becomes a unmaintainable coupling graph — one slow consumer can back-pressure
            the entire pipeline, and there is no way to replay past events.
          </p>
          <Callout variant="info" label="The Core Insight">
            Kafka's breakthrough is treating the message log as a <strong>first-class, persistent data structure</strong>.
            Producers write at their speed; consumers read at theirs. Data is retained
            for hours or days — not deleted on ACK. Any number of consumer groups can
            independently read the same topic from any offset.
          </Callout>
          <S3 title="Why Traditional Queues Failed at Scale">
            <p>RabbitMQ and ActiveMQ delete a message once a consumer ACKs it. This means:</p>
            <ul>
              <li>Each message can only be consumed by <em>one</em> consumer type</li>
              <li>Replaying past events requires rebuilding the entire ingestion pipeline</li>
              <li>Throughput degrades above ~50 k msg/s per queue on a single node</li>
              <li>Adding a second consumer type requires a new queue and a separate producer write</li>
            </ul>
          </S3>
          <S3 title="Kafka's Answer — the Append-Only Commit Log">
            <p>
              <strong>In simple terms:</strong> Kafka is like a newspaper archive.
              The New York Times does not discard yesterday's edition when you finish reading it —
              every subscriber reads their own copy at their own pace.
              Kafka is the archive; each topic is a newspaper title; each consumer group is a subscriber.
            </p>
            <p>
              Technically, Kafka is an ordered, immutable, append-only log stored on disk.
              Records are never modified. Consumers track their own position (offset)
              and read forward. Adding a new consumer does not affect any existing consumer.
            </p>
          </S3>
        </SubSection>

        <SubSection title="1.2 Kafka vs Traditional Brokers">
          <DataTable
            headers={['Feature', 'Kafka', 'RabbitMQ', 'ActiveMQ']}
            rows={[
              ['Max throughput / node', '1–2 M msg/s', '~50 K msg/s', '~30 K msg/s'],
              ['Message retention', 'Hours / days / forever', 'Until ACK', 'Until ACK'],
              ['Replay past events', '✓ — seek to any offset', '✗', '✗'],
              ['Multiple consumer types', '✓ — independent groups', '✗ — one queue per consumer type', '✗'],
              ['Consumer model', 'Pull (consumer controls pace)', 'Push (broker controls pace)', 'Push'],
              ['Horizontal scale', 'Native — add brokers live', 'Limited', 'Limited'],
              ['Ordering guarantee', 'Per-partition', 'Per-queue', 'Per-queue'],
            ]}
          />
          <Callout variant="pitfall" label="When NOT to use Kafka">
            Kafka is not a task queue. If you need per-message TTL, message priorities,
            or routing rules (exchanges/bindings), RabbitMQ is the right tool.
            Kafka shines at high-throughput fan-out, event sourcing, and stream processing.
          </Callout>
        </SubSection>

        <SubSection title="1.3 Core Guarantees: Durability, Ordering, Scalability">
          <S3 title="Durability">
            <p>
              Every record is written to disk before the leader acknowledges it
              (with <code>acks=all</code>). Kafka never calls <code>fsync()</code> per message —
              it relies on OS page cache writes plus replication across
              <code>min.insync.replicas</code> brokers for durability.
              If a broker crashes, a follower promotes to leader within seconds with no data loss.
            </p>
          </S3>
          <S3 title="Ordering">
            <p>
              Ordering is guaranteed <strong>per partition, not across partitions</strong>.
              Records with the same key always hash to the same partition (murmur2 hash),
              giving you guaranteed order for every key — e.g., all events for
              <code>user_id=42</code> arrive in order.
            </p>
          </S3>
          <S3 title="Scalability">
            <p>
              Adding a broker to a running cluster requires no downtime.
              A single broker handles 1–2 M msg/s; a 10-node cluster sustains 10–20 M msg/s
              with the right configuration. The throughput scales linearly with partition count
              up to the network limit.
            </p>
          </S3>
          <Callout variant="note" label="Key Takeaways — Section 1">
            <ul>
              <li>Kafka's log model enables unlimited fan-out and replay — no consumer blocks another</li>
              <li>Throughput is 20–40× higher than traditional brokers at scale</li>
              <li>Order is per-partition — use a consistent key to guarantee order per entity</li>
              <li>Durability comes from replication, not fsync; plan your ISR count accordingly</li>
            </ul>
          </Callout>
        </SubSection>
      </Section>

      <Divider />

      {/* ── Section 2 ── */}
      <Section title="2 — Topics, Partitions & Segments">
        <SubSection title="2.1 Topics and Partition Layout on Disk">
          <p>
            A <strong>topic</strong> is a named feed — like a database table name.
            When you create a topic with 6 partitions and replication factor 3,
            Kafka creates 18 log directories across the cluster (6 leaders + 12 follower replicas).
            On-disk, each partition lives in a directory like
            <code>/kafka-data/orders-6/0</code>.
          </p>

          {/* Cluster architecture diagram */}
          <Diagram viewBox="0 0 760 240">
            <Defs/>
            <rect x="0" y="0" width="760" height="240" rx="10" fill="#0a0a22"/>
            {/* Producer */}
            <IsoBox x={20}  y={110} w={100} h={56} depth={20} color="#2ECC71" label="Producer"/>
            {/* 3 Brokers */}
            <IsoBox x={185} y={75}  w={128} h={76} depth={24} color="#4A90D9" label="Broker 1 (Leader)"/>
            <IsoBox x={360} y={75}  w={128} h={76} depth={24} color="#3a7fc1" label="Broker 2"/>
            <IsoBox x={535} y={75}  w={128} h={76} depth={24} color="#3a7fc1" label="Broker 3"/>
            {/* KRaft */}
            <IsoBox x={340} y={10}  w={130} h={42} depth={16} color="#7C3AED" label="KRaft Controller"/>
            {/* Consumer */}
            <IsoBox x={640} y={110} w={105} h={56} depth={20} color="#E6522C" label="Consumer Group"/>
            {/* Arrows */}
            <line x1="120" y1="138" x2="185" y2="123" stroke="rgba(200,215,240,0.7)" strokeWidth="1.5" markerEnd="url(#arr)" strokeDasharray="0"/>
            <line x1="313" y1="113" x2="360" y2="113" stroke="rgba(200,215,240,0.5)" strokeWidth="1.5" markerEnd="url(#arr)" strokeDasharray="5,3"/>
            <line x1="488" y1="113" x2="535" y2="113" stroke="rgba(200,215,240,0.5)" strokeWidth="1.5" markerEnd="url(#arr)" strokeDasharray="5,3"/>
            <line x1="663" y1="113" x2="640" y2="128" stroke="rgba(74,144,217,0.9)" strokeWidth="1.5" markerEnd="url(#arr)"/>
            <line x1="405" y1="52"  x2="249" y2="75"  stroke="rgba(124,58,237,0.5)" strokeWidth="1" markerEnd="url(#arr)" strokeDasharray="4,3"/>
            <line x1="405" y1="52"  x2="424" y2="75"  stroke="rgba(124,58,237,0.5)" strokeWidth="1" markerEnd="url(#arr)" strokeDasharray="4,3"/>
            {/* Labels */}
            <text x="148" y="132" fontSize="9" fill="rgba(200,215,240,0.6)" fontWeight="600">write</text>
            <text x="326" y="108" fontSize="9" fill="rgba(200,215,240,0.4)" fontWeight="600">replicate</text>
            <text x="660" y="122" fontSize="9" fill="rgba(74,144,217,0.8)" fontWeight="600">fetch</text>
            <text x="355" y="68"  fontSize="8" fill="rgba(124,58,237,0.6)" fontWeight="600">metadata</text>
          </Diagram>
          <p className="text-[0.75rem] text-muted text-center -mt-1 mb-4">
            Fig 1 — Kafka cluster: producer writes to the leader broker, followers replicate, KRaft manages all metadata
          </p>
        </SubSection>

        <SubSection title="2.2 Segment Files and Indexes">
          <p>
            Kafka splits each partition log into <strong>segments</strong> of configurable size
            (<code>log.segment.bytes</code>, default 1 GB). Inside each segment directory you find:
          </p>
          <ul>
            <li><code>00000000000000000000.log</code> — raw message bytes, append-only</li>
            <li><code>00000000000000000000.index</code> — sparse offset → byte-position index</li>
            <li><code>00000000000000000000.timeindex</code> — timestamp → offset index</li>
          </ul>
          <S3 title="Why Segments Matter for Retention">
            <p>
              Retention policies (<code>log.retention.hours</code>) operate at the segment level —
              Kafka can only delete a complete segment, never individual records.
              Tune <code>log.segment.bytes=268435456</code> (256 MB) in production
              to balance recovery time and file-descriptor count.
            </p>
          </S3>
          <CodeBlock description="Inspect segment files for partition 0 of topic 'orders'" language="Bash">
{`# List all files in partition 0's data directory
ls -lh /kafka-data/orders-0/

# Typical output:
# 00000000000000000000.index      sparse offset-to-position map
# 00000000000000000000.log        raw records (append-only)
# 00000000000000000000.timeindex  timestamp-to-offset map
# 00000000001073741824.log        next segment (base offset = 1073741824)

# Dump the index to human-readable form
kafka-dump-log.sh \
  --files /kafka-data/orders-0/00000000000000000000.index \
  --print-data-log`}
          </CodeBlock>
        </SubSection>

        <SubSection title="2.3 Log Compaction vs Retention">
          <DataTable
            headers={['Policy', 'Keeps', 'Deletes', 'Use case']}
            rows={[
              ['delete (default)',   'All records within retention window',    'Entire segments older than retention',    'Event streams, click data, analytics'],
              ['compact',            'Latest record per key only',             'Older values for each key',               'KTable source topics, user profiles, changelogs'],
              ['compact,delete',     'Latest per key + within time window',    'Old keys + expired segments',             'CDC with TTL — hybrid approach'],
            ]}
          />
          <Callout variant="pitfall" label="Log Compaction Gotcha">
            Compaction runs in the background and is <strong>not instantaneous</strong>.
            The "dirty" ratio of un-compacted records can be 30–50% at any moment.
            Consumer lag metrics against compacted topics can be misleading —
            the earliest offset shifts as compaction runs.
          </Callout>
        </SubSection>

        <SubSection title="2.4 Partition Sizing Guidelines">
          <p>
            Partition count is the most consequential topic-creation decision.
            <strong>It cannot be decreased</strong> without deleting and re-creating the topic.
          </p>
          <S3 title="Rule of Thumb">
            <p>
              <code>partitions = max(throughput_MB_s ÷ 10, desired_consumer_parallelism)</code>.
              One partition sustains ~10 MB/s combined producer + consumer.
              For 100 MB/s with 20 consumers, use 20 partitions.
            </p>
          </S3>
          <DataTable
            headers={['Partition count', 'Max throughput', 'Max consumers', 'Rebalance time', 'Recommended for']}
            rows={[
              ['1–3',    '10–30 MB/s',  '3',   '< 1 s',   'Low-traffic internal / audit topics'],
              ['6–12',   '60–120 MB/s', '12',  '1–3 s',   'Most production business topics'],
              ['24–48',  '240–480 MB/s','48',  '5–15 s',  'High-throughput analytics pipelines'],
              ['100+',   '1+ GB/s',     '100+','30–60 s', 'Only if you genuinely need it — ISR overhead is real'],
            ]}
          />
          <Callout variant="note" label="Key Takeaways — Section 2">
            <ul>
              <li>Partitions are the unit of parallelism — never more consumers than partitions</li>
              <li>Segments are the unit of deletion — tune <code>log.segment.bytes=268435456</code> (256 MB)</li>
              <li>Use <code>compact</code> for KTable source topics; <code>delete</code> for event streams</li>
              <li>Over-partitioning costs ~1 MB RAM per partition per broker for ISR metadata</li>
            </ul>
          </Callout>
        </SubSection>
      </Section>

      <Divider />

      {/* ── Section 3 ── */}
      <Section title="3 — Brokers & Cluster Metadata">
        <SubSection title="3.1 Broker Roles and Responsibilities">
          <p>
            Every Kafka broker is an equal peer for data — there is no "master" broker.
            One broker is elected <strong>cluster controller</strong> to manage metadata:
            partition leadership, ISR changes, and broker membership.
            This role is separate from being a partition leader.
          </p>
          <S3 title="What a Broker Does Per Request Type">
            <ul>
              <li><strong>Produce:</strong> Append record to partition log → wait for ISR ACKs → return offset</li>
              <li><strong>Fetch:</strong> Read records from offset → zero-copy transfer via <code>sendfile()</code></li>
              <li><strong>Metadata:</strong> Return which broker is leader for each partition</li>
              <li><strong>Coordinator:</strong> Manage group membership + offset commits (via <code>__consumer_offsets</code>)</li>
            </ul>
          </S3>
        </SubSection>

        <SubSection title="3.2 KRaft Mode — Removing ZooKeeper">
          <p>
            Before Kafka 3.3, all cluster metadata was stored in <strong>ZooKeeper</strong> —
            a separate service you had to deploy, monitor, and tune.
            KRaft (<strong>K</strong>afka <strong>R</strong>aft) replaces ZooKeeper with an
            internal Raft consensus group of controller nodes, available since Kafka 3.3 GA.
          </p>
          <S3 title="Why KRaft is Better">
            <ul>
              <li>Controller failover: <strong>30–60 s</strong> (ZooKeeper) → <strong>&lt; 1 s</strong> (KRaft)</li>
              <li>Max partitions per cluster: 200 K (ZK bottleneck) → <strong>1 M+</strong> (KRaft)</li>
              <li>No separate ZooKeeper cluster to operate, monitor, and secure</li>
              <li>Simpler networking — one fewer port range to expose</li>
            </ul>
          </S3>
          <CodeBlock description="Format storage and start a KRaft single-node cluster (dev)" language="Bash">
{`# Step 1 — generate a unique cluster UUID (one-time per cluster)
CLUSTER_ID=$(kafka-storage.sh random-uuid)

# Step 2 — format the log directory with the cluster ID
kafka-storage.sh format \
  -t "$CLUSTER_ID" \
  -c /etc/kafka/kraft/server.properties

# Step 3 — start (this node is both broker + controller in combined mode)
kafka-server-start.sh /etc/kafka/kraft/server.properties

# Essential KRaft properties (server.properties excerpt):
# process.roles=broker,controller    combined mode (dev only)
# node.id=1                          unique integer per node
# controller.quorum.voters=1@localhost:9093
# listeners=PLAINTEXT://:9092,CONTROLLER://:9093`}
          </CodeBlock>
        </SubSection>

        <SubSection title="3.3 Controller Election">
          <p>
            In KRaft mode the Raft protocol elects a leader from the controller quorum.
            A candidate wins by collecting a majority of votes (quorum = ⌊n/2⌋ + 1).
            Production recommendation: <strong>3 dedicated controller nodes</strong>
            on separate racks — odd number for clean majority; never all on the same rack.
          </p>
          <Callout variant="info" label="Controller vs Partition Leader">
            The <strong>cluster controller</strong> manages metadata (which broker leads which partition).
            A <strong>partition leader</strong> is the broker that accepts writes for one specific partition.
            They are independent roles — the controller is rarely also a partition leader in production.
          </Callout>
        </SubSection>

        <SubSection title="3.4 Cluster Health Metrics">
          <DataTable
            headers={['JMX Metric', 'Healthy', 'Alert if', 'Via']}
            rows={[
              ['ActiveControllerCount',          '1',     '≠ 1',    'JMX kafka.controller:type=KafkaController'],
              ['UnderReplicatedPartitions',       '0',     '> 0',    'kafka-topics.sh --describe | grep Offline'],
              ['OfflinePartitionsCount',          '0',     '> 0',    'JMX kafka.controller'],
              ['RequestHandlerAvgIdlePercent',    '> 30%', '< 10%',  'JMX kafka.server:type=KafkaRequestHandlerPool'],
              ['UnderMinIsrPartitionCount',       '0',     '> 0',    'JMX kafka.server:type=ReplicaManager'],
            ]}
          />
          <Callout variant="note" label="Key Takeaways — Section 3">
            <ul>
              <li>Use KRaft for all new clusters — ZooKeeper mode is deprecated as of Kafka 3.5</li>
              <li><code>UnderReplicatedPartitions &gt; 0</code> is the single most critical production alert</li>
              <li>KRaft controller election takes &lt; 1 s vs 30–60 s with ZooKeeper</li>
              <li>Run 3 dedicated controller nodes on separate racks in every production cluster</li>
            </ul>
          </Callout>
        </SubSection>
      </Section>
    </div>
  )
}

/* ─────────────────────────────────────────────
   PART 2 — Producers & Consumer Groups
───────────────────────────────────────────── */
function Part2() {
  return (
    <div className="gc">
      <PartHeader
        label="Part 2"
        title="Producers & Consumer Groups"
        subtitle="How records are batched, compressed, and reliably delivered — and how consumers coordinate reads at scale"
      />

      <Section title="4 — Producer Internals">
        <SubSection title="4.1 Record Batching and linger.ms">
          <p>
            A naive producer issues one network call per record.
            At 100 k msg/s that is 100 k TCP round-trips per second — unsustainable.
            Kafka's producer client solves this with an in-memory
            <strong> RecordAccumulator</strong> that batches records before sending.
          </p>

          {/* Producer flow diagram */}
          <Diagram viewBox="0 0 720 160">
            <Defs/>
            <rect x="0" y="0" width="720" height="160" rx="10" fill="#0a0a22"/>
            {[
              { x:14,  label:'App',          color:'#2ECC71' },
              { x:144, label:'Serializer',   color:'#F59E0B' },
              { x:274, label:'Partitioner',  color:'#F59E0B' },
              { x:404, label:'Accumulator',  color:'#4A90D9' },
              { x:534, label:'NetworkClient',color:'#4A90D9' },
            ].map(({ x, label, color }) => (
              <g key={x}>
                <rect x={x} y={55} width={115} height={50} rx="8" fill={color}/>
                <text x={x+57} y={85} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">{label}</text>
              </g>
            ))}
            {[144,274,404,534].map(x => (
              <line key={x} x1={x-14} y1={80} x2={x-1} y2={80}
                stroke="rgba(200,215,240,0.6)" strokeWidth="1.5" markerEnd="url(#arr)"/>
            ))}
            <rect x="648" y="45" width="58" height="70" rx="8" fill="#E6522C"/>
            <text x="677" y="78" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">Broker</text>
            <line x1="649" y1="80" x2="634" y2="80"
              stroke="rgba(200,215,240,0.7)" strokeWidth="1.5" markerEnd="url(#arr)"/>
            <text x="455" y="120" fontSize="9" fill="rgba(200,215,240,0.45)" fontWeight="600">batch.size / linger.ms</text>
          </Diagram>
          <p className="text-[0.75rem] text-muted text-center -mt-1 mb-4">
            Fig 2 — Producer pipeline: records are serialized, partitioned, accumulated into batches, then flushed to the broker
          </p>

          <DataTable
            headers={['Config', 'Default', 'Recommended', 'Effect']}
            rows={[
              ['batch.size',    '16,384 (16 KB)',   '131,072 (128 KB)',  'Max bytes per batch per target partition'],
              ['linger.ms',     '0 (send immediately)', '5–20 ms',       'Wait this long before flushing — allows batching'],
              ['buffer.memory', '33,554,432 (32 MB)','67,108,864 (64 MB)','Total in-memory buffer before back-pressure'],
              ['compression.type','none',            'lz4',              'Compress at batch level — 2–3× less data on wire'],
            ]}
          />
          <Callout variant="info" label="The Batching Trade-off">
            <code>linger.ms=0</code>: minimum latency, worst throughput.
            <code>linger.ms=20</code>: batches accumulate for 20 ms then flush as one compressed write —
            throughput improves 5–10× while latency increases by at most 20 ms.
            For analytics pipelines 5–20 ms is imperceptible.
          </Callout>
        </SubSection>

        <SubSection title="4.2 Partitioner Strategies">
          <S3 title="Default — Sticky Partitioner (Kafka 2.4+)">
            <p>
              Before 2.4, Kafka used round-robin per record. From 2.4 the
              <strong> sticky partitioner</strong> fills one partition's batch completely before
              moving to the next. This effectively doubles batch size with no latency cost.
            </p>
          </S3>
          <S3 title="Key-Based Partitioning">
            <p>
              When a record has a non-null key, Kafka computes
              <code>partition = murmur2(key) % numPartitions</code>.
              All records for the same key always land on the same partition —
              guaranteeing ordered history per entity (e.g., all events for
              <code>order_id=42</code> are ordered).
            </p>
          </S3>
          <CodeBlock description="Custom partitioner — route VIP orders to a dedicated partition" language="Java">
{`public class VipPartitioner implements Partitioner {

  @Override
  public int partition(String topic, Object key, byte[] keyBytes,
                       Object value, byte[] valueBytes, Cluster cluster) {

    int numPartitions = cluster.partitionCountForTopic(topic);

    // Partition 0 is reserved for VIP customers — guaranteed low latency
    if (key instanceof String && ((String) key).startsWith("vip_")) {
      return 0;
    }

    // All other keys: spread evenly across partitions 1..N-1
    return (Math.abs(Utils.murmur2(keyBytes)) % (numPartitions - 1)) + 1;
  }

  @Override public void close() {}
  @Override public void configure(Map<String, ?> configs) {}
}`}
          </CodeBlock>
        </SubSection>

        <SubSection title="4.3 Compression: lz4 vs snappy vs zstd">
          <DataTable
            headers={['Codec', 'Compression ratio', 'CPU cost', 'Best for']}
            rows={[
              ['none',   '1×',    'zero',    'Already-compressed payloads (JPEG, video)'],
              ['lz4',    '2–3×',  'very low','Default production choice — best throughput/CPU tradeoff'],
              ['snappy', '2–3×',  'low',     'Google-stack environments already using snappy'],
              ['zstd',   '3–5×',  'medium',  'Storage-sensitive topics, cold/archival data'],
              ['gzip',   '3–5×',  'high',    'Avoid in Kafka — use zstd instead'],
            ]}
          />
          <Callout variant="pitfall" label="Compression Mismatch Tax">
            Set the same codec on <em>both</em> the producer and the topic
            (<code>kafka-configs.sh --alter --add-config compression.type=lz4</code>).
            If they differ, the broker re-compresses every batch on ingestion —
            a silent 10–30% throughput penalty.
          </Callout>
        </SubSection>

        <SubSection title="4.4 Idempotent Producers and Exactly-Once">
          <S3 title="The Duplicate Problem (without idempotence)">
            <p>
              Producer sends a batch → broker writes it → broker crashes before sending ACK →
              producer retries → <strong>duplicate record</strong>.
              This is at-least-once delivery. For financial data this is unacceptable.
            </p>
          </S3>
          <S3 title="Idempotent Producers (enable.idempotence=true)">
            <p>
              The broker assigns each producer a PID (Producer ID) and tracks a monotone
              sequence number per partition. If the same (PID, partition, seq) tuple arrives twice,
              the broker silently deduplicates — no duplicate ever reaches the log.
              Cost: ~5% throughput overhead. Always enable this in production.
            </p>
          </S3>
          <CodeBlock description="Exactly-once transactional producer" language="Java">
{`Properties props = new Properties();
props.put("bootstrap.servers",  "kafka-1:9092,kafka-2:9092,kafka-3:9092");
props.put("key.serializer",     "org.apache.kafka.common.serialization.StringSerializer");
props.put("value.serializer",   "org.apache.kafka.common.serialization.StringSerializer");
props.put("enable.idempotence", "true");     // deduplicates retries at broker level
props.put("acks",               "all");      // wait for all ISR replicas to ack
props.put("retries",            Integer.MAX_VALUE);
props.put("transactional.id",   "order-svc-txn-1"); // unique per producer instance

KafkaProducer<String, String> producer = new KafkaProducer<>(props);
producer.initTransactions(); // register with broker, bump epoch

try {
  producer.beginTransaction();

  // Both writes are atomic — consumer sees either both or neither
  producer.send(new ProducerRecord<>("orders",    orderId, orderJson));
  producer.send(new ProducerRecord<>("inventory", itemId,  reserveJson));

  producer.commitTransaction(); // ← both records visible atomically

} catch (ProducerFencedException e) {
  // A newer instance claimed this transactional.id — safe to close
  producer.close();
} catch (KafkaException e) {
  producer.abortTransaction(); // roll back — consumers see nothing
}`}
          </CodeBlock>
        </SubSection>

        <SubSection title="4.5 Producer Configuration Reference">
          <DataTable
            headers={['Config', 'Default', 'Production', 'Note']}
            rows={[
              ['acks',                   '1',           'all',        'acks=1 loses data on leader crash'],
              ['enable.idempotence',     'true (3.0+)', 'true',       'Always on — requires acks=all'],
              ['batch.size',             '16384',       '131072',     'Larger batches = higher throughput'],
              ['linger.ms',              '0',           '5',          'Allow 5 ms for batch accumulation'],
              ['compression.type',       'none',        'lz4',        '2–3× less data, near-zero CPU cost'],
              ['max.in.flight.per.conn', '5',           '5',          'Must be ≤ 5 when idempotent=true'],
              ['delivery.timeout.ms',    '120000',      '120000',     'Total time including all retries'],
            ]}
          />
          <Callout variant="note" label="Key Takeaways — Section 4">
            <ul>
              <li>Always use <code>enable.idempotence=true</code> + <code>acks=all</code> in production</li>
              <li>Set <code>batch.size=131072</code> + <code>linger.ms=5</code> for 3–5× throughput improvement</li>
              <li><code>lz4</code> compression is the best default — lowest CPU cost for 2–3× size reduction</li>
              <li>Transactions enable atomic multi-topic writes — exactly-once at the application level</li>
            </ul>
          </Callout>
        </SubSection>
      </Section>

      <Divider />

      <Section title="5 — Consumer Groups & Offsets">
        <SubSection title="5.1 Consumer Group Protocol">
          <p>
            A <strong>consumer group</strong> is a set of consumers that collectively consume
            all partitions of a topic. Kafka guarantees each partition is assigned to exactly one
            consumer within the group — this is the fundamental unit of parallelism.
          </p>
          <p>
            <strong>In simple terms:</strong> imagine a conveyor belt (partitions) with
            workers (consumers) stationed at intervals. Each worker handles its assigned
            section of the belt. Adding a worker triggers a re-assignment (rebalance).
          </p>
          <Callout variant="info" label="Group Coordinator">
            One broker per group is elected <strong>group coordinator</strong> (via hash of group ID).
            It tracks heartbeats, triggers rebalances, and stores committed offsets in the
            internal <code>__consumer_offsets</code> topic (3 replicas by default).
          </Callout>
        </SubSection>

        <SubSection title="5.2 Partition Assignment Strategies">
          <DataTable
            headers={['Strategy', 'How it works', 'Best for']}
            rows={[
              ['RangeAssignor',              'Consecutive ranges of partitions per consumer',   'Predictable, reproducible layout across topics'],
              ['RoundRobinAssignor',         'Distribute partitions round-robin across members','Even load when all consumers are identical'],
              ['StickyAssignor',             'Like round-robin but retains prior assignments',  'Stateful consumers — reduces state migration'],
              ['CooperativeStickyAssignor',  'Incremental rebalance — only revokes moving parts','Recommended default — no stop-the-world pause'],
            ]}
          />
        </SubSection>

        <SubSection title="5.3 Offset Management: Auto vs Manual Commit">
          <S3 title="Auto-commit (enable.auto.commit=true) — avoid in production">
            <p>
              Offsets are committed every <code>auto.commit.interval.ms</code> (5 s default).
              Risk: consumer processes a record, auto-commit fires, consumer crashes before
              completing downstream work — the record is silently lost. This is at-most-once delivery.
            </p>
          </S3>
          <S3 title="Manual Commit — At-Least-Once">
            <CodeBlock description="Manual commit after processing each batch" language="Java">
{`props.put("enable.auto.commit", "false");     // take control of commits
props.put("max.poll.records",   "500");        // process up to 500 records per poll

KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
consumer.subscribe(List.of("orders"));

while (true) {
  ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));

  for (ConsumerRecord<String, String> record : records) {
    processOrder(record.value()); // your business logic here
  }

  // Commit ONLY after all records in this batch are successfully processed.
  // If the process crashes here, records will be re-delivered (at-least-once).
  consumer.commitSync(); // blocking — guarantees broker acked before moving on
  // Or use: consumer.commitAsync() for fire-and-forget (lower latency, less safe)
}`}
            </CodeBlock>
          </S3>
        </SubSection>

        <SubSection title="5.4 Consumer Lag Monitoring">
          <p>
            <strong>Consumer lag</strong> = (latest partition offset) − (last committed offset).
            Lag &gt; 0 means consumers are behind producers. At 1 M records × 1 KB average = 1 GB
            of un-processed data, you have a serious operational problem.
          </p>
          <CodeBlock description="Check lag for all consumer groups from the CLI" language="Bash">
{`kafka-consumer-groups.sh \
  --bootstrap-server kafka:9092 \
  --describe \
  --all-groups

# Output:
# GROUP            TOPIC   PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG
# order-processor  orders  0          1000042         1000142         100
# order-processor  orders  1          999820          1000095         275
# order-processor  orders  2          1000010         1000115         105

# Monitor lag continuously with watch
watch -n 5 'kafka-consumer-groups.sh --bootstrap-server kafka:9092 \
  --describe --group order-processor | column -t'`}
          </CodeBlock>
          <Callout variant="pitfall" label="Lag Spike vs Growing Lag">
            A temporary spike (consumer paused during rebalance) is normal.
            <strong>Continuously growing lag</strong> means consumers cannot keep up with the producer rate.
            Fix: add more consumers (up to partition count), or optimize processing logic.
            Never blindly increase <code>max.poll.interval.ms</code> — that just hides the problem.
          </Callout>
        </SubSection>

        <SubSection title="5.5 Rebalancing: Eager vs Cooperative Sticky">
          <S3 title="Eager Rebalance (old default — avoid)">
            <p>
              On any group change, <em>all</em> consumers stop processing and revoke
              <em>all</em> partitions simultaneously. The coordinator waits for all members
              to rejoin, then assigns fresh partitions.
              During this window (typically 2–30 s), <strong>zero records are consumed</strong>.
              This is a full stop-the-world pause.
            </p>
          </S3>
          <S3 title="Cooperative Sticky Rebalance (Kafka 2.4+ — use this)">
            <p>
              Only partitions that <em>must move</em> are revoked.
              Consumers keep their current partitions and continue processing
              while the incremental rebalance completes in the background.
              End-to-end interruption is typically under 200 ms.
            </p>
          </S3>
          <CodeBlock description="Configure CooperativeStickyAssignor (recommended)" language="Java">
{`props.put("partition.assignment.strategy",
  "org.apache.kafka.clients.consumer.CooperativeStickyAssignor");

// Tune these three together — they must satisfy: heartbeat < session/3
props.put("session.timeout.ms",    "45000");  // kick consumer if silent for 45 s
props.put("heartbeat.interval.ms", "3000");   // heartbeat every 3 s  (45/3 = 15 — fine)
props.put("max.poll.interval.ms",  "300000"); // allow 5 min to process a batch
                                              // increase if processing is slow,
                                              // but profile first`}
          </CodeBlock>
          <Callout variant="note" label="Key Takeaways — Section 5">
            <ul>
              <li>Use <code>CooperativeStickyAssignor</code> — eliminates stop-the-world rebalances in Kafka 2.4+</li>
              <li>Always use manual commit (<code>enable.auto.commit=false</code>) for reliable at-least-once delivery</li>
              <li>Monitor lag per partition — total lag hides hot partitions</li>
              <li>Consumer count ≤ partition count; extra consumers sit idle as hot standbys</li>
            </ul>
          </Callout>
        </SubSection>
      </Section>
    </div>
  )
}

/* ─────────────────────────────────────────────
   PART 3 — Replication & Delivery Semantics
───────────────────────────────────────────── */
function Part3() {
  return (
    <div className="gc">
      <PartHeader
        label="Part 3"
        title="Brokers, Topics & Replication"
        subtitle="ISR mechanics, ack semantics, unclean election trade-offs, and exactly-once transactions"
      />

      <Section title="6 — Replication Deep Dive">
        <SubSection title="6.1 Leader and Follower Replicas">
          <p>
            Every partition has one <strong>leader replica</strong> and zero or more
            <strong> follower replicas</strong>.
            Producers always write to the leader. Followers <em>pull</em> from the leader —
            they never accept direct writes. If the leader crashes,
            one ISR follower is elected as the new leader.
          </p>
          <S3 title="Rack-Aware Replica Placement">
            <p>
              For 3 replicas across 3 racks, Kafka places the leader on rack A,
              followers on racks B and C. A single rack failure then loses at most one replica —
              the partition remains available for reads and writes.
              Always enable <code>broker.rack</code> in production.
            </p>
          </S3>
        </SubSection>

        <SubSection title="6.2 In-Sync Replicas (ISR) and acks">
          <p>
            The <strong>ISR set</strong> is the list of replicas currently "caught up" to the leader
            — within <code>replica.lag.time.max.ms</code> (default 10 s) of the leader's log end offset.
            Kafka's <code>acks=all</code> setting means the leader waits for <em>all ISR members</em>
            to acknowledge before confirming the write to the producer.
          </p>

          {/* ISR diagram */}
          <Diagram viewBox="0 0 660 240">
            <Defs/>
            <rect x="0" y="0" width="660" height="240" rx="10" fill="#0a0a22"/>
            {/* ISR boundary */}
            <ellipse cx="250" cy="130" rx="215" ry="95"
              fill="rgba(74,144,217,0.07)" stroke="#4A90D9" strokeWidth="1.5" strokeDasharray="7,4"/>
            <text x="250" y="28" textAnchor="middle" fontSize="11" fill="#4A90D9" fontWeight="700">
              In-Sync Replicas (ISR)
            </text>
            {/* Leader */}
            <rect x="160" y="85" width="180" height="60" rx="8" fill="#4A90D9"/>
            <text x="250" y="111" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="800">Leader — Broker 1</text>
            <text x="250" y="129" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="10">LEO = 50,142</text>
            {/* ISR follower */}
            <rect x="60"  y="170" width="155" height="48" rx="8" fill="#2ECC71"/>
            <text x="137" y="192" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">Broker 2  ✓ ISR</text>
            <text x="137" y="207" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">LEO = 50,140</text>
            {/* Lagging follower */}
            <rect x="430" y="150" width="200" height="48" rx="8" fill="#E6522C"/>
            <text x="530" y="172" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">Broker 3  ✗ Lagging</text>
            <text x="530" y="187" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">LEO = 49,800  (out of ISR)</text>
            {/* HW label */}
            <line x1="160" y1="140" x2="215" y2="155" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4,3"/>
            <text x="110" y="155" fontSize="9" fill="#F59E0B" fontWeight="700">HW = 50,140</text>
            {/* Replication arrows */}
            <line x1="220" y1="145" x2="175" y2="170" stroke="rgba(74,144,217,0.7)" strokeWidth="1.5" markerEnd="url(#arr)"/>
            <line x1="280" y1="145" x2="480" y2="150" stroke="rgba(230,80,50,0.4)"  strokeWidth="1.5" markerEnd="url(#arr)" strokeDasharray="5,3"/>
            <text x="148" y="168" fontSize="8" fill="rgba(74,144,217,0.7)" fontWeight="600">replicate</text>
            <text x="330" y="145" fontSize="8" fill="rgba(230,80,50,0.5)" fontWeight="600">lagging &gt;10 s</text>
          </Diagram>
          <p className="text-[0.75rem] text-muted text-center -mt-1 mb-4">
            Fig 3 — ISR: Broker 2 is in-sync (LEO within 10 s lag). Broker 3 has fallen behind and is removed from ISR.
            Consumers can only read up to the High Watermark (HW = lowest LEO across all ISR).
          </p>

          <DataTable
            headers={['acks value', 'Durability', 'Latency', 'When to use']}
            rows={[
              ['0',   'None — fire and forget',   'Lowest (~0.1 ms)', 'Telemetry / metrics where loss is acceptable'],
              ['1',   'Leader only (default)',     'Low (~1 ms)',      'Never use — leader crash loses the message silently'],
              ['all', 'All ISR replicas',          '~3–10 ms',         'Always in production — no data loss on any single broker failure'],
            ]}
          />
        </SubSection>

        <SubSection title="6.3 Unclean Leader Election">
          <p>
            When a leader crashes and <em>all ISR replicas are also unavailable</em>,
            Kafka must choose: elect a lagging out-of-ISR replica (possible data loss)
            or wait indefinitely for an ISR replica to come back (downtime).
          </p>
          <DataTable
            headers={['Setting', 'Availability', 'Durability', 'Use for']}
            rows={[
              ['unclean.leader.election.enable=true',  'High — partition stays available', 'Lower — may lose committed records', 'IoT telemetry, click events (loss OK)'],
              ['unclean.leader.election.enable=false',  'Lower — may be offline until ISR recovers', 'High — no committed records ever lost', 'Financial, orders, any business-critical data'],
            ]}
          />
          <Callout variant="pitfall" label="Production Incident: Double Charges">
            A payments team enabled <code>unclean.leader.election.enable=true</code>
            to minimise downtime. During a 3-broker outage an out-of-ISR replica was elected —
            it was 2 minutes behind the crashed leader.
            Those 2 minutes of payment events were re-ingested from the stale leader,
            causing double charges for thousands of users.
            Always use <code>false</code> for any financial or order data.
          </Callout>
        </SubSection>

        <SubSection title="6.4 min.insync.replicas">
          <p>
            <code>min.insync.replicas</code> (default 1) is the minimum number of ISR replicas
            that must acknowledge a write when <code>acks=all</code>.
            It prevents the dangerous scenario where ISR shrinks to just the leader.
          </p>
          <CodeBlock description="Recommended production replication config" language="Bash">
{`# Create a payments topic with 3 replicas; require at least 2 ISR acks
kafka-topics.sh --bootstrap-server kafka:9092 \
  --create --topic payments \
  --partitions 12 \
  --replication-factor 3 \
  --config min.insync.replicas=2

# What this means in practice:
#  • 0 brokers down  → 3 ISR available → writes OK
#  • 1 broker down   → 2 ISR available → writes OK  (tolerates 1 failure)
#  • 2 brokers down  → 1 ISR available → writes BLOCKED  (NotEnoughReplicasException)
#
# Cluster "goes read-only" rather than risk silent data loss.
# This is always the right trade-off for critical data.`}
          </CodeBlock>
          <Callout variant="note" label="Key Takeaways — Section 6">
            <ul>
              <li>ISR = replicas within <code>replica.lag.time.max.ms</code> (10 s) of the leader's LEO</li>
              <li>Consumers only read up to the High Watermark — the lowest LEO across all ISR members</li>
              <li>Use <code>acks=all + min.insync.replicas=2 + replication-factor=3</code> as production baseline</li>
              <li>Never enable unclean leader election for financial, order, or inventory data</li>
            </ul>
          </Callout>
        </SubSection>
      </Section>

      <Divider />

      <Section title="7 — Delivery Semantics">
        <SubSection title="7.1 At-Most-Once, At-Least-Once, Exactly-Once">
          <DataTable
            headers={['Semantic', 'Producer config', 'Consumer config', 'Risk', 'Use case']}
            rows={[
              ['At-most-once',  'acks=0, retries=0',               'Auto-commit before processing', 'Message loss',  'Metrics, logs — loss acceptable'],
              ['At-least-once', 'acks=all, retries=MAX',            'Manual commit after processing', 'Duplicates',  'Most production workloads with idempotent consumers'],
              ['Exactly-once',  'idempotence=true + transactional', 'isolation.level=read_committed', 'Higher latency','Financial, counters — no duplicates tolerated'],
            ]}
          />
        </SubSection>

        <SubSection title="7.2 Transactions API">
          <p>
            Kafka transactions atomically write to multiple partitions and topics.
            Either all writes are committed and visible, or none are.
            This is the foundation of exactly-once stream processing in Kafka Streams.
          </p>
          <CodeBlock description="Consume-transform-produce pipeline with exactly-once semantics" language="Java">
{`// Producer configured for exactly-once
props.put("transactional.id",   "etl-pipeline-txn-" + partitionId);
props.put("enable.idempotence", "true");

KafkaProducer<String, String> producer = new KafkaProducer<>(props);
producer.initTransactions();

// Consumer configured to only read committed records
consumerProps.put("isolation.level", "read_committed");
KafkaConsumer<String, String> consumer = new KafkaConsumer<>(consumerProps);

while (true) {
  ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));

  producer.beginTransaction();
  try {
    for (ConsumerRecord<String, String> r : records) {
      String transformed = transform(r.value());
      producer.send(new ProducerRecord<>("output-topic", r.key(), transformed));
    }

    // Commit consumer offsets atomically WITH the produced records
    // Either the offset commit AND the output records are visible, or neither
    producer.sendOffsetsToTransaction(
      currentOffsets(records), consumer.groupMetadata());

    producer.commitTransaction();

  } catch (KafkaException e) {
    producer.abortTransaction(); // consumers never see the partial output
  }
}`}
          </CodeBlock>
          <Callout variant="note" label="Key Takeaways — Section 7">
            <ul>
              <li>Exactly-once requires: idempotent producer + transactions + <code>read_committed</code> consumer</li>
              <li>Exactly-once adds ~3× latency overhead — use at-least-once + idempotent consumers where possible</li>
              <li>Kafka Streams uses exactly-once internally: set <code>processing.guarantee=exactly_once_v2</code></li>
              <li><code>sendOffsetsToTransaction</code> is the key call — it binds input offsets to the output transaction</li>
            </ul>
          </Callout>
        </SubSection>
      </Section>
    </div>
  )
}

/* ─────────────────────────────────────────────
   PART 4 — Kafka Streams
───────────────────────────────────────────── */
function Part4() {
  return (
    <div className="gc">
      <PartHeader
        label="Part 4"
        title="Kafka Streams"
        subtitle="Stream processing as a library — topologies, stateful aggregations, joins, and interactive queries"
      />

      <Section title="8 — Streams Architecture">
        <SubSection title="8.1 Stream Processing Topology">
          <p>
            A Kafka Streams application is a DAG of processors.
            <strong> Source processors</strong> read from input topics,
            <strong> stream processors</strong> transform or aggregate,
            <strong> sink processors</strong> write to output topics.
            This DAG is your <strong>topology</strong>.
          </p>
          <Callout variant="info" label="No Cluster Required">
            Kafka Streams is a <strong>library</strong>, not a cluster.
            Embed it in any Java/Kotlin service. Each running instance automatically receives
            a share of input partitions. Scale by starting more JVM processes —
            no Flink/Spark cluster to operate.
          </Callout>
          <CodeBlock description="Word-count topology — the 'Hello World' of stream processing" language="Java">
{`StreamsBuilder builder = new StreamsBuilder();

// Source: read raw text lines from "text-input" topic
KStream<String, String> textLines = builder.stream("text-input");

KTable<String, Long> wordCounts = textLines
  .flatMapValues(line ->                         // split each line into words
      Arrays.asList(line.toLowerCase().split("\\W+")))
  .groupBy((key, word) -> word)                  // rekey by the word itself
  .count(Materialized.as("word-count-store"));   // stateful count in RocksDB

// Sink: write live word counts back to Kafka
wordCounts.toStream()
  .to("word-counts", Produced.with(Serdes.String(), Serdes.Long()));

// Build topology and start
KafkaStreams streams = new KafkaStreams(builder.build(), props);
streams.start();
Runtime.getRuntime().addShutdownHook(new Thread(streams::close));`}
          </CodeBlock>
        </SubSection>

        <SubSection title="8.2 KStream vs KTable vs GlobalKTable">
          <DataTable
            headers={['Abstraction', 'What it represents', 'When to use', 'Backed by']}
            rows={[
              ['KStream',      'Infinite event stream — each record is a new event',   'Click events, transactions, logs',            'None (stateless unless aggregated)'],
              ['KTable',       'Changelog — each record UPSERTS a key\'s current value', 'User profiles, product catalog, aggregations', 'Local RocksDB per partition'],
              ['GlobalKTable', 'KTable broadcast to ALL instances',                    'Small reference/lookup tables',               'Full copy per instance'],
            ]}
          />
          <Callout variant="info" label="KTable Mental Model">
            Think of a KTable as a database table backed by a Kafka topic.
            Receiving record (key="alice", value="premium") upserts Alice's row.
            Receiving (key="alice", value=null) deletes it.
            The KTable always reflects the <em>current state</em>, not the full history.
          </Callout>
        </SubSection>

        <SubSection title="8.3 Stateless Transformations">
          <CodeBlock description="Common stateless KStream operations" language="Java">
{`KStream<String, Order> orders = builder.stream("raw-orders");

// filter — keep only high-value orders (> ₹10,000)
KStream<String, Order> highValue = orders
  .filter((key, order) -> order.getTotal() > 10_000.0);

// mapValues — transform the value without changing the key
KStream<String, OrderSummary> summaries = orders
  .mapValues(order -> new OrderSummary(order.getId(), order.getTotal()));

// flatMapValues — one record → many records (explode)
KStream<String, LineItem> lineItems = orders
  .flatMapValues(order -> order.getLineItems());

// split — route records to different sub-streams
Map<String, KStream<String, Order>> branches = orders.split(Named.as("region-"))
  .branch((k, v) -> "IN".equals(v.getRegion()), Branched.as("india"))
  .branch((k, v) -> "US".equals(v.getRegion()), Branched.as("us"))
  .defaultBranch(Branched.as("rest"));`}
          </CodeBlock>
        </SubSection>

        <SubSection title="8.4 Stateful: aggregate, reduce, count">
          <CodeBlock description="Revenue aggregation per product category with interactive query" language="Java">
{`KStream<String, Order> orders = builder.stream("orders");

KTable<String, Double> revenueByCategory = orders
  .selectKey((k, order) -> order.getCategory())  // rekey by category
  .groupByKey()
  .aggregate(
    () -> 0.0,                                    // initializer
    (category, order, runningTotal) ->            // aggregator
        runningTotal + order.getTotal(),
    Materialized
      .<String, Double, KeyValueStore<Bytes, byte[]>>as("revenue-store")
      .withValueSerde(Serdes.Double())
  );

// Interactive query — read state store via REST, sub-ms latency
ReadOnlyKeyValueStore<String, Double> store = streams.store(
  StoreQueryParameters.fromNameAndType("revenue-store",
    QueryableStoreTypes.keyValueStore()));

double electronicRevenue = store.get("electronics"); // no Kafka round-trip needed`}
          </CodeBlock>
          <Callout variant="note" label="Key Takeaways — Section 8">
            <ul>
              <li>Kafka Streams is a library — run multiple instances for horizontal scale, no extra cluster</li>
              <li>State lives in local RocksDB instances backed by Kafka changelog topics — fault tolerant</li>
              <li>Use KTable for current state (latest value per key); KStream for the event history</li>
              <li>Interactive queries expose state store data via REST — no separate database needed</li>
            </ul>
          </Callout>
        </SubSection>
      </Section>

      <Divider />

      <Section title="9 — Windows & Joins">
        <SubSection title="9.1 Tumbling, Hopping, Session Windows">
          <DataTable
            headers={['Window type', 'Size', 'Overlap?', 'Example', 'Use case']}
            rows={[
              ['Tumbling',  'Fixed',  'No',       '1-min windows: [0:00,1:00), [1:00,2:00)', 'Per-minute metrics, hourly billing'],
              ['Hopping',   'Fixed',  'Yes',       'Size=5 min, advance=1 min',              'Rolling averages, sliding reports'],
              ['Session',   'Variable','No (gap-based)','30-min inactivity closes window',   'User sessions, click-stream analysis'],
              ['Sliding',   'Fixed',  'Yes (every event)','Always covers last N ms',          'Fraud detection, anomaly detection'],
            ]}
          />
          <CodeBlock description="Tumbling window — order count per minute per category" language="Java">
{`KStream<String, Order> orders = builder.stream("orders");

KTable<Windowed<String>, Long> perMinute = orders
  .selectKey((k, v) -> v.getCategory())                    // rekey by category
  .groupByKey()
  .windowedBy(                                             // 1-minute tumbling window
      TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(1)))
  .count();

perMinute.toStream()
  .map((wKey, count) -> KeyValue.pair(
      wKey.key() + "@" + wKey.window().startTime(),        // "electronics@2024-01-15T10:00:00Z"
      count
  ))
  .to("order-counts-per-minute");`}
          </CodeBlock>
        </SubSection>

        <SubSection title="9.2 Stream-Stream Joins">
          <CodeBlock description="Match payment events to their originating order within 5 minutes" language="Java">
{`KStream<String, Order>   orders   = builder.stream("orders");   // keyed by orderId
KStream<String, Payment> payments = builder.stream("payments"); // keyed by orderId

KStream<String, OrderWithPayment> enriched = orders.join(
  payments,
  (order, payment) -> new OrderWithPayment(order, payment), // value joiner function
  JoinWindows.ofTimeDifferenceWithNoGrace(Duration.ofMinutes(5))
  // records outside the 5-min window are dropped
);

enriched.to("enriched-orders");`}
          </CodeBlock>
        </SubSection>

        <SubSection title="9.3 Stream-Table Joins and Interactive Queries">
          <CodeBlock description="Enrich click stream with live user profile (KTable join)" language="Java">
{`KStream<String, Click>       clicks   = builder.stream("clicks");        // keyed by userId
KTable<String, UserProfile>  profiles = builder.table("user-profiles");  // keyed by userId

// For every click, look up the CURRENT user profile — no time window needed
KStream<String, EnrichedClick> enriched = clicks.leftJoin(
  profiles,
  (click, profile) -> {
    if (profile == null) return new EnrichedClick(click, "unknown", "free");
    return new EnrichedClick(click, profile.getName(), profile.getTier());
  }
);
enriched.to("enriched-clicks");`}
          </CodeBlock>
          <Callout variant="note" label="Key Takeaways — Section 9">
            <ul>
              <li>Tumbling: non-overlapping fixed windows — per-minute/hourly metrics</li>
              <li>Hopping: overlapping — rolling averages; Session: activity-based — user journeys</li>
              <li>Stream-stream joins need a time window; stream-table joins use current state (no window)</li>
              <li>Use <code>.withGrace(Duration)</code> to accept late-arriving records; after grace, records are dropped</li>
            </ul>
          </Callout>
        </SubSection>
      </Section>
    </div>
  )
}

/* ─────────────────────────────────────────────
   PART 5 — Schema Registry & Kafka Connect
───────────────────────────────────────────── */
function Part5() {
  return (
    <div className="gc">
      <PartHeader
        label="Part 5"
        title="Schema Registry & Kafka Connect"
        subtitle="Enforce producer-consumer contracts with versioned schemas, and connect Kafka to your entire data ecosystem"
      />

      <Section title="10 — Schema Registry">
        <SubSection title="10.1 Why Schema Evolution Matters">
          <p>
            Without Schema Registry: a producer team adds a required field to an Avro schema,
            deploys, and every consumer crashes at deserialization. At 100 services,
            managing schema changes by hand across teams is unworkable.
          </p>
          <S3 title="How It Works">
            <p>
              Schema Registry is a REST service that stores versioned Avro/Protobuf/JSON schemas.
              Every Kafka record's value starts with a 5-byte header:
              magic byte <code>0x00</code> + 4-byte schema ID.
              Consumers look up the schema by ID and deserialize correctly —
              even if the schema has evolved since the record was written.
            </p>
          </S3>
        </SubSection>

        <SubSection title="10.2 Avro, Protobuf, JSON Schema">
          <DataTable
            headers={['Format', 'Schema language', 'Binary?', 'Schema evolution', 'Best for']}
            rows={[
              ['Avro',        '.avsc (JSON-based)',  'Yes', 'Excellent — default values handle missing fields', 'Kafka native — smallest per-message overhead'],
              ['Protobuf',    '.proto',              'Yes', 'Excellent — field numbers are stable across versions', 'Multi-language systems, gRPC integration'],
              ['JSON Schema', '.json',               'No',  'Good — additive changes are backward compatible',   'REST/HTTP APIs bridged into Kafka, easy debugging'],
            ]}
          />
          <CodeBlock description="Avro schema for an Order event" language="JSON">
{`{
  "type": "record",
  "name": "Order",
  "namespace": "com.enginotes.events",
  "fields": [
    { "name": "order_id",    "type": "string" },
    { "name": "user_id",     "type": "string" },
    { "name": "total",       "type": "double" },
    { "name": "currency",    "type": "string",  "default": "INR" },
    { "name": "created_at",  "type": "long",    "logicalType": "timestamp-millis" },
    { "name": "metadata",    "type": ["null", "string"], "default": null }
  ]
}`}
          </CodeBlock>
        </SubSection>

        <SubSection title="10.3 Compatibility Modes">
          <DataTable
            headers={['Mode', 'Allows', 'Prevents', 'Upgrade order']}
            rows={[
              ['BACKWARD (default)', 'Add optional fields, remove fields',     'Add required fields',            'Upgrade consumers first, then producers'],
              ['FORWARD',            'Remove optional fields, add fields',      'Remove required fields',         'Upgrade producers first, then consumers'],
              ['FULL',               'Add/remove optional fields only',         'Any required field change',      'Any order — strictest mode'],
              ['NONE',               'Any change',                              'Nothing',                        'Development only — never in production'],
            ]}
          />
        </SubSection>

        <SubSection title="10.4 Schema Registry HA Setup">
          <CodeBlock description="Confluent Schema Registry multi-instance config" language="Properties">
{`# Run 3 identical Schema Registry instances pointing to the same Kafka cluster.
# All instances are equal for reads; writes go through the _schemas topic.
listeners=http://0.0.0.0:8081
kafkastore.bootstrap.servers=kafka-1:9092,kafka-2:9092,kafka-3:9092

# Schemas stored in this internal topic (must be replicated 3×)
kafkastore.topic=_schemas
kafkastore.topic.replication.factor=3

# Schema compatibility mode applied to all subjects by default
schema.compatibility.level=BACKWARD`}
          </CodeBlock>
        </SubSection>
      </Section>

      <Divider />

      <Section title="11 — Kafka Connect">
        <SubSection title="11.1 Connect Architecture">
          <p>
            Kafka Connect moves data between Kafka and external systems
            without writing producer or consumer code.
            It runs as a cluster of <strong>worker</strong> processes that execute
            <strong> connector</strong> plugins — each connector splits work into parallel
            <strong> tasks</strong>.
          </p>
          <DataTable
            headers={['Term', 'What it is']}
            rows={[
              ['Worker',    'JVM process — runs one or more connector task threads'],
              ['Connector', 'Configuration unit — defines source/sink + task count'],
              ['Task',      'Actual parallelism unit — one thread reading or writing a shard of data'],
              ['SMT',       'Single Message Transform — lightweight per-record manipulation (filter, rename, route)'],
            ]}
          />
        </SubSection>

        <SubSection title="11.2 Source Connectors: Debezium CDC">
          <p>
            Debezium tails the database transaction log (PostgreSQL WAL, MySQL binlog)
            and emits a Kafka event for every INSERT, UPDATE, DELETE — in order,
            with full before/after state. Zero-impact CDC with no application code changes.
          </p>
          <CodeBlock description="Deploy Debezium PostgreSQL CDC connector" language="JSON">
{`POST /connectors
{
  "name": "pg-orders-cdc",
  "config": {
    "connector.class":       "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname":     "postgres.internal",
    "database.port":         "5432",
    "database.user":         "debezium",
    "database.password":     "\${file:/opt/secrets/db.properties:password}",
    "database.dbname":       "orderdb",
    "database.server.name":  "orderdb",
    "table.include.list":    "public.orders,public.payments",
    "plugin.name":           "pgoutput",
    "slot.name":             "debezium_slot",
    "topic.prefix":          "cdc",
    "transforms":            "unwrap",
    "transforms.unwrap.type":"io.debezium.transforms.ExtractNewRecordState",
    "transforms.unwrap.drop.tombstones": "false"
  }
}`}
          </CodeBlock>
        </SubSection>

        <SubSection title="11.3 Sink Connectors">
          <DataTable
            headers={['Connector', 'Target', 'Common use case']}
            rows={[
              ['JDBC Sink',          'PostgreSQL, MySQL, Oracle',  'Write Kafka events back into a relational DB'],
              ['Elasticsearch Sink', 'Elasticsearch / OpenSearch', 'Full-text search index from CDC change events'],
              ['S3 Sink',            'AWS S3, MinIO, GCS',         'Data lake ingestion — Parquet / Avro in S3'],
              ['BigQuery Sink',      'Google BigQuery',            'Streaming insert from Kafka for analytics'],
              ['Redis Sink',         'Redis',                      'Low-latency cache warming from Kafka events'],
            ]}
          />
        </SubSection>

        <SubSection title="11.4 Error Handling and Dead Letter Queues">
          <CodeBlock description="Configure a DLQ for any sink connector" language="JSON">
{`{
  "errors.tolerance":                              "all",
  "errors.deadletterqueue.topic.name":             "dlq.orders-sink",
  "errors.deadletterqueue.topic.replication.factor": "3",
  "errors.deadletterqueue.context.headers.enable": "true",
  "errors.log.enable":                             "true",
  "errors.log.include.messages":                   "true"
}
// errors.tolerance=all  → continue on error (vs "none" = fail-fast)
// context.headers.enable → attach error cause, stack trace as Kafka headers
// Always monitor the DLQ topic — silent drops mean lost business events`}
          </CodeBlock>
          <Callout variant="note" label="Key Takeaways — Sections 10–11">
            <ul>
              <li>Always use BACKWARD compatibility — deploy consumers before producers on schema changes</li>
              <li>Debezium CDC captures every DB change in-order with full before/after payload</li>
              <li>Always configure a DLQ — silent message drops in a sink are unacceptable in production</li>
              <li>Scale Connect workers horizontally — tasks are auto-distributed across the worker cluster</li>
            </ul>
          </Callout>
        </SubSection>
      </Section>
    </div>
  )
}

/* ─────────────────────────────────────────────
   PART 6 — Production Operations & Tuning
───────────────────────────────────────────── */
function Part6() {
  return (
    <div className="gc">
      <PartHeader
        label="Part 6"
        title="Production Operations & Tuning"
        subtitle="JVM and OS configuration, throughput tuning, Prometheus monitoring, and the operations runbook"
      />

      <Section title="12 — Performance Tuning">
        <SubSection title="12.1 Tuning Impact Hierarchy">
          <p>Don't tune everything. The impact hierarchy — work top to bottom:</p>
          <ol className="list-decimal pl-5 space-y-1.5 text-sm text-navy2 mb-4">
            <li><strong>Partition count</strong> — sets the ceiling for parallelism; get this right at creation</li>
            <li><strong>Compression</strong> — reduces network + disk I/O by 2–5×; near-zero CPU cost with lz4</li>
            <li><strong>batch.size + linger.ms</strong> — reduces syscalls and TCP overhead by 3–10×</li>
            <li><strong>fetch.min.bytes + fetch.max.wait.ms</strong> — reduces consumer polling overhead</li>
            <li><strong>OS page cache</strong> — keep heap small (6 GB), give the rest to the OS</li>
            <li><strong>Network + I/O threads</strong> — only a bottleneck in truly CPU-bound scenarios</li>
          </ol>
        </SubSection>

        <SubSection title="12.2 Producer Throughput Tuning">
          <DataTable
            headers={['Config', 'Default', 'High Throughput', 'Why']}
            rows={[
              ['batch.size',        '16,384',      '131,072–262,144', 'Larger batches per network flush'],
              ['linger.ms',         '0',           '10–20',           'Wait to fill the batch before sending'],
              ['compression.type',  'none',        'lz4',             '2–3× less data on the wire + less disk'],
              ['buffer.memory',     '33,554,432',  '134,217,728',     'More buffer = less back-pressure blocking'],
              ['acks',              '1',           'all',             'Durability — never use acks=1 in prod'],
            ]}
          />
        </SubSection>

        <SubSection title="12.3 Consumer Throughput Tuning">
          <DataTable
            headers={['Config', 'Default', 'High Throughput', 'Why']}
            rows={[
              ['fetch.min.bytes',      '1',      '65,536',     'Server waits for 64 KB before responding — fewer poll RTTs'],
              ['fetch.max.wait.ms',    '500',    '500',        'Max server wait for fetch.min.bytes'],
              ['max.poll.records',     '500',    '2,000–5,000','More records per poll = less overhead per record'],
              ['receive.buffer.bytes', '65,536', '131,072',    'Larger TCP receive buffer for high-throughput brokers'],
            ]}
          />
        </SubSection>

        <SubSection title="12.4 Broker OS and JVM Tuning">
          <Callout variant="pitfall" label="The Heap Size Trap">
            Engineers instinctively give Kafka a large heap (32 GB on a 32 GB host).
            This is <strong>wrong</strong>.
            Kafka uses the OS page cache for reads — a larger page cache means fewer disk reads.
            A <strong>6 GB heap on a 32 GB host</strong> leaves 26 GB for page cache.
            Setting heap to 28 GB leaves only 4 GB — read latency jumps from 0.1 ms to 10+ ms.
          </Callout>
          <CodeBlock description="JVM flags for Kafka broker (set in kafka-server-start.sh)" language="Bash">
{`export KAFKA_HEAP_OPTS="-Xms6g -Xmx6g"  # fixed size prevents GC pressure spikes

export KAFKA_JVM_PERFORMANCE_OPTS="
  -server
  -XX:+UseG1GC                          # G1 GC — predictable pause times
  -XX:MaxGCPauseMillis=20               # target: max 20 ms GC pause
  -XX:InitiatingHeapOccupancyPercent=35 # start G1 concurrent GC at 35% heap
  -XX:+ExplicitGCInvokesConcurrent      # System.gc() uses concurrent GC
  -Djava.awt.headless=true"`}
          </CodeBlock>
          <CodeBlock description="Critical OS kernel settings for Kafka brokers" language="Bash">
{`# Allow more dirty pages before flushing to disk
sysctl -w vm.dirty_background_ratio=5
sysctl -w vm.dirty_ratio=60

# NEVER let Kafka swap — swap causes 30 s+ GC pauses
sysctl -w vm.swappiness=1

# Increase file descriptor limits (each partition = 3 file descriptors)
echo "kafka soft nofile 100000" >> /etc/security/limits.conf
echo "kafka hard nofile 100000" >> /etc/security/limits.conf

# Use deadline scheduler for SSDs (not cfq)
echo "deadline" > /sys/block/sda/queue/scheduler`}
          </CodeBlock>
        </SubSection>
      </Section>

      <Divider />

      <Section title="13 — Monitoring & Observability">
        <SubSection title="13.1 Key JMX Metrics">
          <DataTable
            headers={['Metric', 'Healthy value', 'Alert if', 'Severity']}
            rows={[
              ['ActiveControllerCount',         '1',     '≠ 1',     'CRITICAL'],
              ['UnderReplicatedPartitions',      '0',     '> 0',     'CRITICAL'],
              ['UnderMinIsrPartitionCount',      '0',     '> 0',     'CRITICAL'],
              ['OfflinePartitionsCount',         '0',     '> 0',     'CRITICAL'],
              ['RequestHandlerAvgIdlePercent',   '> 30%', '< 10%',   'WARNING'],
              ['BytesInPerSec (per broker)',     '< 80% NIC','> 80% NIC','WARNING'],
              ['consumer_group_lag (external)',  '< threshold','growing for 5 m','WARNING/CRITICAL'],
            ]}
          />
        </SubSection>

        <SubSection title="13.2 Prometheus + Grafana Stack">
          <CodeBlock description="Attach JMX Exporter to Kafka broker at startup" language="Bash">
{`# Add to KAFKA_OPTS in kafka-server-start.sh
export KAFKA_OPTS="-javaagent:/opt/jmx-exporter/jmx_prometheus_javaagent.jar=7071:/opt/jmx-exporter/kafka.yml"

# kafka.yml — scrape rules (excerpt)
# Expose under-replicated partitions (P0 alert)
- pattern: 'kafka.controller<type=KafkaController, name=UnderReplicatedPartitions><>Value'
  name: kafka_under_replicated_partitions

# Expose bytes-in rate per broker
- pattern: 'kafka.server<type=BrokerTopicMetrics, name=BytesInPerSec><>OneMinuteRate'
  name: kafka_bytes_in_per_sec`}
          </CodeBlock>
        </SubSection>

        <SubSection title="13.3 Consumer Lag Alerting">
          <CodeBlock description="Prometheus alerting rules for Kafka consumer lag" language="YAML">
{`groups:
  - name: kafka
    rules:
      - alert: KafkaConsumerHighLag
        expr: kafka_consumer_group_lag > 100000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Consumer {{ $labels.group }} lag {{ $value }} on {{ $labels.topic }}"

      - alert: KafkaConsumerLagGrowing
        expr: rate(kafka_consumer_group_lag[10m]) > 1000
        for: 10m
        labels:
          severity: critical
        annotations:
          summary: "Consumer {{ $labels.group }} lag growing at {{ $value }}/min — scaling needed"`}
          </CodeBlock>
        </SubSection>
      </Section>

      <Divider />

      <Section title="14 — Operations Runbook">
        <SubSection title="14.1 Rolling Restart with Zero Downtime">
          <CodeBlock description="Safe rolling restart procedure — one broker at a time" language="Bash">
{`# Step 1 — verify cluster health before touching anything
kafka-topics.sh --bootstrap-server kafka:9092 --describe | grep 'Isr\|Leader'
# All partitions must have full ISR before proceeding

# Step 2 — gracefully shut down one broker (Kafka triggers controlled leadership handoff)
systemctl stop kafka
# Wait for the broker to fully stop (~5-15 s depending on partition count)

# Step 3 — make your change (upgrade JAR, update config, disk maintenance, etc.)

# Step 4 — restart the broker
systemctl start kafka

# Step 5 — wait for full ISR recovery before touching the next broker
watch -n 5 "kafka-topics.sh --bootstrap-server kafka:9092 --describe | grep -c 'under-replicated'"
# Only proceed to the next broker when the count is 0`}
          </CodeBlock>
        </SubSection>

        <SubSection title="14.2 Partition Reassignment">
          <CodeBlock description="Reassign partitions after adding broker 4 to the cluster" language="Bash">
{`# Step 1 — generate a balanced reassignment plan across brokers 1-4
kafka-reassign-partitions.sh \
  --bootstrap-server kafka:9092 \
  --topics-to-move-json-file topics.json \
  --broker-list "1,2,3,4" \
  --generate > reassignment-plan.json

# Step 2 — review the plan, then execute WITH a throttle
# Never reassign without --throttle on a production cluster
kafka-reassign-partitions.sh \
  --bootstrap-server kafka:9092 \
  --reassignment-json-file reassignment-plan.json \
  --execute \
  --throttle 52428800   # 50 MB/s — won't saturate the inter-broker network

# Step 3 — monitor until complete
kafka-reassign-partitions.sh \
  --bootstrap-server kafka:9092 \
  --reassignment-json-file reassignment-plan.json \
  --verify`}
          </CodeBlock>
        </SubSection>

        <SubSection title="14.3 Common Production Failures and Fixes">
          <DataTable
            headers={['Failure', 'Symptom', 'Root cause', 'Fix']}
            rows={[
              ['Consumer rebalance loop',     'Consumers join/leave every 30 s',   'Processing exceeds max.poll.interval.ms',       'Reduce max.poll.records or profile slow processing'],
              ['Disk full on broker',         'Broker stops accepting writes',      'Retention not configured; compaction stalled',  'Delete old segments; reduce retention; check log.cleaner threads'],
              ['NotEnoughReplicasException',  'Producer write errors',              'ISR fell below min.insync.replicas',            'Restore failed brokers; temporarily reduce min.insync.replicas'],
              ['Duplicates in consumer',      'Business logic sees double records', 'enable.idempotence not set; retry storms',      'Set enable.idempotence=true; use transactional producers'],
              ['Network partition',           'UnderReplicatedPartitions > 0',      'Network issue between broker racks',            'Fix network; never enable unclean.leader.election to compensate'],
            ]}
          />
          <Callout variant="note" label="Key Takeaways — Sections 12–14">
            <ul>
              <li>Keep broker heap at 6 GB — give the remaining RAM to the OS page cache</li>
              <li>Your two critical alerts: <code>UnderReplicatedPartitions &gt; 0</code> and <code>ActiveControllerCount ≠ 1</code></li>
              <li>Always use <code>--throttle</code> during partition reassignment — unthrottled reassignment has crashed prod clusters</li>
              <li>Rolling restarts: wait for full ISR recovery between each broker — never rush this</li>
              <li>Consumer rebalance loops are almost always slow processing — profile before tuning timeouts</li>
            </ul>
          </Callout>
        </SubSection>
      </Section>
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════ */
const PARTS = [Part1, Part2, Part3, Part4, Part5, Part6]

export default function Kafka({ part = 0 }) {
  const ActivePart = PARTS[part] ?? PARTS[0]
  return (
    <>
      {part === 0 && (
        <Cover
          title="Apache Kafka"
          subtitle="Distributed Event Streaming at Scale"
          tagline="From first principles to production mastery — topics, partitions, replication, consumer groups, Kafka Streams, Schema Registry, and operations"
          color="#4A90D9"
          icon="⚡"
          parts={6}
          sections={14}
          level="Intermediate"
        />
      )}
      <ActivePart />
    </>
  )
}
