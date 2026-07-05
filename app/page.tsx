import Link from "next/link";
import Container from "@/components/Container";
import Button from "@/components/Button";
import HeroOrbit from "@/components/HeroOrbit";
import CTASection from "@/components/CTASection";

const STATS = [
  { value: "120+", label: "Brands Elevated" },
  { value: "3.2M", label: "Followers Grown" },
  { value: "48", label: "Countries Reached" },
  { value: "5x", label: "Avg. Engagement Lift" },
];

const SERVICES = [
  {
    title: "Brand Strategy",
    description:
      "Positioning, identity, and messaging that gives you a reason to be remembered.",
  },
  {
    title: "Content Production",
    description:
      "Scroll-stopping photo, video, and campaign content built for every platform.",
  },
  {
    title: "Growth & Paid Media",
    description:
      "Performance-driven media buying and funnels that turn attention into revenue.",
  },
  {
    title: "Social Management",
    description:
      "Always-on community, content calendars, and channel strategy that compounds.",
  },
];

const CASE_STUDIES = [
  {
    client: "Northpeak Apparel",
    result: "+240% Engagement",
    summary: "A streetwear rebrand and launch campaign that sold out in 48 hours.",
  },
  {
    client: "Vela Wellness",
    result: "+3.1M Reach",
    summary: "Short-form content engine that took a DTC brand from local to national.",
  },
  {
    client: "Atlas Fitness",
    result: "+68% Membership",
    summary: "Full-funnel paid media and creative overhaul across every channel.",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-grid pb-24 pt-32 sm:pt-40">
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[140px]" />
        <Container className="relative flex flex-col items-center text-center">
          <span className="font-display text-sm tracking-[0.35em] text-white/50">
            AN AGENCY FOR BRANDS THAT REFUSE TO BLEND IN
          </span>

          <div className="mt-14 w-full">
            <HeroOrbit />
          </div>

          <p className="mt-14 max-w-xl text-lg text-white/60">
            Elevate Creative Media builds brand strategy, content, and growth
            systems for companies that want to be seen, remembered, and
            chosen.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button href="/about">Start a Project</Button>
            <Button href="/case-studies" variant="outline">
              See the Work
            </Button>
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 py-14">
        <Container className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-4xl text-accent sm:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-xs tracking-wide text-white/50 sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </Container>
      </section>

      <section className="py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="font-display text-sm tracking-[0.3em] text-accent">
                What We Do
              </span>
              <h2 className="mt-4 font-display text-4xl leading-none text-white sm:text-5xl">
                SERVICES BUILT
                <br />
                TO GET YOU SEEN
              </h2>
            </div>
            <Link
              href="/services"
              className="underline-accent font-display text-sm tracking-wide text-white/70 hover:text-white"
            >
              View All Services →
            </Link>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="group bg-black p-8 transition-colors hover:bg-white/[0.03] sm:p-10"
              >
                <h3 className="font-display text-2xl text-white transition-colors group-hover:text-accent sm:text-3xl">
                  {service.title}
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/10 py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="font-display text-sm tracking-[0.3em] text-accent">
                Proof, Not Promises
              </span>
              <h2 className="mt-4 font-display text-4xl leading-none text-white sm:text-5xl">
                RESULTS THAT
                <br />
                SPEAK FOR THEMSELVES
              </h2>
            </div>
            <Link
              href="/case-studies"
              className="underline-accent font-display text-sm tracking-wide text-white/70 hover:text-white"
            >
              View All Case Studies →
            </Link>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {CASE_STUDIES.map((study) => (
              <div
                key={study.client}
                className="flex flex-col justify-between rounded-2xl border border-white/10 p-8 transition-colors hover:border-accent/60"
              >
                <div>
                  <span className="font-display text-3xl text-accent">
                    {study.result}
                  </span>
                  <h3 className="mt-4 font-display text-xl tracking-wide text-white">
                    {study.client}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">
                    {study.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="LET'S MAKE YOUR BRAND UNMISSABLE"
        subtitle="Tell us where you're stuck and where you want to go. We'll build the strategy, content, and growth engine to get you there."
      />
    </>
  );
}
