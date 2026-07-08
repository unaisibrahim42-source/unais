import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "outline";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-display tracking-wide transition-all duration-200";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-[0_0_24px_-6px_rgba(229,67,67,0.7)] hover:scale-105 hover:brightness-110 hover:shadow-[0_0_32px_-4px_rgba(229,67,67,0.85)]",
  outline:
    "border border-white/30 text-white hover:border-accent hover:text-accent",
};

const sizes: Record<Size, string> = {
  md: "px-7 py-3.5 text-sm",
  lg: "px-12 py-6 text-2xl sm:text-3xl",
};

export default function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
