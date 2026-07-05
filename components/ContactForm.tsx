"use client";

import { useState, FormEvent } from "react";

const inputClasses =
  "w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-accent";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const company = String(data.get("company") ?? "");
    const message = String(data.get("message") ?? "");

    const subject = encodeURIComponent(`New project inquiry from ${name || "your site"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\n${message}`
    );

    window.location.href = `mailto:hello@elevatecreativemedia.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
    form.reset();
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
        className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 font-display text-sm tracking-wide text-white transition-transform hover:scale-105"
      >
        Send Message
      </button>

      {submitted && (
        <p className="text-sm text-white/50">
          Your email client should be opening now. Prefer another way to reach us?
          Email <a className="text-accent" href="mailto:hello@elevatecreativemedia.com">hello@elevatecreativemedia.com</a> directly.
        </p>
      )}
    </form>
  );
}
