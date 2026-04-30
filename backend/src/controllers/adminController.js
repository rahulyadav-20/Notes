import { query } from '../config/db.js'
import { cacheDel } from '../config/redis.js'

/* ─────────────────────────────────────────────────────
   GET /api/v1/admin/users
   Query params: page, limit, search, role
───────────────────────────────────────────────────── */
export async function listUsers(req, res, next) {
  try {
    const page   = Math.max(1, parseInt(req.query.page)  || 1)
    const limit  = Math.min(100, parseInt(req.query.limit) || 20)
    const offset = (page - 1) * limit
    const search = req.query.search?.trim() || ''
    const role   = req.query.role || ''

    const conditions = ['u.is_active = TRUE']
    const params = []

    if (search) {
      params.push(`%${search}%`)
      conditions.push(`(u.name ILIKE $${params.length} OR u.email ILIKE $${params.length})`)
    }
    if (role && ['user','premium','admin'].includes(role)) {
      params.push(role)
      conditions.push(`u.role = $${params.length}`)
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const countResult = await query(
      `SELECT COUNT(*) FROM users u ${where}`,
      params
    )
    const total = parseInt(countResult.rows[0].count)

    params.push(limit, offset)
    const usersResult = await query(
      `SELECT u.id, u.name, u.email, u.role, u.avatar_url, u.created_at,
              ps.plan, ps.expires_at
       FROM users u
       LEFT JOIN premium_subscriptions ps ON ps.user_id = u.id AND ps.is_active = TRUE
       ${where}
       ORDER BY u.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    )

    return res.json({
      users:      usersResult.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   PATCH /api/v1/admin/users/:id/role
   Body: { role: 'user' | 'premium' | 'admin' }
───────────────────────────────────────────────────── */
export async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params
    const { role } = req.body

    if (!['user','premium'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid role. Only user | premium allowed via API. Admin role must be set directly in the database.',
      })
    }

    // Fetch old value for audit log
    const oldResult = await query('SELECT role FROM users WHERE id = $1', [id])
    const old = oldResult.rows[0]
    if (!old) return res.status(404).json({ error: 'User not found.' })

    await query(
      `UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2`,
      [role, id]
    )

    // Audit log
    await query(
      `INSERT INTO audit_logs (admin_id, action, target_user_id, old_value, new_value, ip_address)
       VALUES ($1, 'update_role', $2, $3, $4, $5)`,
      [req.user.id, id, { role: old.role }, { role }, req.ip]
    )

    return res.json({ message: `User role updated to '${role}'.` })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   DELETE /api/v1/admin/users/:id
   Soft delete (sets is_active = false)
───────────────────────────────────────────────────── */
export async function deactivateUser(req, res, next) {
  try {
    const { id } = req.params

    if (id === req.user.id) {
      return res.status(400).json({ error: 'Cannot deactivate your own account.' })
    }

    await query(
      `UPDATE users SET is_active = FALSE, updated_at = NOW() WHERE id = $1`,
      [id]
    )

    await query(
      `INSERT INTO audit_logs (admin_id, action, target_user_id, ip_address)
       VALUES ($1, 'deactivate_user', $2, $3)`,
      [req.user.id, id, req.ip]
    )

    return res.json({ message: 'User deactivated.' })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   GET /api/v1/admin/analytics
───────────────────────────────────────────────────── */
export async function getAnalytics(req, res, next) {
  try {
    const [
      usersResult, rolesResult,
      signupsTodayResult, signupsWeekResult,
      signupsDailyResult,
      revenueResult, revenueTodayResult,
      blogResult,
      questionsResult,
      notesResult,
    ] = await Promise.all([
      query(`SELECT COUNT(*) AS total FROM users WHERE is_active = TRUE`),
      query(`SELECT role, COUNT(*) AS count FROM users WHERE is_active = TRUE GROUP BY role`),
      query(`SELECT COUNT(*) AS today FROM users WHERE is_active = TRUE AND created_at > NOW() - INTERVAL '1 day'`),
      query(`SELECT COUNT(*) AS week  FROM users WHERE is_active = TRUE AND created_at > NOW() - INTERVAL '7 days'`),
      query(`SELECT DATE(created_at AT TIME ZONE 'UTC') AS day, COUNT(*) AS signups
             FROM users WHERE is_active = TRUE AND created_at > NOW() - INTERVAL '7 days'
             GROUP BY day ORDER BY day ASC`),
      query(`SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE status = 'paid'`),
      query(`SELECT COALESCE(SUM(amount), 0) AS today FROM payments WHERE status = 'paid' AND created_at > NOW() - INTERVAL '1 day'`),
      query(`SELECT COUNT(*) AS total,
                    COUNT(*) FILTER (WHERE is_published = TRUE) AS published,
                    COUNT(*) FILTER (WHERE is_published = FALSE) AS draft
             FROM blog_posts`),
      query(`SELECT COUNT(*) AS total,
                    COUNT(*) FILTER (WHERE is_premium = TRUE) AS premium
             FROM interview_questions`),
      query(`SELECT COUNT(*) AS total FROM notes_metadata`),
    ])

    const roles = {}
    rolesResult.rows.forEach(r => { roles[r.role] = parseInt(r.count) })

    // Build 7-day chart array (fill in missing days with 0)
    const dailyMap = {}
    signupsDailyResult.rows.forEach(r => { dailyMap[r.day] = parseInt(r.signups) })
    const chartData = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      const label = d.toLocaleDateString('en-IN', { weekday: 'short' })
      chartData.push({ day: label, date: key, signups: dailyMap[key] || 0 })
    }

    return res.json({
      analytics: {
        users: {
          total:   parseInt(usersResult.rows[0].total),
          today:   parseInt(signupsTodayResult.rows[0].today),
          week:    parseInt(signupsWeekResult.rows[0].week),
          roles,
          chartData,
        },
        revenue: {
          total: parseInt(revenueResult.rows[0].total),
          today: parseInt(revenueTodayResult.rows[0].today),
        },
        blog: {
          total:     parseInt(blogResult.rows[0].total),
          published: parseInt(blogResult.rows[0].published),
          draft:     parseInt(blogResult.rows[0].draft),
        },
        questions: {
          total:   parseInt(questionsResult.rows[0].total),
          premium: parseInt(questionsResult.rows[0].premium),
        },
        notes: { total: parseInt(notesResult.rows[0].total) },
      },
    })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   GET /api/v1/admin/posts
   All blog posts (including unpublished) for admin
───────────────────────────────────────────────────── */
export async function listAllPosts(req, res, next) {
  try {
    const { status, category } = req.query
    const conditions = []
    const params = []

    if (status === 'published') conditions.push('is_published = TRUE')
    else if (status === 'draft') conditions.push('is_published = FALSE')

    if (category && category !== 'all') {
      params.push(category)
      conditions.push(`category_id = $${params.length}`)
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const result = await query(
      `SELECT id, slug, title, excerpt, author_name, author_initials, author_color,
              category_id, company, tags, read_time, is_published, is_featured,
              published_at, created_at
       FROM blog_posts ${where} ORDER BY created_at DESC`,
      params
    )
    return res.json({ posts: result.rows })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   PATCH /api/v1/admin/questions/:slug
   Update a question (difficulty, premium flag, title)
───────────────────────────────────────────────────── */
export async function updateQuestion(req, res, next) {
  try {
    const { slug } = req.params
    const allowed  = ['title', 'difficulty', 'is_premium', 'answer', 'description']
    const updates  = []
    const params   = []

    for (const key of allowed) {
      if (key in req.body) {
        params.push(req.body[key])
        updates.push(`${key} = $${params.length}`)
      }
    }
    if (!updates.length) return res.status(400).json({ error: 'No valid fields.' })

    params.push(slug)
    const result = await query(
      `UPDATE interview_questions SET ${updates.join(', ')}, updated_at = NOW()
       WHERE slug = $${params.length} RETURNING *`,
      params
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Question not found.' })
    return res.json({ question: result.rows[0] })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   DELETE /api/v1/admin/questions/:slug
───────────────────────────────────────────────────── */
export async function deleteQuestion(req, res, next) {
  try {
    const { slug } = req.params
    const result = await query(
      'DELETE FROM interview_questions WHERE slug = $1 RETURNING slug', [slug]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Question not found.' })
    return res.json({ message: 'Question deleted.' })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   GET /api/v1/admin/audit-logs
───────────────────────────────────────────────────── */
export async function getAuditLogs(req, res, next) {
  try {
    const limit  = Math.min(100, parseInt(req.query.limit) || 50)
    const offset = Math.max(0, parseInt(req.query.offset) || 0)

    const result = await query(
      `SELECT al.*, a.name AS admin_name, t.name AS target_name
       FROM audit_logs al
       LEFT JOIN users a ON a.id = al.admin_id
       LEFT JOIN users t ON t.id = al.target_user_id
       ORDER BY al.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    )
    return res.json({ logs: result.rows })
  } catch (err) {
    next(err)
  }
}

/* ═══════════════════════════════════════════════════════
   PRICING MANAGEMENT
═══════════════════════════════════════════════════════ */

/* ── GET /api/v1/admin/pricing ── */
export async function getPricing(req, res, next) {
  try {
    const [notes, courses, interviews] = await Promise.all([
      query(`SELECT slug, title, price, color, icon FROM notes_metadata ORDER BY title`),
      query(`SELECT id, slug, title, price FROM courses ORDER BY title`),
      query(`SELECT slug, title, price, icon, color FROM interview_topics ORDER BY title`),
    ])
    return res.json({
      notes:      notes.rows,
      courses:    courses.rows,
      interviews: interviews.rows,
    })
  } catch (err) { next(err) }
}

/* ── PATCH /api/v1/admin/pricing/note/:slug ── */
export async function updateNotePrice(req, res, next) {
  try {
    const { slug }  = req.params
    const { price } = req.body
    if (typeof price !== 'number' || price < 0) return res.status(400).json({ error: 'price must be a non-negative number (paise).' })
    const r = await query(
      'UPDATE notes_metadata SET price=$1, updated_at=NOW() WHERE slug=$2 RETURNING slug, title, price',
      [price, slug]
    )
    if (!r.rows[0]) return res.status(404).json({ error: 'Note not found.' })
    return res.json({ item: r.rows[0] })
  } catch (err) { next(err) }
}

/* ── PATCH /api/v1/admin/pricing/course/:slug ── */
export async function updateCoursePrice(req, res, next) {
  try {
    const { slug }  = req.params
    const { price } = req.body
    if (typeof price !== 'number' || price < 0) return res.status(400).json({ error: 'price must be a non-negative number (paise).' })
    const r = await query(
      'UPDATE courses SET price=$1, updated_at=NOW() WHERE slug=$2 RETURNING slug, title, price',
      [price, slug]
    )
    if (!r.rows[0]) return res.status(404).json({ error: 'Course not found.' })
    return res.json({ item: r.rows[0] })
  } catch (err) { next(err) }
}

/* ── PATCH /api/v1/admin/pricing/interview/:slug ── */
export async function updateInterviewPrice(req, res, next) {
  try {
    const { slug }  = req.params
    const { price } = req.body
    if (typeof price !== 'number' || price < 0) return res.status(400).json({ error: 'price must be a non-negative number (paise).' })
    const r = await query(
      'UPDATE interview_topics SET price=$1 WHERE slug=$2 RETURNING slug, title, price',
      [price, slug]
    )
    if (!r.rows[0]) return res.status(404).json({ error: 'Topic not found.' })
    return res.json({ item: r.rows[0] })
  } catch (err) { next(err) }
}

/* ═══════════════════════════════════════════════════════
   USER ACCESS GRANTS
═══════════════════════════════════════════════════════ */

/* ── GET /api/v1/admin/users/:id/access ── */
export async function getUserAccess(req, res, next) {
  try {
    const { id } = req.params
    const [notes, interviews, courses] = await Promise.all([
      query(`SELECT np.note_slug AS slug, nm.title, np.expires_at, np.purchased_at,
                    CASE WHEN np.payment_id IS NULL OR np.payment_id LIKE 'admin_%' THEN 'admin' ELSE 'purchased' END AS source
             FROM note_purchases np
             LEFT JOIN notes_metadata nm ON nm.slug = np.note_slug
             WHERE np.user_id=$1`, [id]),
      query(`SELECT ip.topic_slug AS slug, it.title, ip.expires_at, ip.purchased_at,
                    CASE WHEN ip.payment_id IS NULL OR ip.payment_id LIKE 'admin_%' THEN 'admin' ELSE 'purchased' END AS source
             FROM interview_purchases ip
             LEFT JOIN interview_topics it ON it.slug = ip.topic_slug
             WHERE ip.user_id=$1`, [id]),
      query(`SELECT e.id, c.slug, c.title, e.expires_at, e.enrolled_at,
                    CASE WHEN e.payment_id IS NULL OR e.payment_id::text LIKE 'admin_%' THEN 'admin' ELSE 'purchased' END AS source
             FROM enrollments e
             JOIN courses c ON c.id = e.course_id
             WHERE e.user_id=$1`, [id]),
    ])
    return res.json({ notes: notes.rows, interviews: interviews.rows, courses: courses.rows })
  } catch (err) { next(err) }
}

/* ── POST /api/v1/admin/users/:id/grant ──
   Body: { type: 'note'|'course'|'interview', slug, expiresAt? }
──────────────────────────────────────────────────────── */
export async function grantAccess(req, res, next) {
  try {
    const { id }               = req.params
    const { type, slug, expiresAt } = req.body
    const exp = expiresAt ? new Date(expiresAt) : null
    const paymentId = `admin_grant_${req.user.id.slice(0,8)}`

    if (type === 'note') {
      await query(
        `INSERT INTO note_purchases (user_id, note_slug, payment_id, amount, expires_at)
         VALUES ($1,$2,$3,0,$4)
         ON CONFLICT (user_id, note_slug) DO UPDATE SET expires_at=$4, payment_id=$3`,
        [id, slug, paymentId, exp]
      )
    } else if (type === 'interview') {
      await query(
        `INSERT INTO interview_purchases (user_id, topic_slug, payment_id, amount, expires_at)
         VALUES ($1,$2,$3,0,$4)
         ON CONFLICT (user_id, topic_slug) DO UPDATE SET expires_at=$4, payment_id=$3`,
        [id, slug, paymentId, exp]
      )
    } else if (type === 'course') {
      const course = await query('SELECT id FROM courses WHERE slug=$1', [slug])
      if (!course.rows[0]) return res.status(404).json({ error: 'Course not found.' })
      await query(
        `INSERT INTO enrollments (user_id, course_id, payment_id, expires_at)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (user_id, course_id) DO UPDATE SET expires_at=$4, payment_id=$3`,
        [id, course.rows[0].id, paymentId, exp]
      )
    } else {
      return res.status(400).json({ error: 'type must be note | course | interview' })
    }

    await query(
      `INSERT INTO audit_logs (admin_id, action, target_user_id, new_value, ip_address)
       VALUES ($1,'grant_access',$2,$3,$4)`,
      [req.user.id, id, { type, slug, expiresAt: exp }, req.ip]
    )

    return res.json({ message: `Access granted: ${type} — ${slug}` })
  } catch (err) { next(err) }
}

/* ── DELETE /api/v1/admin/users/:id/revoke ──
   Body: { type, slug }
──────────────────────────────────────────────────────── */
export async function revokeAccess(req, res, next) {
  try {
    const { id }         = req.params
    const { type, slug } = req.body

    if (type === 'note') {
      await query('DELETE FROM note_purchases WHERE user_id=$1 AND note_slug=$2', [id, slug])
    } else if (type === 'interview') {
      await query('DELETE FROM interview_purchases WHERE user_id=$1 AND topic_slug=$2', [id, slug])
    } else if (type === 'course') {
      const course = await query('SELECT id FROM courses WHERE slug=$1', [slug])
      if (course.rows[0]) {
        await query('DELETE FROM enrollments WHERE user_id=$1 AND course_id=$2', [id, course.rows[0].id])
      }
    } else {
      return res.status(400).json({ error: 'type must be note | course | interview' })
    }

    await query(
      `INSERT INTO audit_logs (admin_id, action, target_user_id, new_value, ip_address)
       VALUES ($1,'revoke_access',$2,$3,$4)`,
      [req.user.id, id, { type, slug }, req.ip]
    )

    return res.json({ message: `Access revoked: ${type} — ${slug}` })
  } catch (err) { next(err) }
}
