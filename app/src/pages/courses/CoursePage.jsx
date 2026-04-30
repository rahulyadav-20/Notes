import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { getCourseBySlug } from '../../data/courses'
import { NoteIcon } from '../../data/icons'
import { useAuth } from '../../hooks/useAuth'

/* ── Star Rating ── */
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-bold text-amber-400">{rating}</span>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
          <svg key={s} width="13" height="13" viewBox="0 0 24 24"
            fill={s <= Math.round(rating) ? '#F59E0B' : 'rgba(255,255,255,0.2)'} stroke="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
      </div>
    </div>
  )
}

/* ── Check icon ── */
function Check({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke={color || '#10B981'} strokeWidth="2.5" strokeLinecap="round" className="shrink-0 mt-0.5">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  )
}

/* ── Curriculum Accordion ── */
function CurriculumAccordion({ modules, course }) {
  const [open, setOpen] = useState(0)

  // Generate fake lesson titles per module
  const generateLessons = (moduleTitle, count) => {
    const prefixes = ['Introduction to', 'Deep Dive:', 'Hands-on:', 'Understanding', 'Building', 'Optimizing', 'Production']
    const lessons = []
    for (let i = 0; i < Math.min(count, 6); i++) {
      lessons.push(`${prefixes[i % prefixes.length]} ${moduleTitle.split(' ')[0]} ${i > 0 ? `— Part ${i + 1}` : ''}`)
    }
    return lessons
  }

  return (
    <div className="flex flex-col gap-2">
      {modules.map((title, i) => (
        <div key={i} className="border border-line rounded-xl overflow-hidden bg-white">
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left
              hover:bg-base/40 transition-colors"
            onClick={() => setOpen(open === i ? -1 : i)}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center
                text-[0.7rem] font-black shrink-0"
                style={{
                  background: open === i
                    ? `color-mix(in srgb, ${course.color} 15%, #f0f2ff)`
                    : '#f3f4f8',
                  color: open === i ? course.color : '#6b7280',
                }}>
                {i + 1}
              </span>
              <span className={`text-[0.88rem] font-bold leading-snug
                ${open === i ? 'text-navy' : 'text-navy/80'}`}>
                {title}
              </span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              className={`text-muted shrink-0 transition-transform duration-200
                ${open === i ? 'rotate-180' : ''}`}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}>
                <div className="border-t border-line">
                  {generateLessons(title, Math.ceil(course.lessons / modules.length)).map((lesson, j) => (
                    <div key={j}
                      className="flex items-center gap-3 px-5 py-3 border-b border-line/60
                        last:border-0 hover:bg-base/30 transition-colors">
                      <div className="w-7 h-7 rounded-lg bg-base flex items-center justify-center shrink-0">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                          className="text-muted">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M10 8l6 4-6 4V8z" fill="currentColor" stroke="none"/>
                        </svg>
                      </div>
                      <span className="text-[0.82rem] text-navy/70 flex-1">{lesson}</span>
                      {j === 0 ? (
                        <span className="text-[0.62rem] font-bold text-green-600
                          bg-green-50 border border-green-200 px-2 py-0.5 rounded-md shrink-0">
                          Free preview
                        </span>
                      ) : (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                          className="text-muted/50 shrink-0">
                          <rect x="3" y="11" width="18" height="11" rx="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

/* ── Enrollment Card (sticky sidebar) ── */
function EnrollCard({ course }) {
  const navigate  = useNavigate()
  const { isAdmin, isLoggedIn, owns } = useAuth()
  const isFree    = course.freeModules >= course.modules
  // owns may be undefined if store hasn't hydrated — default to false
  const enrolled  = isAdmin || (typeof owns === 'function' && owns('course', course.slug))
  const price     = isFree ? 'Free' : '₹999'
  const catId     = course.category?.id || 'courses'

  function handleEnroll() {
    if (isFree || enrolled) return
    if (!isLoggedIn) { navigate(`/login?redirect=/courses/${catId}/${course.slug}`); return }
    navigate(`/checkout?type=course&slug=${course.slug}`)
  }

  return (
    <div className="bg-white rounded-2xl border border-line overflow-hidden
      shadow-[0_8px_40px_rgba(18,18,58,0.10)]">

      {/* Video preview area */}
      <div className="relative aspect-video"
        style={{
          background: `linear-gradient(135deg, #0f0f23 0%,
            color-mix(in srgb, ${course.color} 40%, #0f0f23) 100%)`,
        }}>
        <div className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, white 0px, white 1px, transparent 1px, transparent 28px),
                             repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 28px)`,
            opacity: 0.04,
          }}/>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <NoteIcon slug={course.iconSlug} size={32} color={course.color}/>
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm
            border border-white/30 flex items-center justify-center
            hover:bg-white/30 transition-colors cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <span className="text-white/60 text-[0.72rem] font-semibold">Preview this course</span>
        </div>
      </div>

      {/* Price + CTA */}
      <div className="p-5">
        {enrolled ? (
          <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-green-50 border border-green-200">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
            <span className="text-[0.82rem] font-bold text-green-700">You have access to this course</span>
          </div>
        ) : (
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-[2rem] font-black text-navy">{price}</span>
            {!isFree && (
              <>
                <span className="text-[1rem] text-muted line-through">₹1,999</span>
                <span className="text-[0.72rem] font-bold text-red-500 bg-red-50
                  border border-red-200 px-2 py-0.5 rounded-md">50% off</span>
              </>
            )}
          </div>
        )}

        <button onClick={handleEnroll}
          className="w-full py-3.5 rounded-xl font-bold text-white text-[0.95rem]
            transition-opacity hover:opacity-90 mb-3"
          style={{ background: `linear-gradient(135deg, ${course.color}, color-mix(in srgb, ${course.color} 70%, #ec4899))` }}>
          {enrolled ? 'Continue Learning →'
            : isFree ? 'Start Free'
            : 'Buy Course — ₹999'}
        </button>

        {!isFree && !enrolled && (
          <button className="w-full py-3 rounded-xl font-bold text-navy text-[0.88rem]
            border-2 border-line hover:bg-base2 transition-colors mb-3">
            Try Free Preview
          </button>
        )}

        {!isFree && !enrolled && (
          <p className="text-center text-[0.72rem] text-muted">30-day money-back guarantee</p>
        )}

        {/* What's included */}
        <div className="mt-5 pt-5 border-t border-line">
          <p className="text-[0.78rem] font-bold text-navy mb-3">This course includes:</p>
          <div className="flex flex-col gap-2.5">
            {[
              { icon: '▶', label: `${course.duration} on-demand video` },
              { icon: '📄', label: `${course.lessons} lessons across ${course.modules} modules` },
              { icon: '📱', label: 'Access on mobile & desktop' },
              { icon: '♾️', label: 'Full 2-year access' },
              { icon: '🏆', label: 'Certificate of completion' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2.5">
                <span className="text-[0.85rem] shrink-0">{item.icon}</span>
                <span className="text-[0.78rem] text-navy/70">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Share */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-line">
          <button className="flex-1 py-2 rounded-lg text-[0.75rem] font-bold text-muted
            border border-line hover:bg-base2 transition-colors">
            Share
          </button>
          <button className="flex-1 py-2 rounded-lg text-[0.75rem] font-bold text-muted
            border border-line hover:bg-base2 transition-colors">
            Wishlist
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Course Page ── */
export default function CoursePage() {
  const { categoryId, slug } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  const course = getCourseBySlug(slug)

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20 px-10 text-muted">
          <h2 className="text-2xl font-bold mb-5">Course not found</h2>
          <button className="px-6 py-3 rounded-xl border-2 border-line text-navy
            font-bold text-sm hover:bg-base2 transition-colors"
            onClick={() => navigate('/courses')}>
            ← Back to Courses
          </button>
        </div>
        <Footer />
      </>
    )
  }

  const tabs = ['overview', 'curriculum', 'instructor', 'reviews']

  return (
    <>
      <Navbar />

      {/* ── Dark hero header ── */}
      <div className="relative overflow-hidden bg-[#0f0f23]">
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 50% 100% at 80% 50%, color-mix(in srgb, ${course.color} 15%, transparent) 0%, transparent 60%)` }}/>

        <div className="relative max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16 py-10 lg:py-14">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[0.77rem] mb-6 flex-wrap">
            <button className="text-white/40 hover:text-white/70 transition-colors font-semibold"
              onClick={() => navigate('/courses')}>Courses</button>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              className="text-white/25">
              <path d="M9 18l6-6-6-6"/>
            </svg>
            {course.category && (
              <>
                <button className="text-white/40 hover:text-white/70 transition-colors font-semibold"
                  onClick={() => navigate(`/courses/${course.category.id}`)}>
                  {course.category.name}
                </button>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                  className="text-white/25">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </>
            )}
            <span className="text-white/60 font-semibold truncate">{course.name}</span>
          </div>

          {/* Two-column on lg: info left, enrollment card right */}
          <div className="flex gap-8 items-start">
            {/* ── Left: course info ── */}
            <motion.div className="flex-1 min-w-0"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}>

              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <span className="text-[0.62rem] font-bold px-2.5 py-1 rounded-lg
                  bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Bestseller
                </span>
                <span className="text-[0.62rem] font-bold px-2.5 py-1 rounded-lg
                  border border-white/15 text-white/50">
                  {course.level}
                </span>
                {course.soon && (
                  <span className="text-[0.62rem] font-bold px-2.5 py-1 rounded-lg
                    bg-white/10 text-white/50">
                    Coming Soon
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-[2rem] font-black text-white
                leading-tight mb-3">
                {course.name}
              </h1>
              <p className="text-[0.95rem] text-white/55 leading-relaxed mb-5 max-w-[580px]">
                {course.tagline}
              </p>

              {/* Rating + meta */}
              <div className="flex items-center gap-4 flex-wrap text-[0.78rem]">
                <Stars rating={course.rating}/>
                <div className="flex items-center gap-1.5 text-white/40">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  {course.duration} total
                </div>
                <div className="flex items-center gap-1.5 text-white/40">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M10 8l6 4-6 4V8z" fill="currentColor" stroke="none"/>
                  </svg>
                  {course.lessons} lessons
                </div>
                <div className="flex items-center gap-1.5 text-white/40">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  {course.instructor}
                </div>
              </div>
            </motion.div>

            {/* ── Right: enrollment card (desktop only in hero) ── */}
            <motion.div className="hidden lg:block w-[350px] shrink-0"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}>
              <EnrollCard course={course}/>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Mobile enrollment card ── */}
      <div className="lg:hidden bg-base border-b border-line">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 py-5">
          <EnrollCard course={course}/>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="bg-white border-b border-line sticky top-[68px] z-10">
        <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-center gap-0 overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab}
                className={`px-5 py-4 text-[0.82rem] font-bold capitalize whitespace-nowrap
                  border-b-2 transition-colors ${activeTab === tab
                    ? 'border-navy text-navy'
                    : 'border-transparent text-muted hover:text-navy'}`}
                onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="py-10 lg:py-14 bg-base">
        <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex gap-10 items-start">

            {/* ── Left: tab content ── */}
            <div className="flex-1 min-w-0">

              <AnimatePresence mode="wait">
                <motion.div key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}>

                  {/* ── OVERVIEW TAB ── */}
                  {activeTab === 'overview' && (
                    <div className="flex flex-col gap-8">

                      {/* What you'll learn */}
                      <div className="bg-white rounded-2xl border border-line p-6 sm:p-8">
                        <h2 className="text-[1.15rem] font-black text-navy mb-5">
                          What you'll learn
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {course.highlights.map(h => (
                            <div key={h} className="flex items-start gap-2.5">
                              <Check color={course.color}/>
                              <span className="text-[0.85rem] text-navy/80 leading-relaxed">
                                {h}
                              </span>
                            </div>
                          ))}
                          {/* Extra learnings from module titles */}
                          {course.moduleTitles.slice(0, 4).map(t => (
                            <div key={t} className="flex items-start gap-2.5">
                              <Check color={course.color}/>
                              <span className="text-[0.85rem] text-navy/80 leading-relaxed">
                                {t}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Requirements */}
                      <div className="bg-white rounded-2xl border border-line p-6 sm:p-8">
                        <h2 className="text-[1.15rem] font-black text-navy mb-4">Requirements</h2>
                        <ul className="flex flex-col gap-2.5">
                          {[
                            `Basic understanding of ${course.category?.name || 'programming'}`,
                            'A computer with internet connection',
                            course.level === 'Beginner' ? 'No prior experience needed' : `${course.level === 'Intermediate' ? '6+ months' : '1+ year'} of hands-on experience recommended`,
                          ].map(req => (
                            <li key={req} className="flex items-start gap-2.5 text-[0.85rem] text-navy/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-navy/40 shrink-0 mt-2"/>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* About */}
                      <div className="bg-white rounded-2xl border border-line p-6 sm:p-8">
                        <h2 className="text-[1.15rem] font-black text-navy mb-4">
                          About this course
                        </h2>
                        <p className="text-[0.88rem] text-navy/70 leading-[1.85]">
                          {course.tagline}. This course takes you from the fundamentals
                          all the way to production-grade implementations. Every concept is
                          backed by real-world examples drawn from actual engineering work —
                          not textbook theory.
                        </p>
                        <p className="text-[0.88rem] text-navy/70 leading-[1.85] mt-3">
                          By the end, you'll have the confidence to apply these skills at work
                          and in interviews. The course includes hands-on exercises, code walkthroughs,
                          and a final project you can add to your portfolio.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ── CURRICULUM TAB ── */}
                  {activeTab === 'curriculum' && (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-[1.15rem] font-black text-navy">Course Curriculum</h2>
                        <span className="text-[0.78rem] text-muted">
                          {course.modules} modules · {course.lessons} lessons · {course.duration}
                        </span>
                      </div>
                      <CurriculumAccordion modules={course.moduleTitles} course={course}/>
                    </div>
                  )}

                  {/* ── INSTRUCTOR TAB ── */}
                  {activeTab === 'instructor' && (
                    <div className="bg-white rounded-2xl border border-line p-6 sm:p-8">
                      <h2 className="text-[1.15rem] font-black text-navy mb-6">Your Instructor</h2>
                      <div className="flex items-start gap-5">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center
                          text-[2rem] font-black text-white shrink-0"
                          style={{ background: `linear-gradient(135deg, ${course.color}, color-mix(in srgb, ${course.color} 60%, #ec4899))` }}>
                          {course.instructor.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[1.1rem] font-extrabold text-navy mb-0.5">
                            {course.instructor}
                          </h3>
                          <p className="text-[0.8rem] text-accent font-semibold mb-3">
                            Senior Data Engineer · {course.category?.name}
                          </p>
                          <div className="flex items-center gap-4 flex-wrap mb-4">
                            <Stars rating={4.9}/>
                            <span className="text-[0.75rem] text-muted">
                              {course.lessons * 12}+ students
                            </span>
                            <span className="text-[0.75rem] text-muted">
                              {course.modules} modules
                            </span>
                          </div>
                          <p className="text-[0.85rem] text-navy/70 leading-[1.8]">
                            Production engineer with years of experience building large-scale
                            data systems at top tech companies. Passionate about teaching
                            real-world engineering concepts that actually matter in practice.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── REVIEWS TAB ── */}
                  {activeTab === 'reviews' && (
                    <div className="flex flex-col gap-5">
                      <h2 className="text-[1.15rem] font-black text-navy">Student Reviews</h2>

                      {/* Rating summary */}
                      <div className="bg-white rounded-2xl border border-line p-6 sm:p-8
                        flex items-center gap-8 flex-wrap">
                        <div className="text-center shrink-0">
                          <div className="text-[4rem] font-black text-navy leading-none">
                            {course.rating}
                          </div>
                          <div className="flex justify-center mt-2">
                            {[1,2,3,4,5].map(s => (
                              <svg key={s} width="16" height="16" viewBox="0 0 24 24"
                                fill={s <= Math.round(course.rating) ? '#F59E0B' : '#E5E7EB'}
                                stroke="none">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                            ))}
                          </div>
                          <p className="text-[0.72rem] text-muted mt-1">Course Rating</p>
                        </div>
                        <div className="flex-1 min-w-[200px] flex flex-col gap-1.5">
                          {[5, 4, 3, 2, 1].map(star => {
                            const pct = star === 5 ? 72 : star === 4 ? 20 : star === 3 ? 6 : star === 2 ? 1 : 1
                            return (
                              <div key={star} className="flex items-center gap-2">
                                <div className="h-2 flex-1 rounded-full bg-base2 overflow-hidden">
                                  <div className="h-full rounded-full bg-amber-400"
                                    style={{ width: `${pct}%` }}/>
                                </div>
                                <div className="flex shrink-0">
                                  {[1,2,3,4,5].map(s => (
                                    <svg key={s} width="10" height="10" viewBox="0 0 24 24"
                                      fill={s <= star ? '#F59E0B' : '#E5E7EB'} stroke="none">
                                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-[0.7rem] text-muted w-7 shrink-0">{pct}%</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Sample reviews */}
                      {[
                        { name: 'Priya S.', rating: 5, text: 'Absolutely the best course on this topic. The production examples are invaluable.', time: '2 weeks ago' },
                        { name: 'Arjun M.', rating: 5, text: 'Crystal clear explanations. I\'ve tried other courses and this is by far the most practical.', time: '1 month ago' },
                        { name: 'Sneha R.', rating: 4, text: 'Great content overall. Would love even more hands-on exercises but very solid.', time: '1 month ago' },
                      ].map((review, i) => (
                        <motion.div key={i}
                          className="bg-white rounded-2xl border border-line p-5 sm:p-6"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center
                              text-[0.8rem] font-black text-white shrink-0"
                              style={{ background: course.color }}>
                              {review.name[0]}
                            </div>
                            <div>
                              <div className="text-[0.85rem] font-bold text-navy">{review.name}</div>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[1,2,3,4,5].map(s => (
                                    <svg key={s} width="10" height="10" viewBox="0 0 24 24"
                                      fill={s <= review.rating ? '#F59E0B' : '#E5E7EB'} stroke="none">
                                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-[0.68rem] text-muted">{review.time}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-[0.85rem] text-navy/70 leading-relaxed">{review.text}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Right: sticky enrollment card (desktop) ── */}
            <div className="hidden lg:block w-[350px] shrink-0 sticky top-[120px]">
              <EnrollCard course={course}/>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
