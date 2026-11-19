export function chapterProgress(
  scroll: number,
  starts: number[],
  holds: number[],
) {
  let chapter = starts.length - 1;
  while (chapter > 0 && scroll < starts[chapter]) chapter--;
  const next = starts[chapter + 1];
  if (next === undefined) return chapter;

  const hold = holds[chapter] ?? 0;
  const movement = next - starts[chapter] - hold;
  return (
    chapter +
    (movement > 0 ? Math.max(0, scroll - starts[chapter] - hold) / movement : 0)
  );
}
