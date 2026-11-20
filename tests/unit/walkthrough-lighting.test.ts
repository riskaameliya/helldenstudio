import { expect, test } from "vitest";
import source from "../../public/hellden-studio-assets-v1/room-config.json";
import { readStudioRooms } from "../../src/features/studio-anatomy/lib/room-data";
import { roomLighting } from "../../src/features/studio-walkthrough/walkthrough-lighting";
import { getWalkthroughStops } from "../../src/features/studio-walkthrough/walkthrough-stops";

const route = getWalkthroughStops(readStudioRooms(source));

test("each walkthrough stop has a local accent that fades around arrival", () => {
  expect(roomLighting(route, 0, false)).toBeUndefined();

  const colors = route.map((_, index) => {
    const stop = index + 1;
    expect(roomLighting(route, stop - 0.25, false)?.weight).toBe(0);
    expect(roomLighting(route, stop - 0.09, false)?.weight).toBeCloseTo(0.5);
    expect(roomLighting(route, stop + 0.3, false)?.weight).toBeCloseTo(0.43, 1);
    const lighting = roomLighting(route, stop, false);
    expect(lighting?.weight).toBe(1);
    expect(lighting?.preset.intensity).toBeGreaterThan(0);
    return lighting?.preset.color;
  });

  expect(new Set(colors).size).toBe(route.length);
});

test("reduced motion changes lighting with the discrete camera cut", () => {
  expect(roomLighting(route, 0.49, true)).toBeUndefined();
  expect(roomLighting(route, 0.5, true)?.weight).toBe(1);
  expect(roomLighting(route, 1.49, true)?.preset).not.toEqual(
    roomLighting(route, 1.5, true)?.preset,
  );
});
