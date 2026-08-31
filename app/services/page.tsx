import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import CTASection from "@/components/CTASection";
import ServicesAccordion from "@/components/ServicesAccordion";
import PricingSection from "@/components/PricingSection";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services | Elevate Creative Media",
  description:
    "Brand strategy, content production, social management, and growth marketing services from Elevate Creative Media.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What We Do"
        title={
          <>
            SERVICES BUILT
            <br />
            TO GET YOU <span className="text-accent">SEEN</span>
          </>
        }
        description="Every service we offer exists for one reason: to make your brand impossible to ignore. Pick one, or let us build the full engine. Tap a service to see what's included."
      />

      <section className="py-24">
        <Container>
          <ServicesAccordion services={SERVICES} />
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <span className="font-display text-xs tracking-[0.25em] text-accent">
            Pricing
          </span>
          <h2 className="mt-3 font-display text-3xl tracking-wide text-white sm:text-4xl">
            PACKAGES
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55">
            Two starting points — choose based on how much content volume your
            brand needs.
          </p>
          <div className="mt-10">
            <PricingSection />
          </div>
        </Container>
      </section>

      <CTASection
        eyebrow="Not Sure Where To Start?"
        title="TELL US YOUR GOAL, WE'LL BUILD THE PLAN"
        subtitle="Every engagement starts with a strategy call — pick a package above or let's build a custom plan around your goals."
      />
    </>
  );
}
