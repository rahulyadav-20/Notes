import { motion } from 'framer-motion'

/*
  Diagram wraps an SVG canvas with:
  - Dark background, border, rounded corners (.dc)
  - Framer Motion fade-in on scroll
  - SVG glow filter available to children via filterId="iso-glow"
  - Optional caption

  Pass children as SVG elements (IsoBox, IsoArrow, or raw SVG).
  viewBox defaults to "0 0 800 420" — override as needed.
*/
export default function Diagram({ title, caption, viewBox = '0 0 800 420', children }) {
  return (
    <motion.div
      className="dc iso-stage"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {title && (
        <div style={{
          fontSize: '0.82em', fontWeight: 600, color: '#666',
          marginBottom: 10, letterSpacing: '0.5px', textTransform: 'uppercase',
        }}>
          {title}
        </div>
      )}
      <svg
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        fontFamily="Segoe UI, sans-serif"
        className="iso-svg-wrap"
      >
        <defs>
          {/* Glow filter for hover state on IsoBox */}
          <filter id="iso-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feColorMatrix in="blur" type="matrix"
              values="1 0 0 0 0.3  0 1 0 0 0.6  0 0 1 0 1  0 0 0 2.5 0"
              result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {children}
      </svg>
      {caption && <div className="dc-cap">{caption}</div>}
    </motion.div>
  )
}
