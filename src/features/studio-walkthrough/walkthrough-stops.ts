import type { RoomId } from "@/config/rooms";
import type { StudioRoom } from "@/features/studio-anatomy/types/rooms";

const groundFloorStops = [
  {
    id: "portrait_l1",
    detail: "See the backdrop and studio lighting in the portrait set.",
  },
  {
    id: "cinema_l1",
    detail:
      "Look around the cinema-themed set, with a screen and rows of seats.",
  },
  {
    id: "record_l1",
    detail: "Explore the record-themed set and its vinyl display.",
  },
  {
    id: "express_l1",
    detail:
      "Step into the train-inspired set with a bench, windows, and hanging handles.",
  },
  { id: "diy_l1", detail: "Find the DIY area with a backdrop and stools." },
] as const satisfies ReadonlyArray<{ id: RoomId; detail: string }>;

export type WalkthroughStop = StudioRoom & { detail: string };

export function getWalkthroughStops(rooms: StudioRoom[]): WalkthroughStop[] {
  return groundFloorStops.map(({ id, detail }) => {
    const room = rooms.find((item) => item.id === id && item.floor === 1);
    if (!room) throw new Error(`Missing walkthrough room: ${id}`);
    return { ...room, detail };
  });
}

export function tourChapterId(roomId: RoomId) {
  return `tour-${roomId}`;
}
