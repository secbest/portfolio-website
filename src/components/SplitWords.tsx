"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type Props = {
  text: string;
  className?: string;
  delay?: number;
};

/** Headline that slides up word by word on mount. */
export default function SplitWords({ text, className, delay = 0.3 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Hold until the boot intro starts to lift, if one is playing.
        const waiting = document.documentElement.dataset.intro === "playing";
        const tween = gsap.from(".word-inner", {
          yPercent: 110,
          duration: 1,
          ease: "power4.out",
          stagger: 0.08,
          delay,
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
    <span ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block overflow-hidden pb-[0.12em] align-bottom"
        >
          <span className="word-inner inline-block">{word}&nbsp;</span>
        </span>
      ))}
    </span>
  );
}
