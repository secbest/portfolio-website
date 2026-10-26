import type { Metadata } from "next";
import Image from "next/image";
import PlacementBadge from "@/components/PlacementBadge";
import Reveal from "@/components/Reveal";
import SplitFlap from "@/components/SplitFlap";
import TransitionLink from "@/components/TransitionLink";
import { competitions } from "@/data/competitions";

export const metadata: Metadata = { title: "Competitions" };

export default function CompetitionsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-32 sm:px-8">
      <h1 className="mb-4 text-[clamp(2.25rem,7vw,5rem)] font-semibold leading-[0.95] tracking-tighter">
        <SplitFlap text="Competitions" />
      </h1>
      <p className="mb-14 max-w-2xl text-lg text-muted">
        Hackathons and contests where I built against the clock. Open one for the results and what we made.
      </p>

      <Reveal stagger>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {competitions.map((c) => {
            const cover = c.photos?.[c.thumbnail ?? 0];
            return (
              <li key={c.slug}>
                <TransitionLink href={`/competitions/${c.slug}`} data-cursor="View" className="group block">
                  <div className="skeleton relative aspect-[16/10] overflow-hidden rounded-2xl border border-line shadow-[0_0_80px_-35px_rgb(34_211_238/0.5)]">
                    {cover && (
                      <Image
                        src={cover.src}
                        alt={cover.alt}
                        fill
                        sizes="(min-width: 1024px) 352px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover object-[50%_30%] transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <PlacementBadge placement={c.placement} className="absolute left-4 top-4" />
                  </div>
                  <div className="mt-4 px-1">
                    <h2 className="text-2xl font-semibold tracking-tight transition-colors group-hover:text-accent">
                      {c.title}
                    </h2>
                    <p className="mt-2 font-mono text-xs text-muted">
                      {c.date} · {c.organisers.join(" × ")}
                    </p>
                    <p className="mt-2 text-muted">{c.entry}</p>
                    <p className="mt-4 font-mono text-sm text-accent transition-transform group-hover:translate-x-1">
                      View details →
                    </p>
                  </div>
                </TransitionLink>
              </li>
            );
          })}
          <li aria-label="More competitions coming soon">
            <div className="grid aspect-[16/10] place-content-center gap-3 rounded-2xl border border-dashed border-accent/30 bg-white/[0.02] p-6 text-center">
              <p className="font-mono text-xs text-accent/70">{"// next_up"}</p>
              <p className="text-2xl font-semibold tracking-tight">
                More hackathons loading
                <span className="caret ml-1 inline-block h-[0.9em] w-[3px] translate-y-[2px] bg-accent" aria-hidden />
              </p>
              <p className="mx-auto max-w-xs text-sm text-muted">
                I&apos;m already hunting for the next one. New entries land here as I compete.
              </p>
            </div>
          </li>
        </ul>
      </Reveal>
    </div>
  );
}
