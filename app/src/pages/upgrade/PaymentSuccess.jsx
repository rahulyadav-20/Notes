import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../../components/layout/Navbar'
import { useAuth } from '../../hooks/useAuth'

const TYPE_LABELS = { note: 'Note', interview: 'Interview Pack', course: 'Course' }

const UNLOCKED = [
  { icon: '📚', label: 'Deep-dive notes',         path: '/notes',     color: '#4A90D9' },
  { icon: '🎯', label: 'All interview questions',  path: '/interview', color: '#6366F1' },
  { icon: '🎓', label: 'Full video courses',       path: '/courses',   color: '#f5820a' },
  { icon: '📖', label: 'Blog & community',         path: '/blog',      color: '#10B981' },
]

/* ── Confetti dot ── */
function Confetti() {
  const dots = Array.from({ length: 24 }, (_, i) => ({
    id:    i,
    x:     (Math.random() - 0.5) * 600,
    y:     -(Math.random() * 400 + 100),
    color: ['#f5820a','#6366F1','#10B981','#EC4899','#F59E0B'][i % 5],
    size:  Math.random() * 8 + 4,
    delay: Math.random() * 0.5,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map(d => (
        <motion.div key={d.id}
          className="absolute rounded-full"
          style={{
            width:  d.size, height: d.size,
            background: d.color,
            left: '50%', top: '30%',
          }}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
          animate={{ opacity: 0, x: d.x, y: d.y, scale: 1, rotate: 360 }}
          transition={{ duration: 1.4, delay: d.delay, ease: 'easeOut' }}/>
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

  const typeLabel   = TYPE_LABELS[type] || 'Item'

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-68px)] bg-base flex items-center justify-center px-4 py-12 relative overflow-hidden">

        <Confetti />

        <motion.div className="w-full max-w-[520px] text-center"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}>

          {/* Success icon */}
          <motion.div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
              stroke="#10B981" strokeWidth="2.5" strokeLinecap="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <p className="text-[0.72rem] font-bold uppercase tracking-[3px] text-accent mb-2">
              Payment Successful
            </p>
            <h1 className="text-[2rem] sm:text-[2.4rem] font-black text-navy tracking-tight mb-3">
              Welcome to Premium! 🎉
            </h1>
            <p className="text-[0.92rem] text-muted leading-relaxed mb-6">
              Your <strong className="text-navy">{typeLabel}</strong> is now unlocked,{' '}
              <strong className="text-navy">{user?.name || 'friend'}</strong>.
              You have full access for <strong className="text-navy">2 years</strong>.
            </p>
          </motion.div>

          {/* Unlocked items */}
          <motion.div className="grid grid-cols-2 gap-3 mb-8"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            {UNLOCKED.map(u => (
              <button key={u.path} onClick={() => navigate(u.path)}
                className="flex items-center gap-3 p-4 rounded-xl bg-white border border-line
                  hover:border-[var(--color-line-hover)] hover:shadow-sm transition-all text-left group">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                  style={{ background: `color-mix(in srgb, ${u.color} 12%, var(--color-tint))` }}>
                  {u.icon}
                </div>
                <span className="text-[0.8rem] font-bold text-navy group-hover:text-accent transition-colors">
                  {u.label}
                </span>
              </button>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div className="flex gap-3 justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
            <button onClick={() => navigate('/notes')}
              className="px-6 py-3 rounded-xl font-bold text-[0.9rem] text-white
                bg-gradient-to-br from-accent to-accent2
                shadow-[0_4px_16px_rgba(245,130,10,0.3)]
                hover:opacity-90 transition-opacity">
              Start learning →
            </button>
            <button onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-xl font-bold text-[0.9rem] text-navy
                border border-line hover:bg-base2 transition-colors">
              Go to dashboard
            </button>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}
