import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'

const NAV_LINKS = [
  { label: 'Notes',     to: '/notes' },
  { label: 'Interview', to: '/interview' },
  { label: 'Courses',   to: '/courses' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-line shadow-sm">
      <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#12123a] flex items-center justify-center">
            <span className="text-white text-sm font-black">E</span>
          </div>
          <span className="font-black text-navy text-lg tracking-tight">
            Engi<span className="text-accent">Notes</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => {
            const active = pathname.startsWith(link.to)
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#12123a] text-white'
                    : 'text-muted hover:text-navy hover:bg-bg-base2'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <Link
            to="/auth/login"
            className="text-sm font-medium text-muted hover:text-navy transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/pricing"
            className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-[#e07409] transition-colors"
          >
            Go Premium
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-muted hover:text-navy hover:bg-bg-base2 transition-colors"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="md:hidden border-t border-line bg-white px-5 py-4 flex flex-col gap-1"
        >
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith(link.to)
                  ? 'bg-[#12123a] text-white'
                  : 'text-muted hover:text-navy hover:bg-bg-base2'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 pt-2 border-t border-line flex gap-3">
            <Link
              to="/auth/login"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center py-2 text-sm font-medium text-muted border border-line rounded-lg hover:border-navy hover:text-navy transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/pricing"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center py-2 text-sm font-semibold bg-accent text-white rounded-lg hover:bg-[#e07409] transition-colors"
            >
              Go Premium
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  )
}
