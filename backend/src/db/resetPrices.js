/**
 * npm run db:reset-prices
 *
 * Resets ALL note and interview topic prices to ₹99 (9900 paise).
 * Courses are reset to ₹999 (99900 paise).
 * Run this after any seed that had wrong price values.
 */
import 'dotenv/config'
import pool from '../config/db.js'

const NOTE_PRICE     = 9900    // ₹99
const INTERVIEW_PRICE = 9900   // ₹99
const COURSE_PRICE   = 99900   // ₹999

console.log('💰 Resetting all prices to defaults…\n')

try {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const notes = await client.query(
      `UPDATE notes_metadata SET price = $1, updated_at = NOW()
       WHERE price != $1 OR price IS NULL
       RETURNING slug, price`,
      [NOTE_PRICE]
    )
    console.log(`📚 Notes reset:      ${notes.rowCount} rows → ₹${NOTE_PRICE / 100}`)

    const topics = await client.query(
      `UPDATE interview_topics SET price = $1
       WHERE price != $1 OR price IS NULL
       RETURNING slug, price`,
      [INTERVIEW_PRICE]
    )
    console.log(`🎯 Interview topics: ${topics.rowCount} rows → ₹${INTERVIEW_PRICE / 100}`)

    const courses = await client.query(
      `UPDATE courses SET price = $1, updated_at = NOW()
       WHERE price != $1 OR price IS NULL
       RETURNING slug, price`,
      [COURSE_PRICE]
    )
    console.log(`🎓 Courses reset:    ${courses.rowCount} rows → ₹${COURSE_PRICE / 100}`)

    await client.query('COMMIT')
    console.log('\n✅ All prices reset successfully!')
    console.log('   Notes & interviews: ₹99  |  Courses: ₹999')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
} catch (err) {
  console.error('❌ Failed:', err.message)
  process.exit(1)
} finally {
  await pool.end()
}
