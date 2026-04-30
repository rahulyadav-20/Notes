import { query } from '../config/db.js'

/* ─────────────────────────────────────────────────────
   GET /api/v1/blog
   List published posts, optionally filtered by category.
───────────────────────────────────────────────────── */
export async function listPosts(req, res, next) {
  try {
    const { category } = req.query
    const result = await query(
      `SELECT id, slug, title, excerpt,
              author_name, author_initials, author_color,
              category_id, company, tags, read_time,
              is_featured, published_at
       FROM blog_posts
       WHERE is_published = TRUE
         ${category && category !== 'all' ? 'AND category_id = $1' : ''}
       ORDER BY is_featured DESC, published_at DESC`,
      category && category !== 'all' ? [category] : []
    )
    return res.json({ posts: result.rows })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   GET /api/v1/blog/:slug
   Single post with full content + related posts.
───────────────────────────────────────────────────── */
export async function getPost(req, res, next) {
  try {
    const { slug } = req.params
    const result = await query(
      `SELECT * FROM blog_posts WHERE slug = $1 AND is_published = TRUE`,
      [slug]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Post not found.' })

    const post = result.rows[0]

    // Related: same category or overlapping tags, exclude self
    const related = await query(
      `SELECT id, slug, title, excerpt,
              author_name, author_initials, author_color,
              category_id, company, tags, read_time, published_at
       FROM blog_posts
       WHERE is_published = TRUE
         AND slug <> $1
         AND (category_id = $2 OR tags && $3)
       ORDER BY published_at DESC
       LIMIT 3`,
      [slug, post.category_id, post.tags ?? []]
    )

    return res.json({ post, related: related.rows })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   POST /api/v1/blog
   Create a new post. Admin only.
───────────────────────────────────────────────────── */
export async function createPost(req, res, next) {
  try {
    const {
      slug, title, excerpt, content,
      author_name, author_initials, author_color,
      category_id, company, tags, read_time,
      is_published = false, is_featured = false,
      published_at,
    } = req.body

    if (!slug || !title || !category_id) {
      return res.status(400).json({ error: 'slug, title, and category_id are required.' })
    }

    const result = await query(
      `INSERT INTO blog_posts
         (slug, title, excerpt, content,
          author_name, author_initials, author_color,
          category_id, company, tags, read_time,
          is_published, is_featured, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING *`,
      [
        slug, title, excerpt ?? null, JSON.stringify(content ?? []),
        author_name ?? null, author_initials ?? null, author_color ?? null,
        category_id, company ?? null, tags ?? [],
        read_time ?? null, is_published, is_featured,
        is_published ? (published_at ?? new Date().toISOString()) : null,
      ]
    )

    return res.status(201).json({ post: result.rows[0] })
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'A post with that slug already exists.' })
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   PATCH /api/v1/blog/:slug
   Update an existing post. Admin only.
───────────────────────────────────────────────────── */
export async function updatePost(req, res, next) {
  try {
    const { slug } = req.params
    const fields = req.body

    // Build dynamic SET clause from provided fields
    const allowed = [
      'title','excerpt','content','author_name','author_initials','author_color',
      'category_id','company','tags','read_time','is_published','is_featured','published_at',
    ]
    const updates = []
    const values  = []
    let   idx     = 1

    for (const key of allowed) {
      if (key in fields) {
        updates.push(`${key} = $${idx++}`)
        values.push(key === 'content' ? JSON.stringify(fields[key]) : fields[key])
      }
    }

    if (!updates.length) return res.status(400).json({ error: 'No valid fields to update.' })

    values.push(slug)
    const result = await query(
      `UPDATE blog_posts SET ${updates.join(', ')}, updated_at = NOW()
       WHERE slug = $${idx} RETURNING *`,
      values
    )

    if (!result.rows[0]) return res.status(404).json({ error: 'Post not found.' })
    return res.json({ post: result.rows[0] })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   DELETE /api/v1/blog/:slug
   Admin only.
───────────────────────────────────────────────────── */
export async function deletePost(req, res, next) {
  try {
    const { slug } = req.params
    const result = await query(
      `DELETE FROM blog_posts WHERE slug = $1 RETURNING slug`,
      [slug]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Post not found.' })
    return res.json({ message: 'Post deleted.' })
  } catch (err) {
    next(err)
  }
}
