# EngiNotes → Production SaaS: Complete Upgrade Plan

> **Stack:** React 19 + Vite · Node.js + Express · PostgreSQL + Redis  
> **Author:** Senior Full-Stack Architect Review  
> **Date:** May 2026  
> **Goal:** Transform EngiNotes from a functional project into a modern, scalable, production-grade SaaS platform

---

## Table of Contents

1. [UI/UX Redesign](#1-uiux-redesign)
2. [Frontend Architecture](#2-frontend-architecture)
3. [Backend Architecture](#3-backend-architecture)
4. [Database Design](#4-database-design)
5. [System Design](#5-system-design)
6. [Real-World Features](#6-real-world-features)
7. [Performance Optimization](#7-performance-optimization)
8. [DevOps & Deployment](#8-devops--deployment)
9. [Step-by-Step Upgrade Roadmap](#9-step-by-step-upgrade-roadmap)
10. [Architecture Diagram](#10-architecture-diagram)
11. [Folder Structure Reference](#11-folder-structure-reference)
12. [SaaS References & Inspiration](#12-saas-references--inspiration)
13. [Step-by-Step Deployment Guide](#13-step-by-step-deployment-guide)
14. [Claude AI Deployment Prompts](#14-claude-ai-deployment-prompts)

---

## 1. UI/UX Redesign

### 1.1 The Root Problem with "Dummy-Looking" UIs

Most projects look unpolished not because of missing features, but because of three things:

- **No visual hierarchy** — everything has equal visual weight
- **Inconsistent spacing** — margins and paddings are arbitrary
- **No design system** — colors, radii, and fonts vary across components

The fix is not more components. The fix is **discipline and a token-based design system**.

---

### 1.2 Design Token System

Define these once in `app/src/styles/globals.css` as CSS custom properties. Every component references these — never hardcoded values.

```css
:root {
  /* --- Spacing Scale --- */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* --- Typography Scale --- */
  --text-xs:   11px;
  --text-sm:   13px;
  --text-base: 14px;
  --text-md:   15px;
  --text-lg:   18px;
  --text-xl:   22px;
  --text-2xl:  28px;
  --text-3xl:  36px;
  --text-4xl:  48px;

  /* --- Font Weights --- */
  --font-normal:    400;
  --font-medium:    500;
  --font-semibold:  600;
  --font-bold:      700;
  --font-extrabold: 800;

  /* --- Border Radius --- */
  --radius-sm:   6px;
  --radius-md:   10px;
  --radius-lg:   14px;
  --radius-xl:   18px;
  --radius-2xl:  24px;
  --radius-full: 9999px;

  /* --- Color System (Dark Mode Primary) --- */
  --color-bg:         #0B0F1A;   /* page background */
  --color-surface-1:  #0F1117;   /* near-black surface */
  --color-surface-2:  #161B27;   /* card background */
  --color-surface-3:  #1E2534;   /* elevated card, modal */
  --color-surface-4:  #252D3D;   /* hover state */
  --color-border:     #2A3040;   /* subtle border */
  --color-border-2:   #364054;   /* stronger border */

  /* --- Text Colors --- */
  --color-text-1:  #F0F4FF;   /* primary — headings */
  --color-text-2:  #C4CCDC;   /* secondary — body */
  --color-text-3:  #8A93A8;   /* muted — labels, captions */
  --color-text-4:  #4A5568;   /* placeholder, disabled */

  /* --- Brand & Semantic Colors --- */
  --color-primary:       #4A90D9;
  --color-primary-dim:   rgba(74, 144, 217, 0.12);
  --color-primary-hover: #5BA3E8;
  --color-success:       #22C55E;
  --color-success-dim:   rgba(34, 197, 94, 0.12);
  --color-warning:       #F59E0B;
  --color-warning-dim:   rgba(245, 158, 11, 0.12);
  --color-danger:        #EF4444;
  --color-danger-dim:    rgba(239, 68, 68, 0.12);
  --color-info:          #4A90D9;

  /* --- Shadows --- */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3);
  --shadow-lg: 0 10px 30px rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4);
  --shadow-glow: 0 0 20px rgba(74, 144, 217, 0.25);

  /* --- Transitions --- */
  --transition-fast:   all 120ms ease;
  --transition-normal: all 200ms ease;
  --transition-slow:   all 350ms ease;
}
```

---

### 1.3 Typography

```css
/* app/src/styles/globals.css — add after tokens */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: var(--text-base);
  color: var(--color-text-2);
  background: var(--color-bg);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 { color: var(--color-text-1); font-weight: var(--font-semibold); line-height: 1.3; }
h1 { font-size: var(--text-3xl); font-weight: var(--font-bold); }
h2 { font-size: var(--text-2xl); }
h3 { font-size: var(--text-xl); }
h4 { font-size: var(--text-lg); }

code, pre, .mono { font-family: 'JetBrains Mono', 'Fira Code', monospace; }
```

---

### 1.4 Dashboard Layout Blueprint

```
┌─────────────────────────────────────────────────────────────────────┐
│  TOPBAR  (height: 64px, position: fixed, backdrop-blur)             │
│  [Logo]  [Global Search Ctrl+K ──────────]  [Notif] [Avatar▾]      │
├────────────────┬────────────────────────────────────────────────────┤
│                │  PAGE HEADER                                        │
│  SIDEBAR       │  Good morning, Rahul 👋  ·  [Quick Actions]        │
│  (width: 240px │  ─────────────────────────────────────────────     │
│  collapsible)  │  STAT CARDS (4-column grid)                        │
│                │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────┐ │
│  ○ Dashboard   │  │ Notes    │ │ Courses  │ │ Lessons  │ │ Streak│ │
│  ○ Notes       │  │ Owned    │ │ Enrolled │ │ Completed│ │  🔥   │ │
│  ○ Courses     │  │   7      │ │    2     │ │   48     │ │  12d  │ │
│  ○ Interview   │  └──────────┘ └──────────┘ └──────────┘ └───────┘ │
│  ○ Search      │                                                     │
│  ─────────     │  ┌──────────────────────────┐  ┌─────────────────┐ │
│  ○ Settings    │  │  ACTIVITY HEATMAP         │  │  OWNED CONTENT  │ │
│  ● Upgrade     │  │  (GitHub-style grid)      │  │  (scrollable    │ │
│                │  └──────────────────────────┘  │   card list)    │ │
│  [Collapse ←]  │                                 └─────────────────┘ │
│                │  ┌──────────────────────────────────────────────┐   │
│                │  │  RECENT ACTIVITY FEED (timeline style)       │   │
│                │  └──────────────────────────────────────────────┘   │
└────────────────┴────────────────────────────────────────────────────┘
```

---

### 1.5 Card Design — Dummy vs Professional

| Property | Dummy Card | Professional Card |
|----------|-----------|------------------|
| Background | `white` | `var(--color-surface-2)` |
| Border | `1px solid #eee` | `1px solid var(--color-border)` |
| Border radius | `4px` | `var(--radius-lg)` = `14px` |
| Padding | `10px` | `20px 24px` |
| Shadow | none | `var(--shadow-sm)` |
| Top accent | none | `border-top: 2px solid var(--color-primary)` on active items |
| Hover state | none | `border-color: var(--color-primary)` + `translateY(-2px)` |
| Transition | none | `var(--transition-normal)` |
| Inner spacing | random | Consistent 8px/16px grid |
| Icon treatment | emoji or generic | Colored icon with dim background circle |

---

### 1.6 Specific Dashboard.jsx Improvements

**Currently:**
- Flat list of owned items (text-based)
- No loading state differentiation
- No empty state when user owns nothing
- No progress visibility

**Target:**
- **4 stat cards** at top: Notes Owned · Courses Enrolled · Lessons Completed · Streak
- **Progress cards** for each owned item: icon + title + progress bar + expiry countdown chip
- **Activity heatmap** for lesson completions (52-week grid, like GitHub)
- **Skeleton loaders** while `purchasesLoading = true` (replace empty render)
- **Empty state** component with illustration + CTA when 0 purchases
- **Recent activity feed** (pulled from `user_activity_log` table)
- **Quick access** section: last 3 viewed items (localStorage)

---

## 2. Frontend Architecture

### 2.1 Recommended Stack

| Category | Current | Add / Replace |
|----------|---------|---------------|
| Framework | React 19 + Vite | Keep |
| Styling | Tailwind CSS | Keep + add CSS variables layer |
| Components | Custom only | Add **shadcn/ui** (headless, unstyled primitives) |
| State: Server | `useState` + `useEffect` | Replace with **TanStack Query v5** |
| State: Auth | Zustand `authStore` | Keep, trim to auth-only |
| State: UI | Scattered `useState` | Add Zustand `uiStore` |
| State: Forms | Mixed | **React Hook Form** + **Zod** |
| HTTP client | Axios `client.js` | Keep instance, split into domain files |
| Charts | None | **Recharts** |
| Animations | None | **Framer Motion** (page transitions + micro-animations) |
| Icons | Mixed | Standardize on **lucide-react** |
| Dates | None | **date-fns** |
| Notifications | None | **react-hot-toast** |
| Tables | None | **TanStack Table** (for admin/interview lists) |

> **Why TanStack Query is the most impactful single addition:**  
> It replaces every `useState(null)` + `useEffect(() => api.call().then(setState))` pattern with automatic caching, background refetching, stale-while-revalidate, and shared loading/error states. This eliminates ~60% of boilerplate across all your pages.

---

### 2.2 Scalable Folder Structure

```
app/src/
├── components/
│   ├── ui/                        ← shadcn primitives (never modify directly)
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   ├── Dialog.jsx
│   │   ├── Skeleton.jsx
│   │   ├── Tooltip.jsx
│   │   └── index.js               ← barrel export
│   ├── layout/
│   │   ├── AppShell.jsx           ← wraps Sidebar + Topbar + main content
│   │   ├── Sidebar.jsx            ← collapsible, active state, role-aware
│   │   ├── Topbar.jsx             ← includes SearchBar, UserMenu, Notifications
│   │   ├── PageHeader.jsx         ← breadcrumb + page title + action slot
│   │   └── SearchBar.jsx          ← global search (Ctrl+K) — keep + enhance
│   ├── common/
│   │   ├── StatCard.jsx           ← metric card (number + label + trend + icon)
│   │   ├── ProgressCard.jsx       ← owned item card with progress bar + expiry
│   │   ├── EmptyState.jsx         ← illustration + title + description + CTA
│   │   ├── ErrorBoundary.jsx      ← catches render errors gracefully
│   │   ├── SkeletonCard.jsx       ← placeholder while loading
│   │   ├── ActivityFeed.jsx       ← timeline-style event list
│   │   └── ExpiryBadge.jsx        ← shows "Expires in 23 days" with color coding
│   ├── charts/
│   │   ├── ActivityHeatmap.jsx    ← GitHub-style 52-week grid
│   │   ├── ProgressRing.jsx       ← circular progress indicator
│   │   ├── RevenueChart.jsx       ← admin line chart (Recharts)
│   │   └── BarChart.jsx           ← generic bar chart wrapper
│   ├── content/                   ← note renderer components (keep as-is)
│   │   ├── Cover.jsx
│   │   ├── Section.jsx
│   │   ├── Callout.jsx
│   │   └── ...
│   └── forms/
│       ├── SearchInput.jsx
│       ├── FilterBar.jsx
│       └── OtpInput.jsx
│
├── pages/
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── ForgotPassword.jsx
│   ├── notes/
│   │   ├── NotePage.jsx
│   │   ├── NotesList.jsx
│   │   └── [category]/            ← actual note content files
│   ├── courses/
│   │   ├── CoursePage.jsx
│   │   ├── CoursesList.jsx
│   │   └── LearnPage.jsx          ← video player (planned)
│   ├── dashboard/
│   │   └── Dashboard.jsx
│   ├── interview/
│   │   ├── InterviewPage.jsx
│   │   └── QuestionPage.jsx
│   ├── upgrade/
│   │   ├── Checkout.jsx
│   │   └── PaymentSuccess.jsx
│   ├── admin/
│   │   ├── AdminLayout.jsx
│   │   ├── UsersPage.jsx
│   │   ├── AnalyticsPage.jsx
│   │   └── PricingPage.jsx
│   └── settings/
│       └── Settings.jsx
│
├── hooks/
│   ├── useAuth.js                 ← thin Zustand wrapper (keep)
│   ├── usePurchases.js            ← extract from authStore
│   ├── useSearch.js               ← debounced search with TanStack Query
│   ├── useProgress.js             ← lesson progress queries
│   ├── useActivity.js             ← user activity feed queries
│   └── useLocalStorage.js         ← generic hook for persisted state
│
├── api/                           ← split from client.js
│   ├── client.js                  ← axios instance, interceptors, token refresh
│   ├── auth.js                    ← login, register, OTP, refresh
│   ├── notes.js                   ← listNotes, getNote, getNotePart
│   ├── courses.js                 ← listCourses, getCourse, getLesson, markComplete
│   ├── payments.js                ← getPlans, createOrder, verifyPayment
│   ├── interview.js               ← listTopics, listQuestions, getQuestion
│   ├── search.js                  ← globalSearch
│   └── admin.js                   ← admin-only endpoints
│
├── store/
│   ├── authStore.js               ← user, token, login, logout (keep, slim down)
│   └── uiStore.js                 ← sidebarCollapsed, activeModal, theme
│
├── lib/
│   ├── queryClient.js             ← TanStack Query client config
│   ├── utils.js                   ← cn(), formatPrice(), formatDate(), truncate()
│   ├── constants.js               ← ROUTES, ITEM_TYPES, DIFFICULTY_COLORS
│   └── validators.js              ← shared Zod schemas (used on both ends)
│
├── data/
│   ├── categories.js              ← NOTES_DATA (keep)
│   └── courses.js                 ← COURSES_DATA (keep)
│
└── styles/
    ├── globals.css                ← design tokens + base styles
    └── typography.css             ← note content prose styles
```

---

### 2.3 State Management Strategy

```
┌──────────────────────────────────────────────────────────────┐
│                    STATE OWNERSHIP MAP                        │
├─────────────────────┬────────────────────────────────────────┤
│ Server state        │ TanStack Query                         │
│ (API data)          │ — caching, refetching, invalidation    │
├─────────────────────┼────────────────────────────────────────┤
│ Auth state          │ Zustand authStore                      │
│ (user session)      │ — persisted to localStorage            │
├─────────────────────┼────────────────────────────────────────┤
│ UI state            │ Zustand uiStore                        │
│ (sidebar, modals)   │ — ephemeral, not persisted             │
├─────────────────────┼────────────────────────────────────────┤
│ Form state          │ React Hook Form                        │
│ (inputs, validation)│ — fully local, no global store         │
├─────────────────────┼────────────────────────────────────────┤
│ URL state           │ useSearchParams                        │
│ (filters, page, tab)│ — shareable via URL                    │
├─────────────────────┼────────────────────────────────────────┤
│ Ephemeral UI        │ useState (local only)                  │
│ (tooltip, dropdown) │ — never lifted unless needed           │
└─────────────────────┴────────────────────────────────────────┘
```

---

### 2.4 API Integration Pattern

```js
// BEFORE (fragile — no caching, no shared loading state):
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
useEffect(() => {
  api.getNotes(slug).then(setData).finally(() => setLoading(false));
}, [slug]);

// AFTER (TanStack Query — cached, deduplicated, auto-refetched):
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['note', slug],
  queryFn: () => api.notes.getNote(slug),
  staleTime: 5 * 60 * 1000,   // cache for 5 minutes
  gcTime: 10 * 60 * 1000,     // keep in memory 10 minutes
});

// Mutations with automatic cache invalidation:
const queryClient = useQueryClient();
const { mutate: markComplete } = useMutation({
  mutationFn: (lessonId) => api.courses.markLessonComplete(lessonId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['progress', courseSlug] });
    toast.success('Lesson completed!');
  },
});
```

---

### 2.5 Axios Client — Token Refresh Interceptor

```js
// api/client.js — add this to the existing instance:
let isRefreshing = false;
let failedQueue = [];

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers['Authorization'] = `Bearer ${token}`;
          return client(original);
        });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        const { data } = await client.post('/auth/refresh');
        useAuthStore.getState().setToken(data.accessToken);
        failedQueue.forEach((p) => p.resolve(data.accessToken));
        return client(original);
      } catch {
        failedQueue.forEach((p) => p.reject(error));
        useAuthStore.getState().logout();
        window.location.href = '/login';
      } finally {
        isRefreshing = false;
        failedQueue = [];
      }
    }
    return Promise.reject(error);
  }
);
```

---

## 3. Backend Architecture

### 3.1 Add the Missing Service Layer

Your current architecture mixes HTTP concerns with business logic inside controllers. Add two layers:

```
HTTP Request
     │
     ▼
┌─────────────┐    Parse req body, call service, send res.
│ Controller  │    NEVER contains business logic or SQL.
└──────┬──────┘
       │
       ▼
┌─────────────┐    All business rules, validation, orchestration.
│   Service   │    Calls one or more repositories. Throws AppError.
└──────┬──────┘
       │
       ▼
┌─────────────┐    All SQL queries. Returns plain objects.
│ Repository  │    No business logic. No HTTP knowledge.
└──────┬──────┘
       │
       ▼
  PostgreSQL
```

**Concrete example:**

```js
// controllers/notesController.js — thin HTTP layer only
export const getNote = asyncHandler(async (req, res) => {
  const note = await NotesService.getNote(req.params.slug, req.user?.id);
  res.json({ success: true, data: note });
});

// services/NotesService.js — all business logic
export class NotesService {
  static async getNote(slug, userId) {
    const note = await NotesRepository.findBySlug(slug);
    if (!note) throw new AppError('Note not found', 404, 'NOTE_NOT_FOUND');

    const hasAccess = userId
      ? await PurchaseService.hasNoteAccess(userId, slug)
      : false;

    return {
      ...note,
      hasAccess,
      freeParts: note.free_parts,
    };
  }
}

// repositories/NotesRepository.js — only SQL
export class NotesRepository {
  static async findBySlug(slug) {
    const { rows } = await query(
      'SELECT * FROM notes_metadata WHERE slug = $1',
      [slug]
    );
    return rows[0] ?? null;
  }

  static async listAll() {
    const { rows } = await query(
      'SELECT slug, title, tagline, icon, color, level, price, is_premium FROM notes_metadata ORDER BY title'
    );
    return rows;
  }
}
```

---

### 3.2 Centralized Error Handling

```js
// src/utils/AppError.js
export class AppError extends Error {
  constructor(message, statusCode = 500, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;            // machine-readable: 'EXPIRED', 'ALREADY_OWNED'
    this.isOperational = true;   // distinguishes app errors from bugs
  }
}

// src/utils/asyncHandler.js
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// src/middleware/errorHandler.js — register LAST in server.js
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode ?? 500;
  const isOperational = err.isOperational === true;

  logger.error({
    err: { message: err.message, stack: err.stack, code: err.code },
    req: { method: req.method, url: req.url, userId: req.user?.id },
  });

  res.status(statusCode).json({
    success: false,
    error: {
      message: isOperational ? err.message : 'Something went wrong',
      code: err.code ?? null,
    },
  });
};
```

---

### 3.3 Request Validation with Zod

```js
// src/validators/authValidators.js
import { z } from 'zod';

export const registerSchema = z.object({
  name:     z.string().min(2).max(50).trim(),
  email:    z.string().email().toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
});

export const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

export const otpSchema = z.object({
  email: z.string().email(),
  otp:   z.string().length(6).regex(/^\d+$/),
});

// src/middleware/validate.js
export const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        fields: result.error.flatten().fieldErrors,
      },
    });
  }
  req[source] = result.data;  // use cleaned/coerced data
  next();
};

// Usage in routes:
router.post('/register', validate(registerSchema), register);
router.post('/login',    validate(loginSchema),    login);
```

---

### 3.4 Role-Based Access Control (RBAC)

```js
// Extend current roles: 'user' | 'instructor' | 'moderator' | 'admin'
// Permissions are additive — admin has all permissions

// src/middleware/auth.js — add after existing requireAuth:
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) throw new AppError('Unauthorized', 401);
  if (!roles.includes(req.user.role)) {
    throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_ROLE');
  }
  next();
};

// Usage:
router.get('/admin/users',          requireAuth, requireRole('admin'), getUsers);
router.post('/courses/:id/lessons', requireAuth, requireRole('admin', 'instructor'), createLesson);
router.delete('/questions/:id',     requireAuth, requireRole('admin', 'moderator'), deleteQuestion);
```

---

### 3.5 Structured Logging

```js
// src/utils/logger.js
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  base: { service: 'engineotes-api' },
  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
});

// Request logging middleware:
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info({
      method:   req.method,
      url:      req.url,
      status:   res.statusCode,
      duration: Date.now() - start,
      userId:   req.user?.id,
    });
  });
  next();
};

// Usage in controllers:
logger.info({ userId, action: 'purchase', item: slug, amount }, 'Purchase completed');
logger.warn({ userId, attempt: attempts }, 'Failed login attempt');
logger.error({ err, userId, url: req.url }, 'Payment verification failed');
```

---

### 3.6 Rate Limiting (per-endpoint)

```js
// src/middleware/rateLimit.js
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../config/redis.js';

const createLimiter = (options) => rateLimit({
  store: new RedisStore({ sendCommand: (...args) => redis.call(...args) }),
  standardHeaders: true,
  legacyHeaders: false,
  ...options,
});

export const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,
  message: { success: false, error: { message: 'Too many attempts', code: 'RATE_LIMITED' } },
});

export const apiLimiter = createLimiter({
  windowMs: 60 * 1000,  // 1 minute
  max: 100,
});

export const searchLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 30,
});

// server.js:
app.use('/auth/login',    authLimiter);
app.use('/auth/register', authLimiter);
app.use('/search',        searchLimiter);
app.use('/api',           apiLimiter);
```

---

## 4. Database Design

### 4.1 Missing Indexes — Add to schema.sql

```sql
-- Purchase lookups (used on every auth'd page load):
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_note_purchases_user_slug
  ON note_purchases(user_id, note_slug);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_note_purchases_active
  ON note_purchases(user_id, note_slug)
  WHERE expires_at > NOW();

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_enrollments_user_course
  ON enrollments(user_id, course_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_enrollments_active
  ON enrollments(user_id, course_id)
  WHERE expires_at > NOW();

-- Progress tracking:
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_lesson_progress_user_course
  ON user_lesson_progress(user_id, course_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_lesson_progress_recent
  ON user_lesson_progress(user_id, completed_at DESC);

-- Interview questions (filter by topic + difficulty):
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_interview_questions_topic_difficulty
  ON interview_questions(topic_id, difficulty);

-- Full-text search (replaces ILIKE — 10-50x faster):
CREATE INDEX IF NOT EXISTS idx_notes_fts
  ON notes_metadata USING gin(to_tsvector('english', title || ' ' || COALESCE(tagline, '')));

CREATE INDEX IF NOT EXISTS idx_interview_questions_fts
  ON interview_questions USING gin(to_tsvector('english', title || ' ' || COALESCE(answer, '')));

CREATE INDEX IF NOT EXISTS idx_courses_fts
  ON courses USING gin(to_tsvector('english', title || ' ' || COALESCE(tagline, '') || ' ' || COALESCE(description, '')));

-- Blog:
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, created_at DESC);
```

---

### 4.2 New Tables to Add

```sql
-- User activity tracking (analytics + personalization + streaks):
CREATE TABLE IF NOT EXISTS user_activity_log (
  id            BIGSERIAL PRIMARY KEY,
  user_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
  event_type    VARCHAR(50)  NOT NULL,     -- 'note_view' | 'lesson_complete' | 'search' | 'purchase' | 'login'
  resource_type VARCHAR(30),               -- 'note' | 'course' | 'interview' | null
  resource_slug VARCHAR(100),
  metadata      JSONB        DEFAULT '{}', -- { "query": "kafka", "duration_ms": 1200, "part": 2 }
  ip_address    INET,
  created_at    TIMESTAMPTZ  DEFAULT NOW()
);
CREATE INDEX idx_user_activity_user_date  ON user_activity_log(user_id, created_at DESC);
CREATE INDEX idx_user_activity_event_date ON user_activity_log(event_type, created_at DESC);
CREATE INDEX idx_user_activity_resource   ON user_activity_log(resource_type, resource_slug);

-- User preferences (theme, notification settings, sidebar state):
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id            INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme              VARCHAR(20)  DEFAULT 'dark',
  email_notifs       BOOLEAN      DEFAULT true,
  sidebar_collapsed  BOOLEAN      DEFAULT false,
  last_viewed        JSONB        DEFAULT '{}',   -- { "note": "kafka", "course": "spark" }
  updated_at         TIMESTAMPTZ  DEFAULT NOW()
);

-- Note bookmarks (table exists — ensure it has right structure):
-- user_note_bookmarks already in schema — add index:
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON user_note_bookmarks(user_id, created_at DESC);

-- In-app notifications:
CREATE TABLE IF NOT EXISTS user_notifications (
  id           BIGSERIAL PRIMARY KEY,
  user_id      INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type         VARCHAR(50) NOT NULL,      -- 'purchase_success' | 'expiry_warning' | 'new_content'
  title        VARCHAR(200) NOT NULL,
  body         TEXT,
  link         VARCHAR(500),
  is_read      BOOLEAN      DEFAULT false,
  created_at   TIMESTAMPTZ  DEFAULT NOW()
);
CREATE INDEX idx_notifications_user_unread ON user_notifications(user_id, is_read, created_at DESC);

-- Referral system (optional, future):
CREATE TABLE IF NOT EXISTS referrals (
  id              BIGSERIAL PRIMARY KEY,
  referrer_id     INTEGER REFERENCES users(id),
  referred_id     INTEGER REFERENCES users(id),
  referral_code   VARCHAR(20) UNIQUE NOT NULL,
  status          VARCHAR(20) DEFAULT 'pending',  -- 'pending' | 'converted' | 'rewarded'
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 4.3 Materialized View for Dashboard Stats

```sql
-- Precomputed stats per user — refresh every hour via cron job:
CREATE MATERIALIZED VIEW IF NOT EXISTS user_dashboard_stats AS
SELECT
  u.id                                                AS user_id,
  COUNT(DISTINCT np.note_slug)                        AS notes_owned,
  COUNT(DISTINCT e.course_id)                         AS courses_enrolled,
  COUNT(DISTINCT ulp.lesson_id)                       AS lessons_completed,
  COUNT(DISTINCT ip.topic_slug)                       AS interviews_owned,
  MAX(ulp.completed_at)                               AS last_lesson_at,
  MAX(ual.created_at)                                 AS last_active_at
FROM users u
LEFT JOIN note_purchases       np  ON np.user_id = u.id AND np.expires_at > NOW()
LEFT JOIN enrollments          e   ON e.user_id  = u.id AND e.expires_at  > NOW()
LEFT JOIN user_lesson_progress ulp ON ulp.user_id = u.id
LEFT JOIN interview_purchases  ip  ON ip.user_id  = u.id AND ip.expires_at > NOW()
LEFT JOIN user_activity_log    ual ON ual.user_id  = u.id
GROUP BY u.id;

CREATE UNIQUE INDEX ON user_dashboard_stats(user_id);

-- Refresh command (add to a cron job):
-- REFRESH MATERIALIZED VIEW CONCURRENTLY user_dashboard_stats;
```

---

### 4.4 PostgreSQL Full-Text Search (Replace ILIKE)

```js
// repositories/SearchRepository.js
export class SearchRepository {
  static async search(query, userId) {
    const tsQuery = query.trim().split(/\s+/).join(' & ');

    const [notes, courses, questions] = await Promise.all([
      db.query(`
        SELECT slug, title, tagline, icon, color, 'note' AS type,
               ts_rank(to_tsvector('english', title || ' ' || COALESCE(tagline,'')),
                       to_tsquery('english', $1)) AS rank
        FROM notes_metadata
        WHERE to_tsvector('english', title || ' ' || COALESCE(tagline,'')) @@ to_tsquery('english', $1)
        ORDER BY rank DESC LIMIT 5
      `, [tsQuery]),

      db.query(`
        SELECT slug, title, tagline, icon, color, 'course' AS type,
               ts_rank(to_tsvector('english', title || ' ' || COALESCE(tagline,'')),
                       to_tsquery('english', $1)) AS rank
        FROM courses WHERE is_published = true
        AND to_tsvector('english', title || ' ' || COALESCE(tagline,'')) @@ to_tsquery('english', $1)
        ORDER BY rank DESC LIMIT 5
      `, [tsQuery]),

      db.query(`
        SELECT iq.slug, iq.title, it.slug AS topic_slug, 'question' AS type,
               ts_rank(to_tsvector('english', iq.title), to_tsquery('english', $1)) AS rank
        FROM interview_questions iq
        JOIN interview_topics it ON it.id = iq.topic_id
        WHERE to_tsvector('english', iq.title) @@ to_tsquery('english', $1)
        ORDER BY rank DESC LIMIT 5
      `, [tsQuery]),
    ]);

    return {
      notes: notes.rows,
      courses: courses.rows,
      questions: questions.rows,
    };
  }
}
```

---

### 4.5 SQL vs NoSQL Decision Guide

```
USE PostgreSQL (already have) for:
  ✅ Users, auth, sessions          — relational, ACID-critical
  ✅ Purchases, enrollments         — financial data, must be consistent
  ✅ Course/note/interview metadata — structured, queried relationally
  ✅ Blog posts, activity logs      — structured content + time-series queries

USE Redis (already have) for:
  ✅ Session tokens + OTPs          — TTL-based, fast lookup (already using)
  ✅ Rate limiting counters         — atomic increment (already using)
  ✅ Add: API response cache        — 60s–5min TTL for expensive queries
  ✅ Add: Streak counters           — Redis sorted sets for leaderboards
  ✅ Add: BullMQ job queues         — backed by Redis lists

DO NOT add yet:
  ❌ MongoDB — your data IS relational; Mongo would add complexity without benefit
  ❌ Elasticsearch — PostgreSQL FTS handles your scale (< 1M documents)
  ❌ Cassandra / DynamoDB — no write-heavy time-series requiring this scale
```

---

## 5. System Design

### 5.1 Production Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ENGINEOTES PRODUCTION                            │
│                                                                         │
│  Users (Browser/Mobile)                                                 │
│         │                                                               │
│         │ HTTPS                                                         │
│         ▼                                                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Cloudflare (CDN + DDoS + WAF + SSL termination)                │   │
│  │  — Serves static React build from edge cache                    │   │
│  │  — Rate limits malicious IPs before they hit your server        │   │
│  └──────────────────────────┬──────────────────────────────────────┘   │
│                             │                                           │
│  ┌──────────────────────────▼──────────────────────────────────────┐   │
│  │  Nginx (Reverse Proxy + Load Balancer)                          │   │
│  │  — Serves React SPA (dist/ folder)                              │   │
│  │  — Routes /api/* → Node.js cluster                              │   │
│  │  — SSL certificate via Let's Encrypt + Certbot                  │   │
│  └──────────┬─────────────────────────────────────┬───────────────┘   │
│             │                                     │                    │
│  ┌──────────▼──────────┐             ┌────────────▼──────────────┐    │
│  │  Node.js API #1     │             │  Node.js API #2            │    │
│  │  Express (port 4000)│             │  Express (port 4001)       │    │
│  │  PM2 cluster mode   │             │  PM2 cluster mode          │    │
│  └──────────┬──────────┘             └────────────┬──────────────┘    │
│             │                                     │                    │
│             └─────────────────┬───────────────────┘                   │
│                               │                                        │
│       ┌───────────────────────┼───────────────────────┐               │
│       │                       │                       │               │
│  ┌────▼────────┐    ┌─────────▼──────────┐  ┌────────▼───────┐       │
│  │ PostgreSQL  │    │       Redis         │  │ Cloudflare R2  │       │
│  │ Primary     │    │  Cache + Sessions   │  │ (File Storage) │       │
│  │ +           │    │  + Rate Limiting    │  │ PDFs, images   │       │
│  │ Read Replica│    │  + BullMQ queues    │  └────────────────┘       │
│  └────────────┘    └────────────────────┘                             │
│                                │                                       │
│                    ┌───────────▼────────────────┐                     │
│                    │  BullMQ Workers (separate   │                     │
│                    │  Node.js processes)         │                     │
│                    │  — Email sending            │                     │
│                    │  — Purchase expiry checks   │                     │
│                    │  — Stats aggregation        │                     │
│                    │  — Search index refresh     │                     │
│                    └────────────────────────────┘                     │
│                                                                        │
│  Observability:                                                        │
│  Pino logs → stdout → Loki → Grafana                                  │
│  Prometheus metrics → Grafana dashboards                               │
│  Sentry → error alerting                                               │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 5.2 Caching Strategy

```
Layer 1 — Browser cache:
  React build assets (JS/CSS) → Cloudflare CDN, long TTL (1 year, content-hash)
  API responses → Cache-Control headers where safe

Layer 2 — Route-level Redis cache (middleware):
  GET /notes/:slug      → 5 min TTL  (note content doesn't change often)
  GET /courses          → 2 min TTL  (list rarely changes)
  GET /search?q=        → 60s TTL    (deduplicate rapid searches)
  GET /interview/topics → 10 min TTL (very stable)

Layer 3 — Service-level cache (manual):
  User dashboard stats  → read from materialized view, refresh hourly
  Per-item prices       → cache in memory on API startup, bust on admin update

Cache invalidation rules:
  Admin updates note price → del cache:*:notes*, del note:{slug}
  User completes lesson   → del cache:{userId}:progress*
  New purchase            → del cache:{userId}:purchases
```

---

### 5.3 Background Jobs with BullMQ

```js
// src/jobs/queues.js
import { Queue } from 'bullmq';
import { redisConfig } from '../config/redis.js';

export const emailQueue   = new Queue('emails',   { connection: redisConfig });
export const analyticsQueue = new Queue('analytics', { connection: redisConfig });
export const cleanupQueue = new Queue('cleanup',  { connection: redisConfig });

// Scheduled jobs (set up on server start):
export const setupScheduledJobs = () => {
  // Daily: warn users whose purchases expire in 7 days
  emailQueue.add('expiry-warnings', {}, {
    repeat: { cron: '0 9 * * *' },
    jobId: 'daily-expiry-check',
  });

  // Hourly: refresh materialized views
  analyticsQueue.add('refresh-stats', {}, {
    repeat: { cron: '0 * * * *' },
    jobId: 'hourly-stats-refresh',
  });

  // Weekly: send engagement digest to inactive users (7+ days)
  emailQueue.add('engagement-digest', {}, {
    repeat: { cron: '0 10 * * 1' },
    jobId: 'weekly-digest',
  });
};

// src/jobs/workers/emailWorker.js
import { Worker } from 'bullmq';
new Worker('emails', async (job) => {
  switch (job.name) {
    case 'purchase-receipt':  return sendReceiptEmail(job.data);
    case 'expiry-warnings':   return sendExpiryWarnings();
    case 'engagement-digest': return sendEngagementDigests();
    case 'otp':               return sendOtpEmail(job.data);
  }
}, { connection: redisConfig, concurrency: 5 });
```

---

### 5.4 Scalability Strategies

```
Horizontal scaling (stateless API):
  — Node.js processes are stateless (sessions in Redis, not memory)
  — Add instances behind Nginx without any code changes
  — Use PM2 cluster mode: pm2 start server.js -i max

Database scaling:
  — Read replica for analytics/reporting queries (read-heavy)
  — Connection pooling via PgBouncer (prevents connection exhaustion)
  — Partition user_activity_log by month (once rows exceed 10M)

Read performance:
  — Materialized views for expensive aggregations (dashboard stats)
  — Partial indexes for active purchases / published content
  — Redis cache for hot paths (note content, course list)

Write performance:
  — Background jobs for non-critical writes (activity logging)
  — Batch inserts for activity events (buffer 10 events, flush every 5s)
  — Async email sending via queue (never block HTTP response)
```

---

## 6. Real-World Features

### 6.1 Feature Priority Matrix

| Feature | User Value | Effort | Do When |
|---------|-----------|--------|---------|
| Skeleton loaders | High | Low | **Now** |
| Toast notifications | High | Low | **Now** |
| Note bookmarks (UI) | High | Low | **Now** (table exists) |
| Progress cards on dashboard | High | Medium | **Now** |
| Empty state components | High | Low | **Now** |
| Activity heatmap | High | Medium | Week 2 |
| In-app notifications | Medium | Medium | Week 3 |
| Recently viewed (localStorage) | Medium | Low | Week 2 |
| Breadcrumb navigation | Medium | Low | Week 2 |
| Infinite scroll on question lists | Medium | Medium | Week 3 |
| Keyboard shortcuts guide (?) | Medium | Low | Week 3 |
| Course video player | High | High | Month 2 |
| Admin analytics charts | High | Medium | Month 2 |
| PDF note export | Low | High | Month 3 |
| Referral system | Medium | Medium | Month 3 |
| Dark/light theme toggle | Low | Medium | Month 3 |

---

### 6.2 Activity Heatmap Component

```jsx
// components/charts/ActivityHeatmap.jsx
// Shows 52 weeks × 7 days grid, colored by lesson completions per day
// Data source: user_activity_log WHERE event_type = 'lesson_complete'

import { useQuery } from '@tanstack/react-query';
import { eachDayOfInterval, subWeeks, format, getDay } from 'date-fns';

export function ActivityHeatmap({ userId }) {
  const { data } = useQuery({
    queryKey: ['activity-heatmap', userId],
    queryFn: () => api.activity.getHeatmap(userId),
    staleTime: 10 * 60 * 1000,
  });

  const today = new Date();
  const startDate = subWeeks(today, 51);
  const days = eachDayOfInterval({ start: startDate, end: today });
  const activityMap = new Map(data?.map(d => [d.date, d.count]) ?? []);

  const getColor = (count) => {
    if (!count) return 'bg-surface-3';
    if (count === 1) return 'bg-primary/30';
    if (count <= 3)  return 'bg-primary/60';
    return 'bg-primary';
  };

  return (
    <div className="grid grid-flow-col gap-1" style={{ gridTemplateRows: 'repeat(7, 1fr)' }}>
      {days.map((day) => (
        <div
          key={day.toISOString()}
          title={`${format(day, 'MMM d')}: ${activityMap.get(format(day, 'yyyy-MM-dd')) ?? 0} lessons`}
          className={`w-3 h-3 rounded-sm ${getColor(activityMap.get(format(day, 'yyyy-MM-dd')))}`}
        />
      ))}
    </div>
  );
}
```

---

### 6.3 Role-Based Dashboard Personalization

```js
// Dashboard renders different widgets based on user.role:
const DASHBOARD_CONFIG = {
  admin: {
    stats: [
      { key: 'totalUsers',      label: 'Total Users',      icon: Users },
      { key: 'mrr',             label: 'Monthly Revenue',  icon: DollarSign, format: 'currency' },
      { key: 'activeToday',     label: 'Active Today',     icon: Activity },
      { key: 'conversionRate',  label: 'Conversion Rate',  icon: TrendingUp, format: 'percent' },
    ],
    widgets: ['RevenueChart', 'RecentSignups', 'TopContent', 'AuditLog'],
  },
  user: {
    stats: [
      { key: 'notesOwned',        label: 'Notes Owned',         icon: BookOpen },
      { key: 'coursesEnrolled',   label: 'Courses Enrolled',    icon: Play },
      { key: 'lessonsCompleted',  label: 'Lessons Completed',   icon: CheckCircle },
      { key: 'streak',            label: 'Day Streak',          icon: Flame },
    ],
    widgets: ['ActivityHeatmap', 'OwnedContent', 'RecentActivity', 'Recommendations'],
  },
};
```

---

## 7. Performance Optimization

### 7.1 Frontend Performance

```js
// 1. Code splitting — all page-level components should be lazy:
const Dashboard     = lazy(() => import('./pages/dashboard/Dashboard'));
const CoursePage    = lazy(() => import('./pages/courses/CoursePage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const LearnPage     = lazy(() => import('./pages/courses/LearnPage'));

// 2. Prefetch on hover (link preloading):
<Link
  to="/courses/kafka"
  onMouseEnter={() => import('./pages/courses/CoursePage')}
>

// 3. Memoize pure list items:
const NoteCard      = memo(({ note }) => <Card {...note} />);
const QuestionRow   = memo(({ question }) => <Row {...question} />);

// 4. Virtualize long lists (interview questions can be 200+):
import { useVirtualizer } from '@tanstack/react-virtual';

// 5. Bundle analysis (run once, find large dependencies):
// npx vite-bundle-visualizer

// 6. Image optimization:
// — Always set width + height on <img> (prevents layout shift)
// — Use WebP format for course thumbnails
// — Lazy load below-fold images: <img loading="lazy" />

// 7. Avoid re-renders with stable references:
const queryFn = useCallback(() => api.notes.getNote(slug), [slug]);
```

---

### 7.2 Backend Performance

```js
// 1. Compression (add to server.js, before routes):
import compression from 'compression';
app.use(compression({ threshold: 1024 }));

// 2. Eliminate N+1 queries — use JOINs:
// ❌ N+1: fetch purchases, then metadata for each
// ✅ Single JOIN:
const { rows } = await query(`
  SELECT
    np.note_slug,
    np.expires_at,
    nm.title,
    nm.color,
    nm.icon,
    nm.level,
    nm.parts_count
  FROM note_purchases np
  JOIN notes_metadata nm ON nm.slug = np.note_slug
  WHERE np.user_id = $1
    AND np.expires_at > NOW()
  ORDER BY np.created_at DESC
`, [userId]);

// 3. Parallel queries where no dependency:
const [notePurchases, enrollments, progress] = await Promise.all([
  PurchaseRepo.getUserNotes(userId),
  PurchaseRepo.getUserCourses(userId),
  ProgressRepo.getSummary(userId),
]);

// 4. Paginate all list endpoints:
export const paginate = (page = 1, limit = 20) => ({
  limit: Math.min(limit, 100),
  offset: (Math.max(page, 1) - 1) * Math.min(limit, 100),
});

// 5. Tune PostgreSQL connection pool:
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
  statement_timeout: 10_000,    // kill queries running > 10s
});
```

---

### 7.3 Database Query Optimization Workflow

```sql
-- Step 1: Find slow queries (enable in postgresql.conf):
-- log_min_duration_statement = 100   -- log queries > 100ms

-- Step 2: Analyze specific queries:
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM note_purchases np
JOIN notes_metadata nm ON nm.slug = np.note_slug
WHERE np.user_id = 42 AND np.expires_at > NOW();

-- Step 3: Look for:
-- "Seq Scan" on large tables → needs index
-- "Hash Join" vs "Index Scan" → index usually wins at small scale
-- High "Buffers: hit" ratio → good, data is cached in shared_buffers

-- Step 4: PostgreSQL config tuning (postgresql.conf):
shared_buffers = '256MB'         -- 25% of RAM
effective_cache_size = '768MB'   -- 75% of RAM
work_mem = '16MB'                -- per-query sort/hash memory
maintenance_work_mem = '128MB'   -- for VACUUM, CREATE INDEX
random_page_cost = 1.1           -- SSD: set lower than default 4.0
```

---

## 8. DevOps & Deployment

### 8.1 Project Environment Files

```bash
# backend/.env.example — document every variable:
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/engineotes
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-256-bit-secret-here
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback
RESEND_API_KEY=re_xxxxxxxxxxxx
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
PRICE_NOTE=9900
PRICE_COURSE=99900
PRICE_INTERVIEW=9900
LOG_LEVEL=debug
FRONTEND_URL=http://localhost:5173
```

---

### 8.2 Docker Compose (Production)

```yaml
# docker-compose.prod.yml
version: '3.9'

x-api-env: &api-env
  NODE_ENV: production
  DATABASE_URL: ${DATABASE_URL}
  REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
  JWT_SECRET: ${JWT_SECRET}
  RESEND_API_KEY: ${RESEND_API_KEY}
  RAZORPAY_KEY_ID: ${RAZORPAY_KEY_ID}
  RAZORPAY_KEY_SECRET: ${RAZORPAY_KEY_SECRET}
  FRONTEND_URL: ${FRONTEND_URL}

services:
  nginx:
    image: nginx:1.25-alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./app/dist:/usr/share/nginx/html:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
    depends_on: [api]
    restart: unless-stopped

  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment: *api-env
    expose: ['4000']
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:4000/health']
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      replicas: 2

  worker:
    build:
      context: ./backend
      dockerfile: Dockerfile
    command: node src/jobs/startWorkers.js
    environment: *api-env
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: engineotes
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./backend/src/db/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql:ro
    restart: unless-stopped
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${POSTGRES_USER}']
      interval: 10s

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD} --appendonly yes
    volumes:
      - redisdata:/data
    restart: unless-stopped

  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: /bin/sh -c "trap exit TERM; while :; do certbot renew; sleep 12h & wait; done"

volumes:
  pgdata:
  redisdata:
```

---

### 8.3 Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS production
COPY src/ ./src/
COPY server.js ./

# Security: run as non-root
RUN addgroup -g 1001 nodejs && adduser -S -u 1001 nodejs
USER nodejs

EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=10s \
  CMD curl -f http://localhost:4000/health || exit 1

CMD ["node", "server.js"]
```

---

### 8.4 Nginx Configuration

```nginx
# nginx.conf
events { worker_connections 1024; }

http {
  include       /etc/nginx/mime.types;
  default_type  application/octet-stream;
  sendfile      on;
  gzip          on;
  gzip_types    text/plain text/css application/json application/javascript;

  upstream api_backend {
    server api:4000;
    keepalive 32;
  }

  server {
    listen 80;
    server_name yourdomain.com;
    # Redirect HTTP → HTTPS
    return 301 https://$host$request_uri;
  }

  server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;

    # Serve React SPA
    root /usr/share/nginx/html;
    index index.html;

    location / {
      try_files $uri $uri/ /index.html;
      # Cache static assets aggressively
      location ~* \.(js|css|png|jpg|ico|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
      }
    }

    # Proxy API requests
    location /api/ {
      proxy_pass         http://api_backend/;
      proxy_http_version 1.1;
      proxy_set_header   Upgrade $http_upgrade;
      proxy_set_header   Connection 'upgrade';
      proxy_set_header   Host $host;
      proxy_set_header   X-Real-IP $remote_addr;
      proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_cache_bypass $http_upgrade;
      proxy_read_timeout 60s;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;";
  }
}
```

---

### 8.5 GitHub Actions CI/CD Pipeline

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main, dev]

jobs:
  # ── Run on every push / PR ──────────────────────────────────────────
  test-backend:
    name: Backend Tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: engineotes_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7
        options: --health-cmd "redis-cli ping" --health-interval 10s
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm', cache-dependency-path: backend/package-lock.json }
      - run: cd backend && npm ci
      - run: cd backend && npm run db:migrate
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/engineotes_test
      - run: cd backend && npm test
        env:
          NODE_ENV: test
          DATABASE_URL: postgresql://test:test@localhost:5432/engineotes_test
          REDIS_URL: redis://localhost:6379
          JWT_SECRET: test-secret-for-ci

  test-frontend:
    name: Frontend Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm', cache-dependency-path: app/package-lock.json }
      - run: cd app && npm ci
      - run: cd app && npm run build

  # ── Deploy only on main branch after tests pass ──────────────────────
  deploy:
    name: Deploy to Production
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host:     ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key:      ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            set -e
            cd /opt/engineotes
            git pull origin main
            cd app && npm ci && npm run build
            cd ../
            docker compose -f docker-compose.prod.yml up -d --build api worker
            docker compose -f docker-compose.prod.yml exec api npm run db:migrate
            docker system prune -f
            echo "Deployment complete ✓"
```

---

### 8.6 Health Check Endpoint

```js
// Add to server.js:
app.get('/health', async (req, res) => {
  const checks = { status: 'ok', timestamp: new Date().toISOString() };

  try {
    await pool.query('SELECT 1');
    checks.database = 'ok';
  } catch {
    checks.database = 'error';
    checks.status = 'degraded';
  }

  try {
    await redis.ping();
    checks.redis = 'ok';
  } catch {
    checks.redis = 'error';
    checks.status = 'degraded';
  }

  res.status(checks.status === 'ok' ? 200 : 503).json(checks);
});
```

---

### 8.7 Monitoring Stack

```yaml
# Add to docker-compose.prod.yml for observability:

  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports: ['9090:9090']

  grafana:
    image: grafana/grafana:latest
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD}
    volumes:
      - grafana_data:/var/lib/grafana
    ports: ['3000:3000']
    depends_on: [prometheus]

  loki:
    image: grafana/loki:latest
    ports: ['3100:3100']
```

**Key dashboards to set up in Grafana:**
- HTTP request rate + latency (p50, p95, p99) per endpoint
- Error rate (4xx, 5xx) over time
- PostgreSQL: connections, slow queries, cache hit ratio
- Redis: memory usage, hit/miss ratio, connected clients
- Background jobs: queue depth, processing rate, failed jobs
- Business metrics: signups per day, purchases per day, MRR

---

## 9. Step-by-Step Upgrade Roadmap

### Phase 1 — Quick Wins (Week 1–2, High Impact, Low Effort)

**Goal:** Make the app look professional immediately, no architecture changes.

```
Day 1–2: Design System Foundation
  □ Define CSS variables in globals.css (colors, spacing, typography)
  □ Add Inter + JetBrains Mono fonts
  □ Install lucide-react, replace mixed icons
  □ Install react-hot-toast, add <Toaster /> to App.jsx

Day 3–4: Dashboard Redesign
  □ Add 4 StatCard components at top of Dashboard.jsx
  □ Replace bare purchase list with ProgressCard components
  □ Add EmptyState when user owns 0 items
  □ Add SkeletonCard while purchasesLoading = true

Day 5–6: Polish existing pages
  □ Add breadcrumbs to NotePage, CoursePage
  □ Fix padding/spacing inconsistencies (pick one scale, apply everywhere)
  □ Add loading skeletons to CoursePage and NotePage
  □ Style error states (currently shown as raw text)

Day 7: Backend quick wins
  □ Add centralized errorHandler middleware to server.js
  □ Add asyncHandler utility to remove try/catch from controllers
  □ Add compression middleware
  □ Add /health endpoint
```

### Phase 2 — Architecture Foundation (Week 3–4)

**Goal:** Replace fragile patterns with production patterns.

```
Week 3: Frontend architecture
  □ Install TanStack Query, set up queryClient.js
  □ Replace top 5 most-used useEffect/setState pairs with useQuery
  □ Split api/client.js into domain files (api/notes.js, api/courses.js, etc.)
  □ Add React Hook Form + Zod to Login, Signup, ForgotPassword
  □ Add Zustand uiStore (sidebar, modal state)

Week 4: Backend architecture
  □ Add Zod validation to all POST/PATCH endpoints
  □ Add Pino structured logging (replace console.log)
  □ Add per-endpoint rate limiting (auth routes especially)
  □ Add DB indexes (run the CREATE INDEX statements from Section 4.1)
  □ Extract NotesService and CoursesService from their controllers
  □ Add user_activity_log table + middleware to track events
```

### Phase 3 — Features & Analytics (Month 2)

**Goal:** Add features that make it feel like a real product.

```
  □ Activity heatmap on dashboard (user_activity_log → 52-week grid)
  □ Implement note bookmarks UI (API + DB already exist)
  □ Add in-app notifications (user_notifications table + UI badge)
  □ Install Recharts, build admin revenue + signups charts
  □ PostgreSQL full-text search (replace ILIKE in searchController)
  □ BullMQ workers for email queue (async email sending)
  □ Purchase expiry email notifications (daily cron job)
  □ Course video player — /courses/:slug/learn route
  □ Add user_preferences table + settings UI
```

### Phase 4 — Production Hardening (Month 3)

**Goal:** Production-ready deployment, monitoring, and scaling.

```
  □ Docker production compose (with nginx, api ×2, worker, postgres, redis)
  □ GitHub Actions CI/CD pipeline
  □ SSL certificate automation (Let's Encrypt + certbot)
  □ Prometheus metrics endpoint + Grafana dashboards
  □ Sentry integration (frontend + backend error tracking)
  □ Read replica setup for analytics queries
  □ Materialized view for user_dashboard_stats (refresh hourly)
  □ Rate limiting all endpoints (not just auth)
  □ Security audit: CSP headers, CORS config, SQL injection review
  □ Load testing: k6 or Artillery (simulate 100 concurrent users)
```

### Phase 5 — Growth Features (Month 4+)

```
  □ Referral system (referral_code on users + conversion tracking)
  □ Streak system with Redis sorted sets
  □ Mobile-responsive audit + fixes
  □ Progressive Web App (PWA) — offline note access
  □ Affiliate dashboard for referrers
  □ Course completion certificates (PDF generation)
  □ Community forum / discussion threads per note
```

---

## 10. Architecture Diagram

### Complete Data Flow

```
╔══════════════════════════════════════════════════════════════╗
║                    REQUEST LIFECYCLE                         ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  [Browser]                                                   ║
║     │  User clicks "View Kafka Note"                        ║
║     │                                                        ║
║     ▼  GET https://engineotes.com/notes/kafka               ║
║  [Cloudflare CDN]                                            ║
║     │  Serves React SPA from edge cache (static assets)     ║
║     │  Forwards /api/* requests to origin                   ║
║     │                                                        ║
║     ▼  GET /api/notes/kafka  +  Authorization: Bearer ...   ║
║  [Nginx]                                                     ║
║     │  Terminates SSL, forwards to Node.js                  ║
║     │                                                        ║
║     ▼                                                        ║
║  [Express Middleware Chain]                                  ║
║     │  requestLogger → cors → rateLimit → optionalAuth      ║
║     │                                                        ║
║     ▼                                                        ║
║  [notesController.getNote]                                   ║
║     │  Calls NotesService.getNote(slug, userId)             ║
║     │                                                        ║
║     ▼                                                        ║
║  [NotesService]                                              ║
║     │  1. cacheGet('note:kafka') → HIT? return cached       ║
║     │  2. MISS: NotesRepository.findBySlug('kafka')         ║
║     │  3. PurchaseService.hasNoteAccess(userId, 'kafka')    ║
║     │  4. cacheSet('note:kafka', data, 300)                 ║
║     │  5. ActivityService.log(userId, 'note_view', 'kafka') ║
║     │                                                        ║
║     ▼  [In parallel, non-blocking]                          ║
║  [Redis]           [PostgreSQL]         [ActivityQueue]     ║
║  cacheGet/Set      SELECT + JOIN        enqueue log event   ║
║     │                    │                    │             ║
║     └────────────────────┴────────────────────┘             ║
║                          │                                   ║
║     ◄─────────────────────                                   ║
║  [Response: 200 OK]                                          ║
║  { success: true, data: { note, hasAccess, freeParts } }    ║
║                                                              ║
║  [Background, after response sent]                           ║
║  BullMQ Worker processes ActivityQueue → INSERT activity_log ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 11. Folder Structure Reference

### Complete Backend Structure

```
backend/
├── server.js                        ← Express app entry point
├── Dockerfile
├── package.json
├── .env.example
└── src/
    ├── config/
    │   ├── db.js                    ← pg pool + query helper
    │   ├── redis.js                 ← ioredis + cacheGet/cacheSet
    │   ├── passport.js              ← Google OAuth strategy
    │   └── payment.js               ← Razorpay + ITEM_PRICES
    ├── middleware/
    │   ├── auth.js                  ← requireAuth, requireRole, optionalAuth
    │   ├── validate.js              ← Zod request validation
    │   ├── rateLimit.js             ← per-endpoint limiters
    │   ├── cache.js                 ← route-level Redis cache middleware
    │   ├── requestLogger.js         ← Pino HTTP logging
    │   └── errorHandler.js          ← centralized error handler (last middleware)
    ├── controllers/
    │   ├── authController.js
    │   ├── notesController.js
    │   ├── coursesController.js
    │   ├── paymentsController.js
    │   ├── interviewController.js
    │   ├── searchController.js
    │   ├── adminController.js
    │   ├── activityController.js    ← new: user activity feed
    │   └── notificationsController.js ← new: in-app notifications
    ├── services/
    │   ├── AuthService.js
    │   ├── NotesService.js
    │   ├── CoursesService.js
    │   ├── PurchaseService.js       ← access checking logic
    │   ├── PaymentService.js        ← order creation + verification
    │   ├── ActivityService.js       ← log events, get feed, heatmap
    │   ├── SearchService.js         ← FTS query builder
    │   └── EmailService.js          ← keep existing + add queue support
    ├── repositories/
    │   ├── UserRepository.js
    │   ├── NotesRepository.js
    │   ├── CoursesRepository.js
    │   ├── PurchaseRepository.js
    │   ├── ProgressRepository.js
    │   ├── ActivityRepository.js
    │   └── SearchRepository.js
    ├── validators/
    │   ├── authValidators.js
    │   ├── paymentValidators.js
    │   └── adminValidators.js
    ├── jobs/
    │   ├── queues.js                ← BullMQ queue definitions
    │   ├── startWorkers.js          ← worker process entry point
    │   └── workers/
    │       ├── emailWorker.js
    │       ├── analyticsWorker.js
    │       └── cleanupWorker.js
    ├── utils/
    │   ├── AppError.js
    │   ├── asyncHandler.js
    │   ├── logger.js                ← Pino instance
    │   └── paginate.js
    └── db/
        ├── schema.sql
        ├── seed.js
        ├── seedContent.js
        └── resetPrices.js
```

---

## 12. SaaS References & Inspiration

### UI/UX References

| Product | What to Study | URL |
|---------|--------------|-----|
| **Linear** | Density, keyboard-first UX, dark mode color system, empty states | linear.app |
| **Vercel Dashboard** | Stat cards, activity feeds, deployment timeline | vercel.com |
| **Railway** | Minimal dark theme, excellent empty states, typography | railway.app |
| **Planetscale** | Database-product dashboard patterns, data tables | planetscale.com |
| **Resend** | Clean SaaS dashboard, email product, minimal design | resend.com |

### Course Platform References

| Product | What to Study |
|---------|--------------|
| **Egghead.io** | Content-first layout, minimal chrome, progress tracking |
| **UI.dev** | Typography, lesson progress, chapter structure |
| **Josh Comeau's courses** | Dark mode aesthetics, callout components, animation |
| **Execute Program** | Spaced repetition UI, progress visualization |

### Component & Design System References

| Resource | What to Use It For |
|---------|-------------------|
| **shadcn/ui** (ui.shadcn.com) | Copy components directly — Button, Card, Dialog, Badge, Skeleton |
| **Tremor** (tremor.so) | Dashboard charts and stat card patterns |
| **Radix UI** (radix-ui.com) | Accessible headless primitives (shadcn wraps these) |
| **Heroicons / Lucide** | Consistent icon set — pick one and use only that |

### Technical References

| Resource | Topic |
|---------|-------|
| TanStack Query docs | Server state, caching, mutations |
| Pino docs | Structured logging, transports |
| BullMQ docs | Queue patterns, rate limiting, cron |
| PostgreSQL EXPLAIN docs | Query plan reading |
| `use-the-platform` | React patterns worth knowing |

---

## Summary: Where to Start Tomorrow

### The 3 Highest-ROI Changes

**1. Design system tokens (2 hours)**  
Add the CSS variables to `globals.css`. Immediately gives you a consistent visual foundation every component can reference. Zero breaking changes.

**2. Dashboard stat cards + skeletons (4 hours)**  
Replace the current Dashboard.jsx header area with 4 `StatCard` components and add `SkeletonCard` while `purchasesLoading = true`. This is the single most visible improvement.

**3. TanStack Query (half a day)**  
Install and set up the `queryClient`. Convert `Dashboard.jsx`, `CoursePage.jsx`, and `NotePage.jsx` to `useQuery`. Immediately eliminates loading state bugs, gives you caching, and makes the app feel faster.

> Everything else in this document flows from having these three foundations in place.

---

*Generated: May 2026 · EngiNotes Production Upgrade Plan v1.0*

---

## 13. Step-by-Step Deployment Guide

> This section walks through deploying EngiNotes on a fresh Ubuntu 22.04 VPS from zero to production. Every command is copy-pasteable. Run them in order.

---

### 13.1 Prerequisites Checklist

Before starting, have these ready:

```
□ A VPS with Ubuntu 22.04 (DigitalOcean, Hetzner, or AWS EC2 — minimum 2GB RAM)
□ A domain name pointed to your VPS IP (A record: engineotes.com → your.vps.ip)
□ SSH access to the server as root or a sudo user
□ Your GitHub repository URL (the EngiNotes repo)
□ All environment variable values (DB password, JWT secret, API keys, etc.)
```

---

### 13.2 Stage 1 — Server Initial Setup

**Connect to your VPS:**

```bash
ssh root@your.vps.ip
```

**Update system packages:**

```bash
apt update && apt upgrade -y
```

**Create a non-root deployment user:**

```bash
adduser deploy
usermod -aG sudo deploy

# Copy your SSH key to the deploy user so you can login without password:
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

**Switch to deploy user for everything from now on:**

```bash
su - deploy
```

**Install essential tools:**

```bash
sudo apt install -y git curl wget unzip ufw htop
```

**Configure firewall (UFW):**

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
# Expected output: OpenSSH, 80/tcp, 443/tcp — ALLOW
```

---

### 13.3 Stage 2 — Install Node.js

```bash
# Install Node.js 20 LTS via NodeSource:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify:
node --version   # v20.x.x
npm --version    # 10.x.x

# Install PM2 globally (process manager for Node.js):
sudo npm install -g pm2

# Install pnpm (optional but faster):
# sudo npm install -g pnpm
```

---

### 13.4 Stage 3 — Install Docker & Docker Compose

```bash
# Install Docker:
curl -fsSL https://get.docker.com | sudo bash

# Add deploy user to docker group (so you don't need sudo for docker):
sudo usermod -aG docker deploy

# Log out and back in to apply group change:
exit
su - deploy

# Verify:
docker --version         # Docker version 25.x.x
docker compose version   # Docker Compose version v2.x.x

# Test:
docker run hello-world
```

---

### 13.5 Stage 4 — Install Nginx

```bash
sudo apt install -y nginx

# Start and enable Nginx:
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify it's running:
sudo systemctl status nginx
# Expected: active (running)

# Test in browser: http://your.vps.ip → should show "Welcome to nginx!"
```

---

### 13.6 Stage 5 — Clone the Repository

```bash
# Create the app directory:
sudo mkdir -p /opt/engineotes
sudo chown deploy:deploy /opt/engineotes

# Clone your repo:
cd /opt/engineotes
git clone https://github.com/YOUR_USERNAME/engineotes.git .

# Verify structure:
ls
# Should show: app/  backend/  CLAUDE.md  README.md  SETUP.md  docker-compose.yml
```

---

### 13.7 Stage 6 — Configure Environment Variables

**Backend environment:**

```bash
cd /opt/engineotes/backend
cp .env.example .env
nano .env
```

Fill in every value:

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://engineotes_user:YOUR_DB_PASSWORD@localhost:5432/engineotes
REDIS_URL=redis://:YOUR_REDIS_PASSWORD@localhost:6379
JWT_SECRET=REPLACE_WITH_64_CHAR_RANDOM_STRING
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/auth/google/callback
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
PRICE_NOTE=9900
PRICE_COURSE=99900
PRICE_INTERVIEW=9900
LOG_LEVEL=info
FRONTEND_URL=https://yourdomain.com
```

**Generate a secure JWT secret:**

```bash
# Run this to generate a random 64-character secret:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copy the output into JWT_SECRET in your .env
```

**Frontend environment:**

```bash
cd /opt/engineotes/app
nano .env.production
```

```env
VITE_API_URL=https://yourdomain.com/api
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
```

---

### 13.8 Stage 7 — Start PostgreSQL and Redis with Docker

Create the Docker network and start only the data services first (not the app yet):

```bash
cd /opt/engineotes

# Create docker-compose for just DB + Redis (managed services):
cat > docker-compose.data.yml << 'EOF'
version: '3.9'
services:
  postgres:
    image: postgres:16-alpine
    container_name: engineotes_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: engineotes
      POSTGRES_USER: engineotes_user
      POSTGRES_PASSWORD: YOUR_DB_PASSWORD
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "127.0.0.1:5432:5432"   # only accessible from localhost
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U engineotes_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: engineotes_redis
    restart: unless-stopped
    command: redis-server --requirepass YOUR_REDIS_PASSWORD --appendonly yes
    volumes:
      - redisdata:/data
    ports:
      - "127.0.0.1:6379:6379"   # only accessible from localhost

volumes:
  pgdata:
  redisdata:
EOF

# Start the data services:
docker compose -f docker-compose.data.yml up -d

# Verify both containers are running:
docker compose -f docker-compose.data.yml ps
# Expected: engineotes_postgres — Up (healthy), engineotes_redis — Up
```

**Test database connection:**

```bash
docker exec -it engineotes_postgres psql -U engineotes_user -d engineotes -c "SELECT version();"
# Expected: PostgreSQL 16.x.x
```

---

### 13.9 Stage 8 — Run Database Migrations and Seed

```bash
cd /opt/engineotes/backend

# Install dependencies:
npm install --omit=dev

# Run schema migration:
npm run db:migrate
# Expected: schema.sql applied successfully

# Seed base data (users + course structure):
npm run db:seed

# Seed content (notes metadata + interview questions + blog posts):
npm run db:content

# Set default prices:
npm run db:reset-prices

# Verify tables were created:
docker exec -it engineotes_postgres psql -U engineotes_user -d engineotes -c "\dt"
# Expected: list of all tables (users, notes_metadata, courses, etc.)
```

---

### 13.10 Stage 9 — Build the Frontend

```bash
cd /opt/engineotes/app

# Install dependencies:
npm install

# Build for production:
npm run build

# Verify the build output:
ls dist/
# Expected: index.html  assets/  (js/css bundles with content hashes)

# Check build size:
du -sh dist/
# Typical: 2–5MB total
```

---

### 13.11 Stage 10 — Start the Backend with PM2

```bash
cd /opt/engineotes/backend

# Create PM2 ecosystem config:
cat > ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [
    {
      name: 'engineotes-api',
      script: 'server.js',
      instances: 2,              // use 2 CPU cores
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      error_file: '/var/log/pm2/engineotes-error.log',
      out_file:   '/var/log/pm2/engineotes-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      restart_delay: 3000,
      max_restarts: 10,
      watch: false,
    },
    {
      name: 'engineotes-worker',
      script: 'src/jobs/startWorkers.js',
      instances: 1,
      env_production: {
        NODE_ENV: 'production',
      },
      error_file: '/var/log/pm2/worker-error.log',
      out_file:   '/var/log/pm2/worker-out.log',
      restart_delay: 5000,
      watch: false,
    },
  ],
};
EOF

# Create log directory:
sudo mkdir -p /var/log/pm2
sudo chown deploy:deploy /var/log/pm2

# Start the API:
pm2 start ecosystem.config.cjs --env production

# Verify processes are running:
pm2 list
# Expected: engineotes-api (×2) and engineotes-worker — online

# View live logs:
pm2 logs engineotes-api --lines 50

# Save PM2 state (auto-restart after server reboot):
pm2 save

# Set PM2 to start on system boot:
pm2 startup
# It will print a command — copy and run that command with sudo
```

**Test API is responding:**

```bash
curl http://localhost:4000/health
# Expected: {"status":"ok","database":"ok","redis":"ok","timestamp":"..."}
```

---

### 13.12 Stage 11 — Configure Nginx as Reverse Proxy

```bash
# Remove the default Nginx site:
sudo rm /etc/nginx/sites-enabled/default

# Create EngiNotes site config:
sudo nano /etc/nginx/sites-available/engineotes
```

Paste this configuration (replace `yourdomain.com` with your actual domain):

```nginx
# /etc/nginx/sites-available/engineotes

# Redirect HTTP → HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    # Allow certbot verification:
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect everything else to HTTPS:
    location / {
        return 301 https://$host$request_uri;
    }
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates (filled in by certbot in next step):
    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers:
    add_header X-Frame-Options           "SAMEORIGIN"   always;
    add_header X-Content-Type-Options    "nosniff"      always;
    add_header Referrer-Policy           "strict-origin-when-cross-origin" always;
    add_header X-XSS-Protection          "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip compression:
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript
               text/xml application/xml image/svg+xml;
    gzip_min_length 1024;

    # Serve React SPA:
    root /opt/engineotes/app/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache hashed static assets forever:
    location ~* \.(js|css|woff2|woff|ttf|ico|png|jpg|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Proxy API requests to Node.js:
    location /api/ {
        # Strip /api prefix before forwarding:
        rewrite ^/api/(.*) /$1 break;

        proxy_pass         http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
        client_max_body_size 10M;
    }

    # Auth routes (no /api prefix in your current setup):
    location ~ ^/(auth|notes|courses|payments|search|interview|admin)/ {
        proxy_pass         http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
        client_max_body_size 10M;
    }

    # Health check (bypass proxy rewrite):
    location = /health {
        proxy_pass http://127.0.0.1:4000/health;
    }
}
```

```bash
# Enable the site:
sudo ln -s /etc/nginx/sites-available/engineotes /etc/nginx/sites-enabled/

# Test Nginx config syntax:
sudo nginx -t
# Expected: syntax is ok / test is successful

# Reload Nginx:
sudo systemctl reload nginx
```

---

### 13.13 Stage 12 — SSL Certificate with Let's Encrypt

```bash
# Install Certbot:
sudo apt install -y certbot python3-certbot-nginx

# Create webroot for certbot verification:
sudo mkdir -p /var/www/certbot

# Obtain SSL certificate (replace with your real domain and email):
sudo certbot --nginx \
  -d yourdomain.com \
  -d www.yourdomain.com \
  --email you@email.com \
  --agree-tos \
  --non-interactive \
  --redirect

# Verify auto-renewal is set up:
sudo certbot renew --dry-run
# Expected: Congratulations, all simulated renewals succeeded

# Certbot installs a cron job automatically. Verify:
sudo systemctl status certbot.timer
# Expected: active (waiting)

# Reload Nginx with the new certs:
sudo systemctl reload nginx
```

**Test SSL in browser:**

```
https://yourdomain.com → Should load your React app with green padlock
https://yourdomain.com/health → Should return {"status":"ok",...}
```

---

### 13.14 Stage 13 — Verify Full Deployment

Run through this checklist to confirm everything is working:

```bash
# 1. Check all processes are running:
pm2 list
docker compose -f /opt/engineotes/docker-compose.data.yml ps
sudo systemctl status nginx

# 2. Test API health:
curl https://yourdomain.com/health

# 3. Test database is seeded:
docker exec engineotes_postgres psql -U engineotes_user -d engineotes \
  -c "SELECT COUNT(*) FROM notes_metadata;"
# Expected: a number > 0

# 4. Test Redis:
docker exec engineotes_redis redis-cli -a YOUR_REDIS_PASSWORD ping
# Expected: PONG

# 5. Check Nginx logs for errors:
sudo tail -50 /var/log/nginx/error.log

# 6. Check API logs:
pm2 logs engineotes-api --lines 100

# 7. Check SSL rating:
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=yourdomain.com
# Expected: A or A+ grade
```

**Manual feature tests (in browser):**

```
□ Homepage loads correctly
□ Register a new account → OTP email arrives → verify works
□ Login with that account
□ Google OAuth login
□ Dashboard shows correctly (empty state or owned content)
□ Browse Notes page → click a note → part 1 loads free
□ Browse Courses page → course details load
□ Search (Ctrl+K) returns results
□ Checkout flow → dummy/Razorpay payment → redirects to PaymentSuccess
□ Dashboard shows newly purchased item
□ Admin dashboard accessible with admin account
```

---

### 13.15 Stage 14 — Deployment Automation (Update Script)

After the first deployment, future deploys should be one command. Create this script:

```bash
nano /opt/engineotes/deploy.sh
```

```bash
#!/bin/bash
set -e   # exit on any error

echo "════════════════════════════════════════"
echo "  EngiNotes Deployment  $(date)"
echo "════════════════════════════════════════"

APP_DIR="/opt/engineotes"
cd "$APP_DIR"

# 1. Pull latest code:
echo "→ Pulling latest code..."
git pull origin main

# 2. Install backend dependencies:
echo "→ Installing backend dependencies..."
cd backend && npm install --omit=dev && cd ..

# 3. Run DB migrations (idempotent — safe to run every time):
echo "→ Running database migrations..."
cd backend && npm run db:migrate && cd ..

# 4. Build frontend:
echo "→ Building frontend..."
cd app && npm install && npm run build && cd ..

# 5. Reload API processes (zero-downtime):
echo "→ Reloading API processes..."
pm2 reload engineotes-api --update-env
pm2 reload engineotes-worker --update-env

# 6. Reload Nginx (picks up any new static files):
echo "→ Reloading Nginx..."
sudo systemctl reload nginx

# 7. Health check:
echo "→ Running health check..."
sleep 3
HEALTH=$(curl -s https://yourdomain.com/health | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['status'])")
if [ "$HEALTH" = "ok" ]; then
  echo "✓ Health check passed — deployment complete!"
else
  echo "✗ Health check failed — check logs: pm2 logs engineotes-api"
  exit 1
fi

echo "════════════════════════════════════════"
```

```bash
# Make it executable:
chmod +x /opt/engineotes/deploy.sh

# Test it:
/opt/engineotes/deploy.sh

# Future deploys — just run:
# cd /opt/engineotes && ./deploy.sh
```

---

### 13.16 Stage 15 — Server Hardening (Security)

```bash
# 1. Disable root SSH login:
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
# Set: PasswordAuthentication no   (only SSH key login)
sudo systemctl restart ssh

# 2. Install Fail2Ban (blocks IPs after repeated failed logins):
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# 3. Automatic security updates:
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
# Select "Yes"

# 4. Check open ports — should only be 22, 80, 443:
sudo ss -tulpn | grep LISTEN

# 5. Ensure DB and Redis are NOT exposed to internet (only localhost):
# Verify these show 127.0.0.1 not 0.0.0.0:
sudo ss -tulpn | grep 5432   # postgres
sudo ss -tulpn | grep 6379   # redis
```

---

### 13.17 Stage 16 — Monitoring Setup

**Set up PM2 monitoring dashboard:**

```bash
# PM2 Plus (free tier available):
pm2 plus
# Follow the link to connect your dashboard

# Or use the local web dashboard:
pm2 install pm2-server-monit
```

**Set up basic log rotation:**

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

**Uptime monitoring (free external check):**

```bash
# Use UptimeRobot (free) — monitor these URLs:
# https://yourdomain.com/health        → HTTP keyword check for "ok"
# https://yourdomain.com              → HTTP 200 check
# Alert: email notification on downtime
```

**Optional — Sentry error tracking:**

```bash
# Frontend (app/):
npm install @sentry/react

# Backend:
npm install @sentry/node

# Add to backend/server.js (before all routes):
import * as Sentry from '@sentry/node';
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

# Add error handler (after Sentry.init, before other error handlers):
app.use(Sentry.Handlers.errorHandler());
```

---

### 13.18 Troubleshooting Reference

| Problem | First thing to check | Command |
|---------|---------------------|---------|
| Site shows 502 Bad Gateway | API process crashed | `pm2 list` + `pm2 logs engineotes-api` |
| Site shows 404 | Nginx root path or SPA fallback | `sudo nginx -t` + check nginx config |
| API returns 500 | Backend error | `pm2 logs engineotes-api --lines 100` |
| Database connection error | Postgres container down | `docker compose -f docker-compose.data.yml ps` |
| Redis connection error | Redis container down | `docker exec engineotes_redis redis-cli ping` |
| SSL certificate error | Cert expired or wrong domain | `sudo certbot renew` |
| OTP emails not arriving | Resend API key / domain verification | Check Resend dashboard |
| Payments failing | Razorpay key mismatch (test vs live) | Check `.env` RAZORPAY_KEY_ID |
| After reboot, app not running | PM2 startup not configured | `pm2 startup` → run the printed command |
| High memory usage | Node.js memory leak or too many instances | `pm2 monit` |

---

### 13.19 Deployment Checklist (Final Verification)

```
Infrastructure:
  □ VPS running Ubuntu 22.04 with ≥ 2GB RAM
  □ Firewall: only ports 22, 80, 443 open
  □ Deploy user (non-root) with sudo access
  □ SSH key authentication only (password auth disabled)

Services:
  □ Docker + Docker Compose installed
  □ PostgreSQL container running and healthy
  □ Redis container running and responding to PING
  □ Node.js 20 + PM2 installed
  □ Nginx installed and active

Application:
  □ Repository cloned to /opt/engineotes
  □ backend/.env configured (all values filled)
  □ app/.env.production configured
  □ DB migrations applied (npm run db:migrate)
  □ Seed data loaded (npm run db:seed + db:content)
  □ Frontend built (app/dist/ exists)
  □ PM2 running engineotes-api (×2) + engineotes-worker
  □ PM2 saved (pm2 save) + startup configured

Networking:
  □ Nginx config passes syntax check (nginx -t)
  □ SSL certificate obtained and valid
  □ HTTPS redirect working (HTTP → HTTPS)
  □ /health endpoint returns {"status":"ok"}

Automation:
  □ deploy.sh script created and tested
  □ PM2 log rotation configured
  □ Certbot auto-renewal verified (dry-run passed)

Monitoring:
  □ UptimeRobot (or similar) configured for /health
  □ PM2 log rotation active
  □ Error alerting set up (Sentry or email)
```

---

## 14. Claude AI Deployment Prompts

> Copy any of these prompts directly into Claude AI. Each is self-contained — paste it, and Claude will execute that stage of the deployment.

---

### Prompt 1 — Initial Server Setup

```
I am deploying a Node.js + PostgreSQL + Redis web application called EngiNotes on a fresh Ubuntu 22.04 VPS. My VPS IP is [YOUR_VPS_IP] and my domain is [YOUR_DOMAIN].

Please help me with the initial server setup. I need you to:
1. Update system packages (apt update && apt upgrade)
2. Create a non-root user called "deploy" with sudo access and copy SSH keys
3. Install: git, curl, wget, ufw, htop
4. Configure UFW firewall to allow only SSH (22), HTTP (80), and HTTPS (443)
5. Install Node.js 20 LTS using NodeSource
6. Install PM2 globally
7. Install Docker and Docker Compose, and add the deploy user to the docker group
8. Install Nginx

After each step, verify it succeeded and show me the output. If any step fails, diagnose and fix it before moving on.

My current situation: I am logged in as root via SSH.
```

---

### Prompt 2 — Database and Redis Setup

```
I have a fresh Ubuntu 22.04 server with Docker installed. I need to set up PostgreSQL 16 and Redis 7 for my Node.js application called EngiNotes.

Both services should:
- Run as Docker containers
- Only be accessible from localhost (127.0.0.1), NOT exposed to the internet
- Restart automatically if the server reboots
- Have health checks configured

My environment details:
- App directory: /opt/engineotes
- Database name: engineotes
- Database user: engineotes_user
- Database password: [I will provide this]
- Redis password: [I will provide this]

Please:
1. Create a docker-compose.data.yml file in /opt/engineotes with these services
2. Start the containers
3. Verify PostgreSQL is running and accepting connections
4. Verify Redis is running and responding to PING
5. Show me how to test both from the command line

Do not expose any ports to 0.0.0.0 — bind to 127.0.0.1 only for security.
```

---

### Prompt 3 — Environment Configuration

```
I am setting up environment variables for my EngiNotes application. The app is at /opt/engineotes.

It is a full-stack app with:
- Backend: Node.js + Express at /opt/engineotes/backend (port 4000)
- Frontend: React + Vite at /opt/engineotes/app
- Database: PostgreSQL running locally on port 5432
- Cache: Redis running locally on port 6379

I need you to:
1. Help me create /opt/engineotes/backend/.env with all required variables (I will give you the values)
2. Help me create /opt/engineotes/app/.env.production for the Vite build
3. Generate a cryptographically secure 64-character JWT_SECRET using Node.js
4. Explain what each variable does and what happens if it is wrong

The variables I need configured are:
NODE_ENV, PORT, DATABASE_URL, REDIS_URL, JWT_SECRET, JWT_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL, RESEND_API_KEY, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, PRICE_NOTE, PRICE_COURSE, PRICE_INTERVIEW, LOG_LEVEL, FRONTEND_URL

For the frontend: VITE_API_URL, VITE_RAZORPAY_KEY_ID

My domain is [YOUR_DOMAIN]. Show me exactly what to put in each file.
```

---

### Prompt 4 — Database Migration and Seeding

```
I have a Node.js + PostgreSQL application called EngiNotes. The database is running in Docker and is accessible at localhost:5432. My app is at /opt/engineotes/backend.

I need you to help me:
1. Install backend npm dependencies (production only, no devDependencies)
2. Run the database schema migration: npm run db:migrate
3. Run the base seed: npm run db:seed (users + course structure)
4. Run the content seed: npm run db:content (notes + interview questions + blog posts)
5. Run price reset: npm run db:reset-prices
6. Verify the data was seeded correctly by querying key tables

After each step, run a verification query to confirm it worked. If any migration fails, show me the full error and help diagnose what went wrong.

For verification, query these tables and show row counts:
- users
- notes_metadata
- courses
- interview_topics
- interview_questions
- blog_posts

My .env file is already configured. The DATABASE_URL is: postgresql://engineotes_user:[PASSWORD]@localhost:5432/engineotes
```

---

### Prompt 5 — Build Frontend and Start with PM2

```
I have a React + Vite frontend at /opt/engineotes/app and a Node.js backend at /opt/engineotes/backend. I need to build the frontend and start the backend with PM2.

Please help me:

1. Build the frontend:
   - cd /opt/engineotes/app && npm install && npm run build
   - Verify the dist/ folder was created and contains index.html
   - Show me the build size

2. Create a PM2 ecosystem config at /opt/engineotes/backend/ecosystem.config.cjs with:
   - App name: engineotes-api
   - Script: server.js
   - 2 instances in cluster mode (for 2 CPU cores)
   - Environment: production
   - Log files at /var/log/pm2/
   - A separate process for background workers: src/jobs/startWorkers.js

3. Create the log directory: /var/log/pm2

4. Start with PM2 using production environment

5. Verify the API is running:
   - pm2 list (show all processes)
   - curl http://localhost:4000/health (should return {"status":"ok",...})

6. Save PM2 state and configure startup (so it survives server reboots)

If the API fails to start, show me the PM2 logs to diagnose the error.
```

---

### Prompt 6 — Nginx Configuration

```
I have a web application called EngiNotes running on Ubuntu 22.04. I need to configure Nginx as a reverse proxy.

Setup details:
- Domain: [YOUR_DOMAIN] (both yourdomain.com and www.yourdomain.com)
- React SPA build files: /opt/engineotes/app/dist/
- Node.js API: running on http://127.0.0.1:4000
- API routes in the backend: /auth/*, /notes/*, /courses/*, /payments/*, /search, /interview/*, /admin/*, /health

I need the Nginx config to:
1. Redirect all HTTP (port 80) to HTTPS
2. Serve the React SPA from the dist folder on HTTPS (port 443)
3. Handle React Router — all unknown routes should serve index.html (SPA fallback)
4. Proxy backend routes to localhost:4000
5. Cache static assets (JS/CSS/fonts) with 1-year Cache-Control + immutable
6. Enable gzip compression for text/HTML/JSON/JS/CSS
7. Add security headers: X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy
8. Allow Certbot ACME challenge at /.well-known/acme-challenge/
9. Leave SSL certificate lines as placeholders (certbot will fill them in next step)

Please:
1. Create /etc/nginx/sites-available/engineotes with the complete config
2. Enable it: ln -s sites-available/engineotes sites-enabled/
3. Remove the default site
4. Test config: nginx -t
5. Reload Nginx

Show me the complete config file before applying it.
```

---

### Prompt 7 — SSL Certificate Setup

```
I have Nginx configured for my domain [YOUR_DOMAIN] on Ubuntu 22.04. I need to set up a free SSL certificate using Let's Encrypt and Certbot.

Please help me:
1. Install certbot and python3-certbot-nginx
2. Create the webroot directory for ACME challenges: /var/www/certbot
3. Obtain SSL certificate for yourdomain.com AND www.yourdomain.com using the nginx plugin
4. Verify the certificate was installed correctly
5. Test automatic renewal: certbot renew --dry-run
6. Verify the certbot systemd timer is active for auto-renewal
7. Reload Nginx after certificate installation

My email for Let's Encrypt notifications: [YOUR_EMAIL]
My domain: [YOUR_DOMAIN]

After setup, verify:
- https://yourdomain.com loads with a valid certificate (green padlock)
- http://yourdomain.com redirects to https://
- The certificate expiry date (should be 90 days from now)

If the certificate request fails (often because DNS hasn't propagated), show me how to diagnose it.
```

---

### Prompt 8 — Full Verification and Testing

```
I have deployed my EngiNotes web application. I need to verify the complete deployment is working correctly before going live.

My domain: [YOUR_DOMAIN]
Admin email: [YOUR_ADMIN_EMAIL]

Please run through this verification sequence and show me the output of each check:

1. INFRASTRUCTURE CHECKS:
   - pm2 list → all processes should be "online"
   - docker compose -f /opt/engineotes/docker-compose.data.yml ps → all containers "Up (healthy)"
   - sudo systemctl status nginx → active (running)
   - sudo ufw status → only 22, 80, 443 open

2. API HEALTH:
   - curl https://[YOUR_DOMAIN]/health → {"status":"ok","database":"ok","redis":"ok"}
   - curl -I https://[YOUR_DOMAIN] → HTTP/2 200

3. SSL CHECK:
   - curl -v https://[YOUR_DOMAIN] 2>&1 | grep "SSL connection"
   - Check certificate expiry: echo | openssl s_client -connect [YOUR_DOMAIN]:443 2>/dev/null | openssl x509 -noout -dates

4. DATABASE CHECK:
   - Row counts for all key tables
   - Verify indexes exist

5. LOG CHECK:
   - Last 20 lines of PM2 API logs (should show successful requests)
   - Last 20 lines of Nginx error log (should be empty or minor)

6. SECURITY CHECK:
   - Verify Postgres is NOT accessible from internet: nc -zv [YOUR_DOMAIN] 5432 (should fail)
   - Verify Redis is NOT accessible from internet: nc -zv [YOUR_DOMAIN] 6379 (should fail)

For any check that fails, diagnose the root cause and fix it.
```

---

### Prompt 9 — Deploy Script and Automation

```
My EngiNotes application is running in production at /opt/engineotes on Ubuntu 22.04. I need to create a deployment automation script so future code updates are simple.

The app uses:
- Git repository at /opt/engineotes (remote: GitHub)
- Frontend: React + Vite (build command: cd app && npm install && npm run build)
- Backend: Node.js (dependencies: cd backend && npm install --omit=dev)
- Database: PostgreSQL (migrations: cd backend && npm run db:migrate)
- Process manager: PM2 (reload command: pm2 reload engineotes-api --update-env)
- Web server: Nginx (reload: sudo systemctl reload nginx)

Please create /opt/engineotes/deploy.sh that:
1. Pulls latest code from main branch (git pull origin main)
2. Installs backend production dependencies
3. Runs database migrations (idempotent — safe every time)
4. Builds the frontend
5. Reloads PM2 processes with zero downtime (pm2 reload, not restart)
6. Reloads Nginx to serve new static files
7. Waits 3 seconds, then runs a health check against https://[YOUR_DOMAIN]/health
8. Prints success or failure with timestamp
9. Exits with code 1 if health check fails (so CI/CD can detect failures)

The script should:
- Use set -e (stop on any error)
- Print a timestamped header and clear section markers
- Be executable (chmod +x)
- Work when run as the "deploy" user

Also show me how to test it safely on the first run.
```

---

### Prompt 10 — Troubleshooting a Broken Deployment

```
My EngiNotes application deployed on Ubuntu 22.04 is having an issue. Here is what I see:

[PASTE THE ERROR YOU ARE SEEING HERE — e.g., "502 Bad Gateway", "site not loading", "database connection refused"]

My setup:
- Domain: [YOUR_DOMAIN]
- Frontend: React SPA served by Nginx from /opt/engineotes/app/dist
- Backend: Node.js API on port 4000, managed by PM2
- Database: PostgreSQL in Docker container
- Cache: Redis in Docker container

Please help me diagnose by running these checks in order and interpreting the results:
1. pm2 list — are the API processes online?
2. pm2 logs engineotes-api --lines 50 — any errors in the API?
3. sudo systemctl status nginx — is Nginx running?
4. sudo nginx -t — is the Nginx config valid?
5. docker compose -f /opt/engineotes/docker-compose.data.yml ps — are DB/Redis up?
6. curl http://localhost:4000/health — can the API be reached directly?
7. sudo tail -30 /var/log/nginx/error.log — any Nginx errors?
8. sudo tail -30 /var/log/nginx/access.log — what requests are coming in?

Based on the output, identify the root cause and provide the exact commands to fix it. Do not suggest workarounds — find and fix the actual problem.
```

---

### Prompt 11 — Add a New Feature to Production

```
I need to deploy a new feature to my production EngiNotes application. The feature is:

[DESCRIBE THE FEATURE — e.g., "Add the ActivityHeatmap component to the Dashboard, backed by a new user_activity_log table and GET /activity/heatmap API endpoint"]

My stack:
- Frontend: React 19 + Vite at /opt/engineotes/app (served by Nginx)
- Backend: Node.js + Express at /opt/engineotes/backend (managed by PM2)
- Database: PostgreSQL 16 (schema in backend/src/db/schema.sql)
- Cache: Redis 7

The feature involves changes to:
[ ] Frontend only (React components)
[ ] Backend only (new API endpoint)
[ ] Database (new table or columns)
[ ] All three

Please give me:
1. The exact code changes needed (file paths + what to add/modify)
2. If there are DB changes: the migration SQL to run (must be idempotent with IF NOT EXISTS)
3. The deployment sequence:
   a. Run DB migration first (zero-downtime: adding tables/columns is safe)
   b. Deploy backend (pm2 reload — zero-downtime)
   c. Build and deploy frontend (nginx serves new dist/)
4. How to verify the feature is working in production
5. How to roll back if something goes wrong

I want zero downtime during the deployment.
```

---

### Prompt 12 — Performance Audit

```
My EngiNotes application is running in production at [YOUR_DOMAIN]. I want to audit its performance and identify bottlenecks.

Stack: React 19 + Vite (frontend) · Node.js + Express (backend) · PostgreSQL 16 · Redis 7

Please help me run a complete performance audit:

1. FRONTEND BUNDLE ANALYSIS:
   - Check the dist/ folder sizes: du -sh /opt/engineotes/app/dist/assets/*
   - Identify any JS chunks over 200KB
   - Check if code splitting is working (should be multiple chunks, not one large bundle)

2. API RESPONSE TIMES:
   - Use curl with timing to measure these endpoints:
     - GET /health
     - GET /notes (list all notes)
     - GET /courses (list all courses)
     - GET /search?q=kafka
   - Flag any endpoint over 200ms

3. DATABASE QUERY ANALYSIS:
   - Check if key indexes exist (note_purchases, enrollments, user_lesson_progress)
   - Run EXPLAIN ANALYZE on the most common queries
   - Check PostgreSQL's pg_stat_user_tables for sequential scans on large tables

4. REDIS HIT RATE:
   - docker exec engineotes_redis redis-cli -a [PASSWORD] INFO stats
   - Calculate: keyspace_hits / (keyspace_hits + keyspace_misses) — should be > 70%

5. NODE.JS MEMORY:
   - pm2 monit — current memory per process
   - Flag if any process exceeds 300MB

For each finding, give me a specific fix with the exact code or config change needed.
```

---

*Generated: May 2026 · EngiNotes Production Upgrade Plan v1.0*
