import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import ContentLabTool from "@/components/ContentLabTool";
import { FUNNEL_INFO } from "@/lib/content-lab";

export const metadata: Metadata = {
  title: "Content Lab | Zezu x Elevate Creative Media",
  description:
    "Reference video database, Zezu concept generator, and viral pattern breakdown — built for short-form content that's engineered to perform.",
};

const FUNNEL_STAGES = ["TOFU", "MOFU", "BOFU"] as const;

export default function ContentLabPage() {
  return (
    <>
      <PageHero
        eyebrow="Zezu Content Lab"
        title={
          <>
            Reverse-Engineer <span className="text-accent">Virality</span>,
            <br />
            Every Time You Post
          </>
        }
        description="Drop in reference videos from anywhere, save them to the database, and generate a Zezu-ready concept — hook, full shot list, on-screen captions, and CTA — classified by where it sits in the funnel."
      />

      <section className="border-b border-white/10 py-16 sm:py-20">
        <Container>
          <span className="font-display text-sm tracking-[0.3em] text-accent">
            The Framework
          </span>
          <h2 className="mt-3 max-w-3xl font-display text-3xl text-white sm:text-4xl">
            Every Idea Gets Mapped To A Funnel Stage
          </h2>
          <p className="mt-4 max-w-2xl text-white/60">
            Not every video should be selling. TOFU content earns reach, MOFU
            content builds desire, and BOFU content converts — mixing them up
            is why some accounts post constantly and still don&apos;t grow.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {FUNNEL_STAGES.map((stage) => (
              <div
                key={stage}
                className="rounded-xl border-2 border-accent/50 bg-black p-6"
              >
                <span className="font-display text-xl text-accent">{stage}</span>
                <p className="mt-2 font-display text-sm tracking-wide text-white">
                  {FUNNEL_INFO[stage].goal}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  {FUNNEL_INFO[stage].description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <ContentLabTool />
        </Container>
      </section>
    </>
  );
}
