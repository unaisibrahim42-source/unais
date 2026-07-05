import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "outline";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-display text-sm tracking-wide px-7 py-3.5 transition-all duration-200";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-[0_0_24px_-6px_rgba(229,67,67,0.7)] hover:scale-105 hover:brightness-110 hover:shadow-[0_0_32px_-4px_rgba(229,67,67,0.85)]",
  outline:
    "border border-white/30 text-white hover:border-accent hover:text-accent",
};

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
