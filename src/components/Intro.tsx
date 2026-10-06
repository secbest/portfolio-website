"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const LINES = [
  "> booting jasper-os v1.0.0",
  "> mounting modules: react · next.js · three.js · gsap",
  "> loading neural interface ........ ok",
  "> calibrating model weights ....... ok",
  "> compiling portfolio ............. ok",
  "> access granted",
];

/**
 * Boot-sequence overlay shown on every full page load. It dispatches
 * `intro:reveal` when the panels start to split so page animations can wait.
 */
export default function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const percent = useRef<HTMLSpanElement>(null);
  const lines = useRef<(HTMLSpanElement | null)[]>([]);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.display = "none";
      return;
    }

    const html = document.documentElement;
    html.dataset.intro = "playing";
    document.body.style.overflow = "hidden";
    lines.current.forEach((l) => l && (l.textContent = ""));

    const finish = () => {
      html.dataset.intro = "done";
      document.body.style.overflow = "";
      el.style.display = "none";
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finish });
      timeline.current = tl;

      LINES.forEach((text, i) => {
        const target = lines.current[i];
        if (!target) return;
        const typed = { n: 0 };
        tl.to(typed, {
          n: text.length,
          duration: Math.max(0.3, text.length * 0.016),
          ease: "none",
          onUpdate: () => {
            target.textContent = text.slice(0, Math.round(typed.n));
          },
        }).to({}, { duration: 0.08 });
      });

      const progress = { v: 0 };
      tl.to(
        progress,
        {
          v: 100,
          duration: tl.duration(),
          ease: "none",
          onUpdate: () => {
            if (percent.current) {
              percent.current.textContent = `${Math.round(progress.v)}%`;
            }
          },
        },
        0,
      );
      tl.to(bar.current, { scaleX: 1, duration: tl.duration(), ease: "none" }, 0);

      tl.to(content.current, { opacity: 0, duration: 0.3 }, "+=0.35");
      tl.call(() => window.dispatchEvent(new Event("intro:reveal")), undefined, "<");
      tl.to(top.current, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "<");
      tl.to(bottom.current, { yPercent: 100, duration: 0.9, ease: "power4.inOut" }, "<");
    }, root);

    return () => {
      ctx.revert();
      timeline.current = null;
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div ref={root} className="intro fixed inset-0 z-[95]">
      <noscript>
        <style>{".intro{display:none}"}</style>
      </noscript>
      <div ref={top} className="absolute inset-x-0 top-0 h-1/2 bg-black" />
      <div ref={bottom} className="absolute inset-x-0 bottom-0 h-1/2 bg-black" />
      <div
        ref={content}
        className="absolute inset-0 grid place-items-center px-6 font-mono text-sm text-accent sm:text-base"
      >
        <div className="w-full max-w-xl">
          <div aria-hidden className="space-y-1">
            {LINES.map((_, i) => (
              <p key={i} className="min-h-[1.5em] whitespace-pre-wrap">
                <span
                  ref={(node) => {
                    lines.current[i] = node;
                  }}
                />
              </p>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-line">
              <div
                ref={bar}
                className="h-full origin-left scale-x-0 bg-accent"
              />
            </div>
            <span ref={percent} className="w-10 text-right tabular-nums">
              0%
            </span>
          </div>
          <button
            type="button"
            onClick={() => timeline.current?.timeScale(8)}
            className="mt-8 text-xs text-muted hover:text-foreground"
          >
            skip intro →
          </button>
        </div>
      </div>
    </div>
  );
}
