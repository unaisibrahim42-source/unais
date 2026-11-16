"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ListingCard } from "@/lib/listing";
import { Picture } from "./Picture";
import { Walkthrough } from "./walkthrough/Walkthrough";

/**
 * A listing card. Hovering (or focusing) mounts a short autoplaying
 * walkthrough over the cover photo. Only the hovered card holds a WebGL
 * context, so a long grid stays light.
 */
export function PropertyCard({ p, large = false }: { p: ListingCard; large?: boolean }) {
  const [hover, setHover] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    const raf = requestAnimationFrame(update);
    mq.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", update);
    };
  }, []);

  // Keep the preview mounted briefly after leaving so it can fade out.
  useEffect(() => {
    if (hover) {
      const t = setTimeout(() => setMounted(true), 0);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setMounted(false), 700);
    return () => clearTimeout(t);
  }, [hover]);

  const on = () => canHover && setHover(true);
  const off = () => setHover(false);

  return (
    <Link
      href={`/properties/${p.slug}`}
      className="group block"
      onMouseEnter={on}
      onMouseLeave={off}
      onFocus={on}
      onBlur={off}
    >
      <div className={`relative overflow-hidden bg-line ${large ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
        <Picture
          scene={p.scenes[0]}
          sizes={large ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className="block h-full w-full"
          imgClassName="h-full w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.03]"
        />
        {mounted && (
          <div className={`absolute inset-0 transition-opacity duration-700 ${hover ? "opacity-100" : "opacity-0"}`}>
            <Walkthrough scenes={p.scenes} mode="autoplay" secondsPerScene={2.6} showCaptions={false} showProgress={false} className="h-full w-full" />
          </div>
        )}
        <span className="absolute top-4 left-4 rounded-full bg-paper/90 px-3 py-1.5 text-[10px] tracking-[0.2em] text-ink uppercase backdrop-blur">
          {p.status}
        </span>
        {canHover && (
          <span className="absolute right-4 bottom-4 flex items-center gap-2 text-[10px] tracking-[0.2em] text-white uppercase opacity-0 transition-opacity duration-500 group-hover:opacity-100 [text-shadow:0_1px_8px_rgba(0,0,0,.5)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Walkthrough
          </span>
        )}
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <p className="text-[11px] tracking-[0.2em] text-muted uppercase">{p.location}</p>
          <h3 className={`mt-2 font-display leading-tight transition-colors group-hover:text-accent ${large ? "text-3xl sm:text-4xl" : "text-2xl"}`}>{p.title}</h3>
          <p className="mt-2 text-sm text-muted">
            {p.beds} bed · {p.baths} bath · {p.sqft.toLocaleString()} sq ft
          </p>
        </div>
        <p className="shrink-0 font-display text-xl sm:text-2xl">{p.priceLabel}</p>
      </div>
    </Link>
  );
}
