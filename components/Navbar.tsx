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
            ? "bg-black/70 backdrop-blur-md border-b border-white/10"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-10">
          <Logo />

          <ul className="hidden items-center gap-1.5 rounded-full bg-white p-1.5 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] md:flex">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`inline-flex items-center justify-center rounded-full bg-gradient-to-b from-accent to-[#b93232] px-5 py-2.5 font-display text-sm tracking-wide text-white transition-all lg:px-6 ${
                      isActive
                        ? "ring-2 ring-black/15"
                        : "hover:brightness-110 hover:scale-105"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full bg-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] md:hidden"
          >
            <span
              className={`block h-0.5 w-5 rounded-full bg-accent transition-transform duration-300 ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-accent transition-opacity duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-accent transition-transform duration-300 ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-5 overflow-y-auto bg-black px-6 py-24 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100 visible" : "pointer-events-none invisible opacity-0"
        }`}
      >
        <ul className="flex flex-col items-center gap-5">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`inline-flex items-center justify-center rounded-full bg-gradient-to-b from-accent to-[#b93232] px-8 py-3.5 font-display text-xl tracking-wide text-white transition-all ${
                    isActive ? "ring-2 ring-white/40" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
