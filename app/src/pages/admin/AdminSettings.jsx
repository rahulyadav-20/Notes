import { useState } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from './AdminLayout'

function SettingRow({ label, sub, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3
      py-4 border-b border-white/5 last:border-0">
      <div>
        <div className="text-[0.85rem] font-semibold text-white/75">{label}</div>
        {sub && <div className="text-[0.7rem] text-white/30 mt-0.5">{sub}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200
        ${value ? 'bg-accent' : 'bg-white/15'}`}>
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200
        ${value ? 'left-6' : 'left-1'}`}/>
    </button>
  )
}

function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-[#0c0c1e] border border-white/10 rounded-xl px-3 py-2
        text-[0.82rem] text-white placeholder:text-white/25 outline-none
        focus:border-accent/50 transition-colors w-64"
    />
  )
}

export default function AdminSettings() {
  const [saved, setSaved] = useState(false)

  /* General */
  const [siteName,    setSiteName]    = useState('EngiNotes')
  const [tagline,     setTagline]     = useState('Master Data Engineering')
  const [maintenance, setMaintenance] = useState(false)

  /* Auth */
  const [googleAuth,   setGoogleAuth]   = useState(true)
  const [emailVerify,  setEmailVerify]  = useState(false)
  const [regOpen,      setRegOpen]      = useState(true)

  /* Content */
  const [moderation,  setModeration]  = useState(true)
  const [guestBlog,   setGuestBlog]   = useState(true)
  const [premiumNotes, setPremiumNotes] = useState(false)

  /* Pricing */
  const [monthlyPrice,   setMonthlyPrice]   = useState('299')
  const [yearlyPrice,    setYearlyPrice]    = useState('2499')
  const [lifetimePrice,  setLifetimePrice]  = useState('4999')

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <AdminLayout title="Settings">
      <div className="max-w-2xl space-y-6">

        {/* General */}
        <motion.div className="bg-[#141428] border border-white/8 rounded-2xl p-6"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <h2 className="text-[0.95rem] font-black text-white mb-4">General</h2>
          <SettingRow label="Site Name" sub="Shown in the browser tab and SEO">
            <TextInput value={siteName} onChange={setSiteName} placeholder="EngiNotes" />
          </SettingRow>
          <SettingRow label="Tagline" sub="Hero subtitle on the home page">
            <TextInput value={tagline} onChange={setTagline} placeholder="Master Data Engineering" />
          </SettingRow>
          <SettingRow label="Maintenance Mode" sub="Show a maintenance page to all non-admin visitors">
            <Toggle value={maintenance} onChange={setMaintenance} />
          </SettingRow>
        </motion.div>

        {/* Auth */}
        <motion.div className="bg-[#141428] border border-white/8 rounded-2xl p-6"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <h2 className="text-[0.95rem] font-black text-white mb-4">Authentication</h2>
          <SettingRow label="Google OAuth" sub="Allow users to sign in with Google">
            <Toggle value={googleAuth} onChange={setGoogleAuth} />
          </SettingRow>
          <SettingRow label="Email Verification" sub="Require email confirmation on signup">
            <Toggle value={emailVerify} onChange={setEmailVerify} />
          </SettingRow>
          <SettingRow label="Open Registration" sub="Allow new users to create accounts">
            <Toggle value={regOpen} onChange={setRegOpen} />
          </SettingRow>
        </motion.div>

        {/* Content */}
        <motion.div className="bg-[#141428] border border-white/8 rounded-2xl p-6"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          <h2 className="text-[0.95rem] font-black text-white mb-4">Content</h2>
          <SettingRow label="Auto-Moderation" sub="Hold new blog posts for review before publishing">
            <Toggle value={moderation} onChange={setModeration} />
          </SettingRow>
          <SettingRow label="Community Blog Submissions" sub="Let users submit interview stories and articles">
            <Toggle value={guestBlog} onChange={setGuestBlog} />
          </SettingRow>
          <SettingRow label="Lock Notes to Premium" sub="Require premium plan for all note pages">
            <Toggle value={premiumNotes} onChange={setPremiumNotes} />
          </SettingRow>
        </motion.div>

        {/* Pricing */}
        <motion.div className="bg-[#141428] border border-white/8 rounded-2xl p-6"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
          <h2 className="text-[0.95rem] font-black text-white mb-4">Pricing (₹)</h2>
          <SettingRow label="Monthly Plan" sub="Charged every month">
            <TextInput value={monthlyPrice} onChange={setMonthlyPrice} placeholder="299" />
          </SettingRow>
          <SettingRow label="Yearly Plan" sub="Charged once per year">
            <TextInput value={yearlyPrice} onChange={setYearlyPrice} placeholder="2499" />
          </SettingRow>
          <SettingRow label="Lifetime Access" sub="One-time payment">
            <TextInput value={lifetimePrice} onChange={setLifetimePrice} placeholder="4999" />
          </SettingRow>
        </motion.div>

        {/* Danger Zone */}
        <motion.div className="bg-[#141428] border border-red-500/20 rounded-2xl p-6"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
          <h2 className="text-[0.95rem] font-black text-red-400 mb-4">Danger Zone</h2>
          <SettingRow label="Clear Cache" sub="Flush Redis cache — users may see slower responses briefly">
            <button className="text-[0.75rem] font-bold px-3 py-2 rounded-xl
              bg-red-500/10 text-red-400 border border-red-500/20
              hover:bg-red-500/20 transition-colors">
              Clear Cache
            </button>
          </SettingRow>
          <SettingRow label="Export User Data" sub="Download all user records as CSV">
            <button className="text-[0.75rem] font-bold px-3 py-2 rounded-xl
              bg-white/5 text-white/50 border border-white/10
              hover:bg-white/10 transition-colors">
              Export CSV
            </button>
          </SettingRow>
        </motion.div>

        {/* Save button */}
        <div className="flex justify-end">
          <button onClick={save}
            className={`px-6 py-2.5 rounded-xl text-[0.85rem] font-bold transition-all duration-300
              ${saved
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-accent text-white hover:opacity-90'}`}>
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
