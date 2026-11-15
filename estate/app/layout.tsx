import type { Metadata } from "next";
import "./globals.css";
import { body, display } from "./fonts";
import { site } from "@/site.config";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
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
        <Header />
        {children}
      </body>
    </html>
  );
}
