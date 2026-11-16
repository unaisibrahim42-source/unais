import type { Property } from "./types";

/** The slim, serialisable shape the listings grid & cards need on the client. */
export interface ListingCard {
  slug: string;
  title: string;
  location: string;
  status: string;
  price: number;
  priceLabel: string;
  beds: number;
  baths: number;
  sqft: number;
  summary: string;
  scenes: Property["walkthrough"]["scenes"];
}
