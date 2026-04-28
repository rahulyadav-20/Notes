import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { COURSE_CATEGORIES, COURSES_DATA } from '../../data/courses'
import { NoteIcon } from '../../data/icons'

/* ── Star Rating ── */
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[0.8rem] font-bold text-amber-500">{rating}</span>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
          <svg key={s} width="11" height="11" viewBox="0 0 24 24"
            fill={s <= Math.round(rating) ? '#F59E0B' : '#D1D5DB'}
            stroke="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
      </div>
    </div>
  )
}

/* ── Course Thumbnail ── */
function CourseThumbnail({ course }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-t-2xl"
      style={{
        background: `linear-gradient(135deg,
          #0f0f23 0%,
          color-mix(in srgb, ${course.color} 35%, #0f0f23) 100%)`,
      }}>
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, white 0px, white 1px, transparent 1px, transparent 32px),
                           repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 32px)`,
        }}/>

      {/* Icon */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: `color-mix(in srgb, ${course.color} 20%, rgba(255,255,255,0.05))` }}>
          <NoteIcon slug={course.iconSlug} size={30} color={course.color}/>
        </div>
        <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm border border-white/25
          flex items-center justify-center hover:bg-white/25 transition-colors cursor-pointer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>

      {/* Badges */}
      {course.soon ? (
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white/80
          text-[0.6rem] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide">
          Coming Soon
        </div>
      ) : (
        <div className="absolute top-3 left-3 bg-amber-500 text-white
          text-[0.6rem] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide">
          Bestseller
        </div>
      )}

      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white/80
        text-[0.6rem] font-bold px-2.5 py-1 rounded-lg">
        {course.duration}
      </div>
    </div>
  )
}

/* ── Course Card ── */
function CourseCard({ course, slug, categoryId, index }) {
  const navigate = useNavigate()
  return (
    <motion.div
      className={`bg-white border border-line rounded-2xl overflow-hidden flex flex-col
        ${course.soon ? 'opacity-70' : 'cursor-pointer group'}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.25) }}
      whileHover={course.soon ? {} : { y: -6, boxShadow: '0 24px 56px rgba(18,18,58,0.13)' }}
      onClick={() => !course.soon && navigate(`/courses/${categoryId}/${slug}`)}>

      <CourseThumbnail course={course}/>

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Level badge */}
        <div className="flex items-center gap-2">
          <span className="text-[0.62rem] font-bold px-2 py-0.5 rounded-md border"
            style={{
              color: course.color,
              borderColor: `color-mix(in srgb, ${course.color} 30%, #e2e5f0)`,
              background: `color-mix(in srgb, ${course.color} 8%, #fff)`,
            }}>
            {course.level}
          </span>
          <span className="text-[0.62rem] font-semibold text-muted">
            {course.lessons} lessons
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[0.95rem] font-extrabold text-navy leading-snug
          group-hover:text-accent transition-colors line-clamp-2">
          {course.name}
        </h3>

        {/* Tagline */}
        <p className="text-[0.77rem] text-muted leading-relaxed line-clamp-2 flex-1">
          {course.tagline}
        </p>

        {/* Instructor */}
        <div className="flex items-center gap-2 text-[0.72rem] text-muted">
          <div className="w-5 h-5 rounded-full bg-base2 border border-line flex items-center
            justify-center text-[0.6rem] font-bold text-navy">
            {course.instructor[0]}
          </div>
          {course.instructor}
        </div>

        {/* Rating */}
        <Stars rating={course.rating}/>
      </div>

      {/* Footer — price */}
      <div className="px-4 py-3 border-t border-line flex items-center justify-between
        bg-base/40">
        <span className="text-[1.05rem] font-black text-navy">
          {course.freeModules >= course.modules ? 'Free' : '₹999'}
        </span>
        <span className="text-[0.68rem] text-muted line-through">₹1,999</span>
        <div className="flex items-center gap-1 text-[0.75rem] font-bold"
          style={{ color: course.color }}>
          {course.soon ? 'Coming Soon' : 'Enroll Now'}
          {!course.soon && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ── Courses Page ── */
export default function Courses() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredEntries = Object.entries(COURSES_DATA).filter(([, c]) =>
    activeCategory === 'all' || COURSE_CATEGORIES.find(
      cat => cat.id === activeCategory && cat.courses.includes(
        Object.entries(COURSES_DATA).find(([, v]) => v === c)?.[0] ?? ''
      )
    )
  )

  // Build flat list per category for filtered view
  const coursesToShow = activeCategory === 'all'
    ? Object.entries(COURSES_DATA)
    : COURSE_CATEGORIES
        .find(c => c.id === activeCategory)
        ?.courses.map(slug => [slug, COURSES_DATA[slug]]).filter(Boolean) ?? []

  const totalCourses   = Object.keys(COURSES_DATA).length
  const availableCount = Object.values(COURSES_DATA).filter(c => !c.soon).length

  // Get categoryId for a slug
  const getCatId = (slug) =>
    COURSE_CATEGORIES.find(cat => cat.courses.includes(slug))?.id ?? 'all'

  return (
    <>
      <Navbar />

      {/* ── Dark hero ── */}
      <div className="relative overflow-hidden bg-[#0f0f23]">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #f5820a 0%, transparent 70%)' }}/>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #4A90D9 0%, transparent 70%)' }}/>
        </div>

        <div className="relative max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <p className="text-[0.7rem] font-bold uppercase tracking-[3px] text-accent mb-3">
              Video Courses
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-[3rem] font-black text-white
              leading-tight mb-4 max-w-[720px]">
              Learn from Engineers<br/>
              <span className="text-accent">Who've Done It in Production</span>
            </h1>
            <p className="text-[0.95rem] text-white/50 max-w-[480px] leading-relaxed mb-8">
              In-depth video courses on data engineering, ML, AI & system design —
              taught with real-world code, not toy examples.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 flex-wrap">
              {[
                { num: `${totalCourses}`, label: 'Courses' },
                { num: `${availableCount}`, label: 'Available now' },
                { num: '6', label: 'Domains' },
                { num: 'Free', label: 'To start' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="text-[1.4rem] font-black text-accent">{s.num}</span>
                  <span className="text-[0.78rem] text-white/40 font-semibold">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Category filter tabs ── */}
      <div className="bg-white border-b border-line sticky top-[68px] z-10">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            <button
              className={`shrink-0 px-4 py-1.5 rounded-lg text-[0.8rem] font-bold
                transition-all border ${activeCategory === 'all'
                  ? 'bg-navy text-white border-navy'
                  : 'text-muted border-transparent hover:bg-base2 hover:border-line'}`}
              onClick={() => setActiveCategory('all')}>
              All Courses
            </button>
            {COURSE_CATEGORIES.map(cat => (
              <button key={cat.id}
                className={`shrink-0 flex items-center gap-2 px-4 py-1.5 rounded-lg
                  text-[0.8rem] font-bold transition-all border ${
                  activeCategory === cat.id
                    ? 'text-white border-transparent'
                    : 'text-muted border-transparent hover:bg-base2 hover:border-line'
                }`}
                style={activeCategory === cat.id ? { background: cat.color, borderColor: cat.color } : {}}
                onClick={() => setActiveCategory(cat.id)}>
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Courses grid ── */}
      <section className="py-10 lg:py-14 bg-base">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12">

          <div className="flex items-center justify-between mb-6">
            <p className="text-[0.84rem] text-muted">
              <span className="font-bold text-navy">{coursesToShow.length}</span> courses
              {activeCategory !== 'all' && (
                <> in <span className="font-bold text-navy">
                  {COURSE_CATEGORIES.find(c => c.id === activeCategory)?.name}
                </span></>
              )}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeCategory}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              {coursesToShow.map(([slug, course], i) => (
                <CourseCard
                  key={slug}
                  course={course}
                  slug={slug}
                  categoryId={getCatId(slug)}
                  index={i}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-12 bg-white border-t border-line">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            className="bg-[#0f0f23] rounded-2xl px-6 sm:px-12 py-12 text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(245,130,10,0.12) 0%, transparent 70%)' }}/>
            <div className="relative">
              <p className="text-[0.7rem] font-bold uppercase tracking-[2.5px] text-accent mb-4">
                Notify me
              </p>
              <h2 className="text-[1.5rem] sm:text-[2rem] font-black text-white mb-3">
                New courses dropping monthly
              </h2>
              <p className="text-[0.88rem] text-white/40 max-w-[380px] mx-auto mb-6 leading-relaxed">
                Drop your email and we'll notify you the moment a new course goes live.
              </p>
              <div className="flex items-center gap-3 max-w-[400px] mx-auto">
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/8 border border-white/15
                    text-white placeholder:text-white/30 text-[0.88rem] outline-none
                    focus:border-accent/50 transition-colors"/>
                <button className="px-5 py-3 rounded-xl font-bold text-[0.88rem] text-white
                  bg-gradient-to-br from-accent to-accent2 shrink-0
                  shadow-[0_4px_16px_rgba(245,130,10,0.35)] hover:opacity-90 transition-opacity">
                  Notify Me
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  )
}
