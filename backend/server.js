import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'

// Config / connections
import './src/config/db.js'
import './src/config/redis.js'
import './src/config/passport.js'
import passport from 'passport'

// Routes
import authRoutes      from './src/routes/auth.js'
import usersRoutes     from './src/routes/users.js'
import notesRoutes     from './src/routes/notes.js'
import coursesRoutes   from './src/routes/courses.js'
import paymentsRoutes  from './src/routes/payments.js'
import adminRoutes     from './src/routes/admin.js'
import blogRoutes      from './src/routes/blog.js'
import interviewRoutes from './src/routes/interview.js'
import trackRoutes     from './src/routes/track.js'
import { getPlatformStats } from './src/controllers/statsController.js'

const app  = express()
const PORT = process.env.PORT || 4000

/* ─────────────────────────────────────────────────────
   SECURITY
───────────────────────────────────────────────────── */
app.set('trust proxy', 1)

app.use(helmet())

app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,                    // allow cookies
  methods:     ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
}))

/* ─────────────────────────────────────────────────────
   RATE LIMITING
───────────────────────────────────────────────────── */
// Global: 200 req / 15 min per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      200,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: 'Too many requests, please try again later.' },
}))

// Auth endpoints: stricter 20 req / 15 min
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      20,
  message:  { error: 'Too many auth attempts, please try again later.' },
})

/* ─────────────────────────────────────────────────────
   BODY PARSING
───────────────────────────────────────────────────── */
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(passport.initialize())

/* ─────────────────────────────────────────────────────
   HEALTH CHECK
───────────────────────────────────────────────────── */
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: Date.now() }))

/* ─────────────────────────────────────────────────────
   ROUTES
───────────────────────────────────────────────────── */
app.use('/api/v1/auth',      authLimiter, authRoutes)
app.use('/api/v1/users',     usersRoutes)
app.use('/api/v1/notes',     notesRoutes)
app.use('/api/v1/courses',   coursesRoutes)
app.use('/api/v1/payments',  paymentsRoutes)
app.use('/api/v1/admin',     adminRoutes)
app.use('/api/v1/blog',      blogRoutes)
app.use('/api/v1/interview', interviewRoutes)
app.use('/api/v1/track',     trackRoutes)
app.get('/api/v1/stats',    getPlatformStats)

/* ─────────────────────────────────────────────────────
   404
───────────────────────────────────────────────────── */
app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }))

/* ─────────────────────────────────────────────────────
   GLOBAL ERROR HANDLER
───────────────────────────────────────────────────── */
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('─── Unhandled error ───')
  console.error('message :', err.message)
  console.error('code    :', err.code)
  console.error('stack   :', err.stack)
  console.error('───────────────────────')
  const status = err.status || err.statusCode || 500
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error.'
      : (err.message || err.code || 'Unknown error')
  res.status(status).json({ error: message })
})

/* ─────────────────────────────────────────────────────
   START
───────────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`)
})
