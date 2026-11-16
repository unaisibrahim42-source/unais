import type { Metadata } from "next";
import { site } from "@/site.config";
import { EnquiryForm } from "@/components/EnquiryForm";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main className="mx-auto grid max-w-[1600px] gap-20 px-5 pt-36 pb-28 sm:px-10 sm:pt-48 lg:grid-cols-[1fr_1.3fr] lg:gap-28">
      <div>
        <p className="mb-6 text-[11px] tracking-[0.24em] text-muted uppercase">Contact</p>
        <h1 className="font-display text-6xl leading-[0.95] font-light sm:text-7xl">
          Let&rsquo;s talk <em>homes.</em>
        </h1>
        <p className="mt-8 max-w-md text-lg leading-relaxed text-ink/75">
          Book a viewing, ask about a property, or arrange a valuation. We reply within one working day.
        </p>
        <dl className="mt-14 space-y-8 text-sm">
          <div>
            <dt className="mb-2 text-[11px] tracking-[0.2em] text-muted uppercase">Office</dt>
            <dd className="font-display text-2xl">{site.contact.address}</dd>
          </div>
          <div>
            <dt className="mb-2 text-[11px] tracking-[0.2em] text-muted uppercase">Telephone</dt>
            <dd className="font-display text-2xl"><a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="hover:text-accent">{site.contact.phone}</a></dd>
          </div>
          <div>
            <dt className="mb-2 text-[11px] tracking-[0.2em] text-muted uppercase">Email</dt>
            <dd className="font-display text-2xl"><a href={`mailto:${site.contact.email}`} className="hover:text-accent">{site.contact.email}</a></dd>
          </div>
        </dl>
      </div>
      <div className="lg:pt-24">
        <EnquiryForm defaultType="contact" showTypeToggle={false} />
      </div>
    </main>
  );
}
