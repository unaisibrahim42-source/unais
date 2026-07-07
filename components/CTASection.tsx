import Container from "@/components/Container";
import Button from "@/components/Button";

export default function CTASection({
  eyebrow = "Ready when you are",
  title,
  subtitle,
  buttonLabel = "Start a Project",
  buttonHref = "/about",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  buttonLabel?: string;
  buttonHref?: string;
}) {
  return (
    <section className="relative overflow-hidden border-t border-black/10 py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 blur-[120px]" />
      <Container className="relative flex flex-col items-center text-center">
        <span className="font-display text-sm tracking-[0.25em] text-accent">
          {eyebrow}
        </span>
        <h2 className="mt-4 max-w-3xl font-display text-4xl leading-none text-black sm:text-5xl md:text-6xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-6 max-w-xl text-base text-black/60">{subtitle}</p>
        )}
        <Button href={buttonHref} className="mt-10">
          {buttonLabel}
        </Button>
      </Container>
    </section>
  );
}
