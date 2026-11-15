import { site } from "@/site.config";
import type { PropertyDetails } from "./types";

export function formatPrice(d: Pick<PropertyDetails, "price" | "currency" | "priceSuffix">) {
  const s = new Intl.NumberFormat(site.currency.locale, {
    style: "currency",
    currency: d.currency ?? "GBP",
    maximumFractionDigits: 0,
  }).format(d.price);
  return d.priceSuffix ? `${s} ${d.priceSuffix}` : s;
}
