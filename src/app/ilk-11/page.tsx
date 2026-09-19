import type { Metadata } from "next";
import { getLineup } from "@/lib/queries";
import { PageHero } from "@/components/PageHero";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "İlk 11",
  description: "Düşbelen SK'nın güncel muhtemel ilk 11 kadrosu ve saha diziliş görseli.",
  path: "/ilk-11",
});

export default async function LineupPage() {
  const { slots, note } = await getLineup();

  return (
    <>
    <PageHero
      eyebrow="Muhtemel 11"
      title="Bugünün İlk 11'i"
      description="Teknik ekibin son maç için sahaya sürdüğü muhtemel 11."
      image="/images/gallery/match-2.jpg"
    />
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-border-soft">
          <table className="w-full text-sm">
            <thead className="bg-bg-raised/60 text-left text-text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Pozisyon</th>
                <th className="px-4 py-3 font-medium">Oyuncu</th>
                <th className="px-4 py-3 font-medium">Forma No</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot.number} className="border-t border-border-soft/60">
                  <td className="px-4 py-3 text-text-muted">{slot.position}</td>
                  <td className="px-4 py-3 text-white">{slot.player}</td>
                  <td className="px-4 py-3 font-semibold text-accent">{slot.number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border-soft bg-gradient-to-b from-accent-2/30 to-accent-2/10">
            <div className="absolute inset-4 rounded-xl border border-white/20" />
            <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
            {slots.map((slot) => (
              <div
                key={slot.number}
                className="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border-soft bg-bg-main text-sm font-bold text-white shadow-lg"
                style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
              >
                {slot.number}
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-text-muted">{note}</p>
        </div>
      </div>
    </div>
    </>
  );
}
