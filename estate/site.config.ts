/**
 * Re-brand the whole site from this one file.
 * Colours are injected as CSS variables, so Tailwind classes like
 * `bg-brand`, `text-ink` and `text-accent` pick them up automatically.
 * Fonts are chosen in `app/fonts.ts` (any Google Font works).
 */
export const site = {
  name: "Hale & Ashby",
  tagline: "Private property, cinematically presented",
  description:
    "A boutique London estate agency. Every home is presented as a cinematic walkthrough, built from its photographs.",
  /** Path in /public, or null to render the name as a wordmark. */
  logo: null as string | null,
  /** Short monogram for the favicon-style mark. */
  monogram: "H&A",
  colors: {
    paper: "#faf8f4", // page background
    ink: "#16140f", // main text
    muted: "#6f6a60", // secondary text
    line: "#e6e1d7", // hairlines / borders
    brand: "#1d2a24", // deep primary (buttons, footer)
    accent: "#b08d57", // brass accent
  },
  contact: {
    email: "hello@example.com",
    phone: "+44 20 0000 0000",
    address: "1 Placeholder Mews, London W8",
  },
  social: {
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/",
  },
  currency: { locale: "en-GB" },
} as const;

export type Site = typeof site;
