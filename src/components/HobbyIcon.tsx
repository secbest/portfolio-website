import type { HobbyIconName } from "@/data/hobbies";

const paths: Record<HobbyIconName, React.ReactNode> = {
  gym: <path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11" />,
  cycling: (
    <>
      <circle cx="5.5" cy="17" r="3.5" />
      <circle cx="18.5" cy="17" r="3.5" />
      <path d="M5.5 17 9 8.5h6l3.5 8.5M9 8.5l3.5 8.5M15 8.5 12.5 17M13 5.5h3" />
    </>
  ),
  swimming: (
    <>
      <circle cx="16.5" cy="6.5" r="2" />
      <path d="m7 13 4-3 3.5 2.5M2 17.5c1.5 0 1.5-1.2 3-1.2s1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2M2 21c1.5 0 1.5-1.2 3-1.2s1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2" />
    </>
  ),
  badminton: (
    <>
      <circle cx="12" cy="19" r="2" />
      <path d="M10.6 17.3 7 5.5M13.4 17.3 17 5.5M12 17V5M7 5.5h10M9 11h6" />
    </>
  ),
  baseball: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M5.8 5.8c2.6 2.8 2.6 9.6 0 12.4M18.2 5.8c-2.6 2.8-2.6 9.6 0 12.4" />
    </>
  ),
  reading: <path d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5zM12 6.5v13" />,
  gaming: (
    <>
      <path d="M7 8h10a4 4 0 0 1 4 4.5V14a2.5 2.5 0 0 1-4.5 1.5L15.5 14h-7l-1 1.5A2.5 2.5 0 0 1 3 14v-1.5A4 4 0 0 1 7 8z" />
      <path d="M8 10.5v3M6.5 12h3M16 11h.01M18 12.5h.01" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V5l11-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="17" cy="16" r="3" />
    </>
  ),
};

export default function HobbyIcon({ name, className = "size-8" }: { name: HobbyIconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
