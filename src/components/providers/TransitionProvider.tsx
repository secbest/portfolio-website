"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { getLenis } from "@/lib/lenis";

type Box = { top: number; left: number; width: number; height: number };
export type MorphSource = { src: string; box: Box };
type Morph = {
  src: string;
  from: Box;
  to: Box | null;
  fromPath: string;
  stage: "expand" | "wait" | "land";
  full: Box;
};

const TransitionContext = createContext<(href: string, morph?: MorphSource) => void>(() => {});
const RADIUS = 16;
const toBox = (r: DOMRect): Box => ({ top: r.top, left: r.left, width: r.width, height: r.height });

export const useNavigate = () => useContext(TransitionContext);

export default function TransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const target = useRef<string | null>(null);
  // The curtain stays up while the pathname still equals the one we left.
  const [leftFrom, setLeftFrom] = useState<string | null>(null);
  const [dest, setDest] = useState("");
  const [morph, setMorph] = useState<Morph | null>(null);
  const covered = leftFrom !== null && leftFrom === pathname;

  const finishMorph = useCallback(() => {
    delete document.documentElement.dataset.morph;
    getLenis()?.start();
    target.current = null;
    setMorph(null);
  }, []);

  const navigate = useCallback(
    (href: string, source?: MorphSource) => {
      if (href === pathname || target.current) return;
      if (reduced) {
        router.push(href);
        return;
      }
      target.current = href;
      if (source) {
        document.documentElement.dataset.morph = "";
        getLenis()?.stop();
        setMorph({
          src: source.src,
          from: source.box,
          to: null,
          fromPath: pathname,
          stage: "expand",
          full: { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight },
        });
        return;
      }
      setDest(href);
      setLeftFrom(pathname);
    },
    [pathname, reduced, router],
  );

  // Once the new route has mounted, fly the image into its screenshot slot.
  useEffect(() => {
    if (!morph || morph.stage !== "wait" || pathname === morph.fromPath) return;
    window.scrollTo(0, 0);
    getLenis()?.scrollTo(0, { immediate: true });
    let frame = 0;
    let tries = 0;
    const find = () => {
      tries++;
      const el = document.querySelector("[data-hero-target]");
      const box = el ? toBox(el.getBoundingClientRect()) : null;
      if (box && box.width > 0 && tries > 2) {
        setMorph((m) => (m ? { ...m, stage: "land", to: box } : m));
        return;
      }
      if (tries > 90) {
        finishMorph();
        return;
      }
      frame = requestAnimationFrame(find);
    };
    frame = requestAnimationFrame(find);
    return () => cancelAnimationFrame(frame);
  }, [morph, pathname, finishMorph]);

  const label = dest.split("/").filter(Boolean)[0] ?? "home";

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <AnimatePresence
        onExitComplete={() => {
          target.current = null;
          setLeftFrom(null);
        }}
      >
        {covered && (
          <motion.div
            key="curtain"
            className="fixed inset-0 z-[90] grid place-items-center bg-accent text-black"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            onAnimationComplete={() => {
              const next = target.current;
              if (next) router.push(next);
            }}
          >
            <span className="text-5xl font-semibold uppercase tracking-tight sm:text-7xl">
              {label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {morph && (
          <>
            <motion.div
              key="morph-bg"
              className="fixed inset-0 z-[90] bg-background"
              initial={{ opacity: 0 }}
              animate={{ opacity: morph.stage === "land" ? 0 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: morph.stage === "land" ? 0.8 : 0.5, ease: "easeOut" }}
            />
            <motion.div
              key="morph-img"
              className="pointer-events-none fixed z-[91] overflow-hidden border border-line bg-background"
              initial={{ ...morph.from, borderRadius: RADIUS }}
              animate={
                morph.stage === "land" && morph.to
                  ? { ...morph.to, borderRadius: RADIUS }
                  : { ...morph.full, borderRadius: 0 }
              }
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: morph.stage === "land" ? 0.8 : 0.65, ease: [0.76, 0, 0.24, 1] }}
              onAnimationComplete={() => {
                if (morph.stage === "expand") {
                  setMorph({ ...morph, stage: "wait" });
                  router.push(target.current ?? "/");
                } else if (morph.stage === "land") {
                  finishMorph();
                }
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={morph.src} alt="" className="size-full object-cover object-top" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}

