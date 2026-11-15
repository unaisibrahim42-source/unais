#!/usr/bin/env node
/**
 * npm run process [-- <slug> ...] [--reset] [--skip-ai]
 *
 * For every folder in /properties (or only the slugs given):
 *   1. labels each photo (CLIP zero-shot, falling back to the filename)
 *   2. orders the photos into a walkthrough route
 *   3. picks a focal point per photo (far + bright region = doorway / window)
 *   4. generates a depth map per photo (Depth Anything V2, via transformers.js)
 *   5. writes optimised WebP + AVIF images at responsive sizes
 *   6. writes properties/<slug>/walkthrough.json
 *
 * walkthrough.json is yours to edit. Re-running keeps your edits (order,
 * labels, captions, focal points, weights) for photos it already knows and
 * only adds new photos. Pass --reset to rebuild a manifest from scratch.
 */
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const PROPS = path.join(ROOT, "properties");
const PUBLIC = path.join(ROOT, "public", "properties");

const args = process.argv.slice(2);
const RESET = args.includes("--reset");
const SKIP_AI = args.includes("--skip-ai");
const only = args.filter((a) => !a.startsWith("--"));

const SIZES = [640, 1024, 1600, 2400];
const DEPTH_SIZE = 768;
const PHOTO_EXT = /\.(jpe?g|png|webp|avif|tiff?|heic)$/i;

/* ---------- room vocabulary ---------- */

// Route order: exterior → entrance → living areas → kitchen → bedrooms → bathroom → garden/view
const ROOMS = {
  "exterior-front": { order: 0, name: "Exterior", prompts: ["the front facade of a residential building seen from the street", "the outside of a house"] },
  hallway: { order: 1, name: "Entrance hall", prompts: ["an entrance hallway with a front door", "a corridor inside a home"] },
  living: { order: 2, name: "Living room", prompts: ["a living room with a sofa", "a lounge with armchairs"] },
  dining: { order: 3, name: "Dining room", prompts: ["a dining room with a dining table and chairs"] },
  kitchen: { order: 4, name: "Kitchen", prompts: ["a kitchen with cabinets and a countertop", "a kitchen with a sink and cooker"] },
  bedroom: { order: 5, name: "Bedroom", prompts: ["a bedroom with a bed", "a bedroom with pillows on a bed"] },
  bathroom: { order: 6, name: "Bathroom", prompts: ["a bathroom with a bath or shower", "a bathroom with a toilet and basin"] },
  garden: { order: 7, name: "Garden", prompts: ["a garden or patio outside a house", "a back yard with plants"] },
  view: { order: 8, name: "The view", prompts: ["a view through a window over trees or a city", "a scenic view from a balcony"] },
};

const FILENAME_HINTS = [
  [/ext|front|facade|outside|street|building/i, "exterior-front"],
  [/hall|entr|foyer|corridor|landing|stair/i, "hallway"],
  [/living|lounge|reception|sitting|family/i, "living"],
  [/dining/i, "dining"],
  [/kitchen/i, "kitchen"],
  [/bed|master|principal|guest|nursery/i, "bedroom"],
  [/bath|shower|wc|ensuite|en-suite|cloak/i, "bathroom"],
  [/garden|patio|yard|terrace|courtyard/i, "garden"],
  [/view|balcony|vista|outlook/i, "view"],
];

const labelFromFilename = (file) => {
  for (const [re, label] of FILENAME_HINTS) if (re.test(file)) return label;
  return null;
};

/* ---------- AI models (lazy, cached in .cache/models) ---------- */

let _depth, _clip;
async function hf() {
  const t = await import("@huggingface/transformers");
  t.env.cacheDir = path.join(ROOT, ".cache", "models");
  return t;
}
async function depthModel() {
  if (!_depth) {
    const { pipeline } = await hf();
    console.log("  · loading Depth Anything V2 (first run downloads ~100MB)…");
    _depth = await pipeline("depth-estimation", "onnx-community/depth-anything-v2-small", { dtype: "fp32" });
  }
  return _depth;
}
async function clipModel() {
  if (!_clip) {
    const { pipeline } = await hf();
    console.log("  · loading CLIP room classifier…");
    _clip = await pipeline("zero-shot-image-classification", "Xenova/clip-vit-base-patch32");
  }
  return _clip;
}

async function rawImage(file) {
  const { RawImage } = await hf();
  const { data, info } = await sharp(file).rotate().resize(1024, 1024, { fit: "inside" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return new RawImage(new Uint8ClampedArray(data), info.width, info.height, 3);
}

/* ---------- 1. label ---------- */

async function labelPhoto(file, image) {
  const fromName = labelFromFilename(path.basename(file));
  if (SKIP_AI) return { label: fromName ?? "living", confidence: 0, source: "filename" };

  const clip = await clipModel();
  const prompts = [];
  for (const [key, r] of Object.entries(ROOMS)) for (const p of r.prompts) prompts.push({ key, text: `a real estate photo of ${p}` });
  const out = await clip(image, prompts.map((p) => p.text));
  const scores = {};
  for (const o of out) {
    const key = prompts.find((p) => p.text === o.label).key;
    scores[key] = (scores[key] ?? 0) + o.score;
  }
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [best, bestScore] = ranked[0];
  const margin = bestScore - ranked[1][1];
  const unsure = bestScore < 0.4 || margin < 0.1;
  if (unsure && fromName) return { label: fromName, confidence: +bestScore.toFixed(2), source: "filename" };
  return { label: best, confidence: +bestScore.toFixed(2), source: "vision" };
}

/* ---------- 4. depth ---------- */

async function depthMap(image, outFile) {
  if (SKIP_AI) {
    // Flat-ish fallback: vertical gradient (floor near, ceiling far)
    const w = 64, h = 64, buf = Buffer.alloc(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) buf[y * w + x] = Math.round(80 + 120 * Math.pow(Math.abs(y / h - 0.45) * 1.8, 1.3));
    await sharp(buf, { raw: { width: w, height: h, channels: 1 } }).resize(DEPTH_SIZE, Math.round(DEPTH_SIZE * image.height / image.width)).blur(8).webp({ quality: 90 }).toFile(outFile);
    return;
  }
  const model = await depthModel();
  const { depth } = await model(image); // RawImage, 1 channel, white = near
  const w = depth.width, h = depth.height;
  // Normalise to full 0–255 range with robust percentiles so every room parallaxes similarly.
  const sorted = Uint8Array.from(depth.data).sort();
  const lo = sorted[Math.floor(sorted.length * 0.01)], hi = sorted[Math.floor(sorted.length * 0.99)];
  const norm = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) norm[i] = Math.max(0, Math.min(255, Math.round(((depth.data[i] - lo) / Math.max(1, hi - lo)) * 255)));
  const targetW = Math.min(DEPTH_SIZE, image.width);
  await sharp(norm, { raw: { width: w, height: h, channels: 1 } })
    .resize(targetW, Math.round(targetW * image.height / image.width))
    .blur(1.2) // soften edges → fewer tearing artefacts in parallax
    .webp({ quality: 92 })
    .toFile(outFile);
}

/* ---------- 3. focal point ---------- */

/**
 * Where should the camera push in? Doorways and windows are the deepest,
 * and windows are also the brightest, parts of an interior photo. We score
 * each cell on (far + bright + a little centre bias) and take the
 * weighted centroid of the top cells.
 */
async function focalPoint(photoFile, depthFile, label) {
  const G = 48;
  const rgb = await sharp(photoFile).rotate().removeAlpha().resize(G, G, { fit: "fill" }).raw().toBuffer();
  const dep = await sharp(depthFile).greyscale().resize(G, G, { fit: "fill" }).raw().toBuffer();
  const lum = new Float32Array(G * G), sat = new Float32Array(G * G);
  for (let i = 0; i < G * G; i++) {
    const r = rgb[i * 3] / 255, g = rgb[i * 3 + 1] / 255, b = rgb[i * 3 + 2] / 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    lum[i] = 0.3 * r + 0.59 * g + 0.11 * b;
    sat[i] = mx > 0 ? (mx - mn) / mx : 0;
  }
  // Local texture: windows show foliage/sky detail, plain walls don't.
  const tex = new Float32Array(G * G);
  for (let y = 1; y < G - 1; y++) for (let x = 1; x < G - 1; x++) {
    const i = y * G + x;
    tex[i] = Math.min(1, (Math.abs(lum[i + 1] - lum[i - 1]) + Math.abs(lum[i + G] - lum[i - G])) * 3);
  }
  const exterior = label === "exterior-front" || label === "garden";
  const raw = new Float32Array(G * G);
  for (let y = 0; y < G; y++) for (let x = 0; x < G; x++) {
    const i = y * G + x;
    const far = 1 - dep[i] / 255;
    const cx = x / (G - 1) - 0.5, cy = y / (G - 1) - 0.5;
    const centre = 1 - Math.min(1, Math.hypot(cx * 1.2, cy * 1.5) * 1.5);
    raw[i] = exterior
      // Exteriors: aim for the entrance — low-centre, textured
      ? 0.6 * centre + 0.6 * (1 - Math.min(1, Math.abs(y / G - 0.8) * 3)) + 0.2 * tex[i]
      // Interiors: deep + colourful/textured + bright = a window or doorway
      : 0.5 * far + 0.6 * sat[i] * far + 0.4 * tex[i] + 0.2 * lum[i] + 0.25 * centre - (y / G < 0.15 || y / G > 0.85 ? 0.6 : 0);
  }
  // Smooth (box blur) so we pick a region, not a speck.
  const cells = [];
  for (let y = 0; y < G; y++) for (let x = 0; x < G; x++) {
    let s = 0, n = 0;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
      const yy = y + dy, xx = x + dx;
      if (yy >= 0 && yy < G && xx >= 0 && xx < G) { s += raw[yy * G + xx]; n++; }
    }
    cells.push({ x: (x + 0.5) / G, y: (y + 0.5) / G, s: s / n });
  }
  cells.sort((a, b) => b.s - a.s);
  // Centroid of the best cells that sit near the single best cell (one region).
  const best = cells[0];
  const top = cells.slice(0, 120).filter((c) => Math.hypot(c.x - best.x, c.y - best.y) < 0.12);
  const wsum = top.reduce((a, c) => a + c.s, 0);
  let fx = top.reduce((a, c) => a + c.x * c.s, 0) / wsum;
  let fy = top.reduce((a, c) => a + c.y * c.s, 0) / wsum;
  fx = Math.min(0.82, Math.max(0.18, fx));
  fy = Math.min(0.8, Math.max(0.22, fy));
  return { x: +fx.toFixed(3), y: +fy.toFixed(3) };
}

/* ---------- 5. images ---------- */

async function optimise(photoFile, outDir, id) {
  const img = sharp(photoFile).rotate();
  const meta = await img.metadata();
  const width = meta.autoOrient?.width ?? meta.width;
  const height = meta.autoOrient?.height ?? meta.height;
  const widths = SIZES.filter((w) => w < width);
  widths.push(Math.min(width, SIZES[SIZES.length - 1]));
  const uniq = [...new Set(widths)];
  for (const w of uniq) {
    const base = sharp(photoFile).rotate().resize(w);
    await base.clone().webp({ quality: 82 }).toFile(path.join(outDir, `${id}-${w}.webp`));
    await base.clone().avif({ quality: 55, effort: 4 }).toFile(path.join(outDir, `${id}-${w}.avif`));
  }
  // Tiny blurred placeholder (inline as data URI)
  const lqip = await sharp(photoFile).rotate().resize(24).blur(1).webp({ quality: 40 }).toBuffer();
  return { width, height, widths: uniq, placeholder: `data:image/webp;base64,${lqip.toString("base64")}` };
}

/* ---------- captions ---------- */

function caption(label, details, isFirstOfRoom) {
  const r = details.rooms?.[label];
  const name = r?.name ?? ROOMS[label]?.name ?? label;
  if (!isFirstOfRoom) return { title: name, subtitle: "" };
  return { title: name, subtitle: r?.size ?? "" };
}

/* ---------- main ---------- */

const slugify = (f) => path.basename(f, path.extname(f)).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function processProperty(slug) {
  const dir = path.join(PROPS, slug);
  const photosDir = path.join(dir, "photos");
  const manifestFile = path.join(dir, "walkthrough.json");
  const details = JSON.parse(await fs.readFile(path.join(dir, "details.json"), "utf8"));
  const outDir = path.join(PUBLIC, slug);
  await fs.mkdir(path.join(outDir, "img"), { recursive: true });
  await fs.mkdir(path.join(outDir, "depth"), { recursive: true });

  const previous = !RESET && existsSync(manifestFile) ? JSON.parse(await fs.readFile(manifestFile, "utf8")) : null;
  const prevByFile = new Map((previous?.scenes ?? []).map((s) => [s.file, s]));

  const files = (await fs.readdir(photosDir)).filter((f) => PHOTO_EXT.test(f)).sort();
  console.log(`\n▸ ${slug} — ${files.length} photos`);

  const scenes = [];
  for (const file of files) {
    const src = path.join(photosDir, file);
    const id = slugify(file);
    const prev = prevByFile.get(file);
    const image = await rawImage(src);

    const img = await optimise(src, path.join(outDir, "img"), id);
    const depthFile = path.join(outDir, "depth", `${id}.webp`);
    const srcStat = await fs.stat(src);
    const depthFresh = existsSync(depthFile) && (await fs.stat(depthFile)).mtimeMs > srcStat.mtimeMs && !RESET;
    if (!depthFresh) await depthMap(image, depthFile);

    const auto = prev && !RESET ? null : await labelPhoto(src, image);
    const label = prev?.label ?? auto.label;
    const focal = prev?.focal ?? (await focalPoint(src, depthFile, label));
    console.log(`  ${file.padEnd(28)} ${label.padEnd(15)} ${prev ? "(kept from manifest)" : `${auto.source} ${auto.confidence}`}  focal ${focal.x},${focal.y}`);

    scenes.push({
      file,
      id,
      label,
      focal,
      caption: prev?.caption ?? null, // filled below
      weight: prev?.weight ?? 1,
      parallax: prev?.parallax ?? 1,
      ...(prev?.hidden ? { hidden: true } : {}),
      image: {
        width: img.width,
        height: img.height,
        widths: img.widths,
        base: `/properties/${slug}/img/${id}`,
        placeholder: img.placeholder,
      },
      depth: `/properties/${slug}/depth/${id}.webp`,
      detected: auto ? { label: auto.label, confidence: auto.confidence, source: auto.source } : prev?.detected,
    });
  }

  // 2. order: keep the manual order for known photos; slot new ones by route order.
  const prevOrder = new Map((previous?.scenes ?? []).map((s, i) => [s.file, i]));
  const routeKey = (s) => (ROOMS[s.label]?.order ?? 50);
  scenes.sort((a, b) => {
    const pa = prevOrder.get(a.file), pb = prevOrder.get(b.file);
    if (pa !== undefined && pb !== undefined) return pa - pb;
    return routeKey(a) - routeKey(b) || (pa ?? 1e9) - (pb ?? 1e9) || a.file.localeCompare(b.file);
  });

  const seen = new Set();
  for (const s of scenes) {
    if (!s.caption) s.caption = caption(s.label, details, !seen.has(s.label));
    seen.add(s.label);
  }

  // Optional AI fly-through video
  let video = previous?.video ?? null;
  for (const name of ["walkthrough.mp4", "walkthrough.webm"]) {
    const v = path.join(dir, name);
    if (existsSync(v)) {
      await fs.copyFile(v, path.join(outDir, name));
      video = { src: `/properties/${slug}/${name}`, enabled: previous?.video?.enabled ?? true };
    }
  }

  // Floor plan (optional): properties/<slug>/floorplan.(png|jpg|webp|svg)
  let floorplan = null;
  for (const f of await fs.readdir(dir)) {
    if (/^floor-?plan\.(png|jpe?g|webp|svg)$/i.test(f)) {
      const ext = path.extname(f).toLowerCase();
      const out = path.join(outDir, `floorplan${ext === ".svg" ? ".svg" : ".webp"}`);
      if (ext === ".svg") await fs.copyFile(path.join(dir, f), out);
      else await sharp(path.join(dir, f)).resize(2000, 2000, { fit: "inside", withoutEnlargement: true }).webp({ quality: 90 }).toFile(out);
      floorplan = `/properties/${slug}/${path.basename(out)}`;
    }
  }

  const manifest = {
    $comment: "Generated by `npm run process`. Edit freely: order of `scenes`, label, caption, focal (0–1, the point the camera zooms through), weight (scroll length), parallax (depth strength), hidden. Re-running keeps your edits; `--reset` regenerates.",
    slug,
    generatedAt: new Date().toISOString(),
    video,
    floorplan,
    scenes,
  };
  await fs.writeFile(manifestFile, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`  ✓ wrote properties/${slug}/walkthrough.json`);
}

const slugs = only.length ? only : (await fs.readdir(PROPS, { withFileTypes: true })).filter((d) => d.isDirectory() && existsSync(path.join(PROPS, d.name, "details.json"))).map((d) => d.name);
for (const slug of slugs) await processProperty(slug);
console.log("\nDone.");
