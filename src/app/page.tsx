import { studioPreviewId } from "@/config/navigation";
import { Hero } from "@/features/hero/hero";
import { StudioPreview } from "@/features/studio-anatomy";

export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <Hero />
      <section
        id={studioPreviewId}
        aria-labelledby="preview-title"
        className="site-gutter mx-auto max-w-screen-2xl border-t border-paper/25 py-14 sm:py-20"
      >
        <h2
          id="preview-title"
          className="font-display text-5xl font-bold uppercase sm:text-6xl"
        >
          Studio preview
        </h2>
        <p className="mt-3 text-muted">
          A conceptual model of the two-floor studio.
        </p>
        <StudioPreview />
      </section>
    </main>
  );
}
