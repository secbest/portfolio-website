import type { Metadata } from "next";
import ProjectCarousel from "@/components/ProjectCarousel";
import SplitFlap from "@/components/SplitFlap";
import TransitionLink from "@/components/TransitionLink";
import { projects } from "@/data/projects";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-32 sm:px-8">
      <h1 className="mb-8 text-[clamp(2.75rem,7vw,5rem)] font-semibold leading-[0.95] tracking-tighter">
        <SplitFlap text="Projects" />
      </h1>
      <ProjectCarousel items={projects} />

      <div className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-10">
        <div>
          <p className="mb-2 font-mono text-sm text-accent">Competitions</p>
          <p className="max-w-xl text-lg text-foreground/80">
            Hackathons and contests I&apos;ve built for, including a 2nd place finish at the NexGen Tech Talent Day Hackathon.
          </p>
        </div>
        <TransitionLink
          href="/competitions"
          data-cursor="View"
          className="rounded-full border border-line px-6 py-3 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
        >
          See competitions →
        </TransitionLink>
      </div>
    </div>
  );
}
