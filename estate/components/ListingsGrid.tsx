"use client";

import { useMemo, useState } from "react";
import type { ListingCard } from "@/lib/listing";
import { PropertyCard } from "./PropertyCard";

const PRICE_BANDS = {
  sale: [
    { label: "Any price", min: 0, max: Infinity },
    { label: "Up to £1m", min: 0, max: 1_000_000 },
    { label: "£1m – £2m", min: 1_000_000, max: 2_000_000 },
    { label: "£2m – £5m", min: 2_000_000, max: 5_000_000 },
    { label: "£5m+", min: 5_000_000, max: Infinity },
  ],
  let: [
    { label: "Any price", min: 0, max: Infinity },
    { label: "Up to £3,000 pcm", min: 0, max: 3000 },
    { label: "£3,000 – £6,000 pcm", min: 3000, max: 6000 },
    { label: "£6,000+ pcm", min: 6000, max: Infinity },
  ],
};

const select =
  "appearance-none rounded-full border border-line bg-paper py-3 pr-10 pl-5 text-[11px] tracking-[0.16em] uppercase focus:border-ink focus:outline-none bg-[length:10px] bg-[right_1.1rem_center] bg-no-repeat";
const chevron = { backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%23666' stroke-width='1.2'/%3E%3C/svg%3E\")" };

export function ListingsGrid({ listings }: { listings: ListingCard[] }) {
  const [mode, setMode] = useState<"all" | "sale" | "let">("all");
  const [band, setBand] = useState(0);
  const [beds, setBeds] = useState(0);
  const [location, setLocation] = useState("");

  const isLet = (l: ListingCard) => /let|rent/i.test(l.status);
  const areas = useMemo(() => [...new Set(listings.map((l) => l.location.split(",")[0].trim()))].sort(), [listings]);
  const bands = mode === "let" ? PRICE_BANDS.let : PRICE_BANDS.sale;

  const filtered = listings.filter((l) => {
    if (mode === "sale" && isLet(l)) return false;
    if (mode === "let" && !isLet(l)) return false;
    if (mode !== "all" && band) {
      const b = bands[band];
      if (l.price < b.min || l.price >= b.max) return false;
    }
    if (beds && l.beds < beds) return false;
    if (location && !l.location.startsWith(location)) return false;
    return true;
  });

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 border-y border-line py-5">
        <div className="inline-flex rounded-full border border-line p-1 text-[11px] tracking-[0.16em] uppercase">
          {(["all", "sale", "let"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setBand(0);
              }}
              className={`rounded-full px-4 py-2 transition-colors ${mode === m ? "bg-ink text-paper" : "text-muted hover:text-ink"}`}
            >
              {m === "all" ? "All" : m === "sale" ? "Buy" : "Rent"}
            </button>
          ))}
        </div>
        <label>
          <span className="sr-only">Price</span>
          <select className={select} style={chevron} value={band} onChange={(e) => setBand(+e.target.value)} disabled={mode === "all"} title={mode === "all" ? "Choose Buy or Rent to filter by price" : undefined}>
            {bands.map((b, i) => (
              <option key={b.label} value={i}>{mode === "all" && i === 0 ? "Price (choose Buy / Rent)" : b.label}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Bedrooms</span>
          <select className={select} style={chevron} value={beds} onChange={(e) => setBeds(+e.target.value)}>
            <option value={0}>Any beds</option>
            {[1, 2, 3, 4, 5].map((b) => (
              <option key={b} value={b}>{b}+ beds</option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Location</span>
          <select className={select} style={chevron} value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">All areas</option>
            {areas.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </label>
        <p className="ml-auto text-[11px] tracking-[0.16em] text-muted uppercase">
          {filtered.length} {filtered.length === 1 ? "property" : "properties"}
        </p>
      </div>

      {filtered.length ? (
        <div className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l) => (
            <PropertyCard key={l.slug} p={l} />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center">
          <p className="font-display text-3xl font-light">Nothing matches — yet.</p>
          <p className="mt-3 text-muted">Many of our homes are sold off-market. Tell us what you&rsquo;re looking for.</p>
        </div>
      )}
    </>
  );
}
