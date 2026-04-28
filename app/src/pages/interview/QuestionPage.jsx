import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import {
  getQuestionBySlug,
  getInterviewCategoryWithQuestions,
  DIFFICULTY_COLOR,
} from '../../data/interview'

/* ── Difficulty badge ── */
function DiffBadge({ d }) {
  const c = DIFFICULTY_COLOR[d] || '#6b7280'
  return (
    <span className="text-[0.72rem] font-bold px-3 py-1 rounded-full"
      style={{ color: c, background: `color-mix(in srgb, ${c} 13%, #f5f7ff)` }}>
      {d}
    </span>
  )
}

/* ── Complexity chip ── */
function ComplexityChip({ label, value }) {
  return (
    <div className="flex items-center gap-1.5 text-[0.72rem] font-semibold
      bg-base rounded-lg px-3 py-1.5 border border-line">
      <span className="text-muted">{label}:</span>
      <code className="font-mono text-navy font-bold">{value}</code>
    </div>
  )
}

/* ── Left panel: problem description ── */
function ProblemPanel({ q, cat, hintsRevealed, setHintsRevealed }) {
  return (
    <div className="flex flex-col gap-5 h-full">

      {/* Title + badges */}
      <div>
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <DiffBadge d={q.difficulty}/>
          {q.companies?.slice(0, 3).map(c => (
            <span key={c} className="text-[0.65rem] font-semibold px-2.5 py-1
              rounded-md bg-base2 text-muted border border-line">
              {c}
            </span>
          ))}
          {q.companies?.length > 3 && (
            <span className="text-[0.65rem] text-muted font-semibold">
              +{q.companies.length - 3} more
            </span>
          )}
          {q.acceptance && q.acceptance !== 'N/A' && (
            <span className="text-[0.65rem] font-semibold text-muted ml-auto">
              {q.acceptance} acceptance
            </span>
          )}
        </div>

        <h1 className="text-[1.4rem] sm:text-[1.7rem] font-black text-navy leading-snug">
          {q.title}
        </h1>
      </div>

      {/* Complexity + tags */}
      {(q.timeComplexity || q.spaceComplexity || q.tags?.length > 0) &&
        q.timeComplexity !== 'N/A' && (
          <div className="flex items-center gap-2 flex-wrap">
            {q.timeComplexity && q.timeComplexity !== 'N/A' && (
              <ComplexityChip label="Time" value={q.timeComplexity}/>
            )}
            {q.spaceComplexity && q.spaceComplexity !== 'N/A' && (
              <ComplexityChip label="Space" value={q.spaceComplexity}/>
            )}
            {q.tags?.map(t => (
              <span key={t} className="text-[0.65rem] font-semibold px-2 py-1
                rounded-md bg-base border border-line text-navy2">
                {t}
              </span>
            ))}
          </div>
        )
      }

      {/* Problem description */}
      <div className="bg-base rounded-xl p-5 border border-line">
        <p className="text-[0.68rem] font-bold uppercase tracking-[2px] text-accent mb-3">
          Problem
        </p>
        <p className="text-[0.9rem] text-navy leading-[1.85]">
          {q.description}
        </p>
      </div>

      {/* Hints */}
      {q.hints?.length > 0 && (
        <div className="rounded-xl border border-line overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-base/50 border-b border-line">
            <span className="text-[0.68rem] font-bold uppercase tracking-[2px] text-amber-500">
              💡 Hints
            </span>
            <button
              className="text-[0.72rem] font-bold px-3 py-1 rounded-lg
                border border-line hover:bg-base2 transition-colors text-navy"
              onClick={() => setHintsRevealed(r => !r)}>
              {hintsRevealed ? 'Hide' : 'Reveal'}
            </button>
          </div>
          <div className="p-3 flex flex-col gap-2">
            {q.hints.map((hint, i) => (
              <div key={i}
                className={`flex items-start gap-3 p-3 rounded-lg bg-white
                  border border-line transition-all duration-300
                  ${hintsRevealed ? '' : 'blur-sm select-none pointer-events-none'}`}>
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600
                  text-[0.65rem] font-black flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-[0.82rem] text-navy/80 leading-relaxed">{hint}</p>
              </div>
            ))}
            {!hintsRevealed && (
              <p className="text-[0.7rem] text-muted text-center py-1">
                Click "Reveal" to see hints
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Right panel: solution ── */
function SolutionPanel({ q }) {
  const [tab, setTab] = useState(q.code ? 'answer' : 'answer')

  return (
    <div className="flex flex-col h-full">

      {/* Tab bar */}
      {q.code && (
        <div className="flex items-center gap-0 border-b border-line bg-base/30 shrink-0">
          {['answer', 'code'].map(t => (
            <button key={t}
              className={`px-5 py-3 text-[0.8rem] font-bold capitalize
                border-b-2 transition-colors ${tab === t
                  ? 'border-[#10B981] text-[#10B981]'
                  : 'border-transparent text-muted hover:text-navy'}`}
              onClick={() => setTab(t)}>
              {t === 'answer' ? '✅ Answer' : '💻 Code'}
            </button>
          ))}
        </div>
      )}

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex-1 overflow-y-auto">

          {tab === 'answer' && (
            <div className="p-5 sm:p-6">
              <p className="text-[0.68rem] font-bold uppercase tracking-[2px]
                text-[#10B981] mb-4">
                Solution
              </p>
              <p className="text-[0.9rem] text-navy leading-[1.9] whitespace-pre-line">
                {q.answer}
              </p>

              {/* If no code tab, show code here */}
              {!q.code && q.hints?.length === 0 && (
                <div className="mt-6 p-4 bg-base rounded-xl border border-line text-center text-muted text-sm">
                  This is a conceptual question — no code solution needed.
                </div>
              )}
            </div>
          )}

          {tab === 'code' && q.code && (
            <div className="flex flex-col h-full">
              {/* Code header */}
              <div className="flex items-center justify-between bg-[#1e1e3f] px-5 py-3 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f57]"/>
                  <span className="w-3 h-3 rounded-full bg-[#febc2e]"/>
                  <span className="w-3 h-3 rounded-full bg-[#28c840]"/>
                </div>
                <span className="text-[0.65rem] font-bold text-white/35 uppercase tracking-wider">
                  Python
                </span>
              </div>
              {/* Code body */}
              <pre className="flex-1 bg-[#1a1a2e] text-[#e2e8f0]
                text-[0.78rem] sm:text-[0.82rem] font-mono leading-[1.75]
                p-5 overflow-auto whitespace-pre">
                {q.code}
              </pre>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ── Question Page ── */
export default function QuestionPage() {
  const { categoryId, slug } = useParams()
  const navigate = useNavigate()
  const [hintsRevealed, setHintsRevealed] = useState(false)
  const [mobileView, setMobileView] = useState('problem') // 'problem' | 'solution'

  const q   = getQuestionBySlug(slug)
  const cat = getInterviewCategoryWithQuestions(categoryId)

  if (!q || !cat) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20 px-10 text-muted">
          <h2 className="text-2xl font-bold mb-5">Question not found</h2>
          <button className="px-6 py-3 rounded-xl border-2 border-line text-navy font-bold
            text-sm hover:bg-base2 transition-colors"
            onClick={() => navigate('/interview')}>
            ← Back to Interview
          </button>
        </div>
        <Footer />
      </>
    )
  }

  const qIndex = cat.questions.findIndex(x => x.slug === slug)
  const prevQ  = qIndex > 0 ? cat.questions[qIndex - 1] : null
  const nextQ  = qIndex < cat.questions.length - 1 ? cat.questions[qIndex + 1] : null

  return (
    <>
      <Navbar />

      {/* ── Top bar ── */}
      <div className="bg-[#0c0c1e] border-b border-white/8 sticky top-[68px] z-10">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-8 lg:px-12
          flex items-center gap-3 h-12 overflow-x-auto">

          {/* Breadcrumb */}
          <button className="text-[0.75rem] font-semibold text-white/30
            hover:text-white/60 transition-colors shrink-0"
            onClick={() => navigate('/interview')}>
            Interview
          </button>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            className="text-white/15 shrink-0">
            <path d="M9 18l6-6-6-6"/>
          </svg>
          <button className="text-[0.75rem] font-semibold text-white/30
            hover:text-white/60 transition-colors shrink-0"
            onClick={() => navigate(`/interview/${categoryId}`)}>
            {cat.name}
          </button>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            className="text-white/15 shrink-0">
            <path d="M9 18l6-6-6-6"/>
          </svg>
          <span className="text-[0.75rem] font-bold text-white/55 truncate">
            {q.title}
          </span>

          {/* Spacer */}
          <div className="flex-1"/>

          {/* Prev / Next nav */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.72rem]
                font-bold transition-colors ${prevQ
                  ? 'text-white/40 hover:text-white/70 hover:bg-white/8'
                  : 'text-white/15 cursor-default'}`}
              disabled={!prevQ}
              onClick={() => prevQ && navigate(`/interview/${categoryId}/${prevQ.slug}`)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Prev
            </button>
            <span className="text-[0.68rem] text-white/20 font-semibold">
              {qIndex + 1}/{cat.questions.length}
            </span>
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.72rem]
                font-bold transition-colors ${nextQ
                  ? 'text-white/40 hover:text-white/70 hover:bg-white/8'
                  : 'text-white/15 cursor-default'}`}
              disabled={!nextQ}
              onClick={() => nextQ && navigate(`/interview/${categoryId}/${nextQ.slug}`)}>
              Next
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile tab switcher ── */}
      <div className="lg:hidden bg-white border-b border-line sticky top-[68px+48px] z-9">
        <div className="flex">
          {['problem', 'solution'].map(v => (
            <button key={v}
              className={`flex-1 py-3 text-[0.82rem] font-bold capitalize
                border-b-2 transition-colors ${mobileView === v
                  ? 'border-navy text-navy'
                  : 'border-transparent text-muted'}`}
              onClick={() => setMobileView(v)}>
              {v === 'problem' ? '📋 Problem' : '✅ Solution'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Split layout ── */}
      <div className="flex bg-base" style={{ minHeight: 'calc(100vh - 180px)' }}>

        {/* LEFT — Problem (hidden on mobile when solution tab active) */}
        <motion.div
          className={`${mobileView === 'solution' ? 'hidden' : 'flex'} lg:flex
            flex-col w-full lg:w-[50%] xl:w-[52%] border-r border-line
            bg-white lg:sticky lg:top-[116px] lg:h-[calc(100vh-116px)] lg:overflow-y-auto`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}>
          <div className="p-5 sm:p-7">
            <ProblemPanel
              q={q}
              cat={cat}
              hintsRevealed={hintsRevealed}
              setHintsRevealed={setHintsRevealed}
            />
          </div>
        </motion.div>

        {/* RIGHT — Solution (hidden on mobile when problem tab active) */}
        <motion.div
          className={`${mobileView === 'problem' ? 'hidden' : 'flex'} lg:flex
            flex-col w-full lg:w-[50%] xl:w-[48%]
            lg:sticky lg:top-[116px] lg:h-[calc(100vh-116px)] lg:overflow-y-auto`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}>
          <SolutionPanel q={q}/>
        </motion.div>
      </div>

      {/* ── Bottom nav (mobile) ── */}
      <div className="lg:hidden bg-white border-t border-line px-4 py-3
        flex items-center justify-between">
        {prevQ ? (
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-line
              text-[0.8rem] font-bold text-navy hover:bg-base2 transition-colors"
            onClick={() => navigate(`/interview/${categoryId}/${prevQ.slug}`)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Previous
          </button>
        ) : <div/>}
        <span className="text-[0.72rem] text-muted font-semibold">
          {qIndex + 1} / {cat.questions.length}
        </span>
        {nextQ ? (
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-line
              text-[0.8rem] font-bold text-navy hover:bg-base2 transition-colors"
            onClick={() => navigate(`/interview/${categoryId}/${nextQ.slug}`)}>
            Next
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        ) : <div/>}
      </div>

      <Footer />
    </>
  )
}
