import { Suspense } from "react";
import { studioInstagram } from "@/config/site";
import { getStudioInstagramPosts } from "./instagram-feed";
import { InstagramGallery } from "./instagram-gallery";
import { sectionIds } from "@/config/navigation";

async function StudioPosts() {
  const posts = await getStudioInstagramPosts();
  return posts.length ? <InstagramGallery posts={posts} /> : null;
}

export function EditorialGallery() {
  return (
    <section
      data-light-surface="paper"
      id={sectionIds.gallery}
      aria-labelledby="gallery-title"
      className="bg-paper text-ink"
    >
      <div className="site-gutter mx-auto max-w-screen-2xl pb-16 md:pb-24">
        <div className="grid gap-5 border-t border-ink/25 pt-8 md:grid-cols-2 md:items-end">
          <h2 id="gallery-title" className="editorial-title">
            Studio gallery
          </h2>
          <a
            href={studioInstagram.url}
            className="inline-flex min-h-11 items-center justify-self-start text-oxblood underline underline-offset-4"
          >
            @{studioInstagram.username} on Instagram
          </a>
        </div>
        <Suspense>
          <StudioPosts />
        </Suspense>
      </div>
    </section>
  );
}
