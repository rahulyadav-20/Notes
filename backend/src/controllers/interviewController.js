import { query } from '../config/db.js'

/* ─────────────────────────────────────────────────────
   GET /api/v1/interview/topics
   List all published interview topics (packs).
───────────────────────────────────────────────────── */
export async function listTopics(req, res, next) {
  try {
    // Count questions live from interview_questions — never trust the stored column
    const result = await query(
      `SELECT
         it.slug, it.title, it.description, it.icon, it.color, it.price,
         COUNT(iq.id)                                              AS total_questions,
         COUNT(iq.id) FILTER (WHERE iq.is_premium = FALSE)        AS free_questions
       FROM interview_topics it
       LEFT JOIN interview_questions iq ON iq.topic_id = it.slug
       WHERE it.is_published = TRUE
       GROUP BY it.slug, it.title, it.description, it.icon, it.color, it.price
       ORDER BY it.title`
    )
    // Cast counts to integers
    const topics = result.rows.map(r => ({
      ...r,
      total_questions: parseInt(r.total_questions),
      free_questions:  parseInt(r.free_questions),
    }))
    return res.json({ topics })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   GET /api/v1/interview/:topicSlug/questions
   List questions for a topic.
   Free users only receive free questions (is_premium=FALSE).
   Premium/admin + users who purchased the pack get all.
───────────────────────────────────────────────────── */
export async function listQuestions(req, res, next) {
  try {
    const { topicSlug } = req.params

    const topic = await query(
      `SELECT * FROM interview_topics WHERE slug = $1 AND is_published = TRUE`,
      [topicSlug]
    )
    if (!topic.rows[0]) return res.status(404).json({ error: 'Topic not found.' })

    const isAdmin = req.user?.role === 'admin'

    // Check if user has a valid (non-expired) purchase for this topic
    let hasPurchased = false
    if (req.user && !isAdmin) {
      const purchase = await query(
        `SELECT id FROM interview_purchases
         WHERE user_id=$1 AND topic_slug=$2
         AND (expires_at IS NULL OR expires_at > NOW())`,
        [req.user.id, topicSlug]
      )
      hasPurchased = purchase.rows.length > 0
    }

    const canAccessAll = isAdmin || hasPurchased

    // Optional filters from query params
    const { difficulty, company, tag, search } = req.query
    const conditions = [`topic_id = $1`]
    const params     = [topicSlug]

    if (!canAccessAll) conditions.push(`is_premium = FALSE`)

    if (difficulty && ['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      params.push(difficulty)
      conditions.push(`difficulty = $${params.length}`)
    }
    if (company) {
      params.push(JSON.stringify([company]))
      conditions.push(`companies @> $${params.length}::jsonb`)
    }
    if (tag) {
      params.push(JSON.stringify([tag]))
      conditions.push(`tags @> $${params.length}::jsonb`)
    }
    if (search?.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`)
      conditions.push(`LOWER(title) LIKE $${params.length}`)
    }

    const result = await query(
      `SELECT id, topic_id, slug, title, description,
              difficulty, companies, tags, acceptance,
              order_index, is_premium,
              ${canAccessAll ? 'answer, code, hints, time_complexity, space_complexity,' : ''}
              created_at
       FROM interview_questions
       WHERE ${conditions.join(' AND ')}
       ORDER BY order_index ASC`,
      params
    )

    return res.json({
      topic:     topic.rows[0],
      questions: result.rows,
      access:    canAccessAll ? 'full' : 'free',
    })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   GET /api/v1/interview/:topicSlug/:questionSlug
   Single question with full answer + prev/next navigation.
   Premium content gated the same way as listQuestions.
───────────────────────────────────────────────────── */
export async function getQuestion(req, res, next) {
  try {
    const { topicSlug, questionSlug } = req.params

    const topic = await query(
      `SELECT * FROM interview_topics WHERE slug = $1 AND is_published = TRUE`,
      [topicSlug]
    )
    if (!topic.rows[0]) return res.status(404).json({ error: 'Topic not found.' })

    const qResult = await query(
      `SELECT * FROM interview_questions WHERE slug = $1 AND topic_id = $2`,
      [questionSlug, topicSlug]
    )
    if (!qResult.rows[0]) return res.status(404).json({ error: 'Question not found.' })

    const question = qResult.rows[0]

    // Purchase gate for premium questions
    if (question.is_premium) {
      const isAdmin = req.user?.role === 'admin'
      if (!isAdmin) {
        if (!req.user) {
          return res.status(403).json({ error: 'Purchase required.', requiresPurchase: true, topicSlug })
        }
        const purchase = await query(
          `SELECT id FROM interview_purchases
           WHERE user_id=$1 AND topic_slug=$2
           AND (expires_at IS NULL OR expires_at > NOW())`,
          [req.user.id, topicSlug]
        )
        if (!purchase.rows.length) {
          return res.status(403).json({ error: 'Purchase required.', requiresPurchase: true, topicSlug })
        }
      }
    }

    // prev / next navigation
    const [prev, next_] = await Promise.all([
      query(
        `SELECT slug, title FROM interview_questions
         WHERE topic_id = $1 AND order_index < $2
         ORDER BY order_index DESC LIMIT 1`,
        [topicSlug, question.order_index]
      ),
      query(
        `SELECT slug, title FROM interview_questions
         WHERE topic_id = $1 AND order_index > $2
         ORDER BY order_index ASC LIMIT 1`,
        [topicSlug, question.order_index]
      ),
    ])

    return res.json({
      question,
      category:  topic.rows[0],
      prevSlug:  prev.rows[0]?.slug  || null,
      prevTitle: prev.rows[0]?.title || null,
      nextSlug:  next_.rows[0]?.slug  || null,
      nextTitle: next_.rows[0]?.title || null,
    })
  } catch (err) {
    next(err)
  }
}
