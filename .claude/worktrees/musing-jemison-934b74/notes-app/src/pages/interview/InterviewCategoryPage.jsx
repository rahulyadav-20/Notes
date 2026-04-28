import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  getInterviewCategoryWithQuestions,
  DIFFICULTY_COLOR,
} from '../../data/interview'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

/* ── Shared animation variant ─────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

const FILTERS = ['All', 'Easy', 'Medium', 'Hard']

/* ──────────────────────────────────────────────────────── */
/*  QuestionCard                                            */
/* ──────────────────────────────────────────────────────── */
function QuestionCard({ q, cat }) {
  const navigate = useNavigate()

  const dc = DIFFICULTY_COLOR[q.difficulty] ?? DIFFICULTY_COLOR.Easy
  const overflowCompanies = q.companies.length > 3 ? q.companies.length - 3 : 0
  const visibleCompanies  = q.companies.slice(0, 3)

  const hasComplexity =
    q.timeComplexity && q.timeComplexity !== 'N/A' &&
    q.spaceComplexity && q.spaceComplexity !== 'N/A'

  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onClick={() => navigate(`/interview/${cat.id}/${q.slug}`)}
      className="card-accent group relative bg-white border border-line rounded-xl p-4 cursor-pointer
                 hover:border-[color:var(--nc)] hover:shadow-md transition-all duration-200 flex gap-3"
      style={{ '--nc': cat.color }}
    >
      {/* Left accent bar */}
      {cat.color && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: cat.color }}
        />
      )}

      <div className="flex-1 min-w-0 pl-1">
        {/* Top row: difficulty + companies */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          {/* Difficulty badge */}
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border"
            style={{
              background: dc.bg,
              color:      dc.text,
              borderColor: dc.border,
            }}
          >
            {q.difficulty}
          </span>

          {/* Company chips */}
          {visibleCompanies.map(company => (
            <span
              key={company}
              className="inline-flex items-center px-2 py-0.5 rounded-md bg-bg-base2 text-navy text-xs font-medium border border-line"
            >
              {company}
            </span>
          ))}
          {overflowCompanies > 0 && (
            <span className="text-xs text-muted font-medium">+{overflowCompanies} more</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-navy font-bold text-base leading-snug mb-2 group-hover:text-[color:var(--nc)] transition-colors">
          {q.title}
        </h3>

        {/* Tags */}
        {q.tags?.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            {q.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-xs text-muted bg-bg-base border border-line"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Bottom row: complexity + CTA */}
        <div className="flex items-center justify-between gap-2">
          {/* Complexity badges */}
          {hasComplexity && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-bg-base border border-line text-xs text-muted font-mono">
                <span className="text-[10px] font-normal text-muted/70">Time</span>
                {q.timeComplexity}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-bg-base border border-line text-xs text-muted font-mono">
                <span className="text-[10px] font-normal text-muted/70">Space</span>
                {q.spaceComplexity}
              </span>
            </div>
          )}
          {!hasComplexity && <div />}

          {/* View answer link */}
          <Link
            to={`/interview/${cat.id}/${q.slug}`}
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-xs font-semibold transition-colors hover:gap-1.5 flex-shrink-0"
            style={{ color: cat.color }}
          >
            View Answer
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

/* ──────────────────────────────────────────────────────── */
/*  InterviewCategoryPage                                   */
/* ──────────────────────────────────────────────────────── */
export default function InterviewCategoryPage() {
  const { categoryId } = useParams()
  const [activeDifficulty, setActiveDifficulty] = useState('All')

  const data = getInterviewCategoryWithQuestions(categoryId)

  /* 404 fallback */
  if (!data) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <h2 className="text-2xl font-bold text-navy mb-2">Category not found</h2>
            <p className="text-muted mb-6">This interview category doesn&apos;t exist.</p>
            <Link
              to="/interview"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#12123a] text-white text-sm font-semibold hover:bg-[#1a1a5e] transition-colors"
            >
              ← Back to Interview Prep
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const { questions, ...cat } = data

  /* Filter */
  const filtered = activeDifficulty === 'All'
    ? questions
    : questions.filter(q => q.difficulty === activeDifficulty)

  /* Hero stats */
  const counts = {
    Easy:   questions.filter(q => q.difficulty === 'Easy').length,
    Medium: questions.filter(q => q.difficulty === 'Medium').length,
    Hard:   questions.filter(q => q.difficulty === 'Hard').length,
  }

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero ────────────────────────────────────── */}
        <section className="bg-[#0a0e27] text-white pt-14 pb-12 relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${cat.color}, transparent 70%)`, transform: 'translate(30%, -30%)' }}
          />

          <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-white/40 mb-6">
              <Link to="/interview" className="hover:text-white/70 transition-colors">Interview</Link>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              <span className="text-white/70">{cat.name}</span>
            </nav>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-start gap-5">
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${cat.color}20`, border: `1px solid ${cat.color}40` }}
              >
                {cat.icon}
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-black mb-2">{cat.name}</h1>
                <p className="text-white/60 text-sm max-w-xl leading-relaxed">{cat.desc}</p>
              </div>
            </motion.div>

            {/* Stats row */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="flex items-center gap-6 flex-wrap mt-8"
            >
              {[
                { label: 'Total', value: questions.length, color: 'text-white' },
                { label: 'Easy',   value: counts.Easy,   color: 'text-emerald-400' },
                { label: 'Medium', value: counts.Medium, color: 'text-yellow-400' },
                { label: 'Hard',   value: counts.Hard,   color: 'text-red-400' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
                  <span className="text-white/40 text-xs uppercase tracking-widest">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Filter bar + questions ───────────────────── */}
        <section className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12 py-10">
          {/* Difficulty filter */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-8 flex-wrap"
          >
            <span className="text-sm text-muted font-medium mr-1">Filter:</span>
            {FILTERS.map(f => {
              const isActive = activeDifficulty === f
              return (
                <button
                  key={f}
                  onClick={() => setActiveDifficulty(f)}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200"
                  style={
                    isActive
                      ? {
                          background:   cat.color,
                          color:        '#fff',
                          borderColor:  cat.color,
                          boxShadow:    `0 2px 12px ${cat.color}40`,
                        }
                      : {
                          background:  '#fff',
                          color:       '#6b7280',
                          borderColor: '#e2e5f0',
                        }
                  }
                >
                  {f}
                </button>
              )
            })}

            {/* Result count */}
            <span className="ml-auto text-sm text-muted">
              {filtered.length} question{filtered.length !== 1 ? 's' : ''}
              {activeDifficulty !== 'All' && (
                <span style={{ color: cat.color }}> · {activeDifficulty}</span>
              )}
            </span>
          </motion.div>

          {/* Question list */}
          {filtered.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filtered.map((q, i) => (
                <motion.div
                  key={q.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
                >
                  <QuestionCard q={q} cat={cat} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-center py-16 text-muted"
            >
              <p className="text-4xl mb-3">🎯</p>
              <p className="font-semibold text-navy">No {activeDifficulty} questions yet</p>
              <p className="text-sm mt-1">Try a different difficulty filter.</p>
            </motion.div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
