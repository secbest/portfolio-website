import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import SplitWords from "@/components/SplitWords";
import { profile } from "@/data/profile";

export const metadata: Metadata = { title: "About" };

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal className="grid gap-4 border-t border-line py-10 sm:grid-cols-[14rem_1fr]">
      <h2 className="font-mono text-sm text-accent">{title}</h2>
      <div>{children}</div>
    </Reveal>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-36 sm:px-8">
      <h1 className="mb-16 text-[clamp(3rem,10vw,8rem)] font-semibold leading-[0.95] tracking-tighter">
        <SplitWords text="About me" />
      </h1>

      <Reveal className="mb-20 max-w-3xl space-y-5 text-xl leading-relaxed text-foreground/90">
        {profile.summary.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </Reveal>

      <Block title="Education">
        <ul className="space-y-5">
          {profile.education.map((e) => (
            <li key={e.school} className="flex flex-wrap justify-between gap-x-6">
              <div>
                <p className="text-lg font-medium">{e.school}</p>
                <p className="text-muted">{e.programme}</p>
              </div>
              <p className="font-mono text-sm text-muted">{e.period}</p>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Experience">
        <ul className="space-y-5">
          {profile.experience.map((e) => (
            <li key={e.company} className="flex flex-wrap justify-between gap-x-6">
              <div>
                <p className="text-lg font-medium">
                  {e.role}, {e.company}
                </p>
                <p className="text-muted">{e.summary}</p>
              </div>
              <p className="font-mono text-sm text-muted">{e.period}</p>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Certifications">
        <ul className="space-y-2 text-lg">
          {profile.certifications.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Block>

      <Block title="Awards">
        <ul className="space-y-2 text-lg">
          {profile.awards.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </Block>

      <Block title="Languages">
        <ul className="space-y-2 text-lg">
          {profile.languages.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </Block>
    </div>
  );
}
