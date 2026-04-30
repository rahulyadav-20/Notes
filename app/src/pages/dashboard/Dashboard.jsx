import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { useAuth } from '../../hooks/useAuth'
import { useAuthStore } from '../../store/authStore'
import { COURSE_CATEGORIES, COURSES_DATA } from '../../data/courses'
import { api } from '../../api/client'

/* ── Stat card ── */
function StatCard({ icon, label, value, color, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-line p-5 flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[1.4rem] shrink-0"
        style={{ background: `color-mix(in srgb, ${color} 12%, var(--color-tint))` }}>
        {icon}
      </div>
      <div>
        <div className="text-[1.6rem] font-black text-navy leading-none">{value}</div>
        <div className="text-[0.72rem] font-bold text-muted mt-0.5">{label}</div>
        {sub && <div className="text-[0.65rem] text-muted/60 mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}

/* ── Section header ── */
function SectionTitle({ title, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-[1rem] font-extrabold text-navy">{title}</h2>
      {action && (
        <button className="text-[0.75rem] font-bold text-accent hover:opacity-70 transition-opacity"
          onClick={onAction}>
          {action} →
        </button>
      )}
    </div>
  )
}

/* ── Course quick card ── */
function CourseQuickCard({ slug, course, navigate }) {
  const cat = COURSE_CATEGORIES.find(c => c.courses.includes(slug))
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border border-line
      bg-white ${course.soon ? 'opacity-60' : 'cursor-pointer hover:bg-base2 transition-colors'}`}
      onClick={() => !course.soon && cat && navigate(`/courses/${cat.id}/${slug}`)}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-[1.1rem]"
        style={{ background: `color-mix(in srgb, ${course.color} 12%, var(--color-tint))` }}>
        {cat?.icon || '📚'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[0.8rem] font-bold text-navy truncate">{course.name}</div>
        <div className="text-[0.65rem] text-muted">{course.lessons} lessons · {course.duration}</div>
      </div>
      {course.soon
        ? <span className="text-[0.6rem] font-bold text-muted bg-base2 border border-line px-2 py-0.5 rounded shrink-0">Soon</span>
        : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-muted/40 shrink-0"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      }
    </div>
  )
}

/* ── Question quick row ── */
function QuestionQuickRow({ item, navigate }) {
  const c = { Easy: '#10B981', Medium: '#F59E0B', Hard: '#EF4444' }[item.difficulty] || '#6b7280'
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-line bg-white
      cursor-pointer hover:bg-base2 transition-colors"
      onClick={() => navigate(`/interview/${item.categoryId}/${item.slug}`)}>
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c }}/>
      <span className="flex-1 text-[0.8rem] font-semibold text-navy truncate">{item.title}</span>
      <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full shrink-0"
        style={{ color: c, background: `color-mix(in srgb, ${c} 12%, var(--color-tint))` }}>
        {item.difficulty}
      </span>
    </div>
  )
}

/* ── Hardcoded featured questions for dashboard ── */
const DASHBOARD_QUESTIONS = [
  { slug: 'two-sum',         categoryId: 'dsa',           title: 'Two Sum',                   difficulty: 'Easy'   },
  { slug: 'best-time-buy-sell', categoryId: 'dsa',        title: 'Best Time to Buy & Sell Stock', difficulty: 'Easy' },
  { slug: 'design-url-shortener', categoryId: 'system-design', title: 'Design a URL Shortener', difficulty: 'Medium' },
  { slug: 'nth-salary',      categoryId: 'sql',           title: 'Nth Highest Salary',         difficulty: 'Medium' },
  { slug: 'conflict-team',   categoryId: 'behavioral',    title: 'Conflict With a Teammate',   difficulty: 'Medium' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, isPremium, isAdmin } = useAuth()
  const logout   = useAuthStore(s => s.logout)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.getPlatformStats().then(({ data }) => setStats(data)).catch(() => {})
  }, [])

  if (!user) { navigate('/login'); return null }

  const featuredCourses    = Object.entries(COURSES_DATA).slice(0, 4)
  const totalNotes         = stats?.notes.total      ?? '—'
  const totalQuestions     = stats?.questions.total  ?? '—'
  const totalFreeQuestions = stats?.questions.free   ?? '—'
  const totalBlogs         = stats?.blog.total       ?? '—'
  const totalCourses       = Object.values(COURSES_DATA).filter(c => !c.soon).length

  return (
    <>
      <Navbar />

      {/* ── Welcome header ── */}
      <div className="bg-white border-b border-line py-8 lg:py-10">
        <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16">
          <motion.div
            className="flex items-start justify-between gap-4 flex-wrap"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}>

            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center
                text-[1.2rem] font-black text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, #f5820a, #ec4899)' }}>
                {user.avatar || user.name?.slice(0, 2).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-[0.7rem] font-bold uppercase tracking-[2px] text-accent">
                  Welcome back 👋
                </p>
                <h1 className="text-[1.4rem] sm:text-[1.7rem] font-black text-navy leading-tight">
                  {user.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[0.62rem] font-bold px-2.5 py-1 rounded-full
                    ${isPremium
                      ? 'bg-amber-100 text-amber-700 border border-amber-200'
                      : 'bg-base2 text-muted border border-line'}`}>
                    {isPremium ? '⭐ Premium' : '🆓 Free Plan'}
                  </span>
                  <span className="text-[0.68rem] text-muted">{user.email}</span>
                </div>
              </div>
            </div>

            {!isPremium && (
              <button
                className="px-5 py-2.5 rounded-xl font-bold text-[0.85rem] text-white
                  bg-gradient-to-br from-accent to-accent2
                  shadow-[0_4px_14px_rgba(245,130,10,0.25)] hover:opacity-90 transition-opacity"
                onClick={() => navigate('/upgrade')}>
                ⚡ Upgrade to Premium
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Body ── */}
      <section className="py-8 lg:py-12 bg-base">
        <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { icon: '📝', label: 'Deep-dive notes',      value: totalNotes,             color: '#4A90D9', sub: isPremium || isAdmin ? 'All unlocked' : '2 parts free each' },
              { icon: '🎓', label: 'Courses',              value: totalCourses,           color: '#f5820a', sub: isPremium || isAdmin ? 'Full access'  : 'Free previews'    },
              { icon: '🎯', label: 'Interview questions',  value: totalQuestions,         color: '#6366F1', sub: `${totalFreeQuestions} free · rest premium`                 },
              { icon: '📖', label: 'Blog articles',        value: totalBlogs,             color: '#10B981', sub: 'Free forever'                                              },
            ].map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}>
                <StatCard {...s}/>
              </motion.div>
            ))}
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* ── Left: Courses ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}>
              <SectionTitle title="Available Courses" action="Browse all" onAction={() => navigate('/courses')}/>
              <div className="flex flex-col gap-2.5">
                {featuredCourses.map(([slug, course]) => (
                  <CourseQuickCard key={slug} slug={slug} course={course} navigate={navigate}/>
                ))}
              </div>
            </motion.div>

            {/* ── Right: Interview questions ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}>
              <SectionTitle title="Practice Questions" action="See all" onAction={() => navigate('/interview')}/>
              <div className="flex flex-col gap-2.5">
                {DASHBOARD_QUESTIONS.map(item => (
                  <QuestionQuickRow key={item.slug} item={item} navigate={navigate}/>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Premium upsell (free users only — not for admin/premium) ── */}
          {!isPremium && !isAdmin && (
            <motion.div
              className="mt-10 bg-[#0f0f23] rounded-2xl p-6 sm:p-8 relative overflow-hidden"
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(245,130,10,0.15) 0%, transparent 70%)' }}/>
              <div className="relative flex items-center gap-6 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[2px] text-accent mb-2">
                    Premium Plan
                  </p>
                  <h3 className="text-[1.2rem] font-black text-white mb-2">
                    Unlock everything for ₹999/mo
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {['All notes unlocked', 'All courses', '470+ interview questions', 'Certificates'].map(f => (
                      <span key={f} className="flex items-center gap-1.5 text-[0.72rem] text-white/50">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                          stroke="#10B981" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  className="px-6 py-3 rounded-xl font-bold text-[0.9rem] text-white
                    bg-gradient-to-br from-accent to-accent2
                    shadow-[0_4px_16px_rgba(245,130,10,0.35)] hover:opacity-90 transition-opacity shrink-0"
                  onClick={() => navigate('/upgrade')}>
                  Upgrade Now →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Quick links ── */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: '📝', label: 'Notes',     path: '/notes',     color: '#4A90D9' },
              { icon: '🎓', label: 'Courses',   path: '/courses',   color: '#f5820a' },
              { icon: '🎯', label: 'Interview', path: '/interview', color: '#6366F1' },
              { icon: '📖', label: 'Blog',      path: '/blog',      color: '#10B981' },
            ].map(l => (
              <button key={l.label}
                className="flex items-center gap-3 p-4 rounded-xl bg-white
                  border border-line hover:border-[var(--color-line-hover)] hover:shadow-sm
                  transition-all cursor-pointer text-left"
                onClick={() => navigate(l.path)}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                  style={{ background: `color-mix(in srgb, ${l.color} 12%, var(--color-tint))` }}>
                  {l.icon}
                </div>
                <span className="text-[0.85rem] font-bold text-navy">{l.label}</span>
              </button>
            ))}
          </div>

          {/* ── Account actions ── */}
          <div className="mt-8 flex items-center gap-3 flex-wrap">
            <button
              className="px-4 py-2 rounded-xl text-[0.8rem] font-bold text-muted
                border border-line hover:bg-base2 transition-colors"
              onClick={() => navigate('/settings')}>
              ⚙️ Account Settings
            </button>
            <button
              className="px-4 py-2 rounded-xl text-[0.8rem] font-bold text-red-500
                border border-red-200 hover:bg-red-50 transition-colors"
              onClick={() => { logout(); navigate('/') }}>
              Sign Out
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
