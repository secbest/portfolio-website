"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const TransitionContext = createContext<(href: string) => void>(() => {});

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
  const covered = leftFrom !== null && leftFrom === pathname;

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname || target.current) return;
      if (reduced) {
        router.push(href);
        return;
      }
      target.current = href;
      setDest(href);
      setLeftFrom(pathname);
    },
    [pathname, reduced, router],
  );

  const label = dest.split("/").filter(Boolean)[0] ?? "home";

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <AnimatePresence
        onExitComplete={() => {
          target.current = null;
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
    </TransitionContext.Provider>
  );
}

