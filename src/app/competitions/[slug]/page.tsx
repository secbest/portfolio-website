import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import PlacementBadge from "@/components/PlacementBadge";
import Reveal from "@/components/Reveal";
import SplitWords from "@/components/SplitWords";
import TransitionLink from "@/components/TransitionLink";
import { competitions } from "@/data/competitions";

type Params = { slug: string };

export function generateStaticParams() {
  return competitions.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: competitions.find((c) => c.slug === slug)?.title ?? "Competition" };
}

export default async function CompetitionPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const index = competitions.findIndex((c) => c.slug === slug);
  if (index === -1) notFound();

  const c = competitions[index];
  const next = competitions.length > 1 ? competitions[(index + 1) % competitions.length] : null;

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-36 sm:px-8">
      <TransitionLink href="/competitions" className="mb-10 block w-fit text-sm text-muted hover:text-foreground">
        ← All competitions
      </TransitionLink>

      <PlacementBadge placement={c.placement} large className="mb-5" />
      <h1 className="text-[clamp(2.25rem,7vw,5rem)] font-semibold leading-[0.95] tracking-tighter">
        <SplitWords text={c.title} />
      </h1>
      <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 text-sm">
        <div>
          <dt className="font-mono text-accent">Date</dt>
          <dd className="mt-1">
            {c.date} · {c.location}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-accent">Organised by</dt>
          <dd className="mt-1">{c.organisers.join(" × ")}</dd>
        </div>
        <div>
          <dt className="font-mono text-accent">Team</dt>
          <dd className="mt-1">{c.teamSize} people</dd>
        </div>
      </dl>
      {c.supporters && <p className="mt-3 text-sm text-muted">{c.supporters.join(" · ")}</p>}

      <Reveal className="mt-12 grid gap-10 border-t border-line pt-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-14">
        <div>
          <p className="mb-3 font-mono text-sm text-accent">{c.entry}</p>
          <p className="max-w-2xl text-xl leading-relaxed">{c.summary}</p>
          <ul className="mt-6 max-w-2xl space-y-3 text-foreground/80">
            {c.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                {h}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            {c.stack.map((t) => (
              <span key={t} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                {t}
              </span>
            ))}
          </div>
          {c.repo && (
            <a
              href={c.repo}
              target="_blank"
              rel="noreferrer"
              data-cursor="GitHub"
              className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black"
            >
              View on GitHub ↗
            </a>
          )}
        </div>

        {c.stats && (
          <ul className="grid gap-px self-start overflow-hidden rounded-2xl border border-line bg-line">
            {c.stats.map((s) => (
              <li key={s.label} className="bg-background p-6">
                <p className="text-4xl font-semibold tracking-tight text-accent sm:text-5xl">{s.value}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.label}</p>
              </li>
            ))}
          </ul>
        )}
      </Reveal>

      {c.photos && (
        <Reveal className="mt-16 border-t border-line pt-10">
          <h2 className="mb-8 font-mono text-sm text-accent">Photos & certificate</h2>
          {/* One row on wide screens: each column is sized by its photo's aspect ratio so all share one height. */}
          <ul
            className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:overflow-visible md:px-0 md:[grid-template-columns:var(--cols)]"
            style={{ "--cols": c.photos.map((p) => `${(p.width / p.height).toFixed(3)}fr`).join(" ") } as React.CSSProperties}
          >
            {c.photos.map((p) => (
              <li key={p.src} className="shrink-0 md:min-w-0 md:shrink">
                <figure>
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={p.width}
                    height={p.height}
                    sizes="(min-width: 768px) 30vw, 70vw"
                    className="h-60 w-auto rounded-xl border border-line object-cover md:h-auto md:w-full"
                  />
                  <figcaption className="mt-2 font-mono text-xs text-muted">{p.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      {next && (
        <Reveal className="mt-24 border-t border-line pt-10">
          <p className="mb-2 font-mono text-sm text-muted">Next competition</p>
          <TransitionLink
            href={`/competitions/${next.slug}`}
            data-cursor="Next"
            className="text-2xl font-semibold tracking-tight hover:text-accent sm:text-4xl"
          >
            {next.title} →
          </TransitionLink>
        </Reveal>
      )}
    </div>
  );
}
