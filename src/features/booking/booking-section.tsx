import { sectionIds } from "@/config/navigation";

import { studioInstagram } from "@/config/site";

export function BookingSection() {
  return (
    <section
      data-light-surface="oxblood"
      id={sectionIds.booking}
      aria-labelledby="booking-title"
      className="bg-oxblood"
    >
      <div className="site-gutter mx-auto grid max-w-screen-2xl gap-5 py-16 md:grid-cols-2 md:items-end md:py-24">
        <h2 id="booking-title" className="editorial-title">
          Book a session
        </h2>
        <div>
          <p>Booking details are coming soon.</p>
          <a
            href={studioInstagram.url}
            className="mt-3 inline-flex min-h-11 items-center gap-3 underline underline-offset-4 hover:decoration-2"
          >
            Contact Hellden on Instagram <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
