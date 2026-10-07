"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { skillGroups } from "@/data/skills";
import { getLenis } from "@/lib/lenis";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Pinned scroll showcase: the section locks to the viewport and each skill
 * category takes over the screen in turn as the visitor scrolls. With reduced
 * motion it falls back to a plain stacked list.
 */
export default function SkillsShowcase({ heading = "h2" }: { heading?: "h1" | "h2" }) {
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const count = skillGroups.length;
  const Heading = heading;

  const goTo = (index: number) => {
    const st = trigger.current;
    if (!st) return;
    // Land just after the category has finished animating in.
    const progress = index === 0 ? 0 : (index + 0.4) / count;
    const y = st.start + progress * (st.end - st.start);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        el.classList.add("skills-pinned");

        const panels = gsap.utils.toArray<HTMLElement>(".skills-panel", el);
        const tabs = gsap.utils.toArray<HTMLElement>(".skills-tab", el);
        const fill = el.querySelector<HTMLElement>(".skills-fill");
        const counter = el.querySelector<HTMLElement>(".skills-counter");
        gsap.set(panels.slice(1), { autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: `+=${count * 90}%`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            onUpdate: (self) => {
              const active = Math.min(count - 1, Math.floor(self.progress * count));
              tabs.forEach((t, i) => {
                t.dataset.active = String(i === active);
                if (i === active) t.setAttribute("aria-current", "true");
                else t.removeAttribute("aria-current");
              });
              if (counter) counter.textContent = `${pad(active + 1)} / ${pad(count)}`;
              if (fill) gsap.set(fill, { scaleX: self.progress });
            },
          },
        });

        trigger.current = tl.scrollTrigger ?? null;

        panels.forEach((panel, i) => {
          const title = panel.querySelector(".skills-title");
          const items = panel.querySelectorAll(".skills-item");

          if (i > 0) {
            tl.fromTo(panel, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.3 }, i);
            // y is pinned to 0 explicitly so a stale transform (e.g. after a dev
            // hot-reload) can't leave the title offset.
            tl.fromTo(title, { yPercent: 105, y: 0 }, { yPercent: 0, y: 0, duration: 0.3 }, i);
            tl.fromTo(
              items,
              { x: 60, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.25, stagger: 0.04 },
              i + 0.05,
            );
          }
          if (i < count - 1) {
            tl.to(panel, { autoAlpha: 0, y: -60, duration: 0.2, ease: "power2.in" }, i + 0.8);
          }
        });
        // Pad the timeline so its length equals one unit per category.
        tl.to({}, { duration: 0 }, count);

        return () => {
          trigger.current = null;
          el.classList.remove("skills-pinned");
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="skills-section relative border-y border-line">
      <Heading className="sr-only">Skills</Heading>
      <div className="skills-stage relative">
        <p className="skills-ui absolute inset-x-0 top-24 z-10 mx-auto flex w-full max-w-6xl justify-between px-5 font-mono text-sm sm:px-8">
          <span className="text-accent">{"// skills"}</span>
          <span className="skills-counter text-muted">{`${pad(1)} / ${pad(count)}`}</span>
        </p>

        {skillGroups.map((group, i) => (
          <div key={group.title} className="skills-panel">
            <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-5 sm:px-8 md:grid-cols-2 md:gap-16">
              <div>
                <p className="mb-3 font-mono text-sm text-accent">{pad(i + 1)}</p>
                <h3 className="overflow-hidden pb-[0.1em]">
                  <span className="skills-title inline-block text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[1] tracking-tighter">
                    {group.title}
                  </span>
                </h3>
              </div>
              <ul>
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="skills-item flex items-center gap-4 border-b border-line py-2.5 text-2xl font-medium sm:py-3 sm:text-4xl"
                  >
                    <span className="size-2 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        <div className="skills-ui absolute inset-x-0 bottom-8 z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
          <div className="mb-3 h-px bg-line">
            <div className="skills-fill h-full origin-left scale-x-0 bg-accent" />
          </div>
          <ul className="flex justify-between gap-2 font-mono text-xs text-muted">
            {skillGroups.map((group, i) => (
              <li key={group.title}>
                <button
                  type="button"
                  data-active={i === 0}
                  aria-current={i === 0 ? "true" : undefined}
                  aria-label={group.title}
                  onClick={() => goTo(i)}
                  className="skills-tab py-2 transition-colors hover:text-foreground data-[active=true]:text-accent"
                >
                  <span>{pad(i + 1)}</span>
                  <span className="hidden sm:inline"> {group.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
