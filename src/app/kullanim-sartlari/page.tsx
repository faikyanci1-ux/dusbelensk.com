import type { Metadata } from "next";
import Link from "next/link";
import { getClubInfo } from "@/lib/queries";
import { SectionHeading } from "@/components/SectionHeading";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Kullanım Şartları",
  description: "Düşbelen SK web sitesinin kullanım şartları.",
  path: "/kullanim-sartlari",
});

export default async function TermsPage() {
  const club = await getClubInfo();

  const sections = [
    {
      title: "Kabul",
      body: (
        <p>
          Bu web sitesini kullanarak aşağıdaki kullanım şartlarını kabul etmiş sayılırsınız. Kabul
          etmiyorsanız lütfen siteyi kullanmayınız.
        </p>
      ),
    },
    {
      title: "İçerik ve Telif Hakları",
      body: (
        <p>
          Sitedeki logo, metin, fotoğraf ve video içerikleri{" "}
          <strong className="font-semibold text-ink">{club.name}</strong>&apos;ya aittir. İçeriklerin kulübün
          yazılı izni olmadan kopyalanması, çoğaltılması veya ticari amaçla kullanılması yasaktır.
        </p>
      ),
    },
    {
      title: "Bilgilerin Doğruluğu",
      body: (
        <p>
          Sitede yer alan maç tarihleri, antrenman bilgileri ve duyurular değişiklik gösterebilir. Güncel
          bilgi için kulüple doğrudan iletişime geçmenizi öneririz.
        </p>
      ),
    },
    {
      title: "Ön Kayıt Formunda Paylaşılan Bilgiler",
      body: (
        <p>
          Futbol okulu online ön kayıt formunu doldururken ya da bize telefon veya WhatsApp üzerinden ulaşırken
          paylaştığınız bilgilerin doğru ve güncel olmasından siz sorumlusunuz. Ön kayıt formu sporokullari.org
          platformunda yer alır ve bu platformun kendi kullanım koşulları da geçerlidir. Kişisel verilerin işlenmesi hakkında{" "}
          <Link href="/kvkk" className="text-accent-deep underline underline-offset-2">
            KVKK Aydınlatma Metni
          </Link>
          &apos;ni inceleyebilirsiniz.
        </p>
      ),
    },
    {
      title: "Sorumluluğun Sınırlandırılması",
      body: (
        <p>
          Site, mevcut haliyle sunulmaktadır. Sitenin kesintisiz veya hatasız çalışacağına dair garanti
          verilmez.
        </p>
      ),
    },
    {
      title: "Değişiklik Hakkı",
      body: (
        <p>
          Kulüp, bu kullanım şartlarını dilediği zaman güncelleme hakkını saklı tutar. Güncel sürüm her zaman
          bu sayfada yayınlanır.
        </p>
      ),
    },
    {
      title: "İletişim",
      body: (
        <p>
          Sorularınız için{" "}
          <Link href="/iletisim" className="text-accent-deep underline underline-offset-2">
            iletişim sayfamızdan
          </Link>{" "}
          bize ulaşabilirsiniz.
        </p>
      ),
    },
  ];

  return (
    <div className="bg-cream py-16 text-ink">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading as="h1" tone="light" align="left" eyebrow="Yasal" title="Kullanım Şartları" />

        <div className="mt-8 divide-y divide-black/10 rounded-3xl border border-black/10 bg-white px-6 shadow-sm sm:px-10">
          {sections.map((section, i) => (
            <section key={section.title} className="py-7 first:pt-8 last:pb-8">
              <div className="flex items-start gap-3.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent-deep">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-ink">{section.title}</h2>
                  <div className="mt-2 text-sm leading-relaxed text-ink-muted">{section.body}</div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
