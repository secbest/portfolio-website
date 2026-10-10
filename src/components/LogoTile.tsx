import Image from "next/image";

export type LogoFit = "contain" | "cover" | "small";

const initials = (name: string) =>
  name
    .split(" ")
    .filter((w) => /^[A-Z]/.test(w))
    .map((w) => w[0])
    .join("")
    .slice(0, 3);

const logoFit: Record<LogoFit, { box: string; img: string }> = {
  contain: { box: "p-1", img: "object-contain" },
  small: { box: "p-1.65", img: "object-contain" },
  cover: { box: "p-0", img: "object-cover" },
};

export default function LogoTile({ src, name, fit = "contain" }: { src?: string; name: string; fit?: LogoFit }) {
  return (
    <div className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-white/95 font-mono text-sm font-semibold text-black">
      {src ? (
        <div className={`size-full ${logoFit[fit].box}`}>
          <div className="relative size-full">
            <Image src={src} alt={`${name} logo`} fill sizes="56px" className={`object-center ${logoFit[fit].img}`} />
          </div>
        </div>
      ) : (
        <span aria-hidden>{initials(name)}</span>
      )}
    </div>
  );
}
