import { siAnthropic } from "simple-icons";

const tile = "grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-white/95 text-black";

/** Logo tile for a certificate issuer. simple-icons has no IBM mark, so IBM gets a lettered tile. */
export default function IssuerTile({ issuer }: { issuer: "IBM" | "Anthropic" }) {
  if (issuer === "Anthropic") {
    return (
      <div className={tile}>
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5">
          <path d={siAnthropic.path} />
        </svg>
      </div>
    );
  }
  return (
    <div className={`${tile} font-mono text-xs font-extrabold tracking-tighter`} aria-hidden>
      IBM
    </div>
  );
}
