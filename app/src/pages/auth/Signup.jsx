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

export default function Signup() {
  const navigate = useNavigate()
  const signup   = useAuthStore(s => s.signup)

  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    if (!form.name.trim())  return 'Please enter your name.'
    if (!form.email.trim()) return 'Please enter your email.'
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Please enter a valid email.'
    if (form.password.length < 6) return 'Password must be at least 6 characters.'
    if (form.password !== form.confirm) return 'Passwords do not match.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const err = validate()
    if (err) { setError(err); return }

    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    signup({ name: form.name.trim(), email: form.email.trim().toLowerCase(), password: form.password })
    setLoading(false)
    navigate('/dashboard')
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

          {/* Right — form */}
          <motion.div className="w-full lg:w-[400px] shrink-0"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}>

            <div className="bg-white border border-line rounded-2xl p-7 sm:p-9
              shadow-[0_4px_32px_rgba(18,18,58,0.07)]">

              <h1 className="text-[1.5rem] font-black text-navy mb-1">Create your account</h1>
              <p className="text-[0.82rem] text-muted mb-6">Free forever · No credit card needed</p>

              {/* Google button */}
              <button className="w-full flex items-center justify-center gap-3 px-4 py-3
                rounded-xl border-2 border-line font-bold text-[0.88rem] text-navy
                hover:bg-base2 hover:border-[#c5cae5] transition-all mb-5">
                <GoogleIcon/>
                Sign up with Google
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
                    placeholder="Min 6 characters"
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

                {error && (
                  <motion.div
                    className="flex items-center gap-2 px-4 py-3 rounded-xl
                      bg-red-50 border border-red-200 text-red-700 text-[0.8rem] font-semibold"
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
                    ⚠️ {error}
                  </motion.div>
                )}

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
          </motion.div>
        </div>
      </div>
    </div>
  )
}
