"use client";

import { AwardIcon, OPEN_ENTRY_EVENT } from "@/components/EntryList";

export type Award = {
  title: string;
  /** Education entry id that holds this award. */
  schoolId: string;
  school: string;
};

/** Awards pulled from the education entries. Clicking one opens that school's popup. */
export default function AwardsList({ awards }: { awards: Award[] }) {
  return (
    <ul className="space-y-1">
      {awards.map((a) => (
        <li key={`${a.schoolId}-${a.title}`}>
          <button
            type="button"
            data-cursor="Open"
            aria-haspopup="dialog"
            onClick={() => window.dispatchEvent(new CustomEvent(OPEN_ENTRY_EVENT, { detail: { id: a.schoolId } }))}
            className="group -mx-3 flex w-full flex-wrap items-start justify-between gap-x-6 gap-y-1 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/[0.04]"
          >
            <span className="flex items-start gap-3 text-lg">
              <AwardIcon kind="trophy" />
              <span className="transition-colors group-hover:text-accent">{a.title}</span>
            </span>
            <span className="ml-8 font-mono text-xs text-muted transition-colors group-hover:text-accent sm:ml-0 sm:mt-1.5">
              {a.school} · View in education →
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
