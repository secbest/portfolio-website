"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Three.js is browser-only and heavy, so it's a separate chunk.
const loadHero = () => import("@/components/Hero3D");
const Hero3D = dynamic(loadHero, { ssr: false });

export default function HeroScene() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Download the chunk right away, but don't start rendering until the boot
    // intro has lifted so the two animations don't fight for the GPU.
    void loadHero();
    if (document.documentElement.dataset.intro !== "playing") {
      const id = window.setTimeout(() => setReady(true), 0);
      return () => window.clearTimeout(id);
    }
    const start = () => setReady(true);
    window.addEventListener("intro:reveal", start, { once: true });
    return () => window.removeEventListener("intro:reveal", start);
  }, []);

  return ready ? <Hero3D /> : null;
}
