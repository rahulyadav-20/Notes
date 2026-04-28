import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { INTERVIEW_CATEGORIES } from '../../data/interview'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

/* ── Shared animation variant ─────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

/* ── Difficulty dot colors ────────────────────────────── */
const DOT_COLOR = {
  Easy:   'bg-emerald-500',
  Medium: 'bg-yellow-400',
  Hard:   'bg-red-500',
}

/* ── Stats strip data ─────────────────────────────────── */
const STRIP_STATS = [
  { num: '470+',  label: 'Questions' },
  { num: '6',     label: 'Categories' },
  { num: '100%',  label: 'Full Answers' },
  { num: 'Free',  label: 'To Start' },
]

/* ──────────────────────────────────────────────────────── */
/*  InterviewCategoryCard                                   */
/* ──────────────────────────────────────────────────────── */
function InterviewCategoryCard({ cat, index }) {
  const totalEasy   = cat.difficulties?.Easy   ?? 0
  const totalMedium = cat.difficulties?.Medium ?? 0
  const totalHard   = cat.difficulties?.Hard   ?? 0

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      /* stagger: each card delays 100ms more than the previous */
      transition={{ duration: 0.45, delay: index * 0.1 }}
      className="cat-accent group relative bg-white rounded-2xl border border-line shadow-sm
                 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
      style={{ '--cc': cat.color }}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: cat.color }} />

      <div className="p-6 flex flex-col flex-1 gap-4">
        {/* Icon + free badge row */}
        <div className="flex items-start justify-between gap-3">
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}30` }}
          >
            {cat.icon}
          </div>

          {/* Free badge */}
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
            style={{
              background: `${cat.color}15`,
              color:       cat.color,
              border:      `1px solid ${cat.color}30`,
            }}
          >
            {cat.freeQuestions} free
          </span>
        </div>

        {/* Title */}
        <h3 className="text-navy font-bold text-lg leading-snug group-hover:text-[color:var(--cc)] transition-colors">
          {cat.name}
        </h3>

        {/* Description */}
        <p className="text-muted text-sm leading-relaxed line-clamp-3 flex-1">
          {cat.desc}
        </p>

        {/* Stats chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Total questions chip */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bg-base2 text-navy text-xs font-medium">
            <svg className="w-3.5 h-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            {cat.totalQuestions} questions
          </span>

          {/* Difficulty dots */}
          {[['Easy', totalEasy], ['Medium', totalMedium], ['Hard', totalHard]].map(([label, count]) => (
            <span key={label} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bg-base text-xs font-medium text-navy">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${DOT_COLOR[label]}`} />
              {count}
            </span>
          ))}
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-2 border-t border-line text-sm">
          <span className="text-muted">
            <span className="font-semibold" style={{ color: cat.color }}>{cat.freeQuestions} free</span>
            &nbsp;·&nbsp;{cat.totalQuestions} total
          </span>

          <Link
            to={`/interview/${cat.id}`}
            className="inline-flex items-center gap-1 font-semibold transition-colors hover:gap-2"
            style={{ color: cat.color }}
          >
            Practice
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

/* ──────────────────────────────────────────────────────── */
/*  Interview (landing page)                               */
/* ──────────────────────────────────────────────────────── */
export default function Interview() {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ── Page header ─────────────────────────────── */}
        <section className="bg-[#0a0e27] text-white pt-16 pb-14 relative overflow-hidden">
          {/* Background orb */}
          <div
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #f5820a, transparent 70%)', transform: 'translate(25%, -25%)' }}
          />

          <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="max-w-2xl"
            >
              {/* Eyebrow */}
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 text-white/70 text-xs font-semibold uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Interview Prep
              </span>

              <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
                Crack Your Next{' '}
                <span
                  className="bg-gradient-to-r from-[#f5820a] to-[#facc15] bg-clip-text"
                  style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  Tech Interview
                </span>
              </h1>

              <p className="text-white/60 text-lg leading-relaxed">
                Real questions asked at Google, Amazon, Meta &amp; top startups — with full answers.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Stats strip ─────────────────────────────── */}
        <section className="bg-white border-b border-line">
          <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-line">
              {STRIP_STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="flex flex-col items-center py-6 px-4 text-center"
                >
                  <span className="text-2xl sm:text-3xl font-black text-navy">{s.num}</span>
                  <span className="text-xs text-muted uppercase tracking-widest mt-0.5">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Category grid ───────────────────────────── */}
        <section className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12 py-14">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl font-black text-navy mb-1">Choose a Category</h2>
            <p className="text-muted text-sm">
              {INTERVIEW_CATEGORIES.length} categories · updated regularly with new questions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {INTERVIEW_CATEGORIES.map((cat, i) => (
              <InterviewCategoryCard key={cat.id} cat={cat} index={i} />
            ))}
          </div>
        </section>

        {/* ── CTA banner ──────────────────────────────── */}
        <section className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12 pb-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl bg-[#0a0e27] text-white p-10 sm:p-14 text-center relative overflow-hidden"
          >
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 30% 50%, #f5820a, transparent 60%)' }}
            />
            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black mb-3">
                Unlock All{' '}
                <span
                  className="bg-gradient-to-r from-[#f5820a] to-[#facc15] bg-clip-text"
                  style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  470+ Questions
                </span>
              </h2>
              <p className="text-white/60 text-sm mb-7">
                Premium gives you full answers, code solutions, and company-specific question sets.
              </p>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-accent hover:bg-[#e07409] text-white font-bold text-sm transition-colors"
              >
                Get Premium Access
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
