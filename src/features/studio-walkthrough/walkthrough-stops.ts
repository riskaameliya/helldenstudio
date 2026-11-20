import type { RoomId } from "@/config/rooms";
import type { StudioRoom } from "@/features/studio-anatomy/types/rooms";

const tourStops = [
  { id: "portrait_l1" },
  { id: "cinema_l1" },
  { id: "record_l1" },
  { id: "express_l1" },
  { id: "diy_l1" },
  { id: "stairs_l1" },
  {
    id: "diy_self_photo_l2",
    intro:
      "Customize your photo passport with portraits, stamps, and stickers.",
  },
  { id: "self_photo_portrait_l2" },
] satisfies ReadonlyArray<{ id: RoomId; intro?: string }>;

export type WalkthroughStop = StudioRoom & { intro?: string };

export function getWalkthroughStops(rooms: StudioRoom[]): WalkthroughStop[] {
  return tourStops.map(({ id, ...content }) => {
    const room = rooms.find((item) => item.id === id);
    if (!room) throw new Error(`Missing walkthrough room: ${id}`);
    return { ...room, ...content };
  });
}

export function tourChapterId(roomId: RoomId) {
  return `tour-${roomId}`;
}
