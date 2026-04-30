import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

/** Redirects to /upgrade if user does not have a premium subscription. */
export default function PremiumRoute({ children }) {
  const { isLoggedIn, isPremium, loading } = useAuth()
  if (loading) return null
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (!isPremium)  return <Navigate to="/upgrade" replace />
  return children
}
