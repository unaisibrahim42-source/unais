import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Grow | Elevate Creative Media",
  description:
    "The Elevate growth engine: how we take brands from overlooked to unmissable through strategy, content, and performance media.",
};

const PROCESS = [
  {
    step: "01",
    title: "Audit & Strategy",
    description:
      "We dig into your brand, audience, and category to find the gap between where you are and where attention lives.",
  },
  {
    step: "02",
    title: "Build & Produce",
    description:
      "Our team builds the creative, content, and campaign infrastructure needed to show up consistently and distinctly.",
  },
  {
    step: "03",
    title: "Launch & Amplify",
    description:
      "We launch across owned, earned, and paid channels — layering media spend on what's already proven to convert.",
  },
  {
    step: "04",
    title: "Measure & Scale",
    description:
      "Every campaign is tracked against real business metrics, then scaled, cut, or iterated based on performance.",
  },
];

const CHANNELS = [
  { title: "Paid Social", metric: "Meta, TikTok, Snap" },
  { title: "Search & SEO", metric: "Google, Bing" },
  { title: "Influencer & Creator", metric: "Seeding & Partnerships" },
  { title: "Email & CRM", metric: "Lifecycle & Retention" },
  { title: "Content & Organic", metric: "Short-form & Long-form" },
  { title: "Web & Landing Pages", metric: "Conversion Optimization" },
];

const RESULTS = [
  { value: "3-6x", label: "Average ROAS across active campaigns" },
  { value: "45 Days", label: "Typical time to first measurable lift" },
  { value: "$40M+", label: "Media spend managed to date" },
];

export default function GrowPage() {
  return (
    <>
      <PageHero
        eyebrow="The Growth Engine"
        title={
          <>
            ATTENTION IS EARNED.
            <br />
            <span className="text-accent">GROWTH</span> IS ENGINEERED.
          </>
        }
        description="Grow is our performance methodology — the system we run behind every brand, content, and media engagement to turn visibility into revenue."
      />

      <section className="py-24">
        <Container>
          <span className="font-display text-sm tracking-[0.3em] text-accent">
            How It Works
          </span>
          <h2 className="mt-4 font-display text-4xl leading-none text-white sm:text-5xl">
            A FOUR-STEP SYSTEM
          </h2>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((item) => (
              <div key={item.step} className="bg-black p-8">
                <span className="font-display text-3xl text-white/20">
                  {item.step}
                </span>
                <h3 className="mt-4 font-display text-xl tracking-wide text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/10 py-24">
        <Container>
          <span className="font-display text-sm tracking-[0.3em] text-accent">
            Where We Play
          </span>
          <h2 className="mt-4 font-display text-4xl leading-none text-white sm:text-5xl">
            CHANNELS WE RUN
          </h2>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CHANNELS.map((channel) => (
              <div
                key={channel.title}
                className="rounded-2xl border border-white/10 p-6 transition-colors hover:border-accent/60"
              >
                <h3 className="font-display text-lg tracking-wide text-white">
                  {channel.title}
                </h3>
                <p className="mt-2 text-sm text-white/50">{channel.metric}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/10 py-24">
        <Container className="grid gap-10 sm:grid-cols-3">
          {RESULTS.map((result) => (
            <div key={result.label} className="text-center sm:text-left">
              <div className="font-display text-5xl text-accent">
                {result.value}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                {result.label}
              </p>
            </div>
          ))}
        </Container>
      </section>

      <CTASection
        eyebrow="Ready To Scale?"
        title="LET'S ENGINEER YOUR GROWTH"
        subtitle="Bring us your numbers. We'll show you exactly where the growth engine plugs in."
      />
    </>
  );
}
