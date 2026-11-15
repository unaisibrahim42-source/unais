import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProperty, getPropertySlugs } from "@/lib/properties";
import { formatPrice } from "@/lib/format";
import { Walkthrough } from "@/components/walkthrough/Walkthrough";

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
    openGraph: cover ? { images: [`${cover.image.base}-1600.webp`] } : undefined,
  };
}

export default async function PropertyPage(props: PageProps<"/properties/[slug]">) {
  const { slug } = await props.params;
  const p = getProperty(slug);
  if (!p) notFound();
  const { details: d, walkthrough: w } = p;

  return (
    <main>
      <Walkthrough
        scenes={w.scenes}
        video={w.video}
        intro={
          <div className="w-full bg-gradient-to-t from-black/50 to-transparent px-5 pt-40 pb-32 text-white sm:px-10 sm:pb-36">
            <p className="mb-4 text-[11px] tracking-[0.28em] text-white/75 uppercase">
              {d.status ?? "For sale"} · {d.location}
            </p>
            <h1 className="max-w-4xl font-display text-5xl leading-[0.95] font-light sm:text-7xl lg:text-8xl">{d.title}</h1>
            <p className="mt-5 font-display text-2xl text-white/90 sm:text-3xl">{formatPrice(d)}</p>
            <p className="mt-10 flex items-center gap-3 text-[11px] tracking-[0.28em] text-white/75 uppercase">
              <span className="inline-block h-8 w-px animate-pulse bg-white/70" /> Scroll to step inside
            </p>
          </div>
        }
      />

      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-10">
        <dl className="grid grid-cols-2 gap-y-8 border-y border-line py-10 sm:grid-cols-4">
          {[
            ["Price", formatPrice(d)],
            ["Bedrooms", d.beds],
            ["Bathrooms", d.baths],
            ["Size", `${d.sqft.toLocaleString()} sq ft`],
          ].map(([k, v]) => (
            <div key={k as string}>
              <dt className="text-[11px] tracking-[0.2em] text-muted uppercase">{k}</dt>
              <dd className="mt-2 font-display text-3xl">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-12 max-w-2xl text-lg leading-relaxed whitespace-pre-line text-ink/80">{d.description}</p>
      </section>
    </main>
  );
}
