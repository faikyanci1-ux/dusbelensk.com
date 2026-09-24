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

  const sections = [
    {
      title: "Kapsam",
      body: (
        <p>
          Bu gizlilik politikası, <strong className="font-semibold text-ink">{club.name}</strong> resmi web
          sitesini ({"dusbelensk.com"}) ziyaret ettiğinizde hangi bilgilerin toplandığını, nasıl kullanıldığını
          ve hangi hizmetlerin siteye gömülü olduğunu açıklar. Kişisel verilerin işlenmesine ve veri sahibi
          haklarınıza ilişkin ayrıntılı bilgi için{" "}
          <Link href="/kvkk" className="text-accent-deep underline underline-offset-2">
            KVKK Aydınlatma Metni
          </Link>
          &apos;ni inceleyebilirsiniz.
        </p>
      ),
    },
    {
      title: "Topladığımız Bilgiler",
      body: (
        <p>
          Sitemizi ziyaret etmek için herhangi bir bilgi paylaşmanız gerekmez ve sitemizde kişisel veri toplayan
          bir form bulunmaz. Futbol okulu ön kaydı, sitemizdeki QR kod ve &quot;Ön Kayıt&quot; butonlarının
          yönlendirdiği sporokullari.org platformundaki online form üzerinden yapılır; bu formda paylaştığınız
          bilgiler kulübümüze ulaşır. Bize telefon veya WhatsApp üzerinden ulaştığınızda da paylaştığınız
          iletişim bilgileri tarafımıza ulaşır.
        </p>
      ),
    },
    {
      title: "Çerezler (Cookies)",
      body: (
        <p>
          Sitemiz kendi adına takip amaçlı çerez veya üçüncü taraf analiz/reklam aracı kullanmamaktadır.
          Tarayıcınızın yerel deposu (localStorage), yalnızca cihazınızda kalan, bize ulaşmayan teknik
          tercihler için kullanılabilir. İletişim sayfamızda gösterdiğimiz Google Haritalar gömülü haritası
          yüklendiğinde, Google kendi çerezlerini ayarlayabilir; bu durum aşağıdaki 4. maddede açıklanmıştır.
        </p>
      ),
    },
    {
      title: "Harici Bağlantılar ve Gömülü İçerik",
      body: (
        <p>
          Sitemizde Instagram, WhatsApp ve online ön kayıt formunun bulunduğu sporokullari.org platformuna
          yönlendiren bağlantılar, İletişim sayfamızda ise Google
          Haritalar üzerinden gömülü bir harita bulunur. Google Haritalar içeriği yüklendiğinde, sayfa
          Google&apos;ın sunucularından veri çeker ve Google kendi gizlilik politikası kapsamında çerez
          kullanabilir. Bu harici platformların kendi gizlilik politikaları geçerlidir; bu platformların veri
          işleme faaliyetlerinden tarafımız sorumlu değildir.
        </p>
      ),
    },
    {
      title: "Veri Güvenliği",
      body: (
        <p>
          Bize ulaşan bilgilerinizin yalnızca kulüp yönetimi tarafından ve yalnızca kayıt ve iletişim
          amacıyla kullanılmasını sağlayacak makul teknik ve idari tedbirleri alırız. İnternet üzerinden hiçbir iletimin %100 güvenli olamayacağını
          hatırlatmak isteriz.
        </p>
      ),
    },
    {
      title: "Politikada Değişiklik",
      body: (
        <p>
          Bu gizlilik politikası zaman zaman güncellenebilir. Güncel sürüm her zaman bu sayfada yayınlanır;
          siteyi kullanmaya devam etmeniz güncel politikayı kabul ettiğiniz anlamına gelir.
        </p>
      ),
    },
    {
      title: "İletişim",
      body: (
        <p>
          Sorularınız için {club.phone} numaralı telefondan veya{" "}
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
        <SectionHeading as="h1" tone="light" align="left" eyebrow="Yasal" title="Gizlilik Politikası" />

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
