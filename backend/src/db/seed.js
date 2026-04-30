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
const NOTES = [
  { slug: 'kafka',          category: 'data-engineer', title: 'Apache Kafka',      is_premium: false },
  { slug: 'spark',          category: 'data-engineer', title: 'Apache Spark',      is_premium: false },
  { slug: 'flink',          category: 'data-engineer', title: 'Apache Flink',      is_premium: false },
  { slug: 'druid',          category: 'data-engineer', title: 'Apache Druid',      is_premium: false },
  { slug: 'gcp',            category: 'data-engineer', title: 'GCP Data & AI',     is_premium: false },
  { slug: 'data-modeling',  category: 'data-engineer', title: 'Data Modeling',     is_premium: false },
  { slug: 'sql',            category: 'data-engineer', title: 'SQL Deep Dive',     is_premium: false },
  { slug: 'machine-learning',category:'data-science',  title: 'Machine Learning',  is_premium: false },
  { slug: 'langchain',      category: 'ai',            title: 'LangChain',         is_premium: false },
  { slug: 'kubernetes',     category: 'devops',        title: 'Kubernetes',        is_premium: false },
  { slug: 'react',          category: 'frontend',      title: 'React.js',          is_premium: false },
  { slug: 'javascript',     category: 'frontend',      title: 'JavaScript',        is_premium: false },
]

/* ── Sample courses ──────────────────────────────────── */
const COURSES = [
  {
    slug:         'apache-kafka-mastery',
    title:        'Apache Kafka Mastery',
    description:  'Deep-dive into Kafka internals, consumers, producers and stream processing.',
    price:        49900,
    is_published: true,
  },
  {
    slug:         'system-design-fundamentals',
    title:        'System Design Fundamentals',
    description:  'Learn to design scalable distributed systems from scratch.',
    price:        49900,
    is_published: true,
  },
  {
    slug:         'data-engineering-bootcamp',
    title:        'Data Engineering Bootcamp',
    description:  'Spark, Flink, Druid and modern data pipeline design.',
    price:        59900,
    is_published: false,   // coming soon
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
        `INSERT INTO users (name, email, password_hash, role, google_id)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO UPDATE
           SET role      = EXCLUDED.role,
               google_id = EXCLUDED.google_id,
               updated_at = NOW()`,
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
        `INSERT INTO notes_metadata (slug, category, title, is_premium)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (slug) DO UPDATE
           SET category = EXCLUDED.category,
               title    = EXCLUDED.title`,
        [n.slug, n.category, n.title, n.is_premium]
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
        `INSERT INTO courses (slug, title, description, price, is_published)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (slug) DO UPDATE
           SET title = EXCLUDED.title, updated_at = NOW()
         RETURNING id, slug`,
        [c.slug, c.title, c.description, c.price, c.is_published]
      )
      const courseId = result.rows[0].id
      console.log(`   ✓  ${c.slug} (${c.is_published ? 'live' : 'coming soon'})`)

      if (!c.is_published) continue

      // Add 2 sample sections with lessons
      for (let s = 1; s <= 2; s++) {
        const secResult = await client.query(
          `INSERT INTO sections (course_id, title, order_index)
           VALUES ($1, $2, $3)
           ON CONFLICT DO NOTHING
           RETURNING id`,
          [courseId, `Section ${s} — ${c.title}`, s - 1]
        )
        const sectionId = secResult.rows[0]?.id
        if (!sectionId) continue

        for (let l = 1; l <= 3; l++) {
          await client.query(
            `INSERT INTO lessons (section_id, title, duration_seconds, is_preview, order_index)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT DO NOTHING`,
            [
              sectionId,
              `Lesson ${l} — Topic ${l}`,
              300 + l * 60,
              l === 1,          // first lesson is a free preview
              l - 1,
            ]
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
