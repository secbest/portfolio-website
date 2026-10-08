"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import gsap from "gsap";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import type { Project } from "@/data/projects";
import { getLenis } from "@/lib/lenis";

gsap.registerPlugin(useGSAP);

type Slide = NonNullable<Project["images"]>[number];

const INTERVAL = 5;
const subscribe = () => () => {};
const useIsClient = () => useSyncExternalStore(subscribe, () => true, () => false);
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Auto-playing screenshot slideshow. Each slide is wiped in from the right
 * behind a cyan scan line while its image settles from a zoom and the
 * outgoing slide slides away. Reduced motion swaps instantly and never autoplays.
 */
export default function ProjectSlideshow({
  slides,
  className = "aspect-[1915/915]",
}: {
  slides: Slide[];
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const goTo = useRef<(index: number) => void>(() => {});
  const timer = useRef<gsap.core.Tween | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const isClient = useIsClient();
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const count = slides.length;
  const open = lightbox !== null;

  const close = useCallback(() => {
    setLightbox(null);
    trigger.current?.focus();
  }, []);
  const stepLightbox = useCallback(
    (dir: number) => setLightbox((i) => (i === null ? i : (i + dir + count) % count)),
    [count],
  );

  useEffect(() => {
    if (!open) return;
    timer.current?.pause();
    getLenis()?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") stepLightbox(-1);
      else if (e.key === "ArrowRight") stepLightbox(1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      getLenis()?.start();
      timer.current?.resume();
    };
  }, [open, close, stepLightbox]);

  useGSAP(
    (_, contextSafe) => {
      const el = root.current;
      if (!el || !contextSafe) return;

      const items = gsap.utils.toArray<HTMLElement>(".ss-slide", el);
      const imgs = gsap.utils.toArray<HTMLElement>(".ss-img", el);
      const edge = el.querySelector<HTMLElement>(".ss-edge");
      const bar = el.querySelector<HTMLElement>(".ss-bar");
      const caption = el.querySelector<HTMLElement>(".ss-caption");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const wipe = reduced ? 0 : 1.1;

      let current = 0;
      let busy = false;

      gsap.set(items, { clipPath: "inset(0 0 0 100%)", zIndex: 0 });
      gsap.set(items[0], { clipPath: "inset(0 0 0 0%)", zIndex: 1 });
      if (edge) gsap.set(edge, { opacity: 0 });

      const startTimer = () => {
        timer.current?.kill();
        if (reduced || !bar) return;
        gsap.set(bar, { scaleX: 0 });
        timer.current = gsap.to(bar, {
          scaleX: 1,
          duration: INTERVAL,
          ease: "none",
          onComplete: () => goTo.current((current + 1) % count),
        });
      };

      const go = contextSafe((next: number) => {
        if (busy || next === current) return;
        busy = true;
        timer.current?.kill();
        const from = items[current];
        const to = items[next];
        gsap.set(from, { zIndex: 1 });
        gsap.set(to, { zIndex: 2, clipPath: "inset(0 0 0 100%)" });
        setActive(next);

        const tl = gsap.timeline({
          defaults: { ease: "power4.inOut", duration: wipe },
          onComplete: () => {
            gsap.set(from, { clipPath: "inset(0 0 0 100%)", zIndex: 0 });
            gsap.set(imgs[current], { xPercent: 0, scale: 1 });
            current = next;
            busy = false;
            startTimer();
          },
        });
        tl.to(to, { clipPath: "inset(0 0 0 0%)" }, 0)
          .fromTo(imgs[next], { scale: 1.3 }, { scale: 1, duration: wipe * 1.3, ease: "power3.out" }, 0)
          .to(imgs[current], { xPercent: -14, scale: 1.05 }, 0);
        if (edge && !reduced) {
          tl.fromTo(edge, { left: "100%", opacity: 1 }, { left: "0%" }, 0).to(edge, { opacity: 0, duration: 0.2, ease: "none" }, wipe - 0.2);
        }
        if (caption && !reduced) {
          gsap.fromTo(caption, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: wipe * 0.45 });
        }
      });

      goTo.current = go;
      startTimer();

      const pause = () => timer.current?.pause();
      const resume = () => timer.current?.resume();
      el.addEventListener("pointerenter", pause);
      el.addEventListener("pointerleave", resume);
      el.addEventListener("focusin", pause);
      el.addEventListener("focusout", resume);
      return () => {
        timer.current?.kill();
        el.removeEventListener("pointerenter", pause);
        el.removeEventListener("pointerleave", resume);
        el.removeEventListener("focusin", pause);
        el.removeEventListener("focusout", resume);
      };
    },
    { scope: root },
  );

  const step = (dir: number) => goTo.current((active + dir + count) % count);

  const shown = lightbox === null ? null : slides[lightbox];

  return (
    <>
    <div
      ref={root}
      role="group"
      aria-roledescription="carousel"
      aria-label="Project screenshots"
      className={`group relative overflow-hidden rounded-2xl border border-line bg-white/5 shadow-[0_0_80px_-30px_rgb(34_211_238/0.5)] ${className}`}
    >
      {slides.map((s, i) => (
        <div key={s.src} className="ss-slide absolute inset-0" aria-hidden={i !== active}>
          <div className="ss-img relative size-full">
            <Image
              src={s.src}
              alt={s.alt}
              fill
              priority={i === 0}
              sizes="(min-width: 1152px) 1088px, 100vw"
              className="object-cover object-top"
            />
          </div>
        </div>
      ))}

      <button
        ref={trigger}
        type="button"
        aria-label="View screenshot fullscreen"
        data-cursor="Expand"
        onClick={() => setLightbox(active)}
        className="absolute inset-0 z-[5] cursor-zoom-in"
      />

      <div
        aria-hidden
        className="ss-edge pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-accent shadow-[0_0_24px_6px_rgb(34_211_238/0.7)]"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/5 bg-gradient-to-t from-black/80 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 p-4 sm:p-6">
        <div className="min-w-0 overflow-hidden">
          <p
            className="mb-2 inline-block rounded-full bg-white/90 px-3 py-1 font-mono text-xs font-semibold text-blue-900"
            aria-live="polite"
          >
            {pad(active + 1)} / {pad(count)}
          </p>
          <p className="ss-caption text-sm text-white sm:text-base">{slides[active].caption}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {(["←", "→"] as const).map((arrow, i) => (
            <button
              key={arrow}
              type="button"
              aria-label={i === 0 ? "Previous screenshot" : "Next screenshot"}
              onClick={() => step(i === 0 ? -1 : 1)}
              className="grid size-10 place-items-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur transition-colors hover:border-accent hover:text-accent"
            >
              {arrow}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-30 h-0.5 bg-white/15">
        <div className="ss-bar h-full origin-left scale-x-0 bg-accent" />
      </div>
    </div>
    {isClient &&
      createPortal(
        <AnimatePresence>
          {shown && (
            <motion.div
              key="lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={shown.caption}
              className="fixed inset-0 z-[95] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-md sm:p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.25 }}
              onClick={close}
            >
              <motion.figure
                key={shown.src}
                className="flex max-h-full w-full max-w-6xl flex-col items-center"
                initial={reduced ? false : { opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-[72vh] w-full">
                  <Image src={shown.src} alt={shown.alt} fill sizes="100vw" className="rounded-lg object-contain" />
                </div>
                <figcaption className="mt-4 text-center font-mono text-sm text-white/80">
                  <span className="text-accent">{pad((lightbox ?? 0) + 1)} / {pad(count)}</span> · {shown.caption}
                </figcaption>
              </motion.figure>

              <button
                type="button"
                autoFocus
                aria-label="Close"
                onClick={(e) => {
                  e.stopPropagation();
                  close();
                }}
                className="absolute right-4 top-4 grid size-11 place-items-center rounded-full border border-white/25 bg-black/50 text-xl text-white transition-colors hover:border-accent hover:text-accent sm:right-8 sm:top-8"
              >
                ✕
              </button>
              {count > 1 &&
                (["←", "→"] as const).map((arrow, i) => (
                  <button
                    key={arrow}
                    type="button"
                    aria-label={i === 0 ? "Previous screenshot" : "Next screenshot"}
                    onClick={(e) => {
                      e.stopPropagation();
                      stepLightbox(i === 0 ? -1 : 1);
                    }}
                    className={`absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/50 text-white transition-colors hover:border-accent hover:text-accent ${i === 0 ? "left-3 sm:left-8" : "right-3 sm:right-8"}`}
                  >
                    {arrow}
                  </button>
                ))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}