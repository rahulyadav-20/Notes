import { create } from 'zustand'
import { api } from '../api/client'

/* ─────────────────────────────────────────────────────
   Storage helpers
───────────────────────────────────────────────────── */
const STORAGE_KEY = 'enginotes_token'

const saveToken  = (token) => localStorage.setItem(STORAGE_KEY, token)
const loadToken  = ()      => localStorage.getItem(STORAGE_KEY)
const clearToken = ()      => localStorage.removeItem(STORAGE_KEY)

/* ── Derive role flags from user object ── */
function roleFlags(user) {
  const role = user?.role || 'user'
  return {
    plan:      role,
    isPremium: role === 'admin',   // no more premium role — admin only
    isAdmin:   role === 'admin',
  }
}

/* ── Initial state: rehydrate token from localStorage ── */
const initialToken = loadToken()

/* ── Shared helper: fetch purchases and flip isPremium ── */
function fetchPurchases(set, get) {
  set({ purchasesLoading: true })
  api.myPurchases()
    .then(({ data: p }) => {
      const hasPurchases =
        (p.notes?.length || 0) + (p.interviews?.length || 0) + (p.courses?.length || 0) > 0
      set(s => ({ purchases: p, isPremium: s.isAdmin || hasPurchases, purchasesLoading: false }))
    })
    .catch(() => set({ purchasesLoading: false }))
}

export const useAuthStore = create((set, get) => ({
  user:             null,
  token:            initialToken,
  plan:             'user',
  isLoggedIn:       false,
  isPremium:        false,
  isAdmin:          false,
  loading:          true,
  purchasesLoading: !!initialToken, // true on mount when token exists — cleared after myPurchases
  purchases:        { notes: [], interviews: [], courses: [] },

  /** Check if user has active access to an item */
  owns: (type, slug) => {
    const { isAdmin, purchases } = get()
    if (isAdmin) return true
    const list = purchases[type === 'note' ? 'notes' : type === 'interview' ? 'interviews' : 'courses'] || []
    return list.some(p => p.slug === slug)
  },

  /* ─────────────────────────────────────────────────
     INIT — call once on app mount to validate stored token
  ───────────────────────────────────────────────── */
  init: async () => {
    const token = loadToken()
    if (!token) { set({ loading: false, purchasesLoading: false }); return }
    try {
      const { data } = await api.getMe()
      const user = data.user
      set({ user, isLoggedIn: true, loading: false, ...roleFlags(user) })
      fetchPurchases(set, get)
    } catch {
      try {
        const { data: refreshData } = await api.refreshToken()
        saveToken(refreshData.accessToken)
        const { data } = await api.getMe()
        const user = data.user
        set({ user, token: refreshData.accessToken, isLoggedIn: true, loading: false, ...roleFlags(user) })
        fetchPurchases(set, get)
      } catch {
        clearToken()
        set({ user: null, token: null, isLoggedIn: false, loading: false, purchasesLoading: false,
              plan: 'user', isPremium: false, isAdmin: false,
              purchases: { notes: [], interviews: [], courses: [] } })
      }
    }
  },

  /* ─────────────────────────────────────────────────
     REGISTER
  ───────────────────────────────────────────────── */
  signup: async ({ name, email, password }) => {
    try {
      const { data } = await api.register({ name, email, password })
      if (data.requiresVerification) {
        return { success: true, requiresVerification: true, email: data.email }
      }
      // Fallback: if server issues token directly (e.g. future change)
      saveToken(data.accessToken)
      set({ user: data.user, token: data.accessToken, isLoggedIn: true, loading: false, ...roleFlags(data.user) })
      fetchPurchases(set, get)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.error
        || (err.code === 'ERR_NETWORK' || !err.response ? 'Cannot reach server. Is the backend running on port 4000?' : 'Registration failed. Please try again.')
      return { success: false, error: message }
    }
  },

  /* ── Verify email with OTP ── */
  verifyEmail: async ({ email, otp }) => {
    try {
      const { data } = await api.verifyEmail({ email, otp })
      saveToken(data.accessToken)
      set({ user: data.user, token: data.accessToken, isLoggedIn: true, loading: false, ...roleFlags(data.user) })
      fetchPurchases(set, get)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Verification failed.' }
    }
  },

  /* ─────────────────────────────────────────────────
     LOGIN
  ───────────────────────────────────────────────── */
  login: async ({ email, password }) => {
    try {
      const { data } = await api.login({ email, password })
      saveToken(data.accessToken)
      set({ user: data.user, token: data.accessToken, isLoggedIn: true, loading: false, ...roleFlags(data.user) })
      fetchPurchases(set, get)
      return { success: true }
    } catch (err) {
      console.error('[login] status:', err.response?.status)
      console.error('[login] data:',   err.response?.data)
      console.error('[login] code:',   err.code)
      const message = err.response?.data?.error
        || (err.code === 'ERR_NETWORK' || !err.response
          ? 'Cannot reach server — is the backend running on port 4000?'
          : `Server error (${err.response?.status}): ${JSON.stringify(err.response?.data)}`)
      return { success: false, error: message, rawData: err.response?.data }
    }
  },

  /* ─────────────────────────────────────────────────
     DEV GOOGLE LOGIN (no real OAuth needed in dev)
     role: 'user' | 'premium' | 'admin'
  ───────────────────────────────────────────────── */
  devGoogleLogin: async (role = 'user') => {
    try {
      const { data } = await api.devGoogleLogin(role)
      saveToken(data.accessToken)
      set({ user: data.user, token: data.accessToken, isLoggedIn: true, loading: false, ...roleFlags(data.user) })
      fetchPurchases(set, get)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.error || 'Dev login failed.'
      return { success: false, error: message }
    }
  },

  /* ─────────────────────────────────────────────────
     LOGIN FROM TOKEN (OAuth callback)
  ───────────────────────────────────────────────── */
  loginFromToken: async (token) => {
    saveToken(token)
    try {
      const { data } = await api.getMe()
      set({ user: data.user, token, isLoggedIn: true, loading: false, ...roleFlags(data.user) })
      fetchPurchases(set, get)
      return { success: true }
    } catch {
      clearToken()
      return { success: false, error: 'Token validation failed.' }
    }
  },

  /* ─────────────────────────────────────────────────
     LOGOUT
  ───────────────────────────────────────────────── */
  logout: async () => {
    try { await api.logout() } catch { /* ignore — clear locally regardless */ }
    clearToken()
    set({ user: null, token: null, plan: 'user', isLoggedIn: false, isPremium: false, isAdmin: false,
          purchasesLoading: false, purchases: { notes: [], interviews: [], courses: [] } })
  },

  /* ─────────────────────────────────────────────────
     UPDATE PROFILE
  ───────────────────────────────────────────────── */
  updateProfile: async (data) => {
    try {
      const { data: res } = await api.updateMe(data)
      set(s => ({ user: { ...s.user, ...res.user } }))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Update failed.' }
    }
  },

  /* ─────────────────────────────────────────────────
     UPGRADE (called after successful payment verify)
  ───────────────────────────────────────────────── */
  upgradeToPremium: () => {
    const { user } = get()
    if (!user) return
    const upgraded = { ...user, role: 'premium' }
    set({ user: upgraded, plan: 'premium', isPremium: true })
  },
}))

/* ── Listen for forced logout from API client (token refresh failed) ── */
if (typeof window !== 'undefined') {
  window.addEventListener('auth:logout', () => {
    clearToken()
    useAuthStore.setState({
      user: null, token: null, plan: 'user',
      isLoggedIn: false, isPremium: false, isAdmin: false,
      purchasesLoading: false, purchases: { notes: [], interviews: [], courses: [] },
    })
  })
}
