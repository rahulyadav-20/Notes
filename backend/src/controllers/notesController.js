import { query } from '../config/db.js'

/* ─────────────────────────────────────────────────────
   GET /api/v1/notes
   Returns all notes metadata (slug, title, category, is_premium)
───────────────────────────────────────────────────── */
export async function listNotes(req, res, next) {
  try {
    const { category } = req.query
    const result = await query(
      `SELECT slug, category, title, tagline, icon, color, level,
              parts_count, sections_count, free_parts, price, is_premium
       FROM notes_metadata
       ${category ? 'WHERE category = $1' : ''}
       ORDER BY category, title`,
      category ? [category] : []
    )
    return res.json({ notes: result.rows })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   GET /api/v1/notes/:slug
   Returns metadata + available part count for one note
───────────────────────────────────────────────────── */
export async function getNote(req, res, next) {
  try {
    const { slug } = req.params
    const [meta, parts] = await Promise.all([
      query('SELECT * FROM notes_metadata WHERE slug = $1', [slug]),
      query(
        'SELECT part_index, title FROM note_parts WHERE note_slug = $1 ORDER BY part_index',
        [slug]
      ),
    ])

    if (!meta.rows[0]) return res.status(404).json({ error: 'Note not found.' })

    return res.json({
      note: {
        ...meta.rows[0],
        parts: parts.rows,
      },
    })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   GET /api/v1/notes/:slug/parts/:partIndex
   Returns the full block content for one part.
   Free users can access parts 0–1 (freeUpTo=2).
   Premium/admin can access all parts.
───────────────────────────────────────────────────── */
const FREE_PARTS = 1   // only part 0 (first part) is free

export async function getNotePart(req, res, next) {
  try {
    const { slug } = req.params
    const partIndex = parseInt(req.params.partIndex, 10)

    if (isNaN(partIndex) || partIndex < 0) {
      return res.status(400).json({ error: 'Invalid part index.' })
    }

    // Parts 0 and 1 are always free
    if (partIndex < FREE_PARTS) {
      // no gate — fall through to content fetch
    } else {
      // Admin always has access
      if (req.user?.role === 'admin') {
        // fall through
      } else if (req.user) {
        // Check if user has purchased this note with valid (non-expired) access
        const purchase = await query(
          `SELECT id FROM note_purchases
           WHERE user_id=$1 AND note_slug=$2
           AND (expires_at IS NULL OR expires_at > NOW())`,
          [req.user.id, slug]
        )
        if (!purchase.rows[0]) {
          return res.status(403).json({
            error:          'Purchase required.',
            requiresPurchase: true,
            slug,
            partIndex,
          })
        }
      } else {
        return res.status(403).json({
          error:          'Purchase required.',
          requiresPurchase: true,
          slug,
          partIndex,
        })
      }
    }

    const result = await query(
      'SELECT part_index, title, blocks FROM note_parts WHERE note_slug = $1 AND part_index = $2',
      [slug, partIndex]
    )

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Part not found.' })
    }

    return res.json({ part: result.rows[0] })
  } catch (err) {
    next(err)
  }
}
