import type { Metadata } from "next";
import ProjectCarousel from "@/components/ProjectCarousel";
import SplitWords from "@/components/SplitWords";
import { projects } from "@/data/projects";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-32 sm:px-8">
      <h1 className="mb-8 text-[clamp(2.75rem,7vw,5rem)] font-semibold leading-[0.95] tracking-tighter">
        <SplitWords text="Projects" />
      </h1>
      <ProjectCarousel items={projects} />
    </div>
  );
}
