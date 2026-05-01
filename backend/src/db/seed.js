/**
 * npm run db:seed
 *
 * Creates test users and sample data.
 * Safe to re-run — uses ON CONFLICT DO NOTHING / DO UPDATE.
 */
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import pool, { query } from '../config/db.js'
import { KAFKA_PARTS } from './content/kafka.js'

/* ── Test users ──────────────────────────────────────── */
const USERS = [
  {
    name:     'Admin User',
    email:    'admin@test.local',
    password: 'Admin@1234',
    role:     'admin',
    google_id: 'dev_google_admin',
  },
  {
    name:     'Premium User',
    email:    'premium@test.local',
    password: 'Premium@1234',
    role:     'premium',
    google_id: 'dev_google_premium',
  },
  {
    name:     'Free User',
    email:    'user@test.local',
    password: 'User@1234',
    role:     'user',
    google_id: 'dev_google_user',
  },
  // Dev OAuth aliases (used by POST /auth/dev/google)
  { name: 'Dev Admin',   email: 'dev.admin@test.local',   password: null, role: 'admin',   google_id: 'dev_google_admin_alias' },
  { name: 'Dev Premium', email: 'dev.premium@test.local', password: null, role: 'premium', google_id: 'dev_google_premium_alias' },
  { name: 'Dev User',    email: 'dev.user@test.local',    password: null, role: 'user',    google_id: 'dev_google_user_alias' },
]

/* ── Notes metadata ─────────────────────────────────── */
const DEFAULT_NOTE_PRICE = 9900   // ₹99 in paise

const NOTES = [
  { slug: 'kafka',           category: 'data-engineer', title: 'Apache Kafka',      is_premium: false, price: DEFAULT_NOTE_PRICE },
  { slug: 'spark',           category: 'data-engineer', title: 'Apache Spark',      is_premium: false, price: DEFAULT_NOTE_PRICE },
  { slug: 'flink',           category: 'data-engineer', title: 'Apache Flink',      is_premium: false, price: DEFAULT_NOTE_PRICE },
  { slug: 'druid',           category: 'data-engineer', title: 'Apache Druid',      is_premium: false, price: DEFAULT_NOTE_PRICE },
  { slug: 'gcp',             category: 'data-engineer', title: 'GCP Data & AI',     is_premium: false, price: DEFAULT_NOTE_PRICE },
  { slug: 'data-modeling',   category: 'data-engineer', title: 'Data Modeling',     is_premium: false, price: DEFAULT_NOTE_PRICE },
  { slug: 'sql',             category: 'data-engineer', title: 'SQL Deep Dive',     is_premium: false, price: DEFAULT_NOTE_PRICE },
  { slug: 'machine-learning', category: 'data-science', title: 'Machine Learning',  is_premium: false, price: DEFAULT_NOTE_PRICE },
  { slug: 'langchain',       category: 'ai',            title: 'LangChain',         is_premium: false, price: DEFAULT_NOTE_PRICE },
  { slug: 'kubernetes',      category: 'devops',        title: 'Kubernetes',        is_premium: false, price: DEFAULT_NOTE_PRICE },
  { slug: 'react',           category: 'frontend',      title: 'React.js',          is_premium: false, price: DEFAULT_NOTE_PRICE },
  { slug: 'javascript',      category: 'frontend',      title: 'JavaScript',        is_premium: false, price: DEFAULT_NOTE_PRICE },
]

/* ── Courses — slugs MUST match COURSES_DATA keys in app/src/data/courses.js ── */
const COURSES = [
  {
    slug: 'kafka-masterclass', is_published: true, price: 99900, soon: false,
    title: 'Apache Kafka Masterclass', tagline: 'Go from zero to production — internals, streams, connect & ops',
    description: 'Deep-dive into Kafka internals, replication, consumers, producers and stream processing at scale.',
    color: '#4A90D9', icon_slug: 'kafka', instructor: 'Rahul Yadav', level: 'Intermediate',
    duration_text: '14h 20m', lesson_count: 52, module_count: 6, free_modules: 1, rating: 4.9,
    highlights: ['Consumer Groups & Offsets', 'ISR & Replication', 'Kafka Streams & ksqlDB', 'Schema Registry', 'Production Tuning'],
    module_titles: ['Architecture & Core Concepts', 'Producers & Consumer Groups', 'Brokers, Topics & Replication', 'Kafka Streams', 'Schema Registry & Kafka Connect', 'Production Operations'],
  },
  {
    slug: 'spark-masterclass', is_published: false, price: 99900, soon: true,
    title: 'Apache Spark Masterclass', tagline: 'RDDs to structured streaming — performance, MLlib & cloud deploy',
    description: 'Unified analytics engine — from RDDs to DataFrames, Spark SQL, Structured Streaming and production MLlib.',
    color: '#E25A1C', icon_slug: 'spark', instructor: 'Rahul Yadav', level: 'Advanced',
    duration_text: '18h 45m', lesson_count: 72, module_count: 8, free_modules: 1, rating: 4.8,
    highlights: ['Spark Execution Model', 'DataFrame & Spark SQL', 'Structured Streaming', 'Performance Tuning', 'Cloud Deployment'],
    module_titles: ['Architecture & Execution Model', 'RDDs, DataFrames & Datasets', 'Spark SQL & Query Optimization', 'Structured Streaming', 'MLlib & Feature Engineering', 'GraphX', 'Performance Tuning', 'Production & Cloud'],
  },
  {
    slug: 'gcp-masterclass', is_published: false, price: 99900, soon: true,
    title: 'GCP Data & AI Masterclass', tagline: 'BigQuery, Dataflow, Pub/Sub, Vertex AI & the full GCP data stack',
    description: 'Hands-on guide to every major GCP data service — from BigQuery internals to Vertex AI pipelines.',
    color: '#4285F4', icon_slug: 'gcp', instructor: 'Rahul Yadav', level: 'Intermediate',
    duration_text: '20h 00m', lesson_count: 80, module_count: 8, free_modules: 1, rating: 4.9,
    highlights: ['BigQuery Internals', 'Dataflow Pipelines', 'Vertex AI & MLOps', 'Cost Optimization'],
    module_titles: ['Core Services Overview', 'BigQuery Deep Dive', 'Dataflow & Apache Beam', 'Cloud Pub/Sub', 'Vertex AI & ML Pipelines', 'Orchestration', 'Networking & IAM', 'Cost & Production'],
  },
]

/* ─────────────────────────────────────────────────────────
   RUN
───────────────────────────────────────────────────────── */
async function seed() {
  console.log('🌱 Seeding database…\n')
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    /* ── Users ── */
    console.log('👤 Creating test users…')
    for (const u of USERS) {
      const hash = u.password ? await bcrypt.hash(u.password, 10) : null
      await client.query(
        `INSERT INTO users (name, email, password_hash, role, google_id, email_verified)
         VALUES ($1, $2, $3, $4, $5, TRUE)
         ON CONFLICT (email) DO UPDATE
           SET role           = EXCLUDED.role,
               google_id      = EXCLUDED.google_id,
               email_verified = TRUE,
               updated_at     = NOW()`,
        [u.name, u.email, hash, u.role, u.google_id]
      )
      console.log(`   ✓  ${u.role.padEnd(8)} ${u.email}${u.password ? `  (password: ${u.password})` : '  (OAuth only)'}`)
    }

    /* ── Premium subscription for premium users ── */
    const premResult = await client.query(
      "SELECT id FROM users WHERE role = 'premium' AND email NOT LIKE 'dev.%'"
    )
    for (const { id } of premResult.rows) {
      await client.query(
        `INSERT INTO premium_subscriptions (user_id, plan, expires_at)
         VALUES ($1, 'yearly', NOW() + INTERVAL '1 year')
         ON CONFLICT DO NOTHING`,
        [id]
      )
    }

    /* ── Notes metadata ── */
    console.log('\n📄 Seeding notes metadata…')
    for (const n of NOTES) {
      await client.query(
        `INSERT INTO notes_metadata (slug, category, title, is_premium, price)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (slug) DO UPDATE
           SET category = EXCLUDED.category,
               title    = EXCLUDED.title,
               price    = EXCLUDED.price`,
        [n.slug, n.category, n.title, n.is_premium, n.price]
      )
      console.log(`   ✓  ${n.slug}`)
    }

    /* ── Note parts (DB-backed content) ── */
    console.log('\n📝 Seeding note parts…')
    for (const part of KAFKA_PARTS) {
      await client.query(
        `INSERT INTO note_parts (note_slug, part_index, title, blocks)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (note_slug, part_index) DO UPDATE
           SET title = EXCLUDED.title,
               blocks = EXCLUDED.blocks,
               updated_at = NOW()`,
        ['kafka', part.part_index, part.title, JSON.stringify(part.blocks)]
      )
      console.log(`   ✓  kafka  part ${part.part_index} — ${part.title}`)
    }

    /* ── Courses ── */
    console.log('\n📚 Creating sample courses…')
    for (const c of COURSES) {
      const result = await client.query(
        `INSERT INTO courses
           (slug, title, description, tagline, price, is_published, soon,
            color, icon_slug, instructor, level, duration_text,
            lesson_count, module_count, free_modules, rating, highlights, module_titles)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
         ON CONFLICT (slug) DO UPDATE SET
           title         = EXCLUDED.title,
           description   = EXCLUDED.description,
           tagline       = EXCLUDED.tagline,
           price         = EXCLUDED.price,
           is_published  = EXCLUDED.is_published,
           soon          = EXCLUDED.soon,
           color         = EXCLUDED.color,
           icon_slug     = EXCLUDED.icon_slug,
           instructor    = EXCLUDED.instructor,
           level         = EXCLUDED.level,
           duration_text = EXCLUDED.duration_text,
           lesson_count  = EXCLUDED.lesson_count,
           module_count  = EXCLUDED.module_count,
           free_modules  = EXCLUDED.free_modules,
           rating        = EXCLUDED.rating,
           highlights    = EXCLUDED.highlights,
           module_titles = EXCLUDED.module_titles,
           updated_at    = NOW()
         RETURNING id, slug`,
        [
          c.slug, c.title, c.description, c.tagline, c.price, c.is_published, c.soon,
          c.color, c.icon_slug, c.instructor, c.level, c.duration_text,
          c.lesson_count, c.module_count, c.free_modules, c.rating,
          JSON.stringify(c.highlights), JSON.stringify(c.module_titles),
        ]
      )
      const courseId = result.rows[0].id
      console.log(`   ✓  ${c.slug} (${c.is_published ? 'live' : 'coming soon'})`)

      if (!c.is_published) continue

      // Seed sections from real module titles (upsert by order_index)
      const moduleTitles = c.module_titles
      for (let i = 0; i < moduleTitles.length; i++) {
        const secResult = await client.query(
          `INSERT INTO sections (course_id, title, order_index)
           VALUES ($1, $2, $3)
           ON CONFLICT (course_id, order_index) DO UPDATE
             SET title = EXCLUDED.title
           RETURNING id`,
          [courseId, moduleTitles[i], i]
        )
        const sectionId = secResult.rows[0]?.id
        if (!sectionId) continue

        // Seed 3 sample lessons per section (idempotent via section+order_index)
        const lessonsPerSection = Math.ceil(c.lesson_count / moduleTitles.length)
        for (let l = 0; l < Math.min(lessonsPerSection, 4); l++) {
          const lessonTitles = [
            `Introduction to ${moduleTitles[i]}`,
            `Deep Dive: ${moduleTitles[i]} Internals`,
            `Hands-on: ${moduleTitles[i]} in Practice`,
            `${moduleTitles[i]} — Production Patterns`,
          ]
          await client.query(
            `INSERT INTO lessons (section_id, title, duration_seconds, is_preview, order_index)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT DO NOTHING`,
            [sectionId, lessonTitles[l], 420 + l * 120, l === 0, l]
          )
        }
      }
    }

    await client.query('COMMIT')
    console.log('\n✅ Seed complete!\n')

    console.log('─────────────────────────────────────────────')
    console.log('  Test credentials')
    console.log('─────────────────────────────────────────────')
    console.log('  Role     Email                   Password')
    console.log('  admin    admin@test.local         Admin@1234')
    console.log('  premium  premium@test.local       Premium@1234')
    console.log('  user     user@test.local          User@1234')
    console.log('─────────────────────────────────────────────')
    console.log('  Or use the dummy Google OAuth endpoint:')
    console.log('  POST /api/v1/auth/dev/google  { "role": "admin" }')
    console.log('─────────────────────────────────────────────\n')

  } catch (err) {
    await client.query('ROLLBACK')
    console.error('❌ Seed failed:', err.message)
    throw err
  } finally {
    client.release()
    await pool.end()
  }
}

seed().catch(() => process.exit(1))
