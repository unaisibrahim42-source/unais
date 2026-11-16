"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/site.config";
import { Logo } from "./Logo";

const NAV = [
  { href: "/listings", label: "Properties" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/**
 * Transparent with light text while over an element marked `data-header="dark"`
 * (hero images, the walkthrough); solid paper otherwise.
 */
export function Header() {
  const pathname = usePathname();
  const [overDark, setOverDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const y = 40;
      const dark = Array.from(document.querySelectorAll<HTMLElement>('[data-header="dark"]')).some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= y && r.bottom > y;
      });
      setOverDark(dark);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    raf = requestAnimationFrame(check);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  const light = overDark && !open;
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,border-color,backdrop-filter] duration-500 ${
        light ? "border-b border-transparent bg-transparent text-white" : "border-b border-line/70 bg-paper/85 text-ink backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 sm:px-10 sm:py-5">
        <Link href="/" aria-label={`${site.name} home`}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-9 text-[11px] tracking-[0.22em] uppercase md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`relative py-1 transition-opacity hover:opacity-100 ${pathname.startsWith(n.href) ? "opacity-100" : "opacity-70"}`}
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className={`rounded-full border px-5 py-2.5 transition-colors ${light ? "border-white/50 hover:bg-white hover:text-ink" : "border-ink/20 hover:bg-ink hover:text-paper"}`}
          >
            Book a viewing
          </Link>
        </nav>
        <button
          type="button"
          className="-mr-2 p-2 md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`block h-px w-6 bg-current transition-transform duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
          <span className={`mt-1.5 block h-px w-6 bg-current transition-transform duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
        </button>
      </div>
      <div className={`grid overflow-hidden transition-[grid-template-rows] duration-500 md:hidden ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <nav className="min-h-0">
          <ul className="px-5 pb-8 font-display text-3xl">
            {[{ href: "/", label: "Home" }, ...NAV].map((n) => (
              <li key={n.href} className="border-t border-line py-3">
                <Link href={n.href} onClick={() => setOpen(false)}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
