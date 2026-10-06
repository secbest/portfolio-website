import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import SplitWords from "@/components/SplitWords";
import TransitionLink from "@/components/TransitionLink";
import { projects } from "@/data/projects";

type Params = { slug: string };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return { title: project?.title ?? "Project" };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-36 sm:px-8">
      <TransitionLink
        href="/projects"
        className="mb-10 inline-block text-sm text-muted hover:text-foreground"
      >
        ← All projects
      </TransitionLink>

      <h1 className="mb-8 text-[clamp(2.5rem,8vw,6.5rem)] font-semibold leading-[0.95] tracking-tighter">
        <SplitWords text={project.title} />
      </h1>

      <Reveal className="grid gap-10 border-t border-line pt-10 sm:grid-cols-[14rem_1fr]">
        <dl className="space-y-5 text-sm">
          <div>
            <dt className="font-mono text-accent">Year</dt>
            <dd className="mt-1">{project.year}</dd>
          </div>
          <div>
            <dt className="font-mono text-accent">Stack</dt>
            <dd className="mt-1 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line px-3 py-1 text-xs text-muted"
                >
                  {t}
                </span>
              ))}
            </dd>
          </div>
        </dl>
        <div>
          <p className="max-w-2xl text-xl leading-relaxed">{project.description}</p>
          {project.href && (
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black"
            >
              Visit site ↗
            </a>
          )}
        </div>
      </Reveal>

      <Reveal className="mt-24 border-t border-line pt-10">
        <p className="mb-2 font-mono text-sm text-muted">Next project</p>
        <TransitionLink
          href={`/projects/${next.slug}`}
          data-cursor="Next"
          className="text-4xl font-semibold tracking-tight hover:text-accent sm:text-6xl"
        >
          {next.title} →
        </TransitionLink>
      </Reveal>
    </div>
  );
}
