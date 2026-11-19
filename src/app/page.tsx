import { BookingSection } from "@/features/booking/booking-section";
import { EditorialGallery } from "@/features/gallery/editorial-gallery";
import { RoomIntroduction } from "@/features/room-experience/room-introduction";
import { sectionIds } from "@/config/navigation";
import { Hero } from "@/features/hero/hero";
import { StudioPreview } from "@/features/studio-anatomy";

export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <Hero />
      <section aria-labelledby="manifesto-title" className="bg-paper text-ink">
        <div className="site-gutter mx-auto max-w-screen-2xl py-16 md:py-24">
          <h2 id="manifesto-title" className="editorial-title max-w-[16ch]">
            Make a frame of your own.
          </h2>
          <p className="mt-5 max-w-prose">
            Hellden Studio is a space to play with portraiture and
            self-photography, one room at a time.
          </p>
        </div>
      </section>
      <section
        id={sectionIds.studio}
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
      <RoomIntroduction />
      <EditorialGallery />
      <BookingSection />
    </main>
  );
}
