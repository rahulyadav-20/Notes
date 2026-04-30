import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from './AdminLayout'
import { api } from '../../api/client'

function fmtDate(s) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })
}

/* ════════════════════════════════════════════════════════
   USER ACCESS MODAL
════════════════════════════════════════════════════════ */
function AccessModal({ user, onClose }) {
  const [access,    setAccess]    = useState(null)
  const [pricing,   setPricing]   = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [tab,       setTab]       = useState('view')   // 'view' | 'grant'
  const [grantForm, setGrantForm] = useState({ type: 'note', slug: '', expiresAt: '' })
  const [saving,    setSaving]    = useState(false)
  const [toast,     setToast]     = useState(null)

  const showToast = (msg, t = 'success') => { setToast({ msg, t }); setTimeout(() => setToast(null), 3000) }

  useEffect(() => {
    Promise.all([
      api.adminGetUserAccess(user.id),
      api.adminGetPricing(),
    ])
      .then(([accRes, priceRes]) => {
        setAccess(accRes.data)
        setPricing(priceRes.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [user.id])

  // All available slugs per type for the grant dropdown
  const slugOptions = {
    note:      (pricing?.notes      || []).map(n => ({ slug: n.slug,  label: n.title })),
    course:    (pricing?.courses    || []).map(c => ({ slug: c.slug,  label: c.title })),
    interview: (pricing?.interviews || []).map(i => ({ slug: i.slug,  label: i.title })),
  }

  async function grant() {
    if (!grantForm.slug) { showToast('Select an item.', 'error'); return }
    setSaving(true)
    try {
      await api.adminGrantAccess(user.id, {
        type:      grantForm.type,
        slug:      grantForm.slug,
        expiresAt: grantForm.expiresAt || null,
      })
      showToast(`Access granted: ${grantForm.type} — ${grantForm.slug}`)
      // Refresh access list
      const { data } = await api.adminGetUserAccess(user.id)
      setAccess(data)
      setGrantForm({ type: 'note', slug: '', expiresAt: '' })
      setTab('view')
    } catch (e) {
      showToast(e.response?.data?.error || 'Failed.', 'error')
    }
    setSaving(false)
  }

  async function revoke(type, slug) {
    try {
      await api.adminRevokeAccess(user.id, { type, slug })
      showToast(`Access revoked: ${slug}`)
      const { data } = await api.adminGetUserAccess(user.id)
      setAccess(data)
    } catch (e) {
      showToast('Revoke failed.', 'error')
    }
  }

  const allAccess = [
    ...(access?.notes      || []).map(a => ({ ...a, type: 'note' })),
    ...(access?.interviews || []).map(a => ({ ...a, type: 'interview' })),
    ...(access?.courses    || []).map(a => ({ ...a, type: 'course' })),
  ]

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}>
      <motion.div className="bg-[#1c1c30] border border-white/10 rounded-2xl w-full max-w-[560px]
        max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
        initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <div>
            <h3 className="text-[0.95rem] font-black text-white">Content Access</h3>
            <p className="text-[0.72rem] text-white/40 mt-0.5">{user.name} · {user.email}</p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div className={`mx-4 mt-3 px-4 py-2 rounded-xl text-[0.78rem] font-semibold
              ${toast.t === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex border-b border-white/8 px-4 pt-2">
          {[['view','Current Access'], ['grant','Grant Access']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-4 py-2.5 text-[0.78rem] font-bold border-b-2 transition-colors
                ${tab === id ? 'border-accent text-accent' : 'border-transparent text-white/40 hover:text-white/60'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">

          {/* ── View current access ── */}
          {tab === 'view' && (
            <div className="flex flex-col gap-2">
              {loading ? (
                Array(3).fill(0).map((_, i) => <div key={i} className="h-10 rounded-lg bg-white/5 animate-pulse"/>)
              ) : allAccess.length === 0 ? (
                <div className="text-center py-10 text-white/25 text-[0.82rem]">
                  No content access granted yet.
                </div>
              ) : (
                allAccess.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/4 border border-white/6">
                    <span className={`text-[0.6rem] font-black px-2 py-0.5 rounded uppercase tracking-wider shrink-0
                      ${a.type === 'note' ? 'bg-blue-500/20 text-blue-400'
                        : a.type === 'interview' ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-orange-500/20 text-orange-400'}`}>
                      {a.type}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.82rem] font-semibold text-white/80 truncate">{a.title || a.slug}</p>
                      <p className="text-[0.65rem] text-white/30">
                        {a.source === 'admin' ? '🛡 Admin grant' : '💳 Purchased'}
                        {a.expires_at ? ` · Expires ${fmtDate(a.expires_at)}` : ' · No expiry'}
                      </p>
                    </div>
                    <button onClick={() => revoke(a.type, a.slug || a.topic_slug || a.note_slug)}
                      className="text-[0.65rem] font-bold px-2 py-1 rounded-lg shrink-0
                        bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                      Revoke
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── Grant new access ── */}
          {tab === 'grant' && (
            <div className="flex flex-col gap-4">
              {/* Type */}
              <div>
                <label className="text-[0.72rem] font-bold text-white/50 mb-2 block">Content Type</label>
                <div className="flex gap-2">
                  {['note','course','interview'].map(t => (
                    <button key={t} onClick={() => setGrantForm(f => ({ ...f, type: t, slug: '' }))}
                      className={`flex-1 py-2 rounded-xl text-[0.75rem] font-bold capitalize transition-colors
                        ${grantForm.type === t
                          ? 'bg-accent/20 text-accent border border-accent/30'
                          : 'bg-white/5 text-white/40 border border-white/8 hover:text-white/60'}`}>
                      {t === 'note' ? '📚 Note' : t === 'course' ? '🎓 Course' : '🎯 Interview'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Item selector */}
              <div>
                <label className="text-[0.72rem] font-bold text-white/50 mb-2 block">Select Item</label>
                <select value={grantForm.slug}
                  onChange={e => setGrantForm(f => ({ ...f, slug: e.target.value }))}
                  className="w-full bg-[#0d0d1e] border border-white/10 rounded-xl px-4 py-2.5
                    text-[0.85rem] text-white/70 outline-none focus:border-accent/50">
                  <option value="">— Choose {grantForm.type} —</option>
                  {(slugOptions[grantForm.type] || []).map(opt => (
                    <option key={opt.slug} value={opt.slug}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Expiry date (optional) */}
              <div>
                <label className="text-[0.72rem] font-bold text-white/50 mb-2 block">
                  Expires On <span className="text-white/25 font-normal">(leave blank = permanent)</span>
                </label>
                <input type="date" value={grantForm.expiresAt}
                  onChange={e => setGrantForm(f => ({ ...f, expiresAt: e.target.value }))}
                  className="w-full bg-[#0d0d1e] border border-white/10 rounded-xl px-4 py-2.5
                    text-[0.85rem] text-white/70 outline-none focus:border-accent/50"/>
              </div>

              <button onClick={grant} disabled={saving || !grantForm.slug}
                className="w-full py-3 rounded-xl font-bold text-[0.88rem] text-white
                  bg-gradient-to-br from-accent to-accent2 hover:opacity-90
                  disabled:opacity-40 transition-opacity">
                {saving ? 'Granting…' : `Grant Access to ${grantForm.slug || '—'}`}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Confirm modal ── */
function ConfirmModal({ msg, onConfirm, onCancel }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onCancel}>
      <motion.div className="bg-[#1c1c30] border border-white/10 rounded-2xl p-6 w-full max-w-[360px]"
        initial={{ scale: 0.9 }} animate={{ scale: 1 }}
        onClick={e => e.stopPropagation()}>
        <p className="text-[0.9rem] text-white font-semibold mb-5 leading-relaxed">{msg}</p>
        <div className="flex gap-3">
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl font-bold text-[0.85rem] text-white bg-red-500 hover:bg-red-600 transition-colors">
            Confirm
          </button>
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl font-bold text-[0.85rem] text-white/50 border border-white/10 hover:bg-white/5 transition-colors">
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

const ROLES   = ['all', 'user', 'premium', 'admin']

export default function AdminUsers() {
  const [users,   setUsers]   = useState([])
  const [total,   setTotal]   = useState(0)
  const [pages,   setPages]   = useState(1)
  const [page,    setPage]    = useState(1)
  const [search,  setSearch]  = useState('')
  const [role,    setRole]    = useState('all')
  const [loading, setLoading] = useState(true)
  const [busy,       setBusy]       = useState({})
  const [confirm,    setConfirm]    = useState(null)
  const [toast,      setToast]      = useState(null)
  const [accessUser, setAccessUser] = useState(null)  // user whose access modal is open

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(() => {
    setLoading(true)
    api.adminUsers({ page, limit: 15, search: search || undefined, role: role === 'all' ? undefined : role })
      .then(({ data }) => {
        setUsers(data.users)
        setTotal(data.pagination.total)
        setPages(data.pagination.pages)
      })
      .catch(() => showToast('Failed to load users.', 'error'))
      .finally(() => setLoading(false))
  }, [page, search, role])

  useEffect(() => { load() }, [load])

  // Debounce search
  useEffect(() => {
    const t = setTimeout(load, 350)
    return () => clearTimeout(t)
  }, [search]) // eslint-disable-line

  async function setUserRole(id, newRole) {
    setBusy(b => ({ ...b, [id]: true }))
    try {
      await api.adminSetRole(id, newRole)
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u))
      showToast(`Role updated to ${newRole}.`)
    } catch (e) {
      showToast(e.response?.data?.error || 'Failed.', 'error')
    }
    setBusy(b => ({ ...b, [id]: false }))
  }

  async function deactivate(id) {
    setBusy(b => ({ ...b, [id]: true }))
    try {
      await api.adminDelUser(id)
      setUsers(prev => prev.filter(u => u.id !== id))
      setTotal(t => t - 1)
      showToast('User deactivated.')
    } catch (e) {
      showToast(e.response?.data?.error || 'Failed.', 'error')
    }
    setBusy(b => ({ ...b, [id]: false }))
    setConfirm(null)
  }

  const premiumCount  = users.filter(u => u.role === 'premium').length
  const adminCount    = users.filter(u => u.role === 'admin').length

  return (
    <AdminLayout title="Users">

      {/* Access modal */}
      <AnimatePresence>
        {accessUser && (
          <AccessModal user={accessUser} onClose={() => setAccessUser(null)}/>
        )}
      </AnimatePresence>

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

      {/* Confirm modal */}
      <AnimatePresence>
        {confirm && <ConfirmModal {...confirm} onCancel={() => setConfirm(null)}/>}
      </AnimatePresence>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { label: 'Total',   value: total,        color: '#6366F1' },
          { label: 'Premium', value: premiumCount,  color: '#F59E0B' },
          { label: 'Admins',  value: adminCount,    color: '#EC4899' },
          { label: 'Free',    value: total - premiumCount - adminCount, color: '#10B981' },
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
        <input
          value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search by name or email…"
          className="flex-1 bg-[#141428] border border-white/10 rounded-xl px-4 py-2.5
            text-[0.85rem] text-white placeholder:text-white/25 outline-none
            focus:border-accent/50 transition-colors"/>
        <div className="flex gap-2 flex-wrap">
          {ROLES.map(r => (
            <button key={r} onClick={() => { setRole(r); setPage(1) }}
              className={`px-3 py-2 rounded-xl text-[0.75rem] font-bold capitalize transition-colors
                ${role === r
                  ? 'bg-accent/20 text-accent border border-accent/30'
                  : 'bg-[#141428] border border-white/8 text-white/40 hover:text-white/70'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div className="bg-[#141428] border border-white/8 rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

        <div className="hidden md:grid grid-cols-[2.5fr_2.5fr_1fr_1fr_1.2fr_auto] gap-4
          px-5 py-3 border-b border-white/6 text-[0.65rem] font-black uppercase tracking-wider text-white/25">
          <span>User</span><span>Email</span><span>Role</span><span>Joined</span>
          <span>Change role</span><span>Actions</span>
        </div>

        {loading && (
          <div className="flex flex-col gap-0">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="px-5 py-4 border-b border-white/4 last:border-0 flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 animate-pulse shrink-0"/>
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="h-3 w-32 bg-white/5 rounded animate-pulse"/>
                  <div className="h-2.5 w-48 bg-white/5 rounded animate-pulse"/>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && users.length === 0 && (
          <p className="text-center text-white/30 text-[0.85rem] py-10">No users match your filters.</p>
        )}

        {!loading && users.map(u => (
          <div key={u.id}
            className="grid md:grid-cols-[2.5fr_2.5fr_1fr_1fr_1.2fr_auto] gap-4 items-center
              px-5 py-3.5 border-b border-white/4 last:border-0 hover:bg-white/3 transition-colors">

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[0.7rem] font-black text-white shrink-0"
                style={{ background: u.role === 'premium' ? 'linear-gradient(135deg,#f5820a,#ec4899)' : u.role === 'admin' ? 'linear-gradient(135deg,#6366f1,#ec4899)' : '#1e1e3f' }}>
                {u.name?.slice(0,2).toUpperCase()}
              </div>
              <span className="text-[0.82rem] font-semibold text-white/80 truncate">{u.name}</span>
            </div>

            <span className="text-[0.75rem] text-white/40 truncate hidden md:block">{u.email}</span>

            <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-full w-fit
              ${u.role === 'premium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : u.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'bg-white/5 text-white/35 border border-white/10'}`}>
              {u.role}
            </span>

            <span className="text-[0.72rem] text-white/30 hidden md:block">{fmtDate(u.created_at)}</span>

            {/* Role selector */}
            <select
              value={u.role === 'admin' ? 'admin' : u.role}
              disabled={busy[u.id] || u.role === 'admin'}
              onChange={e => setUserRole(u.id, e.target.value)}
              title={u.role === 'admin' ? 'Admin role can only be changed via database' : ''}
              className="bg-[#0d0d1e] border border-white/10 rounded-lg px-2 py-1.5
                text-[0.72rem] text-white/70 outline-none focus:border-accent/50
                disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
              <option value="user">user</option>
              <option value="premium">premium</option>
              {/* admin option intentionally omitted — set via DB only */}
              {u.role === 'admin' && <option value="admin" disabled>admin (DB only)</option>}
            </select>

            {/* Access */}
            <button
              onClick={() => setAccessUser(u)}
              className="text-[0.62rem] font-bold px-2 py-1 rounded-lg
                bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
              Access
            </button>

            {/* Deactivate */}
            <button
              disabled={busy[u.id]}
              onClick={() => setConfirm({
                msg: `Deactivate account for ${u.name}? They won't be able to log in.`,
                onConfirm: () => deactivate(u.id),
              })}
              className="text-[0.62rem] font-bold px-2 py-1 rounded-lg
                bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors
                disabled:opacity-40">
              Deactivate
            </button>
          </div>
        ))}
      </motion.div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-[0.68rem] text-white/20">
            Showing {users.length} of {total} users
          </p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 rounded-lg text-[0.72rem] font-bold
                bg-[#141428] border border-white/8 text-white/40
                hover:text-white/70 disabled:opacity-30 transition-colors">
              ← Prev
            </button>
            <span className="px-3 py-1.5 text-[0.72rem] font-bold text-white/40">
              {page} / {pages}
            </span>
            <button disabled={page === pages} onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 rounded-lg text-[0.72rem] font-bold
                bg-[#141428] border border-white/8 text-white/40
                hover:text-white/70 disabled:opacity-30 transition-colors">
              Next →
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
