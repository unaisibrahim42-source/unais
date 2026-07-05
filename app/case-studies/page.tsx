import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Case Studies | Elevate Creative Media",
  description:
    "Real results from Elevate Creative Media's brand strategy, content, and growth campaigns.",
};

const CASE_STUDIES = [
  {
    client: "Northpeak Apparel",
    tag: "Brand + Launch Campaign",
    result: "+240%",
    resultLabel: "Engagement",
    summary:
      "A full streetwear rebrand paired with a content-led launch campaign that sold through initial inventory in 48 hours.",
  },
  {
    client: "Vela Wellness",
    tag: "Content + Social",
    result: "+3.1M",
    resultLabel: "Organic Reach",
    summary:
      "A short-form content engine and always-on social strategy that took a regional DTC brand national in one year.",
  },
  {
    client: "Atlas Fitness",
    tag: "Paid Media + Funnel",
    result: "+68%",
    resultLabel: "New Members",
    summary:
      "Full-funnel paid social and creative testing program rebuilt from the ground up across five locations.",
  },
  {
    client: "Monarch Beauty",
    tag: "Influencer + Partnerships",
    result: "4.8x",
    resultLabel: "ROAS",
    summary:
      "Creator-led launch strategy that paired seeded partnerships with paid amplification for a debut product line.",
  },
  {
    client: "Flux Audio",
    tag: "Web + Digital Design",
    result: "+92%",
    resultLabel: "Conversion Rate",
    summary:
      "A redesigned e-commerce experience and landing page system built to convert the traffic their content was already earning.",
  },
  {
    client: "Orbit & Co",
    tag: "Full-Service Growth",
    result: "120+",
    resultLabel: "Markets Reached",
    summary:
      "End-to-end brand, content, and growth partnership scaling a single-market brand into a global presence.",
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Proof, Not Promises"
        title={
          <>
            RESULTS THAT
            <br />
            SPEAK FOR <span className="text-accent">THEMSELVES</span>
          </>
        }
        description="A selection of brands we've helped go from overlooked to unmissable. Every number below is a campaign we ran, not a stock photo."
      />

      <section className="py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {CASE_STUDIES.map((study) => (
              <article
                key={study.client}
                className="flex flex-col justify-between rounded-2xl border border-white/10 p-8 transition-colors hover:border-accent/60"
              >
                <div>
                  <span className="font-display text-xs tracking-[0.2em] text-white/40">
                    {study.tag}
                  </span>
                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="font-display text-4xl text-accent">
                      {study.result}
                    </span>
                    <span className="text-xs tracking-wide text-white/50">
                      {study.resultLabel}
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-2xl tracking-wide text-white">
                    {study.client}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">
                    {study.summary}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        eyebrow="Your Brand Could Be Next"
        title="LET'S BUILD YOUR CASE STUDY"
        subtitle="Every result above started with a single conversation. Let's have ours."
        buttonLabel="Start a Project"
      />
    </>
  );
}
