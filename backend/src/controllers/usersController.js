import { query } from '../config/db.js'

/* ─────────────────────────────────────────────────────
   GET /api/v1/users/me
───────────────────────────────────────────────────── */
export async function getMe(req, res, next) {
  try {
    const result = await query(
      `SELECT
         u.id, u.name, u.email, u.role, u.avatar_url, u.created_at,
         ps.plan, ps.expires_at, ps.is_active AS sub_active
       FROM users u
       LEFT JOIN premium_subscriptions ps
         ON ps.user_id = u.id AND ps.is_active = TRUE
       WHERE u.id = $1 AND u.is_active = TRUE`,
      [req.user.id]
    )

    const user = result.rows[0]
    if (!user) return res.status(404).json({ error: 'User not found.' })

    // Flatten subscription info
    const { plan, expires_at, sub_active, ...base } = user
    return res.json({
      user: {
        ...base,
        subscription: plan
          ? { plan, expiresAt: expires_at, isActive: sub_active }
          : null,
      },
    })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   PATCH /api/v1/users/me
───────────────────────────────────────────────────── */
export async function updateMe(req, res, next) {
  try {
    const { name, avatar_url } = req.body

    const result = await query(
      `UPDATE users
       SET
         name       = COALESCE(NULLIF(TRIM($1),''), name),
         avatar_url = COALESCE($2, avatar_url),
         updated_at = NOW()
       WHERE id = $3 AND is_active = TRUE
       RETURNING id, name, email, role, avatar_url, created_at`,
      [name || null, avatar_url || null, req.user.id]
    )

    const user = result.rows[0]
    if (!user) return res.status(404).json({ error: 'User not found.' })

    return res.json({ user })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   DELETE /api/v1/users/me
   Soft-deletes the account after password confirmation.
───────────────────────────────────────────────────── */
export async function deleteAccount(req, res, next) {
  try {
    const { password } = req.body

    const result = await query('SELECT * FROM users WHERE id = $1 AND is_active = TRUE', [req.user.id])
    const user = result.rows[0]
    if (!user) return res.status(404).json({ error: 'User not found.' })

    // Require password for password-based accounts
    if (user.password_hash) {
      if (!password) return res.status(400).json({ error: 'Password confirmation required.' })
      const { default: bcrypt } = await import('bcryptjs')
      const valid = await bcrypt.compare(password, user.password_hash)
      if (!valid) return res.status(401).json({ error: 'Incorrect password.' })
    }

    await query('UPDATE users SET is_active = FALSE, email = $1, updated_at = NOW() WHERE id = $2',
      [`deleted_${user.id}@deleted.local`, user.id])
    await query('DELETE FROM refresh_tokens WHERE user_id = $1', [user.id])

    res.clearCookie('refresh_token', { path: '/api/v1/auth' })
    return res.json({ message: 'Account deleted.' })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   GET /api/v1/users/me/bookmarks
───────────────────────────────────────────────────── */
export async function getBookmarks(req, res, next) {
  try {
    const result = await query(
      'SELECT note_slug, created_at FROM user_note_bookmarks WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    )
    return res.json({ bookmarks: result.rows })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   POST /api/v1/users/me/bookmarks/:slug
───────────────────────────────────────────────────── */
export async function addBookmark(req, res, next) {
  try {
    const { slug } = req.params
    await query(
      `INSERT INTO user_note_bookmarks (user_id, note_slug)
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [req.user.id, slug]
    )
    return res.status(201).json({ message: 'Bookmarked.' })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   DELETE /api/v1/users/me/bookmarks/:slug
───────────────────────────────────────────────────── */
export async function removeBookmark(req, res, next) {
  try {
    const { slug } = req.params
    await query(
      'DELETE FROM user_note_bookmarks WHERE user_id = $1 AND note_slug = $2',
      [req.user.id, slug]
    )
    return res.json({ message: 'Bookmark removed.' })
  } catch (err) {
    next(err)
  }
}
