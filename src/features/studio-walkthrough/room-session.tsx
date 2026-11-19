const inclusions = [
  "No mirror",
  "2 photo strips",
  "Unlimited retakes",
  "All soft files included",
];

export function RoomSession({
  price,
  passportAddOn,
}: {
  price: number;
  passportAddOn?: number;
}) {
  return (
    <div className="mt-4 border-t border-paper/25 pt-4 max-md:mt-3 max-md:pt-2">
      <p className="text-lg font-semibold text-amber max-md:text-sm">
        {price}k/session
      </p>
      {passportAddOn === undefined ? (
        <>
          <ul
            aria-label="Session inclusions"
            className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs leading-relaxed uppercase max-md:mt-2 max-md:leading-snug"
          >
            {inclusions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-muted max-md:text-xs">
            Photo, GIF &amp; Live Photo
          </p>
        </>
      ) : (
        <p className="mt-2 text-sm text-muted max-md:text-xs">
          +{passportAddOn}k for DIY passport
        </p>
      )}
    </div>
  );
}
