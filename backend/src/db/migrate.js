/**
 * npm run db:migrate
 * Reads schema.sql and executes it against DATABASE_URL.
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import 'dotenv/config'
import pool from '../config/db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const sql = readFileSync(join(__dirname, 'schema.sql'), 'utf8')

console.log('🔄 Running migrations…')
try {
  await pool.query(sql)
  console.log('✅ Schema applied successfully.')
} catch (err) {
  console.error('❌ Migration failed:', err.message)
  process.exit(1)
} finally {
  await pool.end()
}
