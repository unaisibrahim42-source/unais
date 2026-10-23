# Elevate Creative Media

Marketing website for Elevate Creative Media, built with Next.js (App Router), TypeScript, and Tailwind CSS v4.

## Structure

Each section of the site is its own route:

- `/` — Home, with the animated orbit hero
- `/services` — Service offerings
- `/case-studies` — Client results
- `/grow` — Growth methodology
- `/about` — Agency story and contact form

Shared UI (navbar, footer, buttons, CTA sections) lives in `components/`.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Logo

`public/logo.png` is a recreated version of the brand mark. Drop the
original file at that same path to replace it — no code changes needed,
the navbar and footer already reference `/logo.png`.

## Contact form

The form on `/about` posts to [Formspree](https://formspree.io). Sign up
free, create a form, and copy the ID from the endpoint URL
(`https://formspree.io/f/xxxxxxxx`) into `NEXT_PUBLIC_FORMSPREE_ID` — see
`.env.example`. Until that's set, the form falls back to opening the
visitor's email client instead.

## Build

```bash
npm run build
npm run lint
npm test
```

## Elevate Marketing CRM (`/crm`)

A private, password-gated internal tool for running the agency day to day — separate from the public
marketing site above, living under the `/crm` route. Covers clients (with per-client workspaces),
projects, tasks, contracts with a built-in e-signature flow, invoices with image OCR, finance reporting,
and partner/profit-share management for Unais, Jamal and Sazid. See `.claude`-free root for details, or
just read the code under `app/crm/`, `lib/`, and `prisma/schema.prisma` — it's a fairly small, flat
codebase.

### First-time setup

```bash
npm install
cp .env.example .env          # fill in CRM_SESSION_SECRET (openssl rand -hex 32)
npx prisma migrate deploy     # creates prisma/dev.db (SQLite, gitignored)
npm run db:seed               # creates Unais / Jamal / Sazid logins
npm run dev
```

Open [http://localhost:3000/crm/login](http://localhost:3000/crm/login). The seed script prints a
temporary shared password (`ChangeMe123!` by default, or whatever `CRM_SEED_PASSWORD` is set to) —
log in with any of the three seeded emails and change it immediately from **Settings → Change My
Password**.

### What's real vs. what needs configuring

Everything is backed by a real database (SQLite by default) — nothing is mocked, and refreshing or
coming back later never loses data. A few integrations are genuinely functional out of the box with
no setup, and a couple are intentionally left as "configure before use" rather than faked:

- **E-signatures** — fully self-hosted (no DocuSign/HelloSign account needed): secure per-contract
  signing links, typed + drawn signature capture, consent and audit trail, auto status transitions.
- **Invoice OCR** — runs on-device with Tesseract (no API key); scans JPG/PNG uploads only, PDFs need
  manual entry.
- **Email sending** — not configured by default. Until you set `CRM_SMTP_HOST` / `_USER` / `_PASS` /
  `_FROM`, contract-signing links are generated and shown for you to copy/share manually instead of
  being silently "sent". Settings page shows live status.
- **Database** — SQLite out of the box; for a real deployment, point `DATABASE_URL` at Postgres (e.g.
  Supabase) and change the `provider` in `prisma/schema.prisma` to `"postgresql"` — the schema itself
  is portable.
- **File storage** — stored on local disk under `storage/uploads/` (gitignored), served only to
  logged-in users via `/api/crm/files/[id]`. For production, swap in cloud storage.

### Deploying it privately for client use

To run this as a hosted, password-protected tool (e.g. to sell to another business): deploy to Vercel
(or similar), add a managed Postgres database (Neon/Supabase), and set the env vars from
`.env.example` there. The `/crm/login` screen is already the "private password gate" — nothing extra
needed for that part.
