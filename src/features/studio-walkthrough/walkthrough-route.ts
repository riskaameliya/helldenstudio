import type { ModelPoint } from "@/features/studio-anatomy/types/rooms";
import { corridorRevealEnd } from "./entrance-motion";
import type { WalkthroughStop } from "./walkthrough-stops";

type Pose = { position: ModelPoint; target: ModelPoint };

const corridorX = 5.35;
const eyeHeight = 1.62;
const entrance: Pose = {
  position: [corridorX, -4.4, eyeHeight],
  target: [corridorX, 1, 1.4],
};

function corridor(depth: number): Pose {
  return {
    position: [corridorX, depth, eyeHeight],
    target: [corridorX, depth + 3, 1.48],
  };
}

function insideRoom(room: WalkthroughStop): Pose {
  const [x, depth] = room.cameraTarget;
  const towardCorridor = x < corridorX ? 1 : -1;
  return {
    position: [x + towardCorridor * 1.3, depth - 0.68, eyeHeight],
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
  if (fraction >= 0.82) return insideRoom(next);

  // The corridor stays walkable between sets. Cuts handle model partitions.
  const from = previous ? corridor(previous.cameraTarget[1]) : entrance;
  const to = corridor(next.cameraTarget[1]);
  const travelStart = previous ? 0.18 : corridorRevealEnd;
  const travel = (fraction - travelStart) / (0.82 - travelStart);
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
