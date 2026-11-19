import { sectionIds } from "@/config/navigation";

export function EditorialGallery() {
  return (
    <section
      id={sectionIds.gallery}
      aria-labelledby="gallery-title"
      className="bg-paper text-ink"
    >
      <div className="site-gutter mx-auto max-w-screen-2xl pb-16 md:pb-24">
        <div className="grid gap-5 border-t border-ink/25 pt-8 md:grid-cols-2 md:items-end">
          <h2 id="gallery-title" className="editorial-title">
            Studio gallery
          </h2>
          <p>Studio photography is coming soon.</p>
        </div>
      </div>
    </section>
  );
}
