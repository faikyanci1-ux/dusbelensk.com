const TURKISH_MONTH_ABBR: Record<string, string> = {
  Ocak: "OCA",
  Şubat: "ŞUB",
  Mart: "MAR",
  Nisan: "NİS",
  Mayıs: "MAY",
  Haziran: "HAZ",
  Temmuz: "TEM",
  Ağustos: "AĞU",
  Eylül: "EYL",
  Ekim: "EKİ",
  Kasım: "KAS",
  Aralık: "ARA",
};

/** "18 Eylül 2026" gibi bir tarih metninden { day: "18", month: "EYL" } üretir. */
export function getDateBadge(dateText: string): { day: string; month: string } {
  const [day, monthName] = dateText.split(" ");
  return { day, month: TURKISH_MONTH_ABBR[monthName] ?? monthName.slice(0, 3).toUpperCase() };
}
