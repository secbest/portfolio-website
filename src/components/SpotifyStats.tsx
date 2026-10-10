import Image from "next/image";
import NowPlayingBadge from "@/components/NowPlayingBadge";
import SpotifyHighlights from "@/components/SpotifyHighlights";
import { spotifyFeatures as on } from "@/data/spotify-config";
import { spotifyHistory } from "@/data/spotify";
import { getSpotifyOverview, type PlaylistItem, type TrackItem } from "@/lib/spotify";

const hourLabel = (h: number) => `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? "am" : "pm"}`;

function Tile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-white/[0.03] p-4 sm:p-5">
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">{label}</p>
      {children}
    </div>
  );
}

function Cover({ src }: { src: string | null }) {
  return src ? (
    <Image src={src} alt="" width={48} height={48} className="size-11 shrink-0 rounded-md object-cover" />
  ) : (
    <div aria-hidden className="size-11 shrink-0 rounded-md bg-white/10" />
  );
}

function TrackList({ tracks }: { tracks: TrackItem[] }) {
  return (
    <ul className="space-y-3">
      {tracks.map((t) => (
        <li key={t.url}>
          <a href={t.url} target="_blank" rel="noreferrer" className="group flex items-center gap-3">
            <Cover src={t.image} />
            <span className="min-w-0">
              <span className="block truncate font-medium transition-colors group-hover:text-accent">{t.name}</span>
              <span className="block truncate text-sm text-muted">{t.artist}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function PlaylistList({ playlists }: { playlists: PlaylistItem[] }) {
  return (
    <ul className="space-y-3">
      {playlists.map((p) => (
        <li key={p.url}>
          <a href={p.url} target="_blank" rel="noreferrer" className="group flex items-center gap-3">
            <Cover src={p.image} />
            <span className="truncate font-medium transition-colors group-hover:text-accent">{p.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function HourChart({ byHour }: { byHour: number[] }) {
  const max = Math.max(...byHour, 1);
  const peak = byHour.indexOf(Math.max(...byHour));
  return (
    <Tile label="When I listen">
      <div className="flex h-24 items-end gap-1" role="img" aria-label={`Listening by hour of day. Peak at ${hourLabel(peak)}.`}>
        {byHour.map((v, h) => (
          <div
            key={h}
            title={`${hourLabel(h)}: ${Math.round(v).toLocaleString("en-SG")} min`}
            className={`flex-1 rounded-t-sm ${h === peak ? "bg-accent" : "bg-accent/30"}`}
            style={{ height: `${Math.max(4, (v / max) * 100)}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[0.65rem] text-muted">
        {[0, 6, 12, 18].map((h) => (
          <span key={h}>{hourLabel(h)}</span>
        ))}
        <span>11pm</span>
      </div>
      <p className="mt-3 text-sm text-muted">
        Most active around <span className="text-accent">{hourLabel(peak)}</span>
      </p>
    </Tile>
  );
}

export default async function SpotifyStats() {
  const data = await getSpotifyOverview();
  if (!data) return null;

  const { minutesListened, mostPlayed, byHour, year } = spotifyHistory;
  const showTabs = on.topArtists || on.topTracks || on.topGenres || on.recentlyPlayed;
  const saved = on.latestAdditions && data.saved?.length ? data.saved : null;
  const playlists = on.playlists && data.playlists?.length ? data.playlists : null;

  return (
    <div className="w-full rounded-2xl border border-line bg-white/[0.02] p-5 shadow-[0_0_80px_-40px_rgb(34_211_238/0.5)] sm:p-7">
      <p className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
        <span className="size-2 rounded-full bg-accent" aria-hidden />
        Spotify statistics
      </p>

      {on.nowPlaying && <NowPlayingBadge />}

      <div className="space-y-6">
        {((on.minutesListened && minutesListened !== null) || (on.mostPlayedSong && mostPlayed)) && (
          <div className="grid gap-3 sm:grid-cols-2">
            {on.minutesListened && minutesListened !== null && (
              <Tile label={`Minutes listened · ${year}`}>
                <p className="text-4xl font-semibold tracking-tight sm:text-5xl">{minutesListened.toLocaleString("en-SG")}</p>
              </Tile>
            )}
            {on.mostPlayedSong && mostPlayed && (
              <Tile label={`Most played song · ${year}`}>
                <p className="text-lg font-semibold">{mostPlayed.name}</p>
                <p className="text-sm text-muted">
                  {mostPlayed.artist} · {mostPlayed.plays.toLocaleString("en-SG")} plays
                </p>
              </Tile>
            )}
          </div>
        )}

        {showTabs && (
          <SpotifyHighlights
            data={data.stats}
            recent={data.recent}
            show={{ artists: on.topArtists, tracks: on.topTracks, genres: on.topGenres, recent: on.recentlyPlayed }}
          />
        )}

        {(saved || playlists) && (
          <div className="grid gap-8 md:grid-cols-2">
            {saved && (
              <div>
                <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">Latest additions</p>
                <TrackList tracks={saved} />
              </div>
            )}
            {playlists && (
              <div>
                <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">Playlists</p>
                <PlaylistList playlists={playlists} />
              </div>
            )}
          </div>
        )}

        {on.listeningByHour && byHour && <HourChart byHour={byHour} />}
      </div>
    </div>
  );
}
