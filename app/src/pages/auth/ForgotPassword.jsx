import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'
import { api } from '../../api/client'

function Logo() {
  return (
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
  )
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
    </svg>
  )
}

/* ── Step 1: email input ── */
function EmailStep({ onSent }) {
  const [email, setEmail]   = useState('')
  const [loading, setLoad]  = useState(false)
  const [error, setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) { setError('Please enter your email.'); return }
    setLoad(true); setError('')
    try {
      await api.forgotPassword({ email: email.trim().toLowerCase() })
      onSent(email.trim().toLowerCase())
    } catch (err) {
      // Even on error show success (anti-enumeration) — but surface network errors
      if (!err.response) setError('Cannot reach server. Is the backend running?')
      else onSent(email.trim().toLowerCase())
    }
    setLoad(false)
  }

  return (
    <div className="bg-white border border-line rounded-2xl p-7 sm:p-9
      shadow-[0_4px_32px_rgba(18,18,58,0.07)]">

      <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center
        text-2xl mx-auto mb-5">🔑</div>
      <h1 className="text-[1.5rem] font-black text-navy text-center mb-1">Forgot password?</h1>
      <p className="text-[0.82rem] text-muted text-center mb-6">
        Enter your email and we'll send you a reset code.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.75rem] font-bold text-navy">Email address</label>
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
            className="w-full px-4 py-3 rounded-xl border border-line text-[0.88rem]
              text-navy placeholder:text-muted/50 outline-none
              focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all"
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200
              text-red-700 text-[0.8rem] font-semibold"
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        <button type="submit" disabled={loading}
          className="w-full py-3.5 rounded-xl font-bold text-white text-[0.92rem]
            bg-gradient-to-br from-accent to-accent2
            shadow-[0_4px_14px_rgba(245,130,10,0.3)]
            hover:opacity-90 transition-opacity disabled:opacity-60">
          {loading ? <span className="flex items-center justify-center gap-2"><Spinner/> Sending…</span> : 'Send reset code'}
        </button>
      </form>

      <p className="text-center text-[0.8rem] text-muted mt-5">
        Remembered it?{' '}
        <Link to="/login" className="font-bold text-accent hover:opacity-70 transition-opacity">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}

/* ── Step 2: OTP + new password ── */
function ResetStep({ email, onSuccess }) {
  const { loginFromToken } = useAuthStore()
  const [digits, setDigits]       = useState(['','','','','',''])
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [error, setError]         = useState('')
  const [loading, setLoad]        = useState(false)
  const [resendMsg, setResendMsg] = useState('')
  const inputs = useRef([])

  const handleDigit = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...digits]; next[i] = val; setDigits(next)
    if (val && i < 5) inputs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputs.current[i - 1]?.focus()
  }

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (text.length === 6) { setDigits(text.split('')); inputs.current[5]?.focus() }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otp = digits.join('')
    if (otp.length < 6)         { setError('Enter the full 6-digit code.'); return }
    if (password.length < 8)    { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm)   { setError('Passwords do not match.'); return }

    setLoad(true); setError('')
    try {
      const { data } = await api.resetPassword({ email, otp, newPassword: password })
      // Store token and log user in directly
      localStorage.setItem('enginotes_token', data.accessToken)
      await loginFromToken(data.accessToken)
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed. Try again.')
    }
    setLoad(false)
  }

  const handleResend = async () => {
    setResendMsg(''); setError('')
    try {
      await api.forgotPassword({ email })
      setResendMsg('New code sent — check your inbox.')
    } catch { setError('Failed to resend. Try again.') }
  }

  return (
    <div className="bg-white border border-line rounded-2xl p-7 sm:p-9
      shadow-[0_4px_32px_rgba(18,18,58,0.07)]">

      <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center
        text-2xl mx-auto mb-5">✉️</div>
      <h1 className="text-[1.4rem] font-black text-navy text-center mb-1">Check your email</h1>
      <p className="text-[0.82rem] text-muted text-center mb-6">
        Enter the code sent to <strong className="text-navy">{email}</strong>
        {' '}and choose a new password.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* 6-digit OTP boxes */}
        <div>
          <label className="text-[0.75rem] font-bold text-navy mb-2 block">Reset code</label>
          <div className="flex gap-2" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input key={i} ref={el => inputs.current[i] = el}
                type="text" inputMode="numeric" maxLength={1} value={d}
                onChange={e => handleDigit(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className="flex-1 h-12 text-center text-[1.3rem] font-black text-navy
                  border-2 rounded-xl outline-none transition-all
                  focus:border-accent focus:ring-2 focus:ring-accent/15 border-line bg-base"
              />
            ))}
          </div>
        </div>

        {/* New password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.75rem] font-bold text-navy">New password</label>
          <input type="password" placeholder="Min 8 characters" value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-line text-[0.88rem]
              text-navy placeholder:text-muted/50 outline-none
              focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all"
          />
        </div>

        {/* Confirm */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.75rem] font-bold text-navy">Confirm new password</label>
          <input type="password" placeholder="Repeat your password" value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-line text-[0.88rem]
              text-navy placeholder:text-muted/50 outline-none
              focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all"
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200
              text-red-700 text-[0.8rem] font-semibold"
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              ⚠️ {error}
            </motion.div>
          )}
          {resendMsg && (
            <motion.div className="px-4 py-3 rounded-xl bg-green-50 border border-green-200
              text-green-700 text-[0.8rem] font-semibold"
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              ✓ {resendMsg}
            </motion.div>
          )}
        </AnimatePresence>

        <button type="submit"
          disabled={loading || digits.join('').length < 6 || password.length < 8}
          className="w-full py-3.5 rounded-xl font-bold text-white text-[0.92rem]
            bg-gradient-to-br from-accent to-accent2
            shadow-[0_4px_14px_rgba(245,130,10,0.3)]
            hover:opacity-90 transition-opacity disabled:opacity-50">
          {loading ? <span className="flex items-center justify-center gap-2"><Spinner/> Resetting…</span> : 'Reset password →'}
        </button>
      </form>

      <p className="text-center text-[0.78rem] text-muted mt-4">
        Didn't receive it?{' '}
        <button onClick={handleResend}
          className="font-bold text-accent hover:opacity-70 transition-opacity">
          Resend code
        </button>
      </p>
    </div>
  )
}

/* ── Main page ── */
export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep]   = useState('email')   // 'email' | 'reset' | 'done'
  const [email, setEmail] = useState('')

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-base flex flex-col">
        <div className="bg-white border-b border-line h-[68px] flex items-center px-5 sm:px-8">
          <Logo/>
        </div>
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <motion.div className="w-full max-w-[420px] text-center"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center
              mx-auto mb-6">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                stroke="#10B981" strokeWidth="2.5" strokeLinecap="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <h1 className="text-[1.6rem] font-black text-navy mb-2">Password reset!</h1>
            <p className="text-[0.85rem] text-muted mb-6">
              You're now logged in with your new password.
            </p>
            <button onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-xl font-bold text-white text-[0.9rem]
                bg-gradient-to-br from-accent to-accent2 hover:opacity-90 transition-opacity">
              Go to dashboard →
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base flex flex-col">
      <div className="bg-white border-b border-line h-[68px] flex items-center px-5 sm:px-8">
        <Logo/>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div className="w-full max-w-[420px]"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}>
          <AnimatePresence mode="wait">
            {step === 'email' ? (
              <motion.div key="email"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
                <EmailStep onSent={e => { setEmail(e); setStep('reset') }}/>
              </motion.div>
            ) : (
              <motion.div key="reset"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <ResetStep email={email} onSuccess={() => setStep('done')}/>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
