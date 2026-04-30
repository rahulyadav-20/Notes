import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <motion.footer
      className="text-white/45 text-center px-6 sm:px-10 lg:px-16 pt-12 pb-9 text-[0.82rem]"
      style={{ background: '#0d0d1e' }}
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
      viewport={{ once: true }} transition={{ duration: 0.6 }}>
      <div className="max-w-[1300px] mx-auto flex flex-col items-center gap-3.5">

        <div className="flex items-center gap-2.5 text-[1.15em] font-bold text-white/85">
          <svg width="28" height="28" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="9" fill="rgba(255,255,255,0.08)"/>
            <polygon points="18,6 30,28 6,28" fill="none" stroke="#f5820a" strokeWidth="2.5"/>
            <circle cx="18" cy="20" r="3.5" fill="#f5820a"/>
          </svg>
          <strong>EngiNotes</strong>
        </div>

        <p className="text-white/35 text-[0.95em]">
          Built for engineers who want to go deep, not just wide.
        </p>

        <div className="w-10 h-px bg-white/12 my-1"/>

        <p className="text-white/50 text-[0.92em] flex items-center gap-1.5">
          <span className="text-accent text-[0.7em]">✦</span>
          Founded &amp; crafted by <strong className="text-accent font-bold">Rahul Yadav</strong>
        </p>

        <p className="text-white/22 text-[0.82em] mt-1">
          © {new Date().getFullYear()} EngiNotes. All rights reserved.
        </p>
      </div>
    </motion.footer>
  )
}
