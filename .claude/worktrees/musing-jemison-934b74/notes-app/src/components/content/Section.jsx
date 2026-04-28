import { motion } from 'framer-motion'

export default function Section({ title, children }) {
  return (
    <motion.div
      className="sb section-animate"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <h2 className="st">{title}</h2>
      <div className="ct">{children}</div>
    </motion.div>
  )
}
