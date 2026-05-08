# Asaan Digital 2.0

A digital literacy platform for Pakistan — helping users learn how to use digital services (mobile banking, government portals, WhatsApp, email) through step-by-step tutorials in **Urdu, Roman Urdu, and English**.

> 🎓 ADBMS Project — NUST SEECS, CS 236, Spring 2026

---

## What This Project Does

The platform has two core features:

**Poochna (پوچھنا — "Ask")** — A smart search page. Users type a question in any language mix (Urdu script, Roman Urdu, or English). The backend runs a 4-stage PostgreSQL search (exact keyword match → trigram fuzzy match → full-text search → SOUNDEX phonetic matching) and returns the most relevant tutorial with a confidence score. Every query is logged, whether it succeeds or fails.

**Seekhna (سیکھنا — "Learn")** — A browsable library of step-by-step tutorials organized by category (WhatsApp, JazzCash, Easypaisa, NADRA, Gmail, etc.). Each tutorial has numbered steps in Urdu and English, and ends with a short quiz.

There is also an **Admin Panel** with a dashboard, analytics charts, content gap detection (queries that returned no results), and full tutorial CRUD management.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, React Router v6, Axios, Framer Motion, AOS |
| Backend | Node.js + Express |
| Primary Database | PostgreSQL 14+ (tutorials, categories, intents, keywords, query logs) |
| Secondary Database | MongoDB (quiz data) |
| Background Jobs | node-cron (refresh materialized views hourly, clean old logs) |

---

## Project Structure

```
asaan-digital2.0/
│
├── client/                          # React frontend (Vite)
│   ├── public/images/               # All image assets
│   ├── src/
│   │   ├── App.jsx                  # Root component — all routes defined here
│   │   ├── main.jsx                 # React entry point
│   │   ├── pages/                   # One file per route
│   │   │   ├── Home.jsx             # Landing page with stats and featured content
│   │   │   ├── Poochna.jsx          # Smart search / "Ask" page
│   │   │   ├── Seekhna.jsx          # Tutorial library / "Learn" page
│   │   │   ├── TutorialDetail.jsx   # Single tutorial with steps
│   │   │   ├── TutorialQuiz.jsx     # Quiz at end of tutorial (data from MongoDB)
│   │   │   ├── Categoryexplore.jsx  # Browse tutorials by category
│   │   │   ├── Impact.jsx           # Stats / social impact page
│   │   │   ├── About.jsx            # About the project
│   │   │   ├── Admin.jsx            # Admin dashboard
│   │   │   ├── AdminAnalytics.jsx   # Detailed analytics charts
│   │   │   └── AdminContent.jsx     # Tutorial CRUD management
│   │   ├── components/
│   │   │   ├── common/              # Navbar, Footer — shared across all pages
│   │   │   ├── admin/               # Charts, ContentGaps, SystemHealth, PopularTutorials
│   │   │   ├── home/                # Planned: Hero, Stats, Features, ProblemSection
│   │   │   ├── search/              # Planned: SearchBar, VoiceSearch, SearchResults
│   │   │   └── tutorial/            # Planned: TutorialCard, TutorialSteps, ProgressTracker
│   │   ├── context/
│   │   │   ├── LanguageContext.jsx  # Global language state (English ↔ Urdu), RTL toggle
│   │   │   ├── AuthContext.jsx      # Placeholder — auth not yet implemented
│   │   │   └── ThemeContext.jsx     # Placeholder — dark mode not yet implemented
│   │   ├── services/
│   │   │   └── api.js               # All Axios API calls (search, tutorial, admin, analytics)
│   │   ├── utils/
│   │   │   ├── constants.js         # Frontend constants (categories, difficulty labels)
│   │   │   ├── formatters.js        # Date, number, text formatting helpers
│   │   │   └── validators.js        # Form validation functions
│   │   └── styles/
│   │       ├── global.css           # Base reset and body styles
│   │       ├── variables.css        # CSS custom properties (colors, fonts, spacing)
│   │       ├── components.css       # Shared component styles
│   │       └── admin.css            # Admin panel specific styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Express backend
│   ├── server.js                    # Entry point — mounts all middleware and routes
│   ├── config/
│   │   ├── database.js              # PostgreSQL connection pool (pg)
│   │   ├── mongodb.js               # MongoDB connection (mongoose)
│   │   └── constants.js             # Shared backend constants
│   ├── routes/
│   │   ├── api.js                   # /api/stats, /api/categories, /api/featured
│   │   ├── search.js                # /api/search, /api/search/suggestions, /trending
│   │   ├── tutorials.js             # /api/tutorials and all sub-routes
│   │   ├── admin.js                 # /api/admin/* (protected)
│   │   ├── analytics.js             # /api/analytics/*
│   │   └── quizRoutes.js            # /api/quiz/*
│   ├── controllers/
│   │   ├── searchController.js      # Calls queryEngine → logs to query_logs
│   │   ├── tutorialController.js    # CRUD + steps + progress
│   │   ├── adminController.js       # Dashboard, content gaps, keyword import
│   │   └── analyticsController.js   # Aggregated stats, heatmap, daily trends
│   ├── models/
│   │   ├── Tutorial.js              # PostgreSQL: findAll, findById, create, update, delete
│   │   ├── Intent.js                # PostgreSQL: intents and their popularity stats
│   │   ├── Keyword.js               # PostgreSQL: keywords linked to intents
│   │   ├── QueryLog.js              # PostgreSQL: every search logged here
│   │   ├── Analytics.js             # PostgreSQL: analytics aggregation queries
│   │   └── quizModel.js             # MongoDB/mongoose: quiz questions and results
│   ├── services/
│   │   ├── queryEngine.js           # Core search: calls PL/pgSQL process_user_query()
│   │   ├── analytics.js             # Analytics business logic
│   │   └── cache.js                 # In-memory TTL cache (no Redis needed)
│   ├── middleware/
│   │   ├── auth.js                  # adminAuth (API key), userAuth (placeholder JWT)
│   │   ├── session.js               # Attaches session ID from X-Session-Id header
│   │   ├── logger.js                # Request logging
│   │   ├── errorHandler.js          # Global error handler
│   │   └── validation.js            # Joi-based request validation
│   ├── jobs/
│   │   ├── refreshMVs.job.js        # Cron: refresh materialized views every hour
│   │   └── cleanupLogs.job.js       # Cron: delete old query logs
│   ├── utils/
│   │   ├── responseFormatter.js     # Standard { success, data, message } shape
│   │   ├── validators.js            # Server-side input validators
│   │   └── helpers.js               # Misc utility functions
│   └── scripts/
│       └── quizSeed.js              # Seeds quiz data into MongoDB
│
└── database/                        # Run these SQL files in order to set up PostgreSQL
    ├── 01_schema.sql                # All CREATE TABLE statements
    ├── 02_indexes.sql               # GIN, trigram, and composite indexes
    ├── 03_functions.sql             # PL/pgSQL functions (process_user_query is the key one)
    ├── 04_triggers.sql              # Auto-update timestamps and search vectors
    ├── 05_views.sql                 # Materialized views for analytics
    ├── 06_seed_data.sql             # Demo data: categories, tutorials, intents, keywords
    ├── 07_partitions.sql            # query_logs table partitioned by month
    └── 08_olap_queries.sql          # Analytical queries for reporting
```

---

## Prerequisites

Install these before anything else:

- **Node.js v18+** — https://nodejs.org
- **PostgreSQL v14+** — https://www.postgresql.org/download/
- **MongoDB v6+** — https://www.mongodb.com/try/download/community
- **npm v9+** — comes bundled with Node.js

Verify your installations:
```bash
node --version    # should be v18 or higher
psql --version    # should be 14 or higher
mongod --version  # should be 6 or higher
```

---

## Setup & Running Locally

### 1. Install dependencies

Run from the project root:

```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### 2. Create environment files

**Server** — create `server/.env`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_NAME=asaan_digital
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_MAX_CONNECTIONS=20

MONGODB_URI=mongodb://localhost:27017/asaan_digital

ADMIN_API_KEY=admin-secret-key-2026
JWT_SECRET=some-random-secret-string

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Client** — create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

> **Windows tip:** If you don't know your PostgreSQL password, see the Troubleshooting section below.

### 3. Set up the PostgreSQL database

Create the database:

```bash
psql -U postgres -c "CREATE DATABASE asaan_digital;"
```

Run the migration scripts in order. On **Windows**, use the `SET client_encoding='UTF8'` flag for the seed file to handle Urdu text correctly:

```bash
psql -U postgres -d asaan_digital -f database/01_schema.sql
psql -U postgres -d asaan_digital -f database/02_indexes.sql
psql -U postgres -d asaan_digital -f database/03_functions.sql
psql -U postgres -d asaan_digital -f database/04_triggers.sql
psql -U postgres -d asaan_digital -f database/05_views.sql
psql -U postgres -d asaan_digital -c "SET client_encoding='UTF8';" -f database/06_seed_data.sql
psql -U postgres -d asaan_digital -f database/07_partitions.sql
```

After seeding, insert the missing keywords manually (known bug in seed file — intent ID 36 is referenced but only 34 intents are created):

```bash
psql -U postgres -d asaan_digital
```

Paste this inside psql:

```sql
INSERT INTO intents (id, tutorial_id, intent_name, description)
VALUES (36, 35, 'government_job_apply', 'Apply for government jobs online');

INSERT INTO keywords (intent_id, keyword, language, weight) VALUES
(1, 'whatsapp message send', 'english', 1.0),
(1, 'message karna whatsapp', 'roman_urdu', 0.9),
(2, 'whatsapp location', 'english', 1.0),
(2, 'share location whatsapp', 'english', 0.9),
(4, 'whatsapp video call', 'english', 1.0),
(6, 'whatsapp group banana', 'roman_urdu', 1.0),
(6, 'create whatsapp group', 'english', 1.0),
(8, 'jazzcash account', 'english', 1.0),
(8, 'create jazzcash', 'english', 0.9),
(8, 'jazzcash register', 'roman_urdu', 0.9),
(10, 'easypaisa money transfer', 'english', 1.0),
(10, 'send money easypaisa', 'english', 0.9),
(11, 'electricity bill online', 'english', 1.0),
(11, 'pay bill online', 'english', 0.9),
(11, 'online bill payment pakistan', 'roman_urdu', 0.9),
(15, 'cnic online apply', 'english', 1.0),
(15, 'nadra cnic application', 'english', 0.9),
(15, 'new cnic apply', 'english', 0.8),
(16, 'cnic status check', 'english', 1.0),
(20, 'passport online apply', 'english', 1.0),
(22, 'create facebook account', 'english', 1.0),
(23, 'youtube video upload', 'english', 1.0),
(27, 'create gmail account', 'english', 1.0),
(27, 'google account create', 'english', 0.8),
(29, 'forgot email password', 'english', 1.0),
(29, 'gmail password reset', 'english', 0.9),
(30, 'online scam pakistan', 'english', 1.0),
(30, 'internet fraud', 'english', 0.8),
(32, 'cybercrime report pakistan', 'english', 1.0),
(32, 'FIA cybercrime', 'english', 0.9),
(33, 'write cv urdu', 'english', 1.0),
(33, 'resume banana', 'roman_urdu', 0.9),
(34, 'rozee pk jobs apply', 'english', 1.0),
(36, 'government job online apply', 'english', 1.0),
(36, 'sarkari naukri online apply', 'roman_urdu', 1.0),
(36, 'fpsc jobs apply', 'english', 0.9);
```

Type `\q` to exit psql.

### 4. Seed quiz data into MongoDB

```bash
cd server
node --env-file=.env scripts/quizSeed.js
cd ..
```

You should see: `✅ Quizzes seeded successfully!`

### 5. Run the app

```bash
npm run dev
```

This starts both frontend and backend together. Open:

- **App:** http://localhost:5173
- **API health check:** http://localhost:5000/health
- **Admin panel:** http://localhost:5173/admin (password: value of `ADMIN_API_KEY` in your `.env`)

---

## How the Search Works

1. User types a query on the Poochna page in any language.
2. Frontend sends `POST /api/search` with `{ query }`.
3. `searchController` calls `queryEngine.processUserQuery()`.
4. The query engine calls the PL/pgSQL function `process_user_query()` (defined in `database/03_functions.sql`).
5. That function runs 4 stages in order, stopping at the first confident match:
   - **Stage 1** — Exact keyword match against the `keywords` table
   - **Stage 2** — Trigram fuzzy match (`pg_trgm`) for typos and close spellings
   - **Stage 3** — Full-text search on `tutorials.search_vector` (covers English + Urdu)
   - **Stage 4** — SOUNDEX phonetic match for Roman Urdu spelling variations
6. Returns the best tutorial with a `confidence_score` between 0 and 1.
7. Every search is logged to `query_logs`. Failed searches appear in Admin → Content Gaps.

---

## API Routes

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Server health check |
| POST | `/api/search` | Main search |
| GET | `/api/search/suggestions` | Autocomplete |
| GET | `/api/search/trending` | Trending queries |
| GET | `/api/tutorials` | List tutorials (filterable) |
| GET | `/api/tutorials/:id` | Single tutorial |
| GET | `/api/tutorials/:id/steps` | Tutorial steps |
| GET | `/api/tutorials/:id/related` | Related tutorials |
| POST | `/api/tutorials/:id/progress` | Save user progress |
| GET | `/api/categories` | All categories |
| GET | `/api/stats` | Platform stats |
| GET | `/api/featured` | Featured tutorials |
| GET | `/api/quiz/:tutorialId` | Quiz for a tutorial |
| POST | `/api/quiz/:tutorialId/submit` | Submit quiz answers |
| GET | `/api/admin/dashboard` | 🔒 Admin stats |
| GET | `/api/admin/content-gaps` | 🔒 Failed query analysis |
| POST | `/api/admin/tutorials` | 🔒 Create tutorial |
| PUT | `/api/admin/tutorials/:id` | 🔒 Update tutorial |
| DELETE | `/api/admin/tutorials/:id` | 🔒 Delete tutorial |
| GET | `/api/analytics/daily-stats` | 🔒 Daily trends |
| GET | `/api/analytics/top-searches` | 🔒 Top searches |

> 🔒 Admin routes require the header `X-Admin-Key: <your ADMIN_API_KEY>`

---

## Troubleshooting

**Forgot your PostgreSQL password (Windows)?**

1. Open Windows Services, stop `postgresql-x64-17`
2. Open `C:\Program Files\PostgreSQL\17\data\pg_hba.conf` as Administrator
3. Change all `scram-sha-256` to `trust` and save
4. Start the PostgreSQL service again
5. Run `psql -U postgres` — it connects without a password
6. Run `ALTER USER postgres WITH PASSWORD 'newpassword';` then `\q`
7. Change `pg_hba.conf` back to `scram-sha-256` and restart the service

**Search returns no results?**

Check that keywords are populated:
```bash
psql -U postgres -d asaan_digital -c "SELECT COUNT(*) FROM keywords;"
```
If it returns 0, re-run the manual keyword insert from Step 3.

**Quiz shows "not available"?**

Verify MongoDB has quiz data:
```bash
cd server
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(async () => { const count = await mongoose.connection.db.collection('quizzes').countDocuments(); console.log('Quizzes:', count); mongoose.disconnect(); });"
```
If it shows 0, re-run the seed script from Step 4.

**`process_user_query` function does not exist?**

Re-run the functions script with encoding fix (Windows PowerShell):
```powershell
$content = [System.IO.File]::ReadAllText("database/03_functions.sql", [System.Text.Encoding]::GetEncoding(1252))
[System.IO.File]::WriteAllText("database/03_functions.sql", $content, [System.Text.Encoding]::UTF8)
psql -U postgres -d asaan_digital -c "SET client_encoding='UTF8';" -f database/03_functions.sql
```

---

## Known Limitations

- **Auth is not implemented** — `AuthContext.jsx` and `ThemeContext.jsx` are placeholders. Admin access uses a simple API key, not JWT.
- **Some component files are empty** — `Hero.jsx`, `SearchBar.jsx`, `TutorialCard.jsx` etc. are planned components whose logic currently lives inside the page files directly.
- **Only 3 quizzes seeded** — quizzes exist for tutorial IDs 1, 2, and 3 only. Other tutorials show "quiz not available."
- **`client/.env` is tracked in git** — keep it empty or add it to `.gitignore` before committing.