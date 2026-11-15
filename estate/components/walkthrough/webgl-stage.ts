/**
 * WebGL renderer: draws two rooms (outgoing A, incoming B) with their depth
 * maps for real 2.5D parallax, plus radial blur, light leak, vignette & grain.
 */
import * as THREE from "three";
import type { Scene } from "@/lib/types";
import { imageUrl } from "@/lib/types";
import type { Frame, RoomCam } from "./timeline";

const vertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragment = /* glsl */ `
precision highp float;
varying vec2 vUv;

uniform vec2 uRes;
uniform float uTime;
uniform float uMix;
uniform float uBlur;
uniform float uLeak;
uniform vec3 uLeakColor;

uniform sampler2D uImgA; uniform sampler2D uDepA;
uniform float uAspA; uniform vec2 uCenterA; uniform float uZoomA; uniform vec2 uTruckA; uniform float uDollyA; uniform vec2 uFocalA; uniform float uParA; uniform float uReadyA;
uniform sampler2D uImgB; uniform sampler2D uDepB;
uniform float uAspB; uniform vec2 uCenterB; uniform float uZoomB; uniform vec2 uTruckB; uniform float uDollyB; uniform vec2 uFocalB; uniform float uParB; uniform float uReadyB;

// Image-space uv (top-left origin) for screen uv s, cover-fitted, zoomed about centre c.
vec2 viewUv(vec2 s, float imgAsp, vec2 c, float z) {
  float scrAsp = uRes.x / uRes.y;
  vec2 f = scrAsp > imgAsp ? vec2(1.0, imgAsp / scrAsp) : vec2(scrAsp / imgAsp, 1.0);
  vec2 half_ = 0.5 * f / z;
  c = clamp(c, half_, 1.0 - half_);
  vec2 st = vec2(s.x, 1.0 - s.y);           // flip to top-left origin
  return c + (st - 0.5) * f / z;
}

vec2 toTex(vec2 p) { return vec2(p.x, 1.0 - p.y); }

vec3 room(sampler2D img, sampler2D dep, float asp, vec2 c, float z, vec2 truck, float dolly, vec2 focal, float par, float blur, out vec2 focalScreen) {
  vec2 uv = viewUv(vUv, asp, c, z);
  // Iterative parallax: displace by depth relative to a mid focus plane.
  float strength = 0.022 * par / sqrt(z);
  vec2 p = uv;
  for (int i = 0; i < 4; i++) {
    float d = texture2D(dep, toTex(clamp(p, 0.0, 1.0))).r;
    float rel = d - 0.4;
    p = uv - truck * rel * strength - (uv - c) * dolly * rel;
  }
  p = clamp(p, 0.001, 0.999);

  // Where the focal point lands on screen (for blur + light leak).
  float scrAsp = uRes.x / uRes.y;
  vec2 f = scrAsp > asp ? vec2(1.0, asp / scrAsp) : vec2(scrAsp / asp, 1.0);
  vec2 half_ = 0.5 * f / z;
  vec2 cc = clamp(c, half_, 1.0 - half_);
  focalScreen = (focal - cc) * z / f + 0.5;

  if (blur < 0.01) return texture2D(img, toTex(p)).rgb;
  // Radial "zoom" blur towards the focal point.
  vec3 acc = vec3(0.0);
  float wsum = 0.0;
  vec2 dir = (p - focal) * 0.11 * blur;
  for (int i = 0; i < 9; i++) {
    float k = float(i) / 8.0;
    float w = 1.0 - k * 0.6;
    acc += texture2D(img, toTex(clamp(p - dir * k, 0.001, 0.999))).rgb * w;
    wsum += w;
  }
  return acc / wsum;
}

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
  vec2 fsA = vec2(0.5); vec2 fsB = vec2(0.5);
  vec3 col = vec3(0.96, 0.95, 0.93);
  vec3 a = col; vec3 b = col;
  if (uMix < 0.999 && uReadyA > 0.5) a = room(uImgA, uDepA, uAspA, uCenterA, uZoomA, uTruckA, uDollyA, uFocalA, uParA, uBlur, fsA);
  if (uMix > 0.001 && uReadyB > 0.5) b = room(uImgB, uDepB, uAspB, uCenterB, uZoomB, uTruckB, uDollyB, uFocalB, uParB, uBlur * (1.0 - uMix), fsB);
  col = mix(a, b, uMix);

  // Light leak: warm bloom centred on the doorway we're passing through.
  vec2 lc = mix(fsA, vec2(0.5), uMix);
  vec2 d = (vUv - vec2(lc.x, 1.0 - lc.y)) * vec2(uRes.x / uRes.y, 1.0);
  float glow = exp(-dot(d, d) * 2.2);
  float sweep = exp(-pow((vUv.x + vUv.y * 0.35) - (0.2 + uMix * 1.2), 2.0) * 6.0);
  vec3 leak = uLeakColor * (glow * 0.85 + sweep * 0.35);
  col += leak * uLeak;
  col = mix(col, vec3(1.0, 0.97, 0.92), uLeak * 0.22);           // exposure lift
  col = mix(col, col * col * (3.0 - 2.0 * col), 0.18);            // gentle filmic contrast

  // Vignette + grain
  vec2 v = vUv - 0.5;
  col *= 1.0 - dot(v, v) * 0.38;
  col += (hash(vUv * uRes + fract(uTime) * 100.0) - 0.5) * 0.025;

  gl_FragColor = vec4(col, 1.0);
}
`;

interface Slot {
  img: THREE.Texture | null;
  dep: THREE.Texture | null;
  ready: boolean;
}

export class WebGLStage {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private material: THREE.ShaderMaterial;
  private slots: Slot[];
  private loader = new THREE.TextureLoader();
  private blank: THREE.Texture;
  private disposed = false;

  constructor(private canvas: HTMLCanvasElement, private scenes: Scene[], leakColor = "#ffcf9a") {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
    const mobile = Math.min(window.innerWidth, window.innerHeight) < 700;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    const data = new Uint8Array([200, 200, 200, 255]);
    this.blank = new THREE.DataTexture(data, 1, 1);
    this.blank.needsUpdate = true;

    this.slots = scenes.map(() => ({ img: null, dep: null, ready: false }));

    const u = (v: unknown) => ({ value: v });
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      depthTest: false,
      uniforms: {
        uRes: u(new THREE.Vector2(1, 1)),
        uTime: u(0),
        uMix: u(0),
        uBlur: u(0),
        uLeak: u(0),
        uLeakColor: u(new THREE.Color(leakColor)),
        uImgA: u(this.blank), uDepA: u(this.blank), uAspA: u(1.5), uCenterA: u(new THREE.Vector2(0.5, 0.5)), uZoomA: u(1), uTruckA: u(new THREE.Vector2()), uDollyA: u(0), uFocalA: u(new THREE.Vector2(0.5, 0.5)), uParA: u(1), uReadyA: u(0),
        uImgB: u(this.blank), uDepB: u(this.blank), uAspB: u(1.5), uCenterB: u(new THREE.Vector2(0.5, 0.5)), uZoomB: u(1), uTruckB: u(new THREE.Vector2()), uDollyB: u(0), uFocalB: u(new THREE.Vector2(0.5, 0.5)), uParB: u(1), uReadyB: u(0),
      },
    });
    this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material));
    this.resize();
  }

  /** Load scene textures, nearest-first from `from`. */
  preload(from = 0) {
    const order = this.scenes.map((_, i) => i).sort((a, b) => Math.abs(a - from) - Math.abs(b - from));
    order.forEach((i) => this.load(i));
  }

  private loading = new Set<number>();
  private load(i: number): Promise<void> {
    if (this.slots[i].ready || this.loading.has(i)) return Promise.resolve();
    this.loading.add(i);
    const s = this.scenes[i];
    const w = this.canvas.clientWidth * Math.min(window.devicePixelRatio, 2) * 1.15;
    const tex = (url: string, color: boolean) =>
      new Promise<THREE.Texture>((res, rej) =>
        this.loader.load(url, (t) => {
          t.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
          t.minFilter = THREE.LinearFilter;
          t.magFilter = THREE.LinearFilter;
          t.generateMipmaps = false;
          res(t);
        }, undefined, rej),
      );
    return Promise.all([tex(imageUrl(s, Math.min(w, 2400)), true), tex(s.depth, false)])
      .then(([img, dep]) => {
        if (this.disposed) return;
        this.slots[i] = { img, dep, ready: true };
        this.renderer.initTexture(img);
        this.renderer.initTexture(dep);
      })
      .catch(() => {})
      .finally(() => this.loading.delete(i));
  }

  isReady(i: number) {
    return this.slots[i]?.ready ?? false;
  }

  resize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    (this.material.uniforms.uRes.value as THREE.Vector2).set(w, h);
  }

  private bind(suffix: "A" | "B", cam: RoomCam | null) {
    const U = this.material.uniforms;
    if (!cam) {
      U[`uReady${suffix}`].value = 0;
      return;
    }
    const s = this.scenes[cam.index];
    const slot = this.slots[cam.index];
    U[`uImg${suffix}`].value = slot.img ?? this.blank;
    U[`uDep${suffix}`].value = slot.dep ?? this.blank;
    U[`uReady${suffix}`].value = slot.ready ? 1 : 0;
    U[`uAsp${suffix}`].value = s.image.width / s.image.height;
    (U[`uCenter${suffix}`].value as THREE.Vector2).set(cam.center.x, cam.center.y);
    U[`uZoom${suffix}`].value = cam.zoom;
    (U[`uTruck${suffix}`].value as THREE.Vector2).set(cam.truck.x, cam.truck.y);
    U[`uDolly${suffix}`].value = cam.dolly;
    (U[`uFocal${suffix}`].value as THREE.Vector2).set(s.focal.x, s.focal.y);
    U[`uPar${suffix}`].value = s.parallax ?? 1;
  }

  render(f: Frame, time: number) {
    if (this.disposed) return;
    const U = this.material.uniforms;
    // Gentle handheld "breathing" layered on top of the scroll camera.
    const breathe = (cam: RoomCam): RoomCam => ({
      ...cam,
      truck: { x: cam.truck.x + Math.sin(time * 0.31) * 0.12, y: cam.truck.y + Math.sin(time * 0.23 + 1.3) * 0.1 },
      zoom: cam.zoom * (1 + Math.sin(time * 0.17) * 0.004),
    });
    this.bind("A", breathe(f.a));
    this.bind("B", f.b ? breathe(f.b) : null);
    // If the incoming room isn't loaded yet, hold on A.
    U.uMix.value = f.b && this.slots[f.b.index].ready ? f.mix : 0;
    U.uBlur.value = f.blur;
    U.uLeak.value = f.leak;
    U.uTime.value = time;
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.disposed = true;
    this.slots.forEach((s) => {
      s.img?.dispose();
      s.dep?.dispose();
    });
    this.material.dispose();
    this.renderer.dispose();
  }
}

export function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
