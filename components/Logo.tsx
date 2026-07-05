import Image from "next/image";
import Link from "next/link";

export default function Logo({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Elevate Creative Media home">
      <Image
        src="/logo.png"
        alt="Elevate Creative Media"
        width={220}
        height={124}
        priority
        className={className}
        style={{ objectFit: "contain", width: "auto" }}
      />
    </Link>
  );
}
