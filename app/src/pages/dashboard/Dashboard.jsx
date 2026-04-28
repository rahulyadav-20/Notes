import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { useAuth } from '../../hooks/useAuth'
import { useAuthStore } from '../../store/authStore'
import { INTERVIEW_CATEGORIES, QUESTIONS_DATA } from '../../data/interview'
import { COURSE_CATEGORIES, COURSES_DATA } from '../../data/courses'
import { BLOG_POSTS } from '../../data/blog'

/* ── Stat card ── */
function StatCard({ icon, label, value, color, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-line p-5 flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[1.4rem] shrink-0"
        style={{ background: `color-mix(in srgb, ${color} 12%, #f5f7ff)` }}>
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
        style={{ background: `color-mix(in srgb, ${course.color} 12%, #f5f7ff)` }}>
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
function QuestionQuickRow({ slug, q, navigate }) {
  const cat = INTERVIEW_CATEGORIES.find(c => c.questions.includes(slug))
  const c = { Easy: '#10B981', Medium: '#F59E0B', Hard: '#EF4444' }[q.difficulty] || '#6b7280'
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-line bg-white
      cursor-pointer hover:bg-base2 transition-colors"
      onClick={() => cat && navigate(`/interview/${cat.id}/${slug}`)}>
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c }}/>
      <span className="flex-1 text-[0.8rem] font-semibold text-navy truncate">{q.title}</span>
      <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full shrink-0"
        style={{ color: c, background: `color-mix(in srgb, ${c} 12%, #f5f7ff)` }}>
        {q.difficulty}
      </span>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, isPremium, plan } = useAuth()
  const logout   = useAuthStore(s => s.logout)

  // Redirect if not logged in
  if (!user) {
    navigate('/login')
    return null
  }

  // Pick some featured content
  const featuredCourses = Object.entries(COURSES_DATA).slice(0, 4)
  const featuredQuestions = Object.entries(QUESTIONS_DATA)
    .filter(([, q]) => q.difficulty === 'Easy' || q.difficulty === 'Medium')
    .slice(0, 5)

  const totalFreeNotes     = 7
  const totalFreeQuestions = INTERVIEW_CATEGORIES.reduce((s, c) => s + c.freeQuestions, 0)
  const totalFreeCourses   = Object.values(COURSES_DATA).filter(c => !c.soon).length

  return (
    <>
      <Navbar />

      {/* ── Welcome header ── */}
      <div className="bg-white border-b border-line py-8 lg:py-10">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12">
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
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { icon: '📝', label: 'Notes available',      value: totalFreeNotes,        color: '#4A90D9',  sub: isPremium ? 'All unlocked' : `${totalFreeNotes} free` },
              { icon: '🎓', label: 'Courses available',    value: totalFreeCourses,      color: '#f5820a',  sub: isPremium ? 'All unlocked' : 'Free access' },
              { icon: '🎯', label: 'Interview questions',  value: `${totalFreeQuestions}+`, color: '#6366F1', sub: `Across 6 topics` },
              { icon: '📖', label: 'Blog articles',        value: BLOG_POSTS.length,     color: '#10B981',  sub: 'Free forever' },
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
                {featuredQuestions.map(([slug, q]) => (
                  <QuestionQuickRow key={slug} slug={slug} q={q} navigate={navigate}/>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Premium upsell (free users only) ── */}
          {!isPremium && (
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
                  border border-line hover:border-[#c5cae5] hover:shadow-sm
                  transition-all cursor-pointer text-left"
                onClick={() => navigate(l.path)}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                  style={{ background: `color-mix(in srgb, ${l.color} 12%, #f5f7ff)` }}>
                  {l.icon}
                </div>
                <span className="text-[0.85rem] font-bold text-navy">{l.label}</span>
              </button>
            ))}
          </div>

          {/* ── Account actions ── */}
          <div className="mt-8 flex items-center gap-3 flex-wrap">
            <button className="px-4 py-2 rounded-xl text-[0.8rem] font-bold text-muted
              border border-line hover:bg-base2 transition-colors">
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
