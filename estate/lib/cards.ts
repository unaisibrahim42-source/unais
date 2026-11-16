import "server-only";
import { formatPrice } from "./format";
import type { ListingCard } from "./listing";
import type { Property } from "./types";

export const toCard = (p: Property): ListingCard => ({
  slug: p.slug,
  title: p.details.title,
  location: p.details.location,
  status: p.details.status ?? "For sale",
  price: p.details.price,
  priceLabel: formatPrice(p.details),
  beds: p.details.beds,
  baths: p.details.baths,
  sqft: p.details.sqft,
  summary: p.details.summary ?? "",
  // Strip the large placeholder strings from all but the cover to keep payloads small.
  scenes: p.walkthrough.scenes.map((s, i) => (i === 0 ? s : { ...s, image: { ...s.image, placeholder: "" } })),
});
