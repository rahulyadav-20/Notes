import { query } from '../config/db.js'
import { cacheGet, cacheSet } from '../config/redis.js'

/* ─────────────────────────────────────────────────────
   GET /api/v1/courses
   Public — returns all published courses with section/lesson counts.
───────────────────────────────────────────────────── */
export async function listCourses(req, res, next) {
  try {
    const CACHE_KEY = 'courses:list'
    const cached = await cacheGet(CACHE_KEY)
    if (cached) return res.json({ courses: cached })

    const result = await query(
      `SELECT
         c.id, c.slug, c.title, c.description, c.thumbnail_url, c.price,
         COUNT(DISTINCT s.id)  AS section_count,
         COUNT(DISTINCT l.id)  AS lesson_count,
         SUM(l.duration_seconds) AS total_seconds
       FROM courses c
       LEFT JOIN sections s ON s.course_id = c.id
       LEFT JOIN lessons  l ON l.section_id = s.id
       WHERE c.is_published = TRUE
       GROUP BY c.id
       ORDER BY c.created_at DESC`
    )

    const courses = result.rows
    await cacheSet(CACHE_KEY, courses, 5 * 60) // cache 5 min
    return res.json({ courses })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   GET /api/v1/courses/:slug
   Public — course detail + sections + lessons.
   Premium lessons show title + duration only (no video_url).
───────────────────────────────────────────────────── */
export async function getCourse(req, res, next) {
  try {
    const { slug } = req.params

    const courseResult = await query(
      'SELECT * FROM courses WHERE slug = $1 AND is_published = TRUE',
      [slug]
    )
    const course = courseResult.rows[0]
    if (!course) return res.status(404).json({ error: 'Course not found.' })

    const sectionsResult = await query(
      'SELECT * FROM sections WHERE course_id = $1 ORDER BY order_index',
      [course.id]
    )

    const isPremiumUser = req.user?.role === 'premium' || req.user?.role === 'admin'

    // Check enrollment if user is logged in
    let isEnrolled = false
    if (req.user) {
      const enroll = await query(
        'SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2',
        [req.user.id, course.id]
      )
      isEnrolled = enroll.rows.length > 0
    }

    const canAccessPremium = isPremiumUser || isEnrolled

    const sections = await Promise.all(
      sectionsResult.rows.map(async (section) => {
        const lessonsResult = await query(
          'SELECT id, title, duration_seconds, is_preview, order_index FROM lessons WHERE section_id = $1 ORDER BY order_index',
          [section.id]
        )
        return {
          ...section,
          lessons: lessonsResult.rows,
        }
      })
    )

    return res.json({
      course: { ...course, sections },
      isEnrolled,
      canAccessPremium,
    })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   GET /api/v1/courses/:slug/lessons/:lessonId
   Requires premium or enrollment.
   Returns video_url + full lesson data.
───────────────────────────────────────────────────── */
export async function getLesson(req, res, next) {
  try {
    const { slug, lessonId } = req.params

    // Verify course exists + user has access
    const courseResult = await query(
      'SELECT id FROM courses WHERE slug = $1 AND is_published = TRUE',
      [slug]
    )
    const course = courseResult.rows[0]
    if (!course) return res.status(404).json({ error: 'Course not found.' })

    const lessonResult = await query(
      `SELECT l.*
       FROM lessons l
       JOIN sections s ON s.id = l.section_id
       WHERE l.id = $1 AND s.course_id = $2`,
      [lessonId, course.id]
    )
    const lesson = lessonResult.rows[0]
    if (!lesson) return res.status(404).json({ error: 'Lesson not found.' })

    // Free preview — anyone can access
    if (lesson.is_preview) return res.json({ lesson })

    // Otherwise needs premium / enrollment
    // (requirePremium middleware already checked role — this handles enrollments too)
    const enroll = await query(
      'SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2',
      [req.user.id, course.id]
    )
    if (!enroll.rows.length && req.user.role === 'user') {
      return res.status(403).json({ error: 'Enroll in this course to access.' })
    }

    return res.json({ lesson })
  } catch (err) {
    next(err)
  }
}
