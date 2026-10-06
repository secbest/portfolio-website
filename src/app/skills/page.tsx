import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import SplitWords from "@/components/SplitWords";
import { skillGroups } from "@/data/skills";

export const metadata: Metadata = { title: "Skills" };

export default function SkillsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-36 sm:px-8">
      <h1 className="mb-16 text-[clamp(3rem,10vw,8rem)] font-semibold leading-[0.95] tracking-tighter">
        <SplitWords text="Skills" />
      </h1>

      {skillGroups.map((group) => (
        <Reveal
          key={group.title}
          className="grid gap-5 border-t border-line py-10 sm:grid-cols-[14rem_1fr]"
        >
          <h2 className="font-mono text-sm text-accent">{group.title}</h2>
          <ul className="flex flex-wrap gap-3">
            {group.items.map((item) => (
              <li
                key={item}
                className="rounded-full border border-line px-5 py-2 text-lg transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-black"
              >
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}
