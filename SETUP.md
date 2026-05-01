# Local Development Setup

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | ≥ 20 | `node -v` to check |
| Docker Desktop | latest | runs Postgres + Redis |
| Git | any | |

---

## 1. Clone and install

```bash
git clone <repo-url>
cd Notes
```

Install frontend dependencies:

```bash
cd app
npm install
```

Install backend dependencies:

```bash
cd ../backend
npm install
```

---

## 2. Start infrastructure (Docker)

```bash
cd backend
npm run docker:up
```

This starts two containers:

| Container | Port | Credentials |
|-----------|------|-------------|
| PostgreSQL | 5432 | user: `postgres` / pass: `postgres` / db: `learndb` |
| Redis | 6379 | no auth |

Verify they're running: `docker ps`

---

## 3. Configure environment

Copy the example env file:

```bash
cp .env.example .env      # or create backend/.env manually
```

Minimum required for local dev (everything else has sensible defaults):

```bash
# backend/.env

PORT=4000
NODE_ENV=development

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/learndb
REDIS_URL=redis://localhost:6379

JWT_SECRET=dev_secret_change_in_production_32chars
JWT_REFRESH_SECRET=dev_refresh_change_in_production_32chars

CLIENT_URL=http://localhost:5173
API_URL=http://localhost:4000

# Prices in paise (100 paise = ₹1)
PRICE_NOTE=9900
PRICE_COURSE=99900
PRICE_INTERVIEW=9900
PURCHASE_VALID_DAYS=730

PAYMENT_CURRENCY=INR
PAYMENT_CURRENCY_SYMBOL=₹
```

Optional (leave blank for dev — see notes below):

```bash
# Emails: leave blank → OTP codes are logged to the terminal instead
RESEND_API_KEY=
EMAIL_FROM=EngiNotes <noreply@yourdomain.com>

# Google OAuth: leave blank → use dummy dev login endpoint instead
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Razorpay: leave blank → dummy payment mode (no real charge)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

Frontend env (create `app/.env`):

```bash
VITE_API_URL=http://localhost:4000/api/v1
# Leave blank in dev — Google OAuth not needed locally
VITE_GOOGLE_CLIENT_ID=
VITE_RAZORPAY_KEY_ID=
```

---

## 4. Set up the database

```bash
cd backend

# Run schema migrations (creates all tables)
npm run db:migrate

# Seed test users + course metadata
npm run db:seed

# Seed all content (notes, interview questions, blog posts)
npm run db:content
```

After seeding you have:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.local | Admin@1234 |
| Premium | premium@test.local | Premium@1234 |
| Free user | user@test.local | User@1234 |

Dev Google login (no real OAuth needed):
```
POST http://localhost:4000/api/v1/auth/dev/google
Body: { "role": "admin" }   // or "user" or "premium"
```

---

## 5. Start the servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev       # starts on http://localhost:4000, auto-restarts on changes
```

**Terminal 2 — Frontend:**
```bash
cd app
npm run dev       # starts on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## Dev login shortcuts

The Login page has a "Dev — quick fill" bar in development mode with one-click buttons for free, premium, and admin test accounts. No need to type credentials.

Google OAuth shows a role-picker modal instead of redirecting to Google — pick a role and you're logged in instantly.

---

## Useful database commands

```bash
# Reset all note/interview/course prices to defaults (₹99 / ₹999)
npm run db:reset-prices

# Wipe and recreate the database from scratch
npm run docker:reset
npm run db:migrate
npm run db:seed
npm run db:content

# Backup the database
npm run db:backup

# Connect directly with psql
docker exec -it learndb_postgres psql -U postgres learndb
```

---

## Common issues

**`Cannot reach server. Is the backend running on port 4000?`**
The backend isn't running. Start it with `npm run dev` in the `backend/` directory.

**`Connection refused` on database queries**
Docker containers aren't running. Run `npm run docker:up` in `backend/`.

**`Route not found` after adding a new route**
The server needs a restart. The `--watch` flag should auto-restart, but kill the process and re-run `npm run dev` if it doesn't.

**`email_verified = false` for existing test users**
Re-run `npm run db:seed` — it sets `email_verified = TRUE` for all seeded users on upsert.

**OTP code in dev**
With no `RESEND_API_KEY` set, OTP codes are printed to the **backend terminal** instead of emailed. Look for:
```
📧  [DEV EMAIL — NOT SENT]
    To: user@example.com
    OTP: 123456
```

---

## Production checklist

- [ ] Set strong `JWT_SECRET` and `JWT_REFRESH_SECRET` (32+ chars each)
- [ ] Set real `RESEND_API_KEY` and `EMAIL_FROM`
- [ ] Set real `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- [ ] Set real `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` (use live keys for production)
- [ ] Set `NODE_ENV=production`
- [ ] Set `CLIENT_URL` to your production frontend URL (CORS depends on it)
- [ ] Create admin user directly in DB — never via the registration endpoint
- [ ] Run `npm run db:reset-prices` after first deploy if prices look wrong
