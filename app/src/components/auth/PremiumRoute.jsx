import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

/** Redirects to /upgrade if user does not have any active purchases. */
export default function PremiumRoute({ children }) {
  const { isLoggedIn, isPremium, loading, purchasesLoading } = useAuth()
  if (loading || purchasesLoading) return null   // wait for both auth AND purchases to resolve
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (!isPremium)  return <Navigate to="/upgrade" replace />
  return children
}
