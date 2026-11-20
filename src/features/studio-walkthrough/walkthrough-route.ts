import type { ModelPoint } from "@/features/studio-anatomy/types/rooms";
import { corridorRevealEnd } from "./entrance-motion";
import type { WalkthroughStop } from "./walkthrough-stops";

type Pose = { position: ModelPoint; target: ModelPoint };

export const roomArrivalFraction = 0.82;

const corridorX = 5.35;
const eyeHeight = 1.62;
// Authored viewpoints for the blockout. The GLB has a solid upper slab.
const stairApproach: Pose = {
  position: [3.95, 14.05, eyeHeight],
  target: [2.25, 14.45, 1.55],
};
const stairTop: Pose = {
  position: [3.72, 14.05, 3.72],
  target: [2.18, 14.05, 2.92],
};
const upperLandingDepth = 13.2;
const entrance: Pose = {
  position: [corridorX, -4.4, eyeHeight],
  target: [corridorX, 1, 1.4],
};

function floorHeight(room: WalkthroughStop) {
  // The source camera targets sit 1.2 conceptual units above their floor.
  return room.cameraTarget[2] - 1.2;
}

function corridor(depth: number, elevation = 0, direction = 1): Pose {
  return {
    position: [corridorX, depth, eyeHeight + elevation],
    target: [corridorX, depth + direction * 3, 1.48 + elevation],
  };
}

function insideRoom(room: WalkthroughStop): Pose {
  if (room.id === "stairs_l1") return stairApproach;
  const [x, depth] = room.cameraTarget;
  const height = eyeHeight + floorHeight(room);
  if (room.id === "diy_self_photo_l2") {
    return { position: [x, depth - 1.5, height], target: room.cameraTarget };
  }
  const towardCorridor = x < corridorX ? 1 : -1;
  return {
    position: [x + towardCorridor * 1.3, depth - 0.68, height],
    target: room.cameraTarget,
  };
}

function interpolate(
  from: ModelPoint,
  to: ModelPoint,
  progress: number,
): ModelPoint {
  return [
    from[0] + (to[0] - from[0]) * progress,
    from[1] + (to[1] - from[1]) * progress,
    from[2] + (to[2] - from[2]) * progress,
  ];
}

export function walkthroughPose(
  stops: WalkthroughStop[],
  progress: number,
  reducedMotion: boolean,
): Pose {
  const bounded = Math.min(Math.max(progress, 0), stops.length);
  if (reducedMotion) {
    const stop = stops[Math.round(bounded) - 1];
    return stop ? insideRoom(stop) : entrance;
  }

  const chapter = Math.floor(bounded);
  const previous = stops[chapter - 1];
  const next = stops[chapter];
  const fraction = bounded - chapter;

  if (!next || (previous && fraction < 0.18))
    return previous ? insideRoom(previous) : entrance;
  if (!previous && fraction <= corridorRevealEnd) return entrance;
  if (fraction >= roomArrivalFraction) return insideRoom(next);

  // Cut from the top of the stairs to the upper landing, avoiding the solid slab.
  if (previous?.id === "stairs_l1" && next.floor === 2 && fraction < 0.55) {
    const climb = (fraction - 0.18) / (0.55 - 0.18);
    return {
      position: interpolate(stairApproach.position, stairTop.position, climb),
      target: interpolate(stairApproach.target, stairTop.target, climb),
    };
  }

  const elevation = floorHeight(next);
  const previousDepth =
    previous?.floor === next.floor
      ? previous.cameraTarget[1]
      : upperLandingDepth;
  const nextDepth = next.id === "stairs_l1" ? 13.4 : next.cameraTarget[1];
  const direction = nextDepth < previousDepth && previous ? -1 : 1;
  const from = previous
    ? corridor(previousDepth, elevation, direction)
    : entrance;
  const to = corridor(nextDepth, elevation, direction);
  const travelStart = !previous
    ? corridorRevealEnd
    : previous.floor === next.floor
      ? 0.18
      : 0.55;
  const travel = (fraction - travelStart) / (roomArrivalFraction - travelStart);
  const turn = Math.max(0, (travel - 0.72) / 0.28);

  return {
    position: interpolate(from.position, to.position, travel),
    target: interpolate(
      interpolate(from.target, to.target, travel),
      next.cameraTarget,
      turn,
    ),
  };
}
