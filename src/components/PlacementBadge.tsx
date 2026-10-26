import type { Competition } from "@/data/competitions";

/** Glowing result badge: a medal, the rank in the accent colour and the official title beside it. */
export default function PlacementBadge({
  placement,
  large = false,
  className = "",
}: {
  placement: Competition["placement"];
  large?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`placement-glow inline-flex w-fit items-center gap-2.5 rounded-full border border-accent/60 bg-black/70 font-mono backdrop-blur ${large ? "px-5 py-2 text-base" : "px-3 py-1 text-xs"} ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={`shrink-0 text-accent drop-shadow-[0_0_6px_rgb(34_211_238/0.9)] ${large ? "size-6" : "size-4"}`}
      >
        <circle cx="12" cy="16" r="5" />
        <path d="M8.5 11.5 5 3h5l2 4M15.5 11.5 19 3h-5l-2 4" />
      </svg>
      <span className="font-semibold text-accent [text-shadow:0_0_12px_rgb(34_211_238/0.9)]">{placement.rank}</span>
      <span className="text-white/70">{placement.title}</span>
    </span>
  );
}
