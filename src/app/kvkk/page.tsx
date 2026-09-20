import type { Metadata } from "next";
import Link from "next/link";
import { getClubInfo } from "@/lib/queries";
import { SectionHeading } from "@/components/SectionHeading";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "KVKK Aydınlatma Metni",
  description: "Düşbelen SK 6698 sayılı KVKK kapsamında kişisel verilerin işlenmesine ilişkin aydınlatma metni.",
  path: "/kvkk",
});

export default async function KvkkPage() {
  const club = await getClubInfo();

  const sections = [
    {
      title: "Veri Sorumlusunun Kimliği",
      body: (
        <div className="space-y-1">
          <p>
            Unvan: <span className="font-medium text-ink">{club.name}</span>
          </p>
          <p>Adres: {club.address}</p>
          <p>Telefon: {club.phone}</p>
        </div>
      ),
    },
    {
      title: "Hangi Kişisel Verilerinizi Topluyoruz?",
      body: (
        <>
          <p>
            Web sitemizdeki İletişim / Kayıt formunu doldurduğunuzda aşağıdaki kişisel verileriniz işlenir:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Kimlik verisi: Ad-soyad (veli olarak sizin, deneme antrenmanı talebinde ayrıca çocuğunuzun)</li>
            <li>İletişim verisi: Telefon numarası ve/veya e-posta adresi</li>
            <li>Talep içeriği: Formda paylaştığınız yaş grubu bilgisi ve varsa eklediğiniz not/mesaj</li>
          </ul>
          <p className="mt-2">
            Sitemiz; T.C. kimlik numarası, finansal bilgi (kart/hesap bilgisi), biyometrik veri veya özel
            nitelikli kişisel veri toplamaz. Formu doldurmadığınız sürece sizden herhangi bir bilgi talep
            edilmez.
          </p>
        </>
      ),
    },
    {
      title: "Toplama Yöntemi ve Hukuki Sebep",
      body: (
        <p>
          Kişisel verileriniz, yalnızca web sitemizdeki İletişim / Kayıt formunu doldurup göndermeniz yoluyla,
          elektronik ortamda toplanır. Bu veriler; KVKK&apos;nın 5. maddesinde yer alan &quot;ilgili kişinin
          talebi üzerine bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması&quot; hukuki
          sebebine ve formu gönderirken verdiğiniz açık rızaya dayanılarak işlenir.
        </p>
      ),
    },
    {
      title: "Kişisel Verilerinizi Hangi Amaçla İşliyoruz?",
      body: (
        <>
          <ul className="list-disc space-y-1 pl-5">
            <li>Deneme antrenmanı ve kayıt taleplerinizin değerlendirilmesi,</li>
            <li>Tarafınızla iletişime geçilmesi ve sorularınızın yanıtlanması,</li>
            <li>Kulüp faaliyetleri ve süreçleriyle ilgili bilgilendirme yapılması.</li>
          </ul>
          <p className="mt-2">
            Verileriniz; reklam, pazarlama veya profil çıkarma amacıyla kullanılmaz, otomatik karar
            mekanizmalarında işlenmez.
          </p>
        </>
      ),
    },
    {
      title: "Kişisel Verileriniz Kimlerle Paylaşılır?",
      body: (
        <p>
          Form aracılığıyla ilettiğiniz bilgiler, tarafınıza dönüş yapılabilmesi amacıyla e-posta yoluyla
          kulüp yönetimine iletilir. Bu iletim, e-posta altyapı hizmeti sağlayıcımız Resend (resend.com)
          üzerinden gerçekleşir; bu kapsamda verileriniz teknik olarak yurt dışında bulunan sunucular
          üzerinden geçebilir. Resend, yalnızca e-postanın iletilmesi amacıyla teknik altyapı sağlayan bir
          hizmet sağlayıcıdır. Verileriniz bunun dışında hiçbir üçüncü kişi, kurum veya reklam
          verenle paylaşılmaz, satılmaz veya pazarlama amacıyla kullanılmaz.
        </p>
      ),
    },
    {
      title: "Çocuklara Ait Veriler",
      body: (
        <p>
          Deneme antrenmanı / kayıt formu aracılığıyla bir çocuğun adı ve yaş grubu bilgisini paylaşıyorsanız,
          bu bilgiyi veli veya yasal vasi sıfatıyla, çocuğunuz adına rıza vererek ilettiğinizi kabul edersiniz.
        </p>
      ),
    },
    {
      title: "Saklama Süresi",
      body: (
        <p>
          Kişisel verileriniz, talebinizin sonuçlandırılması için gerekli süre ve ilgili mevzuatta öngörülen
          zamanaşımı süreleri boyunca saklanır; bu sürelerin sonunda silinir veya anonim hale getirilir.
        </p>
      ),
    },
    {
      title: "KVKK Kapsamındaki Haklarınız",
      body: (
        <>
          <p>KVKK&apos;nın 11. maddesi uyarınca, kişisel verilerinizle ilgili olarak:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Kişisel verinizin işlenip işlenmediğini öğrenme,</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
            <li>Yurt içinde veya yurt dışında verilerin aktarıldığı üçüncü kişileri öğrenme,</li>
            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
            <li>İlgili mevzuatta öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme,</li>
            <li>İşlenmesine itiraz etme,</li>
            <li>Kanuna aykırı işlenme sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme</li>
          </ul>
          <p className="mt-2">haklarına sahipsiniz.</p>
        </>
      ),
    },
    {
      title: "Başvuru Yöntemi",
      body: (
        <p>
          Yukarıdaki haklarınızı kullanmak için {club.phone} numaralı telefondan veya{" "}
          <Link href="/iletisim" className="text-accent-deep underline underline-offset-2">
            iletişim sayfamızdaki
          </Link>{" "}
          kanallardan bize ulaşabilirsiniz. Talepleriniz, niteliğine göre en kısa sürede ve en geç 30 gün
          içinde ücretsiz olarak sonuçlandırılır.
        </p>
      ),
    },
  ];

  return (
    <div className="bg-cream py-16 text-ink">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading as="h1" tone="light" align="left" eyebrow="Yasal" title="KVKK Aydınlatma Metni" />

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-muted">
          <strong className="font-semibold text-ink">{club.name}</strong> olarak kişisel verilerinizin
          güvenliğine önem veriyoruz. 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca
          taşıdığımız &quot;Veri Sorumlusu&quot; sıfatıyla, web sitemiz üzerinden bizimle paylaştığınız kişisel
          verilerin hangi amaçla işlendiği, kimlerle paylaşıldığı ve bu konudaki haklarınız hakkında sizi
          aşağıda bilgilendiriyoruz.
        </p>

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
