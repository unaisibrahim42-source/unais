export type CaseStudyIconName =
  | "rocket"
  | "trending"
  | "target"
  | "spark"
  | "monitor"
  | "globe";

export type CaseStudy = {
  client: string;
  tag: string;
  result: string;
  resultLabel: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  icon: CaseStudyIconName;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    client: "Northpeak Apparel",
    tag: "Brand + Launch Campaign",
    result: "+240%",
    resultLabel: "Engagement",
    summary:
      "A full streetwear rebrand paired with a content-led launch campaign that sold through initial inventory in 48 hours.",
    challenge:
      "Northpeak had strong product but no identity — inconsistent visuals, no brand voice, and a launch calendar with no momentum behind it.",
    approach:
      "We rebuilt their identity system from scratch — logo, packaging, and tone — then built a content-led launch campaign around a single drop, seeding it through creators before opening pre-orders.",
    outcome:
      "The drop sold through initial inventory in 48 hours, with engagement up 240% over their prior campaigns and a waitlist that carried into the next release.",
    icon: "rocket",
  },
  {
    client: "Vela Wellness",
    tag: "Content + Social",
    result: "+3.1M",
    resultLabel: "Organic Reach",
    summary:
      "A short-form content engine and always-on social strategy that took a regional DTC brand national in one year.",
    challenge:
      "Vela had a loyal but small local following and no repeatable way to reach new audiences outside their home market.",
    approach:
      "We stood up a short-form content engine — daily posting cadence, format testing, and an always-on community strategy — designed to compound rather than spike.",
    outcome:
      "Organic reach grew to 3.1M within a year, turning a single-market brand into a nationally recognized name without new paid spend.",
    icon: "trending",
  },
  {
    client: "Atlas Fitness",
    tag: "Paid Media + Funnel",
    result: "+68%",
    resultLabel: "New Members",
    summary:
      "Full-funnel paid social and creative testing program rebuilt from the ground up across five locations.",
    challenge:
      "Atlas was spending on ads across five locations with no consistent funnel, tracking, or creative testing process.",
    approach:
      "We rebuilt the funnel end-to-end — landing pages, tracking, and a structured creative testing calendar — then scaled spend against what actually converted.",
    outcome:
      "New memberships rose 68% year over year, with cost per acquisition down across every location.",
    icon: "target",
  },
  {
    client: "Monarch Beauty",
    tag: "Influencer + Partnerships",
    result: "4.8x",
    resultLabel: "ROAS",
    summary:
      "Creator-led launch strategy that paired seeded partnerships with paid amplification for a debut product line.",
    challenge:
      "Monarch was launching a new product line cold, with no existing audience and a limited media budget to build one.",
    approach:
      "We sourced and negotiated a seeded creator program, layering paid amplification behind the posts that performed best in the first 48 hours.",
    outcome:
      "The launch returned 4.8x ROAS, with creator content outperforming every other channel in the media mix.",
    icon: "spark",
  },
  {
    client: "Flux Audio",
    tag: "Web + Digital Design",
    result: "+92%",
    resultLabel: "Conversion Rate",
    summary:
      "A redesigned e-commerce experience and landing page system built to convert the traffic their content was already earning.",
    challenge:
      "Flux had strong organic content driving traffic to a site that wasn't built to convert it.",
    approach:
      "We redesigned the site and landing page system around the customer journey their content was already creating, cutting steps between interest and checkout.",
    outcome:
      "Conversion rate jumped 92% without any change in traffic volume — the same visitors, converting at nearly double the rate.",
    icon: "monitor",
  },
  {
    client: "Orbit & Co",
    tag: "Full-Service Growth",
    result: "120+",
    resultLabel: "Markets Reached",
    summary:
      "End-to-end brand, content, and growth partnership scaling a single-market brand into a global presence.",
    challenge:
      "Orbit had proven their model in one market and needed a partner who could scale brand, content, and growth together, not in silos.",
    approach:
      "We ran brand, content, paid media, and web as one connected system, with a single strategy driving every channel instead of separate teams working in isolation.",
    outcome:
      "Orbit expanded into 120+ markets, with every new region launching on the same proven playbook.",
    icon: "globe",
  },
];
