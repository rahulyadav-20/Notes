import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { useAuthStore } from '../../store/authStore'

const NAV = [
  { path: '/admin',           icon: '▦',  label: 'Overview'    },
  { path: '/admin/users',     icon: '👥', label: 'Users'       },
  { path: '/admin/content',   icon: '📝', label: 'Content'     },
  { path: '/admin/questions', icon: '🎯', label: 'Questions'   },
  { path: '/admin/pricing',   icon: '💰', label: 'Pricing'     },
  { path: '/admin/analytics', icon: '📊', label: 'Analytics'   },
  { path: '/admin/settings',  icon: '⚙️', label: 'Settings'    },
]

export default function AdminLayout({ title, children }) {
  const navigate      = useNavigate()
  const { pathname }  = useLocation()
  const { user }      = useAuth()
  const logout        = useAuthStore(s => s.logout)
  const [sideOpen, setSideOpen] = useState(false)

  const isActive = (path) =>
    path === '/admin' ? pathname === '/admin' : pathname.startsWith(path)

  return (
    <div className="min-h-screen flex bg-[#0c0c1e]">

      {/* ── Sidebar ── */}
      <>
        {/* Mobile backdrop */}
        <AnimatePresence>
          {sideOpen && (
            <motion.div
              className="lg:hidden fixed inset-0 z-[150] bg-black/50"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSideOpen(false)}/>
          )}
        </AnimatePresence>

        <aside className={`
          ${sideOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          fixed lg:sticky lg:top-0 left-0 z-[160]
          w-[240px] h-screen flex flex-col
          bg-[#0f0f25] border-r border-white/6
          transition-transform duration-200 lg:transition-none
          shrink-0
        `}>
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-5 h-[64px] border-b border-white/6 shrink-0">
            <svg className="w-8 h-8" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="9" fill="#12123a"/>
              <polygon points="18,6 30,28 6,28" fill="none" stroke="#f5820a" strokeWidth="2.5"/>
              <circle cx="18" cy="20" r="3.5" fill="#f5820a"/>
            </svg>
            <div>
              <div className="text-[0.88rem] font-black text-white tracking-tight leading-none">
                EngiNotes
              </div>
              <div className="text-[0.58rem] font-bold text-accent uppercase tracking-wider mt-0.5">
                Admin Panel
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 px-3 overflow-y-auto">
            <p className="text-[0.58rem] font-bold uppercase tracking-[1.5px] text-white/20 px-3 mb-2">
              Management
            </p>
            {NAV.map(item => (
              <button key={item.path}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5
                  text-[0.83rem] font-semibold text-left transition-colors
                  ${isActive(item.path)
                    ? 'bg-accent/15 text-accent'
                    : 'text-white/45 hover:text-white/75 hover:bg-white/6'}`}
                onClick={() => { navigate(item.path); setSideOpen(false) }}>
                <span className="text-base w-5 text-center shrink-0">{item.icon}</span>
                {item.label}
                {isActive(item.path) && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent shrink-0"/>
                )}
              </button>
            ))}
          </nav>

          {/* User info */}
          <div className="px-4 py-4 border-t border-white/6 shrink-0">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent2
                flex items-center justify-center text-[0.72rem] font-black text-white shrink-0">
                {user?.avatar || 'AD'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[0.78rem] font-bold text-white truncate">{user?.name}</div>
                <div className="text-[0.62rem] text-accent font-semibold">Super Admin</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="flex-1 py-1.5 rounded-lg text-[0.72rem] font-semibold
                  text-white/40 border border-white/10 hover:bg-white/6 transition-colors"
                onClick={() => navigate('/')}>
                ← Site
              </button>
              <button
                className="flex-1 py-1.5 rounded-lg text-[0.72rem] font-semibold
                  text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-colors"
                onClick={() => { logout(); navigate('/') }}>
                Logout
              </button>
            </div>
          </div>
        </aside>
      </>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">

        {/* Top bar */}
        <header className="h-[64px] bg-[#0f0f25] border-b border-white/6
          flex items-center gap-4 px-5 sm:px-7 shrink-0 sticky top-0 z-10">
          {/* Mobile hamburger */}
          <button className="lg:hidden flex flex-col gap-[5px] p-1"
            onClick={() => setSideOpen(o => !o)}>
            <span className="w-5 h-0.5 bg-white/50 rounded"/>
            <span className="w-5 h-0.5 bg-white/50 rounded"/>
            <span className="w-4 h-0.5 bg-white/50 rounded"/>
          </button>

          <h1 className="text-[1rem] font-black text-white">{title}</h1>

          <div className="ml-auto flex items-center gap-3">
            {/* Notification bell */}
            <button className="relative w-9 h-9 rounded-xl flex items-center justify-center
              bg-white/5 border border-white/8 hover:bg-white/10 transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                className="text-white/50">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent"/>
            </button>
            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent2
              flex items-center justify-center text-[0.72rem] font-black text-white">
              {user?.avatar || 'AD'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 sm:p-7 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
