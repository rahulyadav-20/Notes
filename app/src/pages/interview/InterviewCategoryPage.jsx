import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { INTERVIEW_CATEGORIES, DIFFICULTY_COLOR, loadCategoryQuestions } from '../../data/interview/index.js'
import { api } from '../../api/client'
import { useAuth } from '../../hooks/useAuth'

/* ── Difficulty badge ── */
function DiffBadge({ d }) {
  const c = DIFFICULTY_COLOR[d] || '#6b7280'
  return (
    <span className="text-[0.7rem] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ color: c, background: `color-mix(in srgb, ${c} 12%, var(--color-tint))` }}>
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
              rounded bg-base2 text-muted border border-line">
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
          px-2 py-1 rounded bg-base2 text-muted shrink-0 whitespace-nowrap">
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
  const { isAdmin, isLoggedIn } = useAuth()

  // Filter state
  const [difficulty, setDifficulty] = useState('All')
  const [company,    setCompany]    = useState(null)
  const [tag,        setTag]        = useState(null)
  const [search,     setSearch]     = useState('')
  const [showMoreCo, setShowMoreCo] = useState(false)
  const [showMoreTag,setShowMoreTag] = useState(false)

  // Data state
  const [questions,  setQuestions]  = useState([])
  const [access,     setAccess]     = useState('free')
  const [loading,    setLoading]    = useState(true)
  const [liveCat,    setLiveCat]    = useState(null)

  const staticCat = INTERVIEW_CATEGORIES.find(c => c.id === categoryId)
  const cat = staticCat ? {
    ...staticCat,
    totalQuestions: liveCat?.total_questions ?? staticCat.totalQuestions,
    freeQuestions:  liveCat?.free_questions  ?? staticCat.freeQuestions,
    desc:           liveCat?.description     ?? staticCat.desc,
  } : null

  // Fetch all questions once on mount; filtering is client-side for snappy UX
  useEffect(() => {
    setLoading(true)
    setQuestions([])
    setDifficulty('All'); setCompany(null); setTag(null); setSearch('')
    Promise.all([
      api.getInterviewQuestions(categoryId),
      api.getInterviewTopics(),
    ])
      .then(([qRes, topicsRes]) => {
        setQuestions(qRes.data.questions || [])
        setAccess(qRes.data.access || 'free')
        const topic = topicsRes.data.topics.find(t => t.slug === categoryId)
        if (topic) setLiveCat(topic)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [categoryId])

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

  // Build company + tag lists from loaded questions (sorted by frequency)
  const allCompanies = [...new Map(
    questions.flatMap(q => q.companies || []).reduce((m, c) => {
      m.set(c, (m.get(c) || 0) + 1); return m
    }, new Map())
  ).entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c)

  const allTags = [...new Map(
    questions.flatMap(q => q.tags || []).reduce((m, t) => {
      m.set(t, (m.get(t) || 0) + 1); return m
    }, new Map())
  ).entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t)

  // Client-side filtering
  const filtered = questions.filter(q => {
    if (difficulty !== 'All' && q.difficulty !== difficulty)         return false
    if (company && !(q.companies || []).includes(company))           return false
    if (tag     && !(q.tags     || []).includes(tag))               return false
    if (search.trim() && !q.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const countByDiff = d => questions.filter(q => q.difficulty === d).length
  const totalLive   = questions.length
  const hasFilters  = difficulty !== 'All' || company || tag || search.trim()

  const CO_LIMIT  = showMoreCo  ? allCompanies.length : 6
  const TAG_LIMIT = showMoreTag ? allTags.length      : 8

  return (
    <>
      <Navbar />

      {/* ── Dark hero ── */}
      <div className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 100% at 10% 50%, color-mix(in srgb, ${cat.color} 18%, transparent) 0%, transparent 60%)` }}/>

        <div className="relative max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16 py-10 lg:py-14">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[0.77rem] mb-6">
            <button className="text-white/50 hover:text-white/80 transition-colors font-semibold"
              onClick={() => navigate('/interview')}>
              Interview
            </button>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              className="text-white/30">
              <path d="M9 18l6-6-6-6"/>
            </svg>
            <span className="text-white/80 font-semibold">{cat.name}</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{cat.icon}</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {cat.name}
              </h1>
            </div>
            <p className="text-[0.88rem] text-white/55 max-w-[520px] leading-relaxed mb-6">
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
              <span className="text-[0.72rem] text-white/50 font-semibold ml-2">
                {totalLive} live · {cat.totalQuestions - totalLive}+ coming soon
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Filter + table ── */}
      <section className="py-10 lg:py-14 bg-base">
        <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16">

          {/* Filter + table */}
          <div className="bg-white border border-line rounded-2xl overflow-hidden">

            {/* ── Filter bar ── */}
            <div className="px-4 sm:px-6 py-4 border-b border-line bg-base/30 flex flex-col gap-3">

              {/* Row 1: search + count + clear */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-[320px]">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted/50"
                    width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search questions…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 rounded-lg border border-line text-[0.82rem]
                      text-navy placeholder:text-muted/50 outline-none bg-white
                      focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all"
                  />
                </div>
                <span className="text-[0.78rem] text-muted ml-auto whitespace-nowrap">
                  {filtered.length} of {totalLive}
                </span>
                {hasFilters && (
                  <button
                    onClick={() => { setDifficulty('All'); setCompany(null); setTag(null); setSearch('') }}
                    className="text-[0.72rem] font-bold text-accent hover:opacity-70 transition-opacity whitespace-nowrap">
                    Clear ×
                  </button>
                )}
              </div>

              {/* Row 2: difficulty */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[0.63rem] font-bold uppercase tracking-wider text-muted/60 w-16 shrink-0">
                  Difficulty
                </span>
                {['All', 'Easy', 'Medium', 'Hard'].map(d => {
                  const c = d === 'All' ? cat.color : DIFFICULTY_COLOR[d]
                  const isActive = difficulty === d
                  return (
                    <button key={d}
                      className="px-3 py-1 rounded-lg text-[0.75rem] font-bold border transition-all"
                      style={isActive
                        ? { background: c, color: '#fff', borderColor: c }
                        : { background: '#fff', color: d === 'All' ? '#6b7280' : DIFFICULTY_COLOR[d], borderColor: '#e2e5f0' }
                      }
                      onClick={() => setDifficulty(d)}>
                      {d}
                      {d !== 'All' && (
                        <span className={`ml-1 text-[0.62rem] ${isActive ? 'opacity-70' : 'opacity-50'}`}>
                          {countByDiff(d)}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Row 3: company chips */}
              {allCompanies.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[0.63rem] font-bold uppercase tracking-wider text-muted/60 w-16 shrink-0">
                    Company
                  </span>
                  {allCompanies.slice(0, CO_LIMIT).map(c => (
                    <button key={c}
                      onClick={() => setCompany(company === c ? null : c)}
                      className={`px-2.5 py-1 rounded-lg text-[0.72rem] font-semibold border transition-all
                        ${company === c
                          ? 'bg-navy text-white border-navy'
                          : 'bg-white text-muted border-line hover:border-[var(--color-line-hover)]'}`}>
                      {c}
                    </button>
                  ))}
                  {allCompanies.length > 6 && (
                    <button onClick={() => setShowMoreCo(s => !s)}
                      className="text-[0.7rem] font-bold text-accent hover:opacity-70 transition-opacity">
                      {showMoreCo ? 'less' : `+${allCompanies.length - 6} more`}
                    </button>
                  )}
                </div>
              )}

              {/* Row 4: tag chips */}
              {allTags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[0.63rem] font-bold uppercase tracking-wider text-muted/60 w-16 shrink-0">
                    Tag
                  </span>
                  {allTags.slice(0, TAG_LIMIT).map(t => (
                    <button key={t}
                      onClick={() => setTag(tag === t ? null : t)}
                      className={`px-2.5 py-1 rounded-lg text-[0.72rem] font-semibold border transition-all
                        ${tag === t
                          ? 'bg-[#6366F1] text-white border-[#6366F1]'
                          : 'bg-white text-muted border-line hover:border-[var(--color-line-hover)]'}`}>
                      {t}
                    </button>
                  ))}
                  {allTags.length > 8 && (
                    <button onClick={() => setShowMoreTag(s => !s)}
                      className="text-[0.7rem] font-bold text-accent hover:opacity-70 transition-opacity">
                      {showMoreTag ? 'less' : `+${allTags.length - 8} more`}
                    </button>
                  )}
                </div>
              )}
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
              <motion.div key={`${difficulty}-${company}-${tag}-${search}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
                {filtered.length > 0
                  ? filtered.map((q, i) => (
                      <QuestionRow key={q.slug} q={q} cat={cat} index={i}/>
                    ))
                  : (
                    <div className="text-center py-16 text-muted">
                      <div className="text-4xl mb-3">🔍</div>
                      <p className="font-semibold mb-2">No questions match your filters</p>
                      <button
                        onClick={() => { setDifficulty('All'); setCompany(null); setTag(null); setSearch('') }}
                        className="text-[0.8rem] font-bold text-accent hover:opacity-70 transition-opacity">
                        Clear filters
                      </button>
                    </div>
                  )
                }
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Purchase banner — shown when user has free access only */}
          {access === 'free' && !isAdmin && (
            <motion.div
              className="mt-6 relative overflow-hidden rounded-2xl border border-accent/30
                bg-gradient-to-br from-accent/5 to-[color-mix(in_srgb,#6366F1_6%,white)] p-6 sm:p-8"
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-2xl shrink-0">
                  🔒
                </div>
                <div className="flex-1">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[2px] text-accent mb-1">
                    {cat.totalQuestions - totalLive > 0
                      ? `${cat.totalQuestions - totalLive}+ more questions locked`
                      : 'Full answers locked'}
                  </p>
                  <h3 className="text-[1rem] font-extrabold text-navy mb-1">
                    Unlock all {cat.totalQuestions}+ questions with full answers
                  </h3>
                  <p className="text-[0.78rem] text-muted leading-relaxed">
                    Get complete answers, hints, code solutions and complexity analysis.
                    Valid for <strong className="text-navy">2 years</strong> from purchase.
                  </p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => navigate(
                      isLoggedIn
                        ? `/checkout?type=interview&topicSlug=${categoryId}`
                        : `/login?redirect=/checkout?type=interview%26topicSlug=${categoryId}`
                    )}
                    className="px-6 py-3 rounded-xl font-bold text-[0.9rem] text-white
                      bg-gradient-to-br from-accent to-accent2
                      shadow-[0_4px_16px_rgba(245,130,10,0.3)]
                      hover:opacity-90 transition-opacity whitespace-nowrap">
                    Unlock Pack — ₹99
                  </button>
                  <p className="text-[0.65rem] text-muted text-center">One-time · 7-day refund</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* All access — show count */}
          {(access === 'full' || isAdmin) && cat.totalQuestions > totalLive && (
            <motion.div className="mt-6 text-center py-6 px-8 bg-white
              border border-dashed border-line rounded-2xl"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }}>
              <p className="text-[0.82rem] text-muted">
                <span className="font-bold text-navy">{cat.totalQuestions - totalLive}+ more questions</span>
                {' '}being added weekly.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
