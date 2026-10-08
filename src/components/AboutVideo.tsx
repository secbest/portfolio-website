"use client";

import { useEffect, useRef } from "react";

const VIDEO_SRC = "/videos/about.mp4";

export default function AboutVideo({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) ref.current?.pause();
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/10 shadow-[0_0_80px_-20px_rgb(34_211_238/0.35)] ${className ?? ""}`}
    >
      <video
        ref={ref}
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="AI-generated video of Jasper"
        className="size-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-accent/10" />
    </div>
  );
}
