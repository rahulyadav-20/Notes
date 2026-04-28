import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { getCourseCategoryWithCourses } from '../../data/courses'
import { NoteIcon } from '../../data/icons'

/* ── Star Rating ── */
function Stars({ rating, count = null }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[0.8rem] font-bold text-amber-500">{rating}</span>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
          <svg key={s} width="11" height="11" viewBox="0 0 24 24"
            fill={s <= Math.round(rating) ? '#F59E0B' : '#D1D5DB'} stroke="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
      </div>
      {count !== null && (
        <span className="text-[0.7rem] text-muted">({count.toLocaleString()})</span>
      )}
    </div>
  )
}

/* ── Course thumbnail (mini) ── */
function MiniThumbnail({ course }) {
  return (
    <div className="relative w-[200px] sm:w-[240px] shrink-0 aspect-video rounded-xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #0f0f23 0%,
          color-mix(in srgb, ${course.color} 40%, #0f0f23) 100%)`,
      }}>
      <div className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, white 0px, white 1px, transparent 1px, transparent 28px),
                           repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 28px)`,
          opacity: 0.05,
        }}/>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <NoteIcon slug={course.iconSlug} size={26} color={course.color}/>
        <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30
          flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
      {course.soon && (
        <div className="absolute top-2 left-2 bg-black/60 text-white/70
          text-[0.55rem] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
          Soon
        </div>
      )}
    </div>
  )
}

/* ── Course Row Card (list view) ── */
function CourseRowCard({ course, categoryId, index }) {
  const navigate = useNavigate()
  return (
    <motion.div
      className={`flex items-start gap-5 bg-white border border-line rounded-2xl
        p-4 sm:p-5 overflow-hidden
        ${course.soon
          ? 'opacity-60'
          : 'cursor-pointer hover:border-[#c5cae5] hover:shadow-[0_8px_28px_rgba(18,18,58,0.08)] transition-all'}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.25) }}
      onClick={() => !course.soon && navigate(`/courses/${categoryId}/${course.slug}`)}>

      {/* Thumbnail — hidden on very small screens */}
      <div className="hidden sm:block">
        <MiniThumbnail course={course}/>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <span className="text-[0.62rem] font-bold px-2 py-0.5 rounded-md border"
            style={{
              color: course.color,
              borderColor: `color-mix(in srgb, ${course.color} 30%, #e2e5f0)`,
              background: `color-mix(in srgb, ${course.color} 8%, #fff)`,
            }}>
            {course.level}
          </span>
          {!course.soon && (
            <span className="text-[0.62rem] font-bold px-2 py-0.5 rounded-md
              bg-amber-50 text-amber-600 border border-amber-200">
              Bestseller
            </span>
          )}
        </div>

        <h3 className="text-[1rem] font-extrabold text-navy leading-snug">
          {course.name}
        </h3>
        <p className="text-[0.8rem] text-muted leading-relaxed line-clamp-2">
          {course.tagline}
        </p>

        {/* Highlights */}
        <div className="flex flex-wrap gap-1.5">
          {course.highlights.slice(0, 3).map(h => (
            <span key={h} className="text-[0.62rem] font-semibold px-2 py-0.5
              rounded-md bg-base border border-line text-navy2">
              {h}
            </span>
          ))}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 flex-wrap mt-1">
          <Stars rating={course.rating}/>
          <span className="text-[0.72rem] text-muted">
            {course.lessons} lessons · {course.duration}
          </span>
          <span className="text-[0.72rem] text-muted">
            by {course.instructor}
          </span>
        </div>
      </div>

      {/* Price column */}
      <div className="hidden lg:flex flex-col items-end gap-2 shrink-0 ml-2">
        <div className="text-[1.2rem] font-black text-navy">
          {course.freeModules >= course.modules ? 'Free' : '₹999'}
        </div>
        {!(course.freeModules >= course.modules) && (
          <div className="text-[0.75rem] text-muted line-through">₹1,999</div>
        )}
        <button
          className={`mt-1 px-5 py-2 rounded-xl text-[0.8rem] font-bold text-white
            transition-opacity ${course.soon ? 'opacity-50 cursor-default' : 'hover:opacity-90'}`}
          style={{ background: course.color }}>
          {course.soon ? 'Coming Soon' : 'Enroll Now'}
        </button>
      </div>
    </motion.div>
  )
}

/* ── Course Category Page ── */
export default function CourseCategoryPage() {
  const { categoryId } = useParams()
  const navigate       = useNavigate()
  const [levelFilter, setLevelFilter] = useState('All')

  const cat = getCourseCategoryWithCourses(categoryId)

  if (!cat) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20 px-10 text-muted">
          <h2 className="text-2xl font-bold mb-5">Category not found</h2>
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

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced']

  const filtered = levelFilter === 'All'
    ? cat.courses
    : cat.courses.filter(c => c.level === levelFilter)

  const available = cat.courses.filter(c => !c.soon).length
  const avgRating  = (cat.courses.reduce((s, c) => s + c.rating, 0) / cat.courses.length).toFixed(1)
  const totalHours = cat.courses.reduce((s, c) => {
    const [h, m] = c.duration.replace('h', '').replace('m', '').split(' ').map(Number)
    return s + (h || 0) + (m || 0) / 60
  }, 0)

  return (
    <>
      <Navbar />

      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-line py-3">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12
          flex items-center gap-2 text-[0.8rem]">
          <button className="font-semibold text-muted hover:text-navy transition-colors"
            onClick={() => navigate('/courses')}>Courses</button>
          <svg className="text-[#b0b8d0]" width="12" height="12" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
          <span className="font-bold text-navy">{cat.name}</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #0f0f23 0%,
            color-mix(in srgb, ${cat.color} 25%, #0f0f23) 100%)`,
        }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, white 0px, white 1px, transparent 1px, transparent 40px),
                             repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 40px)`,
          }}/>

        <div className="relative max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-16">
          <motion.button
            className="inline-flex items-center gap-1.5 text-[0.78rem] font-bold
              text-white/50 mb-6 hover:text-white/80 transition-colors"
            onClick={() => navigate('/courses')}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -3 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            All Courses
          </motion.button>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{cat.icon}</span>
              <p className="text-[0.7rem] font-bold uppercase tracking-[2.5px] text-accent">
                {cat.name}
              </p>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-[2rem] font-black text-white
              leading-snug mb-4 max-w-[600px]">
              {cat.desc}
            </h1>

            {/* Stats row */}
            <div className="flex items-center gap-6 flex-wrap mt-6">
              {[
                { val: `${available} of ${cat.courses.length}`, label: 'Courses available' },
                { val: avgRating, label: 'Avg rating' },
                { val: `${Math.round(totalHours)}h+`, label: 'Video content' },
                { val: cat.courses.reduce((s, c) => s + c.lessons, 0) + '+', label: 'Lessons' },
              ].map(s => (
                <div key={s.label} className="flex flex-col">
                  <span className="text-[1.3rem] font-black text-white leading-none">{s.val}</span>
                  <span className="text-[0.68rem] text-white/40 font-semibold mt-0.5">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Filter + List ── */}
      <section className="py-10 lg:py-14 bg-base">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12">

          {/* Filter row */}
          <div className="flex items-center justify-between gap-4 mb-7 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[0.78rem] font-bold text-muted mr-1">Level:</span>
              {levels.map(l => (
                <button key={l}
                  className={`px-3.5 py-1.5 rounded-lg text-[0.78rem] font-bold
                    border transition-all ${levelFilter === l
                      ? 'bg-navy text-white border-navy'
                      : 'bg-white text-muted border-line hover:border-[#c5cae5]'}`}
                  onClick={() => setLevelFilter(l)}>
                  {l}
                </button>
              ))}
            </div>
            <span className="text-[0.78rem] text-muted">
              {filtered.length} course{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Course list */}
          <AnimatePresence mode="wait">
            <motion.div key={levelFilter}
              className="flex flex-col gap-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              {filtered.length > 0
                ? filtered.map((course, i) => (
                    <CourseRowCard
                      key={course.slug}
                      course={course}
                      categoryId={categoryId}
                      index={i}
                    />
                  ))
                : (
                  <div className="text-center py-16 text-muted bg-white rounded-2xl border border-line">
                    <div className="text-4xl mb-3">🎓</div>
                    <p>No {levelFilter} courses yet</p>
                  </div>
                )
              }
            </motion.div>
          </AnimatePresence>

          {/* Coming soon notice */}
          <motion.div className="mt-8 text-center py-8 px-8 bg-white border-[1.5px]
            border-dashed border-line rounded-2xl"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <p className="text-[0.88rem] text-muted">
              <span className="font-bold text-navy">More courses</span>
              {' '}being produced — new content drops monthly.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  )
}
