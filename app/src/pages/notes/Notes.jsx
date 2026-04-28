import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { CATEGORIES, NOTES_DATA } from '../../data/categories'
import { NoteIcon } from '../../data/icons'

/* ─────────────────────────────────────────────────────
   CATEGORY CARD  — square, clean, description only
───────────────────────────────────────────────────── */

const CAT_DESC = {
  'data-engineer': {
    short: 'Master the full modern data stack — streaming pipelines, distributed batch processing, cloud warehouses and real-time analytics at scale.',
    topics: ['Apache Kafka', 'Apache Spark', 'Apache Flink', 'BigQuery & GCP', 'Data Modeling', 'SQL'],
  },
  'data-science': {
    short: 'From statistical foundations to production-grade ML — covering algorithms, model evaluation, feature engineering and MLOps deployment.',
    topics: ['Machine Learning', 'Deep Learning', 'Statistics & A/B Testing'],
  },
  'ai': {
    short: 'Build intelligent applications with LLMs — RAG pipelines, AI agents, vector databases and cloud-native AI engineering.',
    topics: ['LangChain', 'LlamaIndex', 'OpenAI API', 'Vertex AI & GCP'],
  },
  'devops': {
    short: 'Ship reliably at scale — container orchestration, infrastructure as code, CI/CD automation and cloud-native deployments.',
    topics: ['Kubernetes', 'Docker', 'GitHub Actions & CI/CD'],
  },
  'frontend': {
    short: 'Modern web development from the ground up — advanced React patterns, JavaScript internals, TypeScript and performance optimisation.',
    topics: ['React.js', 'JavaScript', 'TypeScript'],
  },
  'programming': {
    short: 'Core computer science applied to real engineering — Python ecosystem, system design trade-offs and algorithmic problem solving.',
    topics: ['Python', 'System Design', 'DSA & Algorithms'],
  },
}

function CategoryCard({ cat, index }) {
  const navigate  = useNavigate()
  const available = cat.notes.filter(s => !NOTES_DATA[s]?.soon).length
  const soonCount = cat.notes.filter(s =>  NOTES_DATA[s]?.soon).length
  const info      = CAT_DESC[cat.id] || { short: cat.desc, topics: [] }

  return (
    <motion.div
      className="relative overflow-hidden bg-white border-[1.5px] border-line
        rounded-2xl flex flex-col cursor-pointer cat-accent cat-card-hover"
      style={{ '--cc': cat.color }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      whileHover={{ y: -5, boxShadow: '0 20px 52px rgba(18,18,58,0.11)' }}
      onClick={() => navigate(`/notes/${cat.id}`)}>

      <div className="p-5 flex flex-col gap-4 flex-1">

        {/* Top row — icon + badges */}
        <div className="flex items-center justify-between gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center
            text-[1.6rem] shrink-0"
            style={{ background: `color-mix(in srgb, ${cat.color} 12%, #f5f7ff)` }}>
            {cat.icon}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <span className="text-[0.67rem] font-bold px-2.5 py-0.5 rounded-full"
              style={{
                color:      `color-mix(in srgb, ${cat.color} 85%, #333)`,
                background: `color-mix(in srgb, ${cat.color} 12%, #f0f2ff)`,
              }}>
              {available} guides
            </span>
            {soonCount > 0 && (
              <span className="text-[0.65rem] font-semibold px-2.5 py-0.5
                rounded-full bg-base2 text-muted">
                +{soonCount} soon
              </span>
            )}
          </div>
        </div>

        {/* Title + description */}
        <div>
          <div className="text-[1.05rem] font-extrabold text-navy mb-1.5">
            {cat.name}
          </div>
          <p className="text-[0.8rem] text-muted leading-[1.65] line-clamp-3">
            {info.short}
          </p>
        </div>

        {/* Topic chips */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {info.topics.slice(0, 4).map(t => (
            <span key={t}
              className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-md
                bg-base border border-line text-navy2">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-line flex items-center justify-between"
        style={{ background: `color-mix(in srgb, ${cat.color} 4%, #fff)` }}>
        <span className="text-[0.72rem] text-muted font-medium">
          {cat.notes.length} topics
        </span>
        <div className="flex items-center gap-1 text-[0.78rem] font-bold"
          style={{ color: cat.color }}>
          Explore
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────
   SEARCH RESULT CARD
───────────────────────────────────────────────────── */
function SearchCard({ note }) {
  const navigate = useNavigate()
  return (
    <motion.div
      className="relative overflow-hidden bg-white border-[1.5px] border-line
        rounded-xl p-5 cursor-pointer card-accent note-card-hover flex flex-col gap-3"
      style={{ '--nc': note.color }}
      whileHover={{ y: -3, boxShadow: '0 12px 36px rgba(18,18,58,0.10)' }}
      onClick={() => navigate(`/notes/${note.categoryId}/${note.slug}`)}>

      <div className="flex items-start justify-between gap-2">
        {/* Real icon */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `color-mix(in srgb, ${note.color} 12%, #f5f7ff)` }}>
          <NoteIcon slug={note.slug} size={20} color={note.color}/>
        </div>
        <span className="text-[0.64rem] font-semibold text-muted bg-base2
          px-2.5 py-1 rounded-full shrink-0">
          {note.categoryIcon} {note.categoryName}
        </span>
      </div>

      <div>
        <div className="text-[0.95rem] font-extrabold text-navy mb-1">{note.name}</div>
        <div className="text-[0.78rem] text-muted leading-snug">{note.tagline}</div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-1">
        <span className="text-[0.68rem] text-muted font-medium">
          {note.parts} parts · {note.sections} sections
        </span>
        <span className="text-[0.68rem] font-bold px-2.5 py-1 rounded-full"
          style={{
            background: `color-mix(in srgb, ${note.color} 10%, #f0f2ff)`,
            color:      `color-mix(in srgb, ${note.color} 85%, #333)`,
          }}>
          {note.freeUpTo} parts free
        </span>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────
   NOTES PAGE
───────────────────────────────────────────────────── */
export default function Notes() {
  const [query, setQuery] = useState('')

  const allNotes = CATEGORIES.flatMap(c =>
    c.notes
      .map(slug => ({
        ...NOTES_DATA[slug],
        slug,
        categoryId:   c.id,
        categoryName: c.name,
        categoryIcon: c.icon,
      }))
      .filter(n => !n.soon)
  )

  const filtered = query.trim()
    ? allNotes.filter(n =>
        n.name.toLowerCase().includes(query.toLowerCase()) ||
        n.categoryName.toLowerCase().includes(query.toLowerCase()) ||
        n.tagline?.toLowerCase().includes(query.toLowerCase())
      )
    : null

  return (
    <>
      <Navbar />

      {/* ── Page header ── */}
      <div className="bg-white border-b border-line py-12 lg:py-14">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}>
            <p className="text-[0.7rem] font-bold uppercase tracking-[2.5px] text-accent mb-2.5">
              Engineering Notes
            </p>
            <h1 className="text-3xl sm:text-[2.6rem] font-black text-navy
              tracking-tight leading-tight mb-3">
              Deep-Dive Guides,<br/>
              <span className="text-accent">Organised by Domain</span>
            </h1>
            <p className="text-[0.95rem] text-muted max-w-[480px] leading-relaxed">
              Pick a domain to explore all guides. Every guide is completely free
              — no account required.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Body ── */}
      <section className="py-12 lg:py-16">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12">

          {/* Search + count row */}
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center
              justify-between gap-4 mb-10"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}>

            <span className="text-[0.84rem] text-muted">
              {query.trim()
                ? <>{filtered?.length} result{filtered?.length !== 1 ? 's' : ''} found</>
                : <>{CATEGORIES.length} domains &middot; {allNotes.length} guides available</>
              }
            </span>

            {/* Search box */}
            <div className="flex items-center gap-2.5 bg-white border-[1.5px] border-line
              rounded-xl px-4 py-2.5 sm:w-[280px]
              focus-within:border-accent
              focus-within:shadow-[0_0_0_3px_rgba(245,130,10,0.1)]
              transition-all">
              <svg className="text-muted shrink-0" width="15" height="15"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="border-none outline-none bg-transparent text-[0.88rem]
                  text-navy font-[inherit] w-full placeholder:text-[#b0b8d0]"
                placeholder="Search topics…"
                value={query}
                onChange={e => setQuery(e.target.value)}/>
              {query && (
                <button onClick={() => setQuery('')}
                  className="text-[#b0b8d0] hover:text-muted text-[1rem]
                    leading-none transition-colors shrink-0">
                  ✕
                </button>
              )}
            </div>
          </motion.div>

          {/* Search results */}
          <AnimatePresence>
            {filtered && (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {filtered.map(note => (
                  <SearchCard key={note.slug} note={note}/>
                ))}
                {filtered.length === 0 && (
                  <div className="col-span-full text-center py-24 text-muted">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-[1rem]">
                      No guides match &ldquo;
                      <strong className="text-navy">{query}</strong>&rdquo;
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category grid */}
          {!filtered && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {CATEGORIES.map((cat, i) => (
                <CategoryCard key={cat.id} cat={cat} index={i}/>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
