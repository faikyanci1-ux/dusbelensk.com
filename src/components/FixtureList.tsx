import { CalendarDays, MapPin } from "lucide-react";
import type { Fixture } from "@/lib/standings";

export function FixtureList({ fixtures, label }: { fixtures: Fixture[]; label: string }) {
  return (
    <ul aria-label={label} className="overflow-hidden rounded-2xl border border-border-soft/40 bg-white/[0.03]">
      {fixtures.map((f, i) => (
        <li
          key={`${f.home}-${f.away}`}
          aria-current={f.isUs ? "true" : undefined}
          className={`grid gap-2 px-4 py-3 text-sm sm:grid-cols-[9rem_1fr_auto] sm:items-center sm:gap-4 ${
            i > 0 ? "border-t border-border-soft/30" : ""
          } ${f.isUs ? "border-l-4 border-l-accent bg-accent/15 font-semibold text-white" : "text-white/85"}`}
        >
          <span className="flex items-center gap-2 text-xs text-text-muted tabular-nums">
            <CalendarDays size={14} aria-hidden="true" />
            {f.date} · {f.time}
          </span>
          <span className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-[13px] sm:gap-3 sm:text-sm">
            <span className="text-right leading-snug sm:truncate">{f.home}</span>
            <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs font-bold tabular-nums">{f.score ?? "–"}</span>
            <span className="leading-snug sm:truncate">{f.away}</span>
          </span>
          <span className="flex items-center gap-1.5 text-xs text-text-muted sm:justify-end">
            <MapPin size={14} aria-hidden="true" />
            {f.venue}
          </span>
        </li>
      ))}
    </ul>
  );
}
