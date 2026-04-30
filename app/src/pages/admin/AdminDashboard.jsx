import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AdminLayout from './AdminLayout'
import { api } from '../../api/client'

function fmtINR(paise) {
  if (!paise) return '₹0'
  return '₹' + (paise / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })
}
function fmtDate(s) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })
}

/* ── Stat card ── */
function StatCard({ label, value, sub, trend, color, icon, index }) {
  const isUp = trend > 0
  return (
    <motion.div className="bg-[#141428] border border-white/8 rounded-2xl p-5"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: `color-mix(in srgb, ${color} 18%, #0f0f25)` }}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`text-[0.68rem] font-bold px-2 py-0.5 rounded-lg
            ${isUp ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
            {isUp ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="text-[2rem] font-black text-white leading-none mb-1">{value}</div>
      <div className="text-[0.75rem] font-semibold text-white/40">{label}</div>
      {sub && <div className="text-[0.65rem] text-white/25 mt-0.5">{sub}</div>}
    </motion.div>
  )
}

/* ── Bar chart (signups) ── */
function SignupChart({ data, valueKey = "views" }) {
  if (!data?.length) return null
  const max = Math.max(...data.map(d => d[valueKey]), 1)
  return (
    <div className="flex items-end gap-2 h-20">
      {data.map((d, i) => (
        <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
          <span className="text-[0.6rem] text-white/40 font-bold">{d.signups || ''}</span>
          <div className="w-full rounded-sm transition-all"
            style={{
              height: `${Math.max(4, (d[valueKey] / max) * 52)}px`,
              background: i === data.length - 1
                ? 'linear-gradient(180deg,#f5820a,#ec4899)'
                : 'rgba(255,255,255,0.12)',
            }}/>
          <span className="text-[0.55rem] text-white/25 font-semibold">{d.day}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Skeleton loader ── */
function Skeleton({ h = 'h-8', w = 'w-full' }) {
  return <div className={`${h} ${w} rounded-lg bg-white/5 animate-pulse`}/>
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [data, setData]       = useState(null)
  const [pvData, setPvData]   = useState(null)
  const [users, setUsers]     = useState([])
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.adminStats(),
      api.getPageViewStats(),
      api.adminUsers({ limit: 5, page: 1 }),
      api.adminAllPosts({ status: 'draft' }),
    ])
      .then(([statsRes, pvRes, usersRes, postsRes]) => {
        setData(statsRes.data.analytics)
        setPvData(pvRes.data.pageViews)
        setUsers(usersRes.data.users)
        setPosts(postsRes.data.posts.slice(0, 5))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  async function publishPost(slug) {
    await api.adminPublishPost(slug, true)
    setPosts(prev => prev.filter(p => p.slug !== slug))
  }
  async function deletePost(slug) {
    await api.adminDeletePost(slug)
    setPosts(prev => prev.filter(p => p.slug !== slug))
  }

  const a  = data
  const pv = pvData
  const stats = (a && pv) ? [
    { label: 'Page Views (today)', value: pv.today.toLocaleString(), sub: `${pv.week.toLocaleString()} this week`,  color: '#10B981', icon: '📈', trend: undefined },
    { label: 'Total Users',        value: a.users.total,             sub: `${a.users.roles?.premium || 0} premium`, color: '#6366F1', icon: '👥', trend: undefined },
    { label: 'New Signups (week)', value: a.users.week,              sub: `${a.users.today} today`,                 color: '#8B5CF6', icon: '🆕', trend: undefined },
    { label: 'Revenue (total)',    value: fmtINR(a.revenue.total),   sub: `${fmtINR(a.revenue.today)} today`,       color: '#F59E0B', icon: '💰', trend: undefined },
    { label: 'Blog Posts',         value: a.blog.total,              sub: `${a.blog.published} published`,          color: '#EC4899', icon: '📝', trend: undefined },
    { label: 'Questions',          value: a.questions.total,         sub: `${a.questions.premium} premium`,         color: '#4A90D9', icon: '🎯', trend: undefined },
    { label: 'Notes',              value: a.notes.total,             sub: 'Published guides',                       color: '#f5820a', icon: '📚', trend: undefined },
    { label: 'Page Views (month)', value: pv.month.toLocaleString(), sub: 'Last 30 days',                          color: '#14B8A6', icon: '🌐', trend: undefined },
  ] : []

  return (
    <AdminLayout title="Overview">

      {/* Stats grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="bg-[#141428] border border-white/8 rounded-2xl p-5 h-32 animate-pulse"/>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => <StatCard key={s.label} {...s} index={i}/>)}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Signup chart ── */}
        <motion.div className="lg:col-span-2 bg-[#141428] border border-white/8 rounded-2xl p-6"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[0.95rem] font-black text-white">Page Views (last 7 days)</h2>
              <p className="text-[0.7rem] text-white/30 mt-0.5">Daily visits across all pages</p>
            </div>
            {a && (
              <span className="text-[0.68rem] font-bold px-2.5 py-1 rounded-lg bg-green-500/15 text-green-400">
                {a.users.week} this week
              </span>
            )}
          </div>
          {loading ? <Skeleton h="h-20"/> : <SignupChart data={pv?.chartData} valueKey="views"/>}
        </motion.div>

        {/* ── Role breakdown ── */}
        <motion.div className="bg-[#141428] border border-white/8 rounded-2xl p-6"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-[0.95rem] font-black text-white mb-4">User Roles</h2>
          {loading ? (
            <div className="flex flex-col gap-2">{[1,2,3].map(i => <Skeleton key={i} h="h-8"/>)}</div>
          ) : (
            <div className="flex flex-col gap-3">
              {[
                { role: 'user',    label: 'Free Users',  color: '#10B981' },
                { role: 'premium', label: 'Premium',     color: '#F59E0B' },
                { role: 'admin',   label: 'Admins',      color: '#EC4899' },
              ].map(r => {
                const count = a?.users.roles?.[r.role] || 0
                const pct   = a?.users.total ? Math.round(count / a.users.total * 100) : 0
                return (
                  <div key={r.role}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[0.75rem] font-semibold text-white/60">{r.label}</span>
                      <span className="text-[0.75rem] font-black text-white">{count}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: r.color }}/>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* ── Recent users ── */}
        <motion.div className="lg:col-span-2 bg-[#141428] border border-white/8 rounded-2xl p-6"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[0.95rem] font-black text-white">Recent Users</h2>
            <button className="text-[0.72rem] font-bold text-accent hover:opacity-70 transition-opacity"
              onClick={() => navigate('/admin/users')}>
              View all →
            </button>
          </div>
          {loading ? (
            <div className="flex flex-col gap-2">{[1,2,3,4,5].map(i => <Skeleton key={i} h="h-10"/>)}</div>
          ) : (
            <div className="flex flex-col gap-2">
              {users.map(u => (
                <div key={u.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center
                    text-[0.72rem] font-black text-white shrink-0"
                    style={{ background: u.role === 'premium' ? 'linear-gradient(135deg,#f5820a,#ec4899)' : '#1e1e3f' }}>
                    {u.name?.slice(0,2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.8rem] font-bold text-white/80">{u.name}</div>
                    <div className="text-[0.65rem] text-white/30 truncate">{u.email}</div>
                  </div>
                  <span className={`text-[0.6rem] font-bold px-2 py-0.5 rounded-full shrink-0
                    ${u.role === 'premium'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-white/5 text-white/30 border border-white/10'}`}>
                    {u.role}
                  </span>
                  <span className="text-[0.65rem] text-white/25 shrink-0 hidden md:block">{fmtDate(u.created_at)}</span>
                </div>
              ))}
              {users.length === 0 && <p className="text-white/25 text-[0.78rem] text-center py-4">No users yet.</p>}
            </div>
          )}
        </motion.div>

        {/* ── Draft posts (needs review) ── */}
        <motion.div className="bg-[#141428] border border-white/8 rounded-2xl p-6"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[0.95rem] font-black text-white">Draft Posts</h2>
            <button className="text-[0.72rem] font-bold text-accent hover:opacity-70 transition-opacity"
              onClick={() => navigate('/admin/content')}>
              View all →
            </button>
          </div>
          {loading ? (
            <div className="flex flex-col gap-2">{[1,2,3].map(i => <Skeleton key={i} h="h-16"/>)}</div>
          ) : posts.length === 0 ? (
            <p className="text-[0.78rem] text-white/30 text-center py-6">All clear ✓</p>
          ) : (
            <div className="flex flex-col gap-3">
              {posts.map(p => (
                <div key={p.slug} className="p-3 rounded-xl bg-white/4 border border-white/8">
                  <p className="text-[0.78rem] font-semibold text-white/70 leading-snug mb-1.5 line-clamp-2">
                    {p.title}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[0.62rem] text-white/30">{p.author_name} · {fmtDate(p.created_at)}</span>
                    <div className="flex gap-1.5">
                      <button onClick={() => publishPost(p.slug)}
                        className="text-[0.62rem] font-bold px-2 py-0.5 rounded-lg
                          bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors">
                        Publish
                      </button>
                      <button onClick={() => deletePost(p.slug)}
                        className="text-[0.62rem] font-bold px-2 py-0.5 rounded-lg
                          bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  )
}
