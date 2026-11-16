"use client";

import { useState } from "react";

type Status = { state: "idle" | "sending" | "sent" } | { state: "error"; message: string };

const field =
  "w-full border-0 border-b border-line bg-transparent px-0 py-3 text-base text-ink placeholder:text-muted/70 focus:border-ink focus:ring-0 focus:outline-none transition-colors";

export function EnquiryForm({
  property,
  defaultType = "viewing",
  showTypeToggle = true,
}: {
  property?: { slug: string; title: string };
  defaultType?: "viewing" | "enquiry" | "contact";
  showTypeToggle?: boolean;
}) {
  const [type, setType] = useState(defaultType);
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type, property: property?.slug }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setStatus({ state: "sent" });
    } catch (err) {
      setStatus({ state: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  if (status.state === "sent") {
    return (
      <div className="py-10" role="status">
        <p className="font-display text-4xl font-light">Thank you.</p>
        <p className="mt-3 max-w-md text-muted">
          {type === "viewing" ? "We'll be in touch shortly to confirm your viewing." : "We'll get back to you within one working day."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6" noValidate={false}>
      {showTypeToggle && (
        <div className="inline-flex rounded-full border border-line p-1 text-[11px] tracking-[0.18em] uppercase">
          {(["viewing", "enquiry"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`rounded-full px-5 py-2.5 transition-colors ${type === t ? "bg-ink text-paper" : "text-muted hover:text-ink"}`}
            >
              {t === "viewing" ? "Book a viewing" : "Ask a question"}
            </button>
          ))}
        </div>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="sr-only">Name</span>
          <input name="name" required autoComplete="name" placeholder="Full name" className={field} />
        </label>
        <label className="block">
          <span className="sr-only">Email</span>
          <input name="email" type="email" required autoComplete="email" placeholder="Email" className={field} />
        </label>
        <label className="block">
          <span className="sr-only">Phone</span>
          <input name="phone" type="tel" autoComplete="tel" placeholder="Phone (optional)" className={field} />
        </label>
        {type === "viewing" && (
          <label className="block">
            <span className="sr-only">Preferred date</span>
            <input name="preferredDate" type="date" className={`${field} text-muted`} aria-label="Preferred date" />
          </label>
        )}
      </div>
      <label className="block">
        <span className="sr-only">Message</span>
        <textarea
          name="message"
          rows={3}
          placeholder={type === "viewing" ? "Any times that suit you best?" : "How can we help?"}
          className={`${field} resize-none`}
        />
      </label>
      {/* Honeypot */}
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="flex flex-wrap items-center gap-5 pt-2">
        <button
          type="submit"
          disabled={status.state === "sending"}
          className="rounded-full bg-brand px-8 py-4 text-[11px] tracking-[0.22em] text-paper uppercase transition-[background-color,transform] hover:bg-ink active:scale-[0.98] disabled:opacity-60"
        >
          {status.state === "sending" ? "Sending…" : type === "viewing" ? "Request viewing" : "Send enquiry"}
        </button>
        {status.state === "error" && <p className="text-sm text-red-700" role="alert">{status.message}</p>}
      </div>
    </form>
  );
}
