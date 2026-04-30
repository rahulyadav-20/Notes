import Diagram  from './Diagram'
import IsoBox   from './IsoBox'
import IsoArrow from './IsoArrow'

/* ── Arrow-head marker shared by all diagrams ── */
function Defs() {
  return (
    <defs>
      <marker id="arr" markerWidth="9" markerHeight="7" refX="7" refY="3.5" orient="auto">
        <polygon points="0 0, 9 3.5, 0 7" fill="rgba(200,215,240,0.85)"/>
      </marker>
    </defs>
  )
}

/* ─────────────────────────────────────────────────────────
   KAFKA DIAGRAMS
───────────────────────────────────────────────────────── */

function KafkaClusterArchitecture() {
  return (
    <Diagram viewBox="0 0 760 240">
      <Defs/>
      <rect x="0" y="0" width="760" height="240" rx="10" fill="#0a0a22"/>
      <IsoBox x={20}  y={110} w={100} h={56} depth={20} color="#2ECC71" label="Producer"/>
      <IsoBox x={185} y={75}  w={128} h={76} depth={24} color="#4A90D9" label="Broker 1 (Leader)"/>
      <IsoBox x={360} y={75}  w={128} h={76} depth={24} color="#3a7fc1" label="Broker 2"/>
      <IsoBox x={535} y={75}  w={128} h={76} depth={24} color="#3a7fc1" label="Broker 3"/>
      <IsoBox x={340} y={10}  w={130} h={42} depth={16} color="#7C3AED" label="KRaft Controller"/>
      <IsoBox x={640} y={110} w={105} h={56} depth={20} color="#E6522C" label="Consumer Group"/>
      <line x1="120" y1="138" x2="185" y2="123" stroke="rgba(200,215,240,0.7)" strokeWidth="1.5" markerEnd="url(#arr)"/>
      <line x1="313" y1="113" x2="360" y2="113" stroke="rgba(200,215,240,0.5)" strokeWidth="1.5" markerEnd="url(#arr)" strokeDasharray="5,3"/>
      <line x1="488" y1="113" x2="535" y2="113" stroke="rgba(200,215,240,0.5)" strokeWidth="1.5" markerEnd="url(#arr)" strokeDasharray="5,3"/>
      <line x1="663" y1="113" x2="640" y2="128" stroke="rgba(74,144,217,0.9)"  strokeWidth="1.5" markerEnd="url(#arr)"/>
      <line x1="405" y1="52"  x2="249" y2="75"  stroke="rgba(124,58,237,0.5)"  strokeWidth="1"   markerEnd="url(#arr)" strokeDasharray="4,3"/>
      <line x1="405" y1="52"  x2="424" y2="75"  stroke="rgba(124,58,237,0.5)"  strokeWidth="1"   markerEnd="url(#arr)" strokeDasharray="4,3"/>
      <text x="148" y="132" fontSize="9" fill="rgba(200,215,240,0.6)" fontWeight="600">write</text>
      <text x="326" y="108" fontSize="9" fill="rgba(200,215,240,0.4)" fontWeight="600">replicate</text>
      <text x="660" y="122" fontSize="9" fill="rgba(74,144,217,0.8)"  fontWeight="600">fetch</text>
    </Diagram>
  )
}

function KafkaProducerFlow() {
  return (
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
  )
}

function KafkaIsrReplication() {
  return (
    <Diagram viewBox="0 0 660 240">
      <Defs/>
      <rect x="0" y="0" width="660" height="240" rx="10" fill="#0a0a22"/>
      <ellipse cx="250" cy="130" rx="215" ry="95"
        fill="rgba(74,144,217,0.07)" stroke="#4A90D9" strokeWidth="1.5" strokeDasharray="7,4"/>
      <text x="250" y="28" textAnchor="middle" fontSize="11" fill="#4A90D9" fontWeight="700">
        In-Sync Replicas (ISR)
      </text>
      <rect x="160" y="85" width="180" height="60" rx="8" fill="#4A90D9"/>
      <text x="250" y="111" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="800">Leader — Broker 1</text>
      <text x="250" y="129" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="10">LEO = 50,142</text>
      <rect x="60"  y="170" width="155" height="48" rx="8" fill="#2ECC71"/>
      <text x="137" y="192" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">Broker 2  ✓ ISR</text>
      <text x="137" y="207" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">LEO = 50,140</text>
      <rect x="430" y="150" width="200" height="48" rx="8" fill="#E6522C"/>
      <text x="530" y="172" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">Broker 3  ✗ Lagging</text>
      <text x="530" y="187" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">LEO = 49,800  (out of ISR)</text>
      <line x1="160" y1="140" x2="215" y2="155" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4,3"/>
      <text x="110" y="155" fontSize="9" fill="#F59E0B" fontWeight="700">HW = 50,140</text>
      <line x1="220" y1="145" x2="175" y2="170" stroke="rgba(74,144,217,0.7)"  strokeWidth="1.5" markerEnd="url(#arr)"/>
      <line x1="280" y1="145" x2="480" y2="150" stroke="rgba(230,80,50,0.4)"   strokeWidth="1.5" markerEnd="url(#arr)" strokeDasharray="5,3"/>
    </Diagram>
  )
}

/* ─────────────────────────────────────────────────────────
   REGISTRY — add new diagrams here as you write more notes
───────────────────────────────────────────────────────── */
export const DIAGRAM_REGISTRY = {
  'kafka-cluster-architecture': KafkaClusterArchitecture,
  'kafka-producer-flow':        KafkaProducerFlow,
  'kafka-isr-replication':      KafkaIsrReplication,
}
