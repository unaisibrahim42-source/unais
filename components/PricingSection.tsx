import { PRICING_PACKAGES } from "@/lib/pricing";

export default function PricingSection() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 sm:max-w-3xl">
      {PRICING_PACKAGES.map((pkg) => (
        <div
          key={pkg.name}
          className={`flex flex-col rounded-xl border-2 bg-black p-7 ${
            pkg.recommended
              ? "border-accent shadow-[0_0_40px_-12px_rgba(229,67,67,0.5)]"
              : "border-white/15"
          }`}
        >
          {pkg.recommended && (
            <span className="mb-4 inline-block w-fit rounded-full border border-accent px-3 py-1 font-display text-[10px] tracking-[0.15em] text-accent">
              Recommended
            </span>
          )}
          <h3 className="font-display text-2xl tracking-wide text-white">
            {pkg.name}
          </h3>
          <p className="mt-4">
            <span className="font-display text-4xl text-white">{pkg.price}</span>
            <span className="ml-1 text-sm text-white/50">/month</span>
          </p>
          <p className="mt-1 text-sm font-medium text-accent">{pkg.firstMonth}</p>
          <p className="mt-4 border-b border-white/10 pb-6 text-sm leading-relaxed text-white/60">
            {pkg.description}
          </p>
          <ul className="mt-6 space-y-3">
            {pkg.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-white/70">
                <span className="mt-0.5 text-accent">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
