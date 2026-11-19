import { sectionIds } from "@/config/navigation";

export function RoomIntroduction() {
  return (
    <section
      id={sectionIds.rooms}
      aria-labelledby="rooms-title"
      className="bg-paper text-ink"
    >
      <div className="site-gutter mx-auto grid max-w-screen-2xl gap-8 py-16 md:grid-cols-2 md:py-24">
        <h2 id="rooms-title" className="editorial-title">
          Two floors. Different frames.
        </h2>
        <dl className="divide-y divide-ink/20 border-y border-ink/20">
          <div className="py-5">
            <dt className="mb-2 font-semibold text-oxblood">Floor 1</dt>
            <dd>
              Hellden Portrait, Cinema, Record, Express, and the DIY photography
              area.
            </dd>
          </div>
          <div className="py-5">
            <dt className="mb-2 font-semibold text-oxblood">Floor 2</dt>
            <dd>DIY Self Photo and Customizable Self Photo Portrait.</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
