import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'

export default function PageLayout({ sidebar, color, children }) {
  const [open, setOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const sectionCounter = useRef(0)

  // Assign IDs to h2.st headings after mount
  useEffect(() => {
    const headings = document.querySelectorAll('h2.st')
    headings.forEach((h, i) => { h.id = `s${i + 1}` })
  }, [])

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Apply topic color to CSS vars
  const colorStyle = color
    ? { '--d': color, '--ac': color }
    : {}

  return (
    <div style={colorStyle}>
      {/* Mobile hamburger */}
      <button
        id="sb-toggle"
        onClick={() => setOpen(o => !o)}
        style={{ display: 'none' }}
        aria-label="Toggle navigation"
      >
        &#9776;
      </button>
      <style>{`@media(max-width:900px){#sb-toggle{display:block!important}}`}</style>

      <Sidebar {...sidebar} open={open} onClose={() => setOpen(false)} />

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {children}
      </motion.main>

      {/* Scroll to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            className="scroll-top-btn"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to top"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
