import type { RoomId } from "@/config/rooms";
import type { ModelPoint } from "@/features/studio-anatomy/types/rooms";
import { roomArrivalFraction } from "./walkthrough-route";

type LightingPreset = {
  position: ModelPoint;
  color: string;
  intensity: number;
  distance: number;
  fill: number;
};

const roomLightingPresets: Partial<Record<RoomId, LightingPreset>> = {
  portrait_l1: {
    position: [2.95, 3.6, 2.3],
    color: "#ffd2ad",
    intensity: 12,
    distance: 3.8,
    fill: 0.64,
  },
  cinema_l1: {
    position: [2.85, 5.95, 2.12],
    color: "#ff3428",
    intensity: 27,
    distance: 4.5,
    fill: 0.28,
  },
  record_l1: {
    position: [2.9, 8.9, 2.23],
    color: "#ffb66c",
    intensity: 13,
    distance: 3.8,
    fill: 0.52,
  },
  express_l1: {
    position: [2.8, 11.6, 2.28],
    color: "#a5d7ff",
    intensity: 14,
    distance: 4,
    fill: 0.58,
  },
  diy_l1: {
    position: [7.7, 8, 2.25],
    color: "#ffc9dc",
    intensity: 12,
    distance: 4,
    fill: 0.68,
  },
  stairs_l1: {
    position: [2.9, 14.5, 2.5],
    color: "#ffe1a8",
    intensity: 10,
    distance: 3.5,
    fill: 0.7,
  },
  diy_self_photo_l2: {
    position: [7.8, 7.95, 6.42],
    color: "#f4cbff",
    intensity: 12,
    distance: 4,
    fill: 0.63,
  },
  self_photo_portrait_l2: {
    position: [5.55, 1.28, 6.42],
    color: "#e0e9ff",
    intensity: 13,
    distance: 3.8,
    fill: 0.66,
  },
};

export const defaultWalkthroughLights = {
  ambient: 0.65,
  hemisphere: 2,
  directional: 1.5,
};

const fadeInStart = roomArrivalFraction - 1;
const fadeInEnd = 0;
const fadeOutStart = 0.18;
const fadeOutEnd = 0.4;

export function roomLighting(
  stops: readonly { id: RoomId }[],
  progress: number,
  reducedMotion: boolean,
) {
  const chapter = Math.round(progress);
  const roomId = stops[chapter - 1]?.id;
  const preset = roomId && roomLightingPresets[roomId];
  if (!preset) return undefined;

  const offset = progress - chapter;
  const fadeIn = (offset - fadeInStart) / (fadeInEnd - fadeInStart);
  const fadeOut = (fadeOutEnd - offset) / (fadeOutEnd - fadeOutStart);
  const blend = Math.max(0, Math.min(1, fadeIn, fadeOut));
  const weight = reducedMotion ? 1 : blend * blend * (3 - 2 * blend);
  return { preset, weight };
}
