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

export function splitResultLabel(label: string): {
  unit: string | null;
  detail: string;
} {
  const words = label.split(" ");
  if (words[0] === "Views") {
    return { unit: "Views", detail: words.slice(1).join(" ") };
  }
  return { unit: null, detail: label };
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    client: "Smash & Grub",
    tag: "Brand + Launch Campaign",
    result: "150K+",
    resultLabel: "Views in 1 Week",
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
    resultLabel: "Views in 1 Week",
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
];
