import type { Metadata } from "next";
import styles from "./broll.module.css";

export const metadata: Metadata = {
  title: "B-Roll — Elevate Creative Media",
  robots: { index: false, follow: false },
};

// Swap these to change the 3 words on screen — each cycles for 3s in a 9s loop.
const KEYWORDS: { word: string; sub: string; icon: "spark" | "engage" | "elevate" }[] = [
  { word: "Attention", sub: "Stop the scroll", icon: "spark" },
  { word: "Engage", sub: "Hold the room", icon: "engage" },
  { word: "Elevate", sub: "Make it stick", icon: "elevate" },
];

const wordIcons: Record<string, React.ReactNode> = {
  spark: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />
    </svg>
  ),
  engage: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16v11H9l-4 4z" />
      <circle cx="8.5" cy="10.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="12" cy="10.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="10.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  ),
  elevate: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 18L18 6" />
      <polyline points="9 6 18 6 18 15" />
    </svg>
  ),
};

export default function BrollPage() {
  return (
    <div className={styles.stage}>
      <div className={styles.canvas}>
        <div className={styles.grid} />
        <div className={styles.vignette} />
        <div className={styles.scan} />

        <span className={`${styles.corner} ${styles.cornerTL}`} />
        <span className={`${styles.corner} ${styles.cornerTR}`} />
        <span className={`${styles.corner} ${styles.cornerBL}`} />
        <span className={`${styles.corner} ${styles.cornerBR}`} />

        <span className={styles.tag}>Elevate Creative Media</span>
        <span className={`${styles.tag} ${styles.tagRight}`}>No. 001 — Brand Film</span>

        <div className={`${styles.icon} ${styles.iconGrowth}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18" />
            <path d="M4 15l5-5 4 4 7-8" />
            <polyline points="16 6 20 6 20 10" />
          </svg>
        </div>

        <div className={`${styles.icon} ${styles.iconAccent} ${styles.iconTarget}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="5.3" />
            <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
          </svg>
        </div>

        <div className={`${styles.icon} ${styles.iconMega}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 10v4a1 1 0 0 0 1 1h2l5 4V5L6 9H4a1 1 0 0 0-1 1z" />
            <path d="M14 8a4 4 0 0 1 0 8" />
            <path d="M17 5a8 8 0 0 1 0 14" />
          </svg>
        </div>

        <div className={`${styles.icon} ${styles.iconAccent} ${styles.iconSpark}`}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />
          </svg>
        </div>

        <div className={styles.words}>
          {KEYWORDS.map((k, i) => (
            <div key={k.word} className={`${styles.word} ${styles[`word${i + 1}`]}`}>
              <div className={styles.wordIcon}>{wordIcons[k.icon]}</div>
              <div className={styles.wordText}>{k.word}</div>
              <div className={styles.wordBar} />
              <div className={styles.wordSub}>{k.sub}</div>
            </div>
          ))}
        </div>

        <div className={styles.brand}>
          <span className={styles.dot} />
          <span className={styles.brandText}>Elevate Creative Media</span>
        </div>
      </div>
    </div>
  );
}
