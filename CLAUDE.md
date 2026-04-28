# Engineering Learning Platform — Master Reference

> React + Vite frontend · Node.js + Express backend · PostgreSQL + Redis
> Phases: Notes → Auth → Video Courses → Interview Prep → Admin

---

## Project Structure

```
Notes/                          ← repo root (dev branch)
├── CLAUDE.md                   ← this file
├── prompts/
│   ├── BASE_PROMPT.md          ← paste before every topic block
│   └── topics/
│       ├── flink.md
│       ├── druid.md
│       ├── kafka.md
│       ├── spark.md
│       ├── gcp.md
│       ├── machine_learning.md
│       ├── langchain.md
│       ├── react.md
│       └── javascript.md
└── app/                        ← React + Vite project
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── notes/
    │   │   │   └── data-engineer/
    │   │   │       ├── Kafka.jsx
    │   │   │       ├── Spark.jsx
    │   │   │       ├── GCP.jsx
    │   │   │       ├── Druid.jsx
    │   │   │       ├── Flink.jsx
    │   │   │       ├── SQL.jsx
    │   │   │       └── DataModeling.jsx
    │   │   ├── courses/          ← Phase 3
    │   │   ├── interview/        ← Phase 4
    │   │   ├── auth/             ← Phase 2
    │   │   ├── dashboard/        ← Phase 2
    │   │   └── admin/            ← Phase 5
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Sidebar.jsx
    │   │   │   └── PageLayout.jsx
    │   │   ├── content/
    │   │   │   ├── Cover.jsx
    │   │   │   ├── PartHeader.jsx
    │   │   │   ├── Section.jsx
    │   │   │   ├── SubSection.jsx
    │   │   │   ├── CodeBlock.jsx
    │   │   │   ├── Callout.jsx
    │   │   │   ├── DataTable.jsx
    │   │   │   └── Divider.jsx
    │   │   ├── diagrams/
    │   │   │   ├── Diagram.jsx
    │   │   │   ├── IsoBox.jsx
    │   │   │   └── IsoArrow.jsx
    │   │   └── auth/             ← Phase 2
    │   │       ├── ProtectedRoute.jsx
    │   │       ├── PremiumRoute.jsx
    │   │       └── AdminRoute.jsx
    │   ├── store/
    │   │   ├── authStore.js      ← Zustand
    │   │   └── cartStore.js      ← Phase 3
    │   ├── api/
    │   │   └── client.js         ← axios instance
    │   ├── hooks/
    │   │   └── useScrollProgress.js
    │   └── styles/
    │       ├── globals.css       ← base design system (never modify)
    │       └── theme.css         ← 3D, glassmorphism, animations
    └── package.json
```

---

## Platform Phases

| Phase | Feature | Status |
|---|---|---|
| 1 | Notes (deep-dive guides) | Active |
| 2 | Auth — register, login, Google OAuth, JWT | Pending |
| 3 | Video Courses + Razorpay payments | Pending |
| 4 | Interview Prep | Pending |
| 5 | Admin dashboard + analytics | Pending |

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 18 + Vite | Fast, simple, already started |
| Routing | React Router v6 | Nested protected routes |
| State | Zustand | Simple auth + cart state |
| Animations | Framer Motion | Page transitions, 3D diagram reveals |
| Backend | Node.js + Express | Phase 2+ |
| Database | PostgreSQL | Users, payments, enrollments |
| Cache | Redis | JWT blacklist, sessions |
| Auth | JWT + Refresh Tokens + Google OAuth | Industry standard |
| Payment | Razorpay | Best for INR / UPI |
| Video | Bunny.net Stream | DRM, cheap CDN |
| Storage | Cloudflare R2 | Thumbnails, PDFs |
| Email | Resend | OTP, receipts |
| Deploy FE | Vercel | Instant, free tier |
| Deploy BE | Railway | Node.js hosting |

---

## User Roles (RBAC)

| Role | Access |
|---|---|
| `user` (default) | Free notes, free previews, basic interview |
| `premium` | All notes + enrolled courses + full interview + PDF downloads |
| `admin` | Everything + admin panel, manage users/courses/payments |

- New accounts → `role: 'user'` by default
- Premium → via Razorpay payment → backend sets `role: 'premium'`
- Admin → created manually in DB only, never via registration
- Role embedded in JWT (15 min expiry) — no DB call per request

---

## Frontend Routes

```
/                             Home
/notes/:category/:slug        Note page  e.g. /notes/data-engineer/kafka
/courses                      Course catalog          [Phase 3]
/courses/:slug/learn          Video player            [PremiumRoute]
/interview/:topic             Interview Q&A           [Phase 4]
/pricing                      Plans page              [Phase 3]
/auth/login                   Login                   [Phase 2]
/auth/register                Register
/auth/callback                Google OAuth
/dashboard                    User dashboard          [Phase 2, ProtectedRoute]
/admin                        Admin panel             [Phase 5, AdminRoute]
```

---

## Backend API (Phase 2+)

```
POST  /api/v1/auth/register
POST  /api/v1/auth/login
POST  /api/v1/auth/logout
POST  /api/v1/auth/refresh-token
GET   /api/v1/auth/google
GET   /api/v1/auth/google/callback

GET   /api/v1/users/me                    [requireAuth]
PATCH /api/v1/users/me                    [requireAuth]

GET   /api/v1/courses                     [public]
GET   /api/v1/courses/:slug/lessons/:id   [requirePremium]

POST  /api/v1/payments/create-order       [requireAuth]
POST  /api/v1/payments/verify             [requireAuth]

GET   /api/v1/admin/users                 [requireAdmin]
PATCH /api/v1/admin/users/:id/role        [requireAdmin]
GET   /api/v1/admin/analytics             [requireAdmin]
```

Middleware chain: `requireAuth` → `requirePremium` → `requireAdmin`

---

## Database (PostgreSQL)

```sql
users                 id, name, email, password_hash, google_id, avatar_url, role, is_active
premium_subscriptions id, user_id, plan, started_at, expires_at, payment_id, is_active
courses               id, slug, title, description, thumbnail_url, price, is_published
sections              id, course_id, title, order_index
lessons               id, section_id, title, video_url, duration_seconds, is_preview
enrollments           id, user_id, course_id, enrolled_at, payment_id
payments              id, user_id, course_id, razorpay_order_id, razorpay_payment_id, amount, status
notes_metadata        id, slug, category, title, is_premium
interview_questions   id, topic_id, question, answer, difficulty, is_premium
user_note_bookmarks   id, user_id, note_slug
audit_logs            id, admin_id, action, target_user_id, old_value, new_value
refresh_tokens        id, user_id, token_hash, expires_at
```

---

## Pricing Plans (Phase 3)

| Plan | Price | Notes |
|---|---|---|
| Free | ₹0 | Free notes only |
| Monthly | ₹299/mo | All notes + courses |
| Yearly | ₹2,499/yr | All notes + courses (save 30%) |
| Lifetime | ₹4,999 | All notes + courses forever |

---

## Component API — Quick Reference

```jsx
// Cover page
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

// Part header
<PartHeader part={1} title="Foundations" subtitle="Core concepts every engineer must know" />

// Section (maps to one sidebar link, auto-gets id s1/s2/s3...)
<Section title="1 — Why Kafka Exists">

  // Subsection
  <SubSection title="1.1 The Messaging Problem">

    // Sub-subsection
    <SubSubSection title="1.1.1 Point-to-Point vs Pub-Sub">

      <Callout type="info"    label="Engineering Insight">text</Callout>
      <Callout type="pitfall" label="Common Pitfall">text</Callout>
      <Callout type="note"    label="Production Note">text</Callout>

      <CodeBlock label="Producer Example" lang="Java">{'// code here'}</CodeBlock>

      <DataTable
        headers={['Config','Default','Recommended']}
        rows={[['batch.size','16KB','64KB']]}
      />

      // 3D isometric diagram
      <Diagram title="Kafka Architecture" viewBox="0 0 800 420">
        <IsoBox x={0} y={1} z={0} w={1} h={1} d={1}
          color="#4A90D9" label="Producer"
          tileW={64} tileH={32} tileD={22} glowId="iso-glow" />
        <IsoArrow
          from={[1,1,0.5]} to={[3,1,0.5]}
          color="rgba(255,255,255,0.6)"
          tileW={64} tileH={32} tileD={22}
          label="events" />
      </Diagram>

    </SubSubSection>
  </SubSection>
</Section>

<Divider />
```

---

## Sidebar Config Pattern (inside every note file)

```js
const sidebar = {
  brand: 'Apache Kafka',
  title: 'Deep-Dive Guide',
  iconLetter: 'K',
  gradStart: '#4A90D9',
  gradEnd: '#5DB85B',
  parts: [
    {
      label: 'Part I — Foundations',
      sections: [
        { id: 's1', num: 1, title: 'Why Kafka Exists' },
        { id: 's2', num: 2, title: 'Architecture Overview' },
      ]
    },
    {
      label: 'Part II — Core Concepts',
      sections: [
        { id: 's3', num: 3, title: 'Topics & Partitions' },
      ]
    }
  ]
}

export default function Kafka() {
  return (
    <PageLayout sidebar={sidebar} color="#4A90D9">
      ...
    </PageLayout>
  )
}
```

---

## Topic Color Reference

| Topic | Primary Color | Grad End | Icon |
|---|---|---|---|
| Apache Kafka | `#4A90D9` | `#5DB85B` | K |
| Apache Spark | `#E25A1C` | `#F5A623` | S |
| Apache Flink | `#E6522C` | `#F5A623` | F |
| Apache Druid | `#29ABE2` | `#0F6B99` | D |
| GCP | `#4285F4` | `#34A853` | G |
| Data Modeling | `#7C3AED` | `#2ECC71` | D |
| SQL | `#336791` | `#5DB85B` | S |
| Machine Learning | `#7C3AED` | `#EC4899` | M |
| LangChain | `#1C7C54` | `#4A90D9` | L |
| React | `#0EA5E9` | `#6366F1` | R |
| JavaScript | `#D97706` | `#EF4444` | J |

---

## Environment Variables

```bash
# app/.env
VITE_API_URL=http://localhost:4000/api/v1
VITE_RAZORPAY_KEY_ID=rzp_test_xxxx
VITE_GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com

# backend/.env  (Phase 2)
PORT=4000
DATABASE_URL=postgresql://user:pass@localhost:5432/learndb
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_32char_secret
JWT_REFRESH_SECRET=your_32char_refresh_secret
GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=xxxx
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=xxxx
RESEND_API_KEY=re_xxxx
CLIENT_URL=http://localhost:5173
```

---

## Dev Commands

```bash
cd app
npm run dev       # localhost:5173
npm run build     # production → dist/
npm run preview   # preview build
```
