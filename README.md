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
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express (port 4000) |
| Database | PostgreSQL via Neon.tech |
| Hosting (Frontend) | GoDaddy Economy cPanel |
| Hosting (Backend) | Not yet deployed (pending org card) |
| Auth | JWT + bcrypt |
| Email | Nodemailer (info@kuana.org) |
| Icons | Lucide React |

---

## Environments

| Environment | Frontend URL | Database | Backend |
|-------------|-------------|----------|---------|
| Dev | http://localhost:5174 | Neon dev branch | http://localhost:4000 |
| Staging | https://staging.kuana.org | Neon staging branch | Not deployed |
| Production | https://kuana.org | Neon production branch | Not deployed |

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
- **Organization:** kuana
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
- **Status:** Account exists, backend not yet deployed (requires card for Web Services)

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
MAIL_USER=info@kuana.org
MAIL_PASS=your_mail_password
MAIL_TO=info@kuana.org
```

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

### Staging (staging.kuana.org)

Deployed via GitHub Actions — manual trigger only.

1. Make changes locally and push to GitHub
2. Go to GitHub repo → **Actions** → **Deploy to Staging**
3. Click **Run workflow** → **Run workflow**
4. Wait ~2 minutes for build and SCP upload to complete
5. Visit https://staging.kuana.org to verify

**GitHub Secrets required:**
- `SSH_PRIVATE_KEY` → Ed25519 private key (authorized in GoDaddy cPanel SSH Access)
- `SSH_USERNAME` → GoDaddy cPanel username (e.g. `enynjq3aag57`)

### Production (kuana.org)

Same process as staging but uses **Deploy to Production** workflow.

> ⚠️ Do not deploy to production without stakeholder approval on staging.

**GitHub Secrets required:**
- `PROD_SSH_PRIVATE_KEY` → Ed25519 private key (authorized in GoDaddy cPanel SSH Access)
- `SSH_USERNAME` → same GoDaddy cPanel username as staging

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
| Board | Executive board members section (linked from navbar) |
| Events | 2023, 2025, 2027 reunion details with year tabs |
| Speakers | Speaker profiles with photos and social links, filtered by year |
| Media | Photo and video gallery filtered by year, with lazy-loading thumbnails |
| Donate | Donation section |
| Contact | Contact form + social media links |

### Floating Elements
- **Support KUANA button** — floats bottom-right, hides when donate section is visible

### Navigation
- Responsive navbar with dropdowns for Events, Speakers, Media
- Smooth scroll to sections
- Active section highlighting

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
│   │           │   └── 2025/        # 2025 reunion photos + thumbs/
│   │           ├── profile/         # Board member profile photos
│   │           └── speakers/        # Speaker photos
│   └── src/
│       ├── components/      # All page sections
│       ├── pages/           # Home page
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

- `.env`, `.env.staging`, `.env.production` are gitignored — never commit these
- GoDaddy Economy hosting does not support Node.js — backend requires separate hosting
- Frontend deploys use SSH/SCP via GitHub Actions — no FTP is used
- SSH keys are stored as GitHub Actions secrets (`SSH_PRIVATE_KEY`, `PROD_SSH_PRIVATE_KEY`, `SSH_USERNAME`)
- After GoDaddy subscription expires, plan to move domain to Cloudflare (~$10/year)
