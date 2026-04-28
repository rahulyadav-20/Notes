import { motion } from 'framer-motion'

export default function PartHeader({ part, title, subtitle }) {
  return (
    <motion.div
      className="ph"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="pl">Part {part}</div>
      <h1>{title}</h1>
      {subtitle && <div className="ps">{subtitle}</div>}
    </motion.div>
  )
}
