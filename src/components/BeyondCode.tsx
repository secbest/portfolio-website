import HobbyIcon from "@/components/HobbyIcon";
import Reveal from "@/components/Reveal";
import SpotifyStats from "@/components/SpotifyStats";
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

function ListCard({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="mt-6 max-w-lg rounded-2xl border border-line bg-white/[0.03] p-5">
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">{label}</p>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
            {i}
          </li>
        ))}
      </ul>
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

const spineHeights = ["h-44", "h-52", "h-40", "h-48"];

function Bookshelf() {
  const titles = c.reading.favourites.slice(0, 4);
  const books = titles.length ? titles : ["", "", ""];
  return (
    <div className="flex h-72 flex-col justify-end" aria-hidden={titles.length === 0}>
      <div className="flex items-end justify-center gap-1.5">
        {books.map((t, i) => (
          <div
            key={`${t}-${i}`}
            className={`${spineHeights[i % spineHeights.length]} w-11 overflow-hidden rounded-t-md border border-white/10 bg-gradient-to-b from-accent/30 to-accent/5 px-1 py-3 sm:w-14`}
          >
            <span className="block max-h-full truncate text-xs font-semibold uppercase tracking-wider text-foreground/80 [writing-mode:vertical-rl] rotate-180">
              {t}
            </span>
          </div>
        ))}
      </div>
      <div className="h-1.5 rounded-full bg-accent shadow-[0_0_24px_2px_rgb(34_211_238/0.5)]" />
    </div>
  );
}

function GamingPanel() {
  return (
    <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl border border-line bg-white/[0.02] shadow-[0_0_80px_-40px_rgb(34_211_238/0.6)]">
      <div className="grid-bg absolute inset-0" aria-hidden />
      <HobbyIcon name="gaming" className="relative size-28 text-accent drop-shadow-[0_0_24px_rgb(34_211_238/0.6)] sm:size-36" />
    </div>
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

        <Row
          flip
          text={
            <>
              <Heading icon="reading" title={c.reading.title} />
              <Body paragraphs={c.reading.body} />
              <ListCard label="My favourite reads" items={c.reading.favourites} />
            </>
          }
          visual={<Bookshelf />}
        />

        <Row
          text={
            <>
              <Heading icon="gaming" title={c.gaming.title} />
              <Body paragraphs={c.gaming.body} />
              <ListCard label="My favourite games" items={c.gaming.favourites} />
            </>
          }
          visual={<GamingPanel />}
        />

        <div>
          <Reveal>
            <Heading icon="music" title={c.music.title} />
            <Body paragraphs={c.music.body} />
          </Reveal>
          {spotifyConfigured() && (
            <Reveal className="mt-8">
              <SpotifyStats />
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
