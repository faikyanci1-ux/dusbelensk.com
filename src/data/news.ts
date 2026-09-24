export type NewsItem = {
  id: number;
  title: string;
  date: string;
  summary: string;
  image?: string;
  tag?: string;
};

/**
 * ARTIK SİTEDE KULLANILMIYOR: haberler Postgres'teki news_items tablosundan okunur ve
 * admin panelden (/admin/haberler) yönetilir. Bu liste yalnızca ilk aktarımın
 * (src/db/sync-news.ts) kaynağı ve NewsItem tipinin tanımı olarak duruyor.
 */
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
      "Düşbelen SK'nın yenilenen web sitesi yayında. Futbol okulu ön kaydını sitemizdeki QR kod veya online ön kayıt formuyla yapabilir, sık sorulan sorulara ve WhatsApp hattımıza da buradan ulaşabilirsiniz.",
    image: "/images/hero-bg.jpg",
    tag: "Duyuru",
  },
  {
    id: 2,
    title: "Futbol Okulu Ön Kayıtları Online Alınıyor",
    date: "18 Eylül 2026",
    summary:
      "Düşbelen Spor Futbol Okulu'na 2015–2020 doğumlu sporcular katılabilir. Veliler ön kaydı, sitemizdeki QR kodu okutarak veya “Ön Kayıt” butonuna dokunarak online form üzerinden birkaç dakikada yapabilir. Ücret, antrenman saatleri ve deneme antrenmanıyla ilgili sorularınız için telefon veya WhatsApp üzerinden bize ulaşabilirsiniz.",
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
