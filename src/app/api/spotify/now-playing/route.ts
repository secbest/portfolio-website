import { getNowPlaying, spotifyConfigured } from "@/lib/spotify";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = spotifyConfigured() ? await getNowPlaying() : { playing: false as const };
  return Response.json(data, { headers: { "Cache-Control": "public, s-maxage=20, stale-while-revalidate=40" } });
}
