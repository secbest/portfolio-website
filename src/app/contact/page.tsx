import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import SplitWords from "@/components/SplitWords";
import { GitHubIcon, LinkedInIcon } from "@/components/SocialIcons";
import { profile } from "@/data/profile";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-36 sm:px-8">
      <h1 className="mb-16 text-[clamp(3rem,10vw,8rem)] font-semibold leading-[0.95] tracking-tighter">
        <SplitWords text="Let's talk" />
      </h1>

      <div className="grid gap-16 border-t border-line pt-10 md:grid-cols-2">
        <Reveal className="space-y-6 text-lg">
          <p className="max-w-md text-muted">
            Open to internships, collaborations and interesting projects. Send a
            message or reach out directly.
          </p>
          <p>
            <a
              href={`mailto:${profile.email}`}
              className="text-2xl font-medium underline decoration-line underline-offset-8 hover:decoration-accent"
            >
              {profile.email}
            </a>
          </p>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              { href: profile.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
              { href: profile.github, label: "GitHub", Icon: GitHubIcon },
            ].map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 text-muted transition-colors hover:text-accent"
                >
                  <Icon className="size-6" />
                  {label} ↗
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal>
          <ContactForm email={profile.email} />
        </Reveal>
      </div>
    </div>
  );
}
