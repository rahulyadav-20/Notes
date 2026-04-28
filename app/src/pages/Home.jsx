import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

/* ─────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────── */
const STATS = [
  { num: 21,  suffix: '+', label: 'Deep-Dive Guides'   },
  { num: 400, suffix: '+', label: 'Sections'           },
  { num: 6,   suffix: '',  label: 'Engineering Domains' },
  { num: 100, suffix: '%', label: 'Free to Read'        },
]

const FEATURES = [
  { icon: '🎯', color: '#4A90D9', title: 'Production-Grade Depth',
    desc: 'Every guide covers internals, edge cases, failure modes and real-world patterns used at scale in top engineering teams.',
    tag: 'No surface-level overviews' },
  { icon: '📊', color: '#8B5CF6', title: 'Visual Architecture Diagrams',
    desc: '3D isometric system diagrams for every major concept — understand how systems are wired together before diving into code.',
    tag: 'Coming with each guide' },
  { icon: '🗺️', color: '#1C7C54', title: 'Structured Learning Paths',
    desc: 'Organised by domain. Follow a clear progression from day one to principal engineer — each note builds on the previous.',
    tag: '6 curated domains' },
  { icon: '⚡', color: '#F59E0B', title: 'Always Free to Read',
    desc: 'All deep-dive notes are free, forever. No paywalls, no login walls, no timers. Open any guide and start learning right now.',
    tag: 'No account needed' },
]

const DOMAINS = [
  { icon: '🗄️', name: 'Data Engineering', count: 7, color: '#4A90D9', id: 'data-engineer' },
  { icon: '🔬', name: 'Data Science',      count: 3, color: '#8B5CF6', id: 'data-science'  },
  { icon: '🤖', name: 'AI & LLMs',         count: 4, color: '#1C7C54', id: 'ai'            },
  { icon: '⚙️', name: 'DevOps & Cloud',    count: 3, color: '#326CE5', id: 'devops'        },
  { icon: '🌐', name: 'Web Development',   count: 3, color: '#0EA5E9', id: 'frontend'      },
  { icon: '💻', name: 'Programming',       count: 3, color: '#F59E0B', id: 'programming'   },
]

const FEATURED = [
  { slug: 'kafka', name: 'Apache Kafka', icon: '⚡', color: '#4A90D9',
    parts: 6, freeUpTo: 2, sections: 22, category: 'data-engineer',
    tagline: 'Distributed event streaming — internals, replication & production ops',
    highlights: ['Consumer Groups & Offsets', 'ISR & Replication', 'Kafka Streams'] },
  { slug: 'machine-learning', name: 'Machine Learning', icon: '🤖', color: '#8B5CF6',
    parts: 6, freeUpTo: 2, sections: 24, category: 'data-science',
    tagline: 'From regression to ensemble methods — theory, code & production deploy',
    highlights: ['Supervised & Unsupervised', 'Gradient Boosting', 'MLOps & Monitoring'] },
  { slug: 'kubernetes', name: 'Kubernetes', icon: '🚀', color: '#326CE5',
    parts: 6, freeUpTo: 2, sections: 22, category: 'devops',
    tagline: 'Container orchestration — pods to production-grade cluster operations',
    highlights: ['Control Plane Architecture', 'Networking & Ingress', 'RBAC & Security'] },
  { slug: 'react', name: 'React.js', icon: '⚛️', color: '#0EA5E9',
    parts: 6, freeUpTo: 2, sections: 24, category: 'frontend',
    tagline: 'Hooks, state management, performance patterns & production React apps',
    highlights: ['Hooks In Depth', 'State Management', 'Performance & Testing'] },
]

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
   HERO ILLUSTRATION
───────────────────────────────────────────────────── */
function HeroIllustration() {
  return (
    <svg viewBox="0 0 520 420" xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[460px]" aria-hidden="true"
      style={{ filter: 'drop-shadow(0 16px 40px rgba(18,18,58,0.09))' }}>
      {[0,1,2,3,4].map(i => (
        <line key={`gx${i}`} x1={80+i*70} y1="310" x2={80+i*70-64} y2="380"
          stroke="#c8cde8" strokeWidth="1" opacity="0.4"/>
      ))}
      {[0,1,2].map(i => (
        <line key={`gy${i}`} x1="82" y1={318+i*20} x2="432" y2={318+i*20}
          stroke="#c8cde8" strokeWidth="1" opacity="0.25"/>
      ))}
      <polygon points="140,335 410,335 446,368 104,368" fill="#dde1f5"/>
      <polygon points="104,368 446,368 446,380 104,380" fill="#c5cae0"/>

      {/* Main server */}
      <motion.g animate={{y:[0,-5,0]}} transition={{duration:4,repeat:Infinity,ease:'easeInOut'}}>
        <polygon points="192,192 326,192 384,228 250,228" fill="#1e1e5f"/>
        <polygon points="192,192 250,228 250,316 192,280" fill="#12123a"/>
        <polygon points="326,192 384,228 384,316 326,280" fill="#28287a"/>
        <polygon points="192,280 250,316 250,330 192,294" fill="#0e0e2e"/>
        <polygon points="250,316 326,280 326,294 250,330" fill="#1a1a52"/>
        <polygon points="214,188 318,188 344,204 240,204" fill="#3636a8"/>
        <line x1="228" y1="194" x2="288" y2="194" stroke="#7070e0" strokeWidth="1.5"/>
        <motion.circle cx="362" cy="230" r="3" fill="#4ade80"
          animate={{opacity:[1,0.3,1]}} transition={{duration:2,repeat:Infinity}}/>
        <motion.circle cx="372" cy="230" r="3" fill="#f5820a"
          animate={{opacity:[0.3,1,0.3]}} transition={{duration:2,repeat:Infinity,delay:0.7}}/>
      </motion.g>

      {/* Orange box */}
      <motion.g animate={{y:[0,-4,0]}} transition={{duration:3.8,repeat:Infinity,ease:'easeInOut',delay:0.8}}>
        <polygon points="80,256 152,256 180,272 108,272" fill="#f5820a"/>
        <polygon points="80,256 108,272 108,328 80,312"  fill="#c96500"/>
        <polygon points="152,256 180,272 180,328 152,312" fill="#e07008"/>
      </motion.g>

      {/* Blue box */}
      <motion.g animate={{y:[0,-4,0]}} transition={{duration:4.2,repeat:Infinity,ease:'easeInOut',delay:1.5}}>
        <polygon points="340,236 408,236 434,252 366,252" fill="#0ea5e9"/>
        <polygon points="340,236 366,252 366,306 340,290" fill="#0880b8"/>
        <polygon points="408,236 434,252 434,306 408,290" fill="#0d96d8"/>
      </motion.g>

      {/* Floating cards */}
      <motion.g animate={{y:[0,-6,0]}} transition={{duration:5,repeat:Infinity,ease:'easeInOut',delay:0.3}}>
        <rect x="36" y="96" width="112" height="70" rx="10" fill="white"
          style={{filter:'drop-shadow(0 4px 14px rgba(18,18,58,0.12))'}}/>
        <rect x="50" y="112" width="32" height="6" rx="3" fill="#e8ebf7"/>
        <rect x="50" y="124" width="56" height="4" rx="2" fill="#e8ebf7"/>
        <rect x="50" y="134" width="44" height="4" rx="2" fill="#e8ebf7"/>
        <rect x="50" y="146" width="68" height="7" rx="3.5" fill="#f5820a" opacity="0.8"/>
      </motion.g>
      <motion.g animate={{y:[0,-6,0]}} transition={{duration:4.8,repeat:Infinity,ease:'easeInOut',delay:1.1}}>
        <rect x="376" y="78" width="118" height="76" rx="10" fill="white"
          style={{filter:'drop-shadow(0 4px 14px rgba(18,18,58,0.12))'}}/>
        <circle cx="396" cy="102" r="11" fill="#f5820a" opacity="0.12"/>
        <circle cx="396" cy="102" r="7"  fill="#f5820a"/>
        <rect x="412" y="95"  width="62" height="5" rx="2.5" fill="#e8ebf7"/>
        <rect x="412" y="106" width="46" height="4" rx="2"   fill="#e8ebf7"/>
        <rect x="384" y="118" width="95" height="3" rx="1.5" fill="#e8ebf7"/>
        <rect x="384" y="127" width="76" height="3" rx="1.5" fill="#e8ebf7"/>
      </motion.g>

      <line x1="148" y1="132" x2="192" y2="198" stroke="#c8cde8" strokeWidth="1.5" strokeDasharray="5,4"/>
      <line x1="434" y1="114" x2="382" y2="224" stroke="#c8cde8" strokeWidth="1.5" strokeDasharray="5,4"/>
    </svg>
  )
}

/* ─────────────────────────────────────────────────────
   SHARED CONTAINER  — tighter padding like real sites
───────────────────────────────────────────────────── */
function Container({ children, className = '' }) {
  return (
    <div className={`max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  )
}

/* fade-up used across all sections */
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

/* ─────────────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────────────── */
export default function Home() {
  const navigate    = useNavigate()
  const statsRef    = useRef(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' })

  return (
    <>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="bg-base">
        <Container className="py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-[1fr_440px]
          items-center gap-10 lg:gap-16">

          <motion.div className="flex flex-col"
            initial="hidden" animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>

            {/* Badge */}
            <motion.div variants={fadeUp}
              className="inline-flex items-center gap-2 bg-[rgba(245,130,10,0.08)]
                border border-[rgba(245,130,10,0.25)] text-accent
                px-3.5 py-1.5 rounded-full text-[0.72rem] font-bold
                uppercase tracking-[1px] mb-6 w-fit">
              <span className="w-[6px] h-[6px] rounded-full bg-accent shrink-0"
                style={{ animation:'pulse-dot 2s ease-in-out infinite' }}/>
              Engineering Knowledge Base
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeUp}
              className="text-[2rem] sm:text-[2.6rem] lg:text-[3rem] font-black
                text-navy leading-[1.12] tracking-[-1px] mb-5">
              Your Data Engineering,<br/>
              AI &amp; <span className="text-accent hero-highlight">Frontend</span><br/>
              Learning Partner
            </motion.h1>

            <motion.p variants={fadeUp}
              className="text-[0.97rem] text-muted leading-[1.8] w-full max-w-[480px] mb-7">
              Deep-dive guides from complete beginner to principal engineer.
              Internals, production patterns and real-world architecture — all free.
            </motion.p>

            {/* Bullets */}
            <motion.div variants={fadeUp} className="flex flex-col gap-2 mb-8">
              {[
                'First-principles guides to production-scale systems',
                '3D architecture diagrams with every guide',
                'Video courses & interview prep coming soon',
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2.5
                  text-[0.87rem] font-medium text-navy">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0"/>
                  {b}
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex gap-3 flex-wrap">
              <motion.button
                className="px-6 py-3 rounded-xl text-[0.9rem] font-bold text-white
                  bg-gradient-to-br from-accent to-accent2
                  shadow-[0_4px_16px_rgba(245,130,10,0.35)]"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/notes')}>
                Explore Notes →
              </motion.button>
              <motion.button
                className="px-6 py-3 rounded-xl text-[0.9rem] font-bold text-navy
                  bg-white border border-line hover:bg-base2 transition-colors"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                View Roadmap
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Illustration */}
          <motion.div className="hidden lg:flex justify-center"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}>
            <HeroIllustration />
          </motion.div>
        </Container>
      </section>

      {/* ── STATS ────────────────────────────────────── */}
      <div className="bg-white border-t border-b border-line" ref={statsRef}>
        <Container>
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {STATS.map((s, i) => (
              <motion.div key={s.label}
                className={`flex flex-col items-center justify-center py-5 sm:py-6 px-2
                  ${i === 1 ? 'border-r border-line sm:border-r-0' : ''}
                  ${i === 0 ? 'border-b border-r border-line sm:border-b-0 sm:border-r-0' : ''}
                  ${i === 2 ? 'border-b-0 sm:border-b-0' : ''}
                  ${i < 3 ? 'sm:border-r sm:border-line' : ''}
                `}
                initial={{ opacity: 0, y: 16 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}>
                <div className="text-[1.6rem] sm:text-[2.1rem] font-black text-accent leading-none mb-1">
                  <AnimatedCounter target={s.num} suffix={s.suffix}/>
                </div>
                <div className="text-[0.58rem] sm:text-[0.62rem] text-muted uppercase tracking-[1.5px]
                  font-semibold text-center leading-tight">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </div>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section className="py-16 lg:py-20 bg-base">
        <Container>
          <motion.div className="text-center mb-10"
            initial="hidden" whileInView="visible" variants={fadeUp}
            viewport={{ once: true }}>
            <p className="text-[0.68rem] font-bold uppercase tracking-[2.5px]
              text-accent mb-2">Why EngiNotes</p>
            <h2 className="text-[1.7rem] sm:text-[2rem] font-black text-navy tracking-tight">
              Not another tutorial site
            </h2>
            <p className="text-[0.9rem] text-muted max-w-[440px] mx-auto mt-3 leading-[1.75]">
              Built for engineers who want to understand how things
              <em> actually</em> work in production.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title}
                className="relative overflow-hidden bg-white border border-line
                  rounded-xl p-6 flex gap-4"
                initial="hidden" whileInView="visible" variants={fadeUp}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -3, boxShadow: '0 8px 32px rgba(18,18,58,0.08)' }}>
                <div className="absolute top-0 left-0 bottom-0 w-[3px] rounded-l-xl"
                  style={{ background: f.color }}/>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center
                  text-[1.3rem] shrink-0"
                  style={{ background:`color-mix(in srgb, ${f.color} 12%, #f5f7ff)` }}>
                  {f.icon}
                </div>
                <div className="flex flex-col flex-1">
                  <div className="text-[0.95rem] font-extrabold text-navy mb-1.5">{f.title}</div>
                  <div className="text-[0.82rem] text-muted leading-[1.7] mb-2.5">{f.desc}</div>
                  <span className="inline-block text-[0.65rem] font-bold
                    px-2.5 py-0.5 rounded-full w-fit"
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

      {/* ── DOMAINS ──────────────────────────────────── */}
      <section className="pb-16 bg-base">
        <Container>
          <motion.div className="text-center mb-8"
            initial="hidden" whileInView="visible" variants={fadeUp}
            viewport={{ once: true }}>
            <p className="text-[0.68rem] font-bold uppercase tracking-[2.5px]
              text-accent mb-2">What's Inside</p>
            <h2 className="text-[1.7rem] sm:text-[2rem] font-black text-navy tracking-tight">
              6 engineering domains
            </h2>
          </motion.div>

          <div className="flex flex-wrap gap-2.5 justify-center">
            {DOMAINS.map((d, i) => (
              <motion.button key={d.name}
                className="flex items-center gap-2 bg-white border border-line
                  rounded-full px-4 py-2 hover:bg-base2 transition-colors"
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/notes/${d.id}`)}>
                <span className="text-[1.1rem] leading-none">{d.icon}</span>
                <span className="text-[0.84rem] font-bold text-navy">{d.name}</span>
                <span className="text-[0.64rem] font-bold px-1.5 py-0.5 rounded-full"
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

      {/* ── FEATURED GUIDES ───────────────────────────── */}
      <section className="py-16 lg:py-20 bg-white">
        <Container>
          <motion.div className="text-center mb-10"
            initial="hidden" whileInView="visible" variants={fadeUp}
            viewport={{ once: true }}>
            <p className="text-[0.68rem] font-bold uppercase tracking-[2.5px]
              text-accent mb-2">Popular Guides</p>
            <h2 className="text-[1.7rem] sm:text-[2rem] font-black text-navy tracking-tight">
              Start here
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {FEATURED.map((note, i) => (
              <motion.div key={note.slug}
                className="relative overflow-hidden bg-base border border-line
                  rounded-xl flex flex-col cursor-pointer card-accent note-card-hover"
                style={{ '--nc': note.color }}
                initial="hidden" whileInView="visible" variants={fadeUp}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(18,18,58,0.10)' }}
                onClick={() => navigate(`/notes/${note.category}/${note.slug}`)}>

                <div className="p-5 flex flex-col gap-2.5 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[1.8rem] leading-none">{note.icon}</span>
                    <span className="text-[0.62rem] font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{
                        background: `color-mix(in srgb, ${note.color} 12%, #f0f2ff)`,
                        color:      `color-mix(in srgb, ${note.color} 85%, #333)`,
                      }}>
                      {note.freeUpTo} parts free
                    </span>
                  </div>
                  <div className="text-[0.97rem] font-extrabold text-navy">{note.name}</div>
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

          <motion.div className="text-center mt-8"
            initial="hidden" whileInView="visible" variants={fadeUp}
            viewport={{ once: true }}>
            <button
              className="px-6 py-3 rounded-xl text-[0.9rem] font-bold text-navy
                bg-white border border-line hover:bg-base2 transition-colors"
              onClick={() => navigate('/notes')}>
              View All 21+ Guides →
            </button>
          </motion.div>
        </Container>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="py-16 lg:py-20 bg-base">
        <Container>
          <motion.div
            className="relative overflow-hidden bg-navy rounded-2xl
              px-5 sm:px-10 lg:px-14 py-12 sm:py-14 text-center"
            initial="hidden" whileInView="visible" variants={fadeUp}
            viewport={{ once: true }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background:'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(245,130,10,0.15) 0%, transparent 70%)' }}/>
            <div className="relative">
              <span className="inline-block bg-[rgba(245,130,10,0.15)]
                border border-[rgba(245,130,10,0.3)] text-accent2
                px-3.5 py-1 rounded-full text-[0.7rem] font-bold
                uppercase tracking-[1px] mb-5">
                Free Forever
              </span>
              <h2 className="text-[1.7rem] sm:text-[2.2rem] font-black text-white
                tracking-tight mb-3">
                Ready to go deep?
              </h2>
              <p className="text-[0.92rem] text-white/50 max-w-[420px] mx-auto
                leading-[1.75] mb-8">
                No account needed. Open any guide and start learning right now.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <motion.button
                  className="px-6 py-3 rounded-xl text-[0.9rem] font-bold text-white
                    bg-gradient-to-br from-accent to-accent2
                    shadow-[0_4px_16px_rgba(245,130,10,0.35)]"
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/notes')}>
                  Browse All Notes →
                </motion.button>
                <motion.button
                  className="px-6 py-3 rounded-xl text-[0.9rem] font-bold
                    text-white/70 border border-white/20 hover:bg-white/8 transition-colors"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  View Roadmap
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
