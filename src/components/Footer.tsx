import { GitHubIcon, LinkedInIcon } from "@/components/SocialIcons";
import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-8 text-sm text-muted sm:px-8">
        <div className="space-y-1">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p className="font-mono text-xs text-muted/70">
            Built with Next.js, Tailwind CSS, GSAP and Three.js
          </p>
        </div>
        <ul className="flex items-center gap-4">
          {[
            { href: profile.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
            { href: profile.github, label: "GitHub", Icon: GitHubIcon },
          ].map(({ href, label, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="block transition-colors hover:text-accent"
              >
                <Icon className="size-6" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
