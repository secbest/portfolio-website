import {
  siAnthropic,
  siBootstrap,
  siCloudinary,
  siCss,
  siDocker,
  siFigma,
  siFirebase,
  siFlask,
  siFlutter,
  siGit,
  siGithub,
  siGooglecloud,
  siGooglegemini,
  siHtml5,
  siJavascript,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siSupabase,
  siTailwindcss,
  siVite,
} from "simple-icons";

const icons: Record<string, { title: string; path: string }> = {
  React: siReact,
  "Tailwind CSS": siTailwindcss,
  "Next.js": siNextdotjs,
  Bootstrap: siBootstrap,
  Flutter: siFlutter,
  Vite: siVite,
  "Node.js": siNodedotjs,
  Flask: siFlask,
  Supabase: siSupabase,
  PostgreSQL: siPostgresql,
  HTML: siHtml5,
  CSS: siCss,
  JavaScript: siJavascript,
  Python: siPython,
  Firebase: siFirebase,
  "Google Cloud": siGooglecloud,
  Docker: siDocker,
  Cloudinary: siCloudinary,
  Gemini: siGooglegemini,
  Anthropic: siAnthropic,
  Figma: siFigma,
  Git: siGit,
  GitHub: siGithub,
};

// simple-icons has no mark for these, so they get a lettered tile instead.
const monograms: Record<string, string> = {
  "C#": "C#",
  SQL: "SQL",
  AWS: "AWS",
  OpenAI: "AI",
  Illustrator: "Ai",
  "Premiere Pro": "Pr",
};

export default function SkillIcon({ name, className = "size-6" }: { name: string; className?: string }) {
  const icon = icons[name];
  if (icon) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
        <path d={icon.path} />
      </svg>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-md border-2 border-current font-mono text-[0.45em] font-bold leading-none ${className}`}
    >
      {monograms[name] ?? name.slice(0, 2)}
    </span>
  );
}
