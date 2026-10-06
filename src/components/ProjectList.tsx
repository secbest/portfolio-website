import TransitionLink from "@/components/TransitionLink";
import Reveal from "@/components/Reveal";
import type { Project } from "@/data/projects";

export default function ProjectList({ items }: { items: Project[] }) {
  return (
    <Reveal stagger className="border-t border-line">
      {items.map((p, i) => (
        <TransitionLink
          key={p.slug}
          href={`/projects/${p.slug}`}
          data-cursor="View"
          className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-2 border-b border-line py-8 transition-colors hover:bg-white/[0.03] sm:grid-cols-[4rem_1fr_auto] sm:px-4"
        >
          <span className="font-mono text-sm text-muted">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="text-3xl font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-3 sm:text-5xl">
              {p.title}
            </h3>
            <p className="mt-2 max-w-xl text-muted">{p.summary}</p>
          </div>
          <div className="col-start-2 flex flex-wrap gap-2 sm:col-start-3 sm:justify-end">
            {p.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-line px-3 py-1 text-xs text-muted"
              >
                {t}
              </span>
            ))}
          </div>
        </TransitionLink>
      ))}
    </Reveal>
  );
}
