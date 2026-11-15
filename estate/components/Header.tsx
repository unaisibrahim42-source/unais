import Link from "next/link";
import { site } from "@/site.config";

export function Header() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <div className="pointer-events-auto mx-auto flex items-center justify-between px-5 py-5 text-white sm:px-10 sm:py-7">
        <Link href="/" className="font-display text-xl tracking-wide sm:text-2xl">
          {site.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={site.logo} alt={site.name} className="h-7 w-auto" />
          ) : (
            site.name
          )}
        </Link>
        <nav className="flex gap-6 text-[11px] tracking-[0.2em] uppercase">
          <Link href="/" className="opacity-80 transition-opacity hover:opacity-100">Home</Link>
        </nav>
      </div>
    </header>
  );
}
