import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../../api/client'
import { COURSES_DATA, COURSE_CATEGORIES } from '../../data/courses'

/* ── Build nav path from a result object ── */
function resultPath(r) {
  if (r.type === 'note')     return `/notes/${r.category}/${r.slug}`
  if (r.type === 'topic')    return `/interview/${r.slug}`
  if (r.type === 'question') return `/interview/${r.topicSlug}/${r.slug}`
  if (r.type === 'course') {
    const catId = COURSE_CATEGORIES.find(c => c.courses.includes(r.slug))?.id
    return catId ? `/courses/${catId}/${r.slug}` : '/courses'
  }
  return '/'
}

const TYPE_LABEL = {
  note:     { label: 'Note',      bg: 'bg-blue-50',   text: 'text-blue-700'  },
  topic:    { label: 'Interview', bg: 'bg-indigo-50',  text: 'text-indigo-700' },
  question: { label: 'Question',  bg: 'bg-indigo-50',  text: 'text-indigo-700' },
  course:   { label: 'Course',    bg: 'bg-orange-50',  text: 'text-orange-700' },
}

const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform)
const KBD   = isMac ? '⌘K' : 'Ctrl K'

export default function SearchBar() {
  const navigate   = useNavigate()
  const [open,     setOpen]    = useState(false)
  const [query,    setQuery]   = useState('')
  const [results,  setResults] = useState([])
  const [loading,  setLoading] = useState(false)
  const [active,   setActive]  = useState(-1)   // keyboard-highlighted index

  const inputRef   = useRef(null)
  const wrapRef    = useRef(null)
  const debounceRef = useRef(null)

  /* ── Keyboard shortcut: Ctrl/Cmd+K ── */
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
        setTimeout(() => inputRef.current?.focus(), 50)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  /* ── Close on outside click ── */
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) close()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  /* ── Debounced search ── */
  const doSearch = useCallback((q) => {
    clearTimeout(debounceRef.current)
    if (!q.trim() || q.length < 2) { setResults([]); setLoading(false); return }
    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await api.search(q)
        setResults(data.results || [])
      } catch {
        setResults([])
      }
      setLoading(false)
      setActive(-1)
    }, 280)
  }, [])

  const handleChange = (e) => {
    setQuery(e.target.value)
    doSearch(e.target.value)
  }

  const close = () => {
    setOpen(false)
    setQuery('')
    setResults([])
    setActive(-1)
  }

  const go = (r) => {
    navigate(resultPath(r))
    close()
  }

  /* ── Arrow key + Enter navigation ── */
  const handleKeyDown = (e) => {
    if (e.key === 'Escape')      { close(); return }
    if (e.key === 'ArrowDown')   { e.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)) }
    if (e.key === 'ArrowUp')     { e.preventDefault(); setActive(a => Math.max(a - 1, -1)) }
    if (e.key === 'Enter' && active >= 0 && results[active]) go(results[active])
  }

  return (
    <div className="relative" ref={wrapRef}>
      {/* ── Trigger button (collapsed state) ── */}
      {!open && (
        <button
          onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50) }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line
            bg-base hover:bg-base2 transition-colors text-muted">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <span className="hidden sm:block text-[0.75rem] font-semibold">Search</span>
          <kbd className="hidden sm:block text-[0.6rem] font-bold px-1.5 py-0.5 rounded
            bg-white border border-line text-muted/70 ml-1">
            {KBD}
          </kbd>
        </button>
      )}

      {/* ── Expanded search input ── */}
      {open && (
        <div className="relative w-[280px] sm:w-[340px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted/50 pointer-events-none"
            width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Search notes, courses, questions…"
            autoComplete="off"
            className="w-full pl-8 pr-8 py-1.5 rounded-lg border border-accent/50
              bg-white text-[0.82rem] text-navy placeholder:text-muted/50 outline-none
              focus:ring-2 focus:ring-accent/15 transition-all"
          />
          {loading ? (
            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin text-muted/50"
              width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
            </svg>
          ) : query && (
            <button onClick={close}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted/50
                hover:text-muted transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>
      )}

      {/* ── Results dropdown ── */}
      <AnimatePresence>
        {open && query.length >= 2 && (
          <motion.div
            className="absolute top-[calc(100%+8px)] left-0 w-[340px] sm:w-[420px] z-[300]
              bg-white border border-line rounded-2xl shadow-[0_8px_40px_rgba(18,18,58,0.14)]
              overflow-hidden"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.12 }}>

            {/* No results */}
            {!loading && results.length === 0 && (
              <div className="py-10 text-center text-muted">
                <div className="text-3xl mb-2">🔍</div>
                <p className="text-[0.82rem] font-semibold">No results for "{query}"</p>
              </div>
            )}

            {/* Results list */}
            {results.length > 0 && (
              <div className="py-1.5 max-h-[420px] overflow-y-auto">
                {results.map((r, i) => {
                  const tl = TYPE_LABEL[r.type] || TYPE_LABEL.note
                  return (
                    <button key={`${r.type}-${r.slug}`}
                      onClick={() => go(r)}
                      onMouseEnter={() => setActive(i)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left
                        transition-colors ${active === i ? 'bg-base2' : 'hover:bg-base/60'}`}>

                      {/* Icon */}
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center
                        text-base shrink-0"
                        style={{ background: `color-mix(in srgb, ${r.color} 12%, var(--color-tint))` }}>
                        {r.icon}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[0.83rem] font-bold text-navy truncate">{r.title}</p>
                        {r.subtitle && (
                          <p className="text-[0.7rem] text-muted truncate leading-snug mt-0.5">
                            {r.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Type badge */}
                      <span className={`text-[0.58rem] font-bold px-1.5 py-0.5 rounded-md
                        shrink-0 ${tl.bg} ${tl.text}`}>
                        {tl.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Footer hint */}
            <div className="border-t border-line px-4 py-2 flex items-center gap-3
              text-[0.65rem] text-muted/60">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>Esc close</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
