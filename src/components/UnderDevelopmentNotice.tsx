"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const VISIBLE_MS = 8000;

/** TEMPORARY: remove this file and its use in layout.tsx once the site is finished. */
export default function UnderDevelopmentNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    const show = () => {
      setOpen(true);
      timer = window.setTimeout(() => setOpen(false), VISIBLE_MS);
    };

    if (document.documentElement.dataset.intro === "playing") {
      window.addEventListener("intro:reveal", show, { once: true });
    } else {
      show();
    }

    return () => {
      window.removeEventListener("intro:reveal", show);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 z-[60] overflow-hidden rounded-xl border border-accent/30 bg-background/90 shadow-[0_0_60px_-30px_rgb(34_211_238/0.8)] backdrop-blur-xl sm:left-auto sm:right-6 sm:bottom-6 sm:w-96"
        >
          <div className="flex items-start gap-3 p-4">
            <span className="mt-1.5 h-2 w-2 shrink-0 animate-pulse rounded-full bg-accent" />
            <p className="flex-1 text-sm leading-relaxed text-foreground/85">
              <span className="font-mono text-accent">jasper-os</span> is still
              under development. Some pages and projects are being polished, so
              thanks for stopping by early.
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Dismiss notice"
              className="-m-1 p-1 text-foreground/60 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <motion.div
            className="h-0.5 origin-left bg-accent"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: VISIBLE_MS / 1000, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
