import type { Metadata } from "next";
import { CheckCircle2, ClipboardList, QrCode, PhoneCall } from "lucide-react";
import { getClubInfo, getProgram } from "@/lib/queries";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { SchoolQrCode, SchoolRegisterButton } from "@/components/SchoolRegistration";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Futbol Okulu — Online Ön Kayıt",
  description:
    "Düşbelen Spor Futbol Okulu: 100'e yakın sporcumuzla Köyceğiz'de lisanslı antrenörler eşliğinde futbol eğitimi. QR kod ile hemen online ön kayıt olun.",
  path: "/futbol-okulu",
});

const STEPS = [
  {
    icon: QrCode,
    title: "QR'ı okutun",
    description: "Telefonunuzun kamerasıyla QR kodu okutun ya da “Hemen Ön Kayıt Ol” butonuna dokunun.",
  },
  {
    icon: ClipboardList,
    title: "Formu doldurun",
    description: "Sporcu ve veli bilgilerini içeren kısa ön kayıt formunu birkaç dakikada tamamlayın.",
  },
  {
    icon: PhoneCall,
    title: "Sizi arayalım",
    description: "Kulübümüz sizinle iletişime geçer, çocuğunuza uygun grubu ve antrenman günlerini birlikte belirleriz.",
  },
];

const SCHOOL_BENEFITS = [
  "Lisanslı antrenörler eşliğinde eğitim",
  "Yaşa ve seviyeye göre gruplar",
  "Okaliptüs Tesisleri'nde modern saha",
  "Düzenli veli bilgilendirmesi",
];

export default async function FootballSchoolPage() {
  const [club, program] = await Promise.all([getClubInfo(), getProgram()]);
  const { footballSchool } = club;

  return (
    <>
      <PageHero
        eyebrow="Futbol Okulu"
        title={footballSchool.name}
        description={`${footballSchool.athleteCount} sporcumuzla birlikte Köyceğiz'de futbolu sevdiriyor, geleceğin sporcularını yetiştiriyoruz.`}
        image="/images/gallery/kadro-toplu-foto.jpg"
      />

      {/* KAYIT — QR + BUTON */}
      <section className="bg-bg-pitch py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-accent-light">Online Ön Kayıt</span>
              <h2 className="mt-3 font-display text-4xl uppercase leading-[1.6] tracking-tight text-white sm:text-5xl">
                {footballSchool.athleteCount}
                <br />
                <span className="text-accent-bright">Sporcumuzla Birlikte.</span>
              </h2>
              <p className="mt-4 max-w-lg text-white/80">
                Futbol okulumuz için kayıtlarımızı artık online alıyoruz. QR kodu okutun ya da butona dokunun, ön
                kayıt formunu doldurun — gerisini biz halledelim.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {SCHOOL_BENEFITS.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2.5">
                    <CheckCircle2 className="shrink-0 text-accent-bright" size={18} strokeWidth={2} />
                    <span className="text-sm text-white/90">{benefit}</span>
                  </div>
                ))}
              </div>
              <SchoolRegisterButton className="mt-8" />
            </div>

            <div className="flex flex-col items-center gap-3">
              <SchoolQrCode size={220} />
              <span className="text-xs uppercase tracking-wider text-text-muted">Telefonunuzla okutun</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 ADIMDA KAYIT */}
      <section className="bg-cream py-20 text-ink">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading tone="light" eyebrow="Nasıl Kayıt Olunur?" title="3 Adımda Kayıt" />
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.title}
                  className="relative rounded-b-2xl border border-t-4 border-black/10 border-t-accent bg-white p-6 shadow-sm"
                >
                  <span
                    aria-hidden="true"
                    className="absolute right-4 top-3 font-display text-5xl text-black/[0.06]"
                  >
                    0{i + 1}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm text-ink-muted">{step.description}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* YAŞ GRUPLARI */}
      <section className="bg-bg-pitch py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Kimler Katılabilir?"
            title="Yaş Grupları"
            description={`${club.ageRange} yaş arası çocuk ve gençler, yaşına ve seviyesine uygun gruplarda antrenman yapar.`}
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {program.map((group) => (
              <div key={group.code} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-2xl text-white">{group.code}</span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-accent-light">
                    {group.range}
                  </span>
                </div>
                <p className="mt-2 text-sm text-text-muted">{group.description}</p>
                <p className="mt-3 text-xs uppercase tracking-wide text-white/70">{group.days}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center gap-3 text-center">
            <p className="text-white/80">Çocuğunuzun yeri hazır — ön kaydını şimdi yapın.</p>
            <SchoolRegisterButton />
            <a href={club.phoneHref} className="text-sm text-text-muted hover:text-white">
              Sorularınız için: {club.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
