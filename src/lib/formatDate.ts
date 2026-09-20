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

const TURKISH_MONTH_NUMBER: Record<string, string> = {
  Ocak: "01",
  Şubat: "02",
  Mart: "03",
  Nisan: "04",
  Mayıs: "05",
  Haziran: "06",
  Temmuz: "07",
  Ağustos: "08",
  Eylül: "09",
  Ekim: "10",
  Kasım: "11",
  Aralık: "12",
};

/**
 * "19 Eylül 2026" gibi bir tarih metninden ISO 8601 tarih üretir (JSON-LD datePublished için).
 * Ayrıştırılamazsa undefined döner — JSON.stringify bu alanı otomatik olarak atlar.
 */
export function toIsoDate(dateText: string): string | undefined {
  const [day, monthName, year] = dateText.split(" ");
  const month = TURKISH_MONTH_NUMBER[monthName];
  if (!day || !month || !year) return undefined;
  return `${year}-${month}-${day.padStart(2, "0")}`;
}
