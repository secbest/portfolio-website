export type Project = {
  slug: string;
  title: string;
  /** Lines the title is broken into on the detail page; defaults to one line. */
  headline?: string[];
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
    headline: ["Jalan Besar", "Town Council"],
    year: "Sep - Nov 2024",
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
        src: "/images/jbtc_home.webp",
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
    slug: "sf-technologies",
    title: "SF Technologies",
    year: "Nov 2024 - Feb 2025",
    summary: "My second internship project: a company website for a Singapore web development firm, built in WordPress.",
    description:
      "My second project as an intern at SF Technologies, this time for the company itself. SF Technologies builds websites, mobile apps and custom systems for Singapore businesses, and needed a site that explains what they do, shows their work and makes it easy to get in touch.",
    story: [
      "Building on what I learned from the Jalan Besar Town Council site, I structured a larger site around three audiences: businesses looking for a service, companies exploring EDG grant funding, and clients who want to see proof of past work.",
    ],
    tags: ["WordPress", "Elementor", "Web Design"],
    href: "https://sftechnologies.co/",
    images: [
      {
        src: "/images/sft_home.webp",
        alt: "SF Technologies home page with a looping office video hero, the headline 'Digitise your Business today' and WhatsApp and Contact buttons",
        caption: "Home: video hero with WhatsApp and contact calls to action",
        width: 1917,
        height: 868,
      },
      {
        src: "/images/sft_portfolio.webp",
        alt: "SF Technologies Portfolio page with an EDG grant intro, a WhatsApp button, a phone mockup and a three-step project scope timeline",
        caption: "Portfolio: EDG grant intro with a three-step scope, execution and discovery timeline",
        width: 1901,
        height: 855,
      },
      {
        src: "/images/sft_process.webp",
        alt: "SF Technologies Web Development page showing a seven-step project execution process carousel from requirement gathering to deploy",
        caption: "Web Development: seven-step execution process carousel with icons and step details",
        width: 1901,
        height: 867,
      },
    ],
    features: [
      {
        title: "Dropdown navigation & search",
        description:
          "Grants, Services and Solutions each open into sub-pages (CTC and EDG grants, four services, seven solutions), with a search panel that closes on Escape and a skip-to-content link.",
      },
      {
        title: "Filterable portfolio",
        description:
          "Project cards for work like appointment booking, warranty registration and event systems, sorted by solution category and paginated, each linking to its own case page.",
      },
      {
        title: "Service pages with process carousel",
        description:
          "Each service explains what is offered and why to choose the team, then walks through a seven-step project process in a carousel, from requirement gathering to deployment.",
      },
      {
        title: "Grants information with tabs",
        description:
          "EDG funding and eligibility explained in plain language, with a tabbed 'what we can do for you' section (sales, finance, inventory, purchasing, leads) and an enquiry form.",
      },
      {
        title: "Contact & lead capture",
        description:
          "A contact form where visitors pick the service they need and how to be reached, plus click-to-call, email, a floating WhatsApp button and a FAQ.",
      },
      {
        title: "About, team & client logos",
        description:
          "Mission and vision, a six-step process timeline, team cards, and a client logo grid that builds trust on the home page.",
      },
    ],
    toolkit: [
      { group: "Platform & theme", items: ["WordPress", "OceanWP", "Ocean Extra"] },
      {
        group: "Page building",
        items: [
          "Elementor",
          "Elementor Pro",
          "Header Footer Elementor",
          "Royal Elementor Addons",
          "Happy Elementor Addons",
          "HT Mega",
          "The Plus Addons",
          "Essential Addons",
          "Fancy Flipbox",
        ],
      },
      { group: "Forms & content", items: ["Contact Form 7", "SearchWP Modal Search", "WP Slick Slider"] },
      { group: "Engagement & analytics", items: ["Click to Chat for WhatsApp", "Site Kit by Google", "reCAPTCHA"] },
    ],
  },
  {
    slug: "resumematch",
    title: "ResumeMatch",
    year: "Oct 2025 - Feb 2026",
    summary: "An industry project with SCCCI: an AI portal that scores resumes against job descriptions.",
    description:
      "An industry project with SCCCI and Nanyang Polytechnic, built in a team: an AI resume up-profiling and job-fit scoring portal. It uses Google Gemini to score a resume against a job description, then shows candidates where they fall short and how to fix it.",
    story: [
      "I built the core web app: a Flask and Jinja application on SQLite, with OTP-secured dashboards for candidates and employers and live job listings from the Adzuna Job Search API so scoring happens against real jobs.",
    ],
    tags: ["Python", "Flask", "SQLite", "Gemini API", "Adzuna API"],
    images: [
      {
        src: "/images/resumematch_home.webp",
        alt: "ResumeMatch candidate dashboard with a welcome banner, an upload and scan resume button, and applied and saved job counters",
        caption: "Home: candidate dashboard with resume upload, applied and saved job counters",
        width: 1280,
        height: 613,
      },
      {
        src: "/images/resumematch_scanner.webp",
        alt: "ResumeMatch scanner results showing a 78 out of 100 match score with hard skills, soft skills and experience scores and improvement tips",
        caption: "Resume Scanner: Gemini AI scans the resume and returns an overall match score, per-category scores and improvement tips",
        width: 1897,
        height: 862,
      },
      {
        src: "/images/resumematch_jobs.webp",
        alt: "ResumeMatch job listings with search and filter, and a job detail panel with Report, Scan Resume and Apply Now buttons",
        caption: "Jobs: searchable listings with a detail panel, resume scan and apply actions",
        width: 1897,
        height: 870,
      },
    ],
    features: [
      {
        title: "AI job-fit scoring",
        description:
          "Gemini scores a resume against a job description out of 100, with category scores for hard skills, soft skills and experience.",
      },
      {
        title: "Gap analysis & ATS tips",
        description:
          "Missing-keyword detection and ATS-focused suggestions turn each score into concrete improvement tips.",
      },
      {
        title: "Live job listings",
        description:
          "The Adzuna Job Search API returns Singapore jobs sorted by date, searchable by title and location, with a detail panel and one-click resume scan.",
      },
      {
        title: "Multi-role dashboards",
        description:
          "OTP-secured dashboards for candidates and employers, covering application tracking, saved jobs and job posting.",
      },
      {
        title: "Automated relevance screening",
        description:
          "Employers get applicants screened for relevance automatically instead of reading every resume by hand.",
      },
    ],
    toolkit: [
      { group: "Frontend", items: ["HTML", "CSS"] },
      { group: "Backend", items: ["Python", "Flask", "SQLite", "Jinja"] },
      { group: "AI & APIs", items: ["Gemini API", "Adzuna Job Search API"] },
    ],
  },
  {
    slug: "efar-hub",
    title: "EFAR Hub",
    year: "Apr 2026 - Aug 2026",
    summary: "An industry project with SCCCI: a finance automation platform that replaces an ambulance company's paper memos.",
    description:
      "An industry project with SCCCI and Nanyang Polytechnic, built in a team for an ambulance company. Crews were filling in paper service memos that someone then had to turn into invoices by hand. EFAR Hub replaces that with automated invoicing, reconciliation and payment reminders on the company's existing Xero setup.",
    story: [
      "I led backend development: the Xero invoice sync, the admin dashboard and the field crew jobs pipeline. The platform also covers quotation, accounts receivable and payable workflows, Gemini OCR for vendor invoices and a mobile memo wizard, and I validated the workflows with test scripts before deploying on Vercel and Render.",
    ],
    tags: ["React", "Node.js", "PostgreSQL", "Xero API"],
    href: "https://efar-platform.vercel.app/login",
    images: [
      {
        src: "/images/efar_fleet_tracker.webp",
        alt: "EFAR Platform Fleet Tracker with crew status counts, a live Google map of crew positions and a crew roster",
        caption: "Admin (Managing Director) · Fleet Tracker: live crew positions on a Google map, with available, en route, on scene and off duty counts and a crew roster",
        width: 1917,
        height: 875,
      },
      {
        src: "/images/efar_intake_queue.webp",
        alt: "EFAR Platform Intake Queue listing service requests with status, service type and tier filters",
        caption: "Quotation Specialist · Intake Queue: review incoming service requests, with pending, confirmed and rejected counts and search, status, service type and tier filters",
        width: 1917,
        height: 867,
      },
      {
        src: "/images/efar_my_jobs.webp",
        alt: "EFAR Platform My Jobs page showing a field crew member's current job with a five-step milestone tracker",
        caption: "Field Crew · My Jobs: the assigned job with pickup and destination, a five-step milestone tracker, start and reject actions, and upcoming jobs by day",
        width: 1917,
        height: 872,
      },
      {
        src: "/images/efar_revenue_leakage.webp",
        alt: "EFAR Platform Revenue Leakage dashboard showing estimated unbilled charges, affected invoices and a breakdown by contract",
        caption: "Accounts Receivable · Revenue Leakage: unbilled charges no contract rate could price, with an estimated loss, a 'fix this first' alert and a breakdown by contract",
        width: 1917,
        height: 875,
      },
      {
        src: "/images/efar_vendor_invoices.webp",
        alt: "EFAR Platform Vendor Invoices page with email and Gmail intake, an AP invoice queue filtered by status, and OCR confidence scores for each vendor invoice",
        caption: "Accounts Payable · Vendor Invoices: upload or import vendor PDFs from Gmail, review OCR-extracted data with confidence scores, then approve and sync to Xero",
        width: 1917,
        height: 871,
      },
    ],
    features: [
      {
        title: "Role-based workspaces",
        description:
          "Managing directors, quotation specialists, AR and AP specialists and field crew each sign in to their own navigation and pages, so everyone sees only the tools for their job.",
      },
      {
        title: "Live fleet tracker",
        description:
          "A Google Maps view of every crew member with counts for available, en route, on scene and off duty, plus a crew roster.",
      },
      {
        title: "Intake queue & bookings",
        description:
          "Incoming service requests are reviewed in a searchable queue filtered by status, service type and tier, then confirmed and assigned as bookings.",
      },
      {
        title: "Field crew jobs & memo wizard",
        description:
          "Crews work through each job with a five-step milestone tracker on their phone and submit digital service memos in place of paper.",
      },
      {
        title: "Xero invoicing & reconciliation",
        description:
          "Memos are matched to pricing contracts, synced to Xero as invoices, and tracked with a sync status page, retries and payment reminders.",
      },
      {
        title: "Revenue leakage detection",
        description:
          "Charges that no contract rate could price are flagged with an estimated loss, grouped by contract, with a 'fix this first' prompt for the biggest gap.",
      },
      {
        title: "Gemini OCR for vendor invoices",
        description:
          "Vendor invoices are read automatically with Gemini OCR, supporting accounts payable and rebate tracking.",
      },
    ],
    toolkit: [
      { group: "Frontend", items: ["React", "Vite"] },
      { group: "Backend", items: ["Node.js", "Express", "Sequelize", "PostgreSQL"] },
      { group: "AI & APIs", items: ["Xero API", "Gemini API", "Google Maps"] },
      { group: "Cloud & deployment", items: ["Cloudinary", "Vercel", "Render"] },
    ],
  },
];
