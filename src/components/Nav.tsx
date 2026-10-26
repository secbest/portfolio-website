"use client";

import { useEffect, useRef, useState } from "react";
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
  work: (
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

type NavLink = { href: string; label: string };

const links: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/contact", label: "Contact" },
];

const work = {
  label: "Work",
  children: [
    { href: "/projects", label: "Projects", hint: "Things I've built" },
    { href: "/competitions", label: "Competitions", hint: "Hackathons & contests" },
  ] satisfies (NavLink & { hint: string })[],
};

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

function NavIcon({ name }: { name: string }) {
  return (
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
      {icons[name]}
    </svg>
  );
}

function NavItem({ href, label, pathname }: NavLink & { pathname: string }) {
  const active = isActive(pathname, href);
  return (
    <li>
      <TransitionLink
        href={href}
        aria-label={label}
        aria-current={active ? "page" : undefined}
        className={`nav-link flex items-center gap-2 rounded-full px-2 py-1.5 transition-all hover:text-accent hover:opacity-100 sm:px-3 ${active ? "text-accent opacity-100" : "opacity-70"}`}
      >
        <NavIcon name={href} />
        <span className="hidden sm:inline">{label}</span>
      </TransitionLink>
    </li>
  );
}

/** "Work" menu: opens on hover, click or keyboard, and closes on Escape or an outside click. */
function WorkMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const active = work.children.some((c) => isActive(pathname, c.href));

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <li
      ref={ref}
      className="relative"
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
    >
      <button
        type="button"
        aria-label={work.label}
        aria-haspopup="true"
        aria-expanded={open}
        aria-current={active ? "page" : undefined}
        onClick={() => setOpen((o) => !o)}
        className={`nav-link flex items-center gap-2 rounded-full px-2 py-1.5 transition-all hover:text-accent hover:opacity-100 sm:px-3 ${active || open ? "text-accent opacity-100" : "opacity-70"}`}
      >
        <NavIcon name="work" />
        <span className="hidden sm:inline">{work.label}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`hidden size-3.5 transition-transform sm:block ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div
        className={`absolute right-0 top-full pt-3 transition-all duration-200 ${open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}
      >
        <span
          aria-hidden
          className="absolute right-7 top-1.5 z-10 size-3 rotate-45 border-l border-t border-accent/30 bg-background"
        />
        <div className="relative w-64 overflow-hidden rounded-2xl border border-accent/25 bg-background/95 p-2 shadow-[0_0_50px_-15px_rgb(34_211_238/0.45),0_20px_60px_-20px_rgb(0_0_0/0.9)] backdrop-blur-xl">
          <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
          />
          <p className="relative px-3 pb-2 pt-1 font-mono text-[0.7rem] uppercase tracking-widest text-accent/70">
            {"// work"}
          </p>
          <ul className="relative">
            {work.children.map(({ href, label, hint }, i) => {
              const current = isActive(pathname, href);
              return (
                <li key={href}>
                  <TransitionLink
                    href={href}
                    aria-current={current ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:origin-center before:rounded-full before:bg-accent before:transition-transform hover:bg-accent/10 ${current ? "bg-accent/10 before:scale-y-100" : "before:scale-y-0 hover:before:scale-y-100"}`}
                  >
                    <span className="font-mono text-xs text-accent/60">{String(i + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-sm sm:text-base ${current ? "text-accent" : "text-white/90 group-hover:text-accent"}`}>
                        {label}
                      </span>
                      <span className="block text-xs text-white/50">{hint}</span>
                    </span>
                    <span
                      aria-hidden
                      className="text-accent opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                    >
                      →
                    </span>
                  </TransitionLink>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </li>
  );
}

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
          {links.slice(0, 3).map(({ href, label }) => (
            <NavItem key={href} href={href} label={label} pathname={pathname} />
          ))}
          <WorkMenu pathname={pathname} />
          {links.slice(3).map(({ href, label }) => (
            <NavItem key={href} href={href} label={label} pathname={pathname} />
          ))}
        </ul>
      </nav>
    </header>
  );
}
