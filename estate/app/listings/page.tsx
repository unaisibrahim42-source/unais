import type { Metadata } from "next";
import { getProperties } from "@/lib/properties";
import { toCard } from "@/lib/cards";
import { ListingsGrid } from "@/components/ListingsGrid";

export const metadata: Metadata = { title: "Properties" };

export default function ListingsPage() {
  const listings = getProperties().map(toCard);
  return (
    <main className="mx-auto max-w-[1600px] px-5 pt-36 pb-28 sm:px-10 sm:pt-48">
      <p className="mb-6 text-[11px] tracking-[0.24em] text-muted uppercase">Properties</p>
      <h1 className="mb-14 max-w-4xl font-display text-6xl leading-[0.95] font-light sm:text-8xl">
        Homes for sale <em>&amp;</em> to let
      </h1>
      <ListingsGrid listings={listings} />
    </main>
  );
}
