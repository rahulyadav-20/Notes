# EngiNotes — Claude Context

> React 19 + Vite frontend · Node.js + Express backend · PostgreSQL + Redis
> Branch: `dev` · See `SETUP.md` for local dev setup · See `README.md` for full feature list

---

## Current project state

All core phases are live:

| Feature | Status |
|---------|--------|
| Deep-dive notes (12 topics) | ✅ Live |
| Auth — register/login/Google OAuth | ✅ Live |
| Email verification via OTP | ✅ Live |
| Forgot password / reset via OTP | ✅ Live |
| Brute-force login protection | ✅ Live |
| Per-item payments (Razorpay + dummy mode) | ✅ Live |
| Video courses (Kafka live, Spark/GCP coming) | ✅ Live |
| Course lesson progress tracking | ✅ Live |
| Interview prep with filters | ✅ Live |
| Global search (Ctrl+K) | ✅ Live |
| Admin dashboard + pricing | ✅ Live |
| Personalised dashboard | ✅ Live |
| Blog | ✅ Live |

---

## Repo structure

```
Notes/
├── CLAUDE.md          ← this file
├── README.md          ← feature overview + API reference
├── SETUP.md           ← local dev setup
├── app/               ← React + Vite frontend (port 5173)
└── backend/           ← Express API (port 4000)
```

---

## Frontend key files

```
app/src/
├── App.jsx                          ← all routes (lazy-loaded)
├── api/client.js                    ← axios instance + every API call
├── store/authStore.js               ← Zustand: user, isPremium, purchases, purchasesLoading, owns()
├── hooks/useAuth.js                 ← thin wrapper over authStore
├── components/
│   ├── layout/Navbar.jsx            ← includes SearchBar, UserMenu
│   ├── layout/SearchBar.jsx         ← global search dropdown (Ctrl+K)
│   ├── auth/PremiumRoute.jsx        ← blocks until purchasesLoading = false
│   └── content/                     ← note renderer components
├── pages/
│   ├── auth/
│   │   ├── Login.jsx                ← handles 403 requiresVerification
│   │   ├── Signup.jsx               ← step 1 form + step 2 OTP inline
│   │   └── ForgotPassword.jsx       ← step 1 email + step 2 OTP + new password
│   ├── notes/NotePage.jsx           ← fetches per-note price on 403, owns() check
│   ├── courses/CoursePage.jsx       ← ALL data from API (no static hardcoding)
│   ├── dashboard/Dashboard.jsx      ← shows owned notes/courses/packs with expiry
│   ├── upgrade/
│   │   ├── Checkout.jsx             ← owns() check in picker, 409 → redirect to content
│   │   └── PaymentSuccess.jsx       ← shows specific purchased item, not generic grid
│   └── settings/Settings.jsx
└── data/
    ├── categories.js                ← NOTES_DATA (slug → name/color/icon/parts)
    └── courses.js                   ← COURSES_DATA + COURSE_CATEGORIES (slug → display data)
```

---

## Backend key files

```
backend/
├── server.js                        ← Express app, routes, middleware
└── src/
    ├── config/
    │   ├── db.js                    ← pg pool + query helper
    │   ├── redis.js                 ← ioredis + cacheGet/cacheSet/blacklistToken
    │   ├── passport.js              ← Google OAuth strategy (sets email_verified=true)
    │   └── payment.js               ← ITEM_PRICES, VALID_DAYS, expiresAt()
    ├── middleware/auth.js           ← requireAuth, requirePremium, requireAdmin, optionalAuth
    ├── services/emailService.js     ← sendOtpEmail, sendPasswordResetEmail (Resend / dev log)
    ├── controllers/
    │   ├── authController.js        ← register→OTP, verifyEmail, resendOtp, login, logout,
    │   │                               forgotPassword, resetPassword, refreshToken, googleCallback
    │   ├── notesController.js       ← listNotes, getNote, getNotePart (free_parts gate)
    │   ├── coursesController.js     ← listCourses, getCourse (all display fields),
    │   │                               getLesson, markLessonComplete, getMyProgress
    │   ├── paymentsController.js    ← getPlans, createOrder (uses per-item DB price),
    │   │                               verifyPayment, myPurchases
    │   ├── interviewController.js   ← listTopics, listQuestions (filters: difficulty/company/tag/search),
    │   │                               getQuestion
    │   ├── searchController.js      ← GET /search?q= (notes + topics + questions + courses)
    │   └── adminController.js       ← users, pricing, analytics, logs, user access grants
    └── db/
        ├── schema.sql               ← full schema (idempotent, run via db:migrate)
        ├── seed.js                  ← test users + course data (with all display fields)
        ├── seedContent.js           ← note metadata (price=9900), interview topics (price=9900),
        │                               interview questions, blog posts
        └── resetPrices.js           ← sets notes/interviews to ₹99, courses to ₹999
```

---

## Auth store — important behaviour

```js
// isPremium is true when:
// 1. user.role === 'admin'
// 2. user has any active purchase (notes.length + interviews.length + courses.length > 0)
// It starts false and flips when myPurchases() resolves (non-blocking after getMe()).

// purchasesLoading is true from mount until myPurchases() completes.
// PremiumRoute blocks (returns null) while purchasesLoading is true —
// prevents logged-in buyers from being bounced to /upgrade.

// owns(type, slug) — checks purchases store, returns true for admins always.
// type: 'note' | 'interview' | 'course'
```

---

## Pricing system

- All prices stored in **paise** in the DB (100 paise = ₹1)
- Defaults: notes ₹99 (9900), interview packs ₹99 (9900), courses ₹999 (99900)
- Set via env: `PRICE_NOTE`, `PRICE_COURSE`, `PRICE_INTERVIEW`
- Admin can override per-item via `/admin/pricing` → stored in `notes_metadata.price`, `courses.price`, `interview_topics.price`
- `createOrder` uses the DB per-item price if set, otherwise falls back to env default
- Run `npm run db:reset-prices` to reset all prices to defaults

---

## Database schema (key tables)

```sql
users                    id, name, email, password_hash, google_id, role,
                         email_verified, otp_code, otp_expires_at,
                         failed_login_attempts, locked_until, is_active

notes_metadata           slug, category, title, tagline, icon, color, level,
                         parts_count, sections_count, free_parts, price, is_premium

note_purchases           user_id, note_slug, payment_id, amount, expires_at
interview_purchases      user_id, topic_slug, payment_id, amount, expires_at
enrollments              user_id, course_id, payment_id, expires_at
user_lesson_progress     user_id, lesson_id, course_id, completed_at

courses                  slug, title, tagline, description, color, icon_slug,
                         instructor, level, duration_text, lesson_count, module_count,
                         free_modules, rating, highlights (jsonb), module_titles (jsonb),
                         price, is_published, soon

sections                 course_id, title, order_index  [UNIQUE(course_id, order_index)]
lessons                  section_id, title, duration_seconds, is_preview, order_index

interview_topics         slug, title, description, icon, color, price, is_published
interview_questions      topic_id, slug, title, difficulty, companies (jsonb), tags (jsonb),
                         answer, code, hints, time_complexity, space_complexity, is_premium

refresh_tokens           user_id, token_hash, expires_at
payments                 user_id, course_id, razorpay_order_id, amount, status
user_note_bookmarks      user_id, note_slug
blog_posts               slug, title, content, author_id, is_published
audit_logs               admin_id, action, target_user_id, old_value, new_value
```

---

## Dev commands

```bash
# Frontend
cd app && npm run dev          # http://localhost:5173

# Backend
cd backend && npm run dev      # http://localhost:4000

# Database
npm run db:migrate             # apply schema changes
npm run db:seed                # users + courses (all display fields)
npm run db:content             # notes + interview questions + blog posts
npm run db:reset-prices        # reset all prices to ₹99/₹999
npm run docker:up              # start Postgres + Redis
npm run docker:reset           # wipe DB and restart containers
```

---

## Topic colors

| Topic | Primary | Icon |
|-------|---------|------|
| Apache Kafka | `#4A90D9` | K |
| Apache Spark | `#E25A1C` | S |
| Apache Flink | `#E6522C` | F |
| Apache Druid | `#29ABE2` | D |
| GCP | `#4285F4` | G |
| Data Modeling | `#7C3AED` | D |
| SQL | `#336791` | S |
| Machine Learning | `#8B5CF6` | M |
| LangChain | `#1C7C54` | L |
| React | `#0EA5E9` | R |
| JavaScript | `#D97706` | J |

---

## Note component API (quick ref)

```jsx
<Cover title="Apache Kafka" subtitle="Distributed Event Streaming"
  stats={[{num:'6',label:'Parts'},{num:'14',label:'Sections'}]}
  iconLetter="K" gradStart="#4A90D9" gradEnd="#5DB85B" edition="Kafka 3.7 · 2025"/>

<PartHeader part={1} title="Foundations" subtitle="Core concepts"/>

<Section title="1 — Why Kafka Exists">
  <SubSection title="1.1 The Messaging Problem">
    <Callout type="info"    label="Engineering Insight">text</Callout>
    <Callout type="pitfall" label="Common Pitfall">text</Callout>
    <Callout type="note"    label="Production Note">text</Callout>
    <CodeBlock label="Example" lang="Java">{'// code'}</CodeBlock>
    <DataTable headers={['Col1','Col2']} rows={[['a','b']]}/>
  </SubSection>
</Section>

<Divider />
```

---

## Adding a new note

1. Create `app/src/pages/notes/<category>/<Slug>.jsx` using the component API above
2. Add the slug to `NOTES_DATA` in `app/src/data/categories.js`
3. Add to `NOTE_REGISTRY` in `app/src/pages/notes/NotePage.jsx` (static fallback)
4. Add to `NOTES` array in `backend/src/db/seedContent.js` with `price: 9900`
5. Run `npm run db:content` to seed the metadata

---

## Adding a new note part to the DB

Add an entry to the relevant parts array in `backend/src/db/content/` and run `npm run db:content`.
Parts `0` and `1` (index 0 and 1) are free — everything from index 2 onwards requires purchase.

---

## Known limitations / next steps

- Course video player (lesson watch page) not yet built — `/courses/:slug/learn` is a future route
- PDF download for notes not yet implemented
- Email notifications for purchase expiry not yet scheduled
- `soon: true` courses (Spark, GCP) have no sections/lessons seeded yet
