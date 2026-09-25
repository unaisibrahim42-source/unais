export type PricingPackage = {
  name: string;
  price: string;
  firstMonth: string;
  description: string;
  features: string[];
  recommended?: boolean;
};

export const PRICING_PACKAGES: PricingPackage[] = [
  {
    name: "Standard",
    price: "£500",
    firstMonth: "First month: £400",
    description:
      "Consistent, quality content at a manageable volume. A solid starting point for building your presence.",
    features: [
      "12–14 high-quality content posts per month",
      "Content planning & strategy",
      "Professional editing",
      "Captions & hashtag research",
      "Monthly performance review",
    ],
  },
  {
    name: "Premium",
    price: "£900",
    firstMonth: "First month: £750",
    description:
      "The full content system. Higher volume, faster turnaround, and bi-weekly reviews for brands serious about growing quickly.",
    features: [
      "16–20 high-quality content posts per month",
      "Content planning & strategy",
      "Professional editing",
      "Captions & hashtag research",
      "Performance review every 2 weeks",
      "Priority content turnaround",
    ],
    recommended: true,
  },
];
