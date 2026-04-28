import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollProgress } from '../../hooks/useScrollProgress'

export default function Sidebar({ parts, brand, title, iconLetter, gradStart, gradEnd, open, onClose }) {
  const { progress, activeId } = useScrollProgress()
  const sidebarRef = useRef(null)

  // Auto-scroll sidebar to keep active link in view
  useEffect(() => {
    const sb = sidebarRef.current
    if (!sb) return
    const active = sb.querySelector('a.active')
    if (!active) return
    const linkTop = active.offsetTop
    const linkBot = linkTop + active.offsetHeight
    const visTop = sb.scrollTop + 90
    const visBot = sb.scrollTop + sb.clientHeight - 50
    if (linkTop < visTop) sb.scrollTop = linkTop - 90
    else if (linkBot > visBot) sb.scrollTop = linkBot - sb.clientHeight + 50
  }, [activeId])

  const gs = gradStart || '#4A90D9'
  const ge = gradEnd || '#5DB85B'

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="sidebar-overlay visible"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        id="sidebar"
        ref={sidebarRef}
        initial={false}
        animate={{ x: 0 }}
        style={{ x: 0 }}
        className={open ? 'open' : ''}
      >
        {/* Progress bar */}
        <div id="sb-progress">
          <motion.div
            id="sb-progress-bar"
            style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${gs}, ${ge})` }}
          />
        </div>

        {/* Header */}
        <div className="sb-head">
          <div className="sb-head-row">
            <svg className="sb-head-icon" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="sbg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={gs} />
                  <stop offset="100%" stopColor={ge} />
                </linearGradient>
              </defs>
              <circle cx="14" cy="14" r="12" fill="url(#sbg)" />
              <text x="14" y="19" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">
                {iconLetter || '?'}
              </text>
            </svg>
            <div>
              <div className="sb-brand">{brand}</div>
              <div className="sb-title">{title || 'Deep-Dive Guide'}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav>
          {parts.map((part, pi) => (
            <div key={pi}>
              <div className="sb-part-label">{part.label}</div>
              {part.sections.map((sec, si) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className={activeId === sec.id ? 'active' : ''}
                  onClick={onClose}
                >
                  <span className="sn">{String(sec.num).padStart(2, '0')}</span>
                  {sec.title}
                </a>
              ))}
            </div>
          ))}
        </nav>
      </motion.aside>
    </>
  )
}
