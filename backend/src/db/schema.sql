-- ============================================================
--  Engineering Learning Platform — PostgreSQL Schema
--  Run once to initialise the database.
--  Idempotent: uses IF NOT EXISTS / ON CONFLICT DO NOTHING.
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── USERS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT,                         -- NULL for OAuth-only accounts
  google_id     TEXT UNIQUE,
  avatar_url    TEXT,
  role          TEXT NOT NULL DEFAULT 'user'  -- 'user' | 'premium' | 'admin'
                  CHECK (role IN ('user','premium','admin')),
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email    ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google   ON users(google_id);

-- ── REFRESH TOKENS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,            -- bcrypt hash of the token
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rt_user ON refresh_tokens(user_id);

-- ── PREMIUM SUBSCRIPTIONS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS premium_subscriptions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan          TEXT NOT NULL                -- 'monthly' | 'yearly' | 'lifetime'
                  CHECK (plan IN ('monthly','yearly','lifetime')),
  started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at    TIMESTAMPTZ,                 -- NULL = lifetime
  payment_id    TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sub_user ON premium_subscriptions(user_id);

-- ── COURSES ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT NOT NULL UNIQUE,
  title         TEXT NOT NULL,
  description   TEXT,
  thumbnail_url TEXT,
  price         INTEGER NOT NULL DEFAULT 0,  -- paise (100 = ₹1)
  is_published  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── SECTIONS (chapters inside a course) ──────────────────────
CREATE TABLE IF NOT EXISTS sections (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id    UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  order_index  INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sections_course ON sections(course_id);

-- ── LESSONS (videos inside a section) ────────────────────────
CREATE TABLE IF NOT EXISTS lessons (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id       UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  video_url        TEXT,
  duration_seconds INTEGER,
  is_preview       BOOLEAN NOT NULL DEFAULT FALSE,  -- free preview?
  order_index      INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lessons_section ON lessons(section_id);

-- ── ENROLLMENTS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enrollments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id   UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  payment_id  TEXT,
  UNIQUE (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enroll_user   ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enroll_course ON enrollments(course_id);

-- ── PAYMENTS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id),
  course_id           UUID REFERENCES courses(id),
  razorpay_order_id   TEXT UNIQUE,
  razorpay_payment_id TEXT,
  amount              INTEGER NOT NULL,   -- paise
  currency            TEXT NOT NULL DEFAULT 'INR',
  status              TEXT NOT NULL DEFAULT 'created'
                        CHECK (status IN ('created','paid','failed','refunded')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);

-- ── NOTES METADATA ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notes_metadata (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           TEXT NOT NULL UNIQUE,
  category       TEXT NOT NULL,
  title          TEXT NOT NULL,
  tagline        TEXT,
  icon           TEXT,
  color          TEXT,
  level          TEXT CHECK (level IN ('Beginner','Intermediate','Advanced')),
  parts_count    INTEGER NOT NULL DEFAULT 0,
  sections_count INTEGER NOT NULL DEFAULT 0,
  price          INTEGER NOT NULL DEFAULT 0,  -- paise (0 = free, 49900 = ₹499)
  free_parts     INTEGER NOT NULL DEFAULT 2,  -- how many parts are free
  is_premium     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add new columns to notes_metadata if upgrading from older schema
ALTER TABLE notes_metadata ADD COLUMN IF NOT EXISTS tagline        TEXT;
ALTER TABLE notes_metadata ADD COLUMN IF NOT EXISTS icon           TEXT;
ALTER TABLE notes_metadata ADD COLUMN IF NOT EXISTS color          TEXT;
ALTER TABLE notes_metadata ADD COLUMN IF NOT EXISTS level          TEXT;
ALTER TABLE notes_metadata ADD COLUMN IF NOT EXISTS parts_count    INTEGER NOT NULL DEFAULT 0;
ALTER TABLE notes_metadata ADD COLUMN IF NOT EXISTS sections_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE notes_metadata ADD COLUMN IF NOT EXISTS price          INTEGER NOT NULL DEFAULT 0;
ALTER TABLE notes_metadata ADD COLUMN IF NOT EXISTS free_parts     INTEGER NOT NULL DEFAULT 2;
ALTER TABLE notes_metadata ADD COLUMN IF NOT EXISTS updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- ── INTERVIEW TOPICS ─────────────────────────────────────────
-- Each topic is a purchasable pack of interview questions
CREATE TABLE IF NOT EXISTS interview_topics (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  description     TEXT,
  icon            TEXT,
  color           TEXT,
  price           INTEGER NOT NULL DEFAULT 0,   -- paise
  total_questions INTEGER NOT NULL DEFAULT 0,
  free_questions  INTEGER NOT NULL DEFAULT 0,
  is_published    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── BLOG POSTS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  excerpt         TEXT,
  content         JSONB NOT NULL DEFAULT '[]',
  author_name     TEXT,
  author_initials TEXT,
  author_color    TEXT,
  category_id     TEXT NOT NULL,     -- matches POST_CATEGORIES id
  company         TEXT,              -- for interview experience posts
  tags            TEXT[],
  read_time       TEXT,
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_category   ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_published  ON blog_posts(is_published, published_at DESC);

-- ── NOTE PURCHASES (à la carte) ──────────────────────────────
-- Tracks which user bought which individual note
CREATE TABLE IF NOT EXISTS note_purchases (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  note_slug  TEXT NOT NULL,
  payment_id TEXT,
  amount     INTEGER NOT NULL,
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, note_slug)
);

CREATE INDEX IF NOT EXISTS idx_note_purchase_user ON note_purchases(user_id);

-- ── INTERVIEW PURCHASES (à la carte) ─────────────────────────
CREATE TABLE IF NOT EXISTS interview_purchases (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_slug TEXT NOT NULL,
  payment_id TEXT,
  amount     INTEGER NOT NULL,
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, topic_slug)
);

CREATE INDEX IF NOT EXISTS idx_interview_purchase_user ON interview_purchases(user_id);

-- ── NOTE PARTS (content blocks stored as JSONB) ─────────────
-- Each row = one part of a note (Part 1, Part 2, …)
-- `blocks` is an ordered array of content block objects.
-- Block types: ph, section, ss, s3, p, ul, ol, callout, code, table, diagram, divider
CREATE TABLE IF NOT EXISTS note_parts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_slug   TEXT NOT NULL,
  part_index  INTEGER NOT NULL,   -- 0-based (Part 1 = 0)
  title       TEXT NOT NULL,
  blocks      JSONB NOT NULL DEFAULT '[]',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(note_slug, part_index)
);

CREATE INDEX IF NOT EXISTS idx_note_parts_slug ON note_parts(note_slug);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'note_parts_updated_at') THEN
    CREATE TRIGGER note_parts_updated_at
      BEFORE UPDATE ON note_parts
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;

-- ── INTERVIEW QUESTIONS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS interview_questions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id         TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  title            TEXT NOT NULL,
  description      TEXT,
  answer           TEXT,
  code             TEXT,
  difficulty       TEXT NOT NULL CHECK (difficulty IN ('Easy','Medium','Hard')),
  companies        TEXT[],
  tags             TEXT[],
  hints            TEXT[],
  time_complexity  TEXT,
  space_complexity TEXT,
  acceptance       TEXT,
  order_index      INTEGER NOT NULL DEFAULT 0,
  is_premium       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_iq_topic      ON interview_questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_iq_difficulty ON interview_questions(topic_id, difficulty);

ALTER TABLE interview_questions ADD COLUMN IF NOT EXISTS order_index INTEGER NOT NULL DEFAULT 0;

-- ── USER NOTE BOOKMARKS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_note_bookmarks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  note_slug  TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, note_slug)
);

CREATE INDEX IF NOT EXISTS idx_bookmark_user ON user_note_bookmarks(user_id);

-- ── PAGE VIEWS ──────────────────────────────────────────
-- Lightweight analytics: one row per page visit
CREATE TABLE IF NOT EXISTS page_views (
  id         BIGSERIAL PRIMARY KEY,
  path       TEXT NOT NULL,
  user_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id TEXT,                        -- anonymous visitor token
  referrer   TEXT,
  country    TEXT,
  viewed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pv_path    ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_pv_date    ON page_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_pv_session ON page_views(session_id);

-- ── AUDIT LOGS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id       UUID REFERENCES users(id),
  action         TEXT NOT NULL,
  target_user_id UUID REFERENCES users(id),
  old_value      JSONB,
  new_value      JSONB,
  ip_address     INET,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_admin  ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_target ON audit_logs(target_user_id);

-- ── updated_at auto-update trigger ───────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'users_updated_at') THEN
    CREATE TRIGGER users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'courses_updated_at') THEN
    CREATE TRIGGER courses_updated_at
      BEFORE UPDATE ON courses
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'payments_updated_at') THEN
    CREATE TRIGGER payments_updated_at
      BEFORE UPDATE ON payments
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'iq_updated_at') THEN
    CREATE TRIGGER iq_updated_at
      BEFORE UPDATE ON interview_questions
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;
