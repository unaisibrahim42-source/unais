"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { NAV_LINKS } from "@/lib/nav";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-colors duration-300 ${
          scrolled
            ? "bg-white/70 backdrop-blur-md border-b border-black/10"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-10">
          <Logo />

          <ul className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`underline-accent font-display text-sm tracking-wide transition-colors ${
                      isActive ? "active text-black" : "text-black/70 hover:text-black"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href="/about"
            className="hidden md:inline-flex items-center justify-center rounded-full bg-accent px-5 py-2 font-display text-sm tracking-wide text-white shadow-[0_0_18px_-6px_rgba(229,67,67,0.7)] transition-all hover:scale-105 hover:shadow-[0_0_26px_-4px_rgba(229,67,67,0.85)]"
          >
            Start a Project
          </Link>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`block h-0.5 w-6 bg-black transition-transform duration-300 ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-black transition-opacity duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-black transition-transform duration-300 ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 overflow-y-auto bg-white px-6 py-24 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100 visible" : "pointer-events-none invisible opacity-0"
        }`}
      >
        <ul className="flex flex-col items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`font-display text-3xl tracking-wide ${
                    isActive ? "text-accent" : "text-black"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          href="/about"
          onClick={() => setOpen(false)}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-accent px-8 py-3 font-display text-lg tracking-wide text-white shadow-[0_0_24px_-6px_rgba(229,67,67,0.7)]"
        >
          Start a Project
        </Link>
      </div>
    </>
  );
}
