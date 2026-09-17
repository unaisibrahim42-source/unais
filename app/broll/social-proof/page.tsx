import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import styles from "./social-proof.module.css";

export const metadata: Metadata = {
  title: "B-Roll — Trust From Social Proof",
  robots: { index: false, follow: false },
};

const script = Playfair_Display({
  variable: "--font-script",
  subsets: ["latin"],
  style: ["italic"],
  weight: ["700"],
});

const STAR_PATH =
  "M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.2l7.1-.6L12 2z";

export default function SocialProofBrollPage() {
  return (
    <div className={styles.stage}>
      <div className={`${styles.canvas} ${script.variable}`}>
        <div className={styles.glow} />
        <div className={styles.texture} />

        <div className={styles.proof}>
          <span className={styles.quoteMark} aria-hidden="true">
            &ldquo;
          </span>

          <div className={styles.stars} aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <svg
                key={i}
                className={styles.star}
                viewBox="0 0 24 24"
                style={{ animationDelay: `${0.3 + i * 0.15}s` }}
              >
                <path d={STAR_PATH} />
              </svg>
            ))}
          </div>

          <span className={styles.rating}>
            <b>4.9</b> out of 5 — 1,240+ reviews
          </span>

          <div className={styles.avatars} aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`${styles.avatar} ${styles.avatarFill}`}
                style={{ animationDelay: `${1.5 + i * 0.12}s` }}
              />
            ))}
            <span className={`${styles.avatar} ${styles.avatarMore}`} style={{ animationDelay: "2.0s" }}>
              +1.2K
            </span>
          </div>
        </div>

        <span className={styles.proofTag}>Verified customers</span>

        <div className={styles.vignette} />

        <div className={styles.collage}>
          <span className={`${styles.word} ${styles.kicker}`}>The proof —</span>
          <span className={`${styles.word} ${styles.wordReviews}`}>Reviews.</span>
          <span className={`${styles.word} ${styles.wordTestimonials}`}>Testimonials.</span>
          <span className={`${styles.word} ${styles.wordExperience}`}>Real customer experience.</span>
          <span className={styles.rule} />
          <span className={styles.stat}>Trusted by 1,200+ businesses</span>
        </div>

        <div className={styles.brand}>
          <span className={styles.dot} />
          <span className={styles.brandText}>Elevate Creative Media</span>
        </div>
      </div>
    </div>
  );
}
