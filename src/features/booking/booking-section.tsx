import { sectionIds } from "@/config/navigation";

export function BookingSection() {
  return (
    <section
      id={sectionIds.booking}
      aria-labelledby="booking-title"
      className="bg-oxblood"
    >
      <div className="site-gutter mx-auto grid max-w-screen-2xl gap-5 py-16 md:grid-cols-2 md:items-end md:py-24">
        <h2 id="booking-title" className="editorial-title">
          Book a session
        </h2>
        <p>Booking details are coming soon.</p>
      </div>
    </section>
  );
}
