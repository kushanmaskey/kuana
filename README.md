# KUANA Website — Project Documentation

**Kathmandu University Alumni North America (KUANA)**
Official website for KU alumni community in the USA, Canada, and Mexico.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Environments](#environments)
- [Services & Accounts](#services--accounts)
- [Local Development](#local-development)
- [Database](#database)
- [Deployment](#deployment)
- [Website Features](#website-features)
- [File Structure](#file-structure)

---

## Project Overview

The KUANA website serves as the central hub for Kathmandu University alumni living in North America. It features reunion events, speaker profiles, photo/video gallery, alumni board information, donation, and contact.

**Live URLs:**
- Production: https://kuana.org (old site — new site pending stakeholder approval)
- Staging: https://staging.kuana.org (new site for stakeholder review)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express (port 4000) |
| Database | PostgreSQL via Neon.tech |
| Hosting (Frontend) | GoDaddy Economy cPanel |
| Hosting (Backend) | Render.com (free tier) |
| Auth | JWT + bcrypt |
| Email | Resend API (contact form notifications) |
| Icons | Lucide React |

---

## Environments

| Environment | Frontend URL | Database | Backend |
|-------------|-------------|----------|---------|
| Dev | http://localhost:5174 | Neon dev branch | http://localhost:4000 |
| Staging | http://staging.kuana.org | Neon dev branch | https://kuana.onrender.com |
| Production | https://kuana.org | Neon dev branch | https://kuana.onrender.com |

---

## Services & Accounts

### GoDaddy
- **Account username:** kuana2023
- **Plan:** Economy Web Hosting (renewed, expires ~2027)
- **What it hosts:** Domain (kuana.org) + static frontend files
- **cPanel access:** Via GoDaddy account → Hosting → kuana.org → Manage
- **Server hostname:** p3plzcpnl475181.prod.phx3.secureserver.net
- **Storage:** 25 GB (currently using ~0.2 GB)

**SSH Access:**
| Secret | Purpose |
|--------|---------|
| `SSH_PRIVATE_KEY` | Ed25519 private key for staging deploys |
| `PROD_SSH_PRIVATE_KEY` | Ed25519 private key for production deploys |
| `SSH_USERNAME` | GoDaddy cPanel username (e.g. `enynjq3aag57`) |

SSH public keys are authorized in GoDaddy cPanel → SSH Access → Manage Keys.

### Neon (PostgreSQL)
- **Website:** https://neon.tech
- **Account:** info@kuana.org (not the personal kushan.maskey account)
- **Plan:** Free tier
- **Branches:**
  | Branch | Purpose | Endpoint |
  |--------|---------|----------|
  | dev | Local development | ep-soft-fog-au4oew9m-pooler.c-10.us-east-1.aws.neon.tech |
  | staging | Staging environment | ep-mute-flower-auv3c4tz-pooler.c-10.us-east-1.aws.neon.tech |
  | production | Live site | ep-shiny-tooth-au3ucc9i-pooler.c-10.us-east-1.aws.neon.tech |

### GitHub
- **Repository:** https://github.com/kushanmaskey/kuana
- **Main branch:** main
- **GitHub Actions:** Manual deploy workflows for staging and production

### Render
- **Account:** info@kuana.org (Info Kuana)
- **Service:** `kuana` — Node.js web service (free tier)
- **URL:** https://kuana.onrender.com
- **Auto-deploy:** Enabled — pushes to `main` trigger a redeploy automatically
- **Environment variables set:** `NODE_ENV`, `DATABASE_URL`, `JWT_SECRET`, `MAIL_TO`, `MAIL_USER`, `MAIL_PASS`, `RESEND_API_KEY`, `SETUP_KEY`, `CLIENT_URL`
- **Note:** Free tier spins down after 15 min inactivity — first request may take up to 50 seconds

### Resend
- **Account:** info@kuana.org
- **Purpose:** Transactional email for contact form notifications
- **Free tier:** 3,000 emails/month, 100/day
- **From address:** `onboarding@resend.dev` (temporary — pending `kuana.org` domain verification)

### Zeffy
- **Account:** info@kuana.org
- **Purpose:** Donation processing for KUANA (100% free for nonprofits — 0% platform fees)
- **Donation form:** https://zeffy.com/en-US/donation-form/donate-to-change-lives-19745
- **Accessible from:** US and Canada
- **How it works:** Donors are redirected to Zeffy's secure platform — KUANA does not collect or store any payment information

---

## Local Development

### Prerequisites
- Node.js 20+
- npm

### Setup

```bash
# Clone the repo
git clone https://github.com/kushanmaskey/kuana.git
cd kuana

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### Environment Variables

Create `server/.env` (never commit this file):
```
DATABASE_URL=postgresql://...neon.tech/neondb?sslmode=require
JWT_SECRET=your_secret
PORT=4000
CLIENT_URL=http://localhost:5174
SETUP_KEY=kuana_setup_2024
RESEND_API_KEY=re_...
MAIL_TO=info@kuana.org
```

The frontend reads API URL from environment files — no changes needed for local dev (Vite proxy handles `/api` → `localhost:4000` automatically).

### Run Locally

```bash
# Terminal 1 — start backend
cd server && npm run dev

# Terminal 2 — start frontend
cd client && npm run dev
```

Frontend: http://localhost:5174
Backend: http://localhost:4000

### Database Migrations

```bash
cd server && npm run migrate
```

Migrations are stored in `server/db/migrations/`. Each file runs once and is tracked in the `migrations` table.

---

## Database

### Schema
| Table | Purpose |
|-------|---------|
| admins | Admin user accounts |
| events | Reunion events (2023, 2025, 2027) |
| alumni | Alumni directory |
| media | Photos and videos |
| contact_messages | Contact form submissions |
| donations | Donation records |
| migrations | Migration tracking |

### Adding a Migration
1. Create a new file in `server/db/migrations/` named `002_description.sql`
2. Write the SQL changes
3. Run `npm run migrate` in the `server/` directory
4. The migration runs once and is recorded — safe to run multiple times

---

## Deployment

The frontend (React) is deployed to GoDaddy shared hosting as a static Vite build via GitHub Actions. The backend (Node.js API) deploys automatically to Render on every push to `main` — no manual action needed.

Both frontend deployment workflows are **manual-trigger only** (`workflow_dispatch`) — they never run automatically on push.

### How it works

Each deploy workflow runs on GitHub's servers (Ubuntu VM) and does 5 things:
1. Checks out the repo code
2. Installs Node.js 20 and npm dependencies (`npm ci`)
3. Builds the React app into static files (`client/dist/`) via Vite
4. Sets up an SSH key from a GitHub Secret
5. Uploads `client/dist/` to the GoDaddy server via SCP (secure copy)

Total time: **~2 minutes**.

### Staging (staging.kuana.org)

1. Push changes to `main` on GitHub
2. Go to GitHub repo → **Actions** → **Deploy to Staging**
3. Click **Run workflow** → **Run workflow**
4. Wait ~2 minutes for build and upload to complete
5. Visit https://staging.kuana.org to verify

**Workflow file:** `.github/workflows/deploy-staging.yml`  
**Build command:** `npm run build -- --mode staging` (loads `client/.env.staging`)  
**Deploy target:** `public_html/staging.kuana.org/` on GoDaddy server

**GitHub Secrets required:**
- `SSH_PRIVATE_KEY` → Ed25519 private key (authorized in GoDaddy cPanel → SSH Access)
- `SSH_USERNAME` → GoDaddy cPanel username (e.g. `enynjq3aag57`)

### Production (kuana.org)

Same process as staging, using the **Deploy to Production** workflow.

> ⚠️ Always verify on staging first. Do not deploy to production without stakeholder approval.

**Workflow file:** `.github/workflows/deploy-production.yml`  
**Build command:** `npm run build` (default — loads `client/.env.production`)  
**Deploy target:** `public_html/` (root — serves kuana.org)

**GitHub Secrets required:**
- `PROD_SSH_PRIVATE_KEY` → Ed25519 private key (authorized in GoDaddy cPanel → SSH Access)
- `SSH_USERNAME` → same GoDaddy cPanel username as staging

> For full technical details on the deployment pipeline — including SSH key setup, troubleshooting, and step-by-step YAML explanations — see [docs/TECHNICAL.md](docs/TECHNICAL.md#3d-deployment--github-actions-sshscp).

### Images

Gallery images are committed to git. Vite copies everything in `client/public/` into `client/dist/` at build time, and the GitHub Actions workflow uploads `client/dist/` to the server via SCP automatically.

**Before committing new images**, compress them to web size (max 1920px wide, ~80% quality) using macOS `sips`:
```bash
for f in client/public/assets/img/gallery/2025/*.jpg; do
  sips --resampleWidth 1920 --setProperty formatOptions 82 "$f"
done
```
Target size: 500 KB–1.5 MB per image.

Image directories on server:
- Profile photos: `public_html/staging.kuana.org/assets/img/profile/`
- Gallery 2023: `public_html/staging.kuana.org/assets/img/gallery/2023/` + `thumbs/`
- Gallery 2025: `public_html/staging.kuana.org/assets/img/gallery/2025/` + `thumbs/`

---

## Website Features

### Public Pages

| Section | Description |
|---------|-------------|
| Hero | Landing banner with reunion tagline and Boston 2027 announcement |
| About | KUANA mission, 501(c)(3) status, executive board members table |
| Mission & Vision | Snippet cards for Mission and Vision; each has "Read full" that opens the respective standalone page |
| Board | Executive board members section (linked from navbar) |
| Events | 2023, 2025, 2027 reunion details with year tabs; Boston 2027 card includes View Flyer button |
| Speakers | Speaker profiles with photos and social links, filtered by year |
| Media | Photo and video gallery filtered by year, with lazy-loading thumbnails; 2027 tab shows flyer |
| News & Announcements | News cards with photo, category badge, and excerpt; full announcement opens in a modal |
| Donate | Donation section — links to Zeffy (external, no payment data stored on KUANA servers) |
| Contact | Contact form + social media links |

### Floating Elements
- **Support KUANA button** — floats bottom-right, hides when donate section is visible

### Navigation
- Responsive navbar with dropdowns for Mission & Vision, Events, Speakers, Media
- Mission & Vision dropdown links to `/vision` and `/mission` standalone pages
- Smooth scroll to sections; active section highlighting

### Standalone Pages
| Route | Description |
|-------|-------------|
| `/mission-vision` | Landing page with Vision and Mission snippet cards |
| `/vision` | Full Vision page with pillars (Reconnect, Strengthen, Grow Together) |
| `/mission` | Full Mission page with all 8 mission items and photo highlights |

### Admin Panel
- JWT-authenticated admin area
- Manage events, alumni, media, contact messages, donations
- Setup endpoint: `POST /api/auth/setup` (disabled in production via `DISABLE_SETUP=true`)

---

## File Structure

```
kuana/
├── client/                  # React frontend
│   ├── public/
│   │   └── assets/
│   │       └── img/
│   │           ├── gallery/
│   │           │   ├── 2023/        # 2023 reunion photos + thumbs/
│   │           │   ├── 2025/        # 2025 reunion photos + thumbs/
│   │           │   └── 2027/        # 2027 photos (flyer only for now)
│   │           ├── profile/         # Board member + alumni profile photos
│   │           │   └── bivek_baral.png   # Dr. Bivek Baral (News item)
│   │           ├── speakers/        # Speaker photos
│   │           ├── flyer_reconnect.png   # Boston 2027 reunion flyer
│   │           └── flyer_mission_vision.jpg  # Mission & Vision flyer
│   └── src/
│       ├── components/
│       │   ├── About.jsx
│       │   ├── Contact.jsx
│       │   ├── Donate.jsx
│       │   ├── Events.jsx       # Year tabs; Boston 2027 has View Flyer modal
│       │   ├── FloatDonate.jsx
│       │   ├── Footer.jsx
│       │   ├── Hero.jsx
│       │   ├── Media.jsx        # 2027 tab shows flyer in carousel
│       │   ├── MissionVision.jsx  # Home section: Vision + Mission snippet cards
│       │   ├── Navbar.jsx       # Mission & Vision dropdown; News link
│       │   ├── News.jsx         # News & Announcements section with modal
│       │   └── Speakers.jsx
│       ├── pages/
│       │   ├── Home.jsx         # Main single-page layout
│       │   ├── Mission.jsx      # Full Mission standalone page (/mission)
│       │   ├── MissionVision.jsx  # Landing page (/mission-vision)
│       │   └── Vision.jsx       # Full Vision standalone page (/vision)
│       └── api/             # API client (axios)
├── server/                  # Node.js backend
│   ├── db/
│   │   ├── migrations/      # SQL migration files
│   │   ├── migrate.js       # Migration runner
│   │   └── index.js         # DB connection (pg)
│   └── routes/              # auth, events, alumni, media, contact, donations
├── .github/
│   └── workflows/
│       ├── deploy-staging.yml
│       └── deploy-production.yml
└── README.md
```

---

## Notes

- `server/.env` is gitignored — never commit it
- `client/.env.staging` and `client/.env.production` are committed — they only contain the public Render API URL (`VITE_API_URL`)
- GoDaddy Economy hosting does not support Node.js — backend runs on Render
- Frontend deploys use SSH/SCP via GitHub Actions — no FTP is used
- SSH keys are stored as GitHub Actions secrets (`SSH_PRIVATE_KEY`, `PROD_SSH_PRIVATE_KEY`, `SSH_USERNAME`)
- Render auto-deploys on every push to `main` — no manual action needed for the backend
- After GoDaddy subscription expires, plan to move domain to Cloudflare (~$10/year)

### SAMPLE_EVENTS merge pattern (Events.jsx)

The Events component keeps a `SAMPLE_EVENTS` array as the frontend-authoritative source for fields that are not kept in sync in the database (flyer path, updated descriptions, end dates). When the API responds, its data is merged with `SAMPLE_EVENTS` — the frontend fields always win for those specific keys:

```js
const merged = res.data.map((apiEvent) => {
  const sample = SAMPLE_EVENTS.find((s) => s.id === apiEvent.id);
  if (!sample) return apiEvent;
  return { ...apiEvent, flyer: sample.flyer, description: sample.description,
           end_date: sample.end_date ?? apiEvent.end_date, venue: sample.venue ?? apiEvent.venue };
});
```

This prevents the API from silently overwriting frontend-only data (like the Boston 2027 flyer) after a deployment.

### npm dependency overrides (client/package.json)

Some transitive dependencies have security vulnerabilities that cannot be resolved by bumping the direct parent. The `overrides` field in `client/package.json` forces patched versions:

```json
"overrides": {
  "postcss": "^8.5.23",
  "nanoid": "^3.3.17",
  "uuid": "^14.0.1"
}
```

`uuid@^14` is required because `exceljs` pins `uuid@^8`, which has no patched release in the v8 line.
