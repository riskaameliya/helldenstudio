import { BookingSection } from "@/features/booking/booking-section";
import { EditorialGallery } from "@/features/gallery/editorial-gallery";
import { Manifesto } from "@/features/manifesto/manifesto";
import { StudioWalkthrough } from "@/features/studio-walkthrough/studio-walkthrough";
import { getWalkthroughStops } from "@/features/studio-walkthrough/walkthrough-stops";
import { StudioExploration } from "@/features/studio-anatomy";
import { readStudioRooms } from "@/features/studio-anatomy/lib/room-data";
import roomConfig from "../../public/hellden-studio-assets-v1/room-config.json";

const rooms = readStudioRooms(roomConfig);
const stops = getWalkthroughStops(rooms);

export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <StudioWalkthrough stops={stops} />
      <Manifesto />
      <StudioExploration rooms={rooms} />
      <EditorialGallery />
      <BookingSection />
    </main>
  );
}
