import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-8 text-sm text-muted sm:px-8">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          className="hover:text-foreground"
        >
          LinkedIn
        </a>
      </div>
    </footer>
  );
}
