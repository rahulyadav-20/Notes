import { useAuthStore } from '../store/authStore'

/* useAuth — thin wrapper over the Zustand auth store.
   Phase 2: this will validate JWT expiry and refresh tokens. */
export function useAuth() {
  const { user, isLoggedIn, isPremium, isAdmin, plan, loading, purchases, owns } = useAuthStore()
  return { user, isLoggedIn, isPremium, isAdmin, plan, loading, purchases, owns }
}
