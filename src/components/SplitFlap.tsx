"use client";

import { Fragment, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const MARKS = "'\".,:;!?-*`";
const isMark = (ch: string) => !/[A-Za-z0-9]/.test(ch);
/** Punctuation flips through other narrow marks so its small cell doesn't overflow. */
const random = (target: string) => {
  const pool = isMark(target) ? MARKS : GLYPHS;
  return pool[Math.floor(Math.random() * pool.length)];
};

/**
 * Departure-board headline: every letter flips through random characters
 * (in the accent colour) before settling on the real one. Reserved width comes
 * from the real letters, so nothing shifts while it runs.
 */
export default function SplitFlap({ text, delay = 0.3 }: { text: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const waiting = document.documentElement.dataset.intro === "playing";
        const cells = gsap.utils.toArray<HTMLElement>(".flap-cell", el);
        const timelines = cells.map((cell, i) => {
          const flap = cell.querySelector<HTMLElement>(".flap")!;
          const target = cell.dataset.char ?? "";
          const ticks = 5 + ((i * 3) % 5);
          gsap.set(flap, { opacity: 0 });
          const tl = gsap.timeline({ delay: delay + i * 0.07, paused: true });
          tl.set(flap, { opacity: 1 });
          for (let k = 0; k < ticks; k++) {
            tl.call(() => {
              flap.textContent = random(target);
              flap.classList.add("text-accent");
            }).fromTo(flap, { rotateX: -90 }, { rotateX: 0, duration: 0.09, ease: "power1.out" });
          }
          tl.call(() => {
            flap.textContent = target;
            flap.classList.remove("text-accent");
          }).fromTo(flap, { rotateX: -90 }, { rotateX: 0, duration: 0.16, ease: "power2.out" });
          return tl;
        });

        const play = () => timelines.forEach((tl) => tl.play());
        if (!waiting) {
          play();
          return;
        }
        window.addEventListener("intro:reveal", play, { once: true });
        return () => window.removeEventListener("intro:reveal", play);
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} aria-label={text}>
      {text.split(" ").map((word, w, words) => (
        <Fragment key={w}>
          <span aria-hidden className="inline-block whitespace-nowrap">
            {[...word].map((ch, i) =>
              ch.trim() ? (
                <span key={i} data-char={ch} className="flap-cell relative inline-block [perspective:700px]">
                  <span className="invisible">{ch}</span>
                  <span className="flap absolute inset-0 grid place-items-center">
                    {ch}
                  </span>
                </span>
              ) : (
                <span key={i}>{ch}</span>
              ),
            )}
          </span>
          {w < words.length - 1 && " "}
        </Fragment>
      ))}
    </span>
  );
}
