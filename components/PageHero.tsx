import Image from "next/image";
import Container from "@/components/Container";
import { ReactNode } from "react";

export default function PageHero({
  eyebrow,
  title,
  description,
  children,
  logo = false,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
  logo?: boolean;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-grid pb-20 pt-36 sm:pt-40">
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-accent/20 blur-[120px]" />
      <Container className="relative">
        <div
          className={
            logo
              ? "flex flex-col-reverse items-center gap-10 lg:flex-row lg:items-center lg:justify-between"
              : ""
          }
        >
          <div>
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
          </div>

          {logo && (
            <Image
              src="/logo.png"
              alt="Elevate Creative Media"
              width={640}
              height={520}
              priority
              className="h-auto w-[220px] shrink-0 sm:w-[300px] lg:w-[380px]"
            />
          )}
        </div>
      </Container>
    </section>
  );
}
