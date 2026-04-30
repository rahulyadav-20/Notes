import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { api } from '../api/client'
/* ─────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────── */
const HOME_PREVIEW_QUESTIONS = [
  { slug: 'two-sum',              categoryId: 'dsa',           title: 'Two Sum',                      difficulty: 'Easy'   },
  { slug: 'best-time-buy-sell',   categoryId: 'dsa',           title: 'Best Time to Buy & Sell Stock', difficulty: 'Easy'  },
  { slug: 'design-url-shortener', categoryId: 'system-design', title: 'Design a URL Shortener',       difficulty: 'Medium' },
  { slug: 'nth-salary',           categoryId: 'sql',           title: 'Nth Highest Salary',           difficulty: 'Medium' },
  { slug: 'overfitting',          categoryId: 'machine-learning', title: 'How Do You Handle Overfitting?', difficulty: 'Medium' },
]
// STATS are now fetched from the backend — see usePlatformStats() below
const STATS_FALLBACK = [
  { num: 0,   suffix: '+', label: 'Deep-Dive Guides'    },
  { num: 0,   suffix: '+', label: 'Sections'             },
  { num: 0,   suffix: '+', label: 'Interview Questions'  },
  { num: 0,   suffix: 'h', label: 'Video Content'       },
  { num: 0,   suffix: '',  label: 'Engineering Domains'  },
  { num: 100, suffix: '%', label: 'Free to Read'         },
]

const FEATURES = [
  { icon: '🎯', color: '#4A90D9', title: 'Production-Grade Depth',
    desc: 'Internals, failure modes, edge cases and real-world patterns used at scale — not surface-level summaries.',
    tag: 'Zero fluff' },
  { icon: '📊', color: '#8B5CF6', title: 'Visual Architecture Diagrams',
    desc: '3D isometric system diagrams for every major concept — understand how systems connect before diving into code.',
    tag: 'With every guide' },
  { icon: '🎓', color: '#f5820a', title: 'Structured Video Courses',
    desc: 'End-to-end video courses with projects, quizzes and certificates for systematic learning from scratch.',
    tag: '14h+ of content' },
  { icon: '🏹', color: '#10B981', title: 'Interview Prep Suite',
    desc: 'LeetCode-style DSA problems, system design and behavioural questions — all tagged by company and difficulty.',
    tag: '500+ questions' },
]

const DOMAINS = [
  { icon: '🗄️', name: 'Data Engineering', count: 7,  color: '#4A90D9', id: 'data-engineer' },
  { icon: '🔬', name: 'Data Science',      count: 3,  color: '#8B5CF6', id: 'data-science'  },
  { icon: '🤖', name: 'AI & LLMs',         count: 4,  color: '#1C7C54', id: 'ai'            },
  { icon: '⚙️', name: 'DevOps & Cloud',    count: 3,  color: '#326CE5', id: 'devops'        },
  { icon: '🌐', name: 'Web Development',   count: 3,  color: '#0EA5E9', id: 'frontend'      },
  { icon: '💻', name: 'Programming',       count: 3,  color: '#F59E0B', id: 'programming'   },
]

const FEATURED = [
  { slug: 'kafka', name: 'Apache Kafka', icon: '⚡', color: '#4A90D9',
    parts: 6, sections: 22, category: 'data-engineer',
    tagline: 'Distributed event streaming — internals, replication & production ops',
    highlights: ['Consumer Groups & Offsets', 'ISR & Replication', 'Kafka Streams'] },
  { slug: 'machine-learning', name: 'Machine Learning', icon: '🤖', color: '#8B5CF6',
    parts: 6, sections: 24, category: 'data-science',
    tagline: 'From regression to ensemble methods — theory, code & production deploy',
    highlights: ['Supervised & Unsupervised', 'Gradient Boosting', 'MLOps & Monitoring'] },
  { slug: 'kubernetes', name: 'Kubernetes', icon: '🚀', color: '#326CE5',
    parts: 6, sections: 22, category: 'devops',
    tagline: 'Container orchestration — pods to production-grade cluster operations',
    highlights: ['Control Plane Architecture', 'Networking & Ingress', 'RBAC & Security'] },
  { slug: 'react', name: 'React.js', icon: '⚛️', color: '#0EA5E9',
    parts: 6, sections: 24, category: 'frontend',
    tagline: 'Hooks, state management, performance patterns & production React apps',
    highlights: ['Hooks In Depth', 'State Management', 'Performance & Testing'] },
]

const DIFF_COLOR = { Easy: '#10B981', Medium: '#F59E0B', Hard: '#EF4444' }

/* ─────────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────────── */
function AnimatedCounter({ target, suffix = '' }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const mv     = useMotionValue(0)
  const spring = useSpring(mv, { stiffness: 60, damping: 20 })
  const [display, setDisplay] = useState(0)
  useEffect(() => { if (inView) mv.set(target) }, [inView, target, mv])
  useEffect(() => spring.on('change', v => setDisplay(Math.round(v))), [spring])
  return <span ref={ref}>{display}{suffix}</span>
}

/* ─────────────────────────────────────────────────────
   HERO ILLUSTRATION  — enhanced
───────────────────────────────────────────────────── */
function HeroIllustration() {
  return (
    <svg viewBox="0 0 540 460" xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[480px]" aria-hidden="true"
      style={{ filter: 'drop-shadow(0 20px 48px rgba(18,18,58,0.10))' }}>

      {/* Grid floor */}
      {[0,1,2,3,4].map(i => (
        <line key={`gx${i}`} x1={90+i*72} y1="330" x2={90+i*72-66} y2="400"
          stroke="#c8cde8" strokeWidth="1" opacity="0.4"/>
      ))}
      {[0,1,2].map(i => (
        <line key={`gy${i}`} x1="88" y1={338+i*22} x2="448" y2={338+i*22}
          stroke="#c8cde8" strokeWidth="1" opacity="0.22"/>
      ))}
      <polygon points="152,348 420,348 456,382 116,382" fill="#dde1f5"/>
      <polygon points="116,382 456,382 456,395 116,395" fill="#c5cae0"/>

      {/* ── Main server block ── */}
      <motion.g animate={{y:[0,-6,0]}} transition={{duration:4.2,repeat:Infinity,ease:'easeInOut'}}>
        {/* Top face */}
        <polygon points="202,195 340,195 400,232 262,232" fill="#1e1e5f"/>
        {/* Left face */}
        <polygon points="202,195 262,232 262,325 202,288" fill="#12123a"/>
        {/* Right face */}
        <polygon points="340,195 400,232 400,325 340,288" fill="#28287a"/>
        {/* Bottom left */}
        <polygon points="202,288 262,325 262,340 202,303" fill="#0e0e2e"/>
        {/* Bottom right */}
        <polygon points="262,325 340,288 340,303 262,340" fill="#1a1a52"/>
        {/* Roof panel */}
        <polygon points="222,190 330,190 358,207 250,207" fill="#3636a8"/>
        {/* Roof line */}
        <line x1="238" y1="196" x2="302" y2="196" stroke="#7070e0" strokeWidth="1.5"/>
        {/* Status LEDs */}
        <motion.circle cx="378" cy="234" r="3.5" fill="#4ade80"
          animate={{opacity:[1,0.25,1]}} transition={{duration:1.8,repeat:Infinity}}/>
        <motion.circle cx="390" cy="234" r="3.5" fill="#f5820a"
          animate={{opacity:[0.25,1,0.25]}} transition={{duration:1.8,repeat:Infinity,delay:0.6}}/>
        <motion.circle cx="378" cy="248" r="3.5" fill="#60a5fa"
          animate={{opacity:[1,0.4,1]}} transition={{duration:2.4,repeat:Infinity,delay:1.1}}/>
        {/* Ventilation lines on right face */}
        {[0,1,2,3].map(i => (
          <line key={i}
            x1="352" y1={248+i*12} x2="393" y2={269+i*12}
            stroke="#3636a8" strokeWidth="1" opacity="0.6"/>
        ))}
      </motion.g>

      {/* ── Orange storage box ── */}
      <motion.g animate={{y:[0,-5,0]}} transition={{duration:3.8,repeat:Infinity,ease:'easeInOut',delay:0.9}}>
        <polygon points="84,268 162,268 192,286 114,286" fill="#f5820a"/>
        <polygon points="84,268 114,286 114,346 84,328"  fill="#c96500"/>
        <polygon points="162,268 192,286 192,346 162,328" fill="#e07008"/>
        {/* Label on top */}
        <text x="128" y="280" textAnchor="middle" fill="rgba(255,255,255,0.7)"
          fontSize="7" fontWeight="700" fontFamily="monospace">DB</text>
      </motion.g>

      {/* ── Blue cache box ── */}
      <motion.g animate={{y:[0,-5,0]}} transition={{duration:4.4,repeat:Infinity,ease:'easeInOut',delay:1.6}}>
        <polygon points="354,248 430,248 458,266 382,266" fill="#0ea5e9"/>
        <polygon points="354,248 382,266 382,322 354,304" fill="#0880b8"/>
        <polygon points="430,248 458,266 458,322 430,304" fill="#0d96d8"/>
        <text x="402" y="260" textAnchor="middle" fill="rgba(255,255,255,0.7)"
          fontSize="7" fontWeight="700" fontFamily="monospace">API</text>
      </motion.g>

      {/* ── Green small box ── */}
      <motion.g animate={{y:[0,-4,0]}} transition={{duration:3.5,repeat:Infinity,ease:'easeInOut',delay:2.2}}>
        <polygon points="434,190 490,190 510,202 454,202" fill="#10B981"/>
        <polygon points="434,190 454,202 454,240 434,228" fill="#0a7a60"/>
        <polygon points="490,190 510,202 510,240 490,228" fill="#0d9670"/>
      </motion.g>

      {/* ── Connection lines ── */}
      <line x1="192" y1="286" x2="202" y2="265" stroke="#c8cde8" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.8"/>
      <line x1="400" y1="258" x2="354" y2="264" stroke="#c8cde8" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.8"/>
      <line x1="400" y1="230" x2="434" y2="200" stroke="#c8cde8" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.6"/>

      {/* ── Floating UI card — left ── */}
      <motion.g animate={{y:[0,-7,0]}} transition={{duration:5.2,repeat:Infinity,ease:'easeInOut',delay:0.4}}>
        <rect x="28" y="88" width="122" height="82" rx="11" fill="white"
          style={{filter:'drop-shadow(0 6px 18px rgba(18,18,58,0.13))'}}/>
        {/* icon circle */}
        <circle cx="50" cy="112" r="10" fill="#f5820a" opacity="0.12"/>
        <circle cx="50" cy="112" r="6"  fill="#f5820a"/>
        {/* text lines */}
        <rect x="66" y="106" width="62" height="5" rx="2.5" fill="#e8ebf7"/>
        <rect x="66" y="116" width="46" height="4" rx="2"   fill="#e8ebf7"/>
        <rect x="38" y="128" width="94" height="3" rx="1.5" fill="#e8ebf7"/>
        <rect x="38" y="136" width="74" height="3" rx="1.5" fill="#e8ebf7"/>
        {/* CTA pill */}
        <rect x="38" y="148" width="72" height="12" rx="6" fill="#f5820a" opacity="0.75"/>
        <text x="74" y="158" textAnchor="middle" fill="white"
          fontSize="6" fontWeight="700" fontFamily="sans-serif">Explore Notes →</text>
      </motion.g>

      {/* ── Floating UI card — right ── */}
      <motion.g animate={{y:[0,-7,0]}} transition={{duration:4.9,repeat:Infinity,ease:'easeInOut',delay:1.3}}>
        <rect x="392" y="62" width="130" height="88" rx="11" fill="white"
          style={{filter:'drop-shadow(0 6px 18px rgba(18,18,58,0.13))'}}/>
        <rect x="406" y="78" width="40" height="6" rx="3" fill="#e8ebf7"/>
        <rect x="406" y="90" width="100" height="3.5" rx="1.5" fill="#e8ebf7"/>
        <rect x="406" y="99" width="84" height="3.5" rx="1.5" fill="#e8ebf7"/>
        {/* difficulty pills */}
        <rect x="406" y="112" width="28" height="10" rx="5" fill="#10B981" opacity="0.15"/>
        <text x="420" y="121" textAnchor="middle" fill="#10B981"
          fontSize="5.5" fontWeight="800" fontFamily="sans-serif">Easy</text>
        <rect x="440" y="112" width="36" height="10" rx="5" fill="#F59E0B" opacity="0.15"/>
        <text x="458" y="121" textAnchor="middle" fill="#F59E0B"
          fontSize="5.5" fontWeight="800" fontFamily="sans-serif">Medium</text>
        <rect x="406" y="126" width="96" height="3" rx="1.5" fill="#e8ebf7"/>
        <rect x="406" y="135" width="76" height="3" rx="1.5" fill="#e8ebf7"/>
      </motion.g>

      {/* Dashed connectors to cards */}
      <line x1="150" y1="129" x2="202" y2="210" stroke="#c8cde8" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.7"/>
      <line x1="456" y1="106" x2="398" y2="228" stroke="#c8cde8" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.7"/>
    </svg>
  )
}

/* ─────────────────────────────────────────────────────
   SHARED CONTAINER
───────────────────────────────────────────────────── */
function Container({ children, className = '' }) {
  return (
    <div className={`max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16 ${className}`}>
      {children}
    </div>
  )
}

const fadeUp = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

/* ─────────────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────────────── */
export default function Home() {
  const navigate    = useNavigate()
  const statsRef    = useRef(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' })
  const [liveStats, setLiveStats] = useState(null)
  const [topPosts,  setTopPosts]  = useState([])

  useEffect(() => {
    api.getPlatformStats().then(({ data }) => setLiveStats(data)).catch(() => {})
  }, [])

  useEffect(() => {
    api.getBlogPosts()
      .then(({ data }) => {
        // Normalize API flat fields → shape the template expects
        const posts = (data.posts || []).slice(0, 3).map(p => ({
          ...p,
          category: p.category_id,
          date:     p.published_at,
          readTime: p.read_time,
          author: {
            name:     p.author_name,
            initials: p.author_initials,
            color:    p.author_color,
          },
        }))
        setTopPosts(posts)
      })
      .catch(() => {})
  }, [])

  // Build stats from live data, fall back to 0 while loading
  const STATS = liveStats ? [
    { num: liveStats.notes.total,      suffix: '+', label: 'Deep-Dive Guides'   },
    { num: liveStats.notes.sections,   suffix: '+', label: 'Sections'            },
    { num: liveStats.questions.total,  suffix: '+', label: 'Interview Questions' },
    { num: 14,                         suffix: 'h', label: 'Video Content'      },
    { num: liveStats.notes.domains,    suffix: '',  label: 'Engineering Domains' },
    { num: 100,                        suffix: '%', label: 'Free to Read'        },
  ] : STATS_FALLBACK

  const previewQuestions = HOME_PREVIEW_QUESTIONS

  return (
    <>
      <Navbar />

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section className="bg-base overflow-hidden">
        <Container className="py-14 lg:py-22 grid grid-cols-1 lg:grid-cols-[1fr_480px]
          items-center gap-10 lg:gap-12">

          {/* Left */}
          <motion.div className="flex flex-col"
            initial="hidden" animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>

            {/* Badge */}
            <motion.div variants={fadeUp}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                text-[0.72rem] font-bold uppercase tracking-[1px] mb-6 w-fit border"
              style={{ background:'rgba(245,130,10,0.08)', borderColor:'rgba(245,130,10,0.28)', color:'#f5820a' }}>
              <motion.span className="w-[6px] h-[6px] rounded-full bg-accent shrink-0"
                animate={{ opacity:[1,0.25,1] }} transition={{ duration:2, repeat:Infinity }}/>
              Notes · Courses · Interview · Blog
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeUp}
              className="text-[2.2rem] sm:text-[2.9rem] lg:text-[3.4rem] font-black
                text-navy leading-[1.1] tracking-[-1.5px] mb-5">
              Your Engineering<br/>
              Learning Platform —<br/>
              <span className="text-accent">Built to Go Deep</span>
            </motion.h1>

            <motion.p variants={fadeUp}
              className="text-[0.97rem] text-muted leading-[1.85] max-w-[460px] mb-7">
              Deep-dive notes from internals to production. Video courses with real projects.
              {liveStats ? `${liveStats.questions.total}+ interview questions.` : "500+ interview questions."} A community blog from engineers who've been there.
            </motion.p>

            {/* Bullet points */}
            <motion.div variants={fadeUp} className="flex flex-col gap-2 mb-8">
              {[
                'First-principles guides with 3D architecture diagrams',
                'Covers Data Engineering, AI, DevOps, Web & more',
                'Interview prep and video courses — all in one place',
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2.5
                  text-[0.86rem] font-medium text-navy2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0"/>
                  {b}
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex gap-3 flex-wrap mb-7">
              <motion.button
                className="px-6 py-3 rounded-xl text-[0.9rem] font-bold text-white
                  bg-gradient-to-br from-accent to-accent2
                  shadow-[0_4px_18px_rgba(245,130,10,0.38)]"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/notes')}>
                Explore Notes →
              </motion.button>
              <motion.button
                className="px-6 py-3 rounded-xl text-[0.9rem] font-bold text-navy
                  bg-white border border-line hover:bg-base2 transition-colors"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/interview')}>
                Practice Interview
              </motion.button>
            </motion.div>

            {/* Social proof chips */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
              {[
                { icon: '✅', text: '100% Free Notes' },
                { icon: '🏢', text: 'Used at Google, Amazon, Flipkart' },
                { icon: '⚡', text: 'No sign-up needed' },
              ].map(c => (
                <span key={c.text}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                    bg-white border border-line
                    text-[0.72rem] font-semibold text-muted">
                  <span>{c.icon}</span>{c.text}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — illustration */}
          <motion.div className="hidden lg:flex justify-center items-center"
            initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <HeroIllustration />
          </motion.div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════════ */}
      <div className="bg-white border-t border-b border-line" ref={statsRef}>
        <Container>
          <div className="grid grid-cols-3 sm:grid-cols-6">
            {STATS.map((s, i) => (
              <motion.div key={s.label}
                className={`flex flex-col items-center justify-center py-5 px-2
                  ${i < 5 ? 'border-r border-line' : ''}`}
                initial={{ opacity: 0, y: 14 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.07 }}>
                <div className="text-[1.5rem] sm:text-[1.95rem] font-black text-accent leading-none mb-1">
                  <AnimatedCounter target={s.num} suffix={s.suffix}/>
                </div>
                <div className="text-[0.56rem] text-muted uppercase tracking-[1.5px]
                  font-semibold text-center leading-tight">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </div>

      {/* ══════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════ */}
      <section className="py-16 lg:py-20 bg-base">
        <Container>
          <motion.div className="text-center mb-10"
            initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
            <p className="text-[0.68rem] font-bold uppercase tracking-[2.5px] text-accent mb-2">
              Why EngiNotes
            </p>
            <h2 className="text-[1.75rem] sm:text-[2.1rem] font-black text-navy tracking-tight">
              Not another tutorial site
            </h2>
            <p className="text-[0.9rem] text-muted max-w-[420px] mx-auto mt-3 leading-[1.75]">
              Built for engineers who want to understand how things
              <em> actually</em> work in production.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title}
                className="relative overflow-hidden bg-white border border-line
                  rounded-2xl p-6 flex gap-4 group"
                initial="hidden" whileInView="visible" variants={fadeUp}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4, boxShadow: '0 10px 36px rgba(18,18,58,0.09)' }}>
                <div className="absolute top-0 left-0 bottom-0 w-[3px] rounded-l-2xl"
                  style={{ background: f.color }}/>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center
                  text-[1.4rem] shrink-0 transition-transform group-hover:scale-110"
                  style={{ background:`color-mix(in srgb, ${f.color} 12%, var(--color-tint))` }}>
                  {f.icon}
                </div>
                <div className="flex flex-col flex-1">
                  <div className="text-[0.97rem] font-extrabold text-navy mb-1.5">{f.title}</div>
                  <div className="text-[0.82rem] text-muted leading-[1.72] mb-3">{f.desc}</div>
                  <span className="inline-block text-[0.65rem] font-bold
                    px-2.5 py-1 rounded-full w-fit"
                    style={{
                      background: `color-mix(in srgb, ${f.color} 10%, #f0f2ff)`,
                      color:      `color-mix(in srgb, ${f.color} 85%, #333)`,
                    }}>
                    {f.tag}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════
          DOMAINS
      ══════════════════════════════════════════════ */}
      <section className="pb-16 bg-base">
        <Container>
          <motion.div className="text-center mb-8"
            initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
            <p className="text-[0.68rem] font-bold uppercase tracking-[2.5px] text-accent mb-2">
              What's Inside
            </p>
            <h2 className="text-[1.75rem] sm:text-[2.1rem] font-black text-navy tracking-tight">
              6 engineering domains
            </h2>
          </motion.div>

          <div className="flex flex-wrap gap-2.5 justify-center">
            {DOMAINS.map((d, i) => (
              <motion.button key={d.name}
                className="flex items-center gap-2 bg-white border border-line
                  rounded-full px-4 py-2.5 hover:bg-base2 hover:border-accent/30
                  transition-all shadow-sm"
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/notes/${d.id}`)}>
                <span className="text-[1.15rem] leading-none">{d.icon}</span>
                <span className="text-[0.85rem] font-bold text-navy">{d.name}</span>
                <span className="text-[0.64rem] font-bold px-1.5 py-0.5 rounded-full ml-0.5"
                  style={{
                    background: `color-mix(in srgb, ${d.color} 12%, #f0f2ff)`,
                    color:      `color-mix(in srgb, ${d.color} 80%, #333)`,
                  }}>
                  {d.count}
                </span>
              </motion.button>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURED GUIDES
      ══════════════════════════════════════════════ */}
      <section className="py-16 lg:py-20 bg-white">
        <Container>
          <motion.div className="flex items-end justify-between mb-10"
            initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[2.5px] text-accent mb-2">
                Popular Guides
              </p>
              <h2 className="text-[1.75rem] sm:text-[2.1rem] font-black text-navy tracking-tight">
                Start here
              </h2>
            </div>
            <button className="hidden sm:flex items-center gap-1.5 text-[0.85rem]
              font-bold text-accent hover:underline"
              onClick={() => navigate('/notes')}>
              View all 21+ →
            </button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED.map((note, i) => (
              <motion.div key={note.slug}
                className="relative overflow-hidden bg-base border border-line
                  rounded-2xl flex flex-col cursor-pointer group"
                initial="hidden" whileInView="visible" variants={fadeUp}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5, boxShadow: '0 14px 44px rgba(18,18,58,0.11)' }}
                onClick={() => navigate(`/notes/${note.category}/${note.slug}`)}>

                {/* Top color strip */}
                <div className="h-1 w-full rounded-t-2xl"
                  style={{ background: note.color }}/>

                <div className="p-5 flex flex-col gap-2.5 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[1.9rem] leading-none">{note.icon}</span>
                    <span className="text-[0.62rem] font-bold px-2 py-0.5 rounded-full shrink-0 mt-1"
                      style={{
                        background: `color-mix(in srgb, ${note.color} 12%, #f0f2ff)`,
                        color:      `color-mix(in srgb, ${note.color} 85%, #333)`,
                      }}>
                      Free
                    </span>
                  </div>
                  <div className="text-[0.97rem] font-extrabold text-navy group-hover:text-accent
                    transition-colors">{note.name}</div>
                  <div className="text-[0.78rem] text-muted leading-snug flex-1">{note.tagline}</div>
                  <div className="flex flex-col gap-1.5 pt-1">
                    {note.highlights.map((h, hi) => (
                      <div key={hi} className="flex items-center gap-2 text-[0.73rem] text-muted">
                        <div className="w-1 h-1 rounded-full shrink-0"
                          style={{ background: note.color }}/>
                        {h}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-line flex items-center justify-between">
                  <span className="text-[0.68rem] text-muted">
                    {note.parts} parts · {note.sections} sections
                  </span>
                  <div className="flex items-center gap-1 text-[0.76rem] font-bold"
                    style={{ color: note.color }}>
                    Read
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div className="text-center mt-8 sm:hidden"
            initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
            <button className="px-6 py-3 rounded-xl text-[0.9rem] font-bold text-navy
              bg-white border border-line hover:bg-base2 transition-colors"
              onClick={() => navigate('/notes')}>
              View All 21+ Guides →
            </button>
          </motion.div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════
          INTERVIEW PREP PREVIEW
      ══════════════════════════════════════════════ */}
      <section className="py-16 lg:py-20 bg-base">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 items-center">

            {/* Left — copy */}
            <motion.div initial="hidden" whileInView="visible"
              variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
              viewport={{ once: true }}>
              <motion.p variants={fadeUp}
                className="text-[0.68rem] font-bold uppercase tracking-[2.5px] text-[#10B981] mb-2">
                Interview Prep
              </motion.p>
              <motion.h2 variants={fadeUp}
                className="text-[1.75rem] sm:text-[2.1rem] font-black text-navy tracking-tight mb-4">
                {liveStats ? `${liveStats.questions.total}+ questions.` : "500+ questions."}<br/>Real companies. Explained.
              </motion.h2>
              <motion.p variants={fadeUp}
                className="text-[0.9rem] text-muted leading-[1.8] mb-6 max-w-[420px]">
                DSA, system design and behavioural questions — all tagged by difficulty and company.
                Every question has a clear explanation, not just a solution.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-7">
                {['DSA', 'System Design', 'Behavioural', 'Company-tagged', 'Easy → Hard'].map(t => (
                  <span key={t} className="text-[0.72rem] font-bold px-3 py-1.5 rounded-full
                    border border-[#10B981]/25 bg-[#10B981]/8"
                    style={{ color:'#10B981' }}>
                    {t}
                  </span>
                ))}
              </motion.div>
              <motion.div variants={fadeUp}>
                <motion.button
                  className="px-6 py-3 rounded-xl text-[0.9rem] font-bold text-white
                    bg-gradient-to-br from-[#10B981] to-[#059669]
                    shadow-[0_4px_16px_rgba(16,185,129,0.35)]"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/interview')}>
                  Start Practising →
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right — live question preview */}
            <motion.div
              className="bg-white border border-line rounded-2xl overflow-hidden
                shadow-[0_8px_32px_rgba(18,18,58,0.07)]"
              initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}>

              {/* Card header */}
              <div className="flex items-center justify-between px-5 py-3.5
                border-b border-line bg-base/60">
                <span className="text-[0.72rem] font-bold text-navy2 uppercase tracking-wider">
                  🎯 Interview Questions
                </span>
                <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full
                  bg-[#10B981]/12 text-[#10B981]">Live</span>
              </div>

              {/* Question rows */}
              {previewQuestions.map((q, i) => (
                <motion.div key={q.slug}
                  className="flex items-center gap-3 px-5 py-3.5 border-b border-line
                    last:border-0 hover:bg-base/50 transition-colors cursor-default"
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                  viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.06 }}>
                  <span className="text-[0.65rem] font-black text-muted/50 w-5 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: DIFF_COLOR[q.difficulty] || '#6b7280' }}/>
                  <span className="flex-1 text-[0.82rem] font-semibold text-navy truncate">
                    {q.title}
                  </span>
                  <span className="text-[0.63rem] font-bold px-2 py-0.5 rounded-full shrink-0"
                    style={{
                      color: DIFF_COLOR[q.difficulty],
                      background: `color-mix(in srgb, ${DIFF_COLOR[q.difficulty] || '#6b7280'} 12%, var(--color-tint))`,
                    }}>
                    {q.difficulty}
                  </span>
                </motion.div>
              ))}

              <div className="px-5 py-3 border-t border-line bg-base/40 flex items-center justify-between">
                <span className="text-[0.68rem] text-muted">{liveStats ? `${liveStats.questions.total}+ questions across ${liveStats.notes.domains} domains` : "500+ questions"}</span>
                <button className="text-[0.72rem] font-bold text-[#10B981] hover:underline"
                  onClick={() => navigate('/interview')}>
                  View all →
                </button>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════
          BLOG SPOTLIGHT
      ══════════════════════════════════════════════ */}
      <section className="py-16 lg:py-20 bg-white">
        <Container>
          <motion.div className="flex items-end justify-between mb-10"
            initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[2.5px] text-[#8B5CF6] mb-2">
                Community Blog
              </p>
              <h2 className="text-[1.75rem] sm:text-[2.1rem] font-black text-navy tracking-tight">
                From engineers, for engineers
              </h2>
            </div>
            <button className="hidden sm:flex items-center gap-1.5 text-[0.85rem]
              font-bold text-[#8B5CF6] hover:underline"
              onClick={() => navigate('/blog')}>
              All posts →
            </button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topPosts.map((post, i) => (
              <motion.div key={post.slug}
                className="bg-base border border-line rounded-2xl overflow-hidden
                  cursor-pointer group flex flex-col"
                initial="hidden" whileInView="visible" variants={fadeUp}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, boxShadow: '0 10px 36px rgba(18,18,58,0.09)' }}
                onClick={() => navigate(`/blog/${post.slug}`)}>

                {/* Category bar */}
                <div className="h-1 w-full"
                  style={{ background: post.category?.color || '#8B5CF6' }}/>

                <div className="p-5 flex flex-col flex-1">
                  <span className="text-[0.63rem] font-bold uppercase tracking-wider mb-3"
                    style={{ color: post.category?.color || '#8B5CF6' }}>
                    {post.category?.label || 'Article'}
                  </span>
                  <h3 className="text-[0.92rem] font-extrabold text-navy leading-snug
                    group-hover:text-accent transition-colors mb-2 flex-1">
                    {post.title}
                  </h3>
                  <p className="text-[0.78rem] text-muted leading-snug line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 mt-auto pt-3 border-t border-line">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center
                      text-[0.55rem] font-black text-white shrink-0"
                      style={{ background: post.author.color }}>
                      {post.author.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[0.72rem] font-bold text-navy truncate">
                        {post.author.name}
                      </div>
                      <div className="text-[0.62rem] text-muted">{post.readTime}</div>
                    </div>
                    <span className="ml-auto text-[0.65rem] font-bold text-muted">
                      {post.date}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════ */}
      <section className="py-16 lg:py-20 bg-base">
        <Container>
          <motion.div
            className="relative overflow-hidden bg-navy rounded-2xl
              px-6 sm:px-12 lg:px-16 py-14 text-center"
            initial="hidden" whileInView="visible" variants={fadeUp}
            viewport={{ once: true }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background:'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(245,130,10,0.18) 0%, transparent 70%)' }}/>

            <div className="relative">
              <span className="inline-block px-3.5 py-1 rounded-full text-[0.7rem]
                font-bold uppercase tracking-[1px] mb-5
                bg-[rgba(245,130,10,0.15)] border border-[rgba(245,130,10,0.3)] text-accent2">
                Free Forever
              </span>
              <h2 className="text-[1.8rem] sm:text-[2.3rem] font-black text-white
                tracking-tight mb-3">
                Ready to go deep?
              </h2>
              <p className="text-[0.93rem] text-white/50 max-w-[400px] mx-auto
                leading-[1.8] mb-8">
                No account needed. Open any guide and start learning right now.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <motion.button
                  className="px-7 py-3.5 rounded-xl text-[0.9rem] font-bold text-white
                    bg-gradient-to-br from-accent to-accent2
                    shadow-[0_4px_18px_rgba(245,130,10,0.4)]"
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/notes')}>
                  Browse All Notes →
                </motion.button>
                <motion.button
                  className="px-7 py-3.5 rounded-xl text-[0.9rem] font-bold
                    text-white/70 border border-white/20 hover:bg-white/8 transition-colors"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/interview')}>
                  Try Interview Prep
                </motion.button>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      <Footer />
    </>
  )
}
