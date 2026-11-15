import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { Property, PropertyDetails, Walkthrough } from "./types";

const DIR = path.join(process.cwd(), "properties");

function readJson<T>(file: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
  } catch {
    return null;
  }
}

export function getPropertySlugs(): string[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(DIR, d.name, "details.json")))
    .map((d) => d.name)
    .sort();
}

export function getProperty(slug: string): Property | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const details = readJson<PropertyDetails>(path.join(DIR, slug, "details.json"));
  if (!details) return null;
  const walkthrough = readJson<Walkthrough>(path.join(DIR, slug, "walkthrough.json")) ?? {
    slug,
    video: null,
    floorplan: null,
    scenes: [],
  };
  walkthrough.scenes = walkthrough.scenes.filter((s) => !s.hidden);
  if (walkthrough.video && walkthrough.video.enabled === false) walkthrough.video = null;
  return { slug, details, walkthrough };
}

export function getProperties(): Property[] {
  return getPropertySlugs()
    .map(getProperty)
    .filter((p): p is Property => p !== null && p.walkthrough.scenes.length > 0);
}
