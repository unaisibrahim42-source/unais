export type RoomLabel =
  | "exterior-front"
  | "hallway"
  | "living"
  | "dining"
  | "kitchen"
  | "bedroom"
  | "bathroom"
  | "garden"
  | "view"
  | (string & {});

export interface Scene {
  file: string;
  id: string;
  label: RoomLabel;
  /** 0–1 in image space, top-left origin: the point the camera pushes through. */
  focal: { x: number; y: number };
  caption: { title: string; subtitle?: string };
  /** Relative scroll length for this scene (default 1). */
  weight?: number;
  /** Depth strength multiplier (default 1, 0 = flat). */
  parallax?: number;
  hidden?: boolean;
  image: {
    width: number;
    height: number;
    widths: number[];
    /** URL without the `-<width>.<ext>` suffix. */
    base: string;
    placeholder: string;
  };
  depth: string;
}

export interface Walkthrough {
  slug: string;
  video: { src: string; enabled?: boolean } | null;
  floorplan: string | null;
  scenes: Scene[];
}

export interface PropertyDetails {
  title: string;
  price: number;
  currency?: string;
  priceSuffix?: string;
  status?: string;
  beds: number;
  baths: number;
  sqft: number;
  location: string;
  address?: string;
  lat: number;
  lng: number;
  featured?: boolean;
  summary?: string;
  description: string;
  features: string[];
  rooms?: Record<string, { name?: string; size?: string }>;
  agent: { name: string; role?: string; phone: string; email: string; photo?: string };
}

export interface Property {
  slug: string;
  details: PropertyDetails;
  walkthrough: Walkthrough;
}

export const imageUrl = (scene: Scene, width: number, ext: "webp" | "avif" = "webp") => {
  const sorted = [...scene.image.widths].sort((a, b) => a - b);
  const w = sorted.find((x) => x >= width) ?? sorted[sorted.length - 1];
  return `${scene.image.base}-${w}.${ext}`;
};

export const srcSet = (scene: Scene, ext: "webp" | "avif" = "webp") =>
  scene.image.widths.map((w) => `${scene.image.base}-${w}.${ext} ${w}w`).join(", ");
