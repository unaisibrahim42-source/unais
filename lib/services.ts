import { CaseStudyIconName } from "@/lib/case-studies";

export type Service = {
  number: string;
  title: string;
  description: string;
  deliverables: string[];
  icon: CaseStudyIconName;
};

export const SERVICES: Service[] = [
  {
    number: "01",
    title: "Brand Strategy",
    description:
      "Positioning, naming, identity systems, and messaging frameworks that give your brand a real point of view.",
    deliverables: ["Brand positioning", "Visual identity", "Messaging & voice", "Launch playbooks"],
    icon: "spark",
  },
  {
    number: "02",
    title: "Content Production",
    description:
      "Photo, video, and campaign content shot and edited to stop the scroll across every platform you show up on.",
    deliverables: ["Photo & video shoots", "Short-form content", "Campaign creative", "Motion & editing"],
    icon: "trending",
  },
  {
    number: "03",
    title: "Social Media Management",
    description:
      "Always-on strategy, content calendars, and community management that keeps your channels sharp and consistent.",
    deliverables: ["Content calendars", "Community management", "Channel strategy", "Analytics & reporting"],
    icon: "globe",
  },
  {
    number: "04",
    title: "Paid Media & Growth",
    description:
      "Performance-driven media buying, funnels, and creative testing that turn attention into pipeline and revenue.",
    deliverables: ["Paid social & search", "Funnel design", "Creative testing", "Conversion tracking"],
    icon: "target",
  },
  {
    number: "05",
    title: "Web & Digital Design",
    description:
      "Fast, distinctive websites and landing pages built to convert traffic your other services generate.",
    deliverables: ["Web design & build", "Landing pages", "Design systems", "CRO"],
    icon: "monitor",
  },
  {
    number: "06",
    title: "Influencer & Partnerships",
    description:
      "Creator sourcing, negotiation, and campaign management that extend your reach through trusted voices.",
    deliverables: ["Creator sourcing", "Campaign management", "Contracts & negotiation", "Performance tracking"],
    icon: "rocket",
  },
];
