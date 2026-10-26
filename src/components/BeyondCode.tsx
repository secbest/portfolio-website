import { Suspense } from "react";
import HobbyIcon from "@/components/HobbyIcon";
import Reveal from "@/components/Reveal";
import SpotifyStats, { SpotifyStatsSkeleton } from "@/components/SpotifyStats";
import { beyondCode as c, type HobbyIconName } from "@/data/hobbies";
import { spotifyConfigured } from "@/lib/spotify";

function Heading({ icon, title }: { icon: HobbyIconName; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="grid size-11 place-items-center rounded-xl bg-accent/10 text-accent">
        <HobbyIcon name={icon} className="size-6" />
      </span>
      <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h3>
    </div>
  );
}

function Body({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="max-w-lg space-y-4 text-lg leading-relaxed text-foreground/80">
      {paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

/** One text column and one visual column; `flip` puts the visual first on wide screens. */
function Row({ flip = false, text, visual }: { flip?: boolean; text: React.ReactNode; visual: React.ReactNode }) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <Reveal className={flip ? "md:order-2" : ""}>{text}</Reveal>
      <Reveal className={flip ? "md:order-1" : ""}>{visual}</Reveal>
    </div>
  );
}

function SportsGrid() {
  return (
    <ul className="grid grid-cols-3 gap-3">
      {c.sports.items.map((s) => (
        <li
          key={s.name}
          className={`group flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-white/[0.02] transition-all duration-500 hover:-translate-y-1 hover:border-accent/60 hover:bg-accent/[0.06] hover:shadow-[0_0_50px_-20px_rgb(34_211_238/0.7)]`}
        >
          <HobbyIcon
            name={s.icon}
            className="size-9 text-foreground/70 transition-all duration-500 group-hover:-rotate-6 group-hover:scale-110 group-hover:text-accent sm:size-11"
          />
          <span className="text-sm font-medium sm:text-base">{s.name}</span>
        </li>
      ))}
    </ul>
  );
}

export default function BeyondCode() {
  return (
    <section className="mt-28 border-t border-line pt-20" aria-labelledby="beyond-code-heading">
      <Reveal className="mb-16 text-center">
        <p className="mb-3 font-mono text-sm text-accent">{c.label}</p>
        <h2 id="beyond-code-heading" className="text-4xl font-semibold tracking-tight sm:text-6xl">
          {c.heading}
        </h2>
      </Reveal>

      <div className="space-y-24">
        <Row
          text={
            <>
              <Heading icon="gym" title={c.sports.title} />
              <Body paragraphs={c.sports.body} />
            </>
          }
          visual={<SportsGrid />}
        />

        <div>
          <Reveal>
            <Heading icon="music" title={c.music.title} />
            <Body paragraphs={c.music.body} />
          </Reveal>
          {spotifyConfigured() && (
            <Reveal className="mt-8">
              <Suspense fallback={<SpotifyStatsSkeleton />}>
                <SpotifyStats />
              </Suspense>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
