export type EntryDetails = {
  summary: string;
  highlights?: string[];
  link?: { label: string; href: string };
};

type Education = {
  school: string;
  programme: string;
  period: string;
  /** Path under /public, e.g. "/logos/np.png". Falls back to the school's initials. */
  logo?: string;
  /** How the logo fills its tile. Defaults to "contain". */
  logoFit?: "contain" | "cover" | "small";
  /** Shown in the popup when the row is clicked. Draft wording: edit freely. */
  details?: EntryDetails;
};

export const profile = {
  name: "Jasper Teo",
  role: "IT Student & Web Developer",
  tagline:
    "Web experiences where the interaction is the point. Animated, accessible and fast, with AI doing the heavy lifting behind the scenes.",
  location: "Singapore",
  intro: [
    "I enjoy building **web experiences** that feel alive, from council websites that residents rely on every day to animated portfolios with 3D scenes and scroll-driven motion.",
    "I pair clean front-end craft with a growing interest in **AI-driven development** to build things that are fast, accessible and a pleasure to use. I'm currently looking for internships where I can keep learning by shipping real products.",
  ],
  email: "jastkc8@gmail.com",
  linkedin: "https://www.linkedin.com/in/jasper-teo-jt",
  github: "https://github.com/secbest",
  summary: [
    "I'm a Year 2 Information Technology student at Nanyang Polytechnic, building on a Higher Nitec in IT Applications Development from ITE College Central.",
    "It started in secondary school, when I published WordPress blogs and kept bending themes to see what happened. Since then I've worked as a Web Developer at SF Technologies (including jbtc.org.sg), picked up the full stack from React and Next.js to Node, Flask and Supabase, and learned design tools like Figma and Premiere Pro.",
    "Right now I'm focused on AI-driven development with Gemini, OpenAI and Anthropic, and I'm heading to Gachon University in Seoul this September for an exchange semester in Computer Engineering.",
  ],
  topSkills: ["Artificial Intelligence", "Cybersecurity", "Programming"],
  languages: ["English (native or bilingual)", "Chinese (elementary)"],
  education: [
    {
      school: "Nanyang Polytechnic",
      programme: "Diploma in Information Technology",
      period: "2025 – 2028",
      logo: "/logos/np.png",
      details: {
        summary: "A three-year diploma at Nanyang Polytechnic's School of Information Technology, where I'm now in Year 2.",
        highlights: [
          "Building full-stack web projects and exploring AI-driven development",
          "Overseas exchange semester at Gachon University in 2026",
        ],
      },
    },
    {
      school: "Gachon University",
      programme: "Computer Engineering (exchange)",
      period: "Sep – Dec 2026",
      logo: "/logos/gachon.png",
      details: {
        summary: "An exchange semester in Computer Engineering at Gachon University in South Korea, as part of my diploma.",
        highlights: ["Studying computer engineering modules abroad", "Experiencing a new campus, culture and way of learning"],
      },
    },
    {
      school: "Institute of Technical Education",
      programme: "Higher Nitec in IT Applications Development",
      period: "2023 – 2025",
      logo: "/logos/ite.png",
      logoFit: "cover",
      details: {
        summary: "A Higher Nitec in IT Applications Development at ITE College Central, the foundation for my diploma.",
        highlights: ["Programming, web and application development fundamentals", "Led directly into my Diploma in IT at Nanyang Polytechnic"],
      },
    },
    {
      school: "Holy Innocents' High School",
      programme: "GCE N&O Levels",
      period: "2019 – 2022",
      logo: "/logos/hihs.png",
      logoFit: "small",
      details: {
        summary: "My GCE N&O Levels at Holy Innocents' High School.",
        highlights: ["Where my interest in tech began: publishing WordPress blogs in secondary school"],
      },
    },
  ] as Education[],
  experience: [
    {
      company: "SF Technologies Pte Ltd",
      role: "Web Developer",
      period: "Sep 2024 – Feb 2025",
      summary: "Web design and development using WordPress.",
      logo: "/logos/sf.png",
      logoFit: "small" as const,
      details: {
        summary: "My first internship: designing and building WordPress websites for clients at SF Technologies.",
        highlights: [
          "Web design and development with WordPress and Elementor",
          "Worked on the Jalan Besar Town Council website",
        ],
        link: { label: "See the project", href: "/projects/jalan-besar-town-council" },
      } as EntryDetails,
    },
  ],
  certifications: [
    "User Experience Design Fundamentals",
    "AI Fluency Framework & Foundations",
    "Web Development Fundamentals",
  ],
  awards: [
    "Edusave Scholarship Award (MOE)",
    "Chief Commissioner Award",
    "Edusave Award for Achievement, Good Leadership and Service (EAGLES)",
  ],
};
