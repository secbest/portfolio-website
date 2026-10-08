import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectSlideshow from "@/components/ProjectSlideshow";
import Reveal from "@/components/Reveal";
import SplitWords from "@/components/SplitWords";
import TransitionLink from "@/components/TransitionLink";
import { projects } from "@/data/projects";

type Params = { slug: string };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-20 border-t border-line pt-10">
      <Reveal>
        <h2 className="mb-8 font-mono text-sm text-accent">{title}</h2>
      </Reveal>
      {children}
    </section>
  );
}

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

      <div
        className={`mb-12 grid items-center gap-8 ${project.images ? "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14" : ""}`}
      >
        <div>
          <h1 className="mb-8 text-[clamp(2.5rem,8vw,6.5rem)] font-semibold leading-[0.95] tracking-tighter lg:text-[clamp(2.5rem,4.6vw,4.5rem)]">
            <SplitWords text={project.title} />
          </h1>
          <dl className="flex flex-wrap gap-x-10 gap-y-5 text-sm">
            <div>
              <dt className="font-mono text-accent">Year</dt>
              <dd className="mt-1">{project.year}</dd>
            </div>
            <div>
              <dt className="font-mono text-accent">Stack</dt>
              <dd className="mt-1 flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <span key={t} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                    {t}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>
        {project.images && (
          <ProjectSlideshow slides={project.images} className="order-first aspect-[16/10] lg:order-none" />
        )}
      </div>

      <Reveal className="border-t border-line pt-10">
        <div className="max-w-3xl">
          <div className="space-y-5 text-xl leading-relaxed">
            <p>{project.description}</p>
            {project.story?.map((p) => (
              <p key={p} className="text-foreground/80">
                {p}
              </p>
            ))}
          </div>
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

      {project.features && (
        <Section title="Key features">
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
            {project.features.map((f, i) => (
              <li key={f.title} className="bg-background p-6 sm:p-8">
                <p className="mb-3 font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mb-2 text-xl font-semibold tracking-tight">{f.title}</h3>
                <p className="leading-relaxed text-muted">{f.description}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {project.toolkit && (
        <Section title="Built with">
          <dl className="grid gap-8 sm:grid-cols-2">
            {project.toolkit.map((g) => (
              <div key={g.group}>
                <dt className="mb-3 font-mono text-sm text-muted">{g.group}</dt>
                <dd className="flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <span key={item} className="rounded-full border border-line px-3 py-1 text-sm">
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

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
