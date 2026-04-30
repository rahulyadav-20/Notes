import { query } from '../config/db.js'

/*
 * POST /api/v1/track/pageview
 * Body: { path, referrer?, sessionId }
 * Public — no auth required. Rate-limited by global limiter.
 * user_id is populated if a valid JWT is present (via optionalAuth).
 */
export async function trackPageview(req, res, next) {
  try {
    const { path, referrer, sessionId } = req.body
    if (!path || typeof path !== 'string') return res.status(400).json({ error: 'path required' })

    // Ignore admin, api, and static asset paths
    if (path.startsWith('/admin') || path.startsWith('/api') || path.includes('.')) {
      return res.json({ ok: true })
    }

    await query(
      `INSERT INTO page_views (path, user_id, session_id, referrer)
       VALUES ($1, $2, $3, $4)`,
      [
        path.slice(0, 255),
        req.user?.id || null,
        sessionId   || null,
        referrer    ? referrer.slice(0, 500) : null,
      ]
    )

    return res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

/*
 * GET /api/v1/track/stats
 * Returns page view stats used by the admin analytics.
 * Admin only.
 */
export async function getPageViewStats(req, res, next) {
  try {
    const [todayRes, weekRes, monthRes, topPagesRes, dailyRes] = await Promise.all([

      // Today's views
      query(`SELECT COUNT(*) AS count FROM page_views
             WHERE viewed_at > NOW() - INTERVAL '1 day'`),

      // This week's views
      query(`SELECT COUNT(*) AS count FROM page_views
             WHERE viewed_at > NOW() - INTERVAL '7 days'`),

      // This month's views
      query(`SELECT COUNT(*) AS count FROM page_views
             WHERE viewed_at > NOW() - INTERVAL '30 days'`),

      // Top 8 pages (last 30 days)
      query(`SELECT path,
                    COUNT(*)                                                            AS views,
                    COUNT(*) FILTER (WHERE viewed_at > NOW() - INTERVAL '7 days')      AS views_week,
                    COUNT(DISTINCT session_id) FILTER (WHERE session_id IS NOT NULL)   AS unique_visitors
             FROM page_views
             WHERE viewed_at > NOW() - INTERVAL '30 days'
               AND path NOT IN ('/', '')
             GROUP BY path
             ORDER BY views DESC
             LIMIT 8`),

      // Daily views for last 7 days (for chart)
      query(`SELECT DATE(viewed_at AT TIME ZONE 'UTC') AS day,
                    COUNT(*)                           AS views,
                    COUNT(DISTINCT session_id)         AS visitors
             FROM page_views
             WHERE viewed_at > NOW() - INTERVAL '7 days'
             GROUP BY day ORDER BY day ASC`),
    ])

    // Fill chart with all 7 days (zeros for missing days)
    const dailyMap = {}
    dailyRes.rows.forEach(r => { dailyMap[r.day] = { views: parseInt(r.views), visitors: parseInt(r.visitors) } })
    const chartData = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key   = d.toISOString().slice(0, 10)
      const label = d.toLocaleDateString('en-IN', { weekday: 'short' })
      chartData.push({
        day:      label,
        date:     key,
        views:    dailyMap[key]?.views    || 0,
        visitors: dailyMap[key]?.visitors || 0,
      })
    }

    return res.json({
      pageViews: {
        today:    parseInt(todayRes.rows[0].count),
        week:     parseInt(weekRes.rows[0].count),
        month:    parseInt(monthRes.rows[0].count),
        chartData,
        topPages: topPagesRes.rows.map(r => ({
          path:            r.path,
          views:           parseInt(r.views),
          views_week:      parseInt(r.views_week),
          unique_visitors: parseInt(r.unique_visitors),
        })),
      },
    })
  } catch (err) {
    next(err)
  }
}
