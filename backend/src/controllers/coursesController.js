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
      `SELECT id, slug, title, tagline, description, thumbnail_url, price, is_published, soon,
              color, icon_slug, instructor, level, duration_text,
              lesson_count, module_count, free_modules, rating, highlights, module_titles
       FROM courses WHERE slug = $1 AND is_published = TRUE`,
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
    let completedLessonIds = []
    if (req.user) {
      const [enroll, progress] = await Promise.all([
        query('SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2', [req.user.id, course.id]),
        query('SELECT lesson_id FROM user_lesson_progress WHERE user_id = $1 AND course_id = $2', [req.user.id, course.id]),
      ])
      isEnrolled = enroll.rows.length > 0
      completedLessonIds = progress.rows.map(r => r.lesson_id)
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
          lessons: lessonsResult.rows.map(l => ({
            ...l,
            completed: completedLessonIds.includes(l.id),
          })),
        }
      })
    )

    // Compute resume lesson (first uncompleted, in order)
    const allLessons = sections.flatMap(s => s.lessons).sort((a, b) => a.order_index - b.order_index)
    const totalLessons = allLessons.length
    const completedCount = completedLessonIds.length
    const resumeLesson = allLessons.find(l => !l.completed) || null

    return res.json({
      course: { ...course, sections },
      isEnrolled,
      canAccessPremium,
      progress: {
        completedCount,
        totalLessons,
        percentage: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
        resumeLessonId:    resumeLesson?.id    || null,
        resumeLessonTitle: resumeLesson?.title || null,
      },
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

/* ─────────────────────────────────────────────────────
   POST /api/v1/courses/:slug/lessons/:lessonId/complete
   Mark a lesson as completed for the authenticated user.
   Requires enrollment or preview access.
───────────────────────────────────────────────────── */
export async function markLessonComplete(req, res, next) {
  try {
    const { slug, lessonId } = req.params

    const courseResult = await query(
      'SELECT id FROM courses WHERE slug = $1 AND is_published = TRUE',
      [slug]
    )
    const course = courseResult.rows[0]
    if (!course) return res.status(404).json({ error: 'Course not found.' })

    // Verify lesson belongs to this course
    const lessonResult = await query(
      `SELECT l.id, l.is_preview FROM lessons l
       JOIN sections s ON s.id = l.section_id
       WHERE l.id = $1 AND s.course_id = $2`,
      [lessonId, course.id]
    )
    const lesson = lessonResult.rows[0]
    if (!lesson) return res.status(404).json({ error: 'Lesson not found.' })

    // Must be enrolled (or preview lesson for anyone)
    if (!lesson.is_preview) {
      const enroll = await query(
        'SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2',
        [req.user.id, course.id]
      )
      if (!enroll.rows.length && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Enroll in this course first.' })
      }
    }

    // Upsert — idempotent
    await query(
      `INSERT INTO user_lesson_progress (user_id, lesson_id, course_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, lesson_id) DO NOTHING`,
      [req.user.id, lessonId, course.id]
    )

    // Return updated progress
    const [progressResult, totalResult] = await Promise.all([
      query('SELECT COUNT(*) FROM user_lesson_progress WHERE user_id=$1 AND course_id=$2', [req.user.id, course.id]),
      query(`SELECT COUNT(*) FROM lessons l JOIN sections s ON s.id=l.section_id WHERE s.course_id=$1`, [course.id]),
    ])
    const completedCount = parseInt(progressResult.rows[0].count)
    const totalLessons   = parseInt(totalResult.rows[0].count)

    return res.json({
      message: 'Lesson marked complete.',
      progress: {
        completedCount,
        totalLessons,
        percentage: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
      },
    })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   GET /api/v1/courses/my-progress
   Returns progress summary for all enrolled courses.
   Keyed by course slug.
───────────────────────────────────────────────────── */
export async function getMyProgress(req, res, next) {
  try {
    // Get all enrolled courses with their total lesson counts
    const enrolled = await query(
      `SELECT c.id, c.slug,
              COUNT(DISTINCT l.id)                                           AS total_lessons,
              COUNT(DISTINCT ulp.lesson_id)                                  AS completed_count
       FROM enrollments e
       JOIN courses  c ON c.id = e.course_id
       LEFT JOIN sections s   ON s.course_id = c.id
       LEFT JOIN lessons  l   ON l.section_id = s.id
       LEFT JOIN user_lesson_progress ulp
              ON ulp.lesson_id = l.id AND ulp.user_id = $1
       WHERE e.user_id = $1
       GROUP BY c.id, c.slug`,
      [req.user.id]
    )

    const progressMap = {}
    for (const row of enrolled.rows) {
      const total     = parseInt(row.total_lessons)
      const completed = parseInt(row.completed_count)
      progressMap[row.slug] = {
        completedCount: completed,
        totalLessons:   total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      }
    }

    return res.json({ progress: progressMap })
  } catch (err) {
    next(err)
  }
}
