"use client";

import Image from "next/image";
import { useState } from "react";
import type { InstagramPost } from "./instagram-post";

export function InstagramGallery({ posts }: { posts: InstagramPost[] }) {
  const [active, setActive] = useState(0);
  const post = posts[active];

  if (!post) return null;

  return (
    <div className="mt-8 grid gap-6 border-y border-ink/25 py-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <a
        href={post.permalink}
        className="block"
        aria-label="View this post on Instagram"
      >
        <Image
          key={post.id}
          src={post.imageUrl}
          alt="Studio post from @helldenstudio"
          unoptimized
          width={1080}
          height={1080}
          className="aspect-square w-full bg-ink/5 object-cover sm:aspect-[4/3]"
        />
      </a>
      <div className="flex flex-col justify-between gap-4">
        {posts.length > 1 && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              aria-label="Previous post"
              disabled={active === 0}
              onClick={() => setActive(active - 1)}
              className="size-11 border border-ink/50 disabled:opacity-40"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next post"
              disabled={active === posts.length - 1}
              onClick={() => setActive(active + 1)}
              className="size-11 border border-ink/50 disabled:opacity-40"
            >
              →
            </button>
            <p role="status">
              {active + 1} / {posts.length}
            </p>
          </div>
        )}
        {post.caption && (
          <p className="line-clamp-5 max-w-prose wrap-anywhere">
            {post.caption}
          </p>
        )}
        <a
          href={post.permalink}
          className="inline-flex min-h-11 items-center text-oxblood underline underline-offset-4"
        >
          Open post on Instagram
        </a>
      </div>
    </div>
  );
}
