export type InstagramPost = {
  id: string;
  caption: string;
  imageUrl: string;
  permalink: string;
};

export function parseInstagramPosts(payload: unknown): InstagramPost[] {
  if (
    !payload ||
    typeof payload !== "object" ||
    !("data" in payload) ||
    !Array.isArray(payload.data)
  )
    return [];

  return payload.data.flatMap((item): InstagramPost[] => {
    if (
      !item ||
      typeof item.id !== "string" ||
      typeof item.permalink !== "string" ||
      !/^https:\/\/(www\.)?instagram\.com\/(p|reel)\/[\w-]+\/?$/.test(
        item.permalink,
      )
    )
      return [];

    const imageUrl =
      item.media_type === "VIDEO" ? item.thumbnail_url : item.media_url;
    if (typeof imageUrl !== "string" || !/^https:\/\//.test(imageUrl))
      return [];

    return [
      {
        id: item.id,
        caption: typeof item.caption === "string" ? item.caption.trim() : "",
        imageUrl,
        permalink: item.permalink,
      },
    ];
  });
}
