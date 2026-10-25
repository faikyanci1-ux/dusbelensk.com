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
  const seasonNotStarted = rows.length > 0 && rows.every((r) => r.played === 0 && r.points === 0);

  const anyLogo = rows.some((r) => r.logo);

  return (
    <div className="@container overflow-hidden rounded-2xl border border-border-soft/40 bg-white/[0.03]">
      {/* Dar ekranda tüm kolonlar (O G B M A Y AV P) yatay kaydırmayla görünür, takım sütunu sabit kalır. */}
      <div className="overflow-x-auto overscroll-x-contain" tabIndex={0} role="region" aria-label={`${caption} (yatay kaydırılabilir)`}>
      <table className="w-full min-w-[34rem] table-fixed text-sm tabular-nums">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="bg-white/[0.06] text-xs font-semibold uppercase tracking-wide text-text-muted">
            <th scope="col" className="sticky left-0 z-10 w-10 bg-[#13233d] py-3 pl-4 text-left">#</th>
            <th scope="col" className="sticky left-10 z-10 w-44 bg-[#13233d] py-3 pl-2 text-left @lg:w-auto">Takım</th>
            <th scope="col" className="w-8 py-3 text-center">
              <abbr title="Oynadığı maç" className="no-underline">O</abbr>
            </th>
            {detailCols.map((c) => (
              <th key={c.key} scope="col" className="w-8 py-3 text-center">
                <abbr title={c.title} className="no-underline">{c.label}</abbr>
              </th>
            ))}
            <th scope="col" className="w-10 py-3 text-center">
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
              <td className={`sticky left-0 z-10 py-3 pl-4 ${row.isUs ? "border-l-4 border-accent bg-[#2a1a30]" : "bg-[#0f1d33]"}`}>{row.rank}</td>
              <th scope="row" className={`sticky left-10 z-10 py-3 pl-2 text-left font-[inherit] ${row.isUs ? "bg-[#2a1a30]" : "bg-[#0f1d33]"}`}>
                <span className="flex items-center gap-2 pr-1">
                  {row.logo ? (
                    <Image src={row.logo} alt="" width={24} height={24} className="h-6 w-6 shrink-0 object-contain" />
                  ) : anyLogo ? (
                    <span className="h-6 w-6 shrink-0" />
                  ) : null}
                  <span className="truncate whitespace-nowrap" title={row.team}>{row.team}</span>
                </span>
              </th>
              <td className="py-3 text-center">{row.played}</td>
              {detailCols.map((c) => (
                <td key={c.key} className="py-3 text-center">
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
      {seasonNotStarted && (
        <p className="border-t border-border-soft/30 px-4 py-3 text-center text-xs text-text-muted">
          Sezon henüz başlamadı; maçlar oynandıkça tablo güncellenecek.
        </p>
      )}
    </div>
  );
}
