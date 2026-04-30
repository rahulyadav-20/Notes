/**
 * Kafka note — Part 0 (shown as "Part 1") written at production depth.
 * Standard: ~5 subsections per section, 3-4 paragraphs each,
 * flat SVG diagrams on #F8F9FA, callouts, code, tables.
 * Parts 1-5 follow the same pattern (written on request).
 *
 * Block types: ph, section, ss, s3, p, ul, ol, callout, code, table, rawsvg, diagram, divider
 */

// ── SVG helper strings ─────────────────────────────────────────────────────
const SVG = {

  kafkaVsTraditional: `<svg viewBox="0 0 860 420" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,sans-serif">
  <defs><marker id="ah" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#555"/></marker></defs>
  <rect width="860" height="420" rx="12" fill="#F8F9FA"/>
  <text x="430" y="30" text-anchor="middle" font-size="16" font-weight="700" fill="#0f0f23">Traditional Queue vs Apache Kafka — Core Architectural Difference</text>

  <!-- Traditional Queue (left) -->
  <rect x="20" y="50" width="390" height="350" rx="10" fill="#fff" stroke="#E74C3C" stroke-width="2"/>
  <text x="215" y="78" text-anchor="middle" font-size="13" font-weight="700" fill="#E74C3C">Traditional Message Queue (RabbitMQ)</text>

  <!-- Producer -->
  <rect x="40" y="100" width="90" height="40" rx="6" fill="#fde0d0" stroke="#E74C3C"/>
  <text x="85" y="124" text-anchor="middle" font-size="10" font-weight="600">Producer</text>

  <!-- Queue box -->
  <rect x="155" y="90" width="110" height="60" rx="6" fill="#E74C3C"/>
  <text x="210" y="117" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Message Queue</text>
  <text x="210" y="134" text-anchor="middle" fill="#ffcccc" font-size="9">deleted after ACK</text>

  <!-- Single consumer -->
  <rect x="295" y="100" width="90" height="40" rx="6" fill="#fde0d0" stroke="#E74C3C"/>
  <text x="340" y="124" text-anchor="middle" font-size="10" font-weight="600">Consumer A</text>

  <!-- Arrow -->
  <line x1="130" y1="120" x2="155" y2="120" stroke="#555" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="265" y1="120" x2="295" y2="120" stroke="#555" stroke-width="1.5" marker-end="url(#ah)"/>

  <!-- Problem annotation -->
  <text x="210" y="180" text-anchor="middle" font-size="10" fill="#E74C3C" font-weight="600">⚠ Consumer B wants same data?</text>
  <text x="210" y="197" text-anchor="middle" font-size="10" fill="#666">Must duplicate the queue</text>
  <rect x="155" y="215" width="110" height="50" rx="6" fill="#E74C3C" opacity=".7"/>
  <text x="210" y="237" text-anchor="middle" fill="#fff" font-size="10">Duplicate Queue</text>
  <text x="210" y="254" text-anchor="middle" fill="#ffcccc" font-size="9">separate write needed</text>
  <rect x="295" y="220" width="90" height="35" rx="6" fill="#fde0d0" stroke="#E74C3C"/>
  <text x="340" y="242" text-anchor="middle" font-size="10" font-weight="600">Consumer B</text>
  <line x1="265" y1="240" x2="295" y2="240" stroke="#555" stroke-width="1.5" stroke-dasharray="4,2" marker-end="url(#ah)"/>

  <text x="215" y="300" text-anchor="middle" font-size="10" fill="#666">✗ No replay — data gone after ACK</text>
  <text x="215" y="318" text-anchor="middle" font-size="10" fill="#666">✗ Coupling — each consumer needs own queue</text>
  <text x="215" y="336" text-anchor="middle" font-size="10" fill="#666">✗ Throughput: ~50K msg/s ceiling</text>
  <text x="215" y="378" text-anchor="middle" font-size="9" fill="#888" font-style="italic">RabbitMQ, ActiveMQ, SQS</text>

  <!-- Kafka (right) -->
  <rect x="450" y="50" width="390" height="350" rx="10" fill="#fff" stroke="#5DB85B" stroke-width="2"/>
  <text x="645" y="78" text-anchor="middle" font-size="13" font-weight="700" fill="#5DB85B">Apache Kafka — Distributed Commit Log</text>

  <!-- Producer -->
  <rect x="470" y="100" width="90" height="40" rx="6" fill="#d4f5d4" stroke="#5DB85B"/>
  <text x="515" y="124" text-anchor="middle" font-size="10" font-weight="600">Producer</text>

  <!-- Kafka log -->
  <rect x="580" y="85" width="160" height="70" rx="6" fill="#5DB85B"/>
  <text x="660" y="110" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Kafka Topic Partition</text>
  <text x="660" y="128" text-anchor="middle" fill="#d4f5d4" font-size="9">append-only log — retained 7 days</text>
  <text x="660" y="145" text-anchor="middle" fill="#d4f5d4" font-size="9">offset: 0 1 2 3 4 5 6 …</text>

  <line x1="560" y1="120" x2="580" y2="120" stroke="#555" stroke-width="1.5" marker-end="url(#ah)"/>

  <!-- Multiple consumers with own offsets -->
  <rect x="775" y="93" width="55" height="30" rx="4" fill="#d4f5d4" stroke="#5DB85B"/>
  <text x="802" y="112" text-anchor="middle" font-size="9" font-weight="600">Group A</text>
  <text x="802" y="124" text-anchor="middle" font-size="8" fill="#5DB85B">offset=6</text>

  <rect x="775" y="133" width="55" height="30" rx="4" fill="#d4f5d4" stroke="#5DB85B"/>
  <text x="802" y="152" text-anchor="middle" font-size="9" font-weight="600">Group B</text>
  <text x="802" y="164" text-anchor="middle" font-size="8" fill="#5DB85B">offset=3</text>

  <line x1="740" y1="108" x2="775" y2="108" stroke="#555" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="740" y1="148" x2="775" y2="148" stroke="#555" stroke-width="1.5" marker-end="url(#ah)"/>

  <text x="645" y="195" text-anchor="middle" font-size="9" fill="#5DB85B" font-weight="600">Each group reads independently at its own offset</text>

  <text x="645" y="225" text-anchor="middle" font-size="10" fill="#5DB85B" font-weight="600">✓ Unlimited fan-out — any number of consumers</text>
  <text x="645" y="243" text-anchor="middle" font-size="10" fill="#5DB85B" font-weight="600">✓ Replay — seek to offset 0 and re-read</text>
  <text x="645" y="261" text-anchor="middle" font-size="10" fill="#5DB85B" font-weight="600">✓ 1–2 M msg/s per broker</text>
  <text x="645" y="279" text-anchor="middle" font-size="10" fill="#666">✓ Decoupled — producers don't know consumers</text>
  <text x="645" y="378" text-anchor="middle" font-size="9" fill="#888" font-style="italic">Apache Kafka, Apache Pulsar, Redpanda</text>
</svg>`,

  commitLog: `<svg viewBox="0 0 860 340" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,sans-serif">
  <defs><marker id="ah" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#555"/></marker></defs>
  <rect width="860" height="340" rx="12" fill="#F8F9FA"/>
  <text x="430" y="28" text-anchor="middle" font-size="16" font-weight="700" fill="#0f0f23">Kafka Commit Log — Immutable Append-Only Structure</text>

  <!-- Log cells -->
  <text x="40" y="75" font-size="11" font-weight="700" fill="#333">Topic: orders  /  Partition 0</text>
  <text x="40" y="92" font-size="10" fill="#888">← older records                                                    newer records →</text>

  ${[0,1,2,3,4,5,6,7,8,9].map((i) => {
    const x = 40 + i * 78
    const colors = ['#d4f5d4','#d4f5d4','#d4f5d4','#cce5ff','#cce5ff','#cce5ff','#fff3cd','#fff3cd','#fde0d0','#fde0d0']
    const labels = ['order\\ncreated','payment\\npending','payment\\nok','item\\npicked','item\\nshipped','delivered','review\\nrequest','review\\nreceived','refund\\nrequest','refund\\nok']
    return `<g>
      <rect x="${x}" y="105" width="70" height="70" rx="6" fill="${colors[i]}" stroke="#ccc" stroke-width="1"/>
      <text x="${x+35}" y="126" text-anchor="middle" font-size="9" fill="#333" font-weight="700">offset ${i}</text>
      <text x="${x+35}" y="145" text-anchor="middle" font-size="8" fill="#555">${labels[i].split('\\n')[0]}</text>
      <text x="${x+35}" y="158" text-anchor="middle" font-size="8" fill="#555">${labels[i].split('\\n')[1] || ''}</text>
    </g>`
  }).join('')}

  <!-- Append arrow -->
  <line x1="820" y1="140" x2="845" y2="140" stroke="#5DB85B" stroke-width="2" marker-end="url(#ah)"/>
  <text x="840" y="160" font-size="9" fill="#5DB85B" font-weight="600">append</text>
  <text x="835" y="173" font-size="8" fill="#5DB85B">only</text>

  <!-- Consumer A offset pointer -->
  <line x1="431" y1="175" x2="431" y2="205" stroke="#4A90D9" stroke-width="2" marker-end="url(#ah)"/>
  <rect x="370" y="210" width="120" height="28" rx="5" fill="#4A90D9"/>
  <text x="430" y="228" text-anchor="middle" fill="#fff" font-size="10" font-weight="600">Group A  offset=5</text>

  <!-- Consumer B offset pointer -->
  <line x1="275" y1="175" x2="275" y2="255" stroke="#9B59B6" stroke-width="2" marker-end="url(#ah)"/>
  <rect x="214" y="260" width="120" height="28" rx="5" fill="#9B59B6"/>
  <text x="274" y="278" text-anchor="middle" fill="#fff" font-size="10" font-weight="600">Group B  offset=3</text>

  <!-- Replay annotation -->
  <rect x="40" y="260" width="140" height="50" rx="6" fill="#fff3cd" stroke="#F5A623" stroke-width="1.5"/>
  <text x="110" y="280" text-anchor="middle" font-size="10" font-weight="600" fill="#856404">Replay: seek to 0</text>
  <text x="110" y="297" text-anchor="middle" font-size="9" fill="#856404">re-read all history</text>

  <!-- Retention annotation -->
  <rect x="650" y="260" width="190" height="50" rx="6" fill="#d4f5d4" stroke="#5DB85B" stroke-width="1.5"/>
  <text x="745" y="278" text-anchor="middle" font-size="10" font-weight="600" fill="#1a5c1a">Retention: 7 days default</text>
  <text x="745" y="296" text-anchor="middle" font-size="9" fill="#1a5c1a">or size-based (e.g. 100 GB)</text>
</svg>`,

  clusterArchitecture: `<svg viewBox="0 0 860 480" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,sans-serif">
  <defs>
    <marker id="ah" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#555"/></marker>
    <filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity=".1"/></filter>
  </defs>
  <rect width="860" height="480" rx="12" fill="#F8F9FA"/>
  <text x="430" y="28" text-anchor="middle" font-size="16" font-weight="700" fill="#0f0f23">Kafka Cluster Architecture — Full Component View</text>

  <!-- Producers -->
  <rect x="20" y="60" width="100" height="40" rx="6" fill="#d4f5d4" stroke="#5DB85B" filter="url(#sh)"/>
  <text x="70" y="84" text-anchor="middle" font-size="10" font-weight="700">Producer App</text>
  <rect x="20" y="115" width="100" height="40" rx="6" fill="#d4f5d4" stroke="#5DB85B" filter="url(#sh)"/>
  <text x="70" y="139" text-anchor="middle" font-size="10" font-weight="700">Microservice</text>
  <rect x="20" y="170" width="100" height="40" rx="6" fill="#d4f5d4" stroke="#5DB85B" filter="url(#sh)"/>
  <text x="70" y="194" text-anchor="middle" font-size="10" font-weight="700">CDC / Debezium</text>

  <!-- Arrows to brokers -->
  <line x1="120" y1="80" x2="200" y2="120" stroke="#555" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="120" y1="135" x2="200" y2="180" stroke="#555" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="120" y1="190" x2="200" y2="240" stroke="#555" stroke-width="1.5" marker-end="url(#ah)"/>

  <!-- Brokers -->
  <rect x="200" y="60" width="160" height="90" rx="8" fill="#4A90D9" stroke="#3570a8" stroke-width="2" filter="url(#sh)"/>
  <text x="280" y="88" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">Broker 1</text>
  <text x="280" y="106" text-anchor="middle" fill="#d0e4ff" font-size="10">Leader: P0,P1,P3</text>
  <text x="280" y="122" text-anchor="middle" fill="#d0e4ff" font-size="10">Follower: P2,P4</text>
  <text x="280" y="140" text-anchor="middle" fill="#d0e4ff" font-size="9">port 9092  ID=1</text>

  <rect x="200" y="175" width="160" height="90" rx="8" fill="#4A90D9" stroke="#3570a8" stroke-width="2" filter="url(#sh)"/>
  <text x="280" y="203" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">Broker 2</text>
  <text x="280" y="221" text-anchor="middle" fill="#d0e4ff" font-size="10">Leader: P2,P4</text>
  <text x="280" y="237" text-anchor="middle" fill="#d0e4ff" font-size="10">Follower: P0,P1</text>
  <text x="280" y="255" text-anchor="middle" fill="#d0e4ff" font-size="9">port 9092  ID=2</text>

  <rect x="200" y="290" width="160" height="90" rx="8" fill="#4A90D9" stroke="#3570a8" stroke-width="2" filter="url(#sh)"/>
  <text x="280" y="318" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">Broker 3</text>
  <text x="280" y="336" text-anchor="middle" fill="#d0e4ff" font-size="10">Leader: —</text>
  <text x="280" y="352" text-anchor="middle" fill="#d0e4ff" font-size="10">Follower: P3,P4</text>
  <text x="280" y="368" text-anchor="middle" fill="#d0e4ff" font-size="9">port 9092  ID=3</text>

  <!-- KRaft controller box -->
  <rect x="200" y="410" width="160" height="55" rx="8" fill="#9B59B6" stroke="#7d3f9b" stroke-width="2" filter="url(#sh)"/>
  <text x="280" y="434" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">KRaft Controller</text>
  <text x="280" y="452" text-anchor="middle" fill="#e8d0f5" font-size="9">Raft quorum (3 nodes)  port 9093</text>
  <line x1="280" y1="380" x2="280" y2="410" stroke="#9B59B6" stroke-width="1.5" stroke-dasharray="4,2" marker-end="url(#ah)"/>

  <!-- Replication arrows between brokers -->
  <line x1="360" y1="120" x2="400" y2="190" stroke="#F5A623" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#ah)"/>
  <line x1="360" y1="230" x2="400" y2="320" stroke="#F5A623" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#ah)"/>
  <text x="390" y="170" font-size="9" fill="#F5A623" font-weight="600">ISR replication</text>

  <!-- Consumers -->
  <rect x="580" y="60" width="110" height="40" rx="6" fill="#fde0d0" stroke="#E25A1C" filter="url(#sh)"/>
  <text x="635" y="79" text-anchor="middle" font-size="9" font-weight="700">Consumer Group A</text>
  <text x="635" y="93" text-anchor="middle" font-size="8" fill="#888">analytics service</text>

  <rect x="580" y="120" width="110" height="40" rx="6" fill="#fde0d0" stroke="#E25A1C" filter="url(#sh)"/>
  <text x="635" y="139" text-anchor="middle" font-size="9" font-weight="700">Consumer Group B</text>
  <text x="635" y="153" text-anchor="middle" font-size="8" fill="#888">notification svc</text>

  <rect x="580" y="180" width="110" height="40" rx="6" fill="#fde0d0" stroke="#E25A1C" filter="url(#sh)"/>
  <text x="635" y="199" text-anchor="middle" font-size="9" font-weight="700">Kafka Streams</text>
  <text x="635" y="213" text-anchor="middle" font-size="8" fill="#888">real-time processing</text>

  <rect x="580" y="240" width="110" height="40" rx="6" fill="#fde0d0" stroke="#E25A1C" filter="url(#sh)"/>
  <text x="635" y="259" text-anchor="middle" font-size="9" font-weight="700">Kafka Connect</text>
  <text x="635" y="273" text-anchor="middle" font-size="8" fill="#888">sink: S3 / ES / DB</text>

  <!-- Arrows brokers to consumers -->
  <line x1="360" y1="105" x2="580" y2="80" stroke="#555" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="360" y1="115" x2="580" y2="140" stroke="#555" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="360" y1="220" x2="580" y2="200" stroke="#555" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="360" y1="240" x2="580" y2="260" stroke="#555" stroke-width="1.5" marker-end="url(#ah)"/>

  <!-- Schema Registry -->
  <rect x="720" y="60" width="120" height="50" rx="6" fill="#fff3cd" stroke="#F5A623" filter="url(#sh)"/>
  <text x="780" y="82" text-anchor="middle" font-size="10" font-weight="700">Schema Registry</text>
  <text x="780" y="98" text-anchor="middle" font-size="8" fill="#856404">Avro / Protobuf</text>

  <rect x="720" y="130" width="120" height="50" rx="6" fill="#e8d0f5" stroke="#9B59B6" filter="url(#sh)"/>
  <text x="780" y="152" text-anchor="middle" font-size="10" font-weight="700">REST Proxy</text>
  <text x="780" y="168" text-anchor="middle" font-size="8" fill="#7d3f9b">HTTP → Kafka</text>

  <!-- Legend -->
  <rect x="430" y="390" width="400" height="70" rx="8" fill="#fff" stroke="#ddd"/>
  <text x="445" y="408" font-size="10" font-weight="700" fill="#333">Legend:</text>
  <rect x="445" y="416" width="12" height="12" rx="2" fill="#5DB85B"/><text x="462" y="426" font-size="9" fill="#333">Producers</text>
  <rect x="525" y="416" width="12" height="12" rx="2" fill="#4A90D9"/><text x="542" y="426" font-size="9" fill="#333">Brokers</text>
  <rect x="600" y="416" width="12" height="12" rx="2" fill="#E25A1C"/><text x="617" y="426" font-size="9" fill="#333">Consumers</text>
  <rect x="685" y="416" width="12" height="12" rx="2" fill="#9B59B6"/><text x="702" y="426" font-size="9" fill="#333">KRaft / Control</text>
  <rect x="445" y="440" width="12" height="12" rx="2" fill="#F5A623"/><text x="462" y="450" font-size="9" fill="#333">ISR Replication</text>
  <text x="540" y="450" font-size="9" fill="#888" font-style="italic">All components except brokers are optional in minimal setup</text>
</svg>`,

  partitionOnDisk: `<svg viewBox="0 0 860 380" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,sans-serif">
  <defs><marker id="ah" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#555"/></marker></defs>
  <rect width="860" height="380" rx="12" fill="#F8F9FA"/>
  <text x="430" y="28" text-anchor="middle" font-size="16" font-weight="700" fill="#0f0f23">Partition On-Disk Layout — Segments, Indexes, and Log Files</text>

  <!-- Directory label -->
  <rect x="30" y="50" width="800" height="50" rx="8" fill="#e8eeff" stroke="#4A90D9" stroke-width="1.5"/>
  <text x="430" y="72" text-anchor="middle" font-size="12" font-weight="700" fill="#4A90D9">/kafka-data/orders-0/  (partition 0 of topic "orders")</text>
  <text x="430" y="90" text-anchor="middle" font-size="10" fill="#666">One directory per partition per broker — contains all segment files for this partition</text>

  <!-- Segment 1 (older, closed) -->
  <rect x="30" y="120" width="240" height="120" rx="8" fill="#fff" stroke="#999" stroke-width="1.5"/>
  <text x="150" y="142" text-anchor="middle" font-size="11" font-weight="700" fill="#333">Segment 1 (closed)</text>
  <text x="150" y="158" text-anchor="middle" font-size="9" fill="#888">base offset = 0</text>

  <rect x="50" y="168" width="200" height="22" rx="3" fill="#d4f5d4" stroke="#5DB85B"/>
  <text x="150" y="183" text-anchor="middle" font-size="9">00000000000000000000.log (256 MB)</text>

  <rect x="50" y="195" width="200" height="22" rx="3" fill="#cce5ff" stroke="#4A90D9"/>
  <text x="150" y="210" text-anchor="middle" font-size="9">00000000000000000000.index (sparse)</text>

  <rect x="50" y="218" width="200" height="18" rx="3" fill="#fff3cd" stroke="#F5A623"/>
  <text x="150" y="231" text-anchor="middle" font-size="9">00000000000000000000.timeindex</text>

  <!-- Segment 2 (active) -->
  <rect x="310" y="120" width="260" height="120" rx="8" fill="#fff" stroke="#4A90D9" stroke-width="2"/>
  <text x="440" y="142" text-anchor="middle" font-size="11" font-weight="700" fill="#4A90D9">Active Segment (open)</text>
  <text x="440" y="158" text-anchor="middle" font-size="9" fill="#888">base offset = 1073741824</text>

  <rect x="330" y="168" width="220" height="22" rx="3" fill="#d4f5d4" stroke="#5DB85B" stroke-width="1.5"/>
  <text x="440" y="183" text-anchor="middle" font-size="9">00000000001073741824.log  ← append here</text>

  <rect x="330" y="195" width="220" height="22" rx="3" fill="#cce5ff" stroke="#4A90D9" stroke-width="1.5"/>
  <text x="440" y="210" text-anchor="middle" font-size="9">00000000001073741824.index</text>

  <rect x="330" y="218" width="220" height="18" rx="3" fill="#fff3cd" stroke="#F5A623"/>
  <text x="440" y="231" text-anchor="middle" font-size="9">00000000001073741824.timeindex</text>

  <!-- Producer writes here -->
  <rect x="620" y="120" width="210" height="80" rx="8" fill="#d4f5d4" stroke="#5DB85B" stroke-width="2"/>
  <text x="725" y="148" text-anchor="middle" font-size="11" font-weight="700" fill="#1a5c1a">Producer</text>
  <text x="725" y="166" text-anchor="middle" font-size="9" fill="#333">writes record bytes</text>
  <text x="725" y="182" text-anchor="middle" font-size="9" fill="#333">broker assigns offset</text>
  <text x="725" y="198" text-anchor="middle" font-size="9" fill="#333">appends to .log file</text>
  <line x1="620" y1="160" x2="570" y2="180" stroke="#5DB85B" stroke-width="2" marker-end="url(#ah)"/>

  <!-- Index explanation -->
  <rect x="30" y="270" width="800" height="80" rx="8" fill="#fff" stroke="#ddd"/>
  <text x="50" y="292" font-size="11" font-weight="700" fill="#333">How the sparse .index file works:</text>
  <text x="50" y="312" font-size="10" fill="#555">Every 4 KB of data written → one index entry  (offset → byte position in .log)</text>
  <text x="50" y="330" font-size="10" fill="#555">Consumer seeks offset 5,000 → binary search in .index → find nearest entry → scan .log from that byte position</text>
  <text x="50" y="348" font-size="10" fill="#888">Segment rolls when log.segment.bytes (1 GB default) or log.roll.hours (168h) is reached → new segment files created</text>
</svg>`,

  replicationISR: `<svg viewBox="0 0 860 420" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,sans-serif">
  <defs><marker id="ah" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#555"/></marker></defs>
  <rect width="860" height="420" rx="12" fill="#F8F9FA"/>
  <text x="430" y="28" text-anchor="middle" font-size="16" font-weight="700" fill="#0f0f23">Kafka Replication — Leader, ISR, High Watermark, and Log End Offset</text>

  <!-- Leader -->
  <rect x="60" y="55" width="200" height="250" rx="8" fill="#4A90D9" stroke="#3570a8" stroke-width="2"/>
  <text x="160" y="80" text-anchor="middle" fill="#fff" font-size="13" font-weight="700">Leader — Broker 1</text>
  <text x="160" y="98" text-anchor="middle" fill="#d0e4ff" font-size="10">Partition 0, all writes land here</text>

  ${[0,1,2,3,4,5,6,7].map((i,_,arr) => {
    const y = 115 + i*20
    return `<rect x="80" y="${y}" width="160" height="16" rx="3" fill="rgba(255,255,255,0.2)"/>
    <text x="160" y="${y+11}" text-anchor="middle" fill="#fff" font-size="9">offset ${i}  (LEO=${arr.length-1})</text>`
  }).join('')}

  <text x="160" y="290" text-anchor="middle" fill="#fff3cd" font-size="10" font-weight="700">LEO = 7  (Log End Offset)</text>

  <!-- ISR Follower in sync -->
  <rect x="330" y="55" width="200" height="250" rx="8" fill="#5DB85B" stroke="#4a9a49" stroke-width="2"/>
  <text x="430" y="80" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">Broker 2 — ISR ✓</text>
  <text x="430" y="97" text-anchor="middle" fill="#d4f5d4" font-size="10">replica lag = 0 offsets</text>

  ${[0,1,2,3,4,5,6].map((i) => {
    const y = 115 + i*20
    return `<rect x="350" y="${y}" width="160" height="16" rx="3" fill="rgba(255,255,255,0.2)"/>
    <text x="430" y="${y+11}" text-anchor="middle" fill="#fff" font-size="9">offset ${i}</text>`
  }).join('')}
  <text x="430" y="290" text-anchor="middle" fill="#fff3cd" font-size="10" font-weight="700">LEO = 6</text>

  <!-- Lagging Follower NOT in ISR -->
  <rect x="600" y="55" width="200" height="250" rx="8" fill="#E74C3C" stroke="#c0392b" stroke-width="2"/>
  <text x="700" y="80" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">Broker 3 — NOT ISR ✗</text>
  <text x="700" y="97" text-anchor="middle" fill="#fde0d0" font-size="10">replica.lag.time.max.ms exceeded</text>

  ${[0,1,2,3].map((i) => {
    const y = 115 + i*20
    return `<rect x="620" y="${y}" width="160" height="16" rx="3" fill="rgba(255,255,255,0.2)"/>
    <text x="700" y="${y+11}" text-anchor="middle" fill="#fff" font-size="9">offset ${i}</text>`
  }).join('')}
  <text x="700" y="290" text-anchor="middle" fill="#fff3cd" font-size="10" font-weight="700">LEO = 3  (lagging by 4)</text>

  <!-- Arrows: leader → followers -->
  <line x1="260" y1="165" x2="330" y2="165" stroke="#F5A623" stroke-width="2" marker-end="url(#ah)"/>
  <text x="295" y="158" text-anchor="middle" font-size="9" fill="#F5A623" font-weight="600">fetch</text>
  <line x1="260" y1="200" x2="600" y2="200" stroke="#E74C3C" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#ah)"/>
  <text x="430" y="215" text-anchor="middle" font-size="9" fill="#E74C3C">slow / lagging</text>

  <!-- HW line across leader and ISR follower -->
  <line x1="60" y1="310" x2="530" y2="310" stroke="#9B59B6" stroke-width="2" stroke-dasharray="6,3"/>
  <text x="295" y="327" text-anchor="middle" font-size="10" fill="#9B59B6" font-weight="700">High Watermark (HW) = 6  — consumers can only read up to here</text>

  <!-- Key box -->
  <rect x="60" y="345" width="740" height="55" rx="8" fill="#fff" stroke="#ddd"/>
  <text x="80" y="365" font-size="10" font-weight="700" fill="#333">Key rules:</text>
  <text x="80" y="383" font-size="9" fill="#555">  HW = min(LEO of all ISR members)  •  Consumers only see records below HW  •  acks=all waits for all ISR to confirm  •  Out-of-ISR brokers excluded from quorum</text>
</svg>`,

  kafkaVsComparison: `<svg viewBox="0 0 860 360" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,sans-serif">
  <rect width="860" height="360" rx="12" fill="#F8F9FA"/>
  <text x="430" y="28" text-anchor="middle" font-size="16" font-weight="700" fill="#0f0f23">Kafka vs Competitors — Feature Comparison Matrix</text>

  <!-- Header row -->
  <rect x="20" y="45" width="820" height="35" rx="6" fill="#12123a"/>
  <text x="130" y="67" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Feature</text>
  <text x="290" y="67" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Kafka</text>
  <text x="430" y="67" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">RabbitMQ</text>
  <text x="570" y="67" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Apache Pulsar</text>
  <text x="730" y="67" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">AWS Kinesis</text>

  ${[
    ['Max throughput','1–2M msg/s/node','50K msg/s','1M+ msg/s','~1M msg/s (managed)'],
    ['Message replay','✓ Retain & seek','✗ Deleted after ACK','✓ Cursor rewind','✓ 365-day retention'],
    ['Consumer model','Pull (offset-based)','Push (queue)','Pull (cursor)','Pull (shard)'],
    ['Ordering guarantee','Per-partition','Per-queue','Per-topic partition','Per-shard'],
    ['Horizontal scale','Native (add brokers)','Limited','Native','Auto (managed)'],
    ['Geo-replication','MirrorMaker 2','Federation plugins','Built-in native','Cross-region stream'],
    ['Stream processing','Kafka Streams native','Limited','Pulsar Functions','Kinesis Analytics'],
    ['Operational cost','Medium-high','Low','High (BookKeeper)','Zero (managed)'],
  ].map(([feat, kafka, rabbit, pulsar, kinesis], idx) => {
    const y = 90 + idx * 30
    const bg = idx % 2 === 0 ? '#fff' : '#f5f7ff'
    return `<rect x="20" y="${y}" width="820" height="28" rx="0" fill="${bg}"/>
    <text x="130" y="${y+18}" text-anchor="middle" font-size="9" fill="#333" font-weight="600">${feat}</text>
    <text x="290" y="${y+18}" text-anchor="middle" font-size="9" fill="#1a5c1a">${kafka}</text>
    <text x="430" y="${y+18}" text-anchor="middle" font-size="9" fill="#555">${rabbit}</text>
    <text x="570" y="${y+18}" text-anchor="middle" font-size="9" fill="#555">${pulsar}</text>
    <text x="730" y="${y+18}" text-anchor="middle" font-size="9" fill="#555">${kinesis}</text>`
  }).join('')}

  <!-- border -->
  <rect x="20" y="45" width="820" height="295" rx="6" fill="none" stroke="#e2e5f0" stroke-width="1.5"/>
  <line x1="215" y1="45" x2="215" y2="340" stroke="#e2e5f0"/>
  <line x1="360" y1="45" x2="360" y2="340" stroke="#e2e5f0"/>
  <line x1="505" y1="45" x2="505" y2="340" stroke="#e2e5f0"/>
  <line x1="655" y1="45" x2="655" y2="340" stroke="#e2e5f0"/>
</svg>`,

}

// ── Content blocks ─────────────────────────────────────────────────────────

export const KAFKA_PARTS = [

  /* ══════════════════════════════════════════════════════════
     PART 0 — Architecture & Core Concepts
     Target: ~50 printed pages, 3 sections × 5-6 subsections
  ══════════════════════════════════════════════════════════ */
  {
    part_index: 0,
    title: 'Architecture & Core Concepts',
    blocks: [
      {
        type: 'ph', label: 'Part 1', title: 'Architecture & Core Concepts',
        subtitle: 'Why Kafka exists, how the commit log works, on-disk storage anatomy, and how the cluster manages itself without ZooKeeper',
      },

      // ══════ SECTION 1 ══════
      {
        type: 'section', title: '1 — Why Apache Kafka Exists', blocks: [

          { type: 'ss', title: '1.1 The Event Streaming Problem', blocks: [
            { type: 'p', md: 'Modern applications generate **billions of events daily** — user clicks, financial transactions, IoT sensor readings, application logs, database state changes, and microservice communications. These events represent the pulse of every digital business. The fundamental challenge is capturing them reliably, transporting them between systems in real-time, processing them both as they arrive and retrospectively, and storing them durably for replay.' },
            { type: 'p', md: 'Traditional systems fail at this challenge for distinct reasons. Relational databases are not designed for high-throughput append-only writes — a single PostgreSQL node handles ~10K inserts/sec before degrading. HTTP-based microservice communication creates tight coupling: if Service B is down, Service A\'s write is lost. File-based log aggregation (rsync, batch ETL) introduces minutes-to-hours of delay, making real-time analytics impossible.' },
            { type: 'p', md: 'The requirement is a system that can: ingest millions of events per second from thousands of producers, deliver them to hundreds of consumers independently, retain the complete history for days or weeks, and do all of this with sub-10ms end-to-end latency. This is precisely what Apache Kafka was designed to do.' },
          ]},

          { type: 'ss', title: '1.2 Traditional Messaging Systems and Their Limitations', blocks: [
            { type: 'p', md: 'The generation of messaging systems before Kafka — RabbitMQ, ActiveMQ, IBM MQ — solved the problem of **reliable point-to-point and publish-subscribe messaging** within a single application domain. They introduced concepts like durable queues, dead letter queues, message acknowledgements, and routing rules (exchanges in AMQP) that remain valuable today.' },
            { type: 'p', md: 'However, they were designed for message **delivery**, not data **retention**. The core assumption of AMQP-style brokers is that a message exists to be delivered and then deleted. This creates three fundamental problems at scale: **fan-out requires duplication** (each consumer type needs its own queue, so a producer must write N times for N consumer types); **no replay** (once a message is ACKed, the data is gone — there is no way to re-process historical data without a separate archive); and **throughput ceiling** (~50K msg/s per queue on commodity hardware).' },
            { type: 'p', md: 'The fan-out problem is particularly insidious. In a microservices architecture with 50 services, an "Order Placed" event might need to trigger inventory reservation, payment processing, email notification, analytics recording, fraud detection, and supply chain updates. With RabbitMQ, this requires either 6 separate queues (with the producer writing to each) or a single queue consumed by a router service — both architectures add coupling and complexity that grows with every new consumer type.' },
            { type: 'rawsvg', svg: SVG.kafkaVsTraditional },
          ]},

          { type: 'ss', title: '1.3 Kafka\'s Core Philosophy — The Commit Log', blocks: [
            { type: 'p', md: 'Jay Kreps, the primary author of Kafka\'s original design at LinkedIn, described the fundamental insight in his 2013 post "The Log: What every software engineer should know about real-time data\'s unifying abstraction": **a log is the most natural data structure for a distributed system**. A log is an append-only, totally-ordered sequence of records indexed by time. This is how databases record changes (the write-ahead log), how version control systems track commits, and how filesystems journal modifications.' },
            { type: 'p', md: 'Kafka is, at its core, a **distributed commit log as a service**. A Kafka topic partition is literally an append-only log stored on disk. Records are written sequentially, assigned a monotonically increasing **offset** (a 64-bit integer), and never modified. The broker never needs to locate a record by content — consumers fetch by offset, and the log is immutable. This design gives Kafka three properties that no traditional queue can match: **replay** (seek to offset 0 and re-read all history), **fan-out** (each consumer group maintains its own offset and reads independently), and **linear write throughput** (sequential disk writes are 10–100× faster than random writes).' },
            { type: 'p', md: 'The analogy to understand this intuitively: Kafka is like a **newspaper archive**. The New York Times does not discard yesterday\'s newspaper when you finish reading it. The archive stores every edition, forever. Any subscriber can start reading from any edition at any time. Starting a new subscriber does not affect any existing subscriber. Kafka is the archive; topics are newspaper titles; partitions are physical print runs; consumer groups are subscribers.' },
            { type: 'rawsvg', svg: SVG.commitLog },
            { type: 'callout', variant: 'info', label: 'Engineering Insight',
              md: 'The commit log design means Kafka\'s write path is extremely simple: open(file), write(bytes), close. No index maintenance, no row locking, no MVCC overhead. This is why a single Kafka broker can sustain 1–2 million writes/sec on commodity hardware — it is almost as fast as the raw disk bandwidth.' },
          ]},

          { type: 'ss', title: '1.4 Kafka\'s Four Core Guarantees', blocks: [
            { type: 'p', md: '**Durability**: With `acks=all` and `min.insync.replicas=2`, a write is not acknowledged until at least 2 replicas have persisted the record to disk. A single broker crash cannot lose a committed record. Kafka never calls `fsync()` per message — instead it relies on OS page cache durability plus replication. The practical durability guarantee is: your data survives any single node failure.' },
            { type: 'p', md: '**Ordering**: Kafka guarantees total ordering **within a partition**. All records with the same key are hashed to the same partition (by default using murmur2 hash), giving you ordered history for any given entity. This is sufficient for most real-world requirements: all events for `user_id=42` arrive in chronological order; all events for `order_id=XYZ` arrive in order. Cross-partition ordering is not guaranteed and not needed in practice.' },
            { type: 'p', md: '**Scalability**: Kafka scales horizontally by adding brokers and increasing partition count. A partition is the unit of parallelism — 100 partitions can be processed by 100 consumers concurrently. Adding a broker to a running cluster is live and transparent to producers and consumers. A single cluster has been tested at **1 million partitions** (with KRaft mode) and **multi-GB/s throughput**.' },
            { type: 'p', md: '**Delivery semantics**: Kafka supports configurable delivery guarantees. At-most-once (fastest, potential loss), at-least-once (default, potential duplicates), and exactly-once (via idempotent producers + transactions, highest latency). The right choice depends on whether your consumers are idempotent by nature.' },
            { type: 'table',
              headers: ['Guarantee', 'Producer config', 'Consumer config', 'Trade-off'],
              rows: [
                ['At-most-once',  'acks=0',  'Auto-commit before processing', 'Possible data loss; lowest latency'],
                ['At-least-once', 'acks=all, retries=MAX', 'Manual commit after processing', 'Possible duplicates; standard choice'],
                ['Exactly-once',  'enable.idempotence=true, transactional.id set', 'isolation.level=read_committed', 'Highest latency, no duplicates ever'],
              ]},
          ]},

          { type: 'ss', title: '1.5 Kafka vs the Ecosystem', blocks: [
            { type: 'p', md: '**Kafka vs RabbitMQ**: Use Kafka when you need replay, fan-out to many consumer types, high throughput (>50K msg/s), or stream processing. Use RabbitMQ when you need message routing by content (exchanges/bindings), per-message TTL, message priorities, or a simpler operational footprint for low-throughput workloads.' },
            { type: 'p', md: '**Kafka vs Apache Pulsar**: Pulsar separates storage (Apache BookKeeper) from compute (brokers), enabling **instant topic scaling** without partition reassignment. Kafka\'s coupled storage model makes partition reassignment slower but simpler to operate. Pulsar has built-in multi-tenancy and geo-replication, making it compelling for large multi-team organizations. Kafka\'s richer ecosystem (Kafka Streams, Kafka Connect, Confluent Platform) makes it the default choice for most teams.' },
            { type: 'p', md: '**Kafka vs AWS Kinesis**: Kinesis is the zero-ops managed choice for AWS-native teams. It lacks Kafka\'s ecosystem depth (no Streams equivalent, limited connector library) and has harder limits (1 MB/s per shard). Kafka on MSK (Managed Streaming for Kafka) gives you Kafka\'s power with managed infrastructure. For teams not on AWS, Kafka with Confluent Cloud or self-hosted clusters is the standard.' },
            { type: 'rawsvg', svg: SVG.kafkaVsComparison },
            { type: 'callout', variant: 'note', label: 'Key Takeaways — Section 1', items: [
              'Kafka is a distributed commit log, not a message queue — this distinction drives every design decision',
              'Fan-out and replay are impossible in traditional queues without duplication; trivial in Kafka',
              'Order is guaranteed per-partition — use consistent keys to maintain per-entity ordering',
              'Choose exactly-once only when your downstream cannot tolerate duplicates; at-least-once with idempotent consumers is sufficient for 95% of use cases',
            ]},
          ]},
        ],
      },

      { type: 'divider' },

      // ══════ SECTION 2 ══════
      {
        type: 'section', title: '2 — Topics, Partitions & On-Disk Storage', blocks: [

          { type: 'ss', title: '2.1 Topics as Logical Feeds', blocks: [
            { type: 'p', md: 'A **topic** is Kafka\'s fundamental unit of organization — a named, durable, ordered stream of records. Think of a topic like a database table name: it has a schema (implicit or enforced via Schema Registry), a retention policy, and belongs to a cluster. Unlike a database table, a topic has no primary key, no unique constraint, and no secondary index. It is a pure sequential log.' },
            { type: 'p', md: 'Topics are organized internally into **partitions**. When you create a topic with `--partitions 12`, Kafka creates 12 independent log files, distributed across brokers. Each partition is a totally-ordered, immutable sequence of records. The partition count is the most consequential topic configuration decision — it sets the ceiling for consumer parallelism and is **not decreasable** without recreating the topic.' },
            { type: 'p', md: 'Topic names follow a convention: `{team}.{domain}.{entity}.{version}` — for example `payments.orders.created.v1`. This convention enables topic-level ACLs, monitoring dashboards, and Schema Registry subject naming. Enforce naming conventions via Kafka AdminClient validation or Confluent Platform cluster policies.' },
            { type: 'table',
              headers: ['Parameter', 'Default', 'Production Recommendation', 'Notes'],
              rows: [
                ['num.partitions', '1', '6–48 depending on throughput', 'Cannot be decreased; only increased'],
                ['replication.factor', '1', '3', 'Always 3 in production'],
                ['min.insync.replicas', '1', '2', 'Set at topic level or broker default'],
                ['retention.ms', '604800000 (7d)', '86400000–604800000 (1–7d)', 'Tune per topic business requirement'],
                ['segment.bytes', '1073741824 (1GB)', '268435456 (256 MB)', 'Smaller segments = faster retention cleanup'],
                ['compression.type', 'producer', 'lz4 or zstd', 'Match producer compression to avoid re-compress'],
              ]},
          ]},

          { type: 'ss', title: '2.2 Partition Internals — Segments, Index Files', blocks: [
            { type: 'p', md: 'On the broker\'s filesystem, each partition maps to a directory: `/kafka-data/{topic}-{partition}/`. Inside, the log is split into **segment files**. A segment is a fixed-size (controlled by `log.segment.bytes`, default 1 GB) chunk of the log. When a segment is full, Kafka creates a new one. The old segment becomes **closed** (read-only) and is eventually deleted when it falls outside the retention window.' },
            { type: 'p', md: 'Each segment consists of three files. The **`.log` file** contains the raw message bytes in Kafka\'s message format (header + key + value + attributes + timestamps). The **`.index` file** is a sparse offset index: it stores one entry every `log.index.interval.bytes` (4 KB default) mapping logical offset → byte position in the `.log` file. The **`.timeindex` file** similarly maps timestamps → offsets, enabling time-based seeking (`seekToBeginning` / `offsetsForTimes`).' },
            { type: 'p', md: 'When a consumer fetches from offset 5,000, the broker does: (1) binary search the `.index` to find the nearest entry ≤ 5,000; (2) seek to that byte position in `.log`; (3) scan forward record-by-record until reaching offset 5,000; (4) read forward from there. This is O(log N) for the index search + O(1) for the sequential scan — extremely fast even for billions of records.' },
            { type: 'rawsvg', svg: SVG.partitionOnDisk },
            { type: 'callout', variant: 'pitfall', label: 'Segment Size Trap',
              md: 'The default 1 GB segment size means retention cleanup is coarse. If your retention policy is 1 day and you write 10 MB/min, segments are ~100 GB and retention cleanup takes 24h to activate. Set `segment.bytes=268435456` (256 MB) in production so segments roll every few hours and cleanup is more granular.' },
          ]},

          { type: 'ss', title: '2.3 Log Compaction vs Time-Based Retention', blocks: [
            { type: 'p', md: 'Kafka supports two fundamentally different cleanup strategies, configurable per topic via `log.cleanup.policy`. **Delete** (the default) removes entire segments that have aged past `retention.ms` or grown past `retention.bytes`. This is the right policy for event streams: "keep all events from the last 7 days."' },
            { type: 'p', md: '**Compact** retains only the **latest record per key** — older records with the same key are garbage collected. This makes a compacted topic behave like a changelog: you always have the current state of every key, but not the full history. Compacted topics are used as source topics for `KTable` in Kafka Streams and as changelogs for connector state. A null-value record (tombstone) signals deletion: the key\'s record is removed in the next compaction pass.' },
            { type: 'p', md: 'The `compact,delete` policy combines both: first compact (deduplicate by key), then delete (remove records older than retention). This is the right choice for CDC topics where you want current state but also want to free disk space after some TTL.' },
            { type: 'table',
              headers: ['Policy', 'Keeps', 'Deletes', 'Use case', 'Pitfall'],
              rows: [
                ['delete', 'All records within retention window', 'Entire segments past retention', 'Event streams, analytics, audit logs', 'Coarse cleanup — tune segment.bytes'],
                ['compact', 'Latest record per key (all time)', 'Older records per key (async)', 'KTable source, user profiles, changelog', 'Compaction is async — dirty records remain temporarily'],
                ['compact,delete', 'Latest per key within window', 'Old keys + old segments', 'CDC with TTL, hybrid data', 'Two GC threads; monitor log.cleaner.threads'],
              ]},
            { type: 'callout', variant: 'info', label: 'Engineering Insight',
              md: 'Log compaction is **not instantaneous**. The log cleaner thread runs in the background and processes partitions with the highest "dirty ratio" first. During compaction, both old and new records coexist. Consumer lag metrics on compacted topics can be misleading because the earliest offset shifts as compaction runs. Monitor `log.cleaner.stats` JMX metrics to understand compaction throughput.' },
          ]},

          { type: 'ss', title: '2.4 Zero-Copy I/O — How Kafka Achieves High Throughput', blocks: [
            { type: 'p', md: 'The most important performance secret in Kafka is not its distributed design — it is **zero-copy transfer**. When a consumer fetches data, Kafka uses the `sendfile()` Linux syscall instead of the traditional read-write path. In the traditional path: data travels from disk → kernel page cache → user-space buffer (Java heap) → kernel socket buffer → NIC. Each copy costs CPU cycles and memory bandwidth.' },
            { type: 'p', md: '`sendfile()` eliminates the user-space copy entirely: data goes from the OS page cache directly to the NIC via a DMA transfer, never touching the JVM heap. This means Kafka can serve consumers at nearly **disk read bandwidth** (~600 MB/s on SATA SSD, ~3 GB/s on NVMe) with negligible CPU usage. A single broker can handle thousands of concurrent consumers without proportional CPU growth, because the broker is just a conduit from page cache to socket.' },
            { type: 'p', md: 'This design explains another critical Kafka tuning rule: **keep the JVM heap small** (6 GB is optimal for a 32 GB broker). The remaining 26 GB is available to the OS page cache. Cached data is served at memory speed (~20 GB/s); uncached data requires a disk read. A broker with a large heap evicts page cache entries, causing more disk reads and 100× higher read latency.' },
            { type: 'callout', variant: 'pitfall', label: 'The Heap Size Trap',
              md: 'Engineers instinctively set `KAFKA_HEAP_OPTS="-Xms32g -Xmx32g"` on a 32 GB host. This is wrong — it leaves 0 GB for page cache. Set heap to 6 GB maximum. The OS will use the remaining 26 GB for page cache, giving consumers near-memory-speed reads for hot partitions. Verify with `cat /proc/meminfo | grep Cached`.' },
          ]},

          { type: 'ss', title: '2.5 Partition Sizing — The Most Important Decision', blocks: [
            { type: 'p', md: 'Partition count is the single most important configuration decision at topic creation. It controls: **consumer parallelism** (you cannot have more active consumers in a group than partitions), **write throughput** (each partition can sustain ~10 MB/s independently), and **cluster rebalance time** (more partitions = longer leader election recovery).' },
            { type: 'p', md: 'The formula for minimum partitions: `max(target_throughput_MB/s ÷ 10, desired_consumer_parallelism)`. For a topic that needs 100 MB/s write throughput with 20 consumers, you need at least 20 partitions. Over-provisioning (e.g., 48 partitions for a 10 MB/s topic) wastes resources but does not cause correctness issues. Under-provisioning is the critical mistake — you cannot reduce partitions later.' },
            { type: 'table',
              headers: ['Partition count', 'Max write throughput', 'Max consumers', 'Rebalance time (typ.)', 'Recommendation'],
              rows: [
                ['1–3',   '10–30 MB/s',   '3',    '< 1 s',   'Low-traffic internal / audit topics'],
                ['6–12',  '60–120 MB/s',  '12',   '1–3 s',   'Most production business topics'],
                ['24–48', '240–480 MB/s', '48',   '5–15 s',  'High-throughput analytics, CDC'],
                ['100+',  '1+ GB/s',      '100+', '30–60 s', 'Only if you truly need it — rebalance pain is real'],
              ]},
            { type: 'callout', variant: 'note', label: 'Key Takeaways — Section 2', items: [
              'Segments are the unit of deletion — tune `log.segment.bytes=268435456` (256 MB) for more granular cleanup',
              'Zero-copy sendfile() is Kafka\'s performance secret — keep JVM heap at 6 GB, give the rest to OS page cache',
              'Log compaction is async and not instantaneous — never assume a compacted topic has a clean state in the moment',
              'Partition count determines consumer parallelism ceiling — cannot be decreased, so plan generously',
            ]},
          ]},
        ],
      },

      { type: 'divider' },

      // ══════ SECTION 3 ══════
      {
        type: 'section', title: '3 — Brokers, Cluster Metadata & KRaft', blocks: [

          { type: 'ss', title: '3.1 Broker Architecture and Responsibilities', blocks: [
            { type: 'p', md: 'Every Kafka broker is an equal peer in the data plane — there is no master broker for writes. Producers and consumers connect to **any** broker and receive metadata telling them which broker leads which partition. The requesting broker proxies nothing — clients then connect directly to the leader broker for each partition they need.' },
            { type: 'p', md: 'A broker has four major subsystems: the **Network Layer** (NIO-based socket server accepting producer/consumer/admin connections on port 9092 by default), the **Log Manager** (manages all partition log directories, segment rolling, compaction), the **Replica Manager** (handles ISR tracking, leader elections, high-watermark advancement), and the **Group Coordinator** (manages consumer group membership, offset commits, stored in the internal `__consumer_offsets` topic).' },
            { type: 'p', md: 'The **controller** is a special broker role that manages cluster-level metadata: which broker leads which partition, ISR changes, topic creation/deletion, broker join/leave events. In any healthy cluster, exactly one broker holds the controller role. Controller election in KRaft mode (via Raft protocol) takes under 1 second; in the legacy ZooKeeper-based mode it took 30–60 seconds. This is the primary reason to migrate to KRaft.' },
            { type: 'rawsvg', svg: SVG.clusterArchitecture },
          ]},

          { type: 'ss', title: '3.2 KRaft — Removing ZooKeeper', blocks: [
            { type: 'p', md: 'Before Kafka 3.3, all cluster metadata (broker membership, partition assignments, topic configurations) was stored in **ZooKeeper** — a separate distributed coordination service. ZooKeeper was the biggest operational pain point in Kafka: you needed to deploy, monitor, backup, and version-match a separate system. ZooKeeper\'s write throughput was a hard ceiling on metadata operations, limiting clusters to ~200,000 partitions before degradation.' },
            { type: 'p', md: '**KRaft** (Kafka Raft) replaces ZooKeeper with an internal Raft consensus group of controller nodes. The metadata log (topics, partition assignments, ISR state) is stored in a special internal Kafka topic replicated across the controller quorum. This gives Kafka: **1M+ partition support** (tested at LinkedIn and Confluent), **sub-1-second controller failover**, **no ZooKeeper dependency**, and **simplified deployment** (one system to configure, monitor, and secure).' },
            { type: 'p', md: 'KRaft has two deployment modes: **combined mode** (each node is both a broker and a controller — used for development and small clusters) and **isolated mode** (dedicated controller nodes separate from broker nodes — recommended for production). For production, run 3 dedicated controller nodes on separate racks to tolerate one failure. Controllers do not handle data traffic, so they can use smaller instances.' },
            { type: 'code', desc: 'Initialize a KRaft cluster (production — isolated mode)', lang: 'Bash', code:
`# 1. Generate a cluster UUID (once per cluster lifecycle)
CLUSTER_ID=$(kafka-storage.sh random-uuid)
echo "Cluster ID: $CLUSTER_ID"

# 2. Format storage on EACH controller node
# controller.properties: process.roles=controller
kafka-storage.sh format \\
  -t "$CLUSTER_ID" \\
  -c /etc/kafka/controller.properties

# 3. Format storage on EACH broker node
# broker.properties: process.roles=broker
kafka-storage.sh format \\
  -t "$CLUSTER_ID" \\
  -c /etc/kafka/broker.properties

# 4. Start controllers first, then brokers
systemctl start kafka-controller
systemctl start kafka-broker

# Essential KRaft properties (controller.properties):
# process.roles=controller
# node.id=1                              # unique per node (1, 2, 3 for controllers)
# controller.quorum.voters=1@ctrl1:9093,2@ctrl2:9093,3@ctrl3:9093
# listeners=CONTROLLER://:9093
# log.dirs=/var/kafka/controller-data`,
            },
          ]},

          { type: 'ss', title: '3.3 Controller Election and Metadata Quorum', blocks: [
            { type: 'p', md: 'KRaft uses the Raft consensus algorithm to elect a leader among the controller nodes. Raft requires a quorum (majority) to make progress: with 3 controllers, 2 must agree for any metadata change to be committed. This tolerates 1 controller failure. With 5 controllers, 3 must agree, tolerating 2 failures. Three controllers is the standard production configuration — 5 is only needed for very high metadata-change workloads.' },
            { type: 'p', md: 'The Raft leader (the **active controller**) processes all metadata writes: topic creation, partition assignment, ISR changes. Followers replicate the metadata log. On leader failure, remaining controllers elect a new leader in under 1 second via Raft vote. The new leader has a complete up-to-date copy of all metadata from the replicated log — no catchup required.' },
            { type: 'p', md: 'Brokers maintain a persistent connection to the active controller and receive incremental metadata updates. Unlike ZooKeeper-based Kafka where brokers polled ZooKeeper for changes, KRaft controllers **push** metadata changes to brokers in real-time, making metadata propagation faster and reducing ZooKeeper-induced latency spikes.' },
            { type: 'callout', variant: 'info', label: 'KRaft vs ZooKeeper — Migration',
              md: 'Kafka 3.5 removed ZooKeeper support entirely for new clusters. Existing ZooKeeper clusters can migrate using the `kafka-storage.sh` migration tool. The migration is live (no downtime) and takes ~10 minutes for a 100-broker cluster. After migration, ZooKeeper can be decommissioned. Do this migration — it eliminates the #1 operational headache of Kafka.' },
          ]},

          { type: 'ss', title: '3.4 Replication — Leader, Followers, and ISR', blocks: [
            { type: 'p', md: 'Every partition has one **leader replica** and zero or more **follower replicas** distributed across brokers. Producers always write to the leader. Followers **pull** from the leader — they initiate fetch requests on a configurable interval (`replica.fetch.max.bytes`, `replica.fetch.wait.max.ms`). Followers never accept writes directly.' },
            { type: 'p', md: 'The **In-Sync Replica set (ISR)** is the set of replicas currently caught up to the leader — within `replica.lag.time.max.ms` (default 10 s) of the leader\'s log end offset. When a follower falls behind (network issue, disk slowness, GC pause), it is removed from the ISR. When it catches up again, it is re-added. The ISR list is maintained by the controller and tracked in the metadata log.' },
            { type: 'p', md: 'The **High Watermark (HW)** is the highest offset replicated to all ISR members. Consumers can only read records below the HW — records above HW are "uncommitted" and may be lost if the leader crashes before they are replicated. The **Log End Offset (LEO)** is the next offset to be written. For a healthy partition, LEO = HW. Lag = LEO - HW indicates data that the leader has written but followers have not yet replicated.' },
            { type: 'rawsvg', svg: SVG.replicationISR },
          ]},

          { type: 'ss', title: '3.5 Cluster Health Monitoring — Critical Metrics', blocks: [
            { type: 'p', md: 'A healthy Kafka cluster has three invariants: (1) exactly one active controller, (2) zero under-replicated partitions, (3) zero offline partitions. Any violation of these invariants requires immediate investigation. Monitoring these three metrics should be the foundation of your Kafka alerting.' },
            { type: 'table',
              headers: ['JMX Metric', 'MBean path', 'Healthy value', 'Alert threshold', 'Severity'],
              rows: [
                ['ActiveControllerCount',      'kafka.controller:type=KafkaController,name=ActiveControllerCount',      '1',    '≠ 1',    'CRITICAL'],
                ['UnderReplicatedPartitions',   'kafka.controller:type=KafkaController,name=UnderReplicatedPartitions',   '0',    '> 0',    'CRITICAL'],
                ['OfflinePartitionsCount',      'kafka.controller:type=KafkaController,name=OfflinePartitionsCount',      '0',    '> 0',    'CRITICAL'],
                ['UnderMinIsrPartitionCount',   'kafka.server:type=ReplicaManager,name=UnderMinIsrPartitionCount',        '0',    '> 0',    'CRITICAL'],
                ['RequestHandlerAvgIdlePercent','kafka.server:type=KafkaRequestHandlerPool,name=RequestHandlerAvgIdlePercent','> 30%','< 10%','WARNING'],
                ['BytesInPerSec',               'kafka.server:type=BrokerTopicMetrics,name=BytesInPerSec',               'varies','> 80% NIC','WARNING'],
                ['ProduceRequestsPerSec',       'kafka.server:type=BrokerTopicMetrics,name=ProduceRequestsPerSec',       'varies','monitor trend','INFO'],
              ]},
            { type: 'callout', variant: 'note', label: 'Key Takeaways — Section 3', items: [
              'Every broker is equal for data; the controller role manages metadata only — do not confuse partition leader with cluster controller',
              'KRaft replaces ZooKeeper: sub-1s failover, 1M+ partition support, single system to operate — migrate all existing clusters',
              'ISR tracks which replicas are within `replica.lag.time.max.ms` (10 s) of the leader LEO',
              'Consumers only read up to the High Watermark — records above HW may be lost on leader crash',
              '`UnderReplicatedPartitions > 0` is your most critical production alert — act immediately',
            ]},
          ]},
        ],
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     PARTS 1-5 — Written at the same depth on request.
     Each part: 2–3 sections × 5–6 subsections × 3–4 paragraphs.
  ══════════════════════════════════════════════════════════ */
  {
    part_index: 1, title: 'Producers & Consumer Groups',
    blocks: [
      { type: 'ph', label: 'Part 2', title: 'Producers & Consumer Groups',
        subtitle: 'RecordAccumulator, batching, idempotence, transactions, consumer group protocol, offset management, and rebalancing' },
      { type: 'section', title: '4 — Producer Internals', blocks: [
        { type: 'ss', title: '4.1 Producer Architecture', blocks: [
          { type: 'p', md: 'The Kafka producer client is a sophisticated piece of software with five internal stages: **Serializer** (converts key/value objects to bytes), **Partitioner** (selects the target partition), **RecordAccumulator** (batches records by target partition), **NetworkClient** (manages TCP connections and in-flight requests), and **Sender thread** (drains the accumulator and writes batches to brokers).' },
          { type: 'p', md: 'The critical insight is that the **Sender thread runs independently** from the thread calling `producer.send()`. Calling `send()` does not immediately write to the network — it places the record in the RecordAccumulator buffer and returns immediately. The Sender thread picks up batches from the accumulator and flushes them to brokers based on `batch.size` and `linger.ms`. This design allows the application thread to continue producing records while I/O happens asynchronously.' },
          { type: 'p', md: 'The **RecordAccumulator** is a `ConcurrentHashMap<TopicPartition, Deque<ProducerBatch>>`. For each target partition, it maintains a deque of batches. The current (active) batch accumulates records until it is full (`batch.size` bytes) or the linger timer fires (`linger.ms`). At that point the batch is "drained" to the Sender thread for transmission.' },
        ]},
        { type: 'ss', title: '4.2 Batching — The Primary Throughput Lever', blocks: [
          { type: 'p', md: 'Batching is the single most impactful performance optimization in the Kafka producer. Without batching (`linger.ms=0`, `batch.size=1`), every record is its own TCP packet — at 100K msg/s this is 100K syscalls per second, which overwhelms the OS socket layer. With batching (`linger.ms=10`, `batch.size=131072`), 100K records in 10ms are compressed into a single 128 KB TCP payload — one syscall, one network round-trip, dramatically higher throughput.' },
          { type: 'p', md: 'The trade-off: `linger.ms=0` gives minimum latency (record is sent immediately). `linger.ms=20` adds at most 20ms of latency but increases throughput 5–10×. For analytics pipelines, 20ms of producer-side latency is imperceptible. For payment processing where end-to-end latency is measured in milliseconds, `linger.ms=0` may be required.' },
          { type: 'table',
            headers: ['Config', 'Default', 'High Throughput', 'Low Latency', 'Notes'],
            rows: [
              ['batch.size',     '16384 (16 KB)',   '131072 (128 KB)',  '4096',       'Max bytes per batch per partition'],
              ['linger.ms',      '0',               '10–20',           '0',          'Wait time before flushing batch'],
              ['buffer.memory',  '33554432 (32 MB)','134217728 (128 MB)','33554432', 'Total accumulator memory'],
              ['compression.type','none',           'lz4',             'none',       '2–3× size reduction with lz4'],
              ['acks',           '1',               'all',             '1',          'Durability guarantee'],
            ]},
        ]},
        { type: 'ss', title: '4.3 Idempotent Producers and Exactly-Once', blocks: [
          { type: 'p', md: 'Without idempotence: producer sends batch → broker writes it → broker crashes before ACK → producer retries → **duplicate record**. The broker has no way to know whether this is a new record or a retry of a previously written one.' },
          { type: 'p', md: 'With `enable.idempotence=true`, the broker assigns each producer a **Producer ID (PID)** and tracks a **sequence number** per (PID, partition) pair. Each batch is stamped with its sequence number. If the broker receives a batch with a sequence number it has already seen for this (PID, partition), it silently discards it. Idempotence adds ~5% latency overhead and is free from a correctness standpoint.' },
          { type: 'code', desc: 'Minimal exactly-once producer configuration', lang: 'Java', code:
`Properties p = new Properties();
p.put("bootstrap.servers", "kafka-1:9092,kafka-2:9092,kafka-3:9092");
p.put("key.serializer",   "org.apache.kafka.common.serialization.StringSerializer");
p.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

// Required for exactly-once semantics
p.put("enable.idempotence", "true");      // broker deduplicates retries
p.put("acks",               "all");       // wait for full ISR
p.put("retries",            Integer.MAX_VALUE); // retry forever
p.put("max.in.flight.requests.per.connection", "5"); // must be ≤ 5

// For transactions (atomic multi-partition writes)
p.put("transactional.id", "payment-svc-" + instanceId); // unique per process

KafkaProducer<String, String> producer = new KafkaProducer<>(p);
producer.initTransactions(); // register with broker

try {
  producer.beginTransaction();
  producer.send(new ProducerRecord<>("payments", orderId, paymentJson));
  producer.send(new ProducerRecord<>("audit-log", orderId, auditJson));
  producer.commitTransaction(); // both or neither
} catch (KafkaException e) {
  producer.abortTransaction();  // roll back
}`,
          },
          { type: 'callout', variant: 'note', label: 'Key Takeaways — Section 4', items: [
            'Producer batching (`batch.size=131072` + `linger.ms=5`) gives 5–10× throughput improvement with ≤5ms latency cost',
            'Always use `enable.idempotence=true` in production — it has no meaningful performance cost and prevents duplicate records on retry',
            'Transactions group writes across multiple partitions/topics atomically — use for consume-transform-produce pipelines',
            'Set `compression.type=lz4` on both producer and topic to avoid the broker re-compression penalty',
          ]},
        ]},
      ]},
      { type: 'divider' },
      { type: 'section', title: '5 — Consumer Groups & Offsets', blocks: [
        { type: 'ss', title: '5.1 Consumer Group Protocol', blocks: [
          { type: 'p', md: 'A **consumer group** is a set of consumer instances that collectively read all partitions of a subscribed topic set. Kafka guarantees each partition is consumed by exactly one instance within a group. This is the fundamental parallelism primitive: to process a 24-partition topic with maximum parallelism, run 24 consumer instances in the same group.' },
          { type: 'p', md: 'The **Group Coordinator** is a broker that manages group membership for a specific group (determined by `hash(groupId) % __consumer_offsets_partitions`). It tracks which consumers are alive via heartbeats, orchestrates rebalances, and persists committed offsets. Consumer instances send heartbeats on `heartbeat.interval.ms` (default 3s). If no heartbeat arrives within `session.timeout.ms` (default 45s), the coordinator removes the member and triggers a rebalance.' },
        ]},
        { type: 'ss', title: '5.2 Rebalancing — Eager vs Cooperative Sticky', blocks: [
          { type: 'p', md: 'A **rebalance** is triggered when: a consumer joins the group, a consumer leaves (graceful shutdown or heartbeat timeout), a consumer\'s `max.poll.interval.ms` is exceeded (processing took too long), or partitions are added to a subscribed topic. During a rebalance, partition assignments are redistributed across group members.' },
          { type: 'p', md: 'The **eager rebalance** protocol (default before Kafka 2.4) stops all consumers, revokes all partition assignments, waits for all members to rejoin, then assigns fresh partitions. During this window (2–30 seconds typically), zero records are consumed. This is a full stop-the-world pause that scales poorly with consumer count.' },
          { type: 'p', md: 'The **CooperativeStickyAssignor** (default from Kafka 3.1) implements incremental rebalance: only partitions that need to move are revoked. Consumers that keep their partitions continue processing during the rebalance. The incremental protocol completes in two rounds and typically causes under 200ms of additional latency on moving partitions, with zero interruption to stable ones.' },
          { type: 'code', desc: 'Configure CooperativeStickyAssignor (recommended for all production consumers)', lang: 'Java', code:
`props.put("partition.assignment.strategy",
  "org.apache.kafka.clients.consumer.CooperativeStickyAssignor");

// Heartbeat must be < session.timeout / 3
props.put("session.timeout.ms",    "45000"); // kick consumer if silent for 45s
props.put("heartbeat.interval.ms", "3000");  // heartbeat every 3s
props.put("max.poll.interval.ms",  "300000"); // 5 min to process one batch
props.put("max.poll.records",      "500");    // records per poll()`,
          },
        ]},
        { type: 'ss', title: '5.3 Offset Management — Auto vs Manual', blocks: [
          { type: 'p', md: '**Auto-commit** (`enable.auto.commit=true`, `auto.commit.interval.ms=5000`) commits the latest polled offset every 5 seconds. Risk: consumer polls records, auto-commit fires, consumer crashes before processing completes → records are silently lost (at-most-once). This is acceptable for non-critical workloads but wrong for any financial or order-processing system.' },
          { type: 'p', md: '**Manual commit** gives precise control. `commitSync()` blocks until the broker ACKs the offset commit — guaranteed at-least-once delivery. `commitAsync()` fires and forgets — lower latency but no guarantee of commit. For at-least-once delivery with manual commit, process all records in a batch then call `commitSync()`. If the process crashes between processing and committing, records are re-delivered (idempotent consumers required to handle this safely).' },
          { type: 'callout', variant: 'note', label: 'Key Takeaways — Section 5', items: [
            'Use `CooperativeStickyAssignor` always — it eliminates stop-the-world rebalances',
            'Use `enable.auto.commit=false` + `commitSync()` after processing for reliable at-least-once delivery',
            'Consumer count cannot exceed partition count — extra consumers in the group sit idle as hot standbys',
            'Monitor consumer lag per-partition, not total lag — one hot partition can hide behind low average',
          ]},
        ]},
      ]},
    ],
  },

  {
    part_index: 2, title: 'Brokers, Topics & Replication',
    blocks: [
      { type: 'ph', label: 'Part 3', title: 'Brokers, Topics & Replication',
        subtitle: 'ISR deep dive, acks semantics, unclean election, exactly-once transactions' },
      { type: 'section', title: '6 — Replication Deep Dive', blocks: [
        { type: 'ss', title: '6.1 acks Configuration — Durability vs Latency', blocks: [
          { type: 'p', md: '`acks=0`: producer fires and forgets. No wait for any broker ACK. Lowest latency, guaranteed data loss on any broker issue. Only acceptable for metrics/telemetry where loss is tolerable.' },
          { type: 'p', md: '`acks=1`: wait for the leader to write to its local log. Default since Kafka 0.8. **Dangerous** — if the leader crashes between writing and replication, the record is lost even though the producer received an ACK.' },
          { type: 'p', md: '`acks=all` (or `-1`): wait for all ISR replicas to write the record. The leader ACKs only after `min.insync.replicas` ISR members confirm. With `replication.factor=3` and `min.insync.replicas=2`: the cluster tolerates one broker failure while still accepting writes. The `NotEnoughReplicasException` is thrown if ISR drops below min.insync.replicas — this is the right behavior: reject writes rather than risk data loss.' },
          { type: 'table',
            headers: ['acks', 'Durability', 'Latency overhead', 'Use case'],
            rows: [
              ['0',   'None (fire and forget)',    '~0 ms',    'IoT telemetry, metrics where loss is acceptable'],
              ['1',   'Leader only',               '~1 ms',    'Never use in production — silent data loss on leader crash'],
              ['all', 'All ISR replicas',          '3–10 ms',  'All production workloads: financial, orders, CDC, analytics'],
            ]},
        ]},
        { type: 'ss', title: '6.2 Unclean Leader Election', blocks: [
          { type: 'p', md: 'When a leader crashes and **all ISR replicas are unavailable** (a rare but real scenario during cascading failures), Kafka must choose: elect an out-of-ISR replica as leader (possible data loss), or wait for an ISR replica to come back (downtime).' },
          { type: 'p', md: '`unclean.leader.election.enable=true` (default `false` since 0.11): elect the most up-to-date out-of-ISR follower. Partition stays available but committed records may be lost. Appropriate for: click events, app logs, any topic where data loss is acceptable.' },
          { type: 'p', md: '`unclean.leader.election.enable=false`: wait indefinitely for an ISR replica. Partition is offline (reads and writes blocked) until an ISR member recovers. Appropriate for: payment events, order records, any business-critical data.' },
          { type: 'callout', variant: 'pitfall', label: 'Production Incident: Double Charges',
            md: 'A payments team set `unclean.leader.election.enable=true` on their payments topic to minimize downtime. During a datacenter rack failure, an out-of-ISR replica was elected leader — it was 2 minutes behind the crashed leader. Those 2 minutes of payment records were replayed from the stale leader, causing double charges for thousands of users. **Set `unclean.leader.election.enable=false` on all business-critical topics. Always.**' },
        ]},
        { type: 'callout', variant: 'note', label: 'Key Takeaways — Section 6', items: [
          'Use `acks=all` + `min.insync.replicas=2` + `replication.factor=3` as your production baseline — this is non-negotiable',
          '`NotEnoughReplicasException` is the right behavior — it means the cluster chose safety over availability',
          'Never enable unclean leader election for financial, order, or inventory data',
          'ISR recovery after a failure: the rejoining follower fetches from the leader until it catches up, then is added back to ISR',
        ]},
      ]},
      { type: 'divider' },
      { type: 'section', title: '7 — Delivery Semantics & Transactions', blocks: [
        { type: 'ss', title: '7.1 Exactly-Once End-to-End', blocks: [
          { type: 'p', md: 'Full exactly-once semantics requires coordination across three components: (1) **idempotent producer** — broker deduplicates retries by (PID, partition, sequence); (2) **transactional writes** — atomic commit/abort across multiple partitions; (3) **`read_committed` consumer** — only reads records from committed transactions.' },
          { type: 'code', desc: 'Exactly-once consume-transform-produce pipeline', lang: 'Java', code:
`// Consumer: read_committed isolation prevents reading aborted transactions
consumerProps.put("isolation.level", "read_committed");
KafkaConsumer<String, String> consumer = new KafkaConsumer<>(consumerProps);

// Producer: idempotent + transactional
producerProps.put("enable.idempotence", "true");
producerProps.put("transactional.id",   "etl-" + partitionId);
KafkaProducer<String, String> producer = new KafkaProducer<>(producerProps);
producer.initTransactions();

while (true) {
  ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
  producer.beginTransaction();
  try {
    for (var r : records) {
      String transformed = transform(r.value());
      producer.send(new ProducerRecord<>("output", r.key(), transformed));
    }
    // This atomically commits the output records AND the input offsets
    // Either both are committed, or neither — true exactly-once
    producer.sendOffsetsToTransaction(getOffsets(records), consumer.groupMetadata());
    producer.commitTransaction();
  } catch (KafkaException e) {
    producer.abortTransaction();
  }
}`,
          },
        ]},
        { type: 'callout', variant: 'note', label: 'Key Takeaways — Section 7', items: [
          'Exactly-once requires all three: idempotent producer + transactions + `read_committed` consumer',
          '`sendOffsetsToTransaction` is the key call — it atomically ties the input offset commit to the output write',
          'Exactly-once adds ~3× latency overhead — use at-least-once with idempotent consumers for most workloads',
          'Kafka Streams implements exactly-once internally: set `processing.guarantee=exactly_once_v2`',
        ]},
      ]},
    ],
  },

  {
    part_index: 3, title: 'Kafka Streams',
    blocks: [
      { type: 'ph', label: 'Part 4', title: 'Kafka Streams', subtitle: 'Stream processing as a library — topologies, state stores, windows, joins, and interactive queries' },
      { type: 'section', title: '8 — Streams Architecture', blocks: [
        { type: 'ss', title: '8.1 Topology, Processors, State Stores', blocks: [
          { type: 'p', md: 'A Kafka Streams application is a **processor topology** — a DAG of source nodes (read from Kafka topics), processor nodes (transform/aggregate/join), and sink nodes (write to Kafka topics). Unlike Flink or Spark Streaming, Kafka Streams is a **library**, not a cluster. There is no separate runtime to deploy. Scale by running more JVM instances of your application — each instance gets a subset of input partitions.' },
          { type: 'p', md: '**Stateful** processors maintain local state in **RocksDB** instances embedded in the application. State stores are backed by Kafka **changelog topics** — on restart or failure, the state store is rebuilt by replaying the changelog. Interactive queries allow you to expose state store data via REST without a separate database.' },
          { type: 'code', desc: 'Kafka Streams — revenue aggregation per product category', lang: 'Java', code:
`StreamsBuilder builder = new StreamsBuilder();
KStream<String, Order> orders = builder.stream("orders");

// Aggregate: running revenue per category, stored in RocksDB
KTable<String, Double> revenue = orders
  .selectKey((k, v) -> v.getCategory())
  .groupByKey()
  .aggregate(
    () -> 0.0,
    (category, order, total) -> total + order.getTotal(),
    Materialized.<String, Double, KeyValueStore<Bytes, byte[]>>
      as("revenue-store").withValueSerde(Serdes.Double())
  );

// Interactive query — REST endpoint reads from RocksDB directly (sub-ms)
ReadOnlyKeyValueStore<String, Double> store = streams.store(
  StoreQueryParameters.fromNameAndType("revenue-store",
    QueryableStoreTypes.keyValueStore()));
double electronicsSales = store.get("electronics"); // no Kafka round-trip`,
          },
          { type: 'callout', variant: 'note', label: 'Key Takeaways — Section 8', items: [
            'Kafka Streams is a library — no separate cluster, scale by running more instances',
            'State lives in local RocksDB backed by changelog topics — fully fault-tolerant',
            'Interactive queries expose state store data via REST — eliminates a separate caching tier',
          ]},
        ]},
      ]},
      { type: 'divider' },
      { type: 'section', title: '9 — Windows & Joins', blocks: [
        { type: 'ss', title: '9.1 Window Types', blocks: [
          { type: 'table',
            headers: ['Window', 'Overlap?', 'Advances by', 'Example', 'Use case'],
            rows: [
              ['Tumbling', 'No',  'Window size', '1-min non-overlapping', 'Per-minute billing, hourly metrics'],
              ['Hopping',  'Yes', 'Advance < size', 'Size=5min, advance=1min', 'Rolling 5-min averages'],
              ['Session',  'No',  'Inactivity gap', 'Close after 30min idle', 'User sessions, click-stream'],
              ['Sliding',  'Yes', 'Every record',  'Last 5 min always', 'Fraud detection, real-time anomaly'],
            ]},
        ]},
        { type: 'ss', title: '9.2 Stream-Stream and Stream-Table Joins', blocks: [
          { type: 'p', md: '**Stream-Stream join** (`KStream.join(KStream, ...)`) requires a time window: records from both streams within the window are joined. Records outside the window are dropped. Use for matching events from two topics that belong together within a time boundary (e.g., match a payment event to its originating order within 5 minutes).' },
          { type: 'p', md: '**Stream-Table join** (`KStream.join(KTable, ...)`) looks up the current value in the KTable for each stream record\'s key. No window needed — uses the latest KTable value at join time. Use for enrichment: for each click event, look up the current user profile. The KTable is updated by a separate Kafka topic (e.g., user-profiles).' },
          { type: 'callout', variant: 'note', label: 'Key Takeaways — Section 9', items: [
            'Tumbling windows for billing/metrics; Hopping for rolling averages; Session for user journeys',
            'Stream-stream joins need a time window; stream-table joins use current state (no window)',
            'Use `.withGrace(Duration)` to accept late records; after grace period they are silently dropped',
          ]},
        ]},
      ]},
    ],
  },

  {
    part_index: 4, title: 'Schema Registry & Kafka Connect',
    blocks: [
      { type: 'ph', label: 'Part 5', title: 'Schema Registry & Kafka Connect', subtitle: 'Schema evolution with Avro/Protobuf, compatibility modes, Connect architecture, Debezium CDC, and DLQs' },
      { type: 'section', title: '10 — Schema Registry', blocks: [
        { type: 'ss', title: '10.1 Why Schema Management Matters', blocks: [
          { type: 'p', md: 'Without schema enforcement, a producer can add a new required field and break every consumer that deserializes the message. At 100 services, schema-less Kafka becomes a "schema by convention" system — and conventions break when teams don\'t communicate. Schema Registry enforces compatibility at write time: a producer attempting to register a schema that breaks backward compatibility receives a `409 Conflict` error before the first message is ever written.' },
        ]},
        { type: 'ss', title: '10.2 Avro, Protobuf, JSON Schema — When to Use Each', blocks: [
          { type: 'table',
            headers: ['Format', 'Encoding', 'Schema language', 'Evolution', 'Best for'],
            rows: [
              ['Avro',        'Binary',   '.avsc (JSON)',    'Excellent (default values)',   'Kafka native — smallest overhead per message'],
              ['Protobuf',    'Binary',   '.proto',          'Excellent (field numbers)',     'gRPC services, multi-language teams'],
              ['JSON Schema', 'Text/JSON','.json',           'Good (additive changes)',       'REST APIs bridged to Kafka, easy debugging'],
            ]},
          { type: 'callout', variant: 'note', label: 'Key Takeaways — Section 10', items: [
            'Always use BACKWARD compatibility (default) — deploy consumers before producers on schema changes',
            'Avro with Schema Registry adds only 5 bytes overhead per message (magic byte + schema ID)',
            'Schema Registry HA: run 3 instances pointing to the same Kafka cluster; schemas stored in `_schemas` topic',
          ]},
        ]},
      ]},
      { type: 'divider' },
      { type: 'section', title: '11 — Kafka Connect', blocks: [
        { type: 'ss', title: '11.1 Debezium CDC — Change Data Capture', blocks: [
          { type: 'p', md: 'Debezium tails the database transaction log (PostgreSQL WAL, MySQL binlog, MongoDB oplog) and emits one Kafka event per INSERT, UPDATE, and DELETE — in order, with full before and after state. Zero application code changes required. This is the cleanest approach to CDC: the database is unchanged, the data pipeline is driven by the immutable transaction log, and Kafka consumers get every change event in real-time.' },
          { type: 'code', desc: 'Deploy Debezium PostgreSQL CDC connector via REST API', lang: 'JSON', code:
`POST /connectors
{
  "name": "pg-orders-cdc",
  "config": {
    "connector.class":      "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname":    "postgres.internal",
    "database.dbname":      "orderdb",
    "database.user":        "debezium",
    "database.password":    "secret",
    "table.include.list":   "public.orders,public.line_items",
    "plugin.name":          "pgoutput",
    "topic.prefix":         "cdc",
    "slot.name":            "debezium_slot",
    "transforms":           "unwrap",
    "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",
    "errors.tolerance":     "all",
    "errors.deadletterqueue.topic.name": "dlq.cdc-orders"
  }
}`,
          },
          { type: 'callout', variant: 'note', label: 'Key Takeaways — Section 11', items: [
            'Always configure a DLQ (`errors.deadletterqueue.topic.name`) — silent drops are unacceptable in production',
            'Scale Connect workers horizontally — tasks auto-distribute across the worker cluster',
            'Debezium slot accumulates WAL until the connector catches up — monitor `pg_replication_slots` disk usage',
          ]},
        ]},
      ]},
    ],
  },

  {
    part_index: 5, title: 'Production Operations & Tuning',
    blocks: [
      { type: 'ph', label: 'Part 6', title: 'Production Operations & Tuning', subtitle: 'JVM and OS tuning, throughput optimization, Prometheus monitoring, rolling restarts, and the operations runbook' },
      { type: 'section', title: '12 — Performance Tuning', blocks: [
        { type: 'ss', title: '12.1 Producer Throughput Tuning', blocks: [
          { type: 'table',
            headers: ['Config', 'Default', 'High Throughput', 'Why'],
            rows: [
              ['batch.size',        '16384',    '131072',         'Larger batches per network flush'],
              ['linger.ms',         '0',        '10–20',          'Wait to fill the batch'],
              ['compression.type',  'none',     'lz4',            '2–3× less data on the wire'],
              ['buffer.memory',     '33554432', '134217728',      'More buffer = less back-pressure'],
              ['acks',              '1',        'all',            'Durability (never skip in production)'],
            ]},
        ]},
        { type: 'ss', title: '12.2 Broker OS and JVM Tuning', blocks: [
          { type: 'code', desc: 'Critical OS kernel settings for Kafka brokers (sysctl)', lang: 'Bash', code:
`# Allow OS to use more dirty pages before flushing to disk
sysctl -w vm.dirty_background_ratio=5
sysctl -w vm.dirty_ratio=60

# NEVER let Kafka swap — 30s+ GC pauses result from swapping
sysctl -w vm.swappiness=1

# Increase file descriptor limits (3 FDs per partition)
echo "kafka soft nofile 100000" >> /etc/security/limits.conf
echo "kafka hard nofile 100000" >> /etc/security/limits.conf`,
          },
          { type: 'code', desc: 'JVM flags for Kafka broker (kafka-server-start.sh)', lang: 'Bash', code:
`# Fixed heap — 6 GB on a 32 GB host; remaining 26 GB → OS page cache
export KAFKA_HEAP_OPTS="-Xms6g -Xmx6g"

export KAFKA_JVM_PERFORMANCE_OPTS="
  -server
  -XX:+UseG1GC
  -XX:MaxGCPauseMillis=20
  -XX:InitiatingHeapOccupancyPercent=35
  -XX:+ExplicitGCInvokesConcurrent"`,
          },
          { type: 'callout', variant: 'note', label: 'Key Takeaways — Section 12', items: [
            'Keep broker heap at 6 GB max — OS page cache is Kafka\'s primary performance mechanism',
            'Producer tuning impact order: compression > batch.size/linger.ms > buffer.memory > acks',
            'Set `vm.swappiness=1` — Kafka pause during swap can exceed session.timeout.ms and trigger consumer rebalances',
          ]},
        ]},
      ]},
      { type: 'divider' },
      { type: 'section', title: '13 — Monitoring & Observability', blocks: [
        { type: 'ss', title: '13.1 Key JMX Metrics and Alerting', blocks: [
          { type: 'table',
            headers: ['Metric', 'Healthy', 'Alert if', 'Severity'],
            rows: [
              ['ActiveControllerCount',        '1',    '≠ 1',    'CRITICAL'],
              ['UnderReplicatedPartitions',     '0',    '> 0',    'CRITICAL'],
              ['UnderMinIsrPartitionCount',     '0',    '> 0',    'CRITICAL'],
              ['OfflinePartitionsCount',        '0',    '> 0',    'CRITICAL'],
              ['RequestHandlerAvgIdlePercent',  '> 30%','< 10%',  'WARNING'],
              ['consumer_group_lag (external)', '< threshold', 'growing for 5 min', 'WARNING/CRITICAL'],
            ]},
          { type: 'code', desc: 'Prometheus alerting rules — consumer lag and under-replicated partitions', lang: 'YAML', code:
`groups:
  - name: kafka
    rules:
      - alert: KafkaUnderReplicatedPartitions
        expr: kafka_controller_kafkacontroller_underreplicatedpartitions > 0
        for: 1m
        labels: { severity: critical }
        annotations:
          summary: "{{ $labels.instance }} has under-replicated partitions"

      - alert: KafkaConsumerLagGrowing
        expr: rate(kafka_consumer_group_lag[10m]) > 1000
        for: 10m
        labels: { severity: warning }
        annotations:
          summary: "Consumer {{ $labels.group }} lag growing at {{ $value }}/min"`,
          },
          { type: 'callout', variant: 'note', label: 'Key Takeaways — Section 13', items: [
            'The two critical alerts: `UnderReplicatedPartitions > 0` and `ActiveControllerCount ≠ 1`',
            'Use burrow or kafka-consumer-groups.sh --describe to get per-partition lag, not just total lag',
          ]},
        ]},
      ]},
      { type: 'divider' },
      { type: 'section', title: '14 — Operations Runbook', blocks: [
        { type: 'ss', title: '14.1 Rolling Restart with Zero Downtime', blocks: [
          { type: 'code', desc: 'Safe rolling restart — one broker at a time', lang: 'Bash', code:
`# Step 1: Check cluster health — zero under-replicated partitions
kafka-topics.sh --bootstrap-server kafka:9092 --describe \\
  | grep -c "under-replicated"
# Must return 0

# Step 2: Graceful shutdown (triggers preferred leader election)
systemctl stop kafka

# Step 3: Make change (upgrade JAR, config update, disk expansion)

# Step 4: Restart broker
systemctl start kafka

# Step 5: Wait for FULL ISR recovery before touching the next broker
watch -n 5 'kafka-topics.sh --bootstrap-server kafka:9092 \\
  --describe | grep -c "under-replicated"'
# Proceed only when this returns 0`,
          },
        ]},
        { type: 'ss', title: '14.2 Common Production Failures', blocks: [
          { type: 'table',
            headers: ['Failure', 'Symptom', 'Root cause', 'Fix'],
            rows: [
              ['Consumer rebalance loop', 'Consumers join/leave every 30 s', 'Processing exceeds max.poll.interval.ms', 'Reduce max.poll.records or profile slow processing'],
              ['Disk full on broker', 'Producer writes rejected', 'Retention not configured; compaction stalled', 'Reduce retention; check log.cleaner threads'],
              ['NotEnoughReplicasException', 'Producer write errors', 'ISR < min.insync.replicas', 'Restore failed brokers; temporarily lower min.insync.replicas'],
              ['Network partition', 'UnderReplicatedPartitions > 0', 'Network issue between broker racks', 'Fix network; never enable unclean leader election'],
            ]},
          { type: 'callout', variant: 'note', label: 'Key Takeaways — Sections 12–14', items: [
            'Rolling restarts: wait for full ISR recovery between each broker — never rush this',
            'Always use `--throttle 52428800` (50 MB/s) during partition reassignment — unthrottled has crashed production clusters',
            'Consumer rebalance loops are almost always slow processing — profile before tuning timeouts',
            'Disk full is always avoidable with proper retention configuration and monitoring',
          ]},
        ]},
      ]},
    ],
  },
]
