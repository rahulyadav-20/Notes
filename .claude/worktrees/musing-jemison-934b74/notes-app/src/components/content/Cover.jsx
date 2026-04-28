import { motion } from 'framer-motion'

export default function Cover({ title, subtitle, tagline, stats = [], iconLetter, gradStart, gradEnd, edition }) {
  const gs = gradStart || '#4A90D9'
  const ge = gradEnd || '#5DB85B'

  return (
    <div className="cover">
      {/* Animated floating orbs */}
      <motion.div
        className="orb orb-1"
        animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.28, 0.18] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="orb orb-2"
        animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="orb orb-3"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Logo SVG */}
      <motion.div
        className="cover-logo"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'backOut' }}
      >
        <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cvg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gs} />
              <stop offset="100%" stopColor={ge} />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="54" fill="url(#cvg)" opacity="0.2" />
          <circle cx="60" cy="60" r="42" fill="url(#cvg)" opacity="0.35" />
          <circle cx="60" cy="60" r="30" fill="url(#cvg)" />
          <text x="60" y="74" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="800"
            fontFamily="Segoe UI, sans-serif">
            {iconLetter || '?'}
          </text>
        </svg>
      </motion.div>

      <motion.div
        className="cover-badge"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Production Engineering Reference
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
      >
        {title}
      </motion.h1>

      {subtitle && (
        <motion.div
          className="cover-sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {subtitle}
        </motion.div>
      )}

      {tagline && (
        <motion.div
          className="cover-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.5 }}
        >
          {tagline}
        </motion.div>
      )}

      {stats.length > 0 && (
        <motion.div
          className="cover-meta"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {stats.map((s, i) => (
            <div className="cover-meta-item" key={i}>
              <div className="num">{s.num}</div>
              <div className="lbl">{s.label}</div>
            </div>
          ))}
        </motion.div>
      )}

      {edition && (
        <motion.div
          className="cover-edition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          {edition}
        </motion.div>
      )}
    </div>
  )
}
