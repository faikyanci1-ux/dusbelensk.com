export type EventItem = {
  id: number;
  title: string;
  date: string;
  detail: string;
  tag: string;
};

/**
 * Gerçek maç/turnuva/kayıt günü/sınav tarihleri netleştikçe buraya eklenecek.
 * Şimdilik tek gerçek veri: club.ts'teki "Sıradaki Maç" bilgisi (rakip adı henüz placeholder).
 */
export const events: EventItem[] = [
  {
    id: 1,
    title: "Düşbelen SK vs Rakip Takım",
    date: "14 Aralık 2025",
    detail: "Düşbelen SK Tesisleri",
    tag: "Hazırlık Maçı",
  },
];
