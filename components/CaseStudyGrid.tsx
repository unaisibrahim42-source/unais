"use client";

import { useEffect, useState } from "react";
import { CASE_STUDIES, splitResultLabel } from "@/lib/case-studies";
import CaseStudyIcon from "@/components/CaseStudyIcon";
import AnimatedNumber from "@/components/AnimatedNumber";
import Button from "@/components/Button";
import InstagramEmbed from "@/components/InstagramEmbed";

export default function CaseStudyGrid() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const active = openIndex !== null ? CASE_STUDIES[openIndex] : null;

  useEffect(() => {
    if (openIndex === null) return;

    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openIndex]);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {CASE_STUDIES.map((study, i) => {
          const { unit, detail } = splitResultLabel(study.resultLabel);
          return (
            <button
              key={study.client}
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group flex flex-col justify-between gap-6 rounded-xl border-2 border-accent/60 bg-black p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_0_40px_-12px_rgba(229,67,67,0.5)] sm:p-6"
            >
              <span className="font-display text-[10px] tracking-[0.15em] text-white/50">
                {study.tag}
              </span>

              <div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <AnimatedNumber
                    value={study.result}
                    className="font-display text-3xl text-accent sm:text-4xl"
                  />
                  {unit && (
                    <span className="font-display text-3xl text-accent sm:text-4xl">
                      {unit}
                    </span>
                  )}
                  {detail && (
                    <span className="font-display text-xs tracking-[0.1em] text-white/50">
                      {detail}
                    </span>
                  )}
                </div>
                <h2 className="mt-2 font-display text-2xl tracking-wide text-white">
                  {study.client}
                </h2>
                <span className="underline-accent mt-4 inline-block font-display text-xs tracking-wide text-white/70 group-hover:text-white">
                  View Full Story →
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6"
          onClick={() => setOpenIndex(null)}
        >
          <div
            className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-black shadow-[0_0_80px_-20px_rgba(229,67,67,0.4)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-40 overflow-hidden bg-grid bg-gradient-to-br from-accent/30 via-black to-black sm:h-48">
              <CaseStudyIcon
                name={active.icon}
                className="absolute -bottom-6 -right-6 h-40 w-40 text-accent/15"
              />
              <span className="absolute left-6 top-6 rounded-full bg-black/60 px-3 py-1 font-display text-[10px] tracking-[0.15em] text-white/70 backdrop-blur-sm">
                {active.tag}
              </span>
              <button
                type="button"
                onClick={() => setOpenIndex(null)}
                aria-label="Close case study"
                className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-accent"
              >
                ✕
              </button>
              <div className="absolute bottom-6 left-6 flex items-center gap-3 text-accent">
                <CaseStudyIcon name={active.icon} className="h-8 w-8" />
              </div>
            </div>

            <div className="p-6 sm:p-10">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-5xl text-accent">
                  {active.result}
                </span>
                <span className="text-sm tracking-wide text-white/50">
                  {active.resultLabel}
                </span>
              </div>
              <h2 className="mt-3 font-display text-3xl tracking-wide text-white sm:text-4xl">
                {active.client}
              </h2>

              <div className="mt-8 sm:flex sm:gap-8">
                {active.instagramUrl && (
                  <div className="mx-auto w-full max-w-[220px] shrink-0 sm:mx-0">
                    <div className="overflow-hidden rounded-2xl border border-white/10">
                      <InstagramEmbed url={active.instagramUrl} />
                    </div>
                    <a
                      href={active.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 block text-center text-xs tracking-wide text-white/50 hover:text-accent"
                    >
                      View on Instagram ↗
                    </a>
                  </div>
                )}

                <div className="mt-8 min-w-0 flex-1 space-y-6 sm:mt-0">
                  <div>
                    <span className="font-display text-xs tracking-[0.25em] text-accent">
                      The Challenge
                    </span>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">
                      {active.challenge}
                    </p>
                  </div>
                  <div>
                    <span className="font-display text-xs tracking-[0.25em] text-accent">
                      The Approach
                    </span>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">
                      {active.approach}
                    </p>
                  </div>
                  <div>
                    <span className="font-display text-xs tracking-[0.25em] text-accent">
                      The Outcome
                    </span>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">
                      {active.outcome}
                    </p>
                  </div>
                </div>
              </div>

              <Button href="/about" className="mt-10 w-full sm:w-auto">
                Start a Project Like This
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
