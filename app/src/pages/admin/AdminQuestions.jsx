import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from './AdminLayout'
import { INTERVIEW_CATEGORIES } from '../../data/interview/index.js'
import { api } from '../../api/client'

const DIFF_COLORS = {
  Easy:   { bg: 'bg-green-500/15',  text: 'text-green-400',  border: 'border-green-500/20' },
  Medium: { bg: 'bg-amber-500/15',  text: 'text-amber-400',  border: 'border-amber-500/20' },
  Hard:   { bg: 'bg-red-500/15',    text: 'text-red-400',    border: 'border-red-500/20'   },
}

/* ── Edit question modal ── */
function EditModal({ q, onSave, onClose }) {
  const [form, setForm] = useState({
    title:      q.title || '',
    difficulty: q.difficulty || 'Medium',
    is_premium: q.is_premium || false,
  })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data } = await api.adminUpdateQ(q.slug, form)
      onSave(data.question)
      onClose()
    } catch (e) {
      console.error(e)
    }
    setSaving(false)
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}>
      <motion.div className="bg-[#1c1c30] border border-white/10 rounded-2xl p-6 w-full max-w-[440px]"
        initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}>
        <h3 className="text-[1rem] font-black text-white mb-5">Edit Question</h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[0.72rem] font-bold text-white/50 mb-1.5 block">Title</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              className="w-full bg-[#0d0d1e] border border-white/10 rounded-xl px-4 py-2.5
                text-[0.85rem] text-white outline-none focus:border-accent/50"/>
          </div>
          <div>
            <label className="text-[0.72rem] font-bold text-white/50 mb-1.5 block">Difficulty</label>
            <div className="flex gap-2">
              {['Easy','Medium','Hard'].map(d => (
                <button key={d} type="button" onClick={() => set('difficulty', d)}
                  className={`flex-1 py-2 rounded-xl text-[0.75rem] font-bold transition-colors
                    ${form.difficulty === d
                      ? d === 'Easy' ? 'bg-green-500/25 text-green-400 border border-green-500/40'
                        : d === 'Medium' ? 'bg-amber-500/25 text-amber-400 border border-amber-500/40'
                        : 'bg-red-500/25 text-red-400 border border-red-500/40'
                      : 'bg-white/5 text-white/30 border border-white/10'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_premium}
              onChange={e => set('is_premium', e.target.checked)}
              className="w-4 h-4 accent-orange-500"/>
            <span className="text-[0.82rem] font-semibold text-white/70">Premium question (requires subscription)</span>
          </label>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 rounded-xl font-bold text-[0.85rem] text-white
              bg-gradient-to-br from-accent to-accent2 hover:opacity-90 disabled:opacity-60 transition-opacity">
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl font-bold text-[0.85rem] text-white/40
              border border-white/10 hover:bg-white/5 transition-colors">
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function AdminQuestions() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [diffFilter,     setDiff]           = useState('all')
  const [search,         setSearch]         = useState('')
  const [expanded,       setExpanded]       = useState(null)
  const [editing,        setEditing]        = useState(null)
  const [allQuestions,   setAllQuestions]   = useState([])
  const [loading,        setLoading]        = useState(true)
  const [busy,           setBusy]           = useState({})
  const [toast,          setToast]          = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(() => {
    setLoading(true)
    Promise.all(
      INTERVIEW_CATEGORIES.map(cat =>
        api.getInterviewQuestions(cat.id)
          .then(({ data }) => data.questions.map(q => ({
            ...q,
            categoryId:    cat.id,
            categoryLabel: cat.name,
          })))
          .catch(() => [])
      )
    )
      .then(arrays => setAllQuestions(arrays.flat()))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = allQuestions.filter(q => {
    const matchCat    = activeCategory === 'all' || q.categoryId === activeCategory
    const matchDiff   = diffFilter     === 'all' || q.difficulty === diffFilter
    const matchSearch = !search || q.title?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchDiff && matchSearch
  })

  async function deleteQ(slug) {
    setBusy(b => ({ ...b, [slug]: true }))
    try {
      await api.adminDeleteQ(slug)
      setAllQuestions(prev => prev.filter(q => q.slug !== slug))
      showToast('Question deleted.')
    } catch (e) {
      showToast(e.response?.data?.error || 'Failed.', 'error')
    }
    setBusy(b => ({ ...b, [slug]: false }))
  }

  async function togglePremium(q) {
    setBusy(b => ({ ...b, [q.slug]: true }))
    try {
      await api.adminUpdateQ(q.slug, { is_premium: !q.is_premium })
      setAllQuestions(prev => prev.map(x => x.slug === q.slug ? { ...x, is_premium: !x.is_premium } : x))
    } catch (e) {
      showToast('Failed.', 'error')
    }
    setBusy(b => ({ ...b, [q.slug]: false }))
  }

  const totalByDiff = d => allQuestions.filter(q => q.difficulty === d).length
  const premiumCount = allQuestions.filter(q => q.is_premium).length

  return (
    <AdminLayout title="Questions">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`fixed top-5 right-5 z-[200] px-4 py-3 rounded-xl text-[0.82rem] font-semibold shadow-xl
              ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit modal */}
      <AnimatePresence>
        {editing && (
          <EditModal
            q={editing}
            onSave={updated => setAllQuestions(prev => prev.map(q => q.slug === updated.slug ? { ...q, ...updated } : q))}
            onClose={() => setEditing(null)}/>
        )}
      </AnimatePresence>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { label: 'Total',   value: allQuestions.length, color: '#6366F1' },
          { label: 'Easy',    value: totalByDiff('Easy'), color: '#10B981' },
          { label: 'Medium',  value: totalByDiff('Medium'), color: '#F59E0B' },
          { label: 'Hard',    value: totalByDiff('Hard'), color: '#EF4444' },
          { label: 'Premium', value: premiumCount,         color: '#f5820a' },
        ].map(c => (
          <div key={c.label} className="bg-[#141428] border border-white/8 rounded-xl px-4 py-2.5 flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }}/>
            <span className="text-[0.78rem] font-semibold text-white/50">{c.label}</span>
            <span className="text-[0.95rem] font-black text-white ml-1">{c.value}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search questions…"
            className="flex-1 bg-[#141428] border border-white/10 rounded-xl px-4 py-2.5
              text-[0.85rem] text-white placeholder:text-white/25 outline-none focus:border-accent/50"/>
          <div className="flex gap-2">
            {['all','Easy','Medium','Hard'].map(d => (
              <button key={d} onClick={() => setDiff(d)}
                className={`px-3 py-2 rounded-xl text-[0.72rem] font-bold transition-colors
                  ${diffFilter === d ? 'bg-accent/20 text-accent border border-accent/30'
                    : 'bg-[#141428] border border-white/8 text-white/40 hover:text-white/60'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[{ id: 'all', name: 'All Categories' }, ...INTERVIEW_CATEGORIES].map(c => (
            <button key={c.id} onClick={() => setActiveCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-[0.72rem] font-bold transition-colors
                ${activeCategory === c.id ? 'bg-accent/20 text-accent border border-accent/30'
                  : 'bg-[#141428] border border-white/8 text-white/40 hover:text-white/60'}`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Questions list */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-[#141428] border border-white/8 animate-pulse"/>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-[0.7rem] text-white/25 mb-1">
            Showing {filtered.length} of {allQuestions.length} questions
          </p>
          {filtered.length === 0 && (
            <p className="text-center text-white/30 text-[0.85rem] py-10">No questions match filters.</p>
          )}
          {filtered.map((q, idx) => {
            const dc = DIFF_COLORS[q.difficulty] || DIFF_COLORS.Medium
            const isOpen = expanded === q.slug
            return (
              <motion.div key={q.slug}
                className="bg-[#141428] border border-white/8 rounded-xl overflow-hidden"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: Math.min(idx * 0.02, 0.3) }}>

                {/* Row */}
                <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/3 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : q.slug)}>

                  <span className="text-[0.65rem] font-black text-white/20 w-6 shrink-0 text-right">{idx + 1}</span>

                  <span className={`text-[0.62rem] font-bold px-2 py-0.5 rounded-full shrink-0 border
                    ${dc.bg} ${dc.text} ${dc.border}`}>
                    {q.difficulty}
                  </span>

                  <span className="flex-1 text-[0.85rem] font-semibold text-white/80 truncate">
                    {q.title}
                  </span>

                  <span className="text-[0.65rem] text-white/30 hidden sm:block shrink-0">{q.categoryLabel}</span>

                  {q.is_premium && (
                    <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded
                      bg-amber-500/15 text-amber-400 border border-amber-500/20 shrink-0">
                      Premium
                    </span>
                  )}

                  {/* Actions */}
                  <div className="flex gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setEditing(q)} disabled={busy[q.slug]}
                      className="text-[0.62rem] font-bold px-2 py-1 rounded-lg
                        bg-white/5 text-white/40 hover:bg-white/10 transition-colors disabled:opacity-40">
                      Edit
                    </button>
                    <button onClick={() => togglePremium(q)} disabled={busy[q.slug]}
                      className={`text-[0.62rem] font-bold px-2 py-1 rounded-lg transition-colors disabled:opacity-40
                        ${q.is_premium
                          ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                          : 'bg-white/5 text-white/35 hover:bg-amber-500/10 hover:text-amber-400'}`}>
                      {q.is_premium ? '🔒 Free' : '🔓 Premium'}
                    </button>
                    <button onClick={() => deleteQ(q.slug)} disabled={busy[q.slug]}
                      className="text-[0.62rem] font-bold px-2 py-1 rounded-lg
                        bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-40">
                      Delete
                    </button>
                  </div>

                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    className={`text-white/20 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>

                {/* Expanded answer */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                      className="overflow-hidden">
                      <div className="px-4 pb-4 pt-1 border-t border-white/6">
                        {q.description && (
                          <p className="text-[0.8rem] text-white/50 mb-3 leading-relaxed">{q.description}</p>
                        )}
                        {q.answer && (
                          <div className="bg-[#0d0d1e] rounded-xl p-3.5 text-[0.78rem] text-white/60 leading-relaxed whitespace-pre-wrap font-mono">
                            {q.answer}
                          </div>
                        )}
                        {q.hints?.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {q.hints.map((h, i) => (
                              <span key={i} className="text-[0.65rem] px-2 py-0.5 rounded-lg bg-white/5 text-white/40">
                                💡 {h}
                              </span>
                            ))}
                          </div>
                        )}
                        {(q.time_complexity || q.space_complexity) && (
                          <div className="flex gap-3 mt-3">
                            {q.time_complexity  && <span className="text-[0.65rem] text-white/35">Time: <strong className="text-white/55">{q.time_complexity}</strong></span>}
                            {q.space_complexity && <span className="text-[0.65rem] text-white/35">Space: <strong className="text-white/55">{q.space_complexity}</strong></span>}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}
    </AdminLayout>
  )
}
