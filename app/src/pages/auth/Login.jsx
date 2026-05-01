import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'
import { api } from '../../api/client'

const IS_DEV = import.meta.env.DEV

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

/* ── Dev role picker modal ─────────────────────────── */
function DevRolePicker({ onSelect, onClose }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}>
      <motion.div className="bg-white rounded-2xl p-6 w-full max-w-[320px] shadow-2xl"
        initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}>
        <p className="text-[0.65rem] font-bold uppercase tracking-[2px] text-amber-500 mb-2">
          🛠 Dev Mode — Pick a role
        </p>
        <p className="text-[0.78rem] text-muted mb-4">
          No Google credentials needed. Signs you in as a test account.
        </p>
        <div className="flex flex-col gap-2">
          {[
            { role: 'user',    label: 'Free User',    color: '#6b7280', email: 'dev.user@test.local'    },
            { role: 'premium', label: 'Premium User', color: '#8B5CF6', email: 'dev.premium@test.local' },
            { role: 'admin',   label: 'Admin',        color: '#EC4899', email: 'dev.admin@test.local'   },
          ].map(({ role, label, color, email }) => (
            <button key={role}
              onClick={() => onSelect(role)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-line
                hover:bg-base2 transition-colors text-left">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }}/>
              <div>
                <div className="text-[0.82rem] font-bold text-navy">{label}</div>
                <div className="text-[0.65rem] text-muted">{email}</div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Login() {
  const navigate        = useNavigate()
  const login           = useAuthStore(s => s.login)
  const devGoogleLogin  = useAuthStore(s => s.devGoogleLogin)
  const [searchParams]  = useSearchParams()

  const [form, setForm]           = useState({ email: '', password: '' })
  const [error, setError]         = useState(
    searchParams.get('error') === 'oauth' ? 'Google sign-in failed. Please try again.' : ''
  )
  const [loading, setLoading]     = useState(false)
  const [showDevPicker, setDevPicker] = useState(false)
  const [needsVerify, setNeedsVerify] = useState(null)  // email string when unverified

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  /* ── Email / password submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    if (form.password.length < 8)      { setError('Password must be at least 8 characters.'); return }

    setLoading(true)
    const result = await login({ email: form.email.trim().toLowerCase(), password: form.password })
    setLoading(false)

    if (result.success) {
      navigate('/dashboard')
    } else {
      // Check for unverified email (403 from backend)
      const data = result.rawData
      if (data?.requiresVerification) {
        setNeedsVerify(data.email || form.email)
      } else {
        setError(result.error)
      }
    }
  }

  /* ── Google / Dev Google ── */
  const handleGoogle = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (googleClientId && !IS_DEV) {
      // Real Google OAuth — redirect to backend
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
    } else {
      // Dev mode — show role picker
      setDevPicker(true)
    }
  }

  const handleDevRole = async (role) => {
    setDevPicker(false)
    setLoading(true)
    const result = await devGoogleLogin(role)
    setLoading(false)
    if (result.success) navigate('/dashboard')
    else setError(result.error)
  }

  /* ── Quick-fill test accounts ── */
  const fillTest = (type) => {
    const map = {
      free:    { email: 'user@test.local',    password: 'User@1234'    },
      premium: { email: 'premium@test.local', password: 'Premium@1234' },
      admin:   { email: 'admin@test.local',   password: 'Admin@1234'   },
    }
    setForm(map[type])
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
        <motion.div className="w-full max-w-[420px]"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}>

          {/* Dev quick-access strip */}
          {IS_DEV && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
              <p className="text-[0.68rem] font-bold text-amber-700 mb-2">
                🛠 Dev — quick fill test accounts
              </p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { type: 'free',    label: 'Free user',    color: 'bg-slate-100 text-slate-700 border-slate-300'   },
                  { type: 'premium', label: 'Premium user', color: 'bg-purple-100 text-purple-700 border-purple-300' },
                  { type: 'admin',   label: 'Admin',        color: 'bg-pink-100 text-pink-700 border-pink-300'       },
                ].map(({ type, label, color }) => (
                  <button key={type} onClick={() => fillTest(type)}
                    className={`text-[0.68rem] font-semibold px-2.5 py-1 rounded-lg border transition-colors hover:opacity-80 ${color}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white border border-line rounded-2xl p-7 sm:p-9
            shadow-[0_4px_32px_rgba(18,18,58,0.07)]">

            <h1 className="text-[1.6rem] font-black text-navy mb-1">Welcome back</h1>
            <p className="text-[0.83rem] text-muted mb-7">Sign in to your EngiNotes account</p>

            {/* Google button */}
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3
                rounded-xl border-2 border-line font-bold text-[0.88rem] text-navy
                hover:bg-base2 hover:border-[var(--color-line-hover)] transition-all mb-5
                disabled:opacity-50 disabled:cursor-not-allowed">
              <GoogleIcon/>
              {IS_DEV ? 'Continue with Google (dev)' : 'Continue with Google'}
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
                    onClick={() => navigate('/forgot-password')}
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

              <AnimatePresence>
                {needsVerify && (
                  <motion.div
                    className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200
                      text-amber-800 text-[0.8rem]"
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}>
                    <p className="font-bold mb-1">📧 Email not verified</p>
                    <p className="mb-2 font-medium">
                      Please verify <strong>{needsVerify}</strong> before signing in.
                    </p>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await api.resendOtp({ email: needsVerify })
                          setNeedsVerify(null)
                          navigate(`/signup?verify=${encodeURIComponent(needsVerify)}`)
                        } catch { /* ignore */ }
                      }}
                      className="text-[0.75rem] font-bold text-amber-700 underline
                        hover:text-amber-900 transition-colors">
                      Resend code & verify →
                    </button>
                  </motion.div>
                )}
                {error && (
                  <motion.div
                    className="flex items-center gap-2 px-4 py-3 rounded-xl
                      bg-red-50 border border-red-200 text-red-700 text-[0.8rem] font-semibold"
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}>
                    ⚠️ {error}
                  </motion.div>
                )}
              </AnimatePresence>

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

      {/* Dev role picker modal */}
      <AnimatePresence>
        {showDevPicker && (
          <DevRolePicker
            onSelect={handleDevRole}
            onClose={() => setDevPicker(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
