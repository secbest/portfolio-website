import type { Metadata } from "next";
import AboutVideo from "@/components/AboutVideo";
import BeyondCode from "@/components/BeyondCode";
import EntryList from "@/components/EntryList";
import Reveal from "@/components/Reveal";
import SplitWords from "@/components/SplitWords";
import { profile } from "@/data/profile";

export const metadata: Metadata = { title: "About" };
export const revalidate = 3600;

function Block({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <Reveal className="grid gap-4 border-t border-line py-10 sm:grid-cols-[14rem_1fr]">
      <div>
        <h2 className="font-mono text-sm text-accent">{title}</h2>
        {hint && <p className="mt-2 max-w-[12rem] font-mono text-xs text-muted">{hint}</p>}
      </div>
      <div>{children}</div>
    </Reveal>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-36 sm:px-8">
      <div className="mb-20 grid items-start gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
        <div>
          <h1 className="mb-16 text-[clamp(3rem,10vw,8rem)] font-semibold leading-[0.95] tracking-tighter">
            <SplitWords text="About me" />
          </h1>

          <Reveal className="max-w-3xl space-y-5 text-xl leading-relaxed text-foreground/90">
            {profile.summary.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
        </div>

        <Reveal className="mx-auto w-full max-w-sm lg:sticky lg:top-28 lg:mt-6 lg:max-w-none">
          <AboutVideo className="aspect-[4/5]" />
        </Reveal>
      </div>

      <Block title="Education" hint="Click an item to see more">
        <EntryList
          items={profile.education.map((e) => ({
            id: e.school,
            title: e.school,
            subtitle: e.programme,
            period: e.period,
            logo: e.logo,
            logoFit: e.logoFit,
            details: e.details,
          }))}
        />
      </Block>

      <Block title="Experience" hint="Click an item to see more">
        <EntryList
          items={profile.experience.map((e) => ({
            id: e.company,
            title: `${e.role}, ${e.company}`,
            subtitle: e.summary,
            period: e.period,
            logo: e.logo,
            logoFit: e.logoFit,
            details: e.details,
          }))}
        />
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

      <BeyondCode />
    </div>
  );
}
