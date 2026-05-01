import { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar    from '../../components/layout/Navbar'
import Footer    from '../../components/layout/Footer'
import NoteRenderer from '../../components/content/NoteRenderer'
import { getNoteWithCategories, CATEGORIES } from '../../data/categories'
import { useAuth } from '../../hooks/useAuth'
import { api }   from '../../api/client'

/* ── Static fallback registry (used when backend is offline) ── */
const NOTE_REGISTRY = {
  kafka:           () => import('./data-engineer/Kafka'),
  spark:           () => import('./data-engineer/Spark'),
  flink:           () => import('./data-engineer/Flink'),
  druid:           () => import('./data-engineer/Druid'),
  gcp:             () => import('./data-engineer/GCP'),
  'data-modeling': () => import('./data-engineer/DataModeling'),
  sql:             () => import('./data-engineer/SQL'),
}

const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X']

/* ─────────────────────────────────────────────────────
   SKELETON LOADER
───────────────────────────────────────────────────── */
function SkeletonLoader() {
  return (
    <div className="gc animate-pulse">
      <div className="skeleton h-48 w-full rounded-2xl mb-8"/>
      <div className="skeleton h-9 w-2/3 mb-4 rounded-lg"/>
      <div className="flex flex-col gap-2.5 mb-8">
        {['w-full','w-5/6','w-full','w-4/5','w-full'].map((w, i) => (
          <div key={i} className={`skeleton h-4 ${w} rounded`}/>
        ))}
      </div>
      <div className="skeleton h-36 w-full rounded-xl mb-6"/>
      <div className="flex flex-col gap-2.5">
        {['w-full','w-3/4','w-full','w-5/6'].map((w, i) => (
          <div key={i} className={`skeleton h-4 ${w} rounded`}/>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────
   PREMIUM GATE
───────────────────────────────────────────────────── */
function PurchaseGate({ navigate, slug, price }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-3xl mb-5">🔒</div>
      <h3 className="text-[1.4rem] font-black text-navy mb-2">Unlock this Note</h3>
      <p className="text-[0.88rem] text-muted max-w-[380px] mb-2 leading-relaxed">
        The remaining parts of this guide require a one-time purchase.
      </p>
      <p className="text-[0.78rem] text-muted mb-7">
        Valid for <strong className="text-navy">2 years</strong> from purchase date.
      </p>
      <motion.button
        className="px-7 py-3.5 rounded-xl font-bold text-white text-[0.95rem]
          bg-gradient-to-br from-accent to-accent2 shadow-[0_4px_18px_rgba(245,130,10,0.35)]"
        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
        onClick={() => navigate(`/checkout?type=note&slug=${slug}`)}>
        {price ? `Buy this Note — ${price}` : 'Unlock this Note →'}
      </motion.button>
      <p className="mt-3 text-[0.72rem] text-muted">One-time payment · 7-day refund guarantee</p>
    </div>
  )
}

/* ─────────────────────────────────────────────────────
   DARK SIDEBAR
───────────────────────────────────────────────────── */
function NoteSidebar({ note, activePart, activeSection, onSectionClick, mobileOpen, onClose }) {
  const partSections = note.partSections ?? []

  // Flatten all sections with global sequential number
  let globalNum = 0
  const flatSections = partSections.flatMap((sections, pi) =>
    sections.map(s => ({ ...s, partIndex: pi, num: ++globalNum }))
  )

  return (
    <>
      {/* ── Overlay (mobile) ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[199] bg-black/50 backdrop-blur-sm"
          onClick={onClose}/>
      )}

      <aside className={`
        note-sidebar
        ${mobileOpen
          ? 'fixed inset-y-0 left-0 z-[200] flex flex-col'
          : 'hidden lg:flex lg:flex-col'
        }
        lg:sticky lg:top-[68px] lg:h-[calc(100vh-68px)] lg:overflow-y-auto
      `}>

        {/* ── Brand ── */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/8 shrink-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[1.1rem] font-black text-white shrink-0"
            style={{ background: `linear-gradient(135deg, ${note.color}, color-mix(in srgb, ${note.color} 60%, #2ECC71))` }}>
            {note.iconLetter ?? note.name[0]}
          </div>
          <div className="min-w-0">
            <div className="text-[0.58rem] font-900 tracking-[2.5px] uppercase mb-0.5"
              style={{ color: note.color }}>
              {note.name}
            </div>
            <div className="text-[0.82rem] font-bold text-white/85 leading-none">
              Deep-Dive Guide
            </div>
          </div>
          {/* Close button (mobile) */}
          <button className="lg:hidden ml-auto text-white/40 hover:text-white/80 transition-colors p-1"
            onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* ── Part groups + sections ── */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {partSections.map((sections, pi) => {
            const startNum = partSections.slice(0, pi).reduce((a, s) => a + s.length, 0) + 1
            return (
              <div key={pi} className="mb-1">
                {/* Part group label */}
                <div className="px-3 pt-3 pb-2">
                  <span className="text-[0.56rem] font-800 tracking-[2px] uppercase text-white/30">
                    Part {ROMAN[pi]} — {note.partTitles[pi]}
                  </span>
                </div>

                {/* Section items */}
                {sections.map((s, si) => {
                  const num = startNum + si
                  const isActive = activeSection === s.id
                  return (
                    <button key={s.id}
                      onClick={() => onSectionClick(pi, s.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 text-left transition-all duration-150
                        ${isActive
                          ? 'bg-white/10 text-white'
                          : 'text-white/50 hover:bg-white/6 hover:text-white/80'
                        }`}>
                      <span className={`w-6 h-6 rounded-md text-[0.65rem] font-800 flex items-center justify-center shrink-0 transition-all
                        ${isActive
                          ? 'text-white'
                          : 'text-white/35'
                        }`}
                        style={isActive ? { background: note.color } : { background: 'rgba(255,255,255,0.06)' }}>
                        {String(num).padStart(2, '0')}
                      </span>
                      <span className={`text-[0.78rem] leading-snug transition-all
                        ${isActive ? 'font-700' : 'font-500'}`}>
                        {s.title}
                      </span>
                    </button>
                  )
                })}
              </div>
            )
          })}

          {/* Fallback: if no partSections, show part-level nav */}
          {partSections.length === 0 && note.partTitles.map((title, i) => (
            <button key={i}
              onClick={() => onSectionClick(i, null)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-0.5 text-left transition-all
                ${activePart === i ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/6 hover:text-white/80'}`}>
              <span className={`w-6 h-6 rounded-md text-[0.65rem] font-800 flex items-center justify-center shrink-0`}
                style={activePart === i ? { background: note.color } : { background: 'rgba(255,255,255,0.06)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[0.78rem] leading-snug">{title}</span>
            </button>
          ))}
        </nav>

        {/* ── Footer stats ── */}
        <div className="shrink-0 border-t border-white/8 px-5 py-3 flex items-center gap-4">
          <div className="text-center">
            <div className="text-[0.9rem] font-900" style={{ color: note.color }}>{note.parts}</div>
            <div className="text-[0.55rem] text-white/30 uppercase tracking-wider font-600">Parts</div>
          </div>
          <div className="w-px h-6 bg-white/10"/>
          <div className="text-center">
            <div className="text-[0.9rem] font-900" style={{ color: note.color }}>{note.sections}</div>
            <div className="text-[0.55rem] text-white/30 uppercase tracking-wider font-600">Sections</div>
          </div>
          <div className="w-px h-6 bg-white/10"/>
          <div className="text-center">
            <div className="text-[0.9rem] font-900" style={{ color: note.color }}>{note.level}</div>
            <div className="text-[0.55rem] text-white/30 uppercase tracking-wider font-600">Level</div>
          </div>
        </div>
      </aside>
    </>
  )
}

/* ─────────────────────────────────────────────────────
   NOTE PAGE
───────────────────────────────────────────────────── */
export default function NotePage() {
  const { categoryId, slug } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn, owns } = useAuth()

  const [activePart, setActivePart]       = useState(0)
  const [activeSection, setActiveSection] = useState(null)
  const [sidebarOpen, setSidebarOpen]     = useState(false)
  const [bookmarked, setBookmarked]       = useState(false)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)
  const [pendingScroll, setPendingScroll]   = useState(null)

  /* ── DB content state ── */
  const [partBlocks, setPartBlocks]       = useState(null)
  const [partLoading, setPartLoading]     = useState(true)
  const [useStaticFallback, setUseStaticFallback] = useState(false)
  const [purchaseGated, setPurchaseGated] = useState(false)
  const [notePrice, setNotePrice]         = useState(null)

  const note = getNoteWithCategories(slug)
  const cat  = CATEGORIES.find(c => c.id === categoryId)

  /* ── Static fallback ── */
  const StaticNote = useMemo(() => {
    const loader = NOTE_REGISTRY[slug]
    return loader ? lazy(loader) : null
  }, [slug])

  /* ── Current part's section IDs (for NoteRenderer) ── */
  const currentSectionIds = useMemo(() => {
    return (note?.partSections?.[activePart] ?? []).map(s => s.id)
  }, [note, activePart])

  /* ── Fetch from DB ── */
  useEffect(() => {
    if (!slug) return
    setPartLoading(true)
    setPartBlocks(null)
    setUseStaticFallback(false)
    setPurchaseGated(false)
    setNotePrice(null)

    api.getNotePart(slug, activePart)
      .then(({ data }) => {
        setPartBlocks(data.part.blocks)
        setPartLoading(false)
      })
      .catch(err => {
        if (err.response?.status === 403) {
          // If user already owns this note client-side, don't show the gate —
          // the DB purchase may still be propagating. Treat as an access error.
          if (owns('note', slug)) {
            setUseStaticFallback(true)
          } else {
            setPurchaseGated(true)
            // Fetch the actual price for this specific note from the API
            api.getNote(slug)
              .then(({ data: nd }) => {
                const p = nd.note?.price
                if (p != null) {
                  setNotePrice(`₹${Math.round(p / 100).toLocaleString('en-IN')}`)
                }
              })
              .catch(() => {})
          }
        } else {
          setUseStaticFallback(true)
        }
        setPartLoading(false)
      })
  }, [slug, activePart, owns])

  /* ── Scroll to section after part loads ── */
  useEffect(() => {
    if (!partLoading && pendingScroll) {
      setTimeout(() => {
        document.getElementById(pendingScroll)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setPendingScroll(null)
      }, 120)
    }
  }, [partLoading, pendingScroll])

  /* ── Set first section of loaded part as active ── */
  useEffect(() => {
    const firstSection = note?.partSections?.[activePart]?.[0]?.id
    if (firstSection && !pendingScroll) setActiveSection(firstSection)
  }, [activePart, note])

  /* ── Bookmark ── */
  useEffect(() => {
    if (!isLoggedIn || !slug) return
    api.getBookmarks()
      .then(({ data }) => {
        setBookmarked((data.bookmarks ?? []).some(b => b.note_slug === slug))
      }).catch(() => {})
  }, [isLoggedIn, slug])

  const toggleBookmark = useCallback(async () => {
    if (!isLoggedIn) { navigate('/login'); return }
    setBookmarkLoading(true)
    try {
      if (bookmarked) { await api.delBookmark(slug); setBookmarked(false) }
      else            { await api.addBookmark(slug); setBookmarked(true)  }
    } catch { /* ignore */ }
    setBookmarkLoading(false)
  }, [bookmarked, isLoggedIn, slug, navigate])

  /* ── Section click handler ── */
  const handleSectionClick = useCallback((partIndex, sectionId) => {
    setSidebarOpen(false)
    if (sectionId) setActiveSection(sectionId)

    if (partIndex !== activePart) {
      setActivePart(partIndex)
      if (sectionId) setPendingScroll(sectionId)
    } else if (sectionId) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activePart])

  if (!note) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-base flex items-center justify-center text-center px-10">
          <div>
            <div className="text-4xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-navy mb-4">Note not found</h2>
            <button className="px-6 py-3 rounded-xl border-2 border-line text-navy font-bold text-sm hover:bg-base2 transition-colors"
              onClick={() => navigate('/notes')}>← Back to Notes</button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-line py-2.5">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 flex items-center gap-2 flex-wrap">
          <button className="text-[0.78rem] font-semibold text-muted hover:text-navy transition-colors"
            onClick={() => navigate('/notes')}>Notes</button>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" className="text-[var(--color-muted)]"><path d="M9 18l6-6-6-6"/></svg>
          {cat && <>
            <button className="text-[0.78rem] font-semibold text-muted hover:text-navy transition-colors"
              onClick={() => navigate(`/notes/${categoryId}`)}>{cat.name}</button>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" className="text-[var(--color-muted)]"><path d="M9 18l6-6-6-6"/></svg>
          </>}
          <span className="text-[0.78rem] font-bold text-navy">{note.name}</span>

          {/* Bookmark */}
          <button onClick={toggleBookmark} disabled={bookmarkLoading}
            className={`ml-2 flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-bold
              border transition-all disabled:opacity-50
              ${bookmarked
                ? 'bg-accent/10 border-accent/30 text-accent'
                : 'bg-white border-line text-muted hover:border-accent/30 hover:text-accent'}`}>
            <svg width="12" height="12" viewBox="0 0 24 24"
              fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
            {bookmarked ? 'Saved' : 'Save'}
          </button>

          {/* Mobile sidebar toggle */}
          <button
            className="lg:hidden ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg
              bg-navy text-white text-[0.72rem] font-bold"
            onClick={() => setSidebarOpen(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
            Sections
          </button>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="max-w-[1400px] mx-auto flex min-h-[calc(100vh-110px)]">

        {/* ── Sidebar ── */}
        <NoteSidebar
          note={note}
          activePart={activePart}
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
          mobileOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* ── Content ── */}
        <main className="flex-1 min-w-0 px-6 sm:px-10 lg:px-16 py-8 lg:py-12">
          <AnimatePresence mode="wait">
            <motion.div key={activePart}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

              {partLoading ? (
                <SkeletonLoader />
              ) : purchaseGated ? (
                <PurchaseGate navigate={navigate} slug={slug} price={notePrice}/>
              ) : partBlocks ? (
                <div style={{ '--note-color': note.color }}>
                  <NoteRenderer blocks={partBlocks} sectionIds={currentSectionIds} />
                </div>
              ) : useStaticFallback && StaticNote ? (
                <Suspense fallback={<SkeletonLoader />}>
                  <StaticNote part={activePart} />
                </Suspense>
              ) : (
                <SkeletonLoader />
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Footer />
    </>
  )
}
