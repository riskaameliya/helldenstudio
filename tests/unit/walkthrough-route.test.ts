import { expect, test } from "vitest";
import source from "../../public/hellden-studio-assets-v1/room-config.json";
import { readStudioRooms } from "../../src/features/studio-anatomy/lib/room-data";
import { walkthroughPose } from "../../src/features/studio-walkthrough/walkthrough-route";
import { getWalkthroughStops } from "../../src/features/studio-walkthrough/walkthrough-stops";

const stops = getWalkthroughStops(readStudioRooms(source));

test("the route crosses the doorway and reaches the confirmed ground-floor sets", () => {
  expect(stops.map(({ id }) => id)).toEqual([
    "portrait_l1",
    "cinema_l1",
    "record_l1",
    "express_l1",
    "diy_l1",
  ]);
  expect(walkthroughPose(stops, 0, false).position[1]).toBeLessThan(0);
  expect(walkthroughPose(stops, 0.64, false).position[1]).toBeGreaterThan(0);
  expect(walkthroughPose(stops, 2, false).target).toEqual(
    stops[1].cameraTarget,
  );
  expect(walkthroughPose(stops, 100, false).target).toEqual(
    stops[4].cameraTarget,
  );
});

test("reduced motion cuts to a room instead of following the corridor", () => {
  expect(walkthroughPose(stops, 1.6, true)).toEqual(
    walkthroughPose(stops, 2, true),
  );
  expect(walkthroughPose(stops, 1.6, false)).not.toEqual(
    walkthroughPose(stops, 2, false),
  );
});

test("the camera waits for the door before moving through the threshold", () => {
  expect(walkthroughPose(stops, 0.3, false)).toEqual(
    walkthroughPose(stops, 0, false),
  );
  expect(walkthroughPose(stops, 0.4, false).position[1]).toBeGreaterThan(-4.4);
});
