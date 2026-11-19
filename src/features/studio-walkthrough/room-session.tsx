const inclusions = [
  "No mirror",
  "2 photo strips",
  "Unlimited retakes",
  "All soft files included",
];

export function RoomSession({ price }: { price: number }) {
  return (
    <div className="mt-4 border-t border-paper/25 pt-4">
      <p className="text-lg font-semibold text-amber">{price}k/session</p>
      <ul
        aria-label="Session inclusions"
        className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs leading-relaxed uppercase"
      >
        {inclusions.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="mt-2 text-sm text-muted">Photo, GIF &amp; Live Photo</p>
    </div>
  );
}
