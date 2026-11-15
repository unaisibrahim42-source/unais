import Link from "next/link";
import { getProperties } from "@/lib/properties";
import { site } from "@/site.config";

// Temporary index while the walkthrough is reviewed; the full home page comes next.
export default function Home() {
  const properties = getProperties();
  return (
    <main className="mx-auto max-w-4xl px-5 pt-40 pb-24 sm:px-10">
      <h1 className="font-display text-6xl font-light">{site.name}</h1>
      <ul className="mt-12 divide-y divide-line border-y border-line">
        {properties.map((p) => (
          <li key={p.slug}>
            <Link href={`/properties/${p.slug}`} className="flex justify-between py-6 font-display text-2xl hover:text-accent">
              {p.details.title} <span aria-hidden>→</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
