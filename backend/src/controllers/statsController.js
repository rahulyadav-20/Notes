import { query } from '../config/db.js'

/**
 * GET /api/v1/stats
 * Public endpoint — returns aggregate platform stats for hero/dashboard display.
 * Cached in Redis for 5 minutes to avoid repeated DB queries on every page load.
 */
import { cacheGet, cacheSet } from '../config/redis.js'

const CACHE_KEY = 'platform:stats'
const CACHE_TTL = 300  // 5 minutes

export async function getPlatformStats(req, res, next) {
  try {
    // Try cache first
    const cached = await cacheGet(CACHE_KEY)
    if (cached) return res.json(cached)

    const [notesRes, questionsRes, blogRes, domainRes] = await Promise.all([
      query(`SELECT
               COUNT(*)                    AS total_notes,
               SUM(sections_count)         AS total_sections,
               SUM(parts_count)            AS total_parts,
               COUNT(DISTINCT category)    AS total_domains
             FROM notes_metadata`),

      query(`SELECT
               SUM(total_questions)  AS total,
               SUM(free_questions)   AS free
             FROM interview_topics
             WHERE is_published = TRUE`),

      query(`SELECT COUNT(*) AS total FROM blog_posts WHERE is_published = TRUE`),

      query(`SELECT category,
                    COUNT(*)         AS note_count,
                    SUM(parts_count) AS parts
             FROM notes_metadata
             GROUP BY category
             ORDER BY note_count DESC`),
    ])

    const n = notesRes.rows[0]
    const q = questionsRes.rows[0]
    const b = blogRes.rows[0]

    const stats = {
      notes: {
        total:    parseInt(n.total_notes)   || 0,
        sections: parseInt(n.total_sections) || 0,
        parts:    parseInt(n.total_parts)   || 0,
        domains:  parseInt(n.total_domains) || 0,
      },
      questions: {
        total: parseInt(q.total) || 0,
        free:  parseInt(q.free)  || 0,
      },
      blog: {
        total: parseInt(b.total) || 0,
      },
      domains: domainRes.rows.map(r => ({
        category:   r.category,
        note_count: parseInt(r.note_count),
        parts:      parseInt(r.parts),
      })),
    }

    await cacheSet(CACHE_KEY, stats, CACHE_TTL)
    return res.json(stats)
  } catch (err) {
    next(err)
  }
}
