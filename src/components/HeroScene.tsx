"use client";

import dynamic from "next/dynamic";

// Three.js is browser-only and heavy, so load it after the page shell renders.
const Hero3D = dynamic(() => import("@/components/Hero3D"), { ssr: false });

export default function HeroScene() {
  return <Hero3D />;
}
