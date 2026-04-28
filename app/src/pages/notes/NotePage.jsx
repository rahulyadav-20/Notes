import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { getNoteWithCategories, CATEGORIES } from '../../data/categories'

/* ─────────────────────────────────────────────────────
   CONTENT PLACEHOLDER
───────────────────────────────────────────────────── */
function ContentPlaceholder({ partNum, partTitle }) {
  return (
    <div>
      <div className="mb-8">
        <p className="text-[0.72rem] font-bold uppercase tracking-[2px] text-accent mb-2.5 flex items-center gap-2">
          <span className="inline-block w-5 h-0.5 bg-accent rounded"/>
          Part {partNum}
        </p>
        <h1 className="text-2xl sm:text-3xl lg:text-[2.1rem] font-black text-navy tracking-tight leading-tight">
          {partTitle}
        </h1>
      </div>

      {/* Skeleton lines */}
      <div className="flex flex-col gap-2.5 mb-10">
        {['w-4/5','w-full','w-3/5','w-full','w-11/12','w-3/4'].map((w, i) => (
          <div key={i} className={`skeleton h-3.5 ${w}`}/>
        ))}
        <div className="skeleton h-28 w-full mt-1"/>
        {['w-full','w-4/5','w-3/5'].map((w, i) => (
          <div key={i} className={`skeleton h-3.5 ${w}`}/>
        ))}
        <div className="skeleton h-20 w-full mt-1"/>
      </div>

      <div className="text-center py-12 px-8 bg-white border-[1.5px] border-dashed border-line rounded-2xl">
        <div className="text-4xl mb-4">📝</div>
        <h3 className="text-[1.1rem] font-extrabold text-navy mb-2">Coming soon</h3>
        <p className="text-[0.88rem] text-muted leading-relaxed">This part is being written. Check back shortly.</p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────
   NOTE PAGE
───────────────────────────────────────────────────── */
export default function NotePage() {
  const { categoryId, slug } = useParams()
  const navigate = useNavigate()
  const [activePart, setActivePart]   = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const note = getNoteWithCategories(slug)
  const cat  = CATEGORIES.find(c => c.id === categoryId)

  if (!note) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20 px-10 text-muted">
          <h2 className="text-2xl font-bold mb-5">Note not found</h2>
          <button className="px-6 py-3 rounded-xl border-2 border-line text-navy font-bold text-sm hover:bg-base2 transition-colors"
            onClick={() => navigate('/notes')}>← Back to Notes</button>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-line py-3">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12 flex items-center gap-2 flex-wrap">
          <button className="text-[0.8rem] font-semibold text-muted hover:text-navy transition-colors"
            onClick={() => navigate('/notes')}>Notes</button>
          <svg className="text-[#b0b8d0]" width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          {cat && (
            <>
              <button className="text-[0.8rem] font-semibold text-muted hover:text-navy transition-colors"
                onClick={() => navigate(`/notes/${categoryId}`)}>{cat.name}</button>
              <svg className="text-[#b0b8d0]" width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </>
          )}
          <span className="text-[0.8rem] font-bold text-navy">{note.name}</span>

          {/* Cross-domain links */}
          {note.categories.length > 1 && (
            <div className="ml-auto flex items-center gap-2 flex-wrap min-w-0">
              {note.categories.filter(c => c.id !== categoryId).map(c => (
                <button key={c.id}
                  className="text-[0.72rem] font-bold text-[#7C3AED] bg-[rgba(139,92,246,0.07)] border border-[rgba(139,92,246,0.2)] px-3 py-1 rounded-full hover:bg-[rgba(139,92,246,0.14)] transition-colors"
                  onClick={() => navigate(`/notes/${c.id}/${slug}`)}>
                  {c.icon} Also in {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile/tablet toggle ── */}
      <button
        className="lg:hidden w-full px-5 sm:px-8 py-3 bg-white border-b border-line text-[0.84rem] font-bold text-navy text-left hover:bg-base2 transition-colors"
        onClick={() => setSidebarOpen(o => !o)}>
        {sidebarOpen ? '✕ Close' : `☰ Part ${activePart + 1} of ${note.parts} — ${note.partTitles[activePart]}`}
      </button>

      {/* ── Layout ── */}
      <div className="max-w-[1300px] mx-auto lg:px-12 lg:grid lg:grid-cols-[260px_1fr] min-h-[calc(100vh-130px)]">

        {/* ── Sidebar ── */}
        <aside
          className={`sidebar-accent
            ${sidebarOpen
              ? 'fixed inset-y-0 left-0 z-[200] w-[280px] max-w-[88vw] bg-white shadow-2xl overflow-y-auto flex flex-col pt-5'
              : 'hidden lg:flex lg:flex-col'
            } lg:sticky lg:top-[68px] lg:h-[calc(100vh-68px)] lg:overflow-y-auto`}>

          {/* Note identity */}
          <div className="flex items-center gap-3 px-5 pb-5 border-b border-line mb-3 shrink-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ background: `color-mix(in srgb, ${note.color} 12%, #f5f7ff)` }}>
              {note.icon}
            </div>
            <div>
              <div className="text-[0.88rem] font-extrabold text-navy">{note.name}</div>
              <div className="text-[0.7rem] text-muted mt-0.5">{note.parts} parts</div>
            </div>
          </div>

          {/* Parts list */}
          <nav className="flex flex-col px-3 pb-6">
            {note.partTitles.map((title, i) => (
              <button key={i}
                className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl mb-0.5 text-left transition-colors
                  ${activePart === i ? 'sidebar-part-active' : 'hover:bg-base2'}`}
                style={{ '--nc': note.color }}
                onClick={() => { setActivePart(i); setSidebarOpen(false) }}>
                <span className={`w-[22px] h-[22px] rounded-md shrink-0 flex items-center justify-center text-[0.68rem] font-bold mt-0.5
                  ${activePart === i ? 'part-num' : 'bg-base2 text-muted'}`}>
                  {i + 1}
                </span>
                <span className="flex flex-col flex-1 min-w-0">
                  <span className="text-[0.62rem] text-muted font-semibold uppercase tracking-[0.5px]">
                    Part {i + 1}
                  </span>
                  <span className={`text-[0.78rem] font-bold leading-snug mt-0.5 part-title
                    ${activePart === i ? '' : 'text-navy'}`}>
                    {title}
                  </span>
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Overlay backdrop on mobile */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-[199] bg-black/30"
            onClick={() => setSidebarOpen(false)}/>
        )}

        {/* ── Main content ── */}
        <main className="px-4 sm:px-8 lg:px-12 py-8 lg:py-10 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={activePart}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <ContentPlaceholder partNum={activePart + 1} partTitle={note.partTitles[activePart]} />
            </motion.div>
          </AnimatePresence>
        </main>

      </div>

      <Footer />
    </>
  )
}
