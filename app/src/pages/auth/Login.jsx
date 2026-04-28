import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

export default function Login() {
  const navigate   = useNavigate()
  const login      = useAuthStore(s => s.login)

  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }

    setLoading(true)
    await new Promise(r => setTimeout(r, 600)) // simulate network
    const result = login({ email: form.email.trim().toLowerCase(), password: form.password })
    setLoading(false)

    if (result.success) navigate('/dashboard')
    else setError(result.error || 'Login failed. Please try again.')
  }

  const fillDemo = (type) => {
    if (type === 'free')    setForm({ email: 'free@demo.com',    password: 'demo123' })
    if (type === 'premium') setForm({ email: 'premium@demo.com', password: 'demo123' })
  }

  return (
    <div className="min-h-screen bg-base flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-line h-[68px] flex items-center px-5 sm:px-8">
        <a href="/" className="flex items-center gap-2.5 no-underline">
          <svg className="w-9 h-9" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="9" fill="#12123a"/>
            <polygon points="18,6 30,28 6,28" fill="none" stroke="#f5820a" strokeWidth="2.5"/>
            <circle cx="18" cy="20" r="3.5" fill="#f5820a"/>
          </svg>
          <span className="text-[1.18rem] font-black text-navy tracking-tight">
            Engi<span className="text-accent">Notes</span>
          </span>
        </a>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-[420px]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}>

          {/* Demo accounts hint */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6">
            <p className="text-[0.72rem] font-bold text-blue-700 mb-1.5">
              🧪 Demo Accounts (Phase 1 — no backend yet)
            </p>
            <div className="flex gap-2">
              <button onClick={() => fillDemo('free')}
                className="text-[0.7rem] font-semibold px-2.5 py-1 rounded-lg
                  bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200 transition-colors">
                Free demo
              </button>
              <button onClick={() => fillDemo('premium')}
                className="text-[0.7rem] font-semibold px-2.5 py-1 rounded-lg
                  bg-purple-100 text-purple-700 border border-purple-300 hover:bg-purple-200 transition-colors">
                Premium demo
              </button>
            </div>
          </div>

          <div className="bg-white border border-line rounded-2xl p-7 sm:p-9
            shadow-[0_4px_32px_rgba(18,18,58,0.07)]">

            <h1 className="text-[1.6rem] font-black text-navy mb-1">Welcome back</h1>
            <p className="text-[0.83rem] text-muted mb-7">
              Sign in to your EngiNotes account
            </p>

            {/* Google button */}
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3
              rounded-xl border-2 border-line font-bold text-[0.88rem] text-navy
              hover:bg-base2 hover:border-[#c5cae5] transition-all mb-5">
              <GoogleIcon/>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-line"/>
              <span className="text-[0.7rem] text-muted font-semibold">or</span>
              <div className="flex-1 h-px bg-line"/>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.75rem] font-bold text-navy">Email</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-line text-[0.88rem]
                    text-navy placeholder:text-muted/50 outline-none
                    focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[0.75rem] font-bold text-navy">Password</label>
                  <button type="button"
                    className="text-[0.72rem] font-semibold text-accent hover:opacity-70 transition-opacity">
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-line text-[0.88rem]
                    text-navy placeholder:text-muted/50 outline-none
                    focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all"
                />
              </div>

              {error && (
                <motion.div
                  className="flex items-center gap-2 px-4 py-3 rounded-xl
                    bg-red-50 border border-red-200 text-red-700 text-[0.8rem] font-semibold"
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
                  ⚠️ {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-white text-[0.92rem]
                  bg-gradient-to-br from-accent to-accent2
                  shadow-[0_4px_14px_rgba(245,130,10,0.3)]
                  hover:opacity-90 transition-opacity disabled:opacity-60 mt-1">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Signing in…
                  </span>
                ) : 'Sign in'}
              </button>
            </form>

            <p className="text-center text-[0.8rem] text-muted mt-5">
              Don't have an account?{' '}
              <Link to="/signup" className="font-bold text-accent hover:opacity-70 transition-opacity">
                Sign up free
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
