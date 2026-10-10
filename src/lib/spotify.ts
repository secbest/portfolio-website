const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API = "https://api.spotify.com/v1";

export type ArtistItem = { name: string; image: string | null; url: string };
export type TrackItem = { name: string; artist: string; image: string | null; url: string };
export type PlaylistItem = { name: string; image: string | null; url: string };
export type RangeStats = { artists: ArtistItem[]; tracks: TrackItem[]; genres: string[] };

export type SpotifyOverview = {
  /** Top items over roughly the last four weeks. */
  stats: RangeStats;
  recent: TrackItem[];
  /** null when the token was issued without the user-library-read scope. */
  saved: TrackItem[] | null;
  /** null when the token was issued without the playlist-read-private scope. */
  playlists: PlaylistItem[] | null;
};

export type NowPlaying = { playing: false } | ({ playing: true } & TrackItem);

export const spotifyConfigured = () =>
  Boolean(
    process.env.SPOTIFY_CLIENT_ID &&
      process.env.SPOTIFY_CLIENT_SECRET &&
      process.env.SPOTIFY_REFRESH_TOKEN,
  );

async function accessToken(fresh = false): Promise<string | null> {
  const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret, SPOTIFY_REFRESH_TOKEN: refresh } = process.env;
  if (!id || !secret || !refresh) return null;
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh }),
    ...(fresh ? { cache: "no-store" as const } : { next: { revalidate: 3000 } }),
  });
  if (!res.ok) return null;
  return ((await res.json()) as { access_token?: string }).access_token ?? null;
}

async function get<T>(token: string, path: string, revalidate: number | false = 3600): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      ...(revalidate === false ? { cache: "no-store" as const } : { next: { revalidate } }),
    });
    if (!res.ok || res.status === 204) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

type Image = { url: string };
type Artist = { name: string; genres?: string[]; images?: Image[]; external_urls: { spotify: string } };
type Track = {
  name: string;
  artists: { name: string }[];
  album: { images: Image[] };
  external_urls: { spotify: string };
};
type Playlist = { name: string; public: boolean | null; images: Image[] | null; external_urls: { spotify: string } };

const toArtist = (a: Artist): ArtistItem => ({ name: a.name, image: a.images?.[0]?.url ?? null, url: a.external_urls.spotify });
const toTrack = (t: Track): TrackItem => ({
  name: t.name,
  artist: t.artists[0]?.name ?? "",
  image: t.album.images[0]?.url ?? null,
  url: t.external_urls.spotify,
});

/** Most common genres across a list of artists. */
function topGenres(artists: Artist[], limit = 6): string[] {
  const counts = new Map<string, number>();
  for (const a of artists) for (const g of a.genres ?? []) counts.set(g, (counts.get(g) ?? 0) + 1);
  return [...counts.entries()].sort((x, y) => y[1] - x[1]).slice(0, limit).map(([g]) => g);
}

/** Everything the stats card needs. Returns null if Spotify is unavailable. */
export async function getSpotifyOverview(): Promise<SpotifyOverview | null> {
  const token = await accessToken();
  if (!token) return null;

  const [artists, tracks, recent, saved, playlists] = await Promise.all([
    get<{ items: Artist[] }>(token, "/me/top/artists?limit=20&time_range=short_term"),
    get<{ items: Track[] }>(token, "/me/top/tracks?limit=5&time_range=short_term"),
    get<{ items: { track: Track }[] }>(token, "/me/player/recently-played?limit=5"),
    get<{ items: { track: Track }[] }>(token, "/me/tracks?limit=3"),
    get<{ items: Playlist[] }>(token, "/me/playlists?limit=20"),
  ]);

  const stats: RangeStats = {
    artists: (artists?.items ?? []).slice(0, 5).map(toArtist),
    tracks: (tracks?.items ?? []).map(toTrack),
    genres: topGenres(artists?.items ?? []),
  };
  if (!stats.artists.length && !stats.tracks.length) return null;

  return {
    stats,
    recent: (recent?.items ?? []).map((i) => toTrack(i.track)),
    saved: saved ? saved.items.map((i) => toTrack(i.track)) : null,
    playlists: playlists
      ? playlists.items
          .filter((p) => p.public !== false)
          .slice(0, 4)
          .map((p) => ({ name: p.name, image: p.images?.[0]?.url ?? null, url: p.external_urls.spotify }))
      : null,
  };
}

/** Live "now playing" lookup for the API route. Never cached. */
export async function getNowPlaying(): Promise<NowPlaying> {
  const token = await accessToken(true);
  if (!token) return { playing: false };
  const data = await get<{ is_playing: boolean; item: (Track & { type?: string }) | null }>(
    token,
    "/me/player/currently-playing",
    false,
  );
  if (!data?.is_playing || !data.item) return { playing: false };
  return { playing: true, ...toTrack(data.item) };
}
