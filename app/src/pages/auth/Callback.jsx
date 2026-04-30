import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

/**
 * /auth/callback
 *
 * The backend Google OAuth flow redirects here after success:
 *   GET /auth/callback?token=<accessToken>
 *
 * We grab the token from the query-string, hand it to authStore.loginFromToken()
 * which validates it via GET /users/me, then redirect to /dashboard.
 *
 * On failure (missing token, invalid token) redirect to /login with ?error=1
 * so Login.jsx can show a generic "Google sign-in failed" message.
 */
export default function Callback() {
  const navigate       = useNavigate()
  const [params]       = useSearchParams()
  const loginFromToken = useAuthStore(s => s.loginFromToken)
  const ran            = useRef(false)   // StrictMode guard — run only once

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const token = params.get('token')
    if (!token) {
      navigate('/login?error=oauth', { replace: true })
      return
    }

    loginFromToken(token).then(result => {
      if (result.success) navigate('/dashboard', { replace: true })
      else                navigate('/login?error=oauth', { replace: true })
    })
  }, [])   // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-[#0c0c1e] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-accent animate-spin"/>
        <p className="text-[0.82rem] text-white/50">Signing you in…</p>
      </div>
    </div>
  )
}
