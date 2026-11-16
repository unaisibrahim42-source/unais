import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProperties, getProperty, getPropertySlugs } from "@/lib/properties";
import { formatPrice } from "@/lib/format";
import { toCard } from "@/lib/cards";
import { Walkthrough } from "@/components/walkthrough/Walkthrough";
import { Gallery } from "@/components/Gallery";
import { EnquiryForm } from "@/components/EnquiryForm";
import { MapEmbed } from "@/components/MapEmbed";
import { PropertyCard } from "@/components/PropertyCard";

export function generateStaticParams() {
  return getPropertySlugs().map((slug) => ({ slug }));
}
export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/properties/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = getProperty(slug);
  if (!p) return {};
  const cover = p.walkthrough.scenes[0];
  return {
    title: p.details.title,
    description: p.details.summary ?? p.details.description.slice(0, 160),
    openGraph: cover ? { images: [`${cover.image.base}-${cover.image.widths.at(-1)}.webp`] } : undefined,
  };
}

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-6 text-[11px] tracking-[0.24em] text-muted uppercase">{children}</p>
);

export default async function PropertyPage(props: PageProps<"/properties/[slug]">) {
  const { slug } = await props.params;
  const p = getProperty(slug);
  if (!p) notFound();
  const { details: d, walkthrough: w } = p;
  const price = formatPrice(d);
  const others = getProperties().filter((o) => o.slug !== slug).slice(0, 2).map(toCard);
  const initials = d.agent.name.split(" ").map((s) => s[0]).join("").slice(0, 2);

  return (
    <main>
      <div data-header="dark">
        <Walkthrough
          scenes={w.scenes}
          video={w.video}
          intro={
            <div className="w-full bg-gradient-to-t from-black/50 to-transparent px-5 pt-40 pb-32 text-white sm:px-10 sm:pb-36">
              <p className="mb-4 text-[11px] tracking-[0.28em] text-white/75 uppercase">
                {d.status ?? "For sale"} · {d.location}
              </p>
              <h1 className="max-w-4xl font-display text-5xl leading-[0.95] font-light sm:text-7xl lg:text-8xl">{d.title}</h1>
              <p className="mt-5 font-display text-2xl text-white/90 sm:text-3xl">{price}</p>
              <p className="mt-10 flex items-center gap-3 text-[11px] tracking-[0.28em] text-white/75 uppercase">
                <span className="inline-block h-8 w-px animate-pulse bg-white/70" /> Scroll to step inside
              </p>
            </div>
          }
        />
      </div>

      {/* Key facts — sticks under the header while reading */}
      <div className="sticky top-[65px] z-40 border-b border-line bg-paper/90 backdrop-blur-md sm:top-[77px]">
        <div className="mx-auto flex max-w-[1600px] items-center gap-6 overflow-x-auto px-5 py-4 whitespace-nowrap sm:gap-12 sm:px-10">
          <p className="font-display text-2xl sm:text-3xl">{price}</p>
          {[
            [d.beds, d.beds === 1 ? "Bed" : "Beds"],
            [d.baths, d.baths === 1 ? "Bath" : "Baths"],
            [d.sqft.toLocaleString(), "Sq ft"],
          ].map(([v, k]) => (
            <p key={k as string} className="flex items-baseline gap-2">
              <span className="font-display text-2xl">{v}</span>
              <span className="text-[10px] tracking-[0.2em] text-muted uppercase">{k}</span>
            </p>
          ))}
          <a href="#enquire" className="ml-auto rounded-full bg-brand px-6 py-3 text-[10px] tracking-[0.22em] text-paper uppercase transition-colors hover:bg-ink">
            Book a viewing
          </a>
        </div>
      </div>

      {/* Description + features */}
      <section className="mx-auto grid max-w-[1600px] gap-16 px-5 py-24 sm:px-10 sm:py-32 lg:grid-cols-[1.4fr_1fr] lg:gap-24">
        <div data-reveal>
          <Eyebrow>The home</Eyebrow>
          {d.summary && <p className="mb-10 max-w-3xl font-display text-3xl leading-snug font-light sm:text-4xl">{d.summary}</p>}
          <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-ink/75">
            {d.description.split(/\n\s*\n/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
        <div data-reveal>
          <Eyebrow>Features</Eyebrow>
          <ul className="divide-y divide-line border-y border-line">
            {d.features.map((f) => (
              <li key={f} className="flex items-center gap-4 py-4">
                <span className="h-1 w-1 rounded-full bg-accent" />
                {f}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-muted">{d.address ?? d.location}</p>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-[1600px] px-5 pb-24 sm:px-10 sm:pb-32">
        <div className="flex items-end justify-between" data-reveal>
          <Eyebrow>Gallery · {w.scenes.length} photographs</Eyebrow>
        </div>
        <Gallery scenes={w.scenes} />
      </section>

      {/* Floor plan */}
      {w.floorplan && (
        <section className="border-t border-line bg-white/60">
          <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-10 sm:py-32" data-reveal>
            <Eyebrow>Floor plan</Eyebrow>
            <a href={w.floorplan} target="_blank" rel="noreferrer" className="block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={w.floorplan} alt={`Floor plan of ${d.title}`} className="mx-auto max-h-[80vh] w-auto" loading="lazy" />
            </a>
            <p className="mt-6 text-center text-xs text-muted">Approximate gross internal area {d.sqft.toLocaleString()} sq ft. For illustration only.</p>
          </div>
        </section>
      )}

      {/* Location */}
      <section className="mx-auto max-w-[1600px] px-5 py-24 sm:px-10 sm:py-32">
        <div data-reveal>
          <Eyebrow>Location</Eyebrow>
          <h2 className="mb-10 font-display text-4xl font-light sm:text-5xl">{d.location}</h2>
          <MapEmbed lat={d.lat} lng={d.lng} label={d.location} />
        </div>
      </section>

      {/* Enquiry */}
      <section id="enquire" className="scroll-mt-40 border-t border-line">
        <div className="mx-auto grid max-w-[1600px] gap-16 px-5 py-24 sm:px-10 sm:py-32 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
          <div data-reveal>
            <Eyebrow>Arrange a viewing</Eyebrow>
            <h2 className="font-display text-4xl leading-tight font-light sm:text-5xl">See it in person.</h2>
            <div className="mt-12 flex items-center gap-5">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-brand font-display text-xl text-paper">{initials}</span>
              <div>
                <p className="font-display text-2xl">{d.agent.name}</p>
                {d.agent.role && <p className="text-sm text-muted">{d.agent.role}</p>}
              </div>
            </div>
            <div className="mt-6 space-y-1 text-sm">
              <a className="block hover:text-accent" href={`tel:${d.agent.phone.replace(/\s/g, "")}`}>{d.agent.phone}</a>
              <a className="block hover:text-accent" href={`mailto:${d.agent.email}?subject=${encodeURIComponent(d.title)}`}>{d.agent.email}</a>
            </div>
          </div>
          <div data-reveal>
            <EnquiryForm property={{ slug, title: d.title }} />
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-10 sm:py-32">
            <div className="mb-12 flex items-end justify-between">
              <h2 className="font-display text-4xl font-light">More homes</h2>
              <Link href="/listings" className="text-[11px] tracking-[0.22em] uppercase hover:text-accent">All properties →</Link>
            </div>
            <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2" data-reveal="stagger">
              {others.map((o) => (
                <PropertyCard key={o.slug} p={o} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
