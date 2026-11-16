import Link from "next/link";
import { site } from "@/site.config";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-paper/10 bg-brand text-paper">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-20 sm:px-10 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/65">{site.description}</p>
        </div>
        <div className="text-sm">
          <p className="mb-4 text-[11px] tracking-[0.22em] text-paper/50 uppercase">Visit</p>
          <p className="text-paper/80">{site.contact.address}</p>
          <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="mt-2 block text-paper/80 hover:text-paper">{site.contact.phone}</a>
          <a href={`mailto:${site.contact.email}`} className="mt-1 block text-paper/80 hover:text-paper">{site.contact.email}</a>
        </div>
        <div className="text-sm">
          <p className="mb-4 text-[11px] tracking-[0.22em] text-paper/50 uppercase">Explore</p>
          <ul className="space-y-2 text-paper/80">
            <li><Link href="/listings" className="hover:text-paper">Properties</Link></li>
            <li><Link href="/about" className="hover:text-paper">About</Link></li>
            <li><Link href="/contact" className="hover:text-paper">Contact</Link></li>
            <li><a href={site.social.instagram} className="hover:text-paper" target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href={site.social.linkedin} className="hover:text-paper" target="_blank" rel="noreferrer">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <p className="mx-auto max-w-[1600px] px-5 py-6 text-[11px] tracking-[0.18em] text-paper/45 uppercase sm:px-10">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
