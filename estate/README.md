# Cinematic estate agency site

A real-estate website that turns ordinary listing photos into a scroll-driven,
cinematic house viewing — real 2.5D depth parallax, push-through-the-doorway
transitions, frosted captions — all generated from still photos.

Next.js (App Router) · TypeScript · Tailwind v4 · GSAP ScrollTrigger + Lenis ·
Three.js · Depth Anything V2 (via transformers.js) · sharp.

---

## Add a new property (the whole workflow)

1. **Create a folder** in `properties/` — the folder name becomes the URL:

   ```
   properties/
     notting-hill-townhouse/
       photos/            ← drop the listing photos here (jpg/png/webp/heic)
       details.json       ← copy one from another property and edit
       floorplan.png      ← optional (png/jpg/webp/svg)
       walkthrough.mp4    ← optional AI fly-through video (see below)
   ```

2. **Process it:**

   ```bash
   npm run process
   ```

   (or `npm run process -- notting-hill-townhouse` for just that one). The first
   run downloads two small AI models (~250 MB, cached in `.cache/`).

3. **Check it locally**, tweak `walkthrough.json` if you want, then **deploy**:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000/properties/notting-hill-townhouse.

4. **Commit and push.** Vercel rebuilds automatically. Commit the generated
   `public/properties/<slug>/` folder too — the AI step runs on your machine,
   not on Vercel.

### What `npm run process` does

For every photo it:

| Step | How |
| --- | --- |
| **Labels the room** (exterior, hallway, living, dining, kitchen, bedroom, bathroom, garden, view) | CLIP zero-shot image classification. If the model isn't confident, it falls back to keywords in the filename (`kitchen-2.jpg`, `master-bed.jpg`…). |
| **Orders the walkthrough** | exterior → entrance → living → dining → kitchen → bedrooms → bathroom → garden/view |
| **Picks a focal point** (the doorway/window the camera zooms through) | The deepest, brightest, most colourful/textured region of the depth map — i.e. windows and open doorways. For exteriors, the entrance. |
| **Generates a depth map** | Depth Anything V2 (small), normalised and lightly softened, saved to `public/properties/<slug>/depth/` |
| **Optimises images** | WebP + AVIF at 640 / 1024 / 1600 / 2400 px (never upscaled), plus a tiny blurred placeholder |
| **Writes `walkthrough.json`** | The manifest the site reads |

Flags: `--reset` throws away manual edits and regenerates the manifest;
`--skip-ai` skips the models (filename labels, flat depth) for quick tests.

### Editing `walkthrough.json` by hand

Everything is overridable. Re-running `npm run process` **keeps your edits**
for photos it already knows and only adds new photos.

```jsonc
{
  "video": null,              // or { "src": "...", "enabled": false } to turn a video off
  "scenes": [                 // ← reorder this array to change the route
    {
      "file": "IMG_4103.jpg",
      "label": "dining",                 // room type
      "caption": { "title": "Dining area", "subtitle": "3.2m × 3.0m" },
      "focal": { "x": 0.44, "y": 0.6 },  // 0–1 from top-left: where the camera pushes through
      "weight": 1,                       // scroll length for this room (1.5 = linger longer)
      "parallax": 1,                     // depth strength (0 = flat, 1.5 = stronger)
      "hidden": true                     // optional: leave a photo out of the walkthrough
    }
  ]
}
```

Tip: to find a focal point, open the photo in any editor, note the pixel
position, and divide by the width/height.

Room names and sizes in captions come from `rooms` in `details.json` the first
time the manifest is generated:

```json
"rooms": { "kitchen": { "name": "Open-plan kitchen", "size": "5.2m × 4.1m" } }
```

### `details.json`

```jsonc
{
  "title": "…", "price": 1450000, "currency": "GBP",
  "priceSuffix": "pcm",          // optional, for lettings
  "status": "For sale",          // "To let" puts it under Rent in the filters
  "beds": 2, "baths": 1, "sqft": 912,
  "location": "Kensington, London W8",   // first part ("Kensington") is the area filter
  "address": "…", "lat": 51.4991, "lng": -0.1925,
  "featured": true,              // shown in the home-page hero
  "summary": "One-line pitch", "description": "Paragraphs separated by a blank line",
  "features": ["…"], "rooms": { … },
  "agent": { "name": "…", "role": "…", "phone": "…", "email": "…" }
}
```

### AI fly-through video (optional)

If a property folder contains `walkthrough.mp4` (or `.webm`), the property page
scrubs that video on scroll instead of the photo walkthrough. For smooth
scrubbing, encode with frequent keyframes:

```bash
ffmpeg -i in.mp4 -c:v libx264 -g 6 -crf 22 -an -movflags +faststart walkthrough.mp4
```

---

## Re-branding for a client

Everything lives in **`site.config.ts`**: agency name, monogram/logo, colours,
contact details and social links. Drop a logo into `public/` and set
`logo: "/logo.svg"`. Fonts are in `app/fonts.ts` (any Google Font).

## Enquiries & viewing requests

Forms post to `/api/enquiry`. Choose where they go with `ENQUIRY_STORE` (see
`.env.example`):

| Value | Behaviour |
| --- | --- |
| `json` (default) | Appends to `data/enquiries.json`. Good locally; **Vercel's filesystem is read-only**, so use another option there. |
| `resend` | Emails you via [Resend](https://resend.com) — set `RESEND_API_KEY`, `ENQUIRY_TO`, `ENQUIRY_FROM`. |
| `webhook` | POSTs JSON to `ENQUIRY_WEBHOOK_URL` (Zapier, Make, Slack, a CRM…). |
| `console` | Logs only. |

Adding another destination is one function in `lib/enquiries/index.ts`.

## How the walkthrough works

- `components/walkthrough/timeline.ts` — pure camera choreography. Each room
  gets a slow dolly-in + lateral drift ("gimbal"), then a push through its focal
  point into the next room. Shared by every renderer.
- `components/walkthrough/webgl-stage.ts` — Three.js shader that displaces
  each pixel by its depth (near things move more), with radial blur, a warm
  light leak, vignette and grain during transitions.
- `components/walkthrough/KenBurnsStage.tsx` — fallback when WebGL is missing
  or the visitor prefers reduced motion: Ken Burns pans + crossfades.
- `components/walkthrough/Walkthrough.tsx` — scroll (property page), autoplay
  (home hero) and hover-preview (listing cards) modes; captions; progress bar
  with tap-to-jump.

Mobile: pixel ratio is capped, textures are sized to the screen, rendering
pauses when off-screen, and listing cards only create a WebGL context while
hovered.

## Pages

`/` home (featured walkthrough hero, intro, listings) · `/listings` (filters:
buy/rent, price, beds, area; hover to preview) · `/properties/[slug]` ·
`/about` · `/contact`

## Commands

```bash
npm install
npm run process   # process property photos
npm run dev       # local dev server
npm run build     # production build
npm run lint
```

## Deploying to Vercel

Import the repository in Vercel. If this app sits in a subfolder of a larger
repository, set **Root Directory** to that folder (e.g. `estate`). Add the
`ENQUIRY_*` environment variables and `NEXT_PUBLIC_SITE_URL`.

## Example data

The two example properties (`kensington-mansion-flat`,
`chelsea-garden-apartment`) are built from the same handful of photos with
placeholder details, prices and agents — replace them before going live.
