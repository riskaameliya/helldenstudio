import type { RoomId } from "@/config/rooms";

export const floors = [1, 2] as const;
export type FloorId = (typeof floors)[number];

export type StudioRoom = {
  id: RoomId;
  floor: FloorId;
  name: string;
};

export type StudioSelection =
  | { kind: "building" }
  | { kind: "floor"; floor: FloorId }
  | { kind: "room"; roomId: RoomId };
