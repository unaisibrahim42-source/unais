import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import styles from "./broll.module.css";

export const metadata: Metadata = {
  title: "B-Roll — Elevate Creative Media",
  robots: { index: false, follow: false },
};

const script = Playfair_Display({
  variable: "--font-script",
  subsets: ["latin"],
  style: ["italic"],
  weight: ["700"],
});

// Chart line points (viewBox 0 0 400 260), rising left → right.
const CHART_POINTS: [number, number][] = [
  [20, 230],
  [70, 205],
  [110, 215],
  [150, 150],
  [190, 168],
  [230, 110],
  [270, 125],
  [310, 70],
  [350, 85],
];
const PEAK: [number, number] = [380, 35];

const linePath = `M${[...CHART_POINTS, PEAK].map(([x, y]) => `${x},${y}`).join(" L")}`;
const fillPath = `${linePath} L${PEAK[0]},260 L${CHART_POINTS[0][0]},260 Z`;

export default function BrollPage() {
  return (
    <div className={styles.stage}>
      <div className={`${styles.canvas} ${script.variable}`}>
        <div className={styles.glow} />
        <div className={styles.texture} />

        <svg className={styles.chart} viewBox="0 0 400 260" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="brollAreaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff5b5b" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ff5b5b" stopOpacity="0" />
            </linearGradient>
          </defs>

          <g className={styles.chartGrid}>
            <line x1="0" y1="60" x2="400" y2="60" />
            <line x1="0" y1="120" x2="400" y2="120" />
            <line x1="0" y1="180" x2="400" y2="180" />
            <line x1="0" y1="230" x2="400" y2="230" />
          </g>

          <path className={styles.chartFill} d={fillPath} />
          <path className={styles.chartLine} d={linePath} />

          {CHART_POINTS.map(([x, y], i) => (
            <circle
              key={`${x}-${y}`}
              className={styles.chartNode}
              cx={x}
              cy={y}
              r={4}
              style={{ animationDelay: `${0.5 + i * 0.2}s` }}
            />
          ))}

          <circle className={styles.chartRing} cx={PEAK[0]} cy={PEAK[1]} r={6} />
          <circle className={styles.chartPeak} cx={PEAK[0]} cy={PEAK[1]} r={6.5} />
        </svg>

        <span className={styles.chartTag}>Growth, on demand</span>

        <div className={styles.vignette} />

        <div className={styles.collage}>
          <span className={styles.kicker}>The formula —</span>
          <span className={`${styles.word} ${styles.wordAttention}`}>Attention.</span>
          <span className={`${styles.word} ${styles.wordEngage}`}>Engage.</span>
          <span className={`${styles.word} ${styles.wordElevate}`}>Elevate.</span>
          <span className={styles.elevateRule} />
        </div>

        <div className={styles.brand}>
          <span className={styles.dot} />
          <span className={styles.brandText}>Elevate Creative Media</span>
        </div>
      </div>
    </div>
  );
}
