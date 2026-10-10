# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Personal portfolio website for **Jasper Teo**, a Year 2 Information Technology student at Nanyang Polytechnic (previously ITE). It is an **interactive motion-design portfolio**: the site itself should show off animation and front-end craft.

- LinkedIn: https://www.linkedin.com/in/jasper-teo-jt/
- Hosting: GitHub repo, deployed on Vercel (auto-deploy on push to `main`)
- Inspiration: https://pushkal-vashist.vercel.app/, https://yanzhaoliu.com/, https://wilsoon.dev/

## Pages

A single Next.js app with these routes:

1. **Home**: hero with intro animation, short tagline, call to action
2. **About**: background, education (ITE, then Nanyang Polytechnic IT), interests
3. **Skills**: grouped by category (see below), animated reveal
4. **Projects**: grid of project cards, each linking to a project detail page
5. **Contact**: contact form or links (email, LinkedIn, GitHub)

## Required effects

All four are core requirements, not extras:

- **Custom cursor**: follows the pointer, reacts on hover over links and cards, disabled on touch devices
- **Scroll animations**: scroll-triggered reveals, parallax, and pinned sections
- **Boot intro**: on every full page load, a terminal-style boot sequence ("jasper-os") types out, then the screen splits open to reveal the site. Skippable, and skipped for reduced motion. Page animations wait for the `intro:reveal` event.
- **3D**: an IT / AI themed hero scene using Three.js: a rotating neural network with signal pulses travelling along its connections. Theme is dark with a cyan accent; avoid blobs or generic shapes.
- **Page transitions**: animated transitions between routes

## Tech stack

| Purpose | Tool |
|---|---|
| Framework | Next.js (App Router) + React + TypeScript |
| Styling | Tailwind CSS |
| Scroll and timeline animation | GSAP + ScrollTrigger |
| Smooth scrolling | Lenis |
| Page and UI transitions | Framer Motion |
| 3D | Three.js via react-three-fiber and drei |
| Hosting | Vercel |

Prefer these over adding new libraries. Ask before introducing a new dependency.

## Content: about Jasper (source: LinkedIn resume)

- **Contact:** jastkc8@gmail.com, https://www.linkedin.com/in/jasper-teo-jt, old portfolio https://jastkc8.wixsite.com/digitalportfolio
- **Summary:** Year 2 IT student at Nanyang Polytechnic, building on IT Applications Development from ITE College Central. Interest in tech began in secondary school publishing WordPress blogs. Passionate about user-centric web apps; currently exploring AI-driven development.
- **Top skills:** AI, Cybersecurity, Programming. **Languages:** English (native/bilingual), Chinese (elementary).
- **Experience:** Web Developer at SF Technologies Pte Ltd (Sep 2024 to Feb 2025), WordPress design and development, including https://jbtc.org.sg/. Also two short stints as a waiter at Thai Accent (omit or de-emphasise on the site).
- **Education:**
  - Nanyang Polytechnic, Diploma in Information Technology (Apr 2025 to Apr 2028)
  - Gachon University, Computer Engineering exchange (Sep 2026 to Dec 2026)
  - ITE College Central, Higher Nitec in IT Applications Development (2023 to 2025)
  - Holy Innocents' High School, GCE O Levels (2019 to 2022)
- **Certifications:** User Experience Design Fundamentals; AI Fluency Framework & Foundations (Certificate of Completion); Web Development Fundamentals
- **Awards:** Edusave Scholarship Award (MOE); Chief Commissioner Award; Edusave Award for Achievement, Good Leadership and Service (EAGLES)

Keep this content in `src/data/profile.ts`, not hard-coded in components.

## Content: skills to display

- **Frontend**: React, Tailwind CSS, Next.js, Bootstrap, Flutter, Vite
- **Backend**: Node.js, Flask, Supabase, PostgreSQL
- **Programming**: HTML, CSS, JavaScript, Python, C#, SQL
- **Cloud & DevOps**: AWS, Firebase, Google Cloud, Docker, Cloudinary
- **AI**: Gemini, OpenAI, Anthropic
- **Design & Tools**: Figma, Illustrator, Premiere Pro, Git, GitHub

Keep skills data in one file (e.g. `src/data/skills.ts`) so the Skills page and any other component read from a single source. Do the same for projects (`src/data/projects.ts`).

## Commands

- `npm run dev`: start the dev server (http://localhost:3000)
- `npm run build`: production build (must pass before pushing)
- `npm run lint`: lint

## Structure

- `src/app/`: routes (`/`, `/about`, `/skills`, `/projects`, `/projects/[slug]`, `/contact`)
- `src/data/`: `profile.ts`, `skills.ts`, `projects.ts`. Edit content here.
- `src/components/providers/`: `SmoothScroll` (Lenis synced to GSAP), `TransitionProvider` (page-transition curtain)
- `src/components/`: `Cursor`, `Reveal` (scroll reveal), `SplitWords` (headline intro), `Hero3D` / `HeroScene` (Three.js), `TransitionLink` (use instead of `next/link` for internal navigation so the transition plays)
- Cursor labels: add `data-cursor="Text"` to any element to show a label in the cursor.

## Conventions

- TypeScript throughout; functional components and hooks only.
- Components in `src/components`, route files in `src/app`, data in `src/data`, static assets in `public`.
- Animation code lives in the component that owns it. Shared setup (Lenis, GSAP plugin registration, cursor) goes in a provider or hook under `src/components/providers` or `src/hooks`.
- Clean up GSAP contexts, ScrollTrigger instances, and event listeners on unmount (use `gsap.context()` and `ctx.revert()`).
- Use `"use client"` only on components that need animation, state, or browser APIs.
- Match existing naming and style. Don't add comments that restate the code.

## Performance and accessibility

- Respect `prefers-reduced-motion`: disable or simplify animations, parallax, and 3D motion.
- Lazy-load the 3D scene (`next/dynamic`, `ssr: false`) and keep it light; provide a fallback on low-power or mobile devices.
- Compress images and video. Use short looping MP4/WebM for previews and embeds for long videos. Use `next/image` for images.
- Must work at phone width (about 400px). The custom cursor and hover-only interactions need touch alternatives.
- Keep semantic HTML, keyboard focus states, and alt text.
- Target Lighthouse performance 90+ on desktop.

## Workflow

- Work on `main` only for initial setup; use feature branches afterwards.
- Run `npm run build` and `npm run lint` before committing.
- Do not commit secrets. Use `.env.local` for keys, and add new env vars to Vercel project settings.
- Commit only when asked.
- Commit messages follow the series `selected coding works <Roman numeral>`: I, II, III, IV and so on, in order. The latest used is IV, so the next is `selected coding works V`. The user may name a commit explicitly; follow that and keep the series going from it.
