export type Project = {
  slug: string;
  title: string;
  year: string;
  summary: string;
  description: string;
  tags: string[];
  href?: string;
};

// TODO: replace the placeholder entries with real projects (add screenshots or
// video previews under public/projects/ when ready).
export const projects: Project[] = [
  {
    slug: "jalan-besar-town-council",
    title: "Jalan Besar Town Council",
    year: "2024",
    summary: "WordPress website built during my web developer role.",
    description:
      "Contributed web design and development to the Jalan Besar Town Council website while working at SF Technologies Pte Ltd, using WordPress.",
    tags: ["WordPress", "Web Design", "PHP"],
    href: "https://jbtc.org.sg/",
  },
  {
    slug: "project-two",
    title: "Project Two",
    year: "2025",
    summary: "Placeholder: a full-stack app built with Next.js and Supabase.",
    description:
      "Replace this with a short write-up: the problem, what you built, your role, and what you learned.",
    tags: ["Next.js", "Supabase", "Tailwind CSS"],
  },
  {
    slug: "project-three",
    title: "Project Three",
    year: "2025",
    summary: "Placeholder: a mobile app built with Flutter and Firebase.",
    description:
      "Replace this with a short write-up: the problem, what you built, your role, and what you learned.",
    tags: ["Flutter", "Firebase"],
  },
  {
    slug: "project-four",
    title: "Project Four",
    year: "2026",
    summary: "Placeholder: an AI-powered tool using the Gemini or OpenAI API.",
    description:
      "Replace this with a short write-up: the problem, what you built, your role, and what you learned.",
    tags: ["Python", "Flask", "AI"],
  },
];
