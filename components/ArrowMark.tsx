export default function ArrowMark({ className = "h-40 w-40" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 200" className={className} fill="currentColor" aria-hidden="true">
      <path d="M0 120 L45 70 L90 120 L63 120 L63 200 L27 200 L27 120 Z" />
      <path d="M105 70 L150 20 L195 70 L168 70 L168 200 L132 200 L132 70 Z" />
      <path d="M210 95 L255 45 L300 95 L273 95 L273 200 L237 200 L237 95 Z" />
    </svg>
  );
}
