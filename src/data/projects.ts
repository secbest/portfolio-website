export type Project = {
  slug: string;
  title: string;
  year: string;
  summary: string;
  description: string;
  tags: string[];
  href?: string;
  /** Extra paragraphs shown under the description on the detail page. */
  story?: string[];
  images?: { src: string; alt: string; caption: string; width: number; height: number }[];
  features?: { title: string; description: string }[];
  toolkit?: { group: string; items: string[] }[];
};

// TODO: replace the placeholder entries with real projects (add screenshots or
// video previews under public/projects/ when ready).
export const projects: Project[] = [
  {
    slug: "jalan-besar-town-council",
    title: "Jalan Besar Town Council",
    year: "2024",
    summary: "My first internship project: a resident-facing council website, built in WordPress.",
    description:
      "My first project as an intern at SF Technologies, and the first website I helped ship for real residents. Jalan Besar Town Council needed a friendlier front door online: somewhere to pay service charges, find an MP's Meet-the-People session, or report a problem without digging through PDFs.",
    story: [
      "I turned a deep tree of pages, forms and documents into a site people can actually find their way around, using WordPress and Elementor for layout, a clear mega-menu for navigation, and the town council's own illustrated mascots and colours to keep it warm instead of bureaucratic.",
    ],
    tags: ["WordPress", "Elementor", "OceanWP", "Web Design"],
    href: "https://jbtc.org.sg/",
    images: [
      {
        src: "/images/jbtc_home.png",
        alt: "JBTC home page with a photo slideshow, illustrated shophouse skyline and mega-menu navigation",
        caption: "Home: photo slideshow, illustrated skyline and a six-section mega-menu",
        width: 1915,
        height: 915,
      },
      {
        src: "/images/jbtc_our_mps_josephine_teo.png",
        alt: "JBTC Our MPs page showing an MP profile card and Meet-the-People session schedule",
        caption: "Our MPs: profile cards with socials, map link and session schedules",
        width: 1917,
        height: 913,
      },
      {
        src: "/images/jbtc_service_conservancy_charges.png",
        alt: "JBTC Service and Conservancy Charges page with mascot illustrations",
        caption: "Services: S&CC information with illustrated mascots",
        width: 1917,
        height: 908,
      },
    ],
    features: [
      {
        title: "Mega-menu navigation",
        description:
          "Six top-level sections (About Us, Our MPs, Our Services, Info for Residents, Publications, Contact Us) with dropdowns, so residents reach any page in two clicks.",
      },
      {
        title: "MP profiles & Meet-the-People sessions",
        description:
          "Each MP has a profile card with social and email links, a View Map button, and venues, dates and times for every session.",
      },
      {
        title: "Service & conservancy charges",
        description:
          "Payment dates, late-fee rules and bulky-item removal explained in plain language with friendly mascot illustrations.",
      },
    ],
    toolkit: [
      { group: "Platform & theme", items: ["WordPress", "OceanWP", "Ocean Extra"] },
      {
        group: "Page building",
        items: ["Elementor", "Elementor Pro", "Header Footer Elementor", "Royal Elementor Addons", "Happy Elementor Addons"],
      },
      {
        group: "Forms & content",
        items: ["Contact Form 7", "Drag & Drop File Upload", "TablePress", "3D FlipBook (dFlip)", "PDF.js Viewer", "EmbedPress"],
      },
      { group: "Engagement & performance", items: ["AYS Popup Box", "Smush", "reCAPTCHA"] },
    ],
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
