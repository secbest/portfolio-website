"use client";

import { useCallback, useRef, useState } from "react";
import DetailDialog from "@/components/DetailDialog";
import LogoTile, { type LogoFit } from "@/components/LogoTile";
import TransitionLink from "@/components/TransitionLink";

export type EntryDetails = {
  summary: string;
  highlights?: string[];
  link?: { label: string; href: string };
};

export type Entry = {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  logo?: string;
  logoFit?: LogoFit;
  details?: EntryDetails;
};

/** A list of education or experience rows. Rows with details open a popup when clicked. */
export default function EntryList({ items }: { items: Entry[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const active = items.find((i) => i.id === activeId) ?? null;

  const close = useCallback(() => {
    setOpen(false);
    lastTrigger.current?.focus();
  }, []);

  return (
    <>
      <ul className="space-y-2">
        {items.map((e) => {
          const row = (
            <>
              <div className="flex items-center gap-4">
                <LogoTile src={e.logo} name={e.title} fit={e.logoFit} />
                <div className="text-left">
                  <p className="text-lg font-medium transition-colors group-hover:text-accent">{e.title}</p>
                  <p className="text-muted">{e.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 font-mono text-sm text-muted">
                <span>{e.period}</span>
                {e.details && (
                  <span
                    aria-hidden
                    className="rounded-full border border-line px-2.5 py-0.5 text-xs transition-colors group-hover:border-accent group-hover:text-accent"
                  >
                    Details +
                  </span>
                )}
              </div>
            </>
          );
          const base =
            "group flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-2 rounded-2xl px-3 py-3 -mx-3";
          return (
            <li key={e.id}>
              {e.details ? (
                <button
                  type="button"
                  data-cursor="Open"
                  aria-haspopup="dialog"
                  onClick={(ev) => {
                    lastTrigger.current = ev.currentTarget;
                    setActiveId(e.id);
                    setOpen(true);
                  }}
                  className={`${base} transition-colors hover:bg-white/[0.04]`}
                >
                  {row}
                </button>
              ) : (
                <div className={base}>{row}</div>
              )}
            </li>
          );
        })}
      </ul>

      <DetailDialog open={open} onClose={close} label={active?.title ?? "Details"}>
        {active?.details && (
          <>
            <div className="mb-6 flex items-center gap-4 pr-10">
              <LogoTile src={active.logo} name={active.title} fit={active.logoFit} />
              <div>
                <h3 className="text-xl font-semibold tracking-tight">{active.title}</h3>
                <p className="text-muted">{active.subtitle}</p>
                <p className="mt-1 font-mono text-xs text-accent">{active.period}</p>
              </div>
            </div>
            <p className="text-lg leading-relaxed text-foreground/90">{active.details.summary}</p>
            {active.details.highlights && active.details.highlights.length > 0 && (
              <ul className="mt-5 space-y-2">
                {active.details.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-foreground/80">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    {h}
                  </li>
                ))}
              </ul>
            )}
            {active.details.link && (
              <TransitionLink
                href={active.details.link.href}
                onClick={close}
                className="mt-6 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-black"
              >
                {active.details.link.label} →
              </TransitionLink>
            )}
          </>
        )}
      </DetailDialog>
    </>
  );
}
