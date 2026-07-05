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
```
