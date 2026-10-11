"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import DetailDialog from "@/components/DetailDialog";
import LogoTile, { type LogoFit } from "@/components/LogoTile";
import TransitionLink from "@/components/TransitionLink";
import type { EntryDetails } from "@/data/profile";

export type Entry = {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  logo?: string;
  logoFit?: LogoFit;
  details?: EntryDetails;
};

type Section = NonNullable<EntryDetails["sections"]>[number];

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export const OPEN_ENTRY_EVENT = "open-entry";

export function AwardIcon({ kind }: { kind: "trophy" | "medal" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-0.5 size-5 shrink-0 text-accent"
    >
      {kind === "trophy" ? (
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      ) : (
        <>
          <circle cx="12" cy="16" r="5" />
          <path d="M8.5 11.5 5 3h5l2 4M15.5 11.5 19 3h-5l-2 4" />
        </>
      )}
    </svg>
  );
}

function SectionList({ sec }: { sec: Section }) {
  if (sec.chips) {
    return (
      <ul className="flex flex-wrap gap-2">
        {sec.items.map((i) => (
          <li key={i} className="rounded-full border border-line px-3 py-1 text-sm text-foreground/80">
            {i}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="space-y-2">
      {sec.items.map((i) => (
        <li key={i} className="flex items-start gap-3 text-foreground/85">
          {sec.kind === "achievement" && <AwardIcon kind="trophy" />}
          {sec.kind === "competition" && <AwardIcon kind="medal" />}
          {sec.kind === "distinction" && (
            <span className="mt-0.5 shrink-0 rounded-md bg-accent px-1.5 py-0.5 font-mono text-xs font-bold text-black">A+</span>
          )}
          {!sec.kind && <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />}
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}

/** A list of education or experience rows. Rows with details open a popup when clicked. */
export default function EntryList({ items }: { items: Entry[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  const withDetails = items.filter((i) => i.details);
  const index = withDetails.findIndex((i) => i.id === activeId);
  const active = index >= 0 ? withDetails[index] : null;
  const canStep = withDetails.length > 1;

  const close = () => {
    setOpen(false);
    lastTrigger.current?.focus();
  };

  const step = (dir: number) => {
    if (withDetails.length < 2 || index < 0) return;
    setActiveId(withDetails[(index + dir + withDetails.length) % withDetails.length].id);
  };

  useEffect(() => {
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<{ id: string }>).detail?.id;
      if (!items.some((i) => i.id === id && i.details)) return;
      lastTrigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setActiveId(id);
      setOpen(true);
    };
    window.addEventListener(OPEN_ENTRY_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_ENTRY_EVENT, onOpen);
  }, [items]);

  const stepRef = useRef(step);
  useEffect(() => {
    stepRef.current = step;
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") stepRef.current(-1);
      else if (e.key === "ArrowRight") stepRef.current(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const rise = reduced ? undefined : item;

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
          <motion.div
            key={active.id}
            variants={reduced ? undefined : container}
            initial={reduced ? false : "hidden"}
            animate="show"
          >
            <motion.div variants={rise} className="mb-6 flex items-center gap-4 pr-10">
              <LogoTile src={active.logo} name={active.title} fit={active.logoFit} />
              <div>
                <h3 className="text-xl font-semibold tracking-tight">{active.title}</h3>
                <p className="text-muted">{active.subtitle}</p>
                <p className="mt-1 font-mono text-xs text-accent">{active.period}</p>
              </div>
            </motion.div>

            <motion.p variants={rise} className="text-lg leading-relaxed text-foreground/90">
              {active.details.summary}
            </motion.p>

            {active.details.highlights && active.details.highlights.length > 0 && (
              <motion.ul variants={rise} className="mt-5 space-y-2">
                {active.details.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-foreground/80">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    {h}
                  </li>
                ))}
              </motion.ul>
            )}

            {active.details.sections?.map((sec) => (
              <motion.div key={sec.label} variants={rise} className="mt-6">
                <p className="mb-2 font-mono text-xs uppercase tracking-widest text-accent">{sec.label}</p>
                <SectionList sec={sec} />
              </motion.div>
            ))}

            {active.details.link && (
              <motion.div variants={rise}>
                <TransitionLink
                  href={active.details.link.href}
                  onClick={close}
                  className="mt-6 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-black"
                >
                  {active.details.link.label} →
                </TransitionLink>
              </motion.div>
            )}

            {canStep && (
              <motion.div variants={rise} className="mt-8 flex items-center justify-between border-t border-line pt-4">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="rounded-full border border-line px-4 py-2 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  ← Prev
                </button>
                <span className="font-mono text-xs text-muted">
                  <span className="text-accent">{String(index + 1).padStart(2, "0")}</span> / {String(withDetails.length).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="rounded-full border border-line px-4 py-2 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  Next →
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </DetailDialog>
    </>
  );
}
