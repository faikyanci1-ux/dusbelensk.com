import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Users } from "lucide-react";
import { getProgram } from "@/lib/queries";
import { getStandings } from "@/lib/standings";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { StandingsTable } from "@/components/StandingsTable";
import { FixtureList } from "@/components/FixtureList";
import { SchoolRegisterButton } from "@/components/SchoolRegistration";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, clubId, jsonLdHtml } from "@/lib/jsonLd";
import { siteUrl } from "@/lib/site";
import { ageGroupLeague, ageGroupPath, ageGroupSlug } from "@/lib/ageGroups";

type Params = { params: Promise<{ kod: string }> };

async function findGroup(kod: string) {
  const program = await getProgram();
  return { program, group: program.find((g) => ageGroupSlug(g.code) === kod.toLowerCase()) };
}

export async function generateStaticParams() {
  const program = await getProgram();
  return program.map((g) => ({ kod: ageGroupSlug(g.code) }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { kod } = await params;
  const { group } = await findGroup(kod);
  if (!group) return { title: "Yaş grubu bulunamadı", robots: { index: false, follow: true } };

  return buildMetadata({
    title: `${group.code} Futbol Grubu — Köyceğiz (${group.range})`,
    description: `Düşbelen SK ${group.code} grubu: ${group.range} çocuklar için Köyceğiz'de lisanslı antrenörlerle futbol altyapısı. ${group.days ? `Antrenman günleri: ${group.days}. ` : ""}Online ön kayıt.`,
    path: ageGroupPath(group.code),
  });
}

export default async function AgeGroupPage({ params }: Params) {
  const { kod } = await params;
  const { program, group } = await findGroup(kod);
  if (!group) notFound();

  const league = ageGroupLeague(group.code);
  const standings = (await getStandings()).filter((s) => s.league === league);
  const url = `${siteUrl}${ageGroupPath(group.code)}`;
  const others = program.filter((g) => g.code !== group.code);

  const teamJsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    "@id": `${url}#team`,
    name: `Düşbelen SK ${group.code}`,
    url,
    sport: "Football",
    description: group.description,
    parentOrganization: { "@id": clubId },
  };
  const breadcrumb = breadcrumbJsonLd([
    { name: "Yaş Grupları", path: "/yas-gruplari" },
    { name: group.code, path: ageGroupPath(group.code) },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(teamJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(breadcrumb) }} />
      <PageHero
        eyebrow={`Yaş Grupları · ${group.title}`}
        title={`${group.code} Futbol Grubu`}
        description={`${group.range} çocuklar için Köyceğiz'de lisanslı antrenörlerle futbol altyapısı.`}
        image="/images/gallery/kadro-toplu-foto.jpg"
        imageAlt="Düşbelen SK altyapı sporcuları toplu fotoğraf"
      />

      <section className="bg-cream py-16 text-ink">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Link href="/yas-gruplari" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink">
            <ArrowLeft size={16} />
            Tüm Yaş Grupları
          </Link>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Users size={20} />
              </span>
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-ink-muted/70">Yaş aralığı</span>
                <span className="font-semibold">{group.range}</span>
              </div>
            </div>
            {group.days && (
              <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <CalendarDays size={20} />
                </span>
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-ink-muted/70">Antrenman günleri</span>
                  <span className="font-semibold">{group.days}</span>
                </div>
              </div>
            )}
          </div>

          <h2 className="mt-10 font-display text-2xl uppercase tracking-tight">{group.title}</h2>
          <p className="mt-3 text-lg leading-relaxed text-ink-muted">{group.description}</p>
          <p className="mt-4 text-ink-muted">
            Düşbelen SK {group.code} grubu, Köyceğiz Okaliptüs Tesisleri&apos;nde lisanslı antrenörler eşliğinde
            çalışır. Çocuğunuzun hangi gruba uygun olduğunu kayıt sürecinde birlikte belirleriz; merak
            ettiklerinizi{" "}
            <Link href="/sss" className="font-semibold text-accent underline-offset-2 hover:underline">
              sık sorulan sorular
            </Link>{" "}
            sayfasında bulabilirsiniz.
          </p>
        </div>
      </section>

      {standings.map((s) => (
        <section key={`${s.league}-${s.group}`} className="bg-bg-pitch py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <SectionHeading
              eyebrow={`Muğla ASKF · ${s.title.replace(/^\S+ /, "")}`}
              title={`${s.league} ${s.group} Grubu`}
              description={s.rows.length > 0 ? (s.week ?? undefined) : `${s.fixtureWeek ?? "Haftanın"} fikstürü`}
            />
            <div className="mt-10">
              {s.rows.length > 0 ? (
                <StandingsTable rows={s.rows} caption={`${s.title} ${s.league} ${s.group} Grubu puan durumu`} />
              ) : (
                <FixtureList fixtures={s.fixtures} label={`${s.league} ${s.group} Grubu ${s.fixtureWeek ?? ""} fikstürü`} />
              )}
            </div>
          </div>
        </section>
      ))}

      <section className="bg-bg-pitch py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl uppercase tracking-tight text-white">Ön Kayıt</h2>
          <p className="mt-3 text-white/80">
            {group.code} grubu için online ön kaydınızı şimdi yapın; sizi arayıp deneme antrenmanı planlayalım.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <SchoolRegisterButton />
            <Link
              href="/futbol-okulu"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-accent-light"
            >
              Futbol okulu bilgileri
              <ArrowRight size={16} />
            </Link>
          </div>
          {others.length > 0 && (
            <nav aria-label="Diğer yaş grupları" className="mt-10 flex flex-wrap justify-center gap-2">
              {others.map((g) => (
                <Link
                  key={g.code}
                  href={ageGroupPath(g.code)}
                  className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {g.code}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
