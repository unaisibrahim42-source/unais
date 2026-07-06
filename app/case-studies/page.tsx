import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import CTASection from "@/components/CTASection";
import CaseStudyGrid from "@/components/CaseStudyGrid";

export const metadata: Metadata = {
  title: "Case Studies | Elevate Creative Media",
  description:
    "Real results from Elevate Creative Media's brand strategy, content, and growth campaigns.",
};

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
        description="A selection of brands we've helped go from overlooked to unmissable. Every number below is a campaign we ran, not a stock photo. Click a card for the full story."
      />

      <section className="py-24">
        <Container>
          <CaseStudyGrid />
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
