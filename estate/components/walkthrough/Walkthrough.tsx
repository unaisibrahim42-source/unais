"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Scene } from "@/lib/types";
import { scrollToY } from "@/components/SmoothScroll";
import { captionOpacity, computeFrame, sceneStart, sceneWeights, totalLength, type Frame } from "./timeline";
import { WebGLStage, webglAvailable } from "./webgl-stage";
import { KenBurnsStage, type KenBurnsHandle } from "./KenBurnsStage";

gsap.registerPlugin(ScrollTrigger);

// Client capabilities (WebGL + reduced-motion), read once and cached.
let capsCache: { webgl: boolean; reduced: boolean } | null = null;
const getCaps = () =>
  (capsCache ??= {
    webgl: webglAvailable(),
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  });
const subscribeCaps = () => () => {};

type Mode = "scroll" | "autoplay" | "hover";
type Renderer = "webgl" | "kenburns" | "video";

export interface WalkthroughProps {
  scenes: Scene[];
  video?: { src: string } | null;
  mode?: Mode;
  /** Scroll distance per scene, in viewport heights. */
  vhPerScene?: number;
  /** For hover mode: whether the pointer is over the card. */
  active?: boolean;
  /** Seconds per scene in autoplay/hover mode. */
  secondsPerScene?: number;
  showCaptions?: boolean;
  showProgress?: boolean;
  intro?: React.ReactNode;
  className?: string;
}

export function Walkthrough({
  scenes,
  video,
  mode = "scroll",
  vhPerScene = 1.25,
  active = true,
  secondsPerScene = 4.5,
  showCaptions = true,
  showProgress = true,
  intro,
  className = "",
}: WalkthroughProps) {
  const section = useRef<HTMLElement>(null);
  const stageBox = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const videoEl = useRef<HTMLVideoElement>(null);
  const kenburns = useRef<KenBurnsHandle>(null);
  const captions = useRef<(HTMLDivElement | null)[]>([]);
  const fill = useRef<HTMLDivElement>(null);
  const introEl = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const caps = useSyncExternalStore(subscribeCaps, getCaps, () => null);
  const [webglFailed, setWebglFailed] = useState(false);
  const [current, setCurrent] = useState(0);
  const reduced = caps?.reduced ?? false;
  const renderer: Renderer | null = !caps
    ? null
    : video && mode === "scroll" && !caps.reduced
      ? "video"
      : !caps.reduced && caps.webgl && !webglFailed
        ? "webgl"
        : "kenburns";

  // Autoplay loops: append the first scene so the last room flows back into it.
  const loop = mode !== "scroll";
  const playScenes = useMemo(() => (loop && scenes.length > 1 ? [...scenes, { ...scenes[0], id: scenes[0].id + "-loop" }] : scenes), [scenes, loop]);
  const total = useMemo(() => totalLength(scenes), [scenes]);
  const weights = useMemo(() => sceneWeights(scenes), [scenes]);

  // Main loop.
  useEffect(() => {
    if (!renderer || scenes.length === 0) return;
    let stage: WebGLStage | null = null;
    if (renderer === "webgl" && canvas.current) {
      try {
        stage = new WebGLStage(canvas.current, playScenes);
        stage.preload(0);
      } catch {
        queueMicrotask(() => setWebglFailed(true));
        return;
      }
    }

    let target = 0; // where scroll says we should be (in scene units)
    let x = 0; // smoothed camera position
    let visible = true;
    let lastIndex = -1;
    let raf = 0;
    let last = performance.now();
    const start = last;
    const loopLen = loop ? totalLength(playScenes) - (playScenes[playScenes.length - 1].weight ?? 1) : total;

    let trigger: ScrollTrigger | null = null;
    if (mode === "scroll" && section.current) {
      trigger = ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          target = self.progress * total;
        },
      });
      target = trigger.progress * total;
      x = target;
    }

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100px" });
    if (stageBox.current) io.observe(stageBox.current);

    const onResize = () => stage?.resize();
    window.addEventListener("resize", onResize);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (!visible) return;

      if (mode !== "scroll") {
        // Hover mode only plays while the pointer is over the card.
        if (mode === "autoplay" || activeRef.current) target += dt / secondsPerScene;
        if (target >= loopLen) {
          target -= loopLen;
          x -= loopLen;
        }
      }
      // Critically-damped follow → gimbal-smooth motion even on jerky scroll.
      x += (target - x) * (1 - Math.exp(-dt * (mode === "scroll" ? 3.2 : 8)));
      const f: Frame = computeFrame(playScenes, x);
      const t = (now - start) / 1000;

      if (stage) stage.render(f, t);
      else if (kenburns.current) kenburns.current.render(f);
      if (renderer === "video" && videoEl.current && videoEl.current.duration) {
        const v = videoEl.current;
        const want = f.progress * v.duration;
        if (Math.abs(v.currentTime - want) > 0.04 && !v.seeking) v.currentTime = want;
      }

      const realIndex = f.index % scenes.length;
      if (showCaptions)
        captions.current.forEach((el, i) => {
          if (!el) return;
          // The first caption waits for the intro title to clear.
          const o = captionOpacity(f, i, playScenes.length) * (i === 0 && introEl.current ? Math.min(1, Math.max(0, (x - 0.14) / 0.12)) : 1);
          el.style.opacity = o.toFixed(3);
          el.style.transform = `translate3d(0, ${(1 - o) * 14}px, 0)`;
        });
      if (fill.current) fill.current.style.transform = `scaleX(${Math.min(1, x / total)})`;
      if (introEl.current) {
        const o = 1 - Math.min(1, x / 0.18);
        introEl.current.style.opacity = o.toFixed(3);
        introEl.current.style.visibility = o <= 0 ? "hidden" : "visible";
      }
      if (realIndex !== lastIndex) {
        lastIndex = realIndex;
        setCurrent(realIndex);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      trigger?.kill();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      stage?.dispose();
    };
  }, [renderer, playScenes, scenes.length, total, mode, loop, secondsPerScene, showCaptions]);

  const jumpTo = (i: number) => {
    const el = section.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    // Land a little into the dwell so the caption is already visible.
    const at = (sceneStart(scenes, i) + weights[i] * 0.18) / total;
    scrollToY(top + range * at);
  };

  const sticky = (
    <div ref={stageBox} className={mode === "scroll" ? "sticky top-0 h-[100svh] w-full overflow-hidden" : "absolute inset-0 overflow-hidden"}>
      {/* Blurred placeholder while textures load */}
      <div
        className="absolute inset-0 scale-110 bg-cover bg-center blur-xl"
        style={{ backgroundImage: scenes[0] ? `url(${scenes[0].image.placeholder})` : undefined }}
      />
      {renderer === "webgl" && <canvas ref={canvas} className="absolute inset-0 h-full w-full" />}
      {renderer === "kenburns" && <KenBurnsStage ref={kenburns} scenes={playScenes} reduced={reduced} eager={mode !== "scroll"} />}
      {renderer === "video" && video && (
        <video ref={videoEl} src={video.src} className="absolute inset-0 h-full w-full object-cover" muted playsInline preload="auto" />
      )}

      {/* Legibility gradient */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

      {intro && (
        <div ref={introEl} className="absolute inset-0 flex items-end">
          {intro}
        </div>
      )}

      {showCaptions && (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 px-5 sm:bottom-28 sm:px-10">
          {scenes.map((s, i) => (
            <div
              key={s.id}
              ref={(el) => {
                captions.current[i] = el;
              }}
              className="absolute bottom-0 left-5 opacity-0 will-change-transform sm:left-10"
              style={{ opacity: i === 0 && !intro ? 1 : 0 }}
            >
              <div className="glass rounded-2xl px-5 py-4 text-white sm:px-7 sm:py-5">
                <p className="mb-1 text-[10px] tracking-[0.28em] text-white/70 uppercase">
                  {String(i + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}
                </p>
                <p className="font-display text-2xl leading-tight sm:text-4xl">
                  {s.caption.title}
                  {s.caption.subtitle ? <span className="font-sans text-base font-light text-white/80 sm:text-xl"> · {s.caption.subtitle}</span> : null}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showProgress && (
        <nav aria-label="Rooms" className="absolute inset-x-0 bottom-0 px-5 pb-6 sm:px-10 sm:pb-8">
          <div className="relative flex gap-1.5">
            {scenes.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => jumpTo(i)}
                className="group relative flex-1 pt-6 text-left"
                style={{ flexGrow: weights[i] }}
                aria-current={current === i ? "step" : undefined}
              >
                <span
                  className={`absolute top-0 left-0 hidden max-w-full truncate text-[11px] tracking-[0.18em] uppercase transition-colors duration-500 sm:block ${
                    current === i ? "text-white" : "text-white/55 group-hover:text-white/85"
                  }`}
                >
                  {s.caption.title}
                </span>
                <span className="block h-px w-full bg-white/30 transition-all group-hover:bg-white/60" />
              </button>
            ))}
            <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-px">
              <div ref={fill} className="h-full origin-left bg-white" style={{ transform: "scaleX(0)" }} />
            </div>
          </div>
          <p className="mt-3 text-[11px] tracking-[0.18em] text-white/80 uppercase sm:hidden">{scenes[current]?.caption.title}</p>
        </nav>
      )}
    </div>
  );

  if (mode !== "scroll") return <div className={`relative overflow-hidden ${className}`}>{sticky}</div>;

  return (
    <section ref={section} className={`relative ${className}`} style={{ height: `${Math.round(total * vhPerScene * 100 + 100)}svh` }}>
      {sticky}
    </section>
  );
}
