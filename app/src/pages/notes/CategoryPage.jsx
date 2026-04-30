import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { getCategoryWithNotes, NOTES_DATA } from '../../data/categories'
import { NoteIcon } from '../../data/icons'
import { api } from '../../api/client'

/* Merge live API data (counts, pricing) with static data (partTitles, crossLinks) */
function mergeWithApi(staticNote, apiNote) {
  if (!apiNote) return staticNote
  return {
    ...staticNote,
    parts:    apiNote.parts_count    ?? staticNote.parts,
    sections: apiNote.sections_count ?? staticNote.sections,
    freeUpTo: apiNote.free_parts     ?? staticNote.freeUpTo,
    price:    apiNote.price,
    level:    apiNote.level          ?? staticNote.level,
    tagline:  apiNote.tagline        ?? staticNote.tagline,
  }
}

/* ─────────────────────────────────────────────────────
   NOTE CARD  — square, clean, matches category card style
───────────────────────────────────────────────────── */
function NoteCard({ note, categoryId, index }) {
  const navigate = useNavigate()

  return (
    <motion.div
      className={`relative overflow-hidden bg-white border-[1.5px] border-line
        rounded-2xl flex flex-col card-accent
        ${note.soon
          ? 'opacity-50 cursor-default pointer-events-none'
          : 'cursor-pointer note-card-hover'
        }`}
      style={{ '--nc': note.color }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      whileHover={note.soon ? {} : { y: -5, boxShadow: '0 20px 52px rgba(18,18,58,0.11)' }}
      onClick={() => !note.soon && navigate(`/notes/${categoryId}/${note.slug}`)}>

      <div className="p-5 flex flex-col gap-4 flex-1">

        {/* Top row — icon + badges */}
        <div className="flex items-center justify-between gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `color-mix(in srgb, ${note.color} 12%, var(--color-tint))` }}>
            <NoteIcon slug={note.slug} size={24} color={note.color}/>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <span className="text-[0.67rem] font-bold px-2.5 py-0.5 rounded-full"
              style={{
                color:      `color-mix(in srgb, ${note.color} 85%, #333)`,
                background: `color-mix(in srgb, ${note.color} 12%, #f0f2ff)`,
              }}>
              {note.freeUpTo} of {note.parts} free
            </span>
            {note.soon && (
              <span className="text-[0.65rem] font-semibold px-2.5 py-0.5
                rounded-full bg-base2 text-muted">
                Soon
              </span>
            )}
            {note.crossLinks?.length > 0 && (
              <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full
                text-[#7C3AED] bg-[rgba(139,92,246,0.08)]
                border border-[rgba(139,92,246,0.2)]">
                Also in {note.crossLinks[0].name}
              </span>
            )}
          </div>
        </div>

        {/* Title + description */}
        <div>
          <div className="text-[1.05rem] font-extrabold text-navy mb-1.5">
            {note.name}
          </div>
          <p className="text-[0.8rem] text-muted leading-[1.65] line-clamp-3">
            {note.tagline}
          </p>
        </div>

        {/* Part chips */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {note.partTitles.slice(0, 4).map((t, i) => (
            <span key={i}
              className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-md
                bg-base border border-line text-navy2">
              {t}
            </span>
          ))}
          {note.partTitles.length > 4 && (
            <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-md
              bg-base border border-line text-muted">
              +{note.partTitles.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      {!note.soon && (
        <div className="px-5 py-3 border-t border-line flex items-center justify-between"
          style={{ background: `color-mix(in srgb, ${note.color} 4%, var(--color-surface))` }}>
          <span className="text-[0.72rem] text-muted font-medium">
            {note.parts} parts · {note.sections} sections
          </span>
          <div className="flex items-center gap-1 text-[0.78rem] font-bold"
            style={{ color: note.color }}>
            Read Guide
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      )}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────
   CATEGORY PAGE
───────────────────────────────────────────────────── */
export default function CategoryPage() {
  const { categoryId } = useParams()
  const navigate       = useNavigate()
  const [apiNotes, setApiNotes] = useState({})

  useEffect(() => {
    api.getNotes(categoryId)
      .then(({ data }) => {
        const map = {}
        data.notes.forEach(n => { map[n.slug] = n })
        setApiNotes(map)
      })
      .catch(() => {})
  }, [categoryId])

  const staticCat = getCategoryWithNotes(categoryId)
  const cat = staticCat
    ? {
        ...staticCat,
        notes: staticCat.notes.map(n => mergeWithApi(n, apiNotes[n.slug])),
      }
    : null

  if (!cat) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20 px-10 text-muted">
          <h2 className="text-2xl font-bold mb-5">Category not found</h2>
          <button
            className="px-6 py-3 rounded-xl border-2 border-line text-navy
              font-bold text-sm hover:bg-base2 transition-colors"
            onClick={() => navigate('/notes')}>
            ← Back to Notes
          </button>
        </div>
        <Footer />
      </>
    )
  }

  const available   = cat.notes.filter(n => !n.soon).length
  const soonCount   = cat.notes.filter(n =>  n.soon).length
  const crossLinked = cat.notes.filter(n => n.crossLinks?.length > 0).length

  return (
    <>
      <Navbar />

      {/* ── Category hero ── */}
      <div className="border-b border-line py-10 lg:py-12"
        style={{
          background:        `color-mix(in srgb, ${cat.color} 5%, white)`,
          borderBottomColor: `color-mix(in srgb, ${cat.color} 14%, var(--color-line))`,
        }}>
        <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16">

          <motion.button
            className="inline-flex items-center gap-1.5 text-[0.8rem] font-bold
              text-muted mb-7 hover:text-navy transition-colors"
            onClick={() => navigate('/notes')}
            initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
            whileHover={{ x:-3 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            All Categories
          </motion.button>

          <motion.div
            className="flex items-start gap-6 flex-wrap"
            initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.1 }}>

            <div className="w-[72px] h-[72px] rounded-[20px] flex items-center
              justify-center text-[2rem] shrink-0"
              style={{
                background: `color-mix(in srgb, ${cat.color} 14%, var(--color-surface))`,
                boxShadow:  `0 4px 20px color-mix(in srgb, ${cat.color} 25%, transparent)`,
              }}>
              {cat.icon}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[0.7rem] font-bold uppercase tracking-[2.5px]
                text-accent mb-2">
                {cat.name}
              </p>
              <h1 className="text-xl sm:text-2xl lg:text-[1.7rem] font-extrabold
                text-navy leading-snug mb-4">
                {cat.desc}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className="text-[0.72rem] font-bold px-3.5 py-1.5 rounded-full
                  bg-white border-[1.5px] border-line text-navy">
                  {available} guides available
                </span>
                {soonCount > 0 && (
                  <span className="text-[0.72rem] font-bold px-3.5 py-1.5 rounded-full
                    bg-base2 text-muted border border-line">
                    {soonCount} coming soon
                  </span>
                )}
                {crossLinked > 0 && (
                  <span className="text-[0.72rem] font-bold px-3.5 py-1.5 rounded-full
                    text-[#7C3AED] bg-[rgba(139,92,246,0.07)]
                    border border-[rgba(139,92,246,0.3)]">
                    {crossLinked} cross-domain {crossLinked > 1 ? 'guides' : 'guide'}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Notes grid ── */}
      <section className="py-12 lg:py-16">
        <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cat.notes.map((note, i) => (
              <NoteCard
                key={note.slug}
                note={note}
                categoryId={categoryId}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
