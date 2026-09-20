import type { Metadata } from "next";
import { getParentInfo } from "@/lib/queries";
import { PageHero } from "@/components/PageHero";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Veliler İçin Bilgi",
  description:
    "Antrenman programı, lisans ve evrak süreci, veli iletişimi — Düşbelen SK'da şeffaf ve planlı bir altyapı deneyimi.",
  path: "/veliler-icin",
});

export default async function ParentsPage() {
  const info = await getParentInfo();

  return (
    <>
    <PageHero
      eyebrow="Şeffaflık"
      title="Veliler İçin Bilgi"
      description="Çocuklarımızın güvenliği ve gelişimi için tüm süreci şeffaf ve planlı yürütüyoruz."
      image="/images/gallery/training-1.jpg"
    />
    <div className="bg-cream py-16 text-ink">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="sr-only">Veliler İçin Bilgiler</h2>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            {info.intro.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-ink-muted first:mt-0">
                {paragraph}
              </p>
            ))}

            <ul className="mt-6 space-y-2 text-sm text-ink">
              {info.bullets.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-2" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              {info.badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-medium text-accent-deep"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {info.cards.map((card) => (
              <article
                key={card.title}
                className="rounded-b-2xl border border-t-4 border-black/10 border-t-accent-2 bg-white p-6 shadow-sm"
              >
                <h3 className="font-semibold text-ink">{card.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
