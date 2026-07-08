import { CaseStudyIconName } from "@/lib/case-studies";

export default function CaseStudyIcon({
  name,
  className = "h-7 w-7",
}: {
  name: CaseStudyIconName;
  className?: string;
}) {
  switch (name) {
    case "rocket":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 2 L17 10 L14.5 10 L14.5 16 L9.5 16 L9.5 10 L7 10 Z" />
          <path d="M9 17 L6 22 L9.5 19.5 Z" />
          <path d="M15 17 L18 22 L14.5 19.5 Z" />
        </svg>
      );
    case "trending":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <rect x="3" y="14" width="4" height="8" />
          <rect x="10" y="9" width="4" height="13" />
          <rect x="17" y="4" width="4" height="18" />
          <path d="M3 8 L10 3 L17 6 L21 2 L21 5 L17 9 L10 6 L4 10.5 Z" />
        </svg>
      );
    case "target":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 1 L14 9 L22 11 L14 13 L12 22 L10 13 L2 11 L10 9 Z" />
        </svg>
      );
    case "monitor":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2.5" y="4" width="19" height="13" rx="1.5" />
          <path d="M8 21 L16 21 M12 17 L12 21" strokeLinecap="round" />
        </svg>
      );
    case "globe":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <ellipse cx="12" cy="12" rx="4" ry="9" />
          <path d="M3 12 L21 12 M4.5 7 L19.5 7 M4.5 17 L19.5 17" />
        </svg>
      );
    case "megaphone":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M2 10v4a2 2 0 002 2h1.5l1.2 5h2.1l-1.2-5H9l8 4V6l-8 4H4a2 2 0 00-2 2z" />
          <path
            d="M15.5 8.5a4.5 4.5 0 010 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M18.5 6a8 8 0 010 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}
