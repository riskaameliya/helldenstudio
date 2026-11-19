export const doorOpenEnd = 0.22;
export const corridorRevealEnd = 0.36;

function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function entranceMotion(progress: number) {
  return {
    angle: 96 * clampProgress(progress / doorOpenEnd),
    corridorOpacity: clampProgress(
      (progress - doorOpenEnd) / (corridorRevealEnd - doorOpenEnd),
    ),
  };
}
