import type { RoomId } from "@/config/rooms";
import type { StudioRoom } from "@/features/studio-anatomy/types/rooms";

const tourStops = [
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
  {
    id: "stairs_l1",
    detail: "The staircase at the rear leads to the second floor.",
  },
  {
    id: "diy_self_photo_l2",
    detail: "Explore the upstairs DIY self-photo set and its backdrop.",
  },
  {
    id: "operator_cashier_l2",
    detail:
      "See where the operator and cashier are located on the second floor.",
  },
  {
    id: "self_photo_portrait_l2",
    detail:
      "Look around the front portrait set with a backdrop, camera, and studio lights.",
  },
] as const satisfies ReadonlyArray<{ id: RoomId; detail: string }>;

export type WalkthroughStop = StudioRoom & { detail: string };

export function getWalkthroughStops(rooms: StudioRoom[]): WalkthroughStop[] {
  return tourStops.map(({ id, detail }) => {
    const room = rooms.find((item) => item.id === id);
    if (!room) throw new Error(`Missing walkthrough room: ${id}`);
    return { ...room, detail };
  });
}

export function tourChapterId(roomId: RoomId) {
  return `tour-${roomId}`;
}
