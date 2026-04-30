import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from './AdminLayout'
import { api } from '../../api/client'

function fmtDate(s) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })
}

const CAT_LABELS = {
  'interview-experience': { label: 'Interview', color: '#6366F1' },
  'tech-article':         { label: 'Tech',      color: '#10B981' },
  'career':               { label: 'Career',    color: '#F59E0B' },
  'tutorial':             { label: 'Tutorial',  color: '#EC4899' },
}

/* ── Edit post modal ── */
function EditModal({ post, onSave, onClose }) {
  const [form, setForm] = useState({
    title:       post.title || '',
    excerpt:     post.excerpt || '',
    read_time:   post.read_time || '',
    is_featured: post.is_featured || false,
  })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.adminPublishPost(post.slug, post.is_published)
      await api.updateBlogPost(post.slug, form)
      onSave({ ...post, ...form })
    } catch (e) {
      console.error(e)
    }
    setSaving(false)
    onClose()
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}>
      <motion.div className="bg-[#1c1c30] border border-white/10 rounded-2xl p-6 w-full max-w-[520px]"
        initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}>
        <h3 className="text-[1rem] font-black text-white mb-5">Edit Post</h3>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[0.72rem] font-bold text-white/50 mb-1.5 block">Title</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              className="w-full bg-[#0d0d1e] border border-white/10 rounded-xl px-4 py-2.5
                text-[0.85rem] text-white outline-none focus:border-accent/50"/>
          </div>
          <div>
            <label className="text-[0.72rem] font-bold text-white/50 mb-1.5 block">Excerpt</label>
            <textarea rows={3} value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
              className="w-full bg-[#0d0d1e] border border-white/10 rounded-xl px-4 py-2.5
                text-[0.85rem] text-white outline-none focus:border-accent/50 resize-none"/>
          </div>
          <div>
            <label className="text-[0.72rem] font-bold text-white/50 mb-1.5 block">Read time</label>
            <input value={form.read_time} onChange={e => set('read_time', e.target.value)}
              placeholder="e.g. 8 min read"
              className="w-full bg-[#0d0d1e] border border-white/10 rounded-xl px-4 py-2.5
                text-[0.85rem] text-white outline-none focus:border-accent/50"/>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_featured}
              onChange={e => set('is_featured', e.target.checked)}
              className="w-4 h-4 accent-orange-500"/>
            <span className="text-[0.82rem] font-semibold text-white/70">Featured post</span>
          </label>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 rounded-xl font-bold text-[0.85rem] text-white
              bg-gradient-to-br from-accent to-accent2 hover:opacity-90 disabled:opacity-60 transition-opacity">
            {saving ? 'Saving…' : 'Save changes'}
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

export default function AdminContent() {
  const [posts,      setPosts]     = useState([])
  const [loading,    setLoading]   = useState(true)
  const [filter,     setFilter]    = useState('all')
  const [catFilter,  setCatFilter] = useState('all')
  const [search,     setSearch]    = useState('')
  const [busy,       setBusy]      = useState({})
  const [editing,    setEditing]   = useState(null)
  const [toast,      setToast]     = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(() => {
    setLoading(true)
    api.adminAllPosts({ status: filter === 'all' ? undefined : filter })
      .then(({ data }) => setPosts(data.posts))
      .catch(() => showToast('Failed to load posts.', 'error'))
      .finally(() => setLoading(false))
  }, [filter])

  useEffect(() => { load() }, [load])

  const filtered = posts.filter(p => {
    const matchCat    = catFilter === 'all' || p.category_id === catFilter
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) ||
                        p.author_name?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  async function togglePublish(post) {
    setBusy(b => ({ ...b, [post.slug]: true }))
    try {
      await api.adminPublishPost(post.slug, !post.is_published)
      setPosts(prev => prev.map(p => p.slug === post.slug ? { ...p, is_published: !p.is_published } : p))
      showToast(post.is_published ? 'Post unpublished.' : 'Post published.')
    } catch (e) {
      showToast(e.response?.data?.error || 'Failed.', 'error')
    }
    setBusy(b => ({ ...b, [post.slug]: false }))
  }

  async function deletePost(slug) {
    setBusy(b => ({ ...b, [slug]: true }))
    try {
      await api.adminDeletePost(slug)
      setPosts(prev => prev.filter(p => p.slug !== slug))
      showToast('Post deleted.')
    } catch (e) {
      showToast(e.response?.data?.error || 'Failed.', 'error')
    }
    setBusy(b => ({ ...b, [slug]: false }))
  }

  const totalPublished = posts.filter(p => p.is_published).length
  const totalDraft     = posts.filter(p => !p.is_published).length

  return (
    <AdminLayout title="Content">

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
            post={editing}
            onSave={updated => setPosts(prev => prev.map(p => p.slug === updated.slug ? updated : p))}
            onClose={() => setEditing(null)}/>
        )}
      </AnimatePresence>

      {/* Summary */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { label: 'Total',     value: posts.length,   color: '#6366F1' },
          { label: 'Published', value: totalPublished, color: '#10B981' },
          { label: 'Drafts',    value: totalDraft,     color: '#EC4899' },
        ].map(c => (
          <div key={c.label} className="bg-[#141428] border border-white/8 rounded-xl px-4 py-2.5 flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }}/>
            <span className="text-[0.78rem] font-semibold text-white/50">{c.label}</span>
            <span className="text-[0.95rem] font-black text-white ml-1">{c.value}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search posts…"
          className="flex-1 bg-[#141428] border border-white/10 rounded-xl px-4 py-2.5
            text-[0.85rem] text-white placeholder:text-white/25 outline-none focus:border-accent/50"/>
        <div className="flex gap-2 flex-wrap">
          {['all','published','draft'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-xl text-[0.75rem] font-bold capitalize transition-colors
                ${filter === s ? 'bg-accent/20 text-accent border border-accent/30'
                  : 'bg-[#141428] border border-white/8 text-white/40 hover:text-white/70'}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', ...Object.keys(CAT_LABELS)].map(t => (
            <button key={t} onClick={() => setCatFilter(t)}
              className={`px-3 py-2 rounded-xl text-[0.72rem] font-bold transition-colors
                ${catFilter === t ? 'bg-accent/20 text-accent border border-accent/30'
                  : 'bg-[#141428] border border-white/8 text-white/40 hover:text-white/70'}`}>
              {t === 'all' ? 'All' : CAT_LABELS[t]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts list */}
      <div className="flex flex-col gap-3">
        {loading && Array(5).fill(0).map((_, i) => (
          <div key={i} className="bg-[#141428] border border-white/8 rounded-xl p-4 h-20 animate-pulse"/>
        ))}

        <AnimatePresence>
          {!loading && filtered.length === 0 && (
            <p className="text-center text-white/30 text-[0.85rem] py-10">No posts match filters.</p>
          )}
          {!loading && filtered.map(p => {
            const cat = CAT_LABELS[p.category_id]
            return (
              <motion.div key={p.slug} layout
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
                className="bg-[#141428] border border-white/8 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">

                <div className="w-2 h-2 rounded-full shrink-0 mt-1 sm:mt-0 hidden sm:block"
                  style={{ background: cat?.color || '#6b7280' }}/>

                <div className="flex-1 min-w-0">
                  <p className="text-[0.85rem] font-semibold text-white/80 leading-snug mb-1 line-clamp-2">
                    {p.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {cat && (
                      <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-md"
                        style={{ background: `color-mix(in srgb, ${cat.color} 15%, #0f0f25)`, color: cat.color }}>
                        {cat.label}
                      </span>
                    )}
                    <span className="text-[0.68rem] text-white/35">{p.author_name}</span>
                    <span className="text-[0.68rem] text-white/25">·</span>
                    <span className="text-[0.68rem] text-white/25">{fmtDate(p.created_at)}</span>
                    {p.is_featured && (
                      <span className="text-[0.62rem] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400">★ Featured</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[0.65rem] font-bold px-2.5 py-1 rounded-lg
                    ${p.is_published
                      ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'}`}>
                    {p.is_published ? 'Published' : 'Draft'}
                  </span>
                  <button onClick={() => setEditing(p)} disabled={busy[p.slug]}
                    className="text-[0.68rem] font-bold px-2.5 py-1 rounded-lg
                      bg-white/5 text-white/50 hover:bg-white/10 transition-colors disabled:opacity-40">
                    Edit
                  </button>
                  <button onClick={() => togglePublish(p)} disabled={busy[p.slug]}
                    className={`text-[0.68rem] font-bold px-2.5 py-1 rounded-lg transition-colors disabled:opacity-40
                      ${p.is_published
                        ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                        : 'bg-green-500/15 text-green-400 hover:bg-green-500/25'}`}>
                    {p.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => deletePost(p.slug)} disabled={busy[p.slug]}
                    className="text-[0.68rem] font-bold px-2.5 py-1 rounded-lg
                      bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-40">
                    Delete
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}
