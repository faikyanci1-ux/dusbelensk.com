/**
 * Anasayfa hero slider'ındaki fotoğraflar, gösterim sırasıyla: en son eklenenler en başta.
 * Slider'a yalnızca yatay ve yüksek çözünürlüklü kareler konur; yeni fotoğraf eklerken listenin başına yazın.
 */
/** focus: geniş ekranda kırpılırken kişilerin (kafaların) kadrajda kalması için odak noktası (CSS object-position). */
export const heroImageSlides: { src: string; caption: string; focus?: string }[] = [
  // 26 Eylül 2026'da eklenenler
  { src: "/images/gallery/efsaneler-maci-sponsor.jpeg", caption: "Efsaneler Maçı · Takım Fotoğrafı", focus: "50% 0%" },
  { src: "/images/gallery/takim-otobusu.jpeg", caption: "Takımımız · Düşbelen SK Otobüsü", focus: "50% 65%" },
  { src: "/images/gallery/odul-toreni.jpeg", caption: "Turnuva · Ödül Töreni", focus: "50% 70%" },
  { src: "/images/gallery/takim-ve-teknik-ekip.jpeg", caption: "Takım ve Teknik Ekip", focus: "50% 45%" },
  { src: "/images/gallery/mac-oncesi-seremoni.jpeg", caption: "Maç Öncesi · Seremoni", focus: "50% 20%" },
  { src: "/images/gallery/galibiyet-sevinci.jpeg", caption: "Maç Sonrası · Galibiyet Sevinci", focus: "50% 40%" },
  // Önceki kareler
  { src: "/images/gallery/saha-havadan-2.jpg", caption: "Düşbelen SK sahası havadan görünüm" },
  { src: "/images/gallery/rakip-mac-1.jpg", caption: "Maç günü, rakip takımla grup fotoğrafı" },
  { src: "/images/gallery/kupa-toreni-1.jpg", caption: "Kupa töreni" },
  { src: "/images/gallery/takim-fotografi-1.jpg", caption: "Takım fotoğrafı, kupa töreni öncesi" },
  { src: "/images/gallery/rakip-mac-2.jpg", caption: "Maç sonrası takım fotoğrafı" },
  { src: "/images/gallery/takim-fotografi-2.jpg", caption: "Takım fotoğrafı, teknik ekiple birlikte" },
];
