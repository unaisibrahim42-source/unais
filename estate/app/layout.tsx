import type { Metadata } from "next";
import "./globals.css";
import { body, display } from "./fonts";
import { site } from "@/site.config";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveals } from "@/components/Reveals";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
};

const brandVars = Object.entries(site.colors)
  .map(([k, v]) => `--${k}:${v};`)
  .join("");

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        <style>{`:root{${brandVars}}`}</style>
      </head>
      <body className="min-h-screen bg-paper text-ink">
        <SmoothScroll />
        <Reveals />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
