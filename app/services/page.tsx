import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Services | Elevate Creative Media",
  description:
    "Brand strategy, content production, social management, and growth marketing services from Elevate Creative Media.",
};

const SERVICES = [
  {
    number: "01",
    title: "Brand Strategy",
    description:
      "Positioning, naming, identity systems, and messaging frameworks that give your brand a real point of view.",
    deliverables: ["Brand positioning", "Visual identity", "Messaging & voice", "Launch playbooks"],
  },
  {
    number: "02",
    title: "Content Production",
    description:
      "Photo, video, and campaign content shot and edited to stop the scroll across every platform you show up on.",
    deliverables: ["Photo & video shoots", "Short-form content", "Campaign creative", "Motion & editing"],
  },
  {
    number: "03",
    title: "Social Media Management",
    description:
      "Always-on strategy, content calendars, and community management that keeps your channels sharp and consistent.",
    deliverables: ["Content calendars", "Community management", "Channel strategy", "Analytics & reporting"],
  },
  {
    number: "04",
    title: "Paid Media & Growth",
    description:
      "Performance-driven media buying, funnels, and creative testing that turn attention into pipeline and revenue.",
    deliverables: ["Paid social & search", "Funnel design", "Creative testing", "Conversion tracking"],
  },
  {
    number: "05",
    title: "Web & Digital Design",
    description:
      "Fast, distinctive websites and landing pages built to convert traffic your other services generate.",
    deliverables: ["Web design & build", "Landing pages", "Design systems", "CRO"],
  },
  {
    number: "06",
    title: "Influencer & Partnerships",
    description:
      "Creator sourcing, negotiation, and campaign management that extend your reach through trusted voices.",
    deliverables: ["Creator sourcing", "Campaign management", "Contracts & negotiation", "Performance tracking"],
  },
];

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
        description="Every service we offer exists for one reason: to make your brand impossible to ignore. Pick one, or let us build the full engine."
      />

      <section className="py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 p-8 transition-colors hover:border-accent/60 sm:p-10"
              >
                <span className="font-display text-sm text-white/30">
                  {service.number}
                </span>
                <h2 className="mt-4 font-display text-3xl text-white transition-colors group-hover:text-accent sm:text-4xl">
                  {service.title}
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">
                  {service.description}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {service.deliverables.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs tracking-wide text-white/60"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        eyebrow="Not Sure Where To Start?"
        title="TELL US YOUR GOAL, WE'LL BUILD THE PLAN"
        subtitle="Every engagement starts with a strategy call — no packages forced, no fluff. Just the services your brand actually needs."
      />
    </>
  );
}
