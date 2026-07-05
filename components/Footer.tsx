import Link from "next/link";
import Logo from "@/components/Logo";
import Container from "@/components/Container";
import { NAV_LINKS } from "@/lib/nav";

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "TikTok", href: "https://tiktok.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <Container className="py-16">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Logo className="h-10 w-auto" />
            <p className="mt-5 text-sm leading-relaxed text-white/50">
              We build brands that refuse to blend in — strategy, content, and
              growth for companies that want to be unmissable.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <h3 className="font-display text-sm tracking-[0.2em] text-white/40">
                Navigate
              </h3>
              <ul className="mt-4 space-y-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-display text-sm tracking-[0.2em] text-white/40">
                Follow
              </h3>
              <ul className="mt-4 space-y-3">
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/70 transition-colors hover:text-accent"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-display text-sm tracking-[0.2em] text-white/40">
                Contact
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href="mailto:hello@elevatecreativemedia.com"
                    className="text-sm text-white/70 transition-colors hover:text-accent"
                  >
                    hello@elevatecreativemedia.com
                  </a>
                </li>
                <li className="text-sm text-white/70">+1 (555) 010-2029</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Elevate Creative Media. All rights reserved.</p>
          <p>Designed to be unmissable.</p>
        </div>
      </Container>
    </footer>
  );
}
