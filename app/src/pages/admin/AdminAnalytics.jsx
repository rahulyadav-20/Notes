import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from './AdminLayout'
import { api } from '../../api/client'

function fmtINR(paise) {
  if (!paise) return '₹0'
  return '₹' + (paise / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

/* ── Bar chart ── */
function BarChart({ data, valueKey, color, label }) {
  if (!data?.length) return null
  const max = Math.max(...data.map(d => d[valueKey]), 1)
  return (
    <div>
      <p className="text-[0.68rem] font-bold text-white/30 mb-3 uppercase tracking-wider">{label}</p>
      <div className="flex items-end gap-2 h-24">
        {data.map((d, i) => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-[0.55rem] text-white/40 font-semibold">{d[valueKey] || ''}</span>
            <div className="w-full rounded-t-sm"
              style={{
                height: `${Math.max(4, (d[valueKey] / max) * 72)}px`,
                background: i === data.length - 1
                  ? `linear-gradient(180deg, ${color}, ${color}88)`
                  : 'rgba(255,255,255,0.10)',
              }}/>
            <span className="text-[0.55rem] text-white/25 font-semibold">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Skeleton({ h = 'h-8', w = 'w-full' }) {
  return <div className={`${h} ${w} rounded-lg bg-white/5 animate-pulse`}/>
}

export default function AdminAnalytics() {
  const [data,    setData]    = useState(null)
  const [pvData,  setPvData]  = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.adminStats(),
      api.getPageViewStats(),
    ])
      .then(([statsRes, pvRes]) => {
        setData(statsRes.data.analytics)
        setPvData(pvRes.data.pageViews)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const a = data

  const pv = pvData
  const kpis = (a && pv) ? [
    { label: 'Page Views (today)', value: pv.today.toLocaleString(),  color: '#10B981' },
    { label: 'Page Views (week)',  value: pv.week.toLocaleString(),   color: '#6366F1' },
    { label: 'Total Users',        value: a.users.total,              color: '#8B5CF6' },
    { label: 'Signups (week)',      value: a.users.week,              color: '#F59E0B' },
    { label: 'Revenue (total)',     value: fmtINR(a.revenue.total),   color: '#EC4899' },
    { label: 'Revenue (today)',     value: fmtINR(a.revenue.today),   color: '#f5820a' },
  ] : []

  const breakdown = a ? [
    { label: 'Free Users',    value: a.users.roles?.user || 0,    color: '#10B981' },
    { label: 'Premium Users', value: a.users.roles?.premium || 0, color: '#F59E0B' },
    { label: 'Admin Users',   value: a.users.roles?.admin || 0,   color: '#EC4899' },
    { label: 'Blog Posts',    value: a.blog.total,                  color: '#6366F1' },
    { label: 'Published',     value: a.blog.published,              color: '#10B981' },
    { label: 'Drafts',        value: a.blog.draft,                  color: '#F59E0B' },
    { label: 'Questions',     value: a.questions.total,             color: '#4A90D9' },
    { label: 'Premium Qs',    value: a.questions.premium,           color: '#f5820a' },
    { label: 'Notes',         value: a.notes.total,                 color: '#14B8A6' },
  ] : []

  return (
    <AdminLayout title="Analytics">

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading
          ? Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-[#141428] border border-white/8 rounded-2xl p-5 h-28 animate-pulse"/>
            ))
          : kpis.map((k, i) => (
              <motion.div key={k.label}
                className="bg-[#141428] border border-white/8 rounded-2xl p-5"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}>
                <span className="text-[0.72rem] font-semibold text-white/40 block mb-3">{k.label}</span>
                <div className="text-[1.8rem] font-black text-white leading-none">{k.value}</div>
                <div className="mt-2 h-0.5 w-8 rounded-full" style={{ background: k.color }}/>
              </motion.div>
            ))
        }
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">

        {/* Page views chart */}
        <motion.div className="bg-[#141428] border border-white/8 rounded-2xl p-6"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[0.95rem] font-black text-white">Page Views (last 7 days)</h2>
              <p className="text-[0.68rem] text-white/30 mt-0.5">{pv?.week?.toLocaleString() || 0} total this week</p>
            </div>
          </div>
          {loading
            ? <Skeleton h="h-24"/>
            : <BarChart data={pv?.chartData} valueKey="views" color="#10B981" label="views per day"/>
          }
        </motion.div>

        {/* User roles */}
        <motion.div className="bg-[#141428] border border-white/8 rounded-2xl p-6"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}>
          <h2 className="text-[0.95rem] font-black text-white mb-5">User Role Breakdown</h2>
          {loading ? (
            <div className="flex flex-col gap-3">{Array(3).fill(0).map((_, i) => <Skeleton key={i} h="h-8"/>)}</div>
          ) : (
            <div className="flex flex-col gap-3">
              {[
                { role: 'Free users',    count: a?.users.roles?.user    || 0, color: '#10B981' },
                { role: 'Premium',       count: a?.users.roles?.premium || 0, color: '#F59E0B' },
                { role: 'Admins',        count: a?.users.roles?.admin   || 0, color: '#EC4899' },
              ].map(r => {
                const pct = a?.users.total ? Math.round(r.count / a.users.total * 100) : 0
                return (
                  <div key={r.role}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[0.78rem] font-semibold text-white/60">{r.role}</span>
                      <span className="text-[0.78rem] font-black text-white">{r.count} <span className="text-white/30 font-normal">({pct}%)</span></span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: r.color }}/>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Content stats grid */}
      <motion.div className="bg-[#141428] border border-white/8 rounded-2xl p-6"
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="text-[0.95rem] font-black text-white mb-5">Content Overview</h2>
        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {Array(9).fill(0).map((_, i) => <Skeleton key={i} h="h-16"/>)}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-4">
            {breakdown.map(b => (
              <div key={b.label} className="text-center">
                <div className="text-[1.5rem] font-black text-white mb-0.5">{b.value}</div>
                <div className="text-[0.62rem] text-white/35 font-semibold leading-tight">{b.label}</div>
                <div className="mt-1.5 h-0.5 w-5 rounded-full mx-auto" style={{ background: b.color }}/>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Top pages */}
      <motion.div className="mt-6 bg-[#141428] border border-white/8 rounded-2xl p-6"
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48 }}>
        <h2 className="text-[0.95rem] font-black text-white mb-4">Top Pages (last 30 days)</h2>
        {loading ? (
          <div className="flex flex-col gap-2">{Array(6).fill(0).map((_, i) => <Skeleton key={i} h="h-8"/>)}</div>
        ) : !pv?.topPages?.length ? (
          <p className="text-white/30 text-[0.82rem]">No page views recorded yet. Browse the site to start tracking.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {pv.topPages.map((p, i) => {
              const maxViews = pv.topPages[0]?.views || 1
              return (
                <div key={p.path}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[0.6rem] font-black text-white/20 w-4 shrink-0">{i+1}</span>
                      <span className="text-[0.75rem] font-semibold text-white/65 truncate max-w-[280px]">{p.path}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[0.65rem] text-white/35 hidden sm:block">
                        {p.unique_visitors} unique
                      </span>
                      <span className="text-[0.72rem] font-bold text-white/60">
                        {p.views.toLocaleString()} views
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(p.views / maxViews) * 100}%`,
                        background: 'linear-gradient(90deg, #f5820a, #ec4899)',
                      }}/>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* Signup chart */}
      <motion.div className="mt-6 bg-[#141428] border border-white/8 rounded-2xl p-6"
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }}>
        <h2 className="text-[0.95rem] font-black text-white mb-5">Daily Signups (last 7 days)</h2>
        {loading
          ? <Skeleton h="h-24"/>
          : <BarChart data={a?.users.chartData} valueKey="signups" color="#6366F1" label="signups per day"/>
        }
      </motion.div>

      {/* Audit log preview */}
      <motion.div className="mt-6 bg-[#141428] border border-white/8 rounded-2xl p-6"
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h2 className="text-[0.95rem] font-black text-white mb-4">Recent Admin Actions</h2>
        <AuditLog/>
      </motion.div>
    </AdminLayout>
  )
}

/* ── Audit log fetched live ── */
function AuditLog() {
  const [logs, setLogs]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.adminLogs({ limit: 8 })
      .then(({ data }) => setLogs(data.logs))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const ACTION_COLOR = {
    update_role:      '#F59E0B',
    deactivate_user:  '#EF4444',
    delete_user:      '#EF4444',
  }

  if (loading) return (
    <div className="flex flex-col gap-2">{Array(4).fill(0).map((_, i) => (
      <div key={i} className="h-10 rounded-lg bg-white/5 animate-pulse"/>
    ))}</div>
  )

  if (!logs.length) return <p className="text-white/30 text-[0.82rem]">No admin actions recorded yet.</p>

  return (
    <div className="flex flex-col gap-2">
      {logs.map(log => (
        <div key={log.id} className="flex items-center gap-3 py-2 border-b border-white/4 last:border-0">
          <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-lg shrink-0"
            style={{
              background: `color-mix(in srgb, ${ACTION_COLOR[log.action] || '#6366F1'} 15%, #0f0f25)`,
              color: ACTION_COLOR[log.action] || '#a5b4fc',
            }}>
            {log.action}
          </span>
          <div className="flex-1 min-w-0">
            <span className="text-[0.75rem] text-white/60">
              <strong className="text-white/80">{log.admin_name}</strong>
              {log.target_name && <> → <strong className="text-white/70">{log.target_name}</strong></>}
            </span>
          </div>
          <span className="text-[0.65rem] text-white/25 shrink-0">
            {new Date(log.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ))}
    </div>
  )
}
