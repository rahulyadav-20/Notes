import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar    from '../../components/layout/Navbar'
import Footer    from '../../components/layout/Footer'
import { useAuth }      from '../../hooks/useAuth'
import { useAuthStore } from '../../store/authStore'
import { COURSES_DATA } from '../../data/courses'
import { NOTES_DATA }   from '../../data/categories'
import { api }          from '../../api/client'

/* ── Static maps ── */
const NOTE_CATEGORY = {
  kafka: 'data-engineer', spark: 'data-engineer', flink: 'data-engineer',
  druid: 'data-engineer', gcp: 'data-engineer', 'data-modeling': 'data-engineer',
  sql: 'data-engineer', 'machine-learning': 'data-science', langchain: 'ai',
  kubernetes: 'devops', react: 'frontend', javascript: 'frontend',
}

const TOPIC_META = {
  dsa:               { title: 'DSA & Algorithms',   icon: '📐', color: '#EC4899' },
  'system-design':   { title: 'System Design',      icon: '🏛️', color: '#6366F1' },
  'data-engineering':{ title: 'Data Engineering',   icon: '🗄️', color: '#4A90D9' },
  sql:               { title: 'SQL',                icon: '🗃️', color: '#336791' },
  'machine-learning':{ title: 'Machine Learning',   icon: '🤖', color: '#8B5CF6' },
  behavioral:        { title: 'Behavioural',        icon: '💬', color: '#10B981' },
}

/* ── Helpers ── */
function formatExpiry(expiresAt) {
  if (!expiresAt) return 'Lifetime access'
  const diff = new Date(expiresAt) - Date.now()
  if (diff < 0) return 'Expired'
  const days = Math.floor(diff / 86_400_000)
  if (days < 30)  return `${days}d left`
  if (days < 365) return `${Math.floor(days / 30)}mo left`
  const y = Math.floor(days / 365)
  const m = Math.floor((days % 365) / 30)
  return m ? `${y}y ${m}mo left` : `${y}y left`
}

function memberSince(createdAt) {
  if (!createdAt) return ''
  return new Date(createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
}

/* ── Owned item row ── */
function OwnedRow({ icon, color, title, sub, expiry, expired, onClick, btnLabel }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-line bg-white
      hover:border-[var(--color-line-hover)] transition-colors">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
        style={{ background: `color-mix(in srgb, ${color} 12%, var(--color-tint))` }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[0.82rem] font-bold text-navy truncate">{title}</p>
        {sub && <p className="text-[0.65rem] text-muted truncate">{sub}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-[0.6rem] font-bold px-2 py-0.5 rounded-full border
          ${expired
            ? 'bg-red-50 text-red-600 border-red-200'
            : 'bg-green-50 text-green-700 border-green-200'}`}>
          {expiry}
        </span>
        <button
          onClick={onClick}
          className="text-[0.72rem] font-bold px-3 py-1.5 rounded-lg text-white
            hover:opacity-90 transition-opacity"
          style={{ background: color }}>
          {btnLabel}
        </button>
      </div>
    </div>
  )
}

/* ── Section wrapper ── */
function Section({ title, icon, count, color, empty, emptyHint, onBrowse, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <h2 className="text-[0.9rem] font-extrabold text-navy">{title}</h2>
          <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full
            bg-base2 text-muted border border-line">
            {count}
          </span>
        </div>
        {onBrowse && (
          <button onClick={onBrowse}
            className="text-[0.72rem] font-bold text-accent hover:opacity-70 transition-opacity">
            Browse →
          </button>
        )}
      </div>

      {empty ? (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-line bg-base/40 text-center">
          <p className="text-[0.78rem] text-muted flex-1">{emptyHint}</p>
          <button onClick={onBrowse}
            className="text-[0.75rem] font-bold px-3 py-1.5 rounded-lg bg-navy text-white
              hover:bg-navy2 transition-colors shrink-0">
            Buy now
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">{children}</div>
      )}
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════ */
export default function Dashboard() {
  const navigate = useNavigate()
  const { user, isPremium, isAdmin, purchases, purchasesLoading } = useAuth()
  const logout = useAuthStore(s => s.logout)
  const [bookmarks,     setBookmarks]     = useState([])
  const [noteProgress,  setNoteProgress]  = useState([])

  useEffect(() => {
    if (!user) return
    api.getBookmarks()
      .then(({ data }) => setBookmarks(data.bookmarks ?? []))
      .catch(() => {})
    api.getMyNoteProgress()
      .then(({ data }) => setNoteProgress(data.progress || []))
      .catch(() => {})
  }, [user])

  if (!user) { navigate('/login'); return null }

  /* ── Enrich purchases with display data ── */
  const ownedNotes = (purchases?.notes ?? []).map(p => {
    const meta = NOTES_DATA[p.slug] ?? {}
    return {
      ...p,
      name:     meta.name  ?? p.slug,
      icon:     meta.icon  ?? '📚',
      color:    meta.color ?? '#4A90D9',
      category: NOTE_CATEGORY[p.slug] ?? 'data-engineer',
      expired:  p.expiresAt && new Date(p.expiresAt) < new Date(),
      expiry:   formatExpiry(p.expiresAt),
    }
  })

  const ownedCourses = (purchases?.courses ?? []).map(p => {
    const meta = COURSES_DATA[p.slug] ?? {}
    return {
      ...p,
      name:     meta.name     ?? p.slug,
      icon:     '🎓',
      color:    meta.color    ?? '#f5820a',
      lessons:  meta.lessons  ?? null,
      duration: meta.duration ?? null,
      expired:  p.expiresAt && new Date(p.expiresAt) < new Date(),
      expiry:   formatExpiry(p.expiresAt),
    }
  })

  const ownedInterviews = (purchases?.interviews ?? []).map(p => {
    const meta = TOPIC_META[p.slug] ?? {}
    return {
      ...p,
      name:    meta.title ?? p.slug,
      icon:    meta.icon  ?? '🎯',
      color:   meta.color ?? '#6366F1',
      expired: p.expiresAt && new Date(p.expiresAt) < new Date(),
      expiry:  formatExpiry(p.expiresAt),
    }
  })

  const totalOwned = ownedNotes.length + ownedCourses.length + ownedInterviews.length

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-base">
        <div className="max-w-[900px] mx-auto px-5 sm:px-8 py-8 lg:py-12 flex flex-col gap-8">

          {/* ── User header ── */}
          <motion.div
            className="bg-white rounded-2xl border border-line p-6"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-start justify-between gap-4 flex-wrap">

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center
                  text-[1.3rem] font-black text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, #f5820a, #ec4899)' }}>
                  {user.avatar || user.name?.slice(0, 2).toUpperCase() || 'U'}
                </div>
                <div>
                  <h1 className="text-[1.3rem] font-black text-navy leading-tight">
                    {user.name}
                  </h1>
                  <p className="text-[0.75rem] text-muted mt-0.5">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {purchasesLoading
                      ? <span className="w-14 h-5 rounded-full bg-base2 animate-pulse"/>
                      : (
                        <span className={`text-[0.6rem] font-bold px-2.5 py-1 rounded-full border
                          ${isAdmin
                            ? 'bg-purple-100 text-purple-700 border-purple-200'
                            : isPremium
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-base2 text-muted border-line'}`}>
                          {isAdmin ? '🔑 Admin' : isPremium ? '✓ Active' : '🆓 Free'}
                        </span>
                      )
                    }
                    {user.created_at && (
                      <span className="text-[0.6rem] text-muted">
                        Member since {memberSince(user.created_at)}
                      </span>
                    )}
                    <span className="text-[0.6rem] text-muted">
                      {totalOwned} item{totalOwned !== 1 ? 's' : ''} owned
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {!isAdmin && (
                  <button
                    onClick={() => navigate('/upgrade')}
                    className="px-4 py-2 rounded-xl font-bold text-[0.8rem] text-white
                      bg-gradient-to-br from-accent to-accent2
                      shadow-[0_4px_14px_rgba(245,130,10,0.25)] hover:opacity-90 transition-opacity">
                    🛒 Browse & Buy
                  </button>
                )}
                <button
                  onClick={() => navigate('/settings')}
                  className="px-4 py-2 rounded-xl font-bold text-[0.8rem] text-navy
                    border border-line hover:bg-base2 transition-colors">
                  ⚙️ Settings
                </button>
                <button
                  onClick={() => { logout(); navigate('/') }}
                  className="px-4 py-2 rounded-xl font-bold text-[0.8rem] text-red-500
                    border border-red-200 hover:bg-red-50 transition-colors">
                  Sign out
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── No purchases state ── */}
          {totalOwned === 0 && !isAdmin && (
            <motion.div
              className="bg-white rounded-2xl border border-line p-8 text-center"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
              <div className="text-4xl mb-3">📦</div>
              <h2 className="text-[1.1rem] font-black text-navy mb-2">No purchases yet</h2>
              <p className="text-[0.82rem] text-muted mb-5 max-w-[360px] mx-auto leading-relaxed">
                Buy any note, interview pack, or course to unlock full access.
                Each item is valid for 2 years from purchase.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap text-[0.75rem] text-muted mb-5">
                <span className="flex items-center gap-1"><span className="text-base">📚</span> Notes from ₹99</span>
                <span className="text-line">·</span>
                <span className="flex items-center gap-1"><span className="text-base">🎯</span> Interview packs from ₹99</span>
                <span className="text-line">·</span>
                <span className="flex items-center gap-1"><span className="text-base">🎓</span> Courses from ₹999</span>
              </div>
              <button
                onClick={() => navigate('/upgrade')}
                className="px-6 py-3 rounded-xl font-bold text-[0.9rem] text-white
                  bg-gradient-to-br from-accent to-accent2
                  shadow-[0_4px_16px_rgba(245,130,10,0.3)] hover:opacity-90 transition-opacity">
                Browse & Buy →
              </button>
            </motion.div>
          )}

          {/* ── Continue Reading ── */}
          {noteProgress.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📖</span>
                  <h2 className="text-[0.9rem] font-extrabold text-navy">Continue Reading</h2>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {noteProgress.slice(0, 4).map(p => {
                  const pct = p.totalParts > 0
                    ? Math.round((p.viewedParts.length / p.totalParts) * 100) : 0
                  const nextPart = p.lastPart + 1
                  const finished = p.viewedParts.length >= p.totalParts && p.totalParts > 0
                  return (
                    <div key={p.slug}
                      className="flex items-center gap-3 p-3 rounded-xl border border-line bg-white
                        hover:border-[var(--color-line-hover)] transition-colors">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                        style={{ background: `color-mix(in srgb, ${p.color} 12%, var(--color-tint))` }}>
                        {p.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[0.82rem] font-bold text-navy truncate">{p.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1 bg-base2 rounded-full overflow-hidden max-w-[80px]">
                            <div className="h-full rounded-full bg-green-400 transition-all"
                              style={{ width: `${pct}%` }}/>
                          </div>
                          <span className="text-[0.62rem] text-muted">
                            {p.viewedParts.length}/{p.totalParts} parts
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          await api.resetNoteProgress(p.slug)
                          setNoteProgress(prev => prev.filter(x => x.slug !== p.slug))
                        }}
                        title="Reset reading progress"
                        className="text-[0.6rem] text-muted/50 hover:text-red-400 transition-colors shrink-0 px-1">
                        ↺
                      </button>
                      <button
                        onClick={() => navigate(`/notes/${p.category}/${p.slug}`)}
                        className="text-[0.72rem] font-bold px-3 py-1.5 rounded-lg text-white
                          hover:opacity-90 transition-opacity shrink-0"
                        style={{ background: finished ? '#10B981' : p.color }}>
                        {finished ? '✓ Done' : `Part ${nextPart} →`}
                      </button>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* ── Owned content ── */}
          {(totalOwned > 0 || isAdmin) && (
            <div className="flex flex-col gap-6">

              {/* My Notes */}
              <Section
                title="My Notes" icon="📚" count={ownedNotes.length}
                empty={ownedNotes.length === 0}
                emptyHint="You haven't bought any notes yet."
                onBrowse={() => navigate('/notes')}
                delay={0.05}>
                {ownedNotes.map(n => (
                  <OwnedRow key={n.slug}
                    icon={n.icon} color={n.color}
                    title={n.name}
                    sub={`/notes/${n.category}/${n.slug}`}
                    expiry={n.expiry} expired={n.expired}
                    btnLabel="Read →"
                    onClick={() => navigate(`/notes/${n.category}/${n.slug}`)}
                  />
                ))}
              </Section>

              {/* My Courses */}
              <Section
                title="My Courses" icon="🎓" count={ownedCourses.length}
                empty={ownedCourses.length === 0}
                emptyHint="You haven't enrolled in any courses yet."
                onBrowse={() => navigate('/courses')}
                delay={0.1}>
                {ownedCourses.map(c => (
                  <OwnedRow key={c.slug}
                    icon={c.icon} color={c.color}
                    title={c.name}
                    sub={c.lessons ? `${c.lessons} lessons · ${c.duration}` : null}
                    expiry={c.expiry} expired={c.expired}
                    btnLabel="Learn →"
                    onClick={() => navigate('/courses')}
                  />
                ))}
              </Section>

              {/* My Interview Packs */}
              <Section
                title="My Interview Packs" icon="🎯" count={ownedInterviews.length}
                empty={ownedInterviews.length === 0}
                emptyHint="You haven't bought any interview packs yet."
                onBrowse={() => navigate('/interview')}
                delay={0.15}>
                {ownedInterviews.map(t => (
                  <OwnedRow key={t.slug}
                    icon={t.icon} color={t.color}
                    title={t.name}
                    expiry={t.expiry} expired={t.expired}
                    btnLabel="Practice →"
                    onClick={() => navigate(`/interview/${t.slug}`)}
                  />
                ))}
              </Section>
            </div>
          )}

          {/* ── Bookmarks ── */}
          {bookmarks.length > 0 && (
            <Section
              title="Bookmarks" icon="🔖" count={bookmarks.length}
              onBrowse={() => navigate('/notes')}
              delay={0.2}>
              {bookmarks.slice(0, 5).map(b => {
                const slug = b.note_slug
                const meta = NOTES_DATA[slug] ?? {}
                const cat  = NOTE_CATEGORY[slug] ?? 'data-engineer'
                return (
                  <OwnedRow key={slug}
                    icon={meta.icon ?? '📚'} color={meta.color ?? '#4A90D9'}
                    title={meta.name ?? slug}
                    expiry="Bookmarked" expired={false}
                    btnLabel="Open →"
                    onClick={() => navigate(`/notes/${cat}/${slug}`)}
                  />
                )
              })}
            </Section>
          )}

          {/* ── Quick nav ── */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}>
            {[
              { icon: '📝', label: 'All Notes',    path: '/notes',     color: '#4A90D9' },
              { icon: '🎓', label: 'All Courses',  path: '/courses',   color: '#f5820a' },
              { icon: '🎯', label: 'Interview',    path: '/interview', color: '#6366F1' },
              { icon: '📖', label: 'Blog',         path: '/blog',      color: '#10B981' },
            ].map(l => (
              <button key={l.label}
                className="flex items-center gap-3 p-4 rounded-xl bg-white
                  border border-line hover:border-[var(--color-line-hover)]
                  hover:shadow-sm transition-all cursor-pointer text-left"
                onClick={() => navigate(l.path)}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                  style={{ background: `color-mix(in srgb, ${l.color} 12%, var(--color-tint))` }}>
                  {l.icon}
                </div>
                <span className="text-[0.82rem] font-bold text-navy">{l.label}</span>
              </button>
            ))}
          </motion.div>

        </div>
      </div>

      <Footer />
    </>
  )
}
