import { describe, expect, it } from "vitest";
import roomConfig from "../../public/hellden-studio-assets-v1/room-config.json";
import { readStudioRooms } from "../../src/features/studio-anatomy/lib/room-data";

describe("studio room data", () => {
  it("preserves the canonical ordering, IDs, and two floor groups", () => {
    const rooms = readStudioRooms(roomConfig);
    expect(rooms.map(({ id }) => id)).toEqual(
      roomConfig.rooms.map(({ id }) => id),
    );
    expect(rooms.filter(({ floor }) => floor === 1)).toHaveLength(9);
    expect(rooms.filter(({ floor }) => floor === 2)).toHaveLength(3);
  });

  it.each([
    [{ id: "unknown" }, "Unknown or duplicate room ID"],
    [{ id: "portrait_l1" }, "Unknown or duplicate room ID"],
    [{ floor: 2 }, "Invalid floor"],
    [{ bounds: { x: [2, 1], y: [0, 1] } }, "Invalid model coordinates"],
    [{ cameraTarget: [0, Infinity, 0] }, "Invalid model coordinates"],
  ] as const)("rejects invalid room data %#", (overrides, error) => {
    const config = structuredClone(roomConfig);
    Object.assign(config.rooms[0], overrides);
    expect(() => readStudioRooms(config)).toThrow(error);
  });
});
