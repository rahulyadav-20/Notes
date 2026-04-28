# Engineering Learning Platform — Master Architecture Guide

> Full-stack learning platform: Notes → Video Courses → Interview Prep → Payments
> Built with React + Vite (frontend) · Node.js + Express (backend) · PostgreSQL + Redis

---

## Platform Vision

```
Phase 1 (Active)  → Notes system (deep-dive engineering guides)
Phase 2           → Auth: register, login, Google OAuth, JWT
Phase 3           → Video Courses + Razorpay payment gateway
Phase 4           → Interview Prep section
Phase 5           → Admin dashboard + analytics
```

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| State | Zustand |
| Animations | Framer Motion |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Cache / Sessions | Redis |
| Auth | JWT (15 min) + Refresh Tokens (7 days, httpOnly cookie) + Google OAuth |
| Payment | Razorpay (INR, UPI, cards) |
| Video Hosting | Bunny.net Stream (DRM protected) |
| File Storage | AWS S3 or Cloudflare R2 |
| Email | Resend |
| Frontend Deploy | Vercel |
| Backend Deploy | Railway or Render |

---

## User Roles (RBAC)

Three roles, embedded in JWT:

| Role | Access |
|---|---|
| `user` | Free notes, free course previews, basic interview prep |
| `premium` | All notes, all paid courses (if enrolled), full interview prep, PDF downloads |
| `admin` | Everything + admin panel, user management, course publishing, payment management |

### Role Rules
- New registrations default to `role: 'user'`
- Premium upgrade → Razorpay payment → backend sets `role: 'premium'`
- Admin accounts created manually in DB only — no self-registration as admin
- Admin can change any user's role (logged in `audit_logs`)
- Premium subscription has `expires_at` — cron job downgrades expired users nightly

---

## Frontend Folder Structure

```
src/
  pages/
    notes/                  ← Phase 1 (active)
      data-engineer/
        Kafka.jsx
        Spark.jsx
        GCP.jsx
        Druid.jsx
        Flink.jsx
        SQL.jsx
        DataModeling.jsx
    courses/                ← Phase 3
    interview/              ← Phase 4
    auth/                   ← Phase 2
      Login.jsx
      Register.jsx
      Callback.jsx          ← Google OAuth callback
    dashboard/              ← Phase 2
      index.jsx
      Purchases.jsx
    admin/                  ← Phase 5
      index.jsx
      Users.jsx
      Courses.jsx
      Payments.jsx
      Analytics.jsx
  components/
    layout/
      Sidebar.jsx           ← Framer Motion sidebar with scroll progress
      PageLayout.jsx        ← Wraps every note page
    content/
      Cover.jsx             ← Props: title, subtitle, tagline, stats, iconLetter, gradStart, gradEnd
      PartHeader.jsx        ← Props: part, title, subtitle
      Section.jsx           ← Props: title, children  (h2.st + .sb + scroll animation)
      SubSection.jsx        ← Props: title, children  (h3.ss)
      SubSubSection.jsx     ← Props: title, children  (h4.sss)
      CodeBlock.jsx         ← Props: label, lang, children  (copy button included)
      Callout.jsx           ← Props: type="info|pitfall|note|caution|api", label, children
      DataTable.jsx         ← Props: headers=[], rows=[[]]
      Divider.jsx           ← hr.sd gradient divider
    diagrams/
      Diagram.jsx           ← SVG wrapper with fade-in animation + glow filter
      IsoBox.jsx            ← 3D isometric box primitive (3 SVG faces)
      IsoArrow.jsx          ← 3D isometric connector arrow
    auth/                   ← Phase 2
      ProtectedRoute.jsx    ← redirect to /auth/login if not logged in
      PremiumRoute.jsx      ← redirect to /pricing if not premium
      AdminRoute.jsx        ← redirect to / if not admin
    courses/                ← Phase 3
      CourseCard.jsx
      VideoPlayer.jsx
  store/
    authStore.js            ← Zustand: user, token, isLoggedIn, isPremium, isAdmin
    cartStore.js            ← Phase 3
  api/
    client.js               ← axios instance with auth interceptors + token refresh
    auth.js
    courses.js
    payments.js
  hooks/
    useScrollProgress.js    ← scroll %, active section ID
    useAuth.js              ← Phase 2
  styles/
    globals.css             ← _shared/styles.css (never modify)
    theme.css               ← 3D/glassmorphism additions
```

---

## Frontend Routes

```
/                           → Home (topic cards)

/notes                      → Notes landing
/notes/:category/:slug      → Individual note page
  Examples:
  /notes/data-engineer/kafka
  /notes/data-engineer/spark
  /notes/data-engineer/gcp
  /notes/data-engineer/druid
  /notes/data-engineer/flink
  /notes/data-engineer/sql
  /notes/data-engineer/data-modeling

/courses                    → Course catalog          [Phase 3]
/courses/:slug              → Course detail
/courses/:slug/learn        → Video player            [PremiumRoute]

/interview                  → Interview prep landing  [Phase 4]
/interview/:topic           → Topic Q&A

/pricing                    → Plans page              [Phase 3]

/auth/login                 → Login page              [Phase 2]
/auth/register              → Register page
/auth/callback              → Google OAuth callback

/dashboard                  → User dashboard          [Phase 2, ProtectedRoute]
/dashboard/purchases        → My courses
/dashboard/bookmarks        → Saved notes

/admin                      → Admin dashboard         [Phase 5, AdminRoute]
/admin/users                → User management
/admin/courses              → Course management
/admin/payments             → Payment history
/admin/analytics            → Revenue + growth charts
```

---

## Zustand Auth Store Shape

```js
// src/store/authStore.js
{
  user: null,            // { id, name, email, role, avatar }
  token: null,
  isLoggedIn: false,
  isPremium: false,      // role === 'premium' || role === 'admin'
  isAdmin: false,        // role === 'admin'

  login(user, token),
  logout(),
  setUser(user),
  upgradeToPremium(),
}
```

---

## API Client Shape

```js
// src/api/client.js
// axios instance:
//   baseURL: import.meta.env.VITE_API_URL
//   withCredentials: true  (for httpOnly refresh token cookie)
//   request interceptor:  attach Bearer token from authStore
//   response interceptor: on 401 → call /auth/refresh-token → retry request
//                         on refresh fail → logout() + redirect /auth/login
```

---

## Backend API Structure (Node.js + Express)

```
/api/v1/
  auth/
    POST  /register
    POST  /login
    POST  /logout
    POST  /refresh-token
    GET   /google
    GET   /google/callback
    POST  /forgot-password
    POST  /reset-password

  users/
    GET   /me                      [requireAuth]
    PATCH /me                      [requireAuth]
    GET   /me/enrollments          [requireAuth]

  courses/
    GET   /                        [public]
    GET   /:slug                   [public]
    GET   /:slug/curriculum        [public - titles only]
    GET   /:slug/lessons/:id       [requireAuth + requirePremium]

  payments/
    POST  /create-order            [requireAuth]
    POST  /verify                  [requireAuth]
    GET   /history                 [requireAuth]

  notes/
    GET   /                        [public]
    GET   /:category/:slug         [public = free | requirePremium = premium note]

  interview/
    GET   /topics                  [public]
    GET   /:topic/questions        [requireAuth + requirePremium for advanced]

  admin/
    GET   /users                   [requireAdmin]
    PATCH /users/:id/role          [requireAdmin]
    POST  /users/:id/suspend       [requireAdmin]
    GET   /payments                [requireAdmin]
    POST  /payments/:id/refund     [requireAdmin]
    GET   /analytics               [requireAdmin]
    POST  /courses                 [requireAdmin]
    PATCH /courses/:id             [requireAdmin]
    PATCH /notes/:slug/premium     [requireAdmin]
```

### Auth Middleware Stack
```
requireAuth    → verify JWT → attach req.user
requirePremium → requireAuth + check role is 'premium' or 'admin'
requireAdmin   → requireAuth + check role is 'admin'
```

---

## Database Schema (PostgreSQL)

```sql
-- ===== USERS =====
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR,
  google_id     VARCHAR UNIQUE,
  avatar_url    VARCHAR,
  role          VARCHAR(20) DEFAULT 'user',  -- 'user' | 'premium' | 'admin'
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ===== PREMIUM SUBSCRIPTIONS =====
CREATE TABLE premium_subscriptions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  plan        VARCHAR(20),              -- 'monthly' | 'yearly' | 'lifetime'
  started_at  TIMESTAMPTZ DEFAULT NOW(),
  expires_at  TIMESTAMPTZ,             -- NULL = lifetime
  payment_id  UUID,
  is_active   BOOLEAN DEFAULT true
);

-- ===== COURSES =====
CREATE TABLE courses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          VARCHAR(100) UNIQUE NOT NULL,
  title         VARCHAR(255) NOT NULL,
  description   TEXT,
  thumbnail_url VARCHAR,
  price         INTEGER,               -- in paise (INR × 100)
  currency      VARCHAR(3) DEFAULT 'INR',
  is_published  BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID REFERENCES courses(id),
  title       VARCHAR(255),
  order_index INTEGER
);

CREATE TABLE lessons (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id       UUID REFERENCES sections(id),
  title            VARCHAR(255),
  video_url        VARCHAR,
  duration_seconds INTEGER,
  is_preview       BOOLEAN DEFAULT false,
  order_index      INTEGER
);

-- ===== ENROLLMENTS =====
CREATE TABLE enrollments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  course_id   UUID REFERENCES courses(id),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  payment_id  UUID,
  UNIQUE(user_id, course_id)
);

-- ===== PAYMENTS =====
CREATE TABLE payments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES users(id),
  course_id             UUID REFERENCES courses(id),
  plan                  VARCHAR(20),
  razorpay_order_id     VARCHAR UNIQUE,
  razorpay_payment_id   VARCHAR UNIQUE,
  amount                INTEGER,       -- in paise
  currency              VARCHAR(3) DEFAULT 'INR',
  status                VARCHAR(20),   -- 'created' | 'paid' | 'failed' | 'refunded'
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ===== NOTES METADATA =====
CREATE TABLE notes_metadata (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       VARCHAR(100) UNIQUE NOT NULL,
  category   VARCHAR(100),
  title      VARCHAR(255),
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== INTERVIEW =====
CREATE TABLE interview_topics (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug  VARCHAR(100) UNIQUE,
  title VARCHAR(255)
);

CREATE TABLE interview_questions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id   UUID REFERENCES interview_topics(id),
  question   TEXT,
  answer     TEXT,
  difficulty VARCHAR(20),   -- 'basic' | 'intermediate' | 'advanced'
  is_premium BOOLEAN DEFAULT false,
  tags       TEXT[]
);

-- ===== BOOKMARKS =====
CREATE TABLE user_note_bookmarks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id),
  note_slug  VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, note_slug)
);

-- ===== AUDIT LOG (admin actions) =====
CREATE TABLE audit_logs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id       UUID REFERENCES users(id),
  action         VARCHAR(100),
  target_user_id UUID REFERENCES users(id),
  old_value      JSONB,
  new_value      JSONB,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ===== REFRESH TOKENS =====
CREATE TABLE refresh_tokens (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id),
  token_hash VARCHAR UNIQUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## JWT Structure

```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "premium",
  "isPremiumActive": true,
  "iat": 1714300000,
  "exp": 1714300900
}
```

- Access token: 15 minutes, Bearer header
- Refresh token: 7 days, httpOnly cookie + hashed in DB
- Role change by admin → old token expires naturally within 15 min

---

## Payment Flow (Razorpay)

```
1. POST /payments/create-order  { courseId | plan }
2. Backend creates Razorpay order → returns { orderId, amount, currency }
3. Frontend opens Razorpay popup
4. User pays (UPI / card / netbanking)
5. Razorpay returns { razorpay_order_id, razorpay_payment_id, razorpay_signature }
6. POST /payments/verify  (all 3 IDs sent to backend)
7. Backend verifies HMAC-SHA256 signature using Razorpay secret
8. If valid → INSERT enrollment or UPDATE premium subscription
9. New JWT issued with updated role
10. Frontend updates Zustand store → user sees premium content
```

---

## Pricing Plans (Phase 3)

| Plan | Price | Access |
|---|---|---|
| Free | ₹0 | Free notes only |
| Monthly Premium | ₹299/month | All notes + courses |
| Yearly Premium | ₹2,499/year | All notes + courses (save 30%) |
| Lifetime | ₹4,999 one-time | All notes + courses forever |

---

## Note Generation

### Base Prompt
Paste this before every topic block when generating a new note:

```
You are generating a complete React JSX engineering deep-dive note.

AVAILABLE COMPONENTS:
  import PageLayout from '../components/layout/PageLayout'
  import Cover from '../components/content/Cover'
  import PartHeader from '../components/content/PartHeader'
  import Section from '../components/content/Section'
  import SubSection, { SubSubSection } from '../components/content/SubSection'
  import CodeBlock from '../components/content/CodeBlock'
  import Callout from '../components/content/Callout'
  import DataTable from '../components/content/DataTable'
  import Divider from '../components/content/Divider'
  import Diagram from '../components/diagrams/Diagram'
  import IsoBox from '../components/diagrams/IsoBox'
  import IsoArrow from '../components/diagrams/IsoArrow'

3D DIAGRAM RULES:
  - Architecture diagrams use IsoBox + IsoArrow (isometric 3D)
  - glowId="iso-glow" on every IsoBox
  - tileW={64} tileH={32} tileD={22} on every IsoBox and IsoArrow
  - Each IsoBox color matches role: source=blue, processor=orange, sink=green, store=purple
  - Flow/lifecycle diagrams use flat SVG inside <Diagram> wrapper

DEPTH: Minimum 15 Parts, each with 3–8 Sections, each Section with 3–6 SubSections (X.Y)
TARGET: 150–400 pages depending on topic

WRITING STYLE:
  - Open every section with a one-sentence hook
  - Define every term in plain English before using it
  - After every concept: "In simple terms: [one sentence]"
  - Real-world analogy BEFORE technical definition
  - Wrong approach → why it fails → correct approach
  - Exact numbers: "~40% faster", "P99 under 200ms"
  - Every code line has a comment

CALLOUTS:
  <Callout type="info" label="Engineering Insight">
  <Callout type="pitfall" label="Common Pitfall">
  <Callout type="note" label="Production Note">

FILE: default export, sidebar config as const inside file,
      wrap in <PageLayout sidebar={sidebar} color="PRIMARY_COLOR">

---
[PASTE TOPIC BLOCK BELOW]
```

### Topic Blocks Location
Individual topic blocks are stored in: `notes-app/prompts/`
```
prompts/
  flink.md
  druid.md
  kafka.md
  spark.md
  gcp.md
  machine_learning.md
  langchain.md
  react.md
  javascript.md
```

---

## Component API Quick Reference

```jsx
<Cover
  title="Apache Kafka"
  subtitle="Distributed Event Streaming"
  tagline="From first principles to production mastery"
  stats={[{num:'22',label:'Sections'},{num:'6',label:'Parts'}]}
  iconLetter="K"
  gradStart="#4A90D9"
  gradEnd="#5DB85B"
  edition="Apache Kafka 3.7 · Java & Python · 2025"
/>

<PartHeader part={1} title="Foundations" subtitle="Core concepts every engineer must know" />

<Section title="1 — Why Kafka Exists">
  <SubSection title="1.1 The Messaging Problem">
    <SubSubSection title="1.1.1 Point-to-Point vs Pub-Sub">
      <p>...</p>
      <Callout type="info" label="Engineering Insight">Text</Callout>
      <Callout type="pitfall" label="Common Pitfall">Text</Callout>
      <Callout type="note" label="Production Note">Text</Callout>
      <CodeBlock label="Producer Example" lang="Java">{'code'}</CodeBlock>
      <DataTable headers={['Config','Default','Recommended']} rows={[['batch.size','16KB','64KB']]} />
      <Diagram title="Kafka Architecture" viewBox="0 0 800 420">
        <IsoBox x={0} y={1} z={0} color="#4A90D9" label="Producer" tileW={64} tileH={32} tileD={22} glowId="iso-glow"/>
        <IsoArrow from={[1,1,0.5]} to={[3,1,0.5]} color="rgba(255,255,255,0.6)" tileW={64} tileH={32} tileD={22}/>
      </Diagram>
    </SubSubSection>
  </SubSection>
</Section>

<Divider />
```

---

## Environment Variables

```bash
# Frontend (.env)
VITE_API_URL=http://localhost:4000/api/v1
VITE_RAZORPAY_KEY_ID=rzp_test_xxxx
VITE_GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com

# Backend (.env)
PORT=4000
DATABASE_URL=postgresql://user:pass@localhost:5432/learndb
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_32chars
JWT_REFRESH_SECRET=your_refresh_secret_32chars
GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=xxxx
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=xxxx
RESEND_API_KEY=re_xxxx
CLIENT_URL=http://localhost:5173
```

---

## Development Commands

```bash
# Frontend
cd notes-app
npm run dev         # start dev server (localhost:5173)
npm run build       # production build → dist/
npm run preview     # preview production build

# Backend (Phase 2+)
cd backend
npm run dev         # nodemon server
npm run migrate     # run DB migrations
npm run seed        # seed test data
```

---

## Key Decisions & Reasons

| Decision | Reason |
|---|---|
| Zustand over Redux | Less boilerplate, works perfectly for auth + cart state |
| Razorpay over Stripe | Best support for INR, UPI, Indian cards |
| JWT in memory + refresh in httpOnly cookie | Prevents XSS token theft while enabling auto-refresh |
| Admin created manually in DB | Prevents privilege escalation via registration |
| Role in JWT | Avoids DB call on every request; 15-min expiry limits damage from stale role |
| Bunny.net over YouTube | DRM protection, no ads, custom player, bandwidth control |
| Notes content stays in JSX | No CMS needed for notes; Claude generates full JSX files |
