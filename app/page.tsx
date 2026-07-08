import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import Button from "@/components/Button";
import CTASection from "@/components/CTASection";
import CaseStudyIcon from "@/components/CaseStudyIcon";
import ServicesAccordion from "@/components/ServicesAccordion";
import AnimatedStat from "@/components/AnimatedStat";
import AnimatedNumber from "@/components/AnimatedNumber";
import { CASE_STUDIES } from "@/lib/case-studies";
import { SERVICES } from "@/lib/services";

const STATS = [
  { value: "100+", label: "Brands Elevated" },
  { value: "100K+", label: "Followers Growth" },
  { value: "20+", label: "Countries Reached" },
  { value: "5X", label: "Avg. Engagement Lift" },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-dots pb-24 pt-16 sm:pt-24">
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[140px]" />
        <Container className="relative">
          <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <h1 className="max-w-lg font-display text-4xl leading-[0.95] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                STOP BLENDING IN.
                <br />
                GET{" "}
                <span className="text-accent [text-shadow:4px_4px_0_rgba(120,30,30,0.55)]">
                  UNMISSABLE
                </span>
                .
              </h1>
              <Button href="/survey" size="lg" className="mt-8">
                Grow →
              </Button>
              <p className="mt-8 max-w-md text-center text-lg text-white/60">
                Elevate Creative Media builds brand strategy, content, and
                growth systems for companies that want to be seen,
                remembered, and chosen.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <Image
                src="/logo.png"
                alt="Elevate Creative Media"
                width={640}
                height={520}
                priority
                className="h-auto w-[260px] sm:w-[340px] lg:w-[400px] xl:w-[460px]"
              />
              <Button href="/case-studies" variant="outline" className="mt-8">
                See the Work
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 py-14">
        <Container className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map((stat) => (
            <AnimatedStat key={stat.label} value={stat.value} label={stat.label} />
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

          <div className="mt-14">
            <ServicesAccordion services={SERVICES.slice(0, 4)} />
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
            {CASE_STUDIES.slice(0, 3).map((study) => (
              <Link
                key={study.client}
                href="/case-studies"
                className="group flex flex-col rounded-2xl border-2 border-accent/60 bg-black p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_0_40px_-12px_rgba(229,67,67,0.5)] sm:p-7"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-display text-[10px] tracking-[0.2em] text-white/40">
                    {study.tag}
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110">
                    <CaseStudyIcon name="megaphone" className="h-4 w-4" />
                  </span>
                </div>

                <div className="mt-10 flex flex-wrap items-baseline gap-2">
                  <AnimatedNumber
                    value={study.result}
                    className="font-display text-3xl text-accent sm:text-4xl"
                  />
                  <span className="text-[11px] tracking-wide text-white/45">
                    {study.resultLabel}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl tracking-wide text-white">
                  {study.client}
                </h3>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/55">
                  {study.summary}
                </p>
              </Link>
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
