import type { Metadata } from "next";
import Link from "next/link";
import { getClubInfo } from "@/lib/queries";
import { SectionHeading } from "@/components/SectionHeading";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Gizlilik Politikası",
  description: "Düşbelen SK web sitesinin gizlilik politikası: hangi verileri topluyoruz, nasıl kullanıyoruz.",
  path: "/gizlilik-politikasi",
});

export default async function PrivacyPolicyPage() {
  const club = await getClubInfo();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <SectionHeading eyebrow="Yasal" title="Gizlilik Politikası" />

      <div className="mt-12 space-y-8 text-sm leading-relaxed text-text-muted">
        <section>
          <h2 className="text-base font-semibold text-white">1. Kapsam</h2>
          <p className="mt-2">
            Bu gizlilik politikası, <strong className="text-text-main">{club.name}</strong> resmi web sitesini
            ({"dusbelensk.com"}) ziyaret ettiğinizde hangi bilgilerin toplandığını, nasıl kullanıldığını ve
            hangi hizmetlerin siteye gömülü olduğunu açıklar. Kişisel verilerin işlenmesine ve veri sahibi
            haklarınıza ilişkin ayrıntılı bilgi için{" "}
            <Link href="/kvkk" className="text-accent hover:underline">
              KVKK Aydınlatma Metni
            </Link>
            &apos;ni inceleyebilirsiniz.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">2. Topladığımız Bilgiler</h2>
          <p className="mt-2">
            Sitemizi ziyaret etmek için herhangi bir bilgi paylaşmanız gerekmez. Yalnızca İletişim / Kayıt
            sayfamızdaki formu doldurup gönderdiğinizde; ad-soyad, telefon ve/veya e-posta, varsa çocuğunuzun
            adı ve yaş grubu bilgisi ile eklediğiniz not tarafımıza ulaşır.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">3. Çerezler (Cookies)</h2>
          <p className="mt-2">
            Sitemiz kendi adına takip amaçlı çerez veya üçüncü taraf analiz/reklam aracı kullanmamaktadır.
            Tarayıcınızın yerel deposu (localStorage), yalnızca cihazınızda kalan, bize ulaşmayan teknik
            tercihler için kullanılabilir. İletişim sayfamızda gösterdiğimiz Google Haritalar gömülü haritası
            yüklendiğinde, Google kendi çerezlerini ayarlayabilir; bu durum aşağıdaki 4. maddede açıklanmıştır.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">4. Harici Bağlantılar ve Gömülü İçerik</h2>
          <p className="mt-2">
            Sitemizde Instagram ve WhatsApp&apos;a yönlendiren bağlantılar, İletişim sayfamızda ise Google
            Haritalar üzerinden gömülü bir harita bulunur. Google Haritalar içeriği yüklendiğinde, sayfa
            Google&apos;ın sunucularından veri çeker ve Google kendi gizlilik politikası kapsamında çerez
            kullanabilir. Bu harici platformların kendi gizlilik politikaları geçerlidir; bu platformların veri
            işleme faaliyetlerinden tarafımız sorumlu değildir.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">5. Veri Güvenliği</h2>
          <p className="mt-2">
            Form aracılığıyla ilettiğiniz bilgilerin yalnızca kulüp yönetimine ulaşmasını sağlayacak makul
            teknik ve idari tedbirleri alırız. İnternet üzerinden hiçbir iletimin %100 güvenli olamayacağını
            hatırlatmak isteriz.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">6. Politikada Değişiklik</h2>
          <p className="mt-2">
            Bu gizlilik politikası zaman zaman güncellenebilir. Güncel sürüm her zaman bu sayfada yayınlanır;
            siteyi kullanmaya devam etmeniz güncel politikayı kabul ettiğiniz anlamına gelir.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white">7. İletişim</h2>
          <p className="mt-2">
            Sorularınız için {club.phone} numaralı telefondan veya{" "}
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
