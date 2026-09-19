export type NewsItem = {
  id: number;
  title: string;
  date: string;
  summary: string;
  image?: string;
  tag?: string;
};

/** Haberler modülü admin panelle birlikte aktif olarak kullanılacak; şimdilik kulüp/site duyurularıyla başlıyor. */
export const news: NewsItem[] = [
  {
    id: 4,
    title: "U-12 Takımımız Çeyrek Finalde!",
    date: "19 Eylül 2026",
    summary:
      "Bu sezon Düşbelen SK; U-11, U-12, U-13 ve U-14 yaş gruplarıyla resmi liglerde mücadele ediyor. U-12 takımımız gösterdiği başarılı performansla çeyrek finale yükseldi. Emeği geçen sporcularımızı ve teknik ekibimizi tebrik ediyoruz!",
    image: "/images/gallery/match-2.jpg",
    tag: "Başarı",
  },
  {
    id: 1,
    title: "Yeni Web Sitemiz Yayında!",
    date: "18 Eylül 2026",
    summary:
      "Düşbelen SK'nın yenilenen web sitesi yayında. Artık deneme antrenmanı ve kayıt başvurunuzu doğrudan siteden yapabilir, sık sorulan soruları ve WhatsApp hattımızı da buradan bulabilirsiniz.",
    image: "/images/hero-bg.jpg",
    tag: "Duyuru",
  },
  {
    id: 2,
    title: "Deneme Antrenmanı ve Kayıt Başvuruları Web Sitemizden Alınıyor",
    date: "18 Eylül 2026",
    summary:
      "Kulübümüze katılmak isteyen veliler, İletişim sayfamızdaki formu doldurarak veya WhatsApp üzerinden doğrudan bize ulaşarak deneme antrenmanı talebinde bulunabilir.",
    image: "/images/gallery/training-1.jpg",
    tag: "Kayıt",
  },
  {
    id: 3,
    title: "Teknik Kadro ve Yönetim Sayfalarımız Güncellendi",
    date: "18 Eylül 2026",
    summary:
      "Teknik kadromuz ve yönetim kurulumuzla ilgili sayfalarımızı güncel fotoğraf ve bilgilerle yeniledik. Kulübün arkasındaki ekibi Teknik Kadro ve Yönetim sayfalarından tanıyabilirsiniz.",
    image: "/images/gallery/team-1.jpg",
    tag: "Kulüp",
  },
];
