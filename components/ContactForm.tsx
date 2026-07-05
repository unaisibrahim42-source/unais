"use client";

import { useState, FormEvent } from "react";

const inputClasses =
  "w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-accent";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (!FORMSPREE_ID) {
      const name = String(data.get("name") ?? "");
      const email = String(data.get("email") ?? "");
      const company = String(data.get("company") ?? "");
      const message = String(data.get("message") ?? "");
      const subject = encodeURIComponent(`New project inquiry from ${name || "your site"}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\n${message}`
      );
      window.location.href = `mailto:hello@elevatecreativemedia.com?subject=${subject}&body=${body}`;
      setStatus("sent");
      form.reset();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-xs tracking-wide text-white/50">
            Name
          </label>
          <input id="name" name="name" type="text" required className={inputClasses} placeholder="Jane Doe" />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-xs tracking-wide text-white/50">
            Email
          </label>
          <input id="email" name="email" type="email" required className={inputClasses} placeholder="jane@brand.com" />
        </div>
      </div>

      <div>
        <label htmlFor="company" className="mb-2 block text-xs tracking-wide text-white/50">
          Company
        </label>
        <input id="company" name="company" type="text" className={inputClasses} placeholder="Your brand" />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-xs tracking-wide text-white/50">
          Tell us about your project
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={inputClasses}
          placeholder="What are you looking to elevate?"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 font-display text-sm tracking-wide text-white shadow-[0_0_24px_-6px_rgba(229,67,67,0.7)] transition-all hover:scale-105 hover:shadow-[0_0_32px_-4px_rgba(229,67,67,0.85)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>

      {status === "sent" && (
        <p className="text-sm text-white/50">
          {FORMSPREE_ID
            ? "Thanks — your message is on its way. We'll be in touch within one business day."
            : "Your email client should be opening now. Prefer another way to reach us?"}{" "}
          Email <a className="text-accent" href="mailto:hello@elevatecreativemedia.com">hello@elevatecreativemedia.com</a> directly.
        </p>
      )}

      {status === "error" && (
        <p className="text-sm text-white/50">
          Something went wrong sending that. Please email us directly at{" "}
          <a className="text-accent" href="mailto:hello@elevatecreativemedia.com">
            hello@elevatecreativemedia.com
          </a>
          .
        </p>
      )}
    </form>
  );
}
