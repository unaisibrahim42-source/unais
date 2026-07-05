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

`public/logo.png` is currently a generated placeholder. Drop in the real
"ELEVATE / Creative media" logo file at that same path to replace it —
no code changes needed, the navbar and footer already reference `/logo.png`.

## Build

```bash
npm run build
npm run lint
```
