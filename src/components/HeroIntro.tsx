"use client";

import { Fragment, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { profile } from "@/data/profile";

gsap.registerPlugin(useGSAP);

/** Renders **marked** phrases in the accent colour. */
function Highlighted({ text }: { text: string }) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 ? (
      <span key={i} className="font-medium text-accent">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/** Hero description card whose border carries a travelling signal pulse. */
export default function HeroIntro() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const waiting = document.documentElement.dataset.intro === "playing";
        const tween = gsap.from(".intro-line", {
          y: 18,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.2,
          delay: 0.9,
          paused: waiting,
        });
        if (!waiting) return;
        const play = () => tween.play();
        window.addEventListener("intro:reveal", play, { once: true });
        return () => window.removeEventListener("intro:reveal", play);
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="signal-border mt-6 max-w-2xl rounded-2xl p-px shadow-[0_0_90px_-40px_rgb(34_211_238/0.7)]">
      <div className="rounded-[calc(1rem-1px)] bg-background/80 p-5 backdrop-blur-xl sm:p-7">
        <div className="space-y-4 text-base leading-relaxed text-foreground/85 sm:text-lg">
          {profile.intro.map((line) => (
            <p key={line} className="intro-line">
              <Highlighted text={line} />
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
