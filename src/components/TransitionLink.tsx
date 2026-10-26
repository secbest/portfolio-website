"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useNavigate } from "@/components/providers/TransitionProvider";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

const pickBox = ({ top, left, width, height }: DOMRect) => ({ top, left, width, height });

export default function TransitionLink({ href, onClick, ...props }: Props) {
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0
    ) {
      return;
    }
    e.preventDefault();
    const img = e.currentTarget.querySelector<HTMLImageElement>("[data-morph-src]");
    const frame = img?.parentElement;
    navigate(
      href,
      img && frame && img.currentSrc
        ? { src: img.currentSrc, box: pickBox(frame.getBoundingClientRect()) }
        : undefined,
    );
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
