import { StudioLightsButton } from "@/components/layout/studio-lighting";
import { sectionIds } from "@/config/navigation";
import styles from "./hero.module.css";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className={styles.hero}
      data-light-surface="oxblood"
    >
      <div className={styles.frame} aria-hidden="true">
        <div className={styles.aperture} />
      </div>
      <div className="site-gutter relative mx-auto flex w-full max-w-screen-2xl flex-col items-start">
        <h1 id="hero-title" className={styles.title}>
          <span>Enter the</span> <span>Hellden</span> <span>Universe</span>
        </h1>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={`#${sectionIds.studio}`}
            className="inline-flex min-h-11 items-center gap-5 border-b border-amber py-2 text-paper hover:underline underline-offset-4"
          >
            Explore the studio <span aria-hidden="true">↓</span>
          </a>
          <StudioLightsButton />
        </div>
      </div>
    </section>
  );
}
