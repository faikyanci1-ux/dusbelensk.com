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

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <SectionHeading eyebrow="Yasal" title="Kullanım Şartları" />

      <div className="mt-12 space-y-8 text-sm leading-relaxed text-text-muted">
        <section>
          <h2 className="text-base font-semibold text-white">1. Kabul</h2>
          <p className="mt-2">
            Bu web sitesini kullanarak aşağıdaki kullanım şartlarını kabul etmiş sayılırsınız. Kabul
            etmiyorsanız lütfen siteyi kullanmayınız.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">2. İçerik ve Telif Hakları</h2>
          <p className="mt-2">
            Sitedeki logo, metin, fotoğraf ve video içerikleri <strong className="text-text-main">{club.name}</strong>{" "}
            &apos;ya aittir. İçeriklerin kulübün yazılı izni olmadan kopyalanması, çoğaltılması veya ticari
            amaçla kullanılması yasaktır.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">3. Bilgilerin Doğruluğu</h2>
          <p className="mt-2">
            Sitede yer alan maç tarihleri, antrenman bilgileri ve duyurular değişiklik gösterebilir. Güncel
            bilgi için kulüple doğrudan iletişime geçmenizi öneririz.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">4. Form Aracılığıyla Gönderilen Bilgiler</h2>
          <p className="mt-2">
            İletişim veya kayıt/deneme antrenmanı formunu doldururken paylaştığınız bilgilerin doğru ve güncel
            olmasından siz sorumlusunuz. Kişisel verilerin işlenmesi hakkında{" "}
            <Link href="/kvkk" className="text-accent hover:underline">
              KVKK Aydınlatma Metni
            </Link>
            &apos;ni inceleyebilirsiniz.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">5. Sorumluluğun Sınırlandırılması</h2>
          <p className="mt-2">
            Site, mevcut haliyle sunulmaktadır. Sitenin kesintisiz veya hatasız çalışacağına dair garanti
            verilmez.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">6. Değişiklik Hakkı</h2>
          <p className="mt-2">
            Kulüp, bu kullanım şartlarını dilediği zaman güncelleme hakkını saklı tutar. Güncel sürüm her
            zaman bu sayfada yayınlanır.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">7. İletişim</h2>
          <p className="mt-2">
            Sorularınız için{" "}
            <Link href="/iletisim" className="text-accent hover:underline">
              iletişim sayfamızdan
            </Link>{" "}
            bize ulaşabilirsiniz.
          </p>
        </section>
      </div>
    </div>
  );
}
