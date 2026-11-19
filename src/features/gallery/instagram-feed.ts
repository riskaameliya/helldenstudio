import { cacheLife } from "next/cache";
import { studioInstagram } from "@/config/site";
import { parseInstagramPosts } from "./instagram-post";

export async function getStudioInstagramPosts() {
  "use cache";
  cacheLife("minutes");
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const version = process.env.INSTAGRAM_API_VERSION;
  if (!token || !version || !/^v\d+\.\d+$/.test(version)) return [];

  const endpoint = `https://graph.instagram.com/${version}/me`;
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const profile = await fetch(`${endpoint}?fields=username`, {
      headers,
      signal: AbortSignal.timeout(4000),
    });
    if (
      !profile.ok ||
      (await profile.json()).username !== studioInstagram.username
    )
      return [];

    const fields = "id,caption,media_type,media_url,thumbnail_url,permalink";
    const feed = await fetch(`${endpoint}/media?fields=${fields}&limit=9`, {
      headers,
      signal: AbortSignal.timeout(4000),
    });
    return feed.ok ? parseInstagramPosts(await feed.json()) : [];
  } catch {
    return [];
  }
}
