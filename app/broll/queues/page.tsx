import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import styles from "./queues.module.css";

export const metadata: Metadata = {
  title: "B-Roll — Queues, Not Views",
  robots: { index: false, follow: false },
};

const script = Playfair_Display({
  variable: "--font-script",
  subsets: ["latin"],
  style: ["italic"],
  weight: ["700"],
});

// Queue points (viewBox 0 0 400 160), rising left → right toward the door.
const QUEUE_POINTS: [number, number][] = [
  [20, 130],
  [60, 122],
  [100, 114],
  [140, 106],
  [180, 98],
  [220, 90],
  [260, 82],
  [300, 74],
  [340, 66],
];
const DOOR: [number, number] = [378, 55];

const linePath = `M${QUEUE_POINTS[0][0]},${QUEUE_POINTS[0][1]} L${QUEUE_POINTS[QUEUE_POINTS.length - 1][0]},${QUEUE_POINTS[QUEUE_POINTS.length - 1][1]}`;

export default function QueuesBrollPage() {
  return (
    <div className={styles.stage}>
      <div className={`${styles.canvas} ${script.variable}`}>
        <div className={styles.glow} />
        <div className={styles.texture} />

        <svg className={styles.queue} viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden="true">
          <path className={styles.queueLine} d={linePath} />

          {QUEUE_POINTS.map(([x, y], i) => (
            <g
              key={`${x}-${y}`}
              className={`${styles.person} ${i === QUEUE_POINTS.length - 1 ? styles.personLast : ""}`}
              style={{ animationDelay: `${0.4 + i * 0.16}s` }}
            >
              <circle cx={x} cy={y - 11} r={6} />
              <rect x={x - 7} y={y - 4} width={14} height={16} rx={6} />
            </g>
          ))}

          <g className={styles.door}>
            <rect className={styles.doorFrame} x={DOOR[0] - 16} y={DOOR[1] - 16} width={32} height={32} rx={8} />
            <path
              className={styles.doorArrow}
              d={`M${DOOR[0] - 8},${DOOR[1]} L${DOOR[0] + 8},${DOOR[1]} M${DOOR[0] + 1},${DOOR[1] - 7} L${DOOR[0] + 8},${DOOR[1]} L${DOOR[0] + 1},${DOOR[1] + 7}`}
            />
          </g>
          <circle className={styles.doorRing} cx={DOOR[0]} cy={DOOR[1]} r={18} />
        </svg>

        <span className={styles.queueTag}>Bookings, not bounces</span>

        <div className={styles.vignette} />

        <div className={styles.collage}>
          <span className={`${styles.word} ${styles.kicker}`}>Not just</span>
          <span className={`${styles.word} ${styles.wordViews}`}>views.</span>
          <span className={`${styles.word} ${styles.wordQueues}`}>
            Queues<span className={styles.queuesAccent}>.</span>
          </span>
          <span className={styles.rule} />
          <span className={styles.stat}>247 booked last drop</span>
        </div>

        <div className={styles.brand}>
          <span className={styles.dot} />
          <span className={styles.brandText}>Elevate Creative Media</span>
        </div>
      </div>
    </div>
  );
}
