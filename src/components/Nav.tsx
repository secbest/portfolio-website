"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import TransitionLink from "@/components/TransitionLink";

const icons: Record<string, React.ReactNode> = {
  "/": (
    <>
      <path className="nav-hop" d="M3 11 12 3l9 8" />
      <path d="M5 10v10h14V10" />
      <path className="nav-pop" d="M10 20v-5h4v5" />
    </>
  ),
  "/about": (
    <>
      <circle className="nav-nod" cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </>
  ),
  "/skills": (
    <>
      <path className="nav-bl" d="m8 7-5 5 5 5" />
      <path className="nav-br" d="m16 7 5 5-5 5" />
      <path className="nav-pop" d="m14 5-4 14" />
    </>
  ),
  "/projects": (
    <>
      <path d="M3 8v11h18V8" />
      <path className="nav-folder" d="M3 8V5h7l2 3h9" />
    </>
  ),
  "/contact": (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path className="nav-flap" d="m3 7 9 6 9-6" />
    </>
  ),
};

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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl">
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
        <ul className="flex gap-3 text-sm sm:gap-7 sm:text-base">
          {links.map(({ href, label }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <TransitionLink
                  href={href}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  className={`nav-link flex items-center gap-2 rounded-full px-2 py-1.5 transition-all hover:text-accent hover:opacity-100 sm:px-3 ${active ? "text-accent opacity-100" : "opacity-70"}`}
                >
                  <svg
                    className="nav-icon size-7 sm:size-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {icons[href]}
                  </svg>
                  <span className="hidden sm:inline">{label}</span>
                </TransitionLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
