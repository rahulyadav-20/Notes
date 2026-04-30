import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { INTERVIEW_CATEGORIES, DIFFICULTY_COLOR, loadInterviewTopics } from '../../data/interview/index.js'

/* ── Difficulty pill ── */
function DiffPill({ d, small }) {
  const c = DIFFICULTY_COLOR[d] || '#6b7280'
  return (
    <span className={`font-bold rounded-full ${small ? 'text-[0.6rem] px-2 py-0.5' : 'text-[0.68rem] px-2.5 py-1'}`}
      style={{ color: c, background: `color-mix(in srgb, ${c} 12%, var(--color-tint))` }}>
      {d}
    </span>
  )
}

/* ── Category track card ── */
function TrackCard({ cat, index, loaded }) {
  const navigate = useNavigate()

  const easy   = Math.round(cat.freeQuestions * 0.35)
  const medium = Math.round(cat.freeQuestions * 0.45)
  const hard   = cat.freeQuestions - easy - medium
  const total  = easy + medium + hard || 1

  return (
    <motion.div
      className="bg-white border border-line rounded-2xl p-5 cursor-pointer hover:border-[var(--color-line-hover)] hover:bg-base2 transition-all group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/interview/${cat.id}`)}>

      {/* Icon + name */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: `color-mix(in srgb, ${cat.color} 15%, var(--color-tint))` }}>
          {cat.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[0.88rem] font-extrabold text-navy leading-snug">
            {cat.name}
          </div>
          <div className="text-[0.67rem] text-muted mt-0.5">
            {loaded ? `${cat.totalQuestions} questions` : '—'}
          </div>
        </div>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          className="text-muted/40 group-hover:text-accent transition-colors shrink-0">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>

      {/* Description */}
      <p className="text-[0.75rem] text-muted leading-relaxed line-clamp-2 mb-4">
        {cat.desc}
      </p>

      {/* Difficulty distribution bar */}
      <div className="flex rounded-full overflow-hidden h-1.5 mb-2">
        <div className="bg-[#10B981]" style={{ width: `${(easy / total) * 100}%` }}/>
        <div className="bg-[#F59E0B] mx-[1px]" style={{ width: `${(medium / total) * 100}%` }}/>
        <div className="bg-[#EF4444]" style={{ width: `${(hard / total) * 100}%` }}/>
      </div>
      <div className="flex items-center gap-3 text-[0.62rem] font-semibold">
        <span style={{ color: '#10B981' }}>{easy} Easy</span>
        <span style={{ color: '#F59E0B' }}>{medium} Medium</span>
        <span style={{ color: '#EF4444' }}>{hard} Hard</span>
        <span className="ml-auto text-muted">{loaded ? `${cat.freeQuestions} free` : '—'}</span>
      </div>
    </motion.div>
  )
}

/* ── Featured question row ── */
const FEATURED = [
  { categoryId: 'dsa',          slug: 'two-sum',          title: 'Two Sum',                          difficulty: 'Easy',   companies: ['Amazon','Google','Meta'] },
  { categoryId: 'dsa',          slug: 'lru-cache',         title: 'LRU Cache',                        difficulty: 'Medium', companies: ['Amazon','Google','Meta'] },
  { categoryId: 'system-design',slug: 'design-url-shortener', title: 'Design a URL Shortener',        difficulty: 'Medium', companies: ['Amazon','Google','Meta','Uber'] },
  { categoryId: 'system-design',slug: 'design-rate-limiter',  title: 'Design a Rate Limiter',         difficulty: 'Hard',   companies: ['Amazon','Stripe','Cloudflare'] },
  { categoryId: 'sql',          slug: 'nth-salary',        title: 'Nth Highest Salary',               difficulty: 'Medium', companies: ['Amazon','Microsoft','Google'] },
  { categoryId: 'machine-learning', slug: 'class-imbalance', title: 'Handle Class Imbalance',        difficulty: 'Medium', companies: ['Google','Amazon','Stripe'] },
  { categoryId: 'behavioral',   slug: 'conflict-team',     title: 'Conflict With a Teammate',         difficulty: 'Medium', companies: ['Google','Amazon','Meta'] },
  { categoryId: 'data-engineering', slug: 'kafka-vs-rabbitmq', title: 'Kafka vs RabbitMQ',           difficulty: 'Medium', companies: ['Uber','Netflix','LinkedIn'] },
]

const TOP_COMPANIES = ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Netflix', 'Uber', 'Stripe']

function FeaturedRow({ item, index }) {
  const navigate = useNavigate()
  const diffColor = DIFFICULTY_COLOR[item.difficulty] || '#6b7280'

  return (
    <motion.div
      className="flex items-center gap-4 px-4 py-3 rounded-xl
        hover:bg-base2 transition-colors cursor-pointer group"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      onClick={() => navigate(`/interview/${item.categoryId}/${item.slug}`)}>

      <span className="text-[0.7rem] font-black text-muted/40 w-5 shrink-0">
        {index + 1}
      </span>
      <span className="flex-1 text-[0.85rem] font-semibold text-navy group-hover:text-accent transition-colors truncate">
        {item.title}
      </span>
      {item.companies?.slice(0, 2).map(c => (
        <span key={c} className="hidden sm:block text-[0.6rem] font-semibold
          px-1.5 py-0.5 rounded bg-base2 text-muted border border-line">
          {c}
        </span>
      ))}
      <DiffPill d={item.difficulty} small/>
    </motion.div>
  )
}

/* ── Interview landing page ── */
export default function Interview() {
  const navigate = useNavigate()
  const [categories,    setCategories]    = useState(INTERVIEW_CATEGORIES)
  const [topicsLoaded,  setTopicsLoaded]  = useState(false)

  useEffect(() => {
    loadInterviewTopics()
      .then(topics => {
        if (!topics?.length) return
        setCategories(INTERVIEW_CATEGORIES.map(cat => {
          const live = topics.find(t => t.slug === cat.id)
          return live ? {
            ...cat,
            totalQuestions: live.total_questions,
            freeQuestions:  live.free_questions,
            desc:           live.description || cat.desc,
          } : cat
        }))
        setTopicsLoaded(true)
      })
      .catch(() => setTopicsLoaded(true))
  }, [])

  const total = categories.reduce((s, c) => s + c.totalQuestions, 0)
  const free  = categories.reduce((s, c) => s + c.freeQuestions, 0)

  return (
    <>
      <Navbar />

      {/* ── Dark hero ── */}
      <div className="relative overflow-hidden bg-[#0c0c1e]">
        {/* Glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 left-1/3 w-[700px] h-[500px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #6366F1 0%, transparent 65%)' }}/>
          <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #EC4899 0%, transparent 65%)' }}/>
        </div>

        <div className="relative max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16 py-16 lg:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <p className="text-[0.68rem] font-bold uppercase tracking-[3px] text-accent mb-3">
              Interview Prep
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-[3rem] font-black text-white
              leading-tight mb-4 max-w-[700px]">
              Crack Every Interview,<br/>
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(90deg, #EC4899, #6366F1)' }}>
                From First Principles
              </span>
            </h1>
            <p className="text-[0.95rem] text-white/45 max-w-[460px] leading-relaxed mb-10">
              Real questions asked at Google, Amazon, Meta &amp; top startups —
              with full answers, hints, and production-grade code.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-8 flex-wrap">
              {[
                { num: topicsLoaded ? `${total}+` : '—', label: 'Questions' },
                { num: categories.length,                label: 'Topics'    },
                { num: topicsLoaded ? `${free}+`  : '—', label: 'Free'     },
                { num: '100%',     label: 'With Answers' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-[1.6rem] font-black text-white leading-none">{s.num}</div>
                  <div className="text-[0.68rem] text-white/35 font-semibold mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Companies asked at ── */}
      <div className="bg-base2 border-b border-line">
        <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16 py-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[0.7rem] font-bold text-muted uppercase tracking-wider shrink-0">
              Asked at:
            </span>
            {TOP_COMPANIES.map(c => (
              <span key={c} className="text-[0.72rem] font-semibold px-3 py-1 rounded-lg
                bg-base border border-line text-navy2">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Track cards ── */}
      <section className="py-12 lg:py-16 bg-base">
        <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16">
          <motion.div className="mb-8"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}>
            <h2 className="text-[1.3rem] font-black text-navy mb-1">
              Choose Your Track
            </h2>
            <p className="text-[0.82rem] text-muted">
              {INTERVIEW_CATEGORIES.length} tracks · {total}+ questions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <TrackCard key={cat.id} cat={cat} index={i} loaded={topicsLoaded}/>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured questions ── */}
      <section className="py-12 lg:py-16 bg-base2">
        <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[1.3rem] font-black text-navy mb-1">
                Top Interview Questions
              </h2>
              <p className="text-[0.78rem] text-muted">Most asked across top tech companies</p>
            </div>
          </div>

          <div className="bg-white border border-line rounded-2xl overflow-hidden">
            {FEATURED.map((item, i) => (
              <div key={item.slug} className={i < FEATURED.length - 1 ? 'border-b border-line' : ''}>
                <FeaturedRow item={item} index={i}/>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              className="px-8 py-3 rounded-xl font-bold text-[0.88rem]
                bg-base2 text-navy border border-line hover:bg-base hover:border-[var(--color-line-hover)] transition-all"
              onClick={() => navigate('/interview/dsa')}>
              Explore All Questions →
            </button>
          </div>
        </div>
      </section>

      {/* ── Share CTA ── */}
      <section className="py-12 bg-base border-t border-line">
        <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16">
          <motion.div
            className="rounded-2xl px-6 sm:px-12 py-12 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1a1a35, #1e1040)' }}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 50% 80% at 50% 0%, rgba(99,102,241,0.2) 0%, transparent 70%)' }}/>
            <div className="relative">
              <span className="inline-block bg-accent/15 border border-accent/30
                text-accent px-3 py-1 rounded-full text-[0.7rem] font-bold
                uppercase tracking-wide mb-4">
                Community
              </span>
              <h2 className="text-[1.6rem] sm:text-[2rem] font-black text-white mb-3">
                Got a fresh interview experience?
              </h2>
              <p className="text-[0.9rem] text-white/40 max-w-[400px] mx-auto mb-6 leading-relaxed">
                Share questions from your recent Google, Amazon or startup interview.
                Help the community and earn karma.
              </p>
              <button
                className="px-6 py-3 rounded-xl text-[0.9rem] font-bold text-white
                  bg-gradient-to-br from-accent to-accent2
                  shadow-[0_4px_16px_rgba(245,130,10,0.35)] hover:opacity-90 transition-opacity"
                onClick={() => navigate('/blog')}>
                Share Experience →
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  )
}
