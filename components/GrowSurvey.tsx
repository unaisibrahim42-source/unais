"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SERVICES } from "@/lib/services";

type Question =
  | { key: "brand"; type: "text"; question: string; placeholder: string }
  | { key: "needs"; type: "multi"; question: string; options: string[] }
  | { key: "budget"; type: "single"; question: string; options: string[] }
  | { key: "timeline"; type: "single"; question: string; options: string[] };

const QUESTIONS: Question[] = [
  {
    key: "brand",
    type: "text",
    question: "What's your brand called?",
    placeholder: "Your business name",
  },
  {
    key: "needs",
    type: "multi",
    question: "What do you need help with?",
    options: SERVICES.map((s) => s.title),
  },
  {
    key: "budget",
    type: "single",
    question: "What's your monthly marketing budget?",
    options: ["Under £1,000", "£1,000 – £3,000", "£3,000 – £10,000", "£10,000+"],
  },
  {
    key: "timeline",
    type: "single",
    question: "When are you looking to start?",
    options: ["ASAP", "Within 1 month", "1–3 months", "Just exploring"],
  },
];

const TOTAL_STEPS = QUESTIONS.length + 1;
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID || "xrewjqdr";

type Answers = {
  brand: string;
  needs: string[];
  budget: string;
  timeline: string;
  name: string;
  email: string;
  phone: string;
};

const EMPTY_ANSWERS: Answers = {
  brand: "",
  needs: [],
  budget: "",
  timeline: "",
  name: "",
  email: "",
  phone: "",
};

export default function GrowSurvey() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const isContactStep = step === QUESTIONS.length;
  const current = !isContactStep ? QUESTIONS[step] : null;

  function goBack() {
    if (step === 0) {
      router.push("/");
    } else {
      setStep((s) => s - 1);
    }
  }

  function goNext() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function toggleNeed(option: string) {
    setAnswers((a) => ({
      ...a,
      needs: a.needs.includes(option)
        ? a.needs.filter((n) => n !== option)
        : [...a.needs, option],
    }));
  }

  function selectSingle(key: "budget" | "timeline", value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
    goNext();
  }

  async function handleSubmit() {
    setStatus("sending");
    const data = new FormData();
    data.append("brand", answers.brand);
    data.append("needs", answers.needs.join(", "));
    data.append("budget", answers.budget);
    data.append("timeline", answers.timeline);
    data.append("name", answers.name);
    data.append("email", answers.email);
    data.append("phone", answers.phone);
    data.append(
      "_subject",
      `New growth survey lead: ${answers.brand || answers.name || "unnamed"}`
    );

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-6 py-32 text-center">
        <span className="font-display text-sm tracking-[0.3em] text-accent">
          You&apos;re In
        </span>
        <h1 className="mt-4 font-display text-4xl leading-[0.95] text-white sm:text-5xl">
          THANKS, {answers.name.split(" ")[0]?.toUpperCase() || "THERE"}.
          <br />
          WE&apos;LL BE IN <span className="text-accent">TOUCH</span>.
        </h1>
        <p className="mt-6 max-w-md text-white/60">
          We&apos;ve got what we need to plan a strategy call for{" "}
          {answers.brand || "your brand"}. Expect an email from us within one
          business day to lock in a time.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-2xl flex-col px-6 py-10">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={goBack}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-accent hover:text-accent"
        >
          ←
        </button>
        <div className="flex flex-1 gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-accent" : "bg-black/10"
              }`}
            />
          ))}
        </div>
      </div>

      <div key={step} className="animate-fade-up mt-16 flex flex-1 flex-col">
        {current && (
          <>
            <span className="font-display text-sm tracking-[0.3em] text-accent">
              Question {step + 1} of {TOTAL_STEPS}
            </span>
            <h1 className="mt-4 font-display text-3xl leading-[1.05] text-white sm:text-4xl">
              {current.question}
            </h1>

            {current.type === "text" && (
              <div className="mt-10">
                <input
                  autoFocus
                  type="text"
                  value={answers.brand}
                  onChange={(e) =>
                    setAnswers((a) => ({ ...a, brand: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && answers.brand.trim()) goNext();
                  }}
                  placeholder={current.placeholder}
                  className="w-full border-b-2 border-white/15 bg-transparent pb-3 text-2xl text-white outline-none placeholder:text-white/25 focus:border-accent"
                />
                <button
                  type="button"
                  disabled={!answers.brand.trim()}
                  onClick={goNext}
                  className="mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 font-display text-sm tracking-wide text-white shadow-[0_0_24px_-6px_rgba(229,67,67,0.7)] transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
                >
                  Continue →
                </button>
              </div>
            )}

            {current.type === "multi" && (
              <div className="mt-10">
                <div className="flex flex-wrap gap-3">
                  {current.options.map((option) => {
                    const selected = answers.needs.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleNeed(option)}
                        className={`rounded-full border px-5 py-3 text-sm font-medium transition-colors ${
                          selected
                            ? "border-accent bg-accent text-white"
                            : "border-white/15 text-white hover:border-accent"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  disabled={answers.needs.length === 0}
                  onClick={goNext}
                  className="mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 font-display text-sm tracking-wide text-white shadow-[0_0_24px_-6px_rgba(229,67,67,0.7)] transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
                >
                  Continue →
                </button>
              </div>
            )}

            {current.type === "single" && (
              <div className="mt-10 flex flex-col gap-3">
                {current.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => selectSingle(current.key as "budget" | "timeline", option)}
                    className="rounded-xl border border-white/15 px-6 py-4 text-left text-lg text-white transition-colors hover:border-accent hover:bg-accent/5"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {isContactStep && (
          <>
            <span className="font-display text-sm tracking-[0.3em] text-accent">
              Last Step
            </span>
            <h1 className="mt-4 font-display text-3xl leading-[1.05] text-white sm:text-4xl">
              Let&apos;s book a strategy call.
            </h1>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="mt-10 space-y-5"
            >
              <input
                type="text"
                required
                autoFocus
                value={answers.name}
                onChange={(e) => setAnswers((a) => ({ ...a, name: e.target.value }))}
                placeholder="Your name"
                className="w-full border-b-2 border-white/15 bg-transparent pb-3 text-xl text-white outline-none placeholder:text-white/25 focus:border-accent"
              />
              <input
                type="email"
                required
                value={answers.email}
                onChange={(e) => setAnswers((a) => ({ ...a, email: e.target.value }))}
                placeholder="Best email for you"
                className="w-full border-b-2 border-white/15 bg-transparent pb-3 text-xl text-white outline-none placeholder:text-white/25 focus:border-accent"
              />
              <input
                type="tel"
                value={answers.phone}
                onChange={(e) => setAnswers((a) => ({ ...a, phone: e.target.value }))}
                placeholder="Phone (optional)"
                className="w-full border-b-2 border-white/15 bg-transparent pb-3 text-xl text-white outline-none placeholder:text-white/25 focus:border-accent"
              />

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 font-display text-sm tracking-wide text-white shadow-[0_0_24px_-6px_rgba(229,67,67,0.7)] transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
              >
                {status === "sending" ? "Sending..." : "Book My Call →"}
              </button>

              {status === "error" && (
                <p className="text-sm text-white/50">
                  Something went wrong. Email us directly at{" "}
                  <a className="text-accent" href="mailto:uistudio9@gmail.com">
                    uistudio9@gmail.com
                  </a>
                  .
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
