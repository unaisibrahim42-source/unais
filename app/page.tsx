import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import Button from "@/components/Button";
import HeroOrbit from "@/components/HeroOrbit";
import CTASection from "@/components/CTASection";
import CaseStudyIcon from "@/components/CaseStudyIcon";
import ServicesAccordion from "@/components/ServicesAccordion";
import { CASE_STUDIES } from "@/lib/case-studies";
import { SERVICES } from "@/lib/services";

const STATS = [
  { value: "120+", label: "Brands Elevated" },
  { value: "3.2M", label: "Followers Grown" },
  { value: "48", label: "Countries Reached" },
  { value: "5x", label: "Avg. Engagement Lift" },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden pb-24 pt-28 sm:pt-36">
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[140px]" />
        <Container className="relative">
          <div className="flex flex-col-reverse items-center gap-12 text-center lg:flex-row-reverse lg:items-center lg:justify-between lg:gap-10 lg:text-left">
            <div className="flex flex-col items-center lg:items-start lg:max-w-xl">
              <div className="w-full">
                <HeroOrbit />
              </div>

              <p className="mt-14 max-w-xl text-lg text-white/60">
                Elevate Creative Media builds brand strategy, content, and
                growth systems for companies that want to be seen,
                remembered, and chosen.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button href="/about">Start a Project</Button>
                <Button href="/case-studies" variant="outline">
                  See the Work
                </Button>
              </div>
            </div>

            <div className="flex w-full flex-col items-center text-center lg:w-auto lg:flex-1 lg:-translate-y-24">
              <h1 className="max-w-lg font-display text-4xl leading-[0.95] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                STOP BLENDING IN.
                <br />
                GET <span className="text-accent">UNMISSABLE</span>.
              </h1>
              <Button href="/survey" className="mt-6">
                Grow →
              </Button>
              <Image
                src="/logo.png"
                alt="Elevate Creative Media"
                width={640}
                height={520}
                priority
                className="mt-6 h-auto w-[200px] sm:w-[260px] lg:w-[320px] xl:w-[380px]"
              />
            </div>
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
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_0_40px_-12px_rgba(229,67,67,0.5)]"
              >
                <div className="relative h-24 overflow-hidden bg-grid bg-gradient-to-br from-accent/25 via-black to-black">
                  <CaseStudyIcon
                    name={study.icon}
                    className="absolute -bottom-3 -right-3 h-20 w-20 text-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:text-accent/20"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 font-display text-[10px] tracking-[0.15em] text-white/70 backdrop-blur-sm">
                    {study.tag}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-8">
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
