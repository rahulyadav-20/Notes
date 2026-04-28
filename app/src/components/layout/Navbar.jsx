import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { useAuthStore } from '../../store/authStore'

const NAV_LINKS = [
  { label: 'Notes',     path: '/notes',     soon: false },
  { label: 'Courses',   path: '/courses',   soon: false },
  { label: 'Interview', path: '/interview', soon: false },
  { label: 'Blog',      path: '/blog',      soon: false },
]

/* ── User avatar dropdown ── */
function UserMenu({ user, isPremium, navigate, logout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const initials = user.avatar || user.name?.slice(0, 2).toUpperCase() || 'U'

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl
          hover:bg-base2 transition-colors"
        onClick={() => setOpen(o => !o)}>
        {/* Avatar circle */}
        <div className="w-8 h-8 rounded-xl flex items-center justify-center
          text-[0.75rem] font-black text-white shrink-0"
          style={{ background: 'linear-gradient(135deg, #f5820a, #ec4899)' }}>
          {initials}
        </div>
        <div className="hidden sm:flex flex-col items-start leading-none">
          <span className="text-[0.78rem] font-bold text-navy">{user.name?.split(' ')[0]}</span>
          {isPremium && (
            <span className="text-[0.58rem] font-bold text-amber-500">Premium</span>
          )}
        </div>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          className={`text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-[calc(100%+8px)] w-[210px] bg-white
              border border-line rounded-2xl shadow-[0_8px_32px_rgba(18,18,58,0.12)]
              overflow-hidden z-[200]"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}>

            {/* User info */}
            <div className="px-4 py-3 border-b border-line">
              <div className="text-[0.82rem] font-bold text-navy">{user.name}</div>
              <div className="text-[0.68rem] text-muted truncate">{user.email}</div>
              <div className={`inline-flex items-center gap-1 mt-1.5 text-[0.6rem] font-bold
                px-2 py-0.5 rounded-full
                ${isPremium
                  ? 'bg-amber-100 text-amber-700 border border-amber-200'
                  : 'bg-base2 text-muted border border-line'}`}>
                {isPremium ? '⭐ Premium' : '🆓 Free Plan'}
              </div>
            </div>

            {/* Menu items */}
            <div className="py-1.5">
              {[
                { icon: '🏠', label: 'Dashboard',   action: () => { navigate('/dashboard'); setOpen(false) } },
                { icon: '📝', label: 'Notes',       action: () => { navigate('/notes');     setOpen(false) } },
                { icon: '🎓', label: 'My Courses',  action: () => { navigate('/courses');   setOpen(false) } },
                { icon: '🎯', label: 'Interview',   action: () => { navigate('/interview'); setOpen(false) } },
              ].map(item => (
                <button key={item.label}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5
                    text-[0.82rem] font-semibold text-navy hover:bg-base2 transition-colors text-left"
                  onClick={item.action}>
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            {/* Upgrade (free users) */}
            {!isPremium && (
              <div className="px-3 pb-2">
                <button
                  className="w-full py-2 rounded-xl text-[0.8rem] font-bold text-white
                    bg-gradient-to-br from-accent to-accent2 hover:opacity-90 transition-opacity"
                  onClick={() => { navigate('/upgrade'); setOpen(false) }}>
                  ⚡ Upgrade to Premium
                </button>
              </div>
            )}

            {/* Sign out */}
            <div className="border-t border-line py-1.5">
              <button
                className="w-full flex items-center gap-2.5 px-4 py-2.5
                  text-[0.82rem] font-semibold text-red-500 hover:bg-red-50 transition-colors text-left"
                onClick={() => { logout(); navigate('/'); setOpen(false) }}>
                <span className="text-base">🚪</span>
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  const { user, isLoggedIn, isPremium } = useAuth()
  const logout = useAuthStore(s => s.logout)

  const isActive = (path) => pathname !== '/' && pathname.startsWith(path)

  const go = (path, soon) => {
    if (soon) return
    setOpen(false)
    navigate(path)
  }

  return (
    <>
      {/* ── Desktop / tablet navbar ── */}
      <motion.nav
        className="sticky top-0 z-[100] bg-white/90 backdrop-blur-xl border-b border-line h-[68px] flex items-center"
        initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}>
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12 w-full flex items-center gap-6 lg:gap-9">

          {/* Logo */}
          <motion.a className="flex items-center gap-2.5 no-underline shrink-0" href="/"
            whileHover={{ scale: 1.04 }} transition={{ type: 'spring', stiffness: 400 }}>
            <svg className="w-9 h-9" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="9" fill="#12123a"/>
              <polygon points="18,6 30,28 6,28" fill="none" stroke="#f5820a" strokeWidth="2.5"/>
              <circle cx="18" cy="20" r="3.5" fill="#f5820a"/>
            </svg>
            <span className="text-[1.18rem] font-black text-navy tracking-tight">
              Engi<span className="text-accent">Notes</span>
            </span>
          </motion.a>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1">
            {NAV_LINKS.map((l, i) => (
              <motion.button key={l.label}
                className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold
                  text-navy cursor-pointer transition-colors
                  ${isActive(l.path) ? 'text-accent nav-active-line' : 'hover:bg-base2'}
                  ${l.soon ? 'opacity-60 cursor-default' : ''}`}
                onClick={() => go(l.path, l.soon)}
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }} whileHover={{ scale: 1.04 }}>
                {l.label}
                {l.soon && (
                  <span className="text-[0.6em] bg-base2 text-muted px-1.5 py-0.5 rounded font-bold tracking-wide">
                    Soon
                  </span>
                )}
              </motion.button>
            ))}
          </div>

          {/* Auth area (desktop) */}
          <div className="hidden lg:flex items-center gap-2.5 ml-auto shrink-0">
            {isLoggedIn && user ? (
              <UserMenu user={user} isPremium={isPremium} navigate={navigate} logout={logout}/>
            ) : (
              <>
                <motion.button
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-navy border border-line hover:bg-base2 hover:border-[#c5cae5] transition-all"
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/login')}>
                  Log in
                </motion.button>
                <motion.button
                  className="px-5 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-br from-accent to-accent2 shadow-[0_4px_14px_rgba(245,130,10,0.35)] transition-all"
                  whileHover={{ scale: 1.06, boxShadow: '0 6px 20px rgba(245,130,10,0.5)' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate('/signup')}>
                  Get Started
                </motion.button>
              </>
            )}
          </div>

          {/* Hamburger (mobile) */}
          <button
            className="lg:hidden ml-auto flex flex-col justify-center items-center gap-[5px] w-9 h-9 rounded-lg border border-line hover:bg-base2 transition-colors shrink-0 p-0"
            onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
            <span className={`block w-4 h-0.5 bg-navy rounded transition-all duration-250 origin-center ${open ? 'translate-y-[7px] rotate-45' : ''}`}/>
            <span className={`block w-4 h-0.5 bg-navy rounded transition-all duration-250 ${open ? 'opacity-0 scale-x-0' : ''}`}/>
            <span className={`block w-4 h-0.5 bg-navy rounded transition-all duration-250 origin-center ${open ? '-translate-y-[7px] -rotate-45' : ''}`}/>
          </button>

        </div>
      </motion.nav>

      {/* ── Mobile slide-down menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="lg:hidden sticky top-[68px] z-[99] bg-white/97 backdrop-blur-xl border-b border-line px-4 sm:px-6 py-4 flex flex-col gap-1 shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}>
            {NAV_LINKS.map(l => (
              <button key={l.label}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[0.92rem] font-semibold text-left
                  transition-colors ${isActive(l.path) ? 'bg-base2 text-accent' : 'text-navy hover:bg-base2'}`}
                onClick={() => go(l.path, l.soon)}>
                {l.label}
                {l.soon && <span className="text-[0.6em] bg-base2 text-muted px-1.5 py-0.5 rounded font-bold">Soon</span>}
              </button>
            ))}
            <div className="h-px bg-line my-2"/>
            {isLoggedIn && user ? (
              <>
                <div className="flex items-center gap-3 px-3.5 py-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center
                    text-[0.72rem] font-black text-white"
                    style={{ background: 'linear-gradient(135deg, #f5820a, #ec4899)' }}>
                    {user.avatar || user.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-[0.85rem] font-bold text-navy">{user.name}</div>
                    <div className="text-[0.65rem] text-muted">{isPremium ? '⭐ Premium' : '🆓 Free'}</div>
                  </div>
                </div>
                <button className="px-3.5 py-2.5 rounded-xl text-[0.92rem] font-semibold text-navy hover:bg-base2 text-left transition-colors"
                  onClick={() => { navigate('/dashboard'); setOpen(false) }}>
                  Dashboard
                </button>
                <button className="mt-1 px-4 py-3 rounded-xl text-[0.88rem] font-bold text-red-500
                  border border-red-200 hover:bg-red-50 transition-colors"
                  onClick={() => { logout(); navigate('/'); setOpen(false) }}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button className="px-3.5 py-2.5 rounded-xl text-[0.92rem] font-semibold text-navy hover:bg-base2 text-left transition-colors"
                  onClick={() => { navigate('/login'); setOpen(false) }}>
                  Log in
                </button>
                <button className="mt-1 px-4 py-3 rounded-xl bg-gradient-to-br from-accent to-accent2 text-white font-bold text-sm shadow-[0_4px_14px_rgba(245,130,10,0.35)]"
                  onClick={() => { navigate('/signup'); setOpen(false) }}>
                  Get Started →
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
