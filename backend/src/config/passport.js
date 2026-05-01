import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { query } from './db.js'

/**
 * Google OAuth strategy.
 * Only registered when GOOGLE_CLIENT_ID is set.
 * In development, use GET /api/v1/auth/dev/google instead.
 */
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  `${process.env.API_URL || 'http://localhost:4000'}/api/v1/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email     = profile.emails?.[0]?.value?.toLowerCase()
        const googleId  = profile.id
        const name      = profile.displayName || email?.split('@')[0] || 'User'
        const avatarUrl = profile.photos?.[0]?.value

        if (!email) return done(new Error('No email in Google profile'), null)

        // 1. Existing user with this Google ID
        let result = await query(
          'SELECT * FROM users WHERE google_id = $1 AND is_active = TRUE',
          [googleId]
        )
        if (result.rows[0]) return done(null, result.rows[0])

        // 2. Existing user with same email — link Google account + mark verified
        result = await query(
          `UPDATE users
           SET google_id = $1, avatar_url = COALESCE(avatar_url, $2),
               email_verified = TRUE, updated_at = NOW()
           WHERE email = $3 AND is_active = TRUE
           RETURNING *`,
          [googleId, avatarUrl, email]
        )
        if (result.rows[0]) return done(null, result.rows[0])

        // 3. Brand-new user — Google already verified the email
        result = await query(
          `INSERT INTO users (name, email, google_id, avatar_url, email_verified)
           VALUES ($1, $2, $3, $4, TRUE)
           RETURNING *`,
          [name, email, googleId, avatarUrl]
        )
        return done(null, result.rows[0])
      } catch (err) {
        return done(err, null)
      }
    }
  ))
  console.log('✅ Google OAuth strategy registered')
} else {
  console.log('ℹ️  Google OAuth not configured — use /api/v1/auth/dev/google in development')
}

export default passport
