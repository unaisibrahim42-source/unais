import type { Metadata } from "next";
import Link from "next/link";
import { getProperties } from "@/lib/properties";
import { site } from "@/site.config";
import { Picture } from "@/components/Picture";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  const scenes = getProperties().flatMap((p) => p.walkthrough.scenes);
  const hero = scenes.find((s) => s.label === "living") ?? scenes[0];
  const second = scenes.find((s) => s.label === "bedroom") ?? scenes[1];

  return (
    <main>
      <section className="mx-auto max-w-[1600px] px-5 pt-36 sm:px-10 sm:pt-48">
        <p className="mb-6 text-[11px] tracking-[0.24em] text-muted uppercase">About {site.name}</p>
        <h1 className="max-w-5xl font-display text-6xl leading-[0.95] font-light sm:text-8xl">
          A small agency for <em>remarkable</em> homes.
        </h1>
      </section>

      {hero && (
        <section className="mt-20 px-5 sm:px-10" data-reveal>
          <Picture scene={hero} priority sizes="100vw" className="block aspect-[16/9] overflow-hidden sm:aspect-[21/9]" imgClassName="h-full w-full object-cover" />
        </section>
      )}

      <section className="mx-auto grid max-w-[1600px] gap-16 px-5 py-28 sm:px-10 sm:py-40 lg:grid-cols-[1fr_1.4fr]">
        <p className="text-[11px] tracking-[0.24em] text-muted uppercase" data-reveal>Our approach</p>
        <div className="space-y-8 text-lg leading-relaxed text-ink/75" data-reveal>
          <p className="font-display text-3xl leading-snug font-light text-ink sm:text-4xl">
            Buyers decide how a home feels long before they visit. So we spend our time on how it&rsquo;s seen.
          </p>
          <p>
            Every home we take on is photographed, then turned into a cinematic walkthrough: a slow, gimbal-smooth film that moves through the rooms in the order you&rsquo;d walk them, with real depth from the photographs themselves.
          </p>
          <p>
            We keep our list short so each home gets our full attention — from the first valuation to the day the keys change hands. This text is placeholder copy; replace it with the agency&rsquo;s own story.
          </p>
        </div>
      </section>

      <section className="border-y border-line">
        <dl className="mx-auto grid max-w-[1600px] grid-cols-2 gap-10 px-5 py-20 sm:px-10 lg:grid-cols-4" data-reveal="stagger">
          {[
            ["18", "Years in prime London"],
            ["£1.2bn", "Sold & let"],
            ["94%", "Asking price achieved"],
            ["11", "Days to offer, on average"],
          ].map(([v, k]) => (
            <div key={k}>
              <dd className="font-display text-5xl font-light sm:text-6xl">{v}</dd>
              <dt className="mt-3 text-[11px] tracking-[0.2em] text-muted uppercase">{k}</dt>
            </div>
          ))}
        </dl>
        <p className="mx-auto max-w-[1600px] px-5 pb-8 text-xs text-muted sm:px-10">Placeholder figures.</p>
      </section>

      <section className="mx-auto grid max-w-[1600px] items-center gap-16 px-5 py-28 sm:px-10 sm:py-40 lg:grid-cols-2">
        {second && (
          <div data-reveal>
            <Picture scene={second} sizes="(min-width: 1024px) 50vw, 100vw" className="block aspect-[4/5] overflow-hidden" imgClassName="h-full w-full object-cover" />
          </div>
        )}
        <div data-reveal>
          <h2 className="font-display text-5xl leading-tight font-light">Selling or letting?</h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/75">
            We&rsquo;ll visit, advise on price and presentation, and show you how your home would look as a walkthrough — with no obligation.
          </p>
          <Link href="/contact" className="mt-10 inline-block rounded-full bg-brand px-8 py-4 text-[11px] tracking-[0.22em] text-paper uppercase transition-colors hover:bg-ink">
            Arrange a valuation
          </Link>
        </div>
      </section>
    </main>
  );
}
