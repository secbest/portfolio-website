"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import gsap from "gsap";
import TransitionLink from "@/components/TransitionLink";
import type { Project } from "@/data/projects";

const GAP = 24;
const DRAG_THRESHOLD = 60;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * One large project card at a time, with its neighbours peeking in at the sides.
 * Move with the arrow buttons, the keyboard, or by dragging and swiping.
 */
export default function ProjectCarousel({ items }: { items: Project[] }) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const current = useRef(0);
  const drag = useRef({ startX: 0, baseX: 0, down: false, moved: false });
  const [index, setIndex] = useState(0);
  const count = items.length;

  const layout = useCallback((animate: boolean) => {
    const vp = viewport.current;
    const tr = track.current;
    if (!vp || !tr) return;
    const cards = Array.from(tr.children) as HTMLElement[];
    const width = cards[0]?.offsetWidth ?? 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = animate && !reduced ? 0.9 : 0;
    gsap.to(tr, {
      x: vp.clientWidth / 2 - width / 2 - current.current * (width + GAP),
      duration,
      ease: "power4.out",
      overwrite: true,
    });
    cards.forEach((card, i) => {
      const active = i === current.current;
      gsap.to(card, { scale: active ? 1 : 0.88, opacity: active ? 1 : 0.4, duration: duration * 0.8, ease: "power3.out" });
    });
  }, []);

  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(count - 1, next));
      current.current = clamped;
      setIndex(clamped);
      layout(true);
    },
    [count, layout],
  );

  useEffect(() => {
    const vp = viewport.current;
    const tr = track.current;
    if (!vp || !tr) return;
    layout(false);
    const ro = new ResizeObserver(() => layout(false));
    ro.observe(vp);
    return () => {
      ro.disconnect();
      gsap.killTweensOf([tr, ...Array.from(tr.children)]);
    };
  }, [layout]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { startX: e.clientX, baseX: Number(gsap.getProperty(track.current, "x")), down: true, moved: false };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.down) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (d.moved) gsap.set(track.current, { x: d.baseX + dx });
  };
  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.down) return;
    d.down = false;
    const dx = e.clientX - d.startX;
    if (d.moved && Math.abs(dx) > DRAG_THRESHOLD) go(current.current + (dx < 0 ? 1 : -1));
    else layout(true);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") go(current.current - 1);
    else if (e.key === "ArrowRight") go(current.current + 1);
  };

  return (
    <div>
      <div className="mb-2 flex items-center gap-4">
        <div className="flex gap-2">
          {(["←", "→"] as const).map((arrow, i) => {
            const disabled = i === 0 ? index === 0 : index === count - 1;
            return (
              <button
                key={arrow}
                type="button"
                aria-label={i === 0 ? "Previous project" : "Next project"}
                disabled={disabled}
                onClick={() => go(index + (i === 0 ? -1 : 1))}
                className="grid size-12 place-items-center rounded-full border border-line text-lg transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-30"
              >
                {arrow}
              </button>
            );
          })}
        </div>
        <p className="font-mono text-sm text-muted" aria-live="polite">
          <span className="text-accent">{pad(index + 1)}</span> / {pad(count)}
        </p>
        <div className="h-px flex-1 bg-line" aria-hidden>
          <div
            className="h-full origin-left bg-accent transition-transform duration-700"
            style={{ transform: `scaleX(${(index + 1) / count})` }}
          />
        </div>
      </div>

      <div
        ref={viewport}
        role="region"
        aria-roledescription="carousel"
        aria-label="Projects"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
        className="touch-pan-y select-none overflow-hidden rounded-2xl py-3 outline-offset-4 [&:focus-visible]:outline-2 [&:focus-visible]:outline-accent"
      >
        <ul ref={track} className="flex w-max" style={{ gap: GAP }}>
          {items.map((p, i) => {
            const cover = p.images?.[0];
            return (
              <li
                key={p.slug}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                className="w-[82vw] max-w-[640px] shrink-0 sm:w-[60vw]"
              >
                <TransitionLink
                  href={`/projects/${p.slug}`}
                  data-cursor="View"
                  draggable={false}
                  onClick={(e) => {
                    if (i !== current.current) {
                      e.preventDefault();
                      go(i);
                    }
                  }}
                  className="group block"
                >
                  <div className="relative aspect-[2/1] overflow-hidden rounded-2xl border border-line bg-white/[0.03] shadow-[0_0_80px_-35px_rgb(34_211_238/0.5)]">
                    {cover ? (
                      <Image
                        src={cover.src}
                        alt={cover.alt}
                        fill
                        draggable={false}
                        sizes="(min-width: 1088px) 640px, 82vw"
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center">
                        <div className="grid-bg absolute inset-0" aria-hidden />
                        <span className="relative font-mono text-7xl font-semibold text-accent/40 sm:text-9xl">{pad(i + 1)}</span>
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 font-mono text-xs font-semibold text-blue-900">
                      {pad(i + 1)}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 px-1">
                    <div className="max-w-xl">
                      <h3 className="text-2xl font-semibold tracking-tight transition-colors group-hover:text-accent sm:text-3xl">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-muted">{p.summary}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span key={t} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </TransitionLink>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
