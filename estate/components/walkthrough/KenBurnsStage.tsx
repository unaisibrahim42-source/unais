"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import type { Scene } from "@/lib/types";
import { srcSet } from "@/lib/types";
import type { Frame, RoomCam } from "./timeline";

export interface KenBurnsHandle {
  render(f: Frame): void;
}

/**
 * Fallback renderer (no WebGL, or prefers-reduced-motion): layered <img>s
 * with Ken Burns transforms and crossfades, driven by the same timeline.
 */
export const KenBurnsStage = forwardRef<KenBurnsHandle, { scenes: Scene[]; reduced: boolean; eager?: boolean }>(
  function KenBurnsStage({ scenes, reduced, eager }, ref) {
    const imgs = useRef<(HTMLImageElement | null)[]>([]);
    const leak = useRef<HTMLDivElement>(null);
    const prev = useRef<number[]>([]);

    useImperativeHandle(ref, () => ({
      render(f) {
        const set = (i: number, cam: RoomCam | null, opacity: number) => {
          const el = imgs.current[i];
          if (!el) return;
          if (!cam || opacity <= 0) {
            if (prev.current[i] !== 0) el.style.opacity = "0";
            prev.current[i] = 0;
            return;
          }
          const z = reduced ? 1.04 : Math.min(cam.zoom, 2.6);
          const cx = reduced ? 0.5 : cam.center.x;
          const cy = reduced ? 0.5 : cam.center.y;
          el.style.opacity = String(opacity);
          el.style.transformOrigin = `${cx * 100}% ${cy * 100}%`;
          el.style.transform = `translate3d(${(0.5 - cx) * 100}%, ${(0.5 - cy) * 100}%, 0) scale(${z})`;
          prev.current[i] = opacity;
        };
        scenes.forEach((_, i) => {
          if (i === f.index) set(i, f.a, 1);
          else if (f.b && i === f.b.index) set(i, f.b, f.mix);
          else set(i, null, 0);
        });
        if (leak.current) leak.current.style.opacity = String(reduced ? 0 : f.leak * 0.7);
      },
    }));

    return (
      <div className="absolute inset-0 overflow-hidden bg-paper">
        {scenes.map((s, i) => (
          <picture key={s.id}>
            <source type="image/avif" srcSet={srcSet(s, "avif")} sizes="100vw" />
            <img
              ref={(el) => {
                imgs.current[i] = el;
              }}
              src={`${s.image.base}-${s.image.widths[Math.min(1, s.image.widths.length - 1)]}.webp`}
              srcSet={srcSet(s)}
              sizes="100vw"
              alt={s.caption.title}
              loading={eager || i < 2 ? "eager" : "lazy"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
              style={{ opacity: i === 0 ? 1 : 0, transition: reduced ? "opacity 0.6s ease" : undefined }}
            />
          </picture>
        ))}
        <div
          ref={leak}
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen"
          style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,214,160,0.95), rgba(255,190,120,0.35) 35%, transparent 70%)" }}
        />
      </div>
    );
  },
);
