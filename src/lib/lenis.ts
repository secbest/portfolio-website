import type Lenis from "lenis";

// Shared handle so other components can drive the smooth scroller.
let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis;
};

export const getLenis = () => instance;
