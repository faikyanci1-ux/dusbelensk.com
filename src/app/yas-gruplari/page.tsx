import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { getProgram } from "@/lib/queries";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { SchoolRegisterButton } from "@/components/SchoolRegistration";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdHtml } from "@/lib/jsonLd";
import { ageGroupPath } from "@/lib/ageGroups";

export const metadata: Metadata = buildMetadata({
  title: "Yaş Grupları — Köyceğiz Futbol Altyapısı",
  description:
    "Düşbelen SK yaş grupları: Köyceğiz'de U11'den U17'ye yaşa ve seviyeye göre planlanan futbol altyapı grupları, antrenman günleri ve online ön kayıt.",
  path: "/yas-gruplari",
});

const ACCENT = { accent: "border-t-accent", "accent-2": "border-t-accent-2" } as const;

export default async function AgeGroupsPage() {
  const program = await getProgram();
  const breadcrumb = breadcrumbJsonLd([{ name: "Yaş Grupları", path: "/yas-gruplari" }]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(breadcrumb) }} />
      <PageHero
        eyebrow="Futbol Altyapısı"
        title="Yaş Grupları"
        description="Çocuğun yaşına ve gelişim seviyesine göre şekillenen, lisanslı antrenörler eşliğinde yürütülen Köyceğiz futbol altyapı grupları."
        image="/images/gallery/kadro-toplu-foto.jpg"
        imageAlt="Düşbelen SK altyapı sporcuları toplu fotoğraf"
      />

      <section className="bg-bg-pitch py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Düşbelen SK"
            title="Altyapı Grupları"
            description="Bir gruba dokunarak yaş aralığını, antrenman günlerini ve grubun lig durumunu görebilirsiniz."
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {program.map((group) => (
              <li key={group.code}>
                <Link
                  href={ageGroupPath(group.code)}
                  className={`group block h-full rounded-b-2xl border border-t-4 border-white/10 bg-black/20 p-6 transition duration-300 hover:-translate-y-1 hover:bg-black/30 ${ACCENT[group.accent]}`}
                >
                  <span className="font-display text-3xl text-white">{group.code}</span>
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-wide text-accent-light">
                    {group.range} · {group.title}
                  </span>
                  <span className="mt-3 block text-sm text-text-muted">{group.description}</span>
                  {group.days && (
                    <span className="mt-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/60">
                      <CalendarDays size={14} aria-hidden="true" />
                      {group.days}
                    </span>
                  )}
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">
                    Grup detayı
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-col items-center gap-3 text-center">
            <p className="text-white/80">Çocuğunuza uygun grubu birlikte belirleyelim.</p>
            <SchoolRegisterButton />
            <Link href="/futbol-okulu" className="text-sm text-text-muted hover:text-white">
              Futbol okulu hakkında bilgi
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
