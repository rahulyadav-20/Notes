import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

/** Redirects to /login if user is not authenticated. */
export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return children
}
