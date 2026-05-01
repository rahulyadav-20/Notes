import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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

function Check() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="#10B981" strokeWidth="2.5" strokeLinecap="round">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  )
}

const PERKS = [
  'Access free notes, courses & interview questions',
  'Track your learning progress',
  'Save questions & bookmark articles',
  'Join the community — share interview experiences',
]

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
          Signs you in as a test account (no Google credentials needed).
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

/* ── OTP verification step ── */
function OtpStep({ email, onSuccess }) {
  const verifyEmail = useAuthStore(s => s.verifyEmail)
  const [digits, setDigits]     = useState(['','','','','',''])
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [resendMsg, setResendMsg] = useState('')
  const inputs = useRef([])

  const handleDigit = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...digits]
    next[i] = val
    setDigits(next)
    if (val && i < 5) inputs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (text.length === 6) {
      setDigits(text.split(''))
      inputs.current[5]?.focus()
    }
  }

  const handleVerify = async () => {
    const otp = digits.join('')
    if (otp.length < 6) { setError('Enter the full 6-digit code.'); return }
    setLoading(true); setError('')
    const result = await verifyEmail({ email, otp })
    setLoading(false)
    if (result.success) onSuccess()
    else setError(result.error)
  }

  const handleResend = async () => {
    setResendMsg(''); setError('')
    try {
      await api.resendOtp({ email })
      setResendMsg('New code sent — check your inbox.')
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to resend.')
    }
  }

  return (
    <div className="bg-white border border-line rounded-2xl p-7 sm:p-9
      shadow-[0_4px_32px_rgba(18,18,58,0.07)]">

      <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center
        text-2xl mx-auto mb-5">
        ✉️
      </div>
      <h1 className="text-[1.4rem] font-black text-navy text-center mb-1">Check your email</h1>
      <p className="text-[0.82rem] text-muted text-center mb-6">
        We sent a 6-digit code to <strong className="text-navy">{email}</strong>
      </p>

      {/* Digit inputs */}
      <div className="flex gap-2.5 justify-center mb-5" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => inputs.current[i] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => handleDigit(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className="w-11 h-14 text-center text-[1.4rem] font-black text-navy
              border-2 rounded-xl outline-none transition-all
              focus:border-accent focus:ring-2 focus:ring-accent/15
              border-line bg-base"
          />
        ))}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200
            text-red-700 text-[0.8rem] font-semibold text-center"
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            ⚠️ {error}
          </motion.div>
        )}
        {resendMsg && (
          <motion.div className="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-200
            text-green-700 text-[0.8rem] font-semibold text-center"
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            ✓ {resendMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleVerify}
        disabled={loading || digits.join('').length < 6}
        className="w-full py-3.5 rounded-xl font-bold text-white text-[0.92rem]
          bg-gradient-to-br from-accent to-accent2
          shadow-[0_4px_14px_rgba(245,130,10,0.3)]
          hover:opacity-90 transition-opacity disabled:opacity-50 mb-4">
        {loading ? 'Verifying…' : 'Verify email →'}
      </button>

      <p className="text-center text-[0.78rem] text-muted">
        Didn't receive it?{' '}
        <button onClick={handleResend}
          className="font-bold text-accent hover:opacity-70 transition-opacity">
          Resend code
        </button>
      </p>
    </div>
  )
}

export default function Signup() {
  const navigate       = useNavigate()
  const signup         = useAuthStore(s => s.signup)
  const devGoogleLogin = useAuthStore(s => s.devGoogleLogin)

  const [form, setForm]           = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [showDevPicker, setDevPicker] = useState(false)
  const [pendingEmail, setPendingEmail] = useState(null)  // null = step 1, string = step 2

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    if (!form.name.trim())  return 'Please enter your name.'
    if (!form.email.trim()) return 'Please enter your email.'
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Please enter a valid email.'
    if (form.password.length < 8) return 'Password must be at least 8 characters.'
    if (form.password !== form.confirm) return 'Passwords do not match.'
    return null
  }

  /* ── Email / password register ── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const err = validate()
    if (err) { setError(err); return }

    setLoading(true)
    const result = await signup({
      name:     form.name.trim(),
      email:    form.email.trim().toLowerCase(),
      password: form.password,
    })
    setLoading(false)

    if (result.success) {
      if (result.requiresVerification) setPendingEmail(result.email)
      else navigate('/dashboard')
    } else {
      setError(result.error)
    }
  }

  /* ── Google / Dev Google ── */
  const handleGoogle = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (googleClientId && !IS_DEV) {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
    } else {
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

      <div className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-[860px] flex gap-10 items-start flex-wrap lg:flex-nowrap">

          {/* Left — perks */}
          <motion.div className="flex-1 min-w-[240px] hidden lg:block pt-2"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}>
            <p className="text-[0.68rem] font-bold uppercase tracking-[3px] text-accent mb-3">
              Free forever plan
            </p>
            <h2 className="text-[1.8rem] font-black text-navy leading-tight mb-5">
              Start learning<br/>for free today
            </h2>
            <div className="flex flex-col gap-3">
              {PERKS.map(p => (
                <div key={p} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center
                    justify-center shrink-0 mt-0.5">
                    <Check/>
                  </div>
                  <p className="text-[0.85rem] text-navy/75 leading-relaxed">{p}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-accent/8 border border-accent/20">
              <p className="text-[0.78rem] font-bold text-navy mb-1">
                ⚡ Premium upgrade coming soon
              </p>
              <p className="text-[0.72rem] text-muted leading-relaxed">
                Full notes access, all courses, unlimited interview questions & certificate of completion.
              </p>
            </div>
          </motion.div>

          {/* Right — form or OTP step */}
          <motion.div className="w-full lg:w-[400px] shrink-0"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}>

            {pendingEmail ? (
              <OtpStep email={pendingEmail} onSuccess={() => navigate('/dashboard')} />
            ) : (
            <div className="bg-white border border-line rounded-2xl p-7 sm:p-9
              shadow-[0_4px_32px_rgba(18,18,58,0.07)]">

              <h1 className="text-[1.5rem] font-black text-navy mb-1">Create your account</h1>
              <p className="text-[0.82rem] text-muted mb-6">Free forever · No credit card needed</p>

              {/* Google button */}
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3
                  rounded-xl border-2 border-line font-bold text-[0.88rem] text-navy
                  hover:bg-base2 hover:border-[var(--color-line-hover)] transition-all mb-5
                  disabled:opacity-50 disabled:cursor-not-allowed">
                <GoogleIcon/>
                {IS_DEV ? 'Sign up with Google (dev)' : 'Sign up with Google'}
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-line"/>
                <span className="text-[0.7rem] text-muted font-semibold">or</span>
                <div className="flex-1 h-px bg-line"/>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.75rem] font-bold text-navy">Full name</label>
                  <input
                    type="text"
                    placeholder="Rahul Yadav"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-line text-[0.88rem]
                      text-navy placeholder:text-muted/50 outline-none
                      focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all"
                  />
                </div>

                {/* Email */}
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

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.75rem] font-bold text-navy">Password</label>
                  <input
                    type="password"
                    placeholder="Min 8 characters"
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-line text-[0.88rem]
                      text-navy placeholder:text-muted/50 outline-none
                      focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all"
                  />
                </div>

                {/* Confirm password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.75rem] font-bold text-navy">Confirm password</label>
                  <input
                    type="password"
                    placeholder="Repeat your password"
                    value={form.confirm}
                    onChange={e => set('confirm', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-line text-[0.88rem]
                      text-navy placeholder:text-muted/50 outline-none
                      focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all"
                  />
                </div>

                <AnimatePresence>
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

                <p className="text-[0.7rem] text-muted">
                  By signing up you agree to our{' '}
                  <span className="text-accent font-semibold cursor-pointer">Terms</span>
                  {' '}and{' '}
                  <span className="text-accent font-semibold cursor-pointer">Privacy Policy</span>.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-[0.92rem]
                    bg-gradient-to-br from-accent to-accent2
                    shadow-[0_4px_14px_rgba(245,130,10,0.3)]
                    hover:opacity-90 transition-opacity disabled:opacity-60">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                      </svg>
                      Creating account…
                    </span>
                  ) : 'Create free account'}
                </button>
              </form>

              <p className="text-center text-[0.8rem] text-muted mt-5">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-accent hover:opacity-70 transition-opacity">
                  Sign in
                </Link>
              </p>
            </div>
            )}
          </motion.div>
        </div>
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
