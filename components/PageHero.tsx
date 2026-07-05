import Container from "@/components/Container";
import { ReactNode } from "react";

export default function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-grid pb-20 pt-36 sm:pt-40">
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-accent/20 blur-[120px]" />
      <Container className="relative">
        <span className="font-display text-sm tracking-[0.3em] text-accent">
          {eyebrow}
        </span>
        <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[0.95] text-white sm:text-6xl md:text-7xl">
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-2xl text-lg text-white/60">{description}</p>
        )}
        {children}
      </Container>
    </section>
  );
}
