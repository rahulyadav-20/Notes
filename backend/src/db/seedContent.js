/**
 * npm run db:content
 *
 * Seeds ALL content tables:
 *   notes_metadata      — every note with individual price
 *   note_parts          — actual note content (Kafka + future notes)
 *   interview_topics    — topic packs with individual prices
 *   interview_questions — sample questions per topic
 *   blog_posts          — blog articles and interview experiences
 *
 * Safe to run in any environment — never touches users, payments, or bookmarks.
 * Fully idempotent: ON CONFLICT DO UPDATE means re-running never duplicates data.
 */
import 'dotenv/config'
import pool from '../config/db.js'
import { KAFKA_PARTS }             from './content/kafka.js'
import { INTERVIEW_TOPICS, INTERVIEW_QUESTIONS } from './content/interview_questions.js'
import { BLOG_POSTS }              from './content/blog_posts.js'

/* ══════════════════════════════════════════════════════════
   NOTES METADATA  — individual price per note (in paise)
   0 = free note  |  49900 = ₹499  |  29900 = ₹299
══════════════════════════════════════════════════════════ */
const NOTES = [
  {
    slug: 'kafka', category: 'data-engineer', title: 'Apache Kafka',
    tagline: 'Distributed event streaming — internals, replication & production ops',
    icon: '⚡', color: '#4A90D9', level: 'Intermediate',
    parts_count: 6, sections_count: 14, free_parts: 2,
    price: 49900,    // ₹499 — individual purchase
    is_premium: false,
  },
  {
    slug: 'spark', category: 'data-engineer', title: 'Apache Spark',
    tagline: 'Unified analytics engine — RDDs to structured streaming at scale',
    icon: '🔥', color: '#E25A1C', level: 'Advanced',
    parts_count: 8, sections_count: 28, free_parts: 2,
    price: 49900,
    is_premium: false,
  },
  {
    slug: 'flink', category: 'data-engineer', title: 'Apache Flink',
    tagline: 'Stateful stream processing — exactly-once semantics & event time',
    icon: '🌊', color: '#E6522C', level: 'Advanced',
    parts_count: 7, sections_count: 24, free_parts: 2,
    price: 39900,    // ₹399
    is_premium: false,
  },
  {
    slug: 'druid', category: 'data-engineer', title: 'Apache Druid',
    tagline: 'Real-time OLAP database — sub-second queries on petabytes',
    icon: '🐉', color: '#29ABE2', level: 'Advanced',
    parts_count: 6, sections_count: 20, free_parts: 2,
    price: 39900,
    is_premium: false,
  },
  {
    slug: 'gcp', category: 'data-engineer', title: 'GCP Data & AI',
    tagline: 'BigQuery, Dataflow, Pub/Sub, Vertex AI & full GCP data stack',
    icon: '☁️', color: '#4285F4', level: 'Intermediate',
    parts_count: 8, sections_count: 26, free_parts: 2,
    price: 49900,
    is_premium: false,
  },
  {
    slug: 'data-modeling', category: 'data-engineer', title: 'Data Modeling',
    tagline: 'Dimensional modeling, data vault & modern lakehouse patterns',
    icon: '🏗️', color: '#7C3AED', level: 'Intermediate',
    parts_count: 5, sections_count: 18, free_parts: 2,
    price: 29900,    // ₹299
    is_premium: false,
  },
  {
    slug: 'sql', category: 'data-engineer', title: 'SQL Deep Dive',
    tagline: 'From basic queries to window functions, CTEs & query optimisation',
    icon: '🗃️', color: '#336791', level: 'Beginner',
    parts_count: 6, sections_count: 20, free_parts: 2,
    price: 29900,
    is_premium: false,
  },
  {
    slug: 'machine-learning', category: 'data-science', title: 'Machine Learning',
    tagline: 'From regression to ensemble methods — theory, code & production',
    icon: '🤖', color: '#8B5CF6', level: 'Intermediate',
    parts_count: 6, sections_count: 24, free_parts: 2,
    price: 49900,
    is_premium: false,
  },
  {
    slug: 'langchain', category: 'ai', title: 'LangChain',
    tagline: 'Build LLM applications — chains, agents, RAG & memory systems',
    icon: '🔗', color: '#1C7C54', level: 'Intermediate',
    parts_count: 5, sections_count: 20, free_parts: 2,
    price: 39900,
    is_premium: false,
  },
  {
    slug: 'kubernetes', category: 'devops', title: 'Kubernetes',
    tagline: 'Container orchestration — pods to production-grade cluster ops',
    icon: '🚀', color: '#326CE5', level: 'Advanced',
    parts_count: 6, sections_count: 22, free_parts: 2,
    price: 49900,
    is_premium: false,
  },
  {
    slug: 'react', category: 'frontend', title: 'React.js',
    tagline: 'Hooks, patterns, state management & production React apps',
    icon: '⚛️', color: '#0EA5E9', level: 'Intermediate',
    parts_count: 6, sections_count: 24, free_parts: 2,
    price: 39900,
    is_premium: false,
  },
  {
    slug: 'javascript', category: 'frontend', title: 'JavaScript',
    tagline: 'The language from closures to async/await & modern ES patterns',
    icon: '🟨', color: '#D97706', level: 'Beginner',
    parts_count: 6, sections_count: 26, free_parts: 2,
    price: 29900,
    is_premium: false,
  },
]

/* ── Note parts — add more as notes are written ── */
const ALL_NOTE_PARTS = [
  ...KAFKA_PARTS.map(p => ({ ...p, note_slug: 'kafka' })),
  // ...SPARK_PARTS.map(p => ({ ...p, note_slug: 'spark' })),
]

/* ════════════════════════════════════════════════════════
   MAIN SEED FUNCTION
════════════════════════════════════════════════════════ */
async function seedContent() {
  const client = await pool.connect()
  console.log('📦 Seeding all content tables…\n')
  const stats = { notes: 0, parts: 0, topics: 0, questions: 0, posts: 0 }

  try {
    await client.query('BEGIN')

    /* ── 1. Notes metadata ── */
    console.log('📚 Notes metadata…')
    for (const n of NOTES) {
      await client.query(
        `INSERT INTO notes_metadata
           (slug, category, title, tagline, icon, color, level,
            parts_count, sections_count, free_parts, price, is_premium)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         ON CONFLICT (slug) DO UPDATE SET
           category       = EXCLUDED.category,
           title          = EXCLUDED.title,
           tagline        = EXCLUDED.tagline,
           icon           = EXCLUDED.icon,
           color          = EXCLUDED.color,
           level          = EXCLUDED.level,
           parts_count    = EXCLUDED.parts_count,
           sections_count = EXCLUDED.sections_count,
           free_parts     = EXCLUDED.free_parts,
           price          = EXCLUDED.price,
           is_premium     = EXCLUDED.is_premium,
           updated_at     = NOW()`,
        [n.slug, n.category, n.title, n.tagline, n.icon, n.color, n.level,
         n.parts_count, n.sections_count, n.free_parts, n.price, n.is_premium]
      )
      console.log(`   ✓  ${n.slug.padEnd(20)} ₹${Math.round(n.price / 100)}`)
      stats.notes++
    }

    /* ── 2. Note parts (content) ── */
    console.log('\n📝 Note parts (content blocks)…')
    for (const p of ALL_NOTE_PARTS) {
      await client.query(
        `INSERT INTO note_parts (note_slug, part_index, title, blocks)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (note_slug, part_index) DO UPDATE SET
           title = EXCLUDED.title, blocks = EXCLUDED.blocks, updated_at = NOW()`,
        [p.note_slug, p.part_index, p.title, JSON.stringify(p.blocks)]
      )
      console.log(`   ✓  ${p.note_slug}  part ${p.part_index} — ${p.title}`)
      stats.parts++
    }

    /* ── 3. Interview topics (packs with individual pricing) ── */
    console.log('\n🎯 Interview topics…')
    for (const t of INTERVIEW_TOPICS) {
      await client.query(
        `INSERT INTO interview_topics
           (slug, title, description, icon, color, price, total_questions, free_questions)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (slug) DO UPDATE SET
           title           = EXCLUDED.title,
           description     = EXCLUDED.description,
           icon            = EXCLUDED.icon,
           color           = EXCLUDED.color,
           price           = EXCLUDED.price,
           total_questions = EXCLUDED.total_questions,
           free_questions  = EXCLUDED.free_questions`,
        [t.slug, t.title, t.description, t.icon, t.color,
         t.price, t.total_questions, t.free_questions]
      )
      console.log(`   ✓  ${t.slug.padEnd(20)} ₹${Math.round(t.price / 100)}  (${t.total_questions} questions, ${t.free_questions} free)`)
      stats.topics++
    }

    /* ── 4. Interview questions ── */
    console.log('\n❓ Interview questions…')
    for (const q of INTERVIEW_QUESTIONS) {
      await client.query(
        `INSERT INTO interview_questions
           (topic_id, slug, title, description, answer, code,
            difficulty, companies, tags, hints,
            time_complexity, space_complexity, acceptance,
            order_index, is_premium)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
         ON CONFLICT (slug) DO UPDATE SET
           title            = EXCLUDED.title,
           description      = EXCLUDED.description,
           answer           = EXCLUDED.answer,
           code             = EXCLUDED.code,
           difficulty       = EXCLUDED.difficulty,
           companies        = EXCLUDED.companies,
           tags             = EXCLUDED.tags,
           hints            = EXCLUDED.hints,
           time_complexity  = EXCLUDED.time_complexity,
           space_complexity = EXCLUDED.space_complexity,
           acceptance       = EXCLUDED.acceptance,
           order_index      = EXCLUDED.order_index,
           is_premium       = EXCLUDED.is_premium,
           updated_at       = NOW()`,
        [
          q.topic_id, q.slug, q.title, q.description ?? null, q.answer ?? null,
          q.code ?? null, q.difficulty, q.companies ?? [], q.tags ?? [],
          q.hints ?? [], q.time_complexity ?? null, q.space_complexity ?? null,
          q.acceptance ?? null, q.order_index, q.is_premium,
        ]
      )
      const badge = q.is_premium ? '🔒' : '🆓'
      console.log(`   ${badge} [${q.difficulty.padEnd(6)}] ${q.topic_id.padEnd(18)} ${q.title}`)
      stats.questions++
    }

    /* ── 5. Blog posts ── */
    console.log('\n📰 Blog posts…')
    for (const post of BLOG_POSTS) {
      await client.query(
        `INSERT INTO blog_posts
           (slug, title, excerpt, content,
            author_name, author_initials, author_color,
            category_id, company, tags, read_time,
            is_published, is_featured, published_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
         ON CONFLICT (slug) DO UPDATE SET
           title           = EXCLUDED.title,
           excerpt         = EXCLUDED.excerpt,
           content         = EXCLUDED.content,
           author_name     = EXCLUDED.author_name,
           author_initials = EXCLUDED.author_initials,
           author_color    = EXCLUDED.author_color,
           category_id     = EXCLUDED.category_id,
           company         = EXCLUDED.company,
           tags            = EXCLUDED.tags,
           read_time       = EXCLUDED.read_time,
           is_published    = EXCLUDED.is_published,
           is_featured     = EXCLUDED.is_featured,
           published_at    = EXCLUDED.published_at,
           updated_at      = NOW()`,
        [
          post.slug, post.title, post.excerpt, JSON.stringify(post.content),
          post.author_name, post.author_initials, post.author_color,
          post.category_id, post.company ?? null, post.tags ?? [],
          post.read_time, post.is_published, post.is_featured ?? false,
          post.published_at ?? null,
        ]
      )
      const badge = post.is_featured ? '⭐' : '  '
      console.log(`   ${badge} ${post.category_id.padEnd(22)} ${post.title.slice(0, 50)}`)
      stats.posts++
    }

    await client.query('COMMIT')

    console.log('\n✅ Content seed complete!\n')
    console.log('─────────────────────────────────────────────────────')
    console.log(`  Notes metadata    : ${stats.notes} notes`)
    console.log(`  Note parts        : ${stats.parts} parts`)
    console.log(`  Interview topics  : ${stats.topics} topics`)
    console.log(`  Interview Qs      : ${stats.questions} questions`)
    console.log(`  Blog posts        : ${stats.posts} posts`)
    console.log('─────────────────────────────────────────────────────')
    console.log('\n  Pricing summary:')
    NOTES.forEach(n => {
      const price = n.price === 0 ? 'FREE' : `₹${Math.round(n.price / 100)}`
      console.log(`    ${n.title.padEnd(25)} ${price}`)
    })
    console.log('\n  Interview packs:')
    INTERVIEW_TOPICS.forEach(t => {
      console.log(`    ${t.title.padEnd(25)} ₹${Math.round(t.price / 100)}  (${t.free_questions} free questions)`)
    })

  } catch (err) {
    await client.query('ROLLBACK')
    console.error('❌ Content seed failed:', err.message)
    throw err
  } finally {
    client.release()
    await pool.end()
  }
}

seedContent().catch(() => process.exit(1))
