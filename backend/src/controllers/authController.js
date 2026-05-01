import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { query } from '../config/db.js'
import { blacklistToken } from '../config/redis.js'
import { sendOtpEmail, sendPasswordResetEmail } from '../services/emailService.js'

/* ─────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────── */

const ACCESS_TTL  = 15 * 60              // 15 minutes (seconds)
const REFRESH_TTL = 7  * 24 * 60 * 60   // 7 days     (seconds)

const MAX_FAILED_ATTEMPTS = 5            // lock after 5 wrong passwords
const LOCK_DURATION_MS    = 15 * 60 * 1000  // locked for 15 minutes
const OTP_TTL_MS          = 10 * 60 * 1000  // OTP valid for 10 minutes

function generateOtp() {
  return String(Math.floor(100_000 + Math.random() * 900_000))
}

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
   REGISTER  — creates account + sends OTP, no JWT yet
───────────────────────────────────────────────────── */
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body
    console.log('[register] attempt →', email)

    const exists = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()])
    if (exists.rows.length) {
      return res.status(409).json({ error: 'Email already registered.' })
    }

    const password_hash = await bcrypt.hash(password, 12)
    const otp           = generateOtp()
    const otp_expires   = new Date(Date.now() + OTP_TTL_MS)

    await query(
      `INSERT INTO users (name, email, password_hash, otp_code, otp_expires_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [name.trim(), email.toLowerCase(), password_hash, otp, otp_expires]
    )

    await sendOtpEmail({ to: email, name: name.trim(), otp })

    return res.status(201).json({
      requiresVerification: true,
      email: email.toLowerCase(),
      message: 'Account created. Check your email for the 6-digit verification code.',
    })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   VERIFY EMAIL  — POST /api/v1/auth/verify-email
   Body: { email, otp }
───────────────────────────────────────────────────── */
export async function verifyEmail(req, res, next) {
  try {
    const { email, otp } = req.body

    const result = await query(
      'SELECT * FROM users WHERE email = $1 AND is_active = TRUE',
      [email.toLowerCase()]
    )
    const user = result.rows[0]
    if (!user) return res.status(404).json({ error: 'Account not found.' })

    if (user.email_verified) {
      // Already verified — just issue tokens
      const accessToken  = signAccessToken(user)
      const refreshToken = signRefreshToken(user.id)
      await saveRefreshToken(user.id, refreshToken)
      setRefreshCookie(res, refreshToken)
      return res.json({ user: userPublic(user), accessToken })
    }

    if (!user.otp_code || user.otp_code !== String(otp).trim()) {
      return res.status(400).json({ error: 'Incorrect verification code.' })
    }

    if (!user.otp_expires_at || new Date(user.otp_expires_at) < new Date()) {
      return res.status(400).json({ error: 'Verification code has expired. Request a new one.' })
    }

    // Mark verified and clear OTP fields
    const updated = await query(
      `UPDATE users
       SET email_verified = TRUE, otp_code = NULL, otp_expires_at = NULL, updated_at = NOW()
       WHERE id = $1
       RETURNING id, name, email, role, avatar_url, created_at`,
      [user.id]
    )
    const verifiedUser = updated.rows[0]

    const accessToken  = signAccessToken(verifiedUser)
    const refreshToken = signRefreshToken(verifiedUser.id)
    await saveRefreshToken(verifiedUser.id, refreshToken)
    setRefreshCookie(res, refreshToken)

    return res.json({ user: userPublic(verifiedUser), accessToken })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   RESEND OTP  — POST /api/v1/auth/resend-otp
   Body: { email }
───────────────────────────────────────────────────── */
export async function resendOtp(req, res, next) {
  try {
    const { email } = req.body

    const result = await query(
      'SELECT * FROM users WHERE email = $1 AND is_active = TRUE',
      [email.toLowerCase()]
    )
    const user = result.rows[0]
    if (!user) return res.status(404).json({ error: 'Account not found.' })
    if (user.email_verified) return res.json({ message: 'Email already verified.' })

    // Rate-limit resends: only if the old OTP has used at least half its TTL
    const halfTtl = OTP_TTL_MS / 2
    if (user.otp_expires_at && new Date(user.otp_expires_at) > new Date(Date.now() + halfTtl)) {
      const secsLeft = Math.ceil((new Date(user.otp_expires_at) - Date.now()) / 1000) - (halfTtl / 1000)
      return res.status(429).json({
        error: `Please wait ${Math.ceil(secsLeft / 60)} minute(s) before requesting a new code.`,
      })
    }

    const otp         = generateOtp()
    const otp_expires = new Date(Date.now() + OTP_TTL_MS)

    await query(
      `UPDATE users SET otp_code = $1, otp_expires_at = $2, updated_at = NOW() WHERE id = $3`,
      [otp, otp_expires, user.id]
    )

    await sendOtpEmail({ to: email, name: user.name, otp })

    return res.json({ message: 'New verification code sent.' })
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

    // Unknown email — same error as wrong password (prevents user enumeration)
    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    // Email not yet verified
    if (!user.email_verified) {
      return res.status(403).json({
        error: 'Please verify your email before logging in.',
        requiresVerification: true,
        email: user.email,
      })
    }

    // Account locked?
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const minutesLeft = Math.ceil((new Date(user.locked_until) - Date.now()) / 60_000)
      return res.status(429).json({
        error: `Account locked. Too many failed attempts — try again in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}.`,
      })
    }

    const valid = await bcrypt.compare(password, user.password_hash)

    if (!valid) {
      const attempts   = (user.failed_login_attempts || 0) + 1
      const shouldLock = attempts >= MAX_FAILED_ATTEMPTS
      await query(
        `UPDATE users
         SET failed_login_attempts = $1,
             locked_until          = $2,
             updated_at            = NOW()
         WHERE id = $3`,
        [
          attempts,
          shouldLock ? new Date(Date.now() + LOCK_DURATION_MS) : null,
          user.id,
        ]
      )
      if (shouldLock) {
        return res.status(429).json({
          error: `Too many failed attempts. Account locked for 15 minutes.`,
        })
      }
      const left = MAX_FAILED_ATTEMPTS - attempts
      return res.status(401).json({
        error: `Invalid email or password. ${left} attempt${left !== 1 ? 's' : ''} left before lockout.`,
      })
    }

    // Correct password — clear any previous failure state
    if (user.failed_login_attempts > 0 || user.locked_until) {
      await query(
        `UPDATE users SET failed_login_attempts = 0, locked_until = NULL, updated_at = NOW() WHERE id = $1`,
        [user.id]
      )
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
        `INSERT INTO users (name, email, role, google_id, email_verified)
         VALUES ($1, $2, $3, $4, TRUE)
         ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, email_verified = TRUE
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

/* ─────────────────────────────────────────────────────
   FORGOT PASSWORD  — POST /api/v1/auth/forgot-password
   Body: { email }
   Always returns success to prevent email enumeration.
───────────────────────────────────────────────────── */
export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body

    const result = await query(
      'SELECT * FROM users WHERE email = $1 AND is_active = TRUE AND email_verified = TRUE',
      [email.toLowerCase()]
    )
    const user = result.rows[0]

    // Always respond the same way — never reveal if email exists
    const OK = res.json({ message: 'If that email is registered, a reset code has been sent.' })

    if (!user || !user.password_hash) return OK  // OAuth-only or not found — silent

    // Rate-limit: only send if no recent OTP or it's past the halfway mark
    const halfTtl = OTP_TTL_MS / 2
    if (user.otp_expires_at && new Date(user.otp_expires_at) > new Date(Date.now() + halfTtl)) {
      return OK  // recent code still valid — silently skip
    }

    const otp         = generateOtp()
    const otp_expires = new Date(Date.now() + OTP_TTL_MS)

    await query(
      `UPDATE users SET otp_code = $1, otp_expires_at = $2, updated_at = NOW() WHERE id = $3`,
      [otp, otp_expires, user.id]
    )

    await sendPasswordResetEmail({ to: email, name: user.name, otp })

    return OK
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   RESET PASSWORD  — POST /api/v1/auth/reset-password
   Body: { email, otp, newPassword }
   Verifies OTP then sets the new password. Issues JWT
   so the user is automatically logged in after reset.
───────────────────────────────────────────────────── */
export async function resetPassword(req, res, next) {
  try {
    const { email, otp, newPassword } = req.body

    const result = await query(
      'SELECT * FROM users WHERE email = $1 AND is_active = TRUE',
      [email.toLowerCase()]
    )
    const user = result.rows[0]
    if (!user) return res.status(404).json({ error: 'Account not found.' })

    if (!user.password_hash) {
      return res.status(400).json({ error: 'This account uses Google Sign-In. No password to reset.' })
    }

    if (!user.otp_code || user.otp_code !== String(otp).trim()) {
      return res.status(400).json({ error: 'Incorrect reset code.' })
    }

    if (!user.otp_expires_at || new Date(user.otp_expires_at) < new Date()) {
      return res.status(400).json({ error: 'Reset code has expired. Request a new one.' })
    }

    const password_hash = await bcrypt.hash(newPassword, 12)

    const updated = await query(
      `UPDATE users
       SET password_hash         = $1,
           otp_code              = NULL,
           otp_expires_at        = NULL,
           failed_login_attempts = 0,
           locked_until          = NULL,
           updated_at            = NOW()
       WHERE id = $2
       RETURNING id, name, email, role, avatar_url, created_at`,
      [password_hash, user.id]
    )
    const resetUser = updated.rows[0]

    // Invalidate all existing refresh tokens (other sessions)
    await query('DELETE FROM refresh_tokens WHERE user_id = $1', [user.id])

    // Issue fresh tokens — auto-login after reset
    const accessToken  = signAccessToken(resetUser)
    const refreshToken = signRefreshToken(resetUser.id)
    await saveRefreshToken(resetUser.id, refreshToken)
    setRefreshCookie(res, refreshToken)

    return res.json({ user: userPublic(resetUser), accessToken })
  } catch (err) {
    next(err)
  }
}
