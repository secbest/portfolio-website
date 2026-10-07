"use client";

import { useEffect, useState } from "react";

const MESSAGE = "Hello, I'm Jasper, nice to meet you ^_^";

/** Types the greeting out letter by letter. Mount it fresh to replay. */
export default function FaceGreeting() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= MESSAGE.length) {
          clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, 55);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      aria-hidden
      className="greeting-in whitespace-nowrap rounded-full border border-accent/40 bg-black/50 px-4 py-2 font-mono text-xs text-accent backdrop-blur-sm sm:text-sm"
    >
      {MESSAGE.slice(0, count)}
      <span className="caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-accent" />
    </div>
  );
}
