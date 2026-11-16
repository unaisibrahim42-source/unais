"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Scene } from "@/lib/types";
import { Picture } from "./Picture";
import { getLenis } from "./SmoothScroll";

export function Gallery({ scenes }: { scenes: Scene[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);
  const n = scenes.length;
  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + n) % n)), [n]);

  useEffect(() => {
    if (open === null) return;
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [open, go]);

  // Editorial layout: a large lead image, then an even grid.
  return (
    <>
      <div className="grid grid-flow-dense grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4" data-reveal="stagger">
        {scenes.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setOpen(i)}
            className={`group relative overflow-hidden bg-line ${i === 0 ? "col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto" : "aspect-[4/3]"}`}
            aria-label={`Open photo: ${s.caption.title}`}
          >
            <Picture
              scene={s}
              sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
              imgClassName="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
              className="absolute inset-0 block h-full w-full"
            />
            <span className="absolute bottom-3 left-3 text-[10px] tracking-[0.2em] text-white uppercase opacity-0 transition-opacity duration-500 group-hover:opacity-100 [text-shadow:0_1px_8px_rgba(0,0,0,.5)]">
              {s.caption.title}
            </span>
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery"
          className="fixed inset-0 z-[100] flex flex-col bg-[#0d0c0a]/97 text-white"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <div className="flex items-center justify-between px-5 py-4 text-[11px] tracking-[0.22em] uppercase sm:px-8">
            <span className="text-white/60">
              {String(open + 1).padStart(2, "0")} / {String(n).padStart(2, "0")} · {scenes[open].caption.title}
            </span>
            <button type="button" onClick={() => setOpen(null)} className="p-2 text-white/80 hover:text-white">
              Close ✕
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-20">
            <Picture
              key={scenes[open].id}
              scene={scenes[open]}
              sizes="100vw"
              priority
              className="block max-h-full"
              imgClassName="max-h-[calc(100svh-120px)] w-auto max-w-full object-contain animate-[fadein_.5s_ease]"
            />
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-2 hidden p-4 text-3xl text-white/60 hover:text-white sm:block">
              ←
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute right-2 hidden p-4 text-3xl text-white/60 hover:text-white sm:block">
              →
            </button>
          </div>
          <div className="flex justify-center gap-2 overflow-x-auto px-5 py-4">
            {scenes.map((s, i) => (
              <button key={s.id} type="button" onClick={() => setOpen(i)} className={`h-12 w-16 shrink-0 overflow-hidden transition-opacity ${i === open ? "opacity-100 ring-1 ring-white" : "opacity-40 hover:opacity-80"}`}>
                <Picture scene={s} sizes="64px" className="block h-full w-full" imgClassName="h-full w-full object-cover" alt="" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
