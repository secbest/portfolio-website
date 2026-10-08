import HeroScene from "@/components/HeroScene";
import HeroIntro from "@/components/HeroIntro";
import ProjectList from "@/components/ProjectList";
import Reveal from "@/components/Reveal";
import SkillsShowcase from "@/components/SkillsShowcase";
import SplitWords from "@/components/SplitWords";
import TransitionLink from "@/components/TransitionLink";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <>
      <section className="relative flex min-h-svh items-end overflow-hidden px-5 pb-16 pt-32 sm:px-8">
        <div className="grid-bg absolute inset-0" aria-hidden />
        <div className="absolute inset-0" aria-hidden>
          <HeroScene />
        </div>
        <div className="pointer-events-none relative z-10 mx-auto w-full max-w-6xl">
          <p className="mb-4 font-mono text-sm text-accent">
            <span className="mr-2 inline-block size-2 animate-pulse rounded-full bg-accent" />
            status: online · {profile.role} · {profile.location}
          </p>
          <h1 className="text-[clamp(3rem,10vw,7.5rem)] font-semibold leading-[0.9] tracking-tighter">
            <SplitWords text={profile.name} />
          </h1>
          <HeroIntro />
          <div className="pointer-events-auto mt-8 flex flex-wrap gap-3">
            <TransitionLink
              href="/projects"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black"
            >
              View projects
            </TransitionLink>
            <TransitionLink
              href="/contact"
              className="rounded-full border border-line px-6 py-3 text-sm font-semibold hover:border-foreground"
            >
              Get in touch
            </TransitionLink>
          </div>
        </div>
      </section>

      <SkillsShowcase />

      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <Reveal className="mb-10 flex items-end justify-between gap-4">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Selected work
          </h2>
          <TransitionLink href="/projects" className="text-sm text-muted hover:text-foreground">
            All projects →
          </TransitionLink>
        </Reveal>
        <ProjectList items={projects.slice(0, 3)} />
      </section>
    </>
  );
}
