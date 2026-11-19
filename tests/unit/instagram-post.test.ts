import { expect, test } from "vitest";
import { parseInstagramPosts } from "../../src/features/gallery/instagram-post";

test("uses an Instagram video cover and drops invalid links and missing covers", () => {
  const video = {
    id: "video",
    caption: " Studio portrait ",
    media_type: "VIDEO",
    media_url: "https://example.com/video.mp4",
    thumbnail_url: "https://example.com/cover.jpg",
    permalink: "https://www.instagram.com/reel/example/",
  };
  expect(
    parseInstagramPosts({
      data: [
        video,
        { ...video, id: "missing-cover", thumbnail_url: undefined },
        {
          ...video,
          id: "invalid-link",
          permalink: "https://instagram.com.example.com/reel/example/",
        },
      ],
    }),
  ).toEqual([
    {
      id: "video",
      caption: "Studio portrait",
      imageUrl: "https://example.com/cover.jpg",
      permalink: video.permalink,
    },
  ]);
  expect(parseInstagramPosts({ error: "unavailable" })).toEqual([]);
});
