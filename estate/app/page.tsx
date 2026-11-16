import Link from "next/link";
import { getProperties } from "@/lib/properties";
import { toCard } from "@/lib/cards";
import { site } from "@/site.config";
import { formatPrice } from "@/lib/format";
import { Walkthrough } from "@/components/walkthrough/Walkthrough";
import { PropertyCard } from "@/components/PropertyCard";

export default function Home() {
  const properties = getProperties();
  const featured = properties.find((p) => p.details.featured) ?? properties[0];
  const listings = properties.map(toCard);

  return (
    <main>
      {/* Hero: the featured home playing as a looping cinematic walkthrough */}
      {featured && (
        <section data-header="dark" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink">
          <div className="absolute inset-0">
            <Walkthrough scenes={featured.walkthrough.scenes} mode="autoplay" secondsPerScene={5.5} showCaptions={false} showProgress={false} className="h-full w-full" />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/25" />
          <div className="absolute inset-x-0 bottom-0 px-5 pb-12 text-white sm:px-10 sm:pb-16">
            <div className="mx-auto flex max-w-[1600px] flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
              <h1 className="max-w-4xl font-display text-[13vw] leading-[0.92] font-light sm:text-7xl lg:text-[7.5rem]">
                Homes,
                <br />
                <em className="font-light">seen properly.</em>
              </h1>
              <Link
                href={`/properties/${featured.slug}`}
                className="glass group block max-w-sm rounded-2xl p-5 transition-transform hover:-translate-y-1 sm:p-6"
              >
                <p className="text-[10px] tracking-[0.24em] text-white/70 uppercase">Featured · {featured.details.location}</p>
                <p className="mt-2 font-display text-2xl leading-tight">{featured.details.title}</p>
                <p className="mt-3 flex items-center justify-between text-sm text-white/85">
                  {formatPrice(featured.details)}
                  <span className="text-[10px] tracking-[0.24em] uppercase transition-transform group-hover:translate-x-1">Step inside →</span>
                </p>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Agency intro */}
      <section className="mx-auto max-w-[1600px] px-5 py-28 sm:px-10 sm:py-40">
        <div className="grid gap-16 lg:grid-cols-[1fr_2fr]">
          <p className="text-[11px] tracking-[0.24em] text-muted uppercase" data-reveal>{site.name}</p>
          <div data-reveal>
            <p className="font-display text-3xl leading-snug font-light sm:text-5xl sm:leading-[1.15]">
              We present every home as a film, not a slideshow — so buyers walk through it, room by room, before they ever visit.
            </p>
            <div className="mt-14 grid gap-10 text-ink/75 sm:grid-cols-3" data-reveal="stagger">
              {[
                ["Cinematic", "Each listing becomes a scroll-driven walkthrough with real depth, generated from its photographs."],
                ["Discreet", "Many of our homes change hands privately. Register to hear about them first."],
                ["Considered", "A small team, a short list of homes, and the time to market each one properly."],
              ].map(([t, b]) => (
                <div key={t}>
                  <p className="mb-3 font-display text-2xl text-ink">{t}</p>
                  <p className="leading-relaxed">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-10 sm:py-32">
          <div className="mb-14 flex items-end justify-between gap-6" data-reveal>
            <h2 className="font-display text-5xl font-light sm:text-6xl">Current homes</h2>
            <Link href="/listings" className="shrink-0 text-[11px] tracking-[0.22em] uppercase hover:text-accent">View all →</Link>
          </div>
          <div className="grid gap-x-8 gap-y-16 lg:grid-cols-2" data-reveal="stagger">
            {listings.slice(0, 4).map((l) => (
              <PropertyCard key={l.slug} p={l} large />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand text-paper">
        <div className="mx-auto flex max-w-[1600px] flex-col items-start gap-10 px-5 py-24 sm:px-10 sm:py-32 lg:flex-row lg:items-end lg:justify-between" data-reveal>
          <h2 className="max-w-3xl font-display text-4xl leading-tight font-light sm:text-6xl">Thinking of selling? Let us show your home the way you see it.</h2>
          <Link href="/contact" className="shrink-0 rounded-full border border-paper/40 px-8 py-4 text-[11px] tracking-[0.22em] uppercase transition-colors hover:bg-paper hover:text-brand">
            Request a valuation
          </Link>
        </div>
      </section>
    </main>
  );
}
