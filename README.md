# EngiNotes — Engineering Learning Platform

A full-stack learning platform for data engineers and software engineers. Buy individual deep-dive notes, video courses, and interview prep packs. No subscriptions — pay only for what you need, valid for 2 years.

**Stack:** React 19 + Vite · Node.js + Express · PostgreSQL · Redis · Tailwind CSS v4 · Framer Motion

---

## What's built

### Content
- **12 deep-dive notes** — Apache Kafka, Spark, Flink, Druid, GCP, Data Modeling, SQL, Machine Learning, LangChain, Kubernetes, React, JavaScript
- **6 interview topic packs** — DSA, System Design, Data Engineering, SQL, Machine Learning, Behavioural (free preview + paid full access)
- **Video courses** — Apache Kafka Masterclass (live), Spark + GCP (coming soon)
- **Blog** — articles and interview stories

### Auth
- Email/password registration with 6-digit OTP email verification
- JWT access tokens (15 min) + httpOnly refresh tokens (7 days) with rotation
- Google OAuth
- Brute-force protection — account locked for 15 min after 5 failed login attempts
- Forgot password / reset via OTP email

### Payments (Razorpay / Demo mode)
- Per-item purchases — notes ₹99, interview packs ₹99, courses ₹999
- 2-year access per item
- Admin can override per-item prices from the admin panel
- Demo mode active when `RAZORPAY_KEY_ID` is not set — no real charge

### Features
- Global search across notes, questions, courses (Ctrl/Cmd+K)
- Interview question filters — difficulty, company, tag, text search
- Course lesson progress tracking — mark lessons complete, resume button, progress bar
- Bookmarks for notes
- Dark mode toggle (Settings page)
- Personalized dashboard showing owned content with expiry dates

### Security
- Helmet, CORS locked to `CLIENT_URL`, global rate limiter (200 req/15 min)
- Auth endpoints: stricter limiter (20 req/15 min)
- All DB queries parameterised — no SQL injection surface
- JWT blacklist via Redis on logout
- Admin routes guarded by `requireAdmin` middleware
- Input validation via `express-validator` on all write endpoints

### Admin panel (`/admin`)
- Users — list, search, change role (user / premium)
- Pricing — set per-item price for any note, course, or interview pack
- Content — manage blog posts, interview questions
- Analytics — revenue and sign-up stats
- Audit logs

---

## Project layout

```
Notes/                          ← repo root
├── README.md
├── CLAUDE.md                   ← AI assistant context
├── SETUP.md                    ← local dev setup guide
├── app/                        ← React + Vite frontend
│   ├── src/
│   │   ├── App.jsx             ← routes
│   │   ├── api/client.js       ← axios instance + all API helpers
│   │   ├── store/authStore.js  ← Zustand auth + purchases
│   │   ├── hooks/useAuth.js
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── auth/
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   ├── PremiumRoute.jsx  ← waits for purchasesLoading
│   │   │   │   └── AdminRoute.jsx
│   │   │   └── content/        ← note renderer components
│   │   ├── data/               ← static category/course metadata
│   │   └── pages/
│   │       ├── auth/           ← Login, Signup (OTP step), ForgotPassword
│   │       ├── notes/          ← Notes, CategoryPage, NotePage + static note files
│   │       ├── courses/        ← Courses, CourseCategoryPage, CoursePage
│   │       ├── interview/      ← Interview, InterviewCategoryPage, QuestionPage
│   │       ├── dashboard/      ← personalised owned-content dashboard
│   │       ├── upgrade/        ← Upgrade, Checkout, PaymentSuccess
│   │       ├── settings/
│   │       ├── blog/
│   │       └── admin/
│   └── package.json
└── backend/
    ├── server.js               ← Express app entry
    ├── src/
    │   ├── config/             ← db.js, redis.js, passport.js, payment.js
    │   ├── middleware/auth.js  ← requireAuth, requirePremium, requireAdmin, optionalAuth
    │   ├── routes/             ← auth, users, notes, courses, payments, interview, search, admin, …
    │   ├── controllers/        ← one file per route group
    │   ├── services/
    │   │   └── emailService.js ← Resend transactional emails
    │   └── db/
    │       ├── schema.sql      ← full schema, idempotent
    │       ├── migrate.js      ← runs schema.sql
    │       ├── seed.js         ← test users + courses + note metadata
    │       ├── seedContent.js  ← all note content, interview questions, blog posts
    │       └── resetPrices.js  ← resets all prices to ₹99/₹999 defaults
    └── package.json
```

---

## Routes

### Frontend

| Path | Component | Access |
|------|-----------|--------|
| `/` | Home | Public |
| `/notes` | Notes | Public |
| `/notes/:category/:slug` | NotePage | Public (parts 0–1 free) |
| `/courses` | Courses | Public |
| `/courses/:categoryId/:slug` | CoursePage | Public (preview free) |
| `/interview` | Interview | Public |
| `/interview/:topicSlug` | InterviewCategoryPage | Public (10 questions free) |
| `/interview/:topicSlug/:questionSlug` | QuestionPage | Public / gated |
| `/blog` | Blog | Public |
| `/signup` | Signup + OTP step | Public |
| `/login` | Login | Public |
| `/forgot-password` | ForgotPassword | Public |
| `/dashboard` | Dashboard | Auth |
| `/settings` | Settings | Auth |
| `/upgrade` | Upgrade | Public |
| `/checkout` | Checkout | Auth |
| `/payment/success` | PaymentSuccess | Auth |
| `/admin` | AdminDashboard | Admin |

### Backend API (`/api/v1/`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | — | Register → sends OTP |
| POST | `/auth/verify-email` | — | Verify OTP → issues JWT |
| POST | `/auth/resend-otp` | — | Resend verification OTP |
| POST | `/auth/login` | — | Login (blocked if unverified) |
| POST | `/auth/logout` | ✓ | Logout + blacklist token |
| POST | `/auth/forgot-password` | — | Send reset OTP |
| POST | `/auth/reset-password` | — | OTP + new password |
| POST | `/auth/refresh-token` | cookie | Rotate JWT |
| GET | `/notes` | — | List note metadata |
| GET | `/notes/:slug` | — | Single note metadata |
| GET | `/notes/:slug/parts/:idx` | optional | Part content (gated after free_parts) |
| GET | `/courses` | — | Published courses |
| GET | `/courses/my-progress` | ✓ | Progress for all enrolled courses |
| GET | `/courses/:slug` | optional | Course + sections + lessons + progress |
| POST | `/courses/:slug/lessons/:id/complete` | ✓ | Mark lesson done |
| GET | `/interview/topics` | — | Published topic packs |
| GET | `/interview/:topicSlug/questions` | optional | Questions (filters: difficulty, company, tag, search) |
| GET | `/search?q=` | — | Search across notes, courses, questions |
| GET | `/payments/plans` | — | Global pricing config |
| POST | `/payments/create-order` | ✓ | Create Razorpay / dummy order |
| POST | `/payments/verify` | ✓ | Verify payment → unlock access |
| GET | `/payments/my-purchases` | ✓ | User's active purchases |
| GET | `/admin/*` | Admin | Users, pricing, analytics, logs |

---

## Pricing

| Item | Default | Stored as |
|------|---------|-----------|
| Note | ₹99 | `notes_metadata.price` (paise) |
| Interview pack | ₹99 | `interview_topics.price` (paise) |
| Course | ₹999 | `courses.price` (paise) |

Admin can change any price individually from `/admin/pricing`. Run `npm run db:reset-prices` to reset everything back to defaults.

---

## Key design decisions

- **Per-item purchases, not subscriptions.** Each item is purchased once, valid for 2 years.
- **`isPremium` reflects purchases.** After buying any item, `isPremium` flips `true` in the auth store so all existing UI gates work correctly.
- **`purchasesLoading` guard in `PremiumRoute`.** Prevents the gate from redirecting logged-in users before their purchases have loaded from the API.
- **OTP reuses `otp_code` / `otp_expires_at` columns.** Email verification and password reset share the same columns — they never overlap because only verified users can reset and only unverified users need to verify.
- **Search is client-side for interview filters, server-side for global.** Interview questions load once; filters apply instantly. Global search hits `GET /search` with a 280ms debounce.
- **Course display data lives in the DB.** `color`, `instructor`, `level`, `duration_text`, `highlights`, `module_titles` etc. are seeded into the `courses` table and served from the API — nothing is hardcoded in the component.
