"use client";

import { useEffect, useState } from "react";
import type { NowPlaying } from "@/lib/spotify";

const POLL_MS = 30_000;

/** Shows what's playing right now. Renders nothing when nothing is. */
export default function NowPlayingBadge() {
  const [now, setNow] = useState<NowPlaying>({ playing: false });

  useEffect(() => {
    let alive = true;
    const load = async () => {
      if (document.hidden) return;
      try {
        const res = await fetch("/api/spotify/now-playing");
        if (alive && res.ok) setNow((await res.json()) as NowPlaying);
      } catch {
        // keep the last known state
      }
    };
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  if (!now.playing) return null;

  return (
    <a
      href={now.url}
      target="_blank"
      rel="noreferrer"
      className="mb-5 flex items-center gap-3 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm transition-colors hover:bg-accent/15"
    >
      <span className="flex h-4 items-end gap-0.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1 origin-bottom animate-[eq_0.9s_ease-in-out_infinite] rounded-sm bg-accent motion-reduce:animate-none"
            style={{ height: "100%", animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </span>
      <span className="font-mono text-xs uppercase tracking-widest text-accent">Playing now</span>
      <span className="min-w-0 truncate">
        <span className="font-semibold">{now.name}</span>
        <span className="text-muted"> · {now.artist}</span>
      </span>
    </a>
  );
}
