import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from './AdminLayout'
import { api } from '../../api/client'

/* ── Price input with inline save ── */
function PriceRow({ item, type, onSave }) {
  const [editing,  setEditing]  = useState(false)
  const [rupees,   setRupees]   = useState(Math.round((item.price || 0) / 100))
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(item.slug, rupees * 100)
      setSaved(true)
      setEditing(false)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to save price.')
    }
    setSaving(false)
  }

  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0
      hover:bg-white/3 transition-colors">

      {/* Icon + name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {item.icon && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0"
            style={{ background: item.color ? `color-mix(in srgb, ${item.color} 18%, #0f0f25)` : '#1e1e3f' }}>
            {item.icon}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[0.85rem] font-semibold text-white/80 truncate">{item.title}</p>
          <p className="text-[0.67rem] text-white/30 font-mono">{item.slug}</p>
        </div>
      </div>

      {/* Price display / edit */}
      <div className="flex items-center gap-2 shrink-0">
        {editing ? (
          <>
            <span className="text-[0.82rem] text-white/40 font-bold">₹</span>
            <input
              type="number"
              min="0"
              step="1"
              value={rupees}
              onChange={e => setRupees(parseInt(e.target.value) || 0)}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false) }}
              autoFocus
              className="w-24 bg-[#0d0d1e] border border-accent/50 rounded-lg px-3 py-1.5
                text-[0.85rem] text-white font-mono outline-none text-right"
            />
            <button onClick={handleSave} disabled={saving}
              className="text-[0.72rem] font-bold px-3 py-1.5 rounded-lg
                bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors disabled:opacity-50">
              {saving ? '…' : 'Save'}
            </button>
            <button onClick={() => { setEditing(false); setRupees(Math.round((item.price || 0) / 100)) }}
              className="text-[0.72rem] font-bold px-3 py-1.5 rounded-lg
                bg-white/5 text-white/40 hover:bg-white/10 transition-colors">
              Cancel
            </button>
          </>
        ) : (
          <>
            <span className={`text-[0.95rem] font-black min-w-[60px] text-right
              ${saved ? 'text-green-400' : 'text-white'} transition-colors`}>
              {saved ? '✓ Saved' : `₹${rupees}`}
            </span>
            <button onClick={() => setEditing(true)}
              className="text-[0.68rem] font-bold px-2.5 py-1 rounded-lg
                bg-white/5 text-white/40 hover:bg-accent/15 hover:text-accent transition-colors">
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/* ── Section card ── */
function PricingSection({ title, icon, items, type, onSave, loading }) {
  return (
    <motion.div className="bg-[#141428] border border-white/8 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 bg-white/2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <h3 className="text-[0.92rem] font-black text-white">{title}</h3>
        </div>
        <span className="text-[0.68rem] text-white/30 font-semibold">
          {items.length} items
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col gap-0">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-14 border-b border-white/5 last:border-0 animate-pulse bg-white/2"/>
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-white/25 text-[0.82rem] text-center py-8">No items yet.</p>
      ) : (
        <div>
          {items.map(item => (
            <PriceRow key={item.slug} item={item} type={type} onSave={onSave}/>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default function AdminPricing() {
  const [data,    setData]    = useState({ notes: [], courses: [], interviews: [] })
  const [loading, setLoading] = useState(true)
  const [toast,   setToast]   = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(() => {
    setLoading(true)
    api.adminGetPricing()
      .then(({ data: d }) => setData(d))
      .catch(() => showToast('Failed to load pricing.', 'error'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  async function saveNote(slug, price)      { await api.adminUpdateNotePrice(slug, price);   showToast(`Note "${slug}" price updated.`) }
  async function saveCourse(slug, price)    { await api.adminUpdateCoursePrice(slug, price);  showToast(`Course "${slug}" price updated.`) }
  async function saveInterview(slug, price) { await api.adminUpdateIQPrice(slug, price);      showToast(`Interview "${slug}" price updated.`) }

  return (
    <AdminLayout title="Pricing">

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

      {/* Header */}
      <div className="mb-6">
        <p className="text-[0.78rem] text-white/40 leading-relaxed">
          Prices are stored in <strong className="text-white/60">paise</strong> in the database (100 paise = ₹1).
          Enter the price in <strong className="text-white/60">Rupees</strong> below — it will be converted automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Notes pricing */}
        <PricingSection
          title="Notes"
          icon="📚"
          items={data.notes}
          type="note"
          onSave={saveNote}
          loading={loading}
        />

        {/* Interview topics pricing */}
        <PricingSection
          title="Interview Packs"
          icon="🎯"
          items={data.interviews}
          type="interview"
          onSave={saveInterview}
          loading={loading}
        />

        {/* Courses pricing */}
        <div className="lg:col-span-2">
          <PricingSection
            title="Courses"
            icon="🎓"
            items={data.courses}
            type="course"
            onSave={saveCourse}
            loading={loading}
          />
        </div>
      </div>
    </AdminLayout>
  )
}
