"use client";

import { useState } from "react";
import CaseStudyIcon from "@/components/CaseStudyIcon";
import type { Service } from "@/lib/services";

export default function ServicesAccordion({ services }: { services: Service[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {services.map((service, i) => {
        const open = openIndex === i;
        return (
          <div
            key={service.title}
            className={`overflow-hidden rounded-2xl border bg-black transition-colors ${
              open ? "border-accent" : "border-accent/50 hover:border-accent/80"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center gap-5 p-6 text-left transition-colors hover:bg-black/[0.02] sm:p-8"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <CaseStudyIcon name={service.icon} className="h-6 w-6" />
              </span>

              <div className="min-w-0 flex-1">
                <span className="font-display text-xs text-white/30">
                  {service.number}
                </span>
                <h3 className="mt-1 font-display text-xl text-white sm:text-2xl">
                  {service.title}
                </h3>
              </div>

              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-black/40 text-lg leading-none text-white transition-transform duration-300 ${
                  open ? "rotate-45 border-accent text-accent" : "border-white/25"
                }`}
              >
                +
              </span>
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-8 sm:px-8 sm:pl-[4.75rem]">
                  <p className="max-w-2xl text-sm leading-relaxed text-white/55">
                    {service.description}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {service.deliverables.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-white/10 px-3 py-1 text-xs tracking-wide text-white/60"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
