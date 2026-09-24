import type { Metadata } from "next";
import Image from "next/image";
import { getManagementBoard, getAuditBoard } from "@/lib/queries";
import { PageHero } from "@/components/PageHero";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Kulüp Yönetimi",
  description:
    "Düşbelen SK yönetim kurulu ve denetleme kurulu üyeleri; kulüp başkanı Yılmaz Erdoğan'ın önderliğindeki kurumsal yapı.",
  path: "/yonetim",
});

export default async function BoardsPage() {
  const [management, audit] = await Promise.all([getManagementBoard(), getAuditBoard()]);
  // Fotoğrafı olan her yönetim kurulu üyesi (panelde "Tanıtım kartı") büyük kartla, diğerleri listede.
  const featuredMembers = management.members.filter((member) => member.photo);
  const otherManagementMembers = management.members.filter((member) => !member.photo);

  return (
    <>
    <PageHero
      eyebrow="Kurumsal Yapı"
      title="Kulüp Yönetimi"
      description="Düşbelen SK'nın kurumsal yapısını oluşturan yönetim ve denetleme kurulları."
      image="/images/facility-3.jpg"
    />
    <div className="bg-cream py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
      {featuredMembers.map((president, index) => (
        <div key={`${president.name}-${index}`} className="mt-12 grid overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm sm:grid-cols-[260px_1fr]">
          <div className="relative aspect-[2/3] w-full">
            <Image
              src={president.photo!}
              alt={`${president.name} — ${president.role}`}
              fill
              sizes="260px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center p-8">
            <span className="text-xs font-semibold uppercase tracking-wide text-accent-deep">{president.role}</span>
            <h2 className="mt-2 text-2xl font-bold text-ink">{president.name}</h2>
            {president.bio && <p className="mt-4 text-sm leading-relaxed text-ink-muted">{president.bio}</p>}
            {president.quote && (
              <p className="mt-4 border-l-2 border-accent/40 pl-4 text-ink-muted italic">
                &ldquo;{president.quote}&rdquo;
              </p>
            )}

            {president.mottos && (
              <div className="mt-5 flex flex-wrap gap-2">
                {president.mottos.map((motto) => (
                  <span
                    key={motto}
                    className="rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-medium text-accent-deep"
                  >
                    {motto}
                  </span>
                ))}
              </div>
            )}

            {president.values && (
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-black/10 pt-5">
                {president.values.map((value) => (
                  <span
                    key={value}
                    className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-muted"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" />
                    {value}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="rounded-b-2xl border border-t-4 border-black/10 border-t-accent-bright bg-white p-8 shadow-sm">
          <h3 className="text-lg font-bold text-ink">Yönetim Kurulu</h3>
          <span className="mt-2 block h-0.5 w-10 rounded-full bg-accent-bright" />
          <ul className="mt-6 space-y-4">
            {otherManagementMembers.map((member, i) => (
              <li
                key={`${member.name}-${i}`}
                className="flex items-center justify-between rounded-lg border border-black/10 bg-black/[0.02] px-4 py-3 transition hover:border-accent/40"
              >
                <span className="font-medium text-ink">{member.name}</span>
                <span className="text-xs text-ink-muted">{member.role}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ink-muted">{management.note}</p>
        </div>

        <div className="rounded-b-2xl border border-t-4 border-black/10 border-t-accent-2 bg-white p-8 shadow-sm">
          <h3 className="text-lg font-bold text-ink">Denetleme Kurulu</h3>
          <span className="mt-2 block h-0.5 w-10 rounded-full bg-accent-2" />
          <ul className="mt-6 space-y-4">
            {audit.members.map((member, i) => (
              <li
                key={`${member.name}-${i}`}
                className="flex items-center justify-between rounded-lg border border-black/10 bg-black/[0.02] px-4 py-3 transition hover:border-accent-2/40"
              >
                <span className="font-medium text-ink">{member.name}</span>
                <span className="text-xs text-ink-muted">{member.role}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ink-muted">{audit.note}</p>
        </div>
      </div>
      </div>
    </div>
    </>
  );
}
