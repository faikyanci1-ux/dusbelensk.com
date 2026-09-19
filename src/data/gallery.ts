export type GalleryItem = {
  id: number;
  src: string;
  alt: string;
  size?: "large" | "wide";
};

export const gallery: GalleryItem[] = [
  { id: 1, src: "/images/gallery/saha-havadan-2.jpg", alt: "Düşbelen SK sahası havadan görünüm", size: "large" },
  { id: 2, src: "/images/gallery/kupa-toreni-1.jpg", alt: "Kupa töreni", size: "wide" },
  { id: 3, src: "/images/gallery/rakip-mac-1.jpg", alt: "Maç günü, rakip takımla grup fotoğrafı" },
  { id: 4, src: "/images/gallery/rakip-mac-2.jpg", alt: "Maç sonrası takım fotoğrafı" },
  { id: 5, src: "/images/gallery/takim-fotografi-1.jpg", alt: "Takım fotoğrafı, kupa töreni öncesi" },
  { id: 6, src: "/images/gallery/takim-fotografi-2.jpg", alt: "Takım fotoğrafı, teknik ekiple birlikte" },
  { id: 7, src: "/images/gallery/takim-fotografi-3.jpg", alt: "Takım ve teknik kadro fotoğrafı" },
  { id: 8, src: "/images/gallery/saha-turk-bayragi.jpg", alt: "Sahada Türk bayrağı önünde takım fotoğrafı" },
  { id: 9, src: "/images/gallery/kulup-ailesi.jpg", alt: "Düşbelen SK aile sıcaklığı" },
  { id: 10, src: "/images/gallery/kadro-toplu-foto.jpg", alt: "Tribün önünde toplu kadro fotoğrafı", size: "wide" },
  { id: 11, src: "/images/gallery/kupa-toreni-2.jpg", alt: "Kupa kutlaması, soyunma odası" },
  { id: 12, src: "/images/gallery/takim-toplantisi.jpg", alt: "Maç öncesi taktik toplantısı" },
  { id: 13, src: "/images/gallery/soyunma-odasi.jpg", alt: "Düşbelen SK soyunma odaları", size: "wide" },
  { id: 14, src: "/images/gallery/saha-havadan-1.jpg", alt: "Tesis ve saha havadan görünüm" },
  { id: 15, src: "/images/gallery/tesis-havadan-cati.jpg", alt: "Düşbelen SK tesis binası havadan görünüm" },
  { id: 16, src: "/images/gallery/teknik-ekip-antrenman.jpg", alt: "Teknik ekip antrenman başında" },
  { id: 17, src: "/images/gallery/efsaneler-maci.jpg", alt: "Kulüp efsaneler maçı", size: "wide" },
  { id: 18, src: "/images/gallery/match-1.jpg", alt: "Maç Günü", size: "large" },
  { id: 19, src: "/images/gallery/training-1.jpg", alt: "Kupa Töreni" },
  { id: 20, src: "/images/gallery/team-1.jpg", alt: "Takım Fotoğrafı" },
  { id: 21, src: "/images/gallery/foto-1.jpg", alt: "Genç Yetenekler" },
  { id: 22, src: "/images/gallery/supporters-1.jpg", alt: "Tribün", size: "wide" },
  { id: 23, src: "/images/gallery/match-2.jpg", alt: "Şampiyonluk Kutlaması" },
  { id: 24, src: "/images/facility-1.jpg", alt: "Düşbelen SK Futbol Tesisi (havadan görünüm)" },
  { id: 25, src: "/images/facility-2.jpg", alt: "Düşbelen SK Kulüp Binası" },
  { id: 26, src: "/images/facility-3.jpg", alt: "Soyunma Odaları" },
];
