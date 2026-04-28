/**
 * Brand-faithful colored SVG icons for every note slug.
 * All hand-crafted to match the real technology logos.
 */

/* ─── Apache Kafka — hollow hub-and-spoke nodes ─────── */
const KafkaIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Center node */}
    <circle cx="32" cy="32" r="8" stroke="#1a1a1a" strokeWidth="3.5" fill="none"/>
    {/* Top node */}
    <circle cx="32" cy="7"  r="6" stroke="#1a1a1a" strokeWidth="3" fill="none"/>
    {/* Right node */}
    <circle cx="57" cy="32" r="6" stroke="#1a1a1a" strokeWidth="3" fill="none"/>
    {/* Bottom node */}
    <circle cx="32" cy="57" r="6" stroke="#1a1a1a" strokeWidth="3" fill="none"/>
    {/* Left node */}
    <circle cx="7"  cy="32" r="6" stroke="#1a1a1a" strokeWidth="3" fill="none"/>
    {/* Spokes */}
    <line x1="32" y1="13"  x2="32" y2="24"  stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="51" y1="32"  x2="40" y2="32"  stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="32" y1="51"  x2="32" y2="40"  stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="13" y1="32"  x2="24" y2="32"  stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
)

/* ─── Apache Spark — orange star ────────────────────── */
const SparkIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M32 6 L37 24 L54 18 L43 33 L58 44 L39 42 L36 60 L28 43 L10 50 L22 36 L8 24 L27 28 Z"
      stroke="#E25A1C" strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round"
      fill="none"/>
  </svg>
)

/* ─── Apache Flink — vibrant pink/orange squirrel ───── */
const FlinkIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tailG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#FF6B00"/>
        <stop offset="50%"  stopColor="#FF9A3C"/>
        <stop offset="100%" stopColor="#FFD166"/>
      </linearGradient>
      <linearGradient id="bodyG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#C2185B"/>
        <stop offset="100%" stopColor="#E91E63"/>
      </linearGradient>
      <linearGradient id="headG" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#AD1457"/>
        <stop offset="100%" stopColor="#F06292"/>
      </linearGradient>
    </defs>

    {/* Big fluffy tail — back layer */}
    <path d="M58 85 Q92 70 88 36 Q84 10 64 14 Q74 34 70 54 Q66 68 58 78 Z"
      fill="url(#tailG)"/>
    {/* Tail highlight */}
    <path d="M60 82 Q88 68 84 38 Q80 16 67 19 Q75 37 72 56 Q69 69 62 78 Z"
      fill="#FFD166" opacity="0.5"/>
    {/* Tail inner stripe */}
    <path d="M63 78 Q84 66 80 42 Q77 24 68 26 Q74 42 71 58 Q69 68 64 76 Z"
      fill="#FF8C00" opacity="0.4"/>

    {/* Body */}
    <ellipse cx="42" cy="74" rx="20" ry="18" fill="url(#bodyG)"/>

    {/* Head */}
    <circle cx="40" cy="44" r="22" fill="url(#headG)"/>

    {/* Left ear outer */}
    <ellipse cx="25" cy="26" rx="9" ry="12" fill="#C2185B"/>
    {/* Left ear inner */}
    <ellipse cx="25" cy="27" rx="5.5" ry="8" fill="#FF80AB"/>

    {/* Right ear outer */}
    <ellipse cx="55" cy="26" rx="9" ry="12" fill="#C2185B"/>
    {/* Right ear inner */}
    <ellipse cx="55" cy="27" rx="5.5" ry="8" fill="#FF80AB"/>

    {/* Muzzle */}
    <ellipse cx="40" cy="52" rx="12" ry="9" fill="#F8BBD9"/>

    {/* Eyes */}
    <circle cx="32" cy="40" r="4.5" fill="#1C1C1C"/>
    <circle cx="48" cy="40" r="4.5" fill="#1C1C1C"/>
    <circle cx="33.2" cy="38.5" r="1.8" fill="white"/>
    <circle cx="49.2" cy="38.5" r="1.8" fill="white"/>

    {/* Nose */}
    <ellipse cx="40" cy="50" rx="3" ry="2.2" fill="#880E4F"/>
    {/* Mouth */}
    <path d="M36.5 53 Q40 57 43.5 53" stroke="#880E4F" strokeWidth="1.8"
      strokeLinecap="round" fill="none"/>

    {/* Left arm */}
    <path d="M26 76 Q16 82 20 92" stroke="#C2185B" strokeWidth="6" strokeLinecap="round"/>
    {/* Right arm */}
    <path d="M58 76 Q68 82 64 92" stroke="#C2185B" strokeWidth="6" strokeLinecap="round"/>

    {/* Acorn body */}
    <ellipse cx="43" cy="94" rx="8" ry="9" fill="#6D4C41"/>
    {/* Acorn lines */}
    <path d="M36 91 Q43 88 50 91" stroke="#4E342E" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
    <path d="M36 95 Q43 92 50 95" stroke="#4E342E" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>
    {/* Acorn cap */}
    <ellipse cx="43" cy="86.5" rx="10" ry="5" fill="#4E342E"/>
    {/* Acorn stem */}
    <line x1="43" y1="82" x2="44" y2="76" stroke="#4E342E" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
)

/* ─── Apache Druid — teal stylised D mark ────────────── */
const DruidIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Vertical bar of the D */}
    <rect x="10" y="10" width="9" height="44" rx="4.5" fill="#29ABE2"/>
    {/* Outer D curve */}
    <path d="M16 10 C16 10 54 10 54 32 C54 54 16 54 16 54"
      stroke="#29ABE2" strokeWidth="9" strokeLinecap="round" fill="none"/>
    {/* Inner cutout to make hollow D */}
    <path d="M19 20 C19 20 44 20 44 32 C44 44 19 44 19 44"
      stroke="white" strokeWidth="7" strokeLinecap="round" fill="none"/>
  </svg>
)

/* ─── Google Cloud — four colored squares + G shape ──── */
const GCPIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* G arc */}
    <path d="M44 28 L36 28 L36 33 L40 33 C39 37 36 40 31 40 C25 40 20 35 20 29 C20 23 25 18 31 18 C34 18 37 19.5 39 22 L43 18 C40 15 36 13 31 13 C22 13 14 21 14 30 C14 39 22 47 31 47 C40 47 47 40 47 31 C47 30 46.9 29 46.8 28 Z"
      fill="#4285F4"/>
    {/* Blue dot top right */}
    <circle cx="50" cy="12" r="6" fill="#4285F4"/>
    {/* Red dot top left */}
    <circle cx="14" cy="12" r="6" fill="#EA4335"/>
    {/* Yellow dot bottom left */}
    <circle cx="14" cy="52" r="6" fill="#FBBC05"/>
    {/* Green dot bottom right */}
    <circle cx="50" cy="52" r="6" fill="#34A853"/>
  </svg>
)

/* ─── PostgreSQL — blue elephant ─────────────────────── */
const PostgreSQLIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body */}
    <ellipse cx="32" cy="38" rx="18" ry="17" fill="#336791"/>
    {/* Head */}
    <circle cx="32" cy="22" r="14" fill="#336791"/>
    {/* Trunk */}
    <path d="M20 28 Q10 32 12 44 Q13 48 18 46" stroke="#336791" strokeWidth="7" strokeLinecap="round" fill="none"/>
    <path d="M20 28 Q10 32 12 44 Q13 48 18 46" stroke="#5b9bd5" strokeWidth="4" strokeLinecap="round" fill="none"/>
    {/* Ear */}
    <ellipse cx="44" cy="18" rx="8" ry="10" fill="#4a86b8"/>
    <ellipse cx="43" cy="19" rx="5" ry="7" fill="#336791"/>
    {/* Eye */}
    <circle cx="27" cy="19" r="3" fill="white"/>
    <circle cx="27" cy="19" r="1.8" fill="#1a1a1a"/>
    {/* Highlight */}
    <ellipse cx="32" cy="28" rx="8" ry="5" fill="#4a86b8" opacity="0.5"/>
    {/* Tusk */}
    <path d="M22 32 Q16 38 18 44" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  </svg>
)

/* ─── Machine Learning — neural net ─────────────────── */
const MachineLearningIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="20" r="5" fill="#8B5CF6"/>
    <circle cx="10" cy="44" r="5" fill="#8B5CF6"/>
    <circle cx="32" cy="12" r="5" fill="#7C3AED"/>
    <circle cx="32" cy="32" r="6" fill="#7C3AED"/>
    <circle cx="32" cy="52" r="5" fill="#7C3AED"/>
    <circle cx="54" cy="32" r="6" fill="#6D28D9"/>
    <line x1="15" y1="20" x2="27" y2="14" stroke="#8B5CF6" strokeWidth="1.8" opacity="0.7"/>
    <line x1="15" y1="20" x2="27" y2="30" stroke="#8B5CF6" strokeWidth="1.8" opacity="0.7"/>
    <line x1="15" y1="44" x2="27" y2="30" stroke="#8B5CF6" strokeWidth="1.8" opacity="0.7"/>
    <line x1="15" y1="44" x2="27" y2="50" stroke="#8B5CF6" strokeWidth="1.8" opacity="0.7"/>
    <line x1="37" y1="14" x2="49" y2="30" stroke="#7C3AED" strokeWidth="1.8" opacity="0.7"/>
    <line x1="38" y1="32" x2="48" y2="32" stroke="#7C3AED" strokeWidth="1.8" opacity="0.7"/>
    <line x1="37" y1="50" x2="49" y2="34" stroke="#7C3AED" strokeWidth="1.8" opacity="0.7"/>
  </svg>
)

/* ─── Deep Learning / PyTorch — orange flame ─────────── */
const DeepLearningIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 6 C32 6 18 22 18 36 C18 44.8 24.3 52 32 52 C39.7 52 46 44.8 46 36 C46 22 32 6 32 6Z"
      fill="#EE4C2C"/>
    <path d="M32 18 C32 18 23 30 23 38 C23 43.5 27 48 32 48 C37 48 41 43.5 41 38 C41 30 32 18 32 18Z"
      fill="#FF6B4A"/>
    <circle cx="27" cy="38" r="7" fill="#FF9A85"/>
    <circle cx="27" cy="38" r="4" fill="white" opacity="0.6"/>
  </svg>
)

/* ─── Statistics — bar chart with trend ─────────────── */
const StatisticsIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6"  y="42" width="10" height="16" rx="3" fill="#F59E0B"/>
    <rect x="20" y="30" width="10" height="28" rx="3" fill="#FBBF24"/>
    <rect x="34" y="18" width="10" height="40" rx="3" fill="#FCD34D"/>
    <rect x="48" y="34" width="10" height="24" rx="3" fill="#FDE68A"/>
    <path d="M8 26 Q20 12 34 18 Q46 24 56 10" stroke="#F59E0B" strokeWidth="2.5"
      strokeLinecap="round" fill="none"/>
    <circle cx="8"  cy="26" r="3" fill="#F59E0B"/>
    <circle cx="34" cy="18" r="3" fill="#F59E0B"/>
    <circle cx="56" cy="10" r="3" fill="#F59E0B"/>
  </svg>
)

/* ─── LangChain — green chain links ─────────────────── */
const LangChainIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4"  y="20" width="22" height="24" rx="8" stroke="#1C7C54" strokeWidth="4" fill="none"/>
    <rect x="38" y="20" width="22" height="24" rx="8" stroke="#1C7C54" strokeWidth="4" fill="none"/>
    <line x1="26" y1="32" x2="38" y2="32" stroke="#1C7C54" strokeWidth="4" strokeLinecap="round"/>
    <line x1="10" y1="32" x2="10" y2="32" stroke="#1C7C54" strokeWidth="4"/>
    <line x1="54" y1="32" x2="54" y2="32" stroke="#1C7C54" strokeWidth="4"/>
  </svg>
)

/* ─── LlamaIndex — orange llama ─────────────────────── */
const LlamaIndexIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body */}
    <ellipse cx="34" cy="48" rx="14" ry="12" fill="#F97316"/>
    {/* Neck */}
    <path d="M28 44 L24 28 Q24 18 30 16" stroke="#F97316" strokeWidth="8" strokeLinecap="round" fill="none"/>
    {/* Head */}
    <ellipse cx="34" cy="14" rx="10" ry="10" fill="#F97316"/>
    {/* Ear left */}
    <path d="M26 8 Q22 2 26 5" stroke="#F97316" strokeWidth="4" strokeLinecap="round"/>
    {/* Ear right */}
    <path d="M34 6 Q38 0 40 4" stroke="#F97316" strokeWidth="4" strokeLinecap="round"/>
    {/* Eye */}
    <circle cx="30" cy="12" r="2.5" fill="#7C2D12"/>
    <circle cx="30" cy="12" r="1.2" fill="#1a1a1a"/>
    {/* Nose */}
    <ellipse cx="34" cy="18" rx="3" ry="2" fill="#C2410C"/>
    {/* Legs */}
    <rect x="22" y="56" width="6" height="8" rx="3" fill="#EA580C"/>
    <rect x="34" y="56" width="6" height="8" rx="3" fill="#EA580C"/>
    {/* Tail */}
    <path d="M46 48 Q54 44 52 52" stroke="#F97316" strokeWidth="4" strokeLinecap="round" fill="none"/>
  </svg>
)

/* ─── OpenAI — bloom logo ────────────────────────────── */
const OpenAIIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 6 rounded petals rotated around center */}
    {[0,1,2,3,4,5].map(i => {
      const angle = (i * 60) * Math.PI / 180
      const cx = 32 + 14 * Math.cos(angle - Math.PI/2)
      const cy = 32 + 14 * Math.sin(angle - Math.PI/2)
      return (
        <ellipse key={i} cx={cx} cy={cy} rx="9" ry="5"
          fill="#1a1a1a"
          transform={`rotate(${i*60}, ${cx}, ${cy})`}
          opacity={0.7 + i * 0.05}/>
      )
    })}
    <circle cx="32" cy="32" r="7" fill="#1a1a1a"/>
  </svg>
)

/* ─── Kubernetes — blue helm wheel ───────────────────── */
const KubernetesIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="26" fill="#326CE5"/>
    <circle cx="32" cy="32" r="8" fill="white"/>
    <circle cx="32" cy="32" r="4" fill="#326CE5"/>
    {[0,1,2,3,4,5,6].map(i => {
      const angle = (i * 360/7 - 90) * Math.PI / 180
      const x1 = 32 + 8 * Math.cos(angle)
      const y1 = 32 + 8 * Math.sin(angle)
      const x2 = 32 + 22 * Math.cos(angle)
      const y2 = 32 + 22 * Math.sin(angle)
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
    })}
    {[0,1,2,3,4,5,6].map(i => {
      const angle = (i * 360/7 - 90) * Math.PI / 180
      const cx2 = 32 + 22 * Math.cos(angle)
      const cy2 = 32 + 22 * Math.sin(angle)
      return <circle key={i} cx={cx2} cy={cy2} r="3.5" fill="white"/>
    })}
  </svg>
)

/* ─── Docker — blue whale ────────────────────────────── */
const DockerIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Water */}
    <path d="M6 42 C14 36 22 48 30 42 C38 36 46 48 58 42 L58 58 L6 58 Z" fill="#0DB7ED" opacity="0.3"/>
    {/* Containers stacked */}
    <rect x="8"  y="24" width="10" height="8" rx="1.5" fill="#0DB7ED"/>
    <rect x="20" y="24" width="10" height="8" rx="1.5" fill="#0DB7ED"/>
    <rect x="32" y="24" width="10" height="8" rx="1.5" fill="#0DB7ED"/>
    <rect x="8"  y="14" width="10" height="8" rx="1.5" fill="#0DB7ED"/>
    <rect x="20" y="14" width="10" height="8" rx="1.5" fill="#0DB7ED"/>
    <rect x="20" y="4"  width="10" height="8" rx="1.5" fill="#0DB7ED"/>
    {/* Whale body */}
    <path d="M6 34 Q20 26 44 32 Q52 34 56 30 Q58 38 52 42 Q46 46 6 42 Z"
      fill="#0DB7ED"/>
    {/* Whale eye */}
    <circle cx="48" cy="35" r="2" fill="white"/>
    {/* Spout */}
    <path d="M52 30 Q54 22 58 20" stroke="#0DB7ED" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  </svg>
)

/* ─── CI/CD — pipeline cycle ─────────────────────────── */
const CICDIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M54 32 C54 44.15 44.15 54 32 54 C19.85 54 10 44.15 10 32 C10 19.85 19.85 10 32 10"
      stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
    <path d="M32 10 L44 10 L44 22" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="32" cy="32" r="10" fill="#F59E0B" opacity="0.15"/>
    <circle cx="32" cy="32" r="6" fill="#F59E0B"/>
    <path d="M29 30 L29 34 L35 32 Z" fill="white"/>
  </svg>
)

/* ─── React — cyan atom ───────────────────────────────── */
const ReactIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="32" rx="28" ry="11" stroke="#61DAFB" strokeWidth="3" fill="none"/>
    <ellipse cx="32" cy="32" rx="28" ry="11" stroke="#61DAFB" strokeWidth="3" fill="none"
      transform="rotate(60 32 32)"/>
    <ellipse cx="32" cy="32" rx="28" ry="11" stroke="#61DAFB" strokeWidth="3" fill="none"
      transform="rotate(120 32 32)"/>
    <circle cx="32" cy="32" r="5" fill="#61DAFB"/>
  </svg>
)

/* ─── JavaScript — yellow badge ──────────────────────── */
const JavaScriptIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="56" height="56" rx="6" fill="#F7DF1E"/>
    <path d="M22 46 C22 50 24 52 28 52 C32 52 34 50 34 44 L34 28 L28 28 L28 44 C28 47 27 48 25 48 C23 48 22.5 47 22 46 Z"
      fill="#1a1a1a"/>
    <path d="M38 46 C38.5 50 41 52 46 52 C51 52 54 49 54 45 C54 41 51.5 39 47 37.5 C44 36.5 43 35.8 43 34.5 C43 33.2 43.8 32.5 45.5 32.5 C47.2 32.5 48 33.3 48.5 35 L53.5 33.5 C52.5 29.5 50 28 45.5 28 C40.5 28 37.5 31 37.5 35.5 C37.5 39.5 40 41.5 44.5 43 C47.5 44 48.5 44.8 48.5 46.5 C48.5 48 47.5 49 45.5 49 C43.5 49 42.5 48 42 46 Z"
      fill="#1a1a1a"/>
  </svg>
)

/* ─── TypeScript — blue badge ────────────────────────── */
const TypeScriptIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="56" height="56" rx="6" fill="#3178C6"/>
    <path d="M14 28 L30 28 L30 34 L25 34 L25 54 L19 54 L19 34 L14 34 Z" fill="white"/>
    <path d="M36 46 C36.5 50 39 52 44 52 C49 52 52 49 52 45 C52 41 49.5 39 45 37.5 C42 36.5 41 35.8 41 34.5 C41 33.2 41.8 32.5 43.5 32.5 C45.2 32.5 46 33.3 46.5 35 L51.5 33.5 C50.5 29.5 48 28 43.5 28 C38.5 28 35.5 31 35.5 35.5 C35.5 39.5 38 41.5 42.5 43 C45.5 44 46.5 44.8 46.5 46.5 C46.5 48 45.5 49 43.5 49 C41.5 49 40.5 48 40 46 Z"
      fill="white"/>
  </svg>
)

/* ─── Python — blue & yellow snake ───────────────────── */
const PythonIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Blue snake head left */}
    <path d="M32 6 C20 6 14 12 14 20 L14 28 L32 28 L32 32 L10 32 L10 42 C10 50 16 58 28 58 L32 58 L32 54 C22 54 18 50 18 44 L18 36 L36 36 L36 24 C36 14 34 6 32 6Z"
      fill="#3776AB"/>
    {/* Yellow snake head right */}
    <path d="M32 58 C44 58 50 52 50 44 L50 36 L32 36 L32 32 L54 32 L54 22 C54 14 48 6 36 6 L32 6 L32 10 C42 10 46 14 46 20 L46 28 L28 28 L28 40 C28 50 30 58 32 58Z"
      fill="#FFD43B"/>
    {/* Eyes */}
    <circle cx="22" cy="18" r="3" fill="white"/>
    <circle cx="22" cy="18" r="1.5" fill="#1a1a1a"/>
    <circle cx="42" cy="46" r="3" fill="white"/>
    <circle cx="42" cy="46" r="1.5" fill="#1a1a1a"/>
  </svg>
)

/* ─── Data Modeling — stacked database cylinders ────── */
const DataModelingIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Top cylinder */}
    <ellipse cx="32" cy="14" rx="18" ry="7" fill="#7C3AED"/>
    <rect x="14" y="14" width="36" height="10" fill="#7C3AED"/>
    <ellipse cx="32" cy="24" rx="18" ry="7" fill="#6D28D9"/>
    {/* Middle cylinder */}
    <ellipse cx="32" cy="30" rx="18" ry="7" fill="#8B5CF6"/>
    <rect x="14" y="30" width="36" height="10" fill="#8B5CF6"/>
    <ellipse cx="32" cy="40" rx="18" ry="7" fill="#7C3AED"/>
    {/* Bottom cylinder */}
    <ellipse cx="32" cy="46" rx="18" ry="7" fill="#A78BFA"/>
    <rect x="14" y="46" width="36" height="10" fill="#A78BFA"/>
    <ellipse cx="32" cy="56" rx="18" ry="7" fill="#8B5CF6"/>
    {/* Shine line on each */}
    <path d="M20 13 Q32 10 44 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
    <path d="M20 29 Q32 26 44 29" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
    <path d="M20 45 Q32 42 44 45" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.2"/>
  </svg>
)

/* ─── System Design — architecture ───────────────────── */
const SystemDesignIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6"  y="6"  width="20" height="14" rx="3" fill="#6366F1"/>
    <rect x="38" y="6"  width="20" height="14" rx="3" fill="#6366F1" opacity="0.8"/>
    <rect x="20" y="44" width="24" height="14" rx="3" fill="#6366F1"/>
    <rect x="4"  y="36" width="18" height="12" rx="3" fill="#818CF8" opacity="0.7"/>
    <rect x="42" y="36" width="18" height="12" rx="3" fill="#818CF8" opacity="0.7"/>
    <line x1="16" y1="20" x2="13" y2="36" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/>
    <line x1="48" y1="20" x2="51" y2="36" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/>
    <line x1="13" y1="36" x2="32" y2="44" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/>
    <line x1="51" y1="36" x2="32" y2="44" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

/* ─── DSA — binary tree ──────────────────────────────── */
const DSAIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="10" r="7" fill="#EC4899"/>
    <circle cx="16" cy="32" r="6" fill="#EC4899" opacity="0.8"/>
    <circle cx="48" cy="32" r="6" fill="#EC4899" opacity="0.8"/>
    <circle cx="8"  cy="52" r="5" fill="#EC4899" opacity="0.6"/>
    <circle cx="24" cy="52" r="5" fill="#EC4899" opacity="0.6"/>
    <circle cx="40" cy="52" r="5" fill="#EC4899" opacity="0.6"/>
    <circle cx="56" cy="52" r="5" fill="#EC4899" opacity="0.6"/>
    <line x1="27" y1="14" x2="20" y2="26" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="37" y1="14" x2="44" y2="26" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="13" y1="37" x2="10" y2="47" stroke="#EC4899" strokeWidth="2" strokeLinecap="round"/>
    <line x1="19" y1="37" x2="22" y2="47" stroke="#EC4899" strokeWidth="2" strokeLinecap="round"/>
    <line x1="45" y1="37" x2="42" y2="47" stroke="#EC4899" strokeWidth="2" strokeLinecap="round"/>
    <line x1="51" y1="37" x2="54" y2="47" stroke="#EC4899" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

/* ─── GitHub Actions / CI-CD ─────────────────────────── */
const GitHubActionsIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="26" fill="#1a1a1a"/>
    <path d="M22 20 L22 44 M22 32 L34 26 L34 38 Z" stroke="white" strokeWidth="3"
      strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="44" cy="22" r="5" fill="#2EA043"/>
    <circle cx="44" cy="42" r="5" fill="#2EA043"/>
    <path d="M44 27 L44 37" stroke="#2EA043" strokeWidth="3" strokeLinecap="round"/>
    <path d="M34 32 L39 32" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
)

/* ─── Icon map: slug → React component ─────────────── */
export const NOTE_ICONS = {
  kafka:              ({ size, color }) => <KafkaIcon             size={size}/>,
  spark:              ({ size, color }) => <SparkIcon             size={size}/>,
  flink:              ({ size, color }) => <FlinkIcon             size={size}/>,
  druid:              ({ size, color }) => <DruidIcon             size={size}/>,
  gcp:                ({ size, color }) => <GCPIcon               size={size}/>,
  'data-modeling':    ({ size, color }) => <DataModelingIcon      size={size}/>,
  sql:                ({ size, color }) => <PostgreSQLIcon        size={size}/>,
  'machine-learning': ({ size, color }) => <MachineLearningIcon   size={size}/>,
  'deep-learning':    ({ size, color }) => <DeepLearningIcon      size={size}/>,
  statistics:         ({ size, color }) => <StatisticsIcon        size={size}/>,
  langchain:          ({ size, color }) => <LangChainIcon         size={size}/>,
  llamaindex:         ({ size, color }) => <LlamaIndexIcon        size={size}/>,
  'openai-api':       ({ size, color }) => <OpenAIIcon            size={size}/>,
  kubernetes:         ({ size, color }) => <KubernetesIcon        size={size}/>,
  docker:             ({ size, color }) => <DockerIcon            size={size}/>,
  cicd:               ({ size, color }) => <CICDIcon              size={size}/>,
  react:              ({ size, color }) => <ReactIcon             size={size}/>,
  javascript:         ({ size, color }) => <JavaScriptIcon        size={size}/>,
  typescript:         ({ size, color }) => <TypeScriptIcon        size={size}/>,
  python:             ({ size, color }) => <PythonIcon            size={size}/>,
  'system-design':    ({ size, color }) => <SystemDesignIcon      size={size}/>,
  dsa:                ({ size, color }) => <DSAIcon               size={size}/>,
  'github-actions':   ({ size, color }) => <GitHubActionsIcon     size={size}/>,
}

/** Renders the real icon for a note slug */
export function NoteIcon({ slug, size = 26, color }) {
  const Comp = NOTE_ICONS[slug]
  if (!Comp) return null
  return <Comp size={size} color={color}/>
}
