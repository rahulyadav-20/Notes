import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
  max:             20,   // max connections in pool
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
})

// Verify connection on startup
pool.on('connect', () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('✅ PostgreSQL connected')
  }
})

pool.on('error', (err) => {
  console.error('❌ PostgreSQL pool error:', err.message)
})

/**
 * Run a parameterised query.
 * Usage: db.query('SELECT * FROM users WHERE id = $1', [id])
 */
export const query = (text, params) => pool.query(text, params)

/**
 * Borrow a client for multi-statement transactions.
 * Always call client.release() in a finally block.
 */
export const getClient = () => pool.connect()

export default pool
