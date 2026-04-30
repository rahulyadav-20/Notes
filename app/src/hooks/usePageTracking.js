import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { api } from '../api/client'

/* Generates (or reuses) a random session ID stored in sessionStorage.
   Lets the backend count unique visitors per session. */
function getSessionId() {
  const KEY = 'en_sid'
  let sid = sessionStorage.getItem(KEY)
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36)
    sessionStorage.setItem(KEY, sid)
  }
  return sid
}

/**
 * Call this hook once at the app root.
 * It fires a pageview event every time the route changes.
 * Silently no-ops if the request fails.
 */
export function usePageTracking() {
  const { pathname } = useLocation()
  const prevPath     = useRef(null)

  useEffect(() => {
    // Don't track the same path twice in a row (strict-mode double effect)
    if (pathname === prevPath.current) return
    prevPath.current = pathname

    // Skip admin pages and API paths
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) return

    api.trackPageview({
      path:      pathname,
      sessionId: getSessionId(),
      referrer:  document.referrer || undefined,
    }).catch(() => {}) // silently ignore errors
  }, [pathname])
}
