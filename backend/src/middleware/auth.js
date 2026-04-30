import jwt from 'jsonwebtoken'
import { isBlacklisted } from '../config/redis.js'

/**
 * Extracts and verifies the access JWT from either:
 *   • Authorization: Bearer <token>   (SPA / mobile)
 *   • Cookie: access_token=<token>    (SSR / httpOnly cookie)
 *
 * Attaches req.user = { id, email, role, jti } on success.
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    const token =
      (authHeader?.startsWith('Bearer ') && authHeader.slice(7)) ||
      req.cookies?.access_token

    if (!token) {
      return res.status(401).json({ error: 'Authentication required.' })
    }

    let payload
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      const msg = err.name === 'TokenExpiredError' ? 'Token expired.' : 'Invalid token.'
      return res.status(401).json({ error: msg })
    }

    // Check if this token was explicitly invalidated (logout / rotation)
    if (payload.jti && await isBlacklisted(payload.jti)) {
      return res.status(401).json({ error: 'Token has been revoked.' })
    }

    req.user = { id: payload.sub, email: payload.email, role: payload.role, jti: payload.jti }
    next()
  } catch (err) {
    next(err)
  }
}

/**
 * Like requireAuth but does NOT reject unauthenticated requests.
 * If a valid token is present, req.user is populated.
 * If no token or invalid token, req.user stays undefined and the request continues.
 * Use this for routes that serve different content based on auth state.
 */
export async function optionalAuth(req, _res, next) {
  try {
    const authHeader = req.headers.authorization
    const token =
      (authHeader?.startsWith('Bearer ') && authHeader.slice(7)) ||
      req.cookies?.access_token

    if (!token) return next()

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET)
      if (payload.jti && await isBlacklisted(payload.jti)) return next()
      req.user = { id: payload.sub, email: payload.email, role: payload.role, jti: payload.jti }
    } catch {
      // invalid/expired token — treat as guest
    }
    next()
  } catch (err) {
    next(err)
  }
}

/**
 * Must run AFTER requireAuth.
 * Allows 'premium' and 'admin' roles only.
 */
export function requirePremium(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Authentication required.' })
  if (req.user.role === 'premium' || req.user.role === 'admin') return next()
  return res.status(403).json({ error: 'Premium subscription required.' })
}

/**
 * Must run AFTER requireAuth.
 * Allows 'admin' role only.
 */
export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Authentication required.' })
  if (req.user.role === 'admin') return next()
  return res.status(403).json({ error: 'Admin access required.' })
}
