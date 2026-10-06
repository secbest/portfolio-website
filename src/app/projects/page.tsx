import type { Metadata } from "next";
import ProjectList from "@/components/ProjectList";
import SplitWords from "@/components/SplitWords";
import { projects } from "@/data/projects";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-36 sm:px-8">
      <h1 className="mb-16 text-[clamp(3rem,10vw,8rem)] font-semibold leading-[0.95] tracking-tighter">
        <SplitWords text="Projects" />
      </h1>
      <ProjectList items={projects} />
    </div>
  );
}
