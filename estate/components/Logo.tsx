import { site } from "@/site.config";

export function Logo({ className = "" }: { className?: string }) {
  if (site.logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={site.logo} alt={site.name} className={`h-7 w-auto ${className}`} />;
  }
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <span className="grid h-9 w-9 place-items-center rounded-full border border-current font-display text-[13px] tracking-tight">{site.monogram}</span>
      <span className="font-display text-xl tracking-wide sm:text-2xl">{site.name}</span>
    </span>
  );
}
