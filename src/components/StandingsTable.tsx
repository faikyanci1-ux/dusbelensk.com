import Image from "next/image";
import type { StandingRow } from "@/lib/standings";

const detailCols: { key: keyof StandingRow; label: string; title: string }[] = [
  { key: "won", label: "G", title: "Galibiyet" },
  { key: "drawn", label: "B", title: "Beraberlik" },
  { key: "lost", label: "M", title: "Mağlubiyet" },
  { key: "goalsFor", label: "A", title: "Attığı gol" },
  { key: "goalsAgainst", label: "Y", title: "Yediği gol" },
];

export function StandingsTable({ rows, caption }: { rows: StandingRow[]; caption: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border-soft/40 bg-white/[0.03]">
      <table className="w-full text-sm tabular-nums">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="bg-white/[0.06] text-xs font-semibold uppercase tracking-wide text-text-muted">
            <th scope="col" className="w-10 py-3 pl-4 text-left">#</th>
            <th scope="col" className="py-3 pl-2 text-left">Takım</th>
            <th scope="col" className="w-10 py-3 text-center">
              <abbr title="Oynadığı maç" className="no-underline">O</abbr>
            </th>
            {detailCols.map((c) => (
              <th key={c.key} scope="col" className="hidden w-10 py-3 text-center sm:table-cell">
                <abbr title={c.title} className="no-underline">{c.label}</abbr>
              </th>
            ))}
            <th scope="col" className="w-12 py-3 text-center">
              <abbr title="Averaj" className="no-underline">AV</abbr>
            </th>
            <th scope="col" className="w-12 py-3 pr-4 text-center">
              <abbr title="Puan" className="no-underline">P</abbr>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.team}
              aria-current={row.isUs ? "true" : undefined}
              className={`border-t border-border-soft/30 ${
                row.isUs ? "bg-accent/15 font-semibold text-white" : "text-white/85"
              }`}
            >
              <td className={`py-3 pl-4 ${row.isUs ? "border-l-4 border-accent" : ""}`}>{row.rank}</td>
              <th scope="row" className="py-3 pl-2 text-left font-[inherit]">
                <span className="flex items-center gap-3">
                  {row.logo ? (
                    <Image src={row.logo} alt="" width={24} height={24} className="h-6 w-6 shrink-0 object-contain" />
                  ) : (
                    <span className="h-6 w-6 shrink-0" />
                  )}
                  <span className="truncate">{row.team}</span>
                </span>
              </th>
              <td className="py-3 text-center">{row.played}</td>
              {detailCols.map((c) => (
                <td key={c.key} className="hidden py-3 text-center sm:table-cell">
                  {row[c.key] as number}
                </td>
              ))}
              <td className="py-3 text-center">{row.goalDiff}</td>
              <td className="py-3 pr-4 text-center font-bold">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
