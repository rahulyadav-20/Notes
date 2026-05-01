import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar    from '../../components/layout/Navbar'
import { useAuth } from '../../hooks/useAuth'
import { NOTES_DATA } from '../../data/categories'
import { COURSES_DATA } from '../../data/courses'

/* ── Static maps (same as Checkout) ── */
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

/* Build display info + nav path from type + slug */
function resolveItem(type, slug) {
  if (type === 'note') {
    const m = NOTES_DATA[slug] ?? {}
    return {
      name:  m.name  ?? slug,
      icon:  m.icon  ?? '📚',
      color: m.color ?? '#4A90D9',
      label: 'Note',
      path:  `/notes/${NOTE_CATEGORY[slug] ?? 'data-engineer'}/${slug}`,
      btnLabel: 'Read note →',
    }
  }
  if (type === 'interview') {
    const m = TOPIC_META[slug] ?? {}
    return {
      name:  m.title ?? slug,
      icon:  m.icon  ?? '🎯',
      color: m.color ?? '#6366F1',
      label: 'Interview Pack',
      path:  `/interview/${slug}`,
      btnLabel: 'Practice questions →',
    }
  }
  // course
  const m = COURSES_DATA[slug] ?? {}
  return {
    name:  m.name  ?? slug,
    icon:  '🎓',
    color: m.color ?? '#f5820a',
    label: 'Video Course',
    path:  '/courses',
    btnLabel: 'Go to courses →',
  }
}

/* ── Confetti ── */
function Confetti() {
  const dots = Array.from({ length: 28 }, (_, i) => ({
    id:    i,
    x:     (Math.random() - 0.5) * 640,
    y:     -(Math.random() * 420 + 80),
    color: ['#f5820a','#6366F1','#10B981','#EC4899','#F59E0B','#4A90D9'][i % 6],
    size:  Math.random() * 9 + 4,
    delay: Math.random() * 0.6,
  }))
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map(d => (
        <motion.div key={d.id} className="absolute rounded-full"
          style={{ width: d.size, height: d.size, background: d.color, left: '50%', top: '30%' }}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
          animate={{ opacity: 0, x: d.x, y: d.y, scale: 1, rotate: 360 }}
          transition={{ duration: 1.5, delay: d.delay, ease: 'easeOut' }}/>
      ))}
    </div>
  )
}

export default function PaymentSuccess() {
  const navigate    = useNavigate()
  const [params]    = useSearchParams()
  const type        = params.get('type') || 'note'
  const slug        = params.get('slug') || ''
  const { user }    = useAuth()

  const item = resolveItem(type, slug)

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-68px)] bg-base flex items-center justify-center px-4 py-12 relative overflow-hidden">

        <Confetti />

        <motion.div className="w-full max-w-[480px] text-center"
          initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}>

          {/* Success checkmark */}
          <motion.div
            className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 220 }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
              stroke="#10B981" strokeWidth="2.5" strokeLinecap="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </motion.div>

          {/* Heading */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}>
            <p className="text-[0.7rem] font-bold uppercase tracking-[3px] text-accent mb-2">
              Payment Successful
            </p>
            <h1 className="text-[2rem] sm:text-[2.3rem] font-black text-navy tracking-tight mb-2">
              You're all set{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 🎉
            </h1>
            <p className="text-[0.88rem] text-muted mb-7">
              Full access for <strong className="text-navy">2 years</strong> from today.
            </p>
          </motion.div>

          {/* Purchased item card */}
          <motion.div
            className="bg-white rounded-2xl border-2 p-6 mb-7 text-left"
            style={{ borderColor: `color-mix(in srgb, ${item.color} 35%, var(--color-line))` }}
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48 }}>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: `color-mix(in srgb, ${item.color} 14%, var(--color-tint))` }}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.7rem] font-bold uppercase tracking-[1.5px] text-muted mb-0.5">
                  {item.label}
                </p>
                <p className="text-[1rem] font-extrabold text-navy leading-snug truncate">
                  {item.name}
                </p>
              </div>
              <span className="text-[0.62rem] font-bold px-2.5 py-1 rounded-full shrink-0
                bg-green-50 text-green-700 border border-green-200">
                ✓ Unlocked
              </span>
            </div>

            <div className="flex items-center gap-2 text-[0.72rem] text-muted border-t border-line pt-3">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              Valid for 2 years from today · 7-day refund guarantee
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div className="flex gap-3 justify-center flex-wrap"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.62 }}>
            <button
              onClick={() => navigate(item.path)}
              className="px-6 py-3 rounded-xl font-bold text-[0.9rem] text-white
                hover:opacity-90 transition-opacity
                shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
              style={{ background: `linear-gradient(135deg, ${item.color}, color-mix(in srgb, ${item.color} 70%, #f5820a))` }}>
              {item.btnLabel}
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-xl font-bold text-[0.9rem] text-navy
                border border-line hover:bg-base2 transition-colors">
              My dashboard
            </button>
          </motion.div>

        </motion.div>
      </div>
    </>
  )
}
