import type { Metadata } from "next";
import Image from "next/image";
import AboutVideo from "@/components/AboutVideo";
import Reveal from "@/components/Reveal";
import SplitWords from "@/components/SplitWords";
import { profile } from "@/data/profile";

export const metadata: Metadata = { title: "About" };

const initials = (name: string) =>
  name
    .split(" ")
    .filter((w) => /^[A-Z]/.test(w))
    .map((w) => w[0])
    .join("")
    .slice(0, 3);

type LogoFit = "contain" | "cover" | "small";

const logoFit: Record<LogoFit, { box: string; img: string }> = {
  contain: { box: "p-1", img: "object-contain" },
  small: { box: "p-1.65", img: "object-contain" },
  cover: { box: "p-0", img: "object-cover" },
};

function LogoTile({ src, name, fit = "contain" }: { src?: string; name: string; fit?: LogoFit }) {
  return (
    <div className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-white/95 font-mono text-sm font-semibold text-black">
      {src ? (
        <div className={`size-full ${logoFit[fit].box}`}>
          <div className="relative size-full">
            <Image
              src={src}
              alt={`${name} logo`}
              fill
              sizes="56px"
              className={`object-center ${logoFit[fit].img}`}
            />
          </div>
        </div>
      ) : (
        <span aria-hidden>{initials(name)}</span>
      )}
    </div>
  );
}

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

      <Block title="Education">
        <ul className="space-y-5">
          {profile.education.map((e) => (
            <li key={e.school} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
              <div className="flex items-center gap-4">
                <LogoTile src={e.logo} name={e.school} fit={e.logoFit} />
                <div>
                  <p className="text-lg font-medium">{e.school}</p>
                  <p className="text-muted">{e.programme}</p>
                </div>
              </div>
              <p className="font-mono text-sm text-muted">{e.period}</p>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Experience">
        <ul className="space-y-5">
          {profile.experience.map((e) => (
            <li key={e.company} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
              <div className="flex items-center gap-4">
                <LogoTile src={e.logo} name={e.company} fit={e.logoFit} />
                <div>
                  <p className="text-lg font-medium">
                    {e.role}, {e.company}
                  </p>
                  <p className="text-muted">{e.summary}</p>
                </div>
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
