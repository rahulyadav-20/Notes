import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { getInterviewCategoryWithQuestions, DIFFICULTY_COLOR } from '../../data/interview'

/* ── Difficulty badge ── */
function DiffBadge({ d }) {
  const c = DIFFICULTY_COLOR[d] || '#6b7280'
  return (
    <span className="text-[0.7rem] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ color: c, background: `color-mix(in srgb, ${c} 12%, #f5f7ff)` }}>
      {d}
    </span>
  )
}

/* ── Question row (LeetCode-style) ── */
function QuestionRow({ q, cat, index }) {
  const navigate = useNavigate()
  const hascode  = Boolean(q.code)

  return (
    <motion.div
      className="group flex items-center gap-3 sm:gap-5 px-4 sm:px-6 py-4
        border-b border-line last:border-0 cursor-pointer
        hover:bg-base/60 transition-colors"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.2) }}
      onClick={() => navigate(`/interview/${cat.id}/${q.slug}`)}>

      {/* Row number */}
      <span className="text-[0.72rem] font-bold text-muted/60 w-6 shrink-0 text-right">
        {index + 1}
      </span>

      {/* Difficulty dot */}
      <span className="w-2 h-2 rounded-full shrink-0"
        style={{ background: DIFFICULTY_COLOR[q.difficulty] || '#6b7280' }}/>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[0.88rem] font-bold text-navy
            group-hover:text-accent transition-colors">
            {q.title}
          </span>
          {hascode && (
            <span className="hidden sm:inline text-[0.6rem] font-bold px-1.5 py-0.5
              rounded bg-navy/6 text-navy/40 border border-line">
              Code
            </span>
          )}
        </div>
        {/* Tags — visible on sm+ */}
        <div className="hidden sm:flex items-center gap-1.5 mt-1.5 flex-wrap">
          {q.tags?.slice(0, 3).map(t => (
            <span key={t} className="text-[0.6rem] font-semibold px-1.5 py-0.5
              rounded bg-base border border-line text-navy2">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Companies — desktop only */}
      <div className="hidden lg:flex items-center gap-1.5 shrink-0">
        {q.companies?.slice(0, 3).map(c => (
          <span key={c} className="text-[0.62rem] font-semibold px-2 py-0.5
            rounded bg-base2 text-muted border border-line">
            {c}
          </span>
        ))}
        {q.companies?.length > 3 && (
          <span className="text-[0.62rem] text-muted font-semibold">
            +{q.companies.length - 3}
          </span>
        )}
      </div>

      {/* Complexity — medium+ */}
      {q.timeComplexity && q.timeComplexity !== 'N/A' && (
        <span className="hidden md:block text-[0.65rem] font-mono font-bold
          px-2 py-1 rounded bg-navy/5 text-navy/50 shrink-0 whitespace-nowrap">
          {q.timeComplexity}
        </span>
      )}

      {/* Acceptance */}
      {q.acceptance && q.acceptance !== 'N/A' && (
        <span className="hidden lg:block text-[0.72rem] font-semibold text-muted
          shrink-0 w-12 text-right">
          {q.acceptance}
        </span>
      )}

      {/* Difficulty badge */}
      <div className="shrink-0">
        <DiffBadge d={q.difficulty}/>
      </div>

      {/* Arrow */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        className="text-muted/30 group-hover:text-accent/60 transition-colors shrink-0">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </motion.div>
  )
}

export default function InterviewCategoryPage() {
  const { categoryId } = useParams()
  const navigate       = useNavigate()
  const [filter, setFilter] = useState('All')

  const cat = getInterviewCategoryWithQuestions(categoryId)

  if (!cat) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20 px-10 text-muted">
          <h2 className="text-2xl font-bold mb-5">Category not found</h2>
          <button className="px-6 py-3 rounded-xl border-2 border-line text-navy
            font-bold text-sm hover:bg-base2 transition-colors"
            onClick={() => navigate('/interview')}>
            ← Back to Interview
          </button>
        </div>
        <Footer />
      </>
    )
  }

  const filtered = filter === 'All'
    ? cat.questions
    : cat.questions.filter(q => q.difficulty === filter)

  const countByDiff = d => cat.questions.filter(q => q.difficulty === d).length
  const totalLive   = cat.questions.length

  return (
    <>
      <Navbar />

      {/* ── Dark hero ── */}
      <div className="relative overflow-hidden bg-[#0c0c1e]">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 100% at 10% 50%, color-mix(in srgb, ${cat.color} 18%, transparent) 0%, transparent 60%)` }}/>

        <div className="relative max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12 py-10 lg:py-14">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[0.77rem] mb-6">
            <button className="text-white/35 hover:text-white/60 transition-colors font-semibold"
              onClick={() => navigate('/interview')}>
              Interview
            </button>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              className="text-white/20">
              <path d="M9 18l6-6-6-6"/>
            </svg>
            <span className="text-white/55 font-semibold">{cat.name}</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{cat.icon}</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {cat.name}
              </h1>
            </div>
            <p className="text-[0.88rem] text-white/40 max-w-[520px] leading-relaxed mb-6">
              {cat.desc}
            </p>

            {/* Difficulty breakdown */}
            <div className="flex items-center gap-4 flex-wrap">
              {[
                { d: 'Easy',   color: '#10B981' },
                { d: 'Medium', color: '#F59E0B' },
                { d: 'Hard',   color: '#EF4444' },
              ].map(({ d, color }) => (
                <div key={d} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }}/>
                  <span className="text-[0.72rem] font-bold" style={{ color }}>
                    {countByDiff(d)} {d}
                  </span>
                </div>
              ))}
              <span className="text-[0.72rem] text-white/25 font-semibold ml-2">
                {totalLive} live · {cat.totalQuestions - totalLive}+ coming soon
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Filter + table ── */}
      <section className="py-10 lg:py-14 bg-base">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12">

          {/* Filter + column headers */}
          <div className="bg-white border border-line rounded-2xl overflow-hidden">

            {/* Filter bar */}
            <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4
              border-b border-line flex-wrap bg-base/30">
              <div className="flex items-center gap-2">
                {['All', 'Easy', 'Medium', 'Hard'].map(d => {
                  const c = d === 'All' ? cat.color : DIFFICULTY_COLOR[d]
                  const isActive = filter === d
                  return (
                    <button key={d}
                      className="px-3.5 py-1.5 rounded-lg text-[0.78rem] font-bold
                        border transition-all"
                      style={isActive
                        ? { background: c, color: '#fff', borderColor: c, boxShadow: `0 2px 10px ${c}40` }
                        : { background: '#fff', color: d === 'All' ? '#6b7280' : DIFFICULTY_COLOR[d], borderColor: '#e2e5f0' }
                      }
                      onClick={() => setFilter(d)}>
                      {d}
                      {d !== 'All' && (
                        <span className={`ml-1.5 text-[0.65rem] ${isActive ? 'opacity-70' : 'opacity-50'}`}>
                          {countByDiff(d)}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
              <span className="text-[0.78rem] text-muted">
                {filtered.length} question{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Column headers — desktop */}
            <div className="hidden lg:flex items-center gap-5 px-6 py-2.5
              border-b border-line bg-base/20 text-[0.65rem] font-bold
              uppercase tracking-wider text-muted">
              <span className="w-6 text-right">#</span>
              <span className="w-2"/>
              <span className="flex-1">Title</span>
              <span className="w-48">Companies</span>
              <span className="w-24">Complexity</span>
              <span className="w-12 text-right">Accept.</span>
              <span className="w-16 text-right">Difficulty</span>
              <span className="w-4"/>
            </div>

            {/* Question list */}
            <AnimatePresence mode="wait">
              <motion.div key={filter}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                {filtered.length > 0
                  ? filtered.map((q, i) => (
                      <QuestionRow key={q.slug} q={q} cat={cat} index={i}/>
                    ))
                  : (
                    <div className="text-center py-16 text-muted">
                      <div className="text-4xl mb-3">🔍</div>
                      <p>No {filter} questions yet</p>
                    </div>
                  )
                }
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Coming soon notice */}
          <motion.div className="mt-6 text-center py-8 px-8 bg-white
            border-[1.5px] border-dashed border-line rounded-2xl"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <p className="text-[0.85rem] text-muted">
              <span className="font-bold text-navy">
                {cat.totalQuestions - totalLive}+ more questions
              </span>
              {' '}being added weekly.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  )
}
