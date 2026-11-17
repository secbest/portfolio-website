"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Portrait that wipes open, settles from a zoom, and gets a cyan scan pass, then drifts with scroll. */
export default function AboutPortrait({ className }: { className?: string }) {
  const frame = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = frame.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ paused: true });
        tl.fromTo(
          el,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power4.inOut" },
        )
          .fromTo(".portrait-zoom", { scale: 1.35 }, { scale: 1, duration: 1.8, ease: "power3.out" }, 0)
          .fromTo(".portrait-scan", { yPercent: -100, opacity: 1 }, { yPercent: 400, duration: 1.4, ease: "power2.inOut" }, 0.5)
          .to(".portrait-scan", { opacity: 0, duration: 0.2 }, ">-0.2");

        gsap.set(el, { clipPath: "inset(100% 0% 0% 0%)" });

        const play = () => tl.play();
        let waiting = false;
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () => {
            if (document.documentElement.dataset.intro === "playing") {
              waiting = true;
              window.addEventListener("intro:reveal", play, { once: true });
            } else play();
          },
        });

        gsap.fromTo(
          ".portrait-drift",
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );

        return () => {
          st.kill();
          if (waiting) window.removeEventListener("intro:reveal", play);
        };
      });
    },
    { scope: frame },
  );

  return (
    <div
      ref={frame}
      className={`relative overflow-hidden rounded-3xl border border-white/10 shadow-[0_0_80px_-20px_rgb(34_211_238/0.35)] ${className ?? ""}`}
    >
      <div className="portrait-zoom absolute inset-0">
        <div className="portrait-drift absolute -inset-y-[6%] inset-x-0">
          <Image
            src="/images/jasper-about.webp"
            alt="Jasper Teo standing in a field of pink muhly grass with mountains behind"
            fill
            priority
            sizes="(min-width: 1024px) 22rem, 24rem"
            className="object-cover object-[50%_35%]"
          />
        </div>
      </div>
      <div className="portrait-scan pointer-events-none absolute inset-x-0 top-0 h-1/5 bg-gradient-to-b from-transparent via-accent/30 to-transparent opacity-0" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-accent/10" />
    </div>
  );
}
