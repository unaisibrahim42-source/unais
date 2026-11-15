/**
 * Pure camera choreography, shared by the WebGL, Ken Burns and caption layers.
 *
 * The walkthrough is one continuous number `x` in [0, totalLength]. Each scene
 * owns `weight` units: the first part is a slow gimbal "dwell" (dolly-in plus a
 * lateral drift), the last TRANSITION part pushes through the focal point
 * (doorway/window) and dissolves into the next room.
 */
import type { Scene } from "@/lib/types";

export const TRANSITION = 0.38; // share of a scene's length spent transitioning out

export interface RoomCam {
  /** Scene index. */
  index: number;
  /** Zoom (1 = cover fit). */
  zoom: number;
  /** View centre in image uv (top-left origin). */
  center: { x: number; y: number };
  /** Lateral camera offset for parallax, roughly −1…1. */
  truck: { x: number; y: number };
  /** Depth-aware dolly amount (near objects grow faster). */
  dolly: number;
}

export interface Frame {
  index: number; // current (outgoing) scene
  dwell: number; // 0–1 progress through the dwell phase
  transition: number; // 0–1 progress through the transition (0 when dwelling)
  a: RoomCam;
  b: RoomCam | null; // incoming scene during a transition
  mix: number; // 0 = only a, 1 = only b
  blur: number; // radial blur strength 0–1
  leak: number; // light-leak strength 0–1
  progress: number; // 0–1 over the whole walkthrough
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeIn = (t: number) => t * t * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export const ZOOM_BASE = 1.1; // overscan so parallax never shows an edge
const ZOOM_DWELL = 0.14;

export const sceneWeights = (scenes: Scene[]) => scenes.map((s) => Math.max(0.2, s.weight ?? 1));
export const totalLength = (scenes: Scene[]) => sceneWeights(scenes).reduce((a, b) => a + b, 0);

/** Start offset of scene i (where its dwell begins). */
export const sceneStart = (scenes: Scene[], i: number) => sceneWeights(scenes).slice(0, i).reduce((a, b) => a + b, 0);

/** Camera for a room during its dwell, a ∈ [0,1]. Alternate drift direction per room. */
function dwellCam(scene: Scene, index: number, a: number): RoomCam {
  const dir = index % 2 === 0 ? 1 : -1;
  const e = easeInOut(a);
  const pull = 0.22 * e; // drift the view centre a little toward the focal point
  return {
    index,
    zoom: ZOOM_BASE + ZOOM_DWELL * e,
    center: { x: lerp(0.5, scene.focal.x, pull), y: lerp(0.5, scene.focal.y, pull) },
    truck: { x: dir * lerp(-0.8, 0.8, a), y: 0.25 * Math.sin(a * Math.PI) },
    dolly: 0.05 * e,
  };
}

export function computeFrame(scenes: Scene[], x: number): Frame {
  const weights = sceneWeights(scenes);
  const total = weights.reduce((a, b) => a + b, 0);
  const n = scenes.length;
  x = Math.min(Math.max(0, x), total - 1e-6);

  let index = 0;
  let start = 0;
  while (index < n - 1 && x >= start + weights[index]) {
    start += weights[index];
    index++;
  }
  const u = (x - start) / weights[index];
  const last = index === n - 1;
  const dwellEnd = last ? 1 : 1 - TRANSITION;

  const scene = scenes[index];
  if (u <= dwellEnd || last) {
    const dwell = clamp01(u / dwellEnd);
    return { index, dwell, transition: 0, a: dwellCam(scene, index, dwell), b: null, mix: 0, blur: 0, leak: 0, progress: x / total };
  }

  // Transition: push through the focal point of A, settle into B.
  const t = clamp01((u - dwellEnd) / TRANSITION);
  const next = scenes[index + 1];
  const sameRoom = next.label === scene.label;
  const endA = dwellCam(scene, index, 1);
  const startB = dwellCam(next, index + 1, 0);

  const push = easeIn(t);
  const a: RoomCam = {
    ...endA,
    zoom: endA.zoom * Math.pow(sameRoom ? 1.9 : 3.4, push),
    center: {
      x: lerp(endA.center.x, scene.focal.x, easeInOut(t)),
      y: lerp(endA.center.y, scene.focal.y, easeInOut(t)),
    },
    truck: { x: endA.truck.x + 0.4 * t * Math.sign(endA.truck.x || 1), y: endA.truck.y },
    dolly: endA.dolly + 0.12 * push,
  };

  const settle = easeOut(smooth(0.35, 1, t));
  const b: RoomCam = {
    ...startB,
    zoom: lerp(startB.zoom * (sameRoom ? 1.25 : 1.7), startB.zoom, settle),
    center: {
      x: lerp(next.focal.x, startB.center.x, settle * 0.85 + 0.15),
      y: lerp(next.focal.y, startB.center.y, settle * 0.85 + 0.15),
    },
    truck: { x: startB.truck.x * (0.4 + 0.6 * settle), y: 0 },
    dolly: lerp(-0.06, startB.dolly, settle),
  };

  const bell = Math.sin(Math.PI * smooth(0.1, 0.95, t));
  return {
    index,
    dwell: 1,
    transition: t,
    a,
    b,
    mix: smooth(0.42, 0.78, t),
    blur: bell * (sameRoom ? 0.55 : 1),
    leak: bell * (sameRoom ? 0.35 : 0.9),
    progress: x / total,
  };
}

/** Caption opacity for scene i at frame f. */
export function captionOpacity(f: Frame, i: number, count: number) {
  if (f.index !== i || f.transition > 0) return 0;
  const fadeIn = i === 0 ? 1 : smooth(0.04, 0.2, f.dwell);
  const fadeOut = i === count - 1 ? 1 : 1 - smooth(0.82, 1, f.dwell);
  return fadeIn * fadeOut;
}
