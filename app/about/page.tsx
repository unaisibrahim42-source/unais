import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "About & Contact | Elevate Creative Media",
  description:
    "Meet Elevate Creative Media and start a conversation about your next brand, content, or growth campaign.",
};

const VALUES = [
  {
    title: "Bold Over Safe",
    description: "We'd rather make a strong choice you feel than a safe one nobody notices.",
  },
  {
    title: "Craft Over Templates",
    description: "Every brand gets a strategy built for them, not a recycled framework.",
  },
  {
    title: "Numbers Over Vibes",
    description: "Creative is judged by performance, not just how it looks in a deck.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Elevate"
        title={
          <>
            WE&apos;RE ELEVATE.
            <br />
            NICE TO <span className="text-accent">MEET YOU</span>.
          </>
        }
        description="We're a creative agency built for brands that refuse to blend in — a small, senior team obsessed with strategy, craft, and results."
      />

      <section className="py-24">
        <Container className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="font-display text-sm tracking-[0.3em] text-accent">
              Our Story
            </span>
            <h2 className="mt-4 font-display text-3xl leading-tight text-white sm:text-4xl">
              BUILT FOR BRANDS THAT WANT TO BE UNMISSABLE
            </h2>
            <div className="mt-6 space-y-5 text-white/60">
              <p>
                Elevate Creative Media started with a simple frustration: too
                many good brands were getting lost in noisy feeds and
                forgettable campaigns. We built an agency to fix that —
                pairing sharp strategy with content and media that actually
                performs.
              </p>
              <p>
                Today we work with challenger brands across fashion, fitness,
                beauty, and consumer tech — teams who are ready to invest in
                standing out, not just showing up.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {VALUES.map((value) => (
              <div key={value.title} className="rounded-2xl border border-white/10 p-6">
                <h3 className="font-display text-lg tracking-wide text-white">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/10 py-24">
        <Container className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="font-display text-sm tracking-[0.3em] text-accent">
              Get In Touch
            </span>
            <h2 className="mt-4 font-display text-3xl leading-tight text-white sm:text-4xl">
              LET&apos;S START YOUR PROJECT
            </h2>
            <p className="mt-6 max-w-md text-white/60">
              Tell us a bit about your brand and where you want to go. We
              respond to every inquiry within one business day.
            </p>

            <div className="mt-10 space-y-6">
              <div>
                <h3 className="font-display text-sm tracking-[0.2em] text-white/40">
                  Email
                </h3>
                <a
                  href="mailto:hello@elevatecreativemedia.com"
                  className="mt-2 block text-white transition-colors hover:text-accent"
                >
                  hello@elevatecreativemedia.com
                </a>
              </div>
              <div>
                <h3 className="font-display text-sm tracking-[0.2em] text-white/40">
                  Phone
                </h3>
                <p className="mt-2 text-white">+1 (555) 010-2029</p>
              </div>
              <div>
                <h3 className="font-display text-sm tracking-[0.2em] text-white/40">
                  Studio
                </h3>
                <p className="mt-2 text-white">Los Angeles, CA</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 p-8 sm:p-10">
            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  );
}
