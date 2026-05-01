import { query } from '../config/db.js'

const PER_TYPE = 3   // max results per content type

/* ─────────────────────────────────────────────────────
   GET /api/v1/search?q=kafka
   Searches notes, interview topics, interview questions,
   and courses. Returns up to PER_TYPE hits per type.
───────────────────────────────────────────────────── */
export async function search(req, res, next) {
  try {
    const q = req.query.q?.trim()
    if (!q || q.length < 2) return res.json({ results: [], query: q || '' })

    const term = `%${q.toLowerCase()}%`

    const [notes, topics, questions, courses] = await Promise.all([
      query(
        `SELECT slug, category, title, tagline, icon, color
         FROM notes_metadata
         WHERE LOWER(title) LIKE $1 OR LOWER(COALESCE(tagline,'')) LIKE $1
         ORDER BY
           CASE WHEN LOWER(title) LIKE $1 THEN 0 ELSE 1 END,
           title
         LIMIT $2`,
        [term, PER_TYPE]
      ),
      query(
        `SELECT slug, title, description, icon, color
         FROM interview_topics
         WHERE is_published = TRUE
           AND (LOWER(title) LIKE $1 OR LOWER(COALESCE(description,'')) LIKE $1)
         LIMIT $2`,
        [term, PER_TYPE]
      ),
      query(
        `SELECT iq.slug, iq.topic_id, iq.title, it.icon AS topic_icon, it.color AS topic_color
         FROM interview_questions iq
         JOIN interview_topics it ON it.slug = iq.topic_id
         WHERE LOWER(iq.title) LIKE $1
         ORDER BY
           CASE WHEN LOWER(iq.title) LIKE $1 THEN 0 ELSE 1 END
         LIMIT $2`,
        [term, PER_TYPE]
      ),
      query(
        `SELECT slug, title, description
         FROM courses
         WHERE is_published = TRUE
           AND (LOWER(title) LIKE $1 OR LOWER(COALESCE(description,'')) LIKE $1)
         LIMIT $2`,
        [term, PER_TYPE]
      ),
    ])

    const results = [
      ...notes.rows.map(r => ({
        type:     'note',
        slug:     r.slug,
        category: r.category,
        title:    r.title,
        subtitle: r.tagline  || '',
        icon:     r.icon     || '📚',
        color:    r.color    || '#4A90D9',
      })),
      ...topics.rows.map(r => ({
        type:     'topic',
        slug:     r.slug,
        title:    r.title,
        subtitle: r.description || '',
        icon:     r.icon        || '🎯',
        color:    r.color       || '#6366F1',
      })),
      ...questions.rows.map(r => ({
        type:      'question',
        slug:      r.slug,
        topicSlug: r.topic_id,
        title:     r.title,
        subtitle:  r.topic_id,
        icon:      r.topic_icon  || '🎯',
        color:     r.topic_color || '#6366F1',
      })),
      ...courses.rows.map(r => ({
        type:     'course',
        slug:     r.slug,
        title:    r.title,
        subtitle: r.description || '',
        icon:     '🎓',
        color:    '#f5820a',
      })),
    ]

    return res.json({ results, query: q })
  } catch (err) {
    next(err)
  }
}
