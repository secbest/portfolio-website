import Image from "next/image";
import type { RangeStats, TrackItem } from "@/lib/spotify";

type Show = { artists: boolean; tracks: boolean; genres: boolean; recent: boolean };

const LIMIT = 3;

function Thumb({ src, round = false }: { src: string | null; round?: boolean }) {
  const shape = round ? "rounded-full" : "rounded-md";
  return src ? (
    <Image src={src} alt="" width={48} height={48} className={`size-11 shrink-0 object-cover ${shape}`} />
  ) : (
    <div aria-hidden className={`size-11 shrink-0 bg-white/10 ${shape}`} />
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">{children}</p>;
}

/** Top artists, tracks, recent plays and genres from the last four weeks. */
export default function SpotifyHighlights({
  data,
  recent,
  show,
}: {
  data: RangeStats;
  recent: TrackItem[];
  show: Show;
}) {
  return (
    <div>
      <p className="mb-5 font-mono text-xs text-muted">Last 4 weeks</p>

      <div className="grid gap-8 md:grid-cols-3">
        {show.artists && data.artists.length > 0 && (
          <div>
            <Label>Top artists</Label>
            <ol className="space-y-3">
              {data.artists.slice(0, LIMIT).map((a, i) => (
                <li key={a.url}>
                  <a href={a.url} target="_blank" rel="noreferrer" className="group flex items-center gap-3">
                    <span className="w-4 font-mono text-xs text-muted">{i + 1}</span>
                    <Thumb src={a.image} round />
                    <span className="truncate font-medium transition-colors group-hover:text-accent">{a.name}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
        {show.tracks && data.tracks.length > 0 && (
          <div>
            <Label>Top tracks</Label>
            <ol className="space-y-3">
              {data.tracks.slice(0, LIMIT).map((t, i) => (
                <li key={t.url}>
                  <a href={t.url} target="_blank" rel="noreferrer" className="group flex items-center gap-3">
                    <span className="w-4 font-mono text-xs text-muted">{i + 1}</span>
                    <Thumb src={t.image} />
                    <span className="min-w-0">
                      <span className="block truncate font-medium transition-colors group-hover:text-accent">{t.name}</span>
                      <span className="block truncate text-sm text-muted">{t.artist}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
        {show.recent && recent.length > 0 && (
          <div>
            <Label>Recently played</Label>
            <ol className="space-y-3">
              {recent.slice(0, LIMIT).map((t, i) => (
                <li key={`${t.url}-${i}`}>
                  <a href={t.url} target="_blank" rel="noreferrer" className="group flex items-center gap-3">
                    <Thumb src={t.image} />
                    <span className="min-w-0">
                      <span className="block truncate font-medium transition-colors group-hover:text-accent">{t.name}</span>
                      <span className="block truncate text-sm text-muted">{t.artist}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {show.genres && data.genres.length > 0 && (
        <div className="mt-8">
          <Label>Top genres</Label>
          <ul className="flex flex-wrap gap-2">
            {data.genres.map((g) => (
              <li key={g} className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-sm capitalize text-accent">
                {g}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
