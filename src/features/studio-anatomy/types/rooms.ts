import type { RoomId } from "@/config/rooms";

export const floors = [1, 2] as const;
export type FloorId = (typeof floors)[number];

export type ModelPoint = [number, number, number];

export type StudioRoom = {
  id: RoomId;
  floor: FloorId;
  name: string;
  cameraTarget: ModelPoint;
};

export type StudioSelection =
  | { kind: "building" }
  | { kind: "floor"; floor: FloorId }
  | { kind: "room"; roomId: RoomId };

export type StudioModelView = {
  manual: boolean;
  rooms: StudioRoom[];
  activeFloor?: FloorId;
  activeRoom?: StudioRoom;
  onSelect: (room: StudioRoom) => void;
};
