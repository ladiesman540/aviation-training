# SkyTrail — PSTAR Exam Prep

PSTAR exam preparation for Canadian aviation regulations. Browse 184 questions, take mock exams, and drill with Quick Hops.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Drizzle ORM** + **Postgres**
- **Vitest**

## Getting Started

### Prerequisites

- Node.js 18+
- [Neon](https://neon.tech) account (free) or Docker for local Postgres

### Setup

```bash
npm install
cp .env.example .env
```

Add your Neon connection string to `.env`:

```env
DATABASE_URL=postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
```

### Database

Create schema and seed:

```bash
npm run db:push
npm run seed
npm run validate
```

For local Postgres (Docker): `docker compose up -d` then run the commands above.

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

## Features

- **Question Bank** — Search by ID (e.g. `3.14`), section (`3.`), or text. Toggle correct answers. Sources drawer with TP 11919 references.
- **Exam Sim** — 50-question mock exam. Pass at 90%. Section breakdown.
- **Quick Hop** — 5-minute drill (8–12 cards). Instructor mode for immediate feedback. Sources on every card.
- **Progress** — Mastery dashboard (Phase 5+).

## Data Source

TP 11919 — Student Pilot Permit or Private Pilot Licence for Foreign and Military Applicants, Aviation Regulations (7th Edition, December 2022).

[Transport Canada](https://tc.canada.ca/en/aviation/publications/student-pilot-permit-private-pilot-licence-foreign-military-applicants-aviation-regulations-tp-11919)

## Invariants

- Every graded item has sources (Sources Drawer never empty).
- Deterministic grading from answer key only (no LLM, no fuzzy matching).
- Doc version (edition/date) displayed globally.
