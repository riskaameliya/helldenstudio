import { studioPreviewId } from "@/config/navigation";
import styles from "./hero.module.css";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className={styles.hero}>
      <div className={styles.frame} aria-hidden="true">
        <div className={styles.aperture} />
      </div>
      <div className="site-gutter relative mx-auto flex w-full max-w-screen-2xl flex-col items-start">
        <h1 id="hero-title" className={styles.title}>
          <span>Enter the</span> <span>Hellden</span> <span>Universe</span>
        </h1>
        <a
          href={`#${studioPreviewId}`}
          className="mt-8 inline-flex min-h-11 items-center gap-5 border-b border-amber py-2 text-amber hover:text-paper"
        >
          Explore the studio <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
