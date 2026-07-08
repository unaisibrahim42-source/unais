export type CaseStudyIconName =
  | "rocket"
  | "trending"
  | "target"
  | "spark"
  | "monitor"
  | "globe"
  | "megaphone";

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
  instagramUrl?: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    client: "Smash & Grub",
    tag: "Brand + Launch Campaign",
    result: "150K+",
    resultLabel: "Views in One Week",
    summary:
      "A short-form content campaign for a limited-time burger giveaway that generated over 150K organic views and sold out in under two hours.",
    challenge:
      "Smash & Grub wanted to create buzz around a limited-time burger giveaway while increasing local brand awareness and driving footfall to the launch event.",
    approach:
      "We developed a short-form content campaign focused on anticipation, high-energy food visuals, and social-first storytelling to maximise organic reach before and during the giveaway.",
    outcome:
      "The campaign generated 150K+ organic views in just one week, attracted hundreds of customers, with 700 burgers given away, and the event sold out in under two hours — creating significant local buzz and strengthening the brand's presence both online and in-store.",
    icon: "trending",
    instagramUrl: "https://www.instagram.com/p/DXzwT7kNZC0/",
  },
  {
    client: "OGZ",
    tag: "Content + Social",
    result: "200K+",
    resultLabel: "Views in One Week",
    summary:
      "A multi-location content push for Birmingham's OGZ, turning munch boxes and loaded fries into scroll-stopping short-form video that pulled in over 200K views in a single week.",
    challenge:
      "OGZ was running four sites across Birmingham — Sparkbrook, City Centre, Alum Rock, and Hamstead — but had no content engine tying the locations together, leaving each one to rely on word of mouth and delivery-app visibility alone.",
    approach:
      "We built a short-form content series around OGZ's signature munch boxes, loaded fries, and grilled burgers, leaning into high-energy food visuals and local culture so every drop felt like an event worth queuing for.",
    outcome:
      "The campaign hit 200K+ views in its first week, drove a visible spike in delivery orders across all four locations, and gave OGZ a content identity that now runs consistently site to site.",
    icon: "megaphone",
  },
  {
    client: "Smokyz Grill",
    tag: "Content + Social",
    result: "80K+",
    resultLabel: "Views in First Month",
    summary:
      "A halal grill in Leicester known for loaded fries and rice boxes, given a content strategy built to turn first-time delivery customers into regulars.",
    challenge:
      "Smokyz Grill had strong food and solid delivery ratings but almost no organic reach, competing for attention against dozens of nearby takeaways on Deliveroo and Uber Eats.",
    approach:
      "We built a launch content calendar spotlighting Smokyz's loaded fries and signature burgers, prioritising fast-paced short-form video designed to travel on For You pages rather than static menu posts.",
    outcome:
      "The account passed 80K+ views in its first month live, with a measurable lift in Deliveroo and Uber Eats order volume tied directly to the content push.",
    icon: "megaphone",
  },
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
