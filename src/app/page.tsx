import { BookingSection } from "@/features/booking/booking-section";
import { EditorialGallery } from "@/features/gallery/editorial-gallery";
import { Hero } from "@/features/hero/hero";
import { StudioExploration } from "@/features/studio-anatomy";
import { readStudioRooms } from "@/features/studio-anatomy/lib/room-data";
import roomConfig from "../../public/hellden-studio-assets-v1/room-config.json";

const rooms = readStudioRooms(roomConfig);

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
      <StudioExploration rooms={rooms} />
      <EditorialGallery />
      <BookingSection />
    </main>
  );
}
