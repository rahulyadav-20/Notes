import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { query } from '../config/db.js'
import { blacklistToken } from '../config/redis.js'

/* ─────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────── */

const ACCESS_TTL  = 15 * 60              // 15 minutes (seconds)
const REFRESH_TTL = 7  * 24 * 60 * 60   // 7 days     (seconds)

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role, jti: uuidv4() },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TTL }
  )
}

function signRefreshToken(userId) {
  return jwt.sign(
    { sub: userId, jti: uuidv4() },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TTL }
  )
}

function setRefreshCookie(res, token) {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   REFRESH_TTL * 1000,
    path:     '/api/v1/auth',
  })
}

async function saveRefreshToken(userId, token) {
  const hash      = await bcrypt.hash(token, 10)
  const expiresAt = new Date(Date.now() + REFRESH_TTL * 1000)
  await query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
    [userId, hash, expiresAt]
  )
}

export function userPublic(user) {
  const { password_hash, ...rest } = user
  return rest
}

/* ─────────────────────────────────────────────────────
   REGISTER
───────────────────────────────────────────────────── */
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body
    console.log('[register] attempt →', email)

    // Duplicate check
    const exists = await query('SELECT id FROM users WHERE email = $1', [email])
    if (exists.rows.length) {
      return res.status(409).json({ error: 'Email already registered.' })
    }

    const password_hash = await bcrypt.hash(password, 12)
    const result = await query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, role, avatar_url, created_at`,
      [name.trim(), email.toLowerCase(), password_hash]
    )
    const user = result.rows[0]

    const accessToken  = signAccessToken(user)
    const refreshToken = signRefreshToken(user.id)
    await saveRefreshToken(user.id, refreshToken)
    setRefreshCookie(res, refreshToken)

    return res.status(201).json({ user: userPublic(user), accessToken })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   LOGIN
───────────────────────────────────────────────────── */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body
    console.log('[login] attempt →', email)

    const result = await query(
      'SELECT * FROM users WHERE email = $1 AND is_active = TRUE',
      [email.toLowerCase()]
    )
    const user = result.rows[0]

    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const accessToken  = signAccessToken(user)
    const refreshToken = signRefreshToken(user.id)
    await saveRefreshToken(user.id, refreshToken)
    setRefreshCookie(res, refreshToken)

    return res.json({ user: userPublic(user), accessToken })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   LOGOUT
───────────────────────────────────────────────────── */
export async function logout(req, res, next) {
  try {
    // Blacklist current access token
    if (req.user?.jti) {
      const payload = jwt.decode(req.headers.authorization?.slice(7) || '')
      const ttl = payload?.exp ? payload.exp - Math.floor(Date.now() / 1000) : ACCESS_TTL
      if (ttl > 0) await blacklistToken(req.user.jti, ttl)
    }

    // Remove refresh tokens for this user from DB
    await query('DELETE FROM refresh_tokens WHERE user_id = $1', [req.user.id])

    res.clearCookie('refresh_token', { path: '/api/v1/auth' })
    return res.json({ message: 'Logged out.' })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   REFRESH TOKEN
───────────────────────────────────────────────────── */
export async function refreshToken(req, res, next) {
  try {
    const token = req.cookies?.refresh_token
    if (!token) {
      return res.status(401).json({ error: 'Refresh token missing.' })
    }

    let payload
    try {
      payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    } catch {
      return res.status(401).json({ error: 'Invalid or expired refresh token.' })
    }

    // Verify token exists in DB (rotation — invalidate old one)
    const stored = await query(
      `SELECT * FROM refresh_tokens
       WHERE user_id = $1 AND expires_at > NOW()`,
      [payload.sub]
    )

    let matched = null
    for (const row of stored.rows) {
      if (await bcrypt.compare(token, row.token_hash)) {
        matched = row
        break
      }
    }

    if (!matched) {
      // Possible reuse — revoke ALL tokens for this user
      await query('DELETE FROM refresh_tokens WHERE user_id = $1', [payload.sub])
      return res.status(401).json({ error: 'Refresh token reuse detected. Please log in again.' })
    }

    // Delete old refresh token (rotation)
    await query('DELETE FROM refresh_tokens WHERE id = $1', [matched.id])

    // Load user to embed fresh role
    const userResult = await query(
      'SELECT id, name, email, role, avatar_url FROM users WHERE id = $1 AND is_active = TRUE',
      [payload.sub]
    )
    const user = userResult.rows[0]
    if (!user) return res.status(401).json({ error: 'User not found.' })

    const newAccessToken  = signAccessToken(user)
    const newRefreshToken = signRefreshToken(user.id)
    await saveRefreshToken(user.id, newRefreshToken)
    setRefreshCookie(res, newRefreshToken)

    return res.json({ accessToken: newAccessToken })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   GOOGLE OAUTH CALLBACK (called by passport strategy)
───────────────────────────────────────────────────── */
export async function googleCallback(req, res, next) {
  try {
    const user = req.user  // set by passport
    if (!user) return res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`)

    const accessToken  = signAccessToken(user)
    const refreshToken = signRefreshToken(user.id)
    await saveRefreshToken(user.id, refreshToken)
    setRefreshCookie(res, refreshToken)

    return res.redirect(
      `${process.env.CLIENT_URL}/auth/callback?token=${accessToken}`
    )
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   CHANGE PASSWORD
   PATCH /api/v1/auth/change-password
   Body: { currentPassword, newPassword }
───────────────────────────────────────────────────── */
export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body

    const result = await query('SELECT * FROM users WHERE id = $1 AND is_active = TRUE', [req.user.id])
    const user = result.rows[0]
    if (!user) return res.status(404).json({ error: 'User not found.' })

    if (!user.password_hash) {
      return res.status(400).json({ error: 'This account uses Google Sign-In. No password to change.' })
    }

    const valid = await bcrypt.compare(currentPassword, user.password_hash)
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect.' })

    const newHash = await bcrypt.hash(newPassword, 12)
    await query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [newHash, user.id])

    // Invalidate all existing refresh tokens — force re-login on other devices
    await query('DELETE FROM refresh_tokens WHERE user_id = $1', [user.id])

    return res.json({ message: 'Password updated successfully.' })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   DEV-ONLY: Dummy Google login
   POST /api/v1/auth/dev/google
   Body: { role?: 'user' | 'premium' | 'admin' }

   Signs you in as a pre-seeded test user — no Google
   credentials needed.  Blocked in production.
───────────────────────────────────────────────────── */
export async function devGoogleLogin(req, res, next) {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({ error: 'Not found.' })
    }

    const role = ['user', 'premium', 'admin'].includes(req.body?.role)
      ? req.body.role
      : 'user'

    // Find or create the dev test user for this role
    const emailMap = {
      user:    'dev.user@test.local',
      premium: 'dev.premium@test.local',
      admin:   'dev.admin@test.local',
    }
    const nameMap = {
      user:    'Dev User',
      premium: 'Dev Premium',
      admin:   'Dev Admin',
    }
    const email = emailMap[role]

    let result = await query(
      'SELECT * FROM users WHERE email = $1 AND is_active = TRUE',
      [email]
    )

    let user = result.rows[0]
    if (!user) {
      // Auto-create on first use (seed script also does this, but this is a fallback)
      result = await query(
        `INSERT INTO users (name, email, role, google_id)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role
         RETURNING *`,
        [nameMap[role], email, role, `dev_google_${role}`]
      )
      user = result.rows[0]
    }

    const accessToken  = signAccessToken(user)
    const refreshToken = signRefreshToken(user.id)
    await saveRefreshToken(user.id, refreshToken)
    setRefreshCookie(res, refreshToken)

    return res.json({
      user: userPublic(user),
      accessToken,
      _devNote: `Signed in as ${role} (dev only — no real Google auth)`,
    })
  } catch (err) {
    next(err)
  }
}
