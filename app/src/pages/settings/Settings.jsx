import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/layout/Navbar'
import { useAuth } from '../../hooks/useAuth'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import { api } from '../../api/client'

/* ── Avatar ── */
const AVATAR_COLORS = [
  'linear-gradient(135deg,#f5820a,#ec4899)',
  'linear-gradient(135deg,#4A90D9,#5DB85B)',
  'linear-gradient(135deg,#6366F1,#8B5CF6)',
  'linear-gradient(135deg,#E25A1C,#F5A623)',
  'linear-gradient(135deg,#10B981,#0EA5E9)',
  'linear-gradient(135deg,#EC4899,#F59E0B)',
  'linear-gradient(135deg,#14B8A6,#6366F1)',
  'linear-gradient(135deg,#7C3AED,#EC4899)',
]

function Avatar({ user, size = 'lg' }) {
  const dim = size === 'lg' ? 'w-20 h-20 text-[1.6rem]' : 'w-12 h-12 text-[1rem]'
  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U'
  const bg = user?.avatar_url?.startsWith('gradient:')
    ? user.avatar_url.slice(9)
    : AVATAR_COLORS[0]
  return (
    <div className={`${dim} rounded-2xl flex items-center justify-center font-black text-white shrink-0`}
      style={{ background: bg }}>
      {user?.avatar_url && !user.avatar_url.startsWith('gradient:')
        ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover rounded-2xl"/>
        : initials
      }
    </div>
  )
}

/* ── Toast ── */
function Toast({ msg, type }) {
  if (!msg) return null
  const colors = type === 'success'
    ? 'bg-green-50 border-green-200 text-green-800'
    : 'bg-red-50 border-red-200 text-red-700'
  return (
    <motion.div className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-[0.82rem] font-semibold ${colors}`}
      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      {type === 'success' ? '✓' : '⚠'} {msg}
    </motion.div>
  )
}

/* ── Input ── */
function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[0.78rem] font-bold text-navy">{label}</label>
      {children}
      {hint && <p className="text-[0.68rem] text-muted">{hint}</p>}
    </div>
  )
}

function Input({ ...props }) {
  return (
    <input {...props}
      className="w-full px-4 py-3 rounded-xl border border-line text-[0.88rem] text-navy
        placeholder:text-muted/40 outline-none bg-white
        focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all
        disabled:bg-base disabled:text-muted disabled:cursor-not-allowed" />
  )
}

/* ── Section wrapper ── */
function Card({ title, desc, children }) {
  return (
    <div className="bg-white rounded-2xl border border-line overflow-hidden">
      <div className="px-6 py-5 border-b border-line">
        <h2 className="text-[0.95rem] font-extrabold text-navy">{title}</h2>
        {desc && <p className="text-[0.78rem] text-muted mt-0.5">{desc}</p>}
      </div>
      <div className="px-6 py-6 flex flex-col gap-5">{children}</div>
    </div>
  )
}

/* ── Save button ── */
function SaveBtn({ loading, label = 'Save changes' }) {
  return (
    <button type="submit" disabled={loading}
      className="px-5 py-2.5 rounded-xl font-bold text-[0.85rem] text-white
        bg-gradient-to-br from-accent to-accent2
        shadow-[0_4px_14px_rgba(245,130,10,0.25)]
        hover:opacity-90 transition-opacity disabled:opacity-60 self-start">
      {loading
        ? <span className="flex items-center gap-2">
            <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            Saving…
          </span>
        : label}
    </button>
  )
}

/* ═══════════════════════════════════════════════════════
   SECTIONS
═══════════════════════════════════════════════════════ */

/* ── Profile section ── */
function ProfileSection({ user, updateProfile }) {
  const [name, setName]     = useState(user?.name || '')
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatar_url?.startsWith('gradient:') ? '' : (user?.avatar_url || '')
  )
  const [gradient, setGradient] = useState(
    user?.avatar_url?.startsWith('gradient:') ? user.avatar_url.slice(9) : AVATAR_COLORS[0]
  )
  const [loading, setLoading] = useState(false)
  const [toast, setToast]   = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (name.trim().length < 2) { showToast('Name must be at least 2 characters.', 'error'); return }
    setLoading(true)
    const payload = {
      name: name.trim(),
      avatar_url: avatarUrl.trim() || `gradient:${gradient}`,
    }
    const result = await updateProfile(payload)
    setLoading(false)
    if (result.success) showToast('Profile updated successfully.')
    else showToast(result.error, 'error')
  }

  const previewUser = { ...user, name, avatar_url: avatarUrl.trim() || `gradient:${gradient}` }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Card title="Profile" desc="Update your name and avatar.">

        {/* Avatar preview + color picker */}
        <div className="flex items-start gap-5 flex-wrap">
          <Avatar user={previewUser} size="lg"/>
          <div className="flex-1 min-w-[200px]">
            <p className="text-[0.75rem] font-bold text-navy mb-2">Avatar color</p>
            <div className="flex gap-2 flex-wrap mb-3">
              {AVATAR_COLORS.map(g => (
                <button key={g} type="button"
                  onClick={() => { setGradient(g); setAvatarUrl('') }}
                  className={`w-7 h-7 rounded-lg transition-all
                    ${gradient === g && !avatarUrl ? 'ring-2 ring-offset-2 ring-accent scale-110' : 'hover:scale-110'}`}
                  style={{ background: g }}/>
              ))}
            </div>
            <p className="text-[0.68rem] text-muted">Or paste an image URL below to use a photo.</p>
          </div>
        </div>

        <Field label="Avatar URL" hint="Leave empty to use the colored initials above.">
          <Input type="url" placeholder="https://example.com/photo.jpg"
            value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)}/>
        </Field>

        <Field label="Full name">
          <Input type="text" placeholder="Your name" value={name}
            onChange={e => setName(e.target.value)} required/>
        </Field>

        <Field label="Email address" hint="Email cannot be changed. Contact support if needed.">
          <Input type="email" value={user?.email || ''} disabled/>
        </Field>

        <Field label="Member since">
          <Input type="text"
            value={user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
            disabled/>
        </Field>

        <AnimatePresence>{toast && <Toast msg={toast.msg} type={toast.type}/>}</AnimatePresence>
        <SaveBtn loading={loading}/>
      </Card>
    </form>
  )
}

/* ── Security section ── */
function SecuritySection({ user }) {
  const [form, setForm]   = useState({ current: '', next: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const isOAuth = !user?.has_password && user?.google_id

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.next.length < 8) { showToast('New password must be at least 8 characters.', 'error'); return }
    if (form.next !== form.confirm) { showToast('New passwords do not match.', 'error'); return }
    setLoading(true)
    try {
      await api.changePassword({ currentPassword: form.current, newPassword: form.next })
      setForm({ current: '', next: '', confirm: '' })
      showToast('Password changed. Other devices will be signed out.')
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to change password.', 'error')
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <Card title="Password" desc="Change your login password.">
        {isOAuth
          ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-[1.2rem]">ℹ️</span>
              <p className="text-[0.82rem] text-blue-800 font-medium">
                You signed in with Google. Password login is not enabled for this account.
              </p>
            </div>
          )
          : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Field label="Current password">
                <Input type="password" placeholder="••••••••" value={form.current}
                  onChange={e => set('current', e.target.value)} required/>
              </Field>
              <Field label="New password" hint="Minimum 8 characters.">
                <Input type="password" placeholder="••••••••" value={form.next}
                  onChange={e => set('next', e.target.value)} required/>
              </Field>
              <Field label="Confirm new password">
                <Input type="password" placeholder="••••••••" value={form.confirm}
                  onChange={e => set('confirm', e.target.value)} required/>
              </Field>
              <AnimatePresence>{toast && <Toast msg={toast.msg} type={toast.type}/>}</AnimatePresence>
              <SaveBtn loading={loading} label="Change password"/>
            </form>
          )
        }
      </Card>

      <Card title="Login methods" desc="Accounts linked to your profile.">
        <div className="flex flex-col gap-3">
          {/* Email/Password row */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-base border border-line">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-navy/10 flex items-center justify-center text-navy text-[0.9rem] font-black">
                @
              </div>
              <div>
                <p className="text-[0.82rem] font-bold text-navy">Email & Password</p>
                <p className="text-[0.68rem] text-muted">{user?.email}</p>
              </div>
            </div>
            <span className={`text-[0.62rem] font-bold px-2 py-0.5 rounded-full
              ${isOAuth ? 'bg-base2 text-muted border border-line' : 'bg-green-100 text-green-700 border border-green-200'}`}>
              {isOAuth ? 'Not set' : 'Active'}
            </span>
          </div>

          {/* Google row */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-base border border-line">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-line flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <div>
                <p className="text-[0.82rem] font-bold text-navy">Google</p>
                <p className="text-[0.68rem] text-muted">
                  {user?.google_id ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            <span className={`text-[0.62rem] font-bold px-2 py-0.5 rounded-full
              ${user?.google_id ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-base2 text-muted border border-line'}`}>
              {user?.google_id ? 'Active' : 'Not linked'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}

/* ── Plan section ── */
function PlanSection({ user, isPremium, purchases, navigate }) {
  const freeFeatures    = ['Free notes (2 parts per topic)', '30+ free interview questions', 'Blog access']
  const activeFeatures  = ['All purchased note parts unlocked', 'Purchased interview packs', 'Enrolled courses', 'Valid for 2 years per item']

  const ownedCount = (purchases?.notes?.length || 0) + (purchases?.interviews?.length || 0) + (purchases?.courses?.length || 0)

  return (
    <div className="flex flex-col gap-6">
      <Card title="Current plan" desc="Your purchase status.">
        <div className="flex items-start gap-4 p-4 rounded-xl bg-base border border-line">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0
            ${isPremium ? 'bg-green-50' : 'bg-base2'}`}>
            {isPremium ? '✓' : '🆓'}
          </div>
          <div className="flex-1">
            <p className="text-[0.92rem] font-extrabold text-navy">
              {isPremium ? 'Active Buyer' : 'Free Plan'}
            </p>
            <p className="text-[0.75rem] text-muted mt-0.5">
              {isPremium
                ? `${ownedCount} item${ownedCount !== 1 ? 's' : ''} owned — access valid for 2 years from purchase`
                : 'Limited access to free content'}
            </p>
          </div>
          <span className={`text-[0.62rem] font-bold px-2.5 py-1 rounded-full border self-center
            ${isPremium ? 'bg-green-50 text-green-700 border-green-200' : 'bg-base2 text-muted border-line'}`}>
            {isPremium ? 'Active' : 'Free'}
          </span>
        </div>

        <div>
          <p className="text-[0.75rem] font-bold text-navy mb-3">
            {isPremium ? 'Your access' : 'Free plan includes'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(isPremium ? activeFeatures : freeFeatures).map(f => (
              <div key={f} className="flex items-center gap-2 text-[0.78rem] text-navy/70">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke={isPremium ? '#10B981' : '#6b7280'} strokeWidth="2.5" strokeLinecap="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                {f}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="relative overflow-hidden rounded-2xl bg-[#0f0f23] p-6">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 100% at 0% 50%, rgba(245,130,10,0.18) 0%, transparent 65%)' }}/>
        <div className="relative">
          <p className="text-[0.62rem] font-bold uppercase tracking-[2.5px] text-accent mb-2">
            {isPremium ? 'Buy more content' : 'Get started'}
          </p>
          <h3 className="text-[1.15rem] font-black text-white mb-1">
            {isPremium ? 'Buy more notes, courses & interview packs' : 'Buy individual notes & courses'}
          </h3>
          <p className="text-[0.78rem] text-white/40 mb-4 leading-relaxed">
            Notes from ₹99 · Interview packs from ₹99 · Courses from ₹999 · Valid 2 years per item.
          </p>
          <button
            onClick={() => navigate('/upgrade')}
            className="px-5 py-2.5 rounded-xl font-bold text-[0.85rem] text-white
              bg-gradient-to-br from-accent to-accent2
              shadow-[0_4px_14px_rgba(245,130,10,0.35)] hover:opacity-90 transition-opacity">
            Browse & Buy →
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Appearance section ── */
const THEMES = [
  {
    id: 'light',
    label: 'Light',
    icon: '☀️',
    desc: 'Clean white interface — easy on the eyes in bright environments.',
    preview: { bg: '#f0f2fa', card: '#ffffff', text: '#12123a', accent: '#f5820a', border: '#e2e5f0' },
  },
  {
    id: 'dark',
    label: 'Dark',
    icon: '🌙',
    desc: 'Dark background — great for night reading and low-light work.',
    preview: { bg: '#0d0d1a', card: '#1c1c30', text: '#dde3f0', accent: '#f5820a', border: '#1e2040' },
  },
  {
    id: 'system',
    label: 'System',
    icon: '💻',
    desc: 'Automatically follows your OS light/dark setting.',
    preview: null,
  },
]

function ThemePreview({ colors }) {
  if (!colors) {
    return (
      <div className="w-full h-[88px] rounded-xl border border-line flex items-center
        justify-center text-[0.72rem] text-muted font-semibold"
        style={{ background: 'linear-gradient(135deg, #f0f2fa 50%, #0d0d1a 50%)' }}>
        <span className="bg-white/80 dark:bg-black/50 px-2 py-0.5 rounded text-navy text-[0.65rem] font-bold backdrop-blur-sm">
          Follows OS
        </span>
      </div>
    )
  }
  return (
    <div className="w-full h-[88px] rounded-xl overflow-hidden border"
      style={{ background: colors.bg, borderColor: colors.border }}>
      <div className="p-2.5 flex flex-col gap-1.5">
        {/* Fake navbar */}
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: colors.accent }}/>
          <div className="h-1.5 w-12 rounded-full opacity-40" style={{ background: colors.text }}/>
          <div className="h-1.5 w-8 rounded-full opacity-25 ml-auto" style={{ background: colors.text }}/>
        </div>
        {/* Fake card */}
        <div className="rounded-lg p-2 border" style={{ background: colors.card, borderColor: colors.border }}>
          <div className="h-1.5 w-16 rounded-full mb-1.5" style={{ background: colors.text, opacity: 0.7 }}/>
          <div className="h-1 w-24 rounded-full" style={{ background: colors.text, opacity: 0.35 }}/>
        </div>
        {/* Fake button */}
        <div className="h-4 w-14 rounded-md self-start" style={{ background: colors.accent, opacity: 0.9 }}/>
      </div>
    </div>
  )
}

function AppearanceSection() {
  const { theme, setTheme } = useThemeStore()

  const handleSet = (id) => {
    // Add transition class briefly for smooth switch
    document.documentElement.classList.add('theme-transitioning')
    setTheme(id)
    setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 400)
  }

  return (
    <div className="flex flex-col gap-6">
      <Card title="Theme" desc="Choose how EngiNotes looks for you. Stored in your browser.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {THEMES.map(t => (
            <button key={t.id} type="button"
              onClick={() => handleSet(t.id)}
              className={`flex flex-col gap-3 p-3 rounded-xl border-2 text-left transition-all
                ${theme === t.id
                  ? 'border-accent bg-accent/5'
                  : 'border-line bg-base hover:border-[var(--color-line-hover)]'}`}>

              <ThemePreview colors={t.preview}/>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[1rem]">{t.icon}</span>
                  <span className="text-[0.85rem] font-extrabold text-navy">{t.label}</span>
                </div>
                {theme === t.id && (
                  <motion.div className="w-4 h-4 rounded-full bg-accent flex items-center justify-center"
                    initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none"
                      stroke="white" strokeWidth="3.5" strokeLinecap="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  </motion.div>
                )}
              </div>
              <p className="text-[0.7rem] text-muted leading-relaxed">{t.desc}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card title="Display" desc="Adjust how content is presented.">
        <div className="flex flex-col gap-4">
          {[
            { label: 'Reduce motion', desc: 'Minimize animations and transitions throughout the app.', key: 'reduceMotion' },
            { label: 'Compact mode', desc: 'Use tighter spacing in lists and tables.', key: 'compact' },
          ].map(opt => (
            <label key={opt.key}
              className="flex items-center justify-between gap-4 cursor-pointer group">
              <div>
                <p className="text-[0.85rem] font-bold text-navy">{opt.label}</p>
                <p className="text-[0.72rem] text-muted">{opt.desc}</p>
              </div>
              {/* Toggle — UI-only for now, wires to localStorage in future */}
              <div className="relative shrink-0">
                <input type="checkbox" className="sr-only peer"/>
                <div className="w-10 h-5.5 bg-line rounded-full peer
                  peer-checked:bg-accent transition-colors"/>
                <div className="absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow
                  transition-transform peer-checked:translate-x-4.5"/>
              </div>
            </label>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ── Danger Zone section ── */
function DangerSection({ logout, navigate }) {
  const [showModal, setShowModal] = useState(false)
  const [password, setPassword]  = useState('')
  const [confirm, setConfirm]    = useState('')
  const [loading, setLoading]    = useState(false)
  const [error, setError]        = useState('')

  const handleDelete = async (e) => {
    e.preventDefault()
    if (confirm !== 'delete my account') {
      setError('Please type the confirmation text exactly.')
      return
    }
    setLoading(true)
    try {
      await api.deleteAccount({ password: password || undefined })
      logout()
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete account.')
      setLoading(false)
    }
  }

  return (
    <>
      <Card title="Danger zone" desc="These actions are permanent and cannot be undone.">
        <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-red-200 bg-red-50 flex-wrap">
          <div>
            <p className="text-[0.85rem] font-bold text-red-800">Delete account</p>
            <p className="text-[0.75rem] text-red-700/70 mt-0.5 leading-relaxed">
              Permanently remove your account and all associated data. This cannot be reversed.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl text-[0.8rem] font-bold text-red-600
              border-2 border-red-300 hover:bg-red-100 transition-colors shrink-0">
            Delete account
          </button>
        </div>
      </Card>

      {/* Confirmation modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => { setShowModal(false); setError(''); setPassword(''); setConfirm('') }}>
            <motion.div className="bg-white rounded-2xl p-7 w-full max-w-[440px] shadow-2xl"
              initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 16 }}
              onClick={e => e.stopPropagation()}>

              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-[1.3rem]">
                ⚠️
              </div>
              <h3 className="text-[1.1rem] font-black text-navy mb-1">Delete your account?</h3>
              <p className="text-[0.8rem] text-muted mb-5 leading-relaxed">
                All your data, bookmarks, and progress will be permanently erased.
                This action <strong>cannot be undone</strong>.
              </p>

              <form onSubmit={handleDelete} className="flex flex-col gap-4">
                <Field label="Password (if using email login)">
                  <Input type="password" placeholder="Leave blank if signed in with Google"
                    value={password} onChange={e => setPassword(e.target.value)}/>
                </Field>

                <Field label={<>Type <code className="font-mono bg-red-50 text-red-700 px-1.5 py-0.5 rounded text-[0.75rem]">delete my account</code> to confirm</>}>
                  <Input type="text" placeholder="delete my account"
                    value={confirm} onChange={e => { setConfirm(e.target.value); setError('') }}/>
                </Field>

                {error && (
                  <p className="text-[0.78rem] text-red-600 font-semibold">⚠ {error}</p>
                )}

                <div className="flex gap-3 mt-1">
                  <button type="submit" disabled={loading || confirm !== 'delete my account'}
                    className="flex-1 py-2.5 rounded-xl font-bold text-[0.85rem] text-white
                      bg-red-500 hover:bg-red-600 transition-colors
                      disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'Deleting…' : 'Yes, delete my account'}
                  </button>
                  <button type="button"
                    onClick={() => { setShowModal(false); setError(''); setPassword(''); setConfirm('') }}
                    className="flex-1 py-2.5 rounded-xl font-bold text-[0.85rem] text-navy
                      border border-line hover:bg-base2 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN SETTINGS PAGE
═══════════════════════════════════════════════════════ */
const TABS = [
  { id: 'profile',    icon: '👤', label: 'Profile'      },
  { id: 'security',   icon: '🔒', label: 'Security'     },
  { id: 'plan',       icon: '⭐', label: 'My Plan'      },
  { id: 'appearance', icon: '🎨', label: 'Appearance'   },
  { id: 'danger',     icon: '⚠️',  label: 'Danger Zone'  },
]

export default function Settings() {
  const navigate     = useNavigate()
  const { user, isPremium, purchases } = useAuth()
  const { logout, updateProfile } = useAuthStore()
  const { theme } = useThemeStore()
  const [activeTab, setActiveTab] = useState('profile')

  if (!user) { navigate('/login'); return null }

  return (
    <>
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-line py-6">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-center gap-3 mb-1">
            <button onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 text-[0.78rem] font-bold text-muted
                hover:text-navy transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Dashboard
            </button>
          </div>
          <h1 className="text-[1.5rem] font-black text-navy">Account Settings</h1>
          <p className="text-[0.82rem] text-muted mt-0.5">Manage your profile, security, and subscription.</p>
        </div>
      </div>

      {/* Body */}
      <div className="bg-base min-h-screen py-8 lg:py-12">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex gap-8 items-start flex-col lg:flex-row">

            {/* ── Sidebar nav ── */}
            <aside className="w-full lg:w-[220px] shrink-0 lg:sticky lg:top-[90px]">
              <nav className="bg-white rounded-2xl border border-line overflow-hidden">
                {/* User mini-profile */}
                <div className="p-4 border-b border-line flex items-center gap-3">
                  <Avatar user={user} size="sm"/>
                  <div className="min-w-0">
                    <p className="text-[0.82rem] font-extrabold text-navy truncate">{user.name}</p>
                    <p className="text-[0.65rem] text-muted truncate">{user.email}</p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="p-1.5 flex flex-col gap-0.5">
                  {TABS.map(tab => (
                    <button key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                        text-[0.82rem] font-bold transition-all text-left
                        ${activeTab === tab.id
                          ? 'bg-accent/10 text-accent'
                          : 'text-muted hover:bg-base2 hover:text-navy'
                        }`}>
                      <span className="text-[1rem] shrink-0">{tab.icon}</span>
                      <span className="flex-1">{tab.label}</span>
                      {tab.id === 'appearance' && (
                        <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded bg-base2 text-muted capitalize">
                          {theme}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Sign out */}
                <div className="p-3 border-t border-line">
                  <button onClick={() => { logout(); navigate('/') }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                      text-[0.82rem] font-bold text-red-500 hover:bg-red-50 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                    </svg>
                    Sign out
                  </button>
                </div>
              </nav>
            </aside>

            {/* ── Main content ── */}
            <main className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>

                  {activeTab === 'profile'    && <ProfileSection user={user} updateProfile={updateProfile}/>}
                  {activeTab === 'security'   && <SecuritySection user={user}/>}
                  {activeTab === 'plan'       && <PlanSection user={user} isPremium={isPremium} purchases={purchases} navigate={navigate}/>}
                  {activeTab === 'appearance' && <AppearanceSection/>}
                  {activeTab === 'danger'     && <DangerSection logout={logout} navigate={navigate}/>}

                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}
