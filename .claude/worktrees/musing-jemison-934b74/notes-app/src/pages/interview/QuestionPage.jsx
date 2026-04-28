import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getQuestionBySlug, DIFFICULTY_COLOR } from '../../data/interview'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

/* ── Shared animation variant ─────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

/* ──────────────────────────────────────────────────────── */
/*  Section card wrapper                                    */
/* ──────────────────────────────────────────────────────── */
function SectionCard({ title, children, delay = 0 }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay }}
      className="bg-white rounded-xl border border-line p-6 shadow-sm"
    >
      {title && (
        <h2 className="text-base font-bold text-navy mb-4 flex items-center gap-2">
          {title}
        </h2>
      )}
      {children}
    </motion.div>
  )
}

/* ──────────────────────────────────────────────────────── */
/*  QuestionPage                                            */
/* ──────────────────────────────────────────────────────── */
export default function QuestionPage() {
  const { categoryId, slug } = useParams()
  const navigate = useNavigate()
  const [hintsRevealed, setHintsRevealed] = useState(false)

  const result = getQuestionBySlug(categoryId, slug)

  /* 404 fallback */
  if (!result) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <p className="text-4xl mb-4">❓</p>
            <h2 className="text-2xl font-bold text-navy mb-2">Question not found</h2>
            <p className="text-muted mb-6">This question doesn&apos;t exist or has been removed.</p>
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

  const { question: q, category: cat, prevSlug, nextSlug, prevTitle, nextTitle } = result
  const dc = DIFFICULTY_COLOR[q.difficulty] ?? DIFFICULTY_COLOR.Easy

  const hasComplexity =
    q.timeComplexity && q.timeComplexity !== 'N/A' &&
    q.spaceComplexity && q.spaceComplexity !== 'N/A'

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ── Top breadcrumb bar ──────────────────────── */}
        <div className="bg-white border-b border-line">
          <div className="max-w-[860px] mx-auto px-5 sm:px-8 py-3">
            <nav className="flex items-center gap-1.5 text-sm text-muted flex-wrap">
              <Link to="/interview" className="hover:text-navy transition-colors">Interview</Link>
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              <Link
                to={`/interview/${cat.id}`}
                className="hover:text-navy transition-colors"
              >
                {cat.name}
              </Link>
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              <span className="text-navy font-medium truncate max-w-[200px]">{q.title}</span>
            </nav>
          </div>
        </div>

        {/* ── Content ─────────────────────────────────── */}
        <div className="max-w-[860px] mx-auto px-5 sm:px-8 py-10 flex flex-col gap-5">

          {/* ── Question header card ─────────────────── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl border border-line p-7 shadow-sm"
          >
            {/* Top: difficulty + companies */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              {/* Difficulty pill */}
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border"
                style={{
                  background:  dc.bg,
                  color:       dc.text,
                  borderColor: dc.border,
                }}
              >
                {q.difficulty}
              </span>

              {/* Company chips */}
              {q.companies?.slice(0, 4).map(c => (
                <span
                  key={c}
                  className="inline-flex items-center px-2.5 py-1 rounded-md bg-bg-base2 text-navy text-xs font-medium border border-line"
                >
                  {c}
                </span>
              ))}
              {q.companies?.length > 4 && (
                <span className="text-xs text-muted">+{q.companies.length - 4} more</span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-navy leading-snug mb-4">
              {q.title}
            </h1>

            {/* Tag chips */}
            {q.tags?.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-5">
                {q.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md text-xs text-muted bg-bg-base border border-line font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Complexity row */}
            {hasComplexity && (
              <div className="flex items-center gap-3 flex-wrap pt-4 border-t border-line">
                <span className="text-xs text-muted font-semibold uppercase tracking-wider">Complexity:</span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-base border border-line text-sm font-mono">
                  <span className="text-xs text-muted">Time</span>
                  <span className="text-navy font-semibold">{q.timeComplexity}</span>
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-base border border-line text-sm font-mono">
                  <span className="text-xs text-muted">Space</span>
                  <span className="text-navy font-semibold">{q.spaceComplexity}</span>
                </span>
              </div>
            )}
          </motion.div>

          {/* ── 1. Problem Description ───────────────── */}
          <SectionCard
            title={
              <>
                <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Problem Description
              </>
            }
            delay={0.05}
          >
            <p className="text-navy/80 leading-relaxed text-[15px]">{q.description}</p>
          </SectionCard>

          {/* ── 2. Hints ─────────────────────────────── */}
          {q.hints?.length > 0 && (
            <SectionCard
              title={
                <>
                  <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Hints
                  <span className="ml-auto text-xs font-normal text-muted">hover to reveal</span>
                </>
              }
              delay={0.1}
            >
              <ol className="flex flex-col gap-2">
                {q.hints.map((hint, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-lg bg-bg-base border border-line
                                transition-all duration-300 select-none
                                ${hintsRevealed ? '' : 'blur-sm hover:blur-none cursor-pointer'}`}
                    onClick={() => setHintsRevealed(true)}
                    title={hintsRevealed ? '' : 'Click to reveal all hints'}
                  >
                    <span
                      className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white mt-0.5"
                      style={{ background: cat.color }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-navy/80 text-sm leading-relaxed">{hint}</span>
                  </li>
                ))}
              </ol>
              {!hintsRevealed && (
                <button
                  onClick={() => setHintsRevealed(true)}
                  className="mt-3 text-xs font-semibold transition-colors"
                  style={{ color: cat.color }}
                >
                  Click any hint to reveal all →
                </button>
              )}
            </SectionCard>
          )}

          {/* ── 3. Answer ────────────────────────────── */}
          {q.answer && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="bg-white rounded-xl border border-line shadow-sm overflow-hidden"
            >
              {/* Green left border accent */}
              <div className="flex">
                <div className="w-1 flex-shrink-0 bg-emerald-500 rounded-l-xl" />
                <div className="flex-1 p-6">
                  <h2 className="text-base font-bold text-navy mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Answer
                  </h2>
                  <p className="text-navy/80 leading-relaxed text-[15px] whitespace-pre-line">
                    {q.answer}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── 4. Code Solution ─────────────────────── */}
          {q.code && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="rounded-xl overflow-hidden border border-line shadow-sm"
            >
              {/* Code block header */}
              <div className="bg-[#12123a] px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  <h2 className="text-white/80 text-xs font-semibold ml-2">Code Solution</h2>
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-md"
                  style={{ background: `${cat.color}30`, color: cat.color }}
                >
                  {cat.name.includes('SQL') ? 'SQL' : cat.name.includes('Python') ? 'Python' : 'JavaScript'}
                </span>
              </div>

              {/* Code block body */}
              <pre className="bg-[#1e1e3f] text-white rounded-b-xl p-5 font-mono text-sm overflow-x-auto whitespace-pre leading-relaxed">
                <code>{q.code}</code>
              </pre>
            </motion.div>
          )}

          {/* ── Navigation footer ────────────────────── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="flex items-stretch gap-3 pt-4"
          >
            {/* Previous */}
            <button
              onClick={() => prevSlug ? navigate(`/interview/${cat.id}/${prevSlug}`) : navigate(-1)}
              className={`flex-1 flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-left
                          ${prevSlug
                            ? 'bg-white border-line hover:border-navy hover:shadow-sm cursor-pointer'
                            : 'bg-bg-base border-line opacity-40 cursor-not-allowed'}`}
              disabled={!prevSlug && false /* still allow navigate(-1) */}
            >
              <svg className="w-4 h-4 text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <div className="min-w-0">
                <p className="text-xs text-muted mb-0.5">Previous</p>
                <p className="text-sm font-semibold text-navy truncate">
                  {prevTitle ?? 'Back'}
                </p>
              </div>
            </button>

            {/* Next */}
            <button
              onClick={() => nextSlug ? navigate(`/interview/${cat.id}/${nextSlug}`) : navigate(1)}
              className={`flex-1 flex items-center justify-end gap-3 px-4 py-3.5 rounded-xl border transition-all text-right
                          ${nextSlug
                            ? 'bg-white border-line hover:border-navy hover:shadow-sm cursor-pointer'
                            : 'bg-bg-base border-line opacity-40 cursor-not-allowed'}`}
            >
              <div className="min-w-0">
                <p className="text-xs text-muted mb-0.5">Next</p>
                <p className="text-sm font-semibold text-navy truncate">
                  {nextTitle ?? 'Forward'}
                </p>
              </div>
              <svg className="w-4 h-4 text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </motion.div>

          {/* Back to category */}
          <div className="text-center pb-4">
            <Link
              to={`/interview/${cat.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-navy transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to {cat.name}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
