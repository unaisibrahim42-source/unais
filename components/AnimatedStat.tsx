"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  const [display, setDisplay] = useState(() => value.replace(/[\d.]+/, "0"));
  const ref = useRef<HTMLDivElement>(null);
  const played = useRef(false);

  useEffect(() => {
    const match = value.match(/^([\d.]+)(.*)$/);
    const el = ref.current;
    if (!match || !el) return;

    const target = parseFloat(match[1]);
    const suffix = match[2];
    const decimals = match[1].includes(".") ? 1 : 0;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || played.current) return;
        played.current = true;

        const duration = 1400;
        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          if (progress < 1) {
            setDisplay((target * eased).toFixed(decimals) + suffix);
            requestAnimationFrame(tick);
          } else {
            setDisplay(match[1] + suffix);
          }
        };

        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl text-accent sm:text-5xl">{display}</div>
      <div className="mt-2 text-xs tracking-wide text-white/50 sm:text-sm">{label}</div>
    </div>
  );
}
