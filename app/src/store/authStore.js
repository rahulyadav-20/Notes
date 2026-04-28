import { create } from 'zustand'

/* ── Demo accounts for testing (Phase 1 — no backend) ── */
export const DEMO_ACCOUNTS = {
  'free@demo.com':         { password: 'demo123',  plan: 'free'    },
  'premium@demo.com':      { password: 'demo123',  plan: 'premium' },
  'admin@enginotes.com':   { password: 'admin123', plan: 'admin'   },
}

/* ── Persist helpers ── */
const STORAGE_KEY = 'enginotes_auth'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveToStorage(user, token, plan) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token, plan })) }
  catch { /* ignore */ }
}

function clearStorage() {
  try { localStorage.removeItem(STORAGE_KEY) }
  catch { /* ignore */ }
}

/* ── Rehydrate from localStorage on page load ── */
const persisted = loadFromStorage()

export const useAuthStore = create((set, get) => ({
  user:      persisted?.user  || null,
  token:     persisted?.token || null,
  plan:      persisted?.plan  || 'free',   // 'free' | 'premium' | 'admin'
  isLoggedIn: Boolean(persisted?.user),
  isPremium:  persisted?.plan === 'premium' || persisted?.plan === 'admin',
  isAdmin:    persisted?.plan === 'admin',

  /* ── Mock sign-up ── */
  signup: ({ name, email, password }) => {
    // In Phase 2 this calls POST /api/auth/signup
    const mockUser = { id: Date.now(), name, email, avatar: name.slice(0, 2).toUpperCase() }
    const mockToken = `mock_${Date.now()}`
    const plan = email.includes('premium') ? 'premium' : 'free'
    saveToStorage(mockUser, mockToken, plan)
    set({
      user: mockUser,
      token: mockToken,
      plan,
      isLoggedIn: true,
      isPremium: plan === 'premium' || plan === 'admin',
      isAdmin: plan === 'admin',
    })
    return { success: true }
  },

  /* ── Mock sign-in ── */
  login: ({ email, password }) => {
    // Demo account check
    const demo = DEMO_ACCOUNTS[email]
    if (demo && demo.password !== password) {
      return { success: false, error: 'Incorrect password for demo account.' }
    }
    // In Phase 2 this calls POST /api/auth/login and validates JWT
    const mockUser = {
      id: Date.now(),
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase()),
      email,
      avatar: email.slice(0, 2).toUpperCase(),
    }
    const mockToken = `mock_${Date.now()}`
    const plan = demo?.plan || (email.includes('premium') ? 'premium' : 'free')
    saveToStorage(mockUser, mockToken, plan)
    set({
      user: mockUser,
      token: mockToken,
      plan,
      isLoggedIn: true,
      isPremium: plan === 'premium' || plan === 'admin',
      isAdmin: plan === 'admin',
    })
    return { success: true }
  },

  /* ── Logout ── */
  logout: () => {
    clearStorage()
    set({ user: null, token: null, plan: 'free', isLoggedIn: false, isPremium: false, isAdmin: false })
  },

  /* ── Upgrade plan (Phase 2: after Razorpay payment) ── */
  upgradeToPremium: () => {
    const { user, token } = get()
    if (!user) return
    saveToStorage(user, token, 'premium')
    set({ plan: 'premium', isPremium: true })
  },
}))
