import { roomNames, type RoomId } from "@/config/rooms";
import type { StudioRoom } from "../types/rooms";

type SourceRoom = {
  id: string;
  floor: number;
  bounds: { x: number[]; y: number[] };
  center: number[];
  cameraTarget: number[];
};

function isRoomId(id: string): id is RoomId {
  return Object.prototype.hasOwnProperty.call(roomNames, id);
}

function isFiniteTuple(values: number[], length: number) {
  return values.length === length && values.every(Number.isFinite);
}

function isOrderedRange(values: number[]) {
  return isFiniteTuple(values, 2) && values[0] < values[1];
}

export function readStudioRooms(source: {
  floors: number;
  rooms: SourceRoom[];
}): StudioRoom[] {
  if (
    source.floors !== 2 ||
    source.rooms.length !== Object.keys(roomNames).length
  ) {
    throw new Error(
      "Expected two studio floors and the complete room inventory.",
    );
  }

  const seen = new Set<RoomId>();
  return source.rooms.map(({ id, floor, bounds, center, cameraTarget }) => {
    if (!isRoomId(id) || seen.has(id)) {
      throw new Error(`Unknown or duplicate room ID: ${id}`);
    }
    if ((floor !== 1 && floor !== 2) || !id.endsWith(`_l${floor}`)) {
      throw new Error(`Invalid floor for ${id}`);
    }
    if (
      !isOrderedRange(bounds.x) ||
      !isOrderedRange(bounds.y) ||
      !isFiniteTuple(center, 3) ||
      !isFiniteTuple(cameraTarget, 3)
    ) {
      throw new Error(`Invalid model coordinates for ${id}`);
    }

    seen.add(id);
    return { id, floor, name: roomNames[id] };
  });
}
