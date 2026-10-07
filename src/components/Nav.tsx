"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import TransitionLink from "@/components/TransitionLink";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 text-white sm:px-8">
        <TransitionLink
          href="/"
          aria-label="Jas, home"
          className="flex items-center gap-2.5 rounded-full text-lg font-semibold tracking-tight outline-offset-4"
        >
          <Image
            src="/jas-avatar.png"
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-full ring-1 ring-white/25"
          />
          Jas
        </TransitionLink>
        <ul className="flex gap-4 text-xs sm:gap-8 sm:text-sm">
          {links.map(({ href, label }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <TransitionLink
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`transition-opacity hover:opacity-100 ${active ? "opacity-100 underline underline-offset-4" : "opacity-60"}`}
                >
                  {label}
                </TransitionLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
