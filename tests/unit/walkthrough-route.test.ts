import { expect, test } from "vitest";
import source from "../../public/hellden-studio-assets-v1/room-config.json";
import { readStudioRooms } from "../../src/features/studio-anatomy/lib/room-data";
import { walkthroughPose } from "../../src/features/studio-walkthrough/walkthrough-route";
import { getWalkthroughStops } from "../../src/features/studio-walkthrough/walkthrough-stops";

const stops = getWalkthroughStops(readStudioRooms(source));

test("the route crosses the doorway and reaches the confirmed ground-floor sets", () => {
  expect(stops.filter(({ floor }) => floor === 1).map(({ id }) => id)).toEqual([
    "portrait_l1",
    "cinema_l1",
    "record_l1",
    "express_l1",
    "diy_l1",
    "stairs_l1",
  ]);
  expect(walkthroughPose(stops, 0, false).position[1]).toBeLessThan(0);
  expect(walkthroughPose(stops, 0.64, false).position[1]).toBeGreaterThan(0);
  expect(walkthroughPose(stops, 2, false).target).toEqual(
    stops[1].cameraTarget,
  );
  expect(walkthroughPose(stops, 100, false).target).toEqual(
    stops.at(-1)?.cameraTarget,
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

test("stairs climb to the landing cut and the upper-floor rooms keep their source anchors", () => {
  const stairs = stops.findIndex(({ id }) => id === "stairs_l1") + 1;
  const approach = walkthroughPose(stops, stairs, false);
  const nearSlab = walkthroughPose(stops, stairs + 0.54, false);
  const upstairs = walkthroughPose(stops, stairs + 0.56, false);
  expect(nearSlab.position[2]).toBeGreaterThan(approach.position[2]);
  expect(nearSlab.position[2]).toBeLessThan(3.98);
  expect(upstairs.position[2]).toBeGreaterThan(4.25);
  const upperRooms = stops.filter(({ floor }) => floor === 2);
  expect(upperRooms.map(({ id }) => id)).toEqual([
    "diy_self_photo_l2",
    "self_photo_portrait_l2",
  ]);
  for (const room of upperRooms) {
    const progress = stops.indexOf(room) + 1;
    expect(walkthroughPose(stops, progress, false).target).toEqual(
      room.cameraTarget,
    );
    expect(walkthroughPose(stops, progress, true).position[2]).toBeGreaterThan(
      4.25,
    );
  }
});

test("chapter progress holds the Portrait camera while all gallery photos scroll", async () => {
  const { chapterProgress } =
    await import("../../src/features/studio-walkthrough/chapter-progress");
  const starts = [0, 800, 2800, 3600];
  expect(chapterProgress(800, starts, [0, 1200, 0])).toBe(1);
  expect(chapterProgress(1900, starts, [0, 1200, 0])).toBe(1);
  expect(chapterProgress(2400, starts, [0, 1200, 0])).toBe(1.5);
  expect(chapterProgress(2800, starts, [0, 1200, 0])).toBe(2);
  expect(chapterProgress(3100, starts, [0, 1200, 400])).toBe(2);
});
