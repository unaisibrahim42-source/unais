"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Subtle motion everywhere: any element with `data-reveal` fades up as it
 * enters the viewport. `data-reveal="stagger"` staggers its direct children.
 */
export function Reveals() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        // Already on screen at load → leave it alone (no flash of hidden content).
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
        const targets = el.dataset.reveal === "stagger" ? Array.from(el.children) : [el];
        gsap.fromTo(
          targets,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      });
    });
    const t = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      clearTimeout(t);
      ctx.revert();
    };
  }, [pathname]);
  return null;
}
