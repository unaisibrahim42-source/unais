"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedNumber({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(() => value.replace(/[\d.]+/, "0"));
  const ref = useRef<HTMLSpanElement>(null);
  const played = useRef(false);
  const runIdRef = useRef(0);

  const runAnimation = () => {
    const match = value.match(/^([\d.]+)(.*)$/);
    if (!match) return;

    const target = parseFloat(match[1]);
    const suffix = match[2];
    const decimals = match[1].includes(".") ? 1 : 0;

    const runId = ++runIdRef.current;
    const duration = 1400;
    const start = performance.now();

    setDisplay((0).toFixed(decimals) + suffix);

    const tick = (now: number) => {
      if (runId !== runIdRef.current) return;
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
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || played.current) return;
        played.current = true;
        runAnimation();
        observer.disconnect();
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span ref={ref} onMouseEnter={runAnimation} className={className}>
      {display}
    </span>
  );
}
