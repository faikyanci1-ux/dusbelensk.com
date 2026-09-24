import { club as staticClub } from "@/data/club";

/**
 * Admin panelden ("Site Ayarları") değiştirilebilen kulüp bilgileri.
 * site_settings tablosunda key = "club" satırının value'su bu şekildedir.
 * Buradaki alanlar src/data/club.ts'teki statik değerlerin üzerine yazılır
 * (bkz. mergeClubSettings); geri kalan alanlar (adres haritası, logo vb.) statik kalır.
 */
export type ClubSettings = {
  phone: string;
  whatsappNumber: string;
  address: string;
  instagramHandle: string;

  /** "100'e yakın" — metinlerde geçer ("100'e yakın sporcumuzla…"). */
  athleteCount: string;
  /** "~100" — istatistik kutusundaki büyük rakam. */
  athleteStat: string;
  foundedYear: number;
  officialMatchCount: string;
  ageRange: string;

  school: {
    birthYearFrom: number;
    birthYearTo: number;
    registrationUrl: string;
  };

  nextMatch: {
    enabled: boolean;
    opponent: string;
    /** ISO "YYYY-MM-DD" */
    date: string;
    time: string;
    location: string;
    tag: string;
  };

  about: {
    description: string[];
    mission: string;
    highlights: string[];
    quoteText: string;
    coachNoteText: string;
  };
};

/** src/data/club.ts'teki mevcut değerlerden türetilen varsayılan ayarlar (ilk aktarım ve yedek). */
export const defaultClubSettings: ClubSettings = {
  phone: staticClub.phone,
  whatsappNumber: staticClub.whatsappNumber,
  address: staticClub.address,
  instagramHandle: staticClub.instagramHandle,
  athleteCount: staticClub.athleteCount,
  athleteStat: "~100",
  foundedYear: staticClub.foundedYear,
  officialMatchCount: staticClub.officialMatchCount,
  ageRange: staticClub.ageRange,
  school: {
    birthYearFrom: staticClub.footballSchool.birthYearFrom,
    birthYearTo: staticClub.footballSchool.birthYearTo,
    registrationUrl: staticClub.footballSchool.registrationUrl,
  },
  nextMatch: {
    // Mevcut veri geçmiş tarihli bir yer tutucu ("Rakip Takım – 14 Aralık 2025"): kapalı başlıyor.
    enabled: false,
    opponent: staticClub.nextMatch.opponent,
    date: "2025-12-14",
    time: staticClub.nextMatch.time,
    location: staticClub.nextMatch.location,
    tag: staticClub.nextMatch.tag,
  },
  about: {
    description: [...staticClub.description],
    mission: staticClub.mission,
    highlights: [...staticClub.highlights],
    quoteText: staticClub.quote.text,
    coachNoteText: staticClub.coachNote.text,
  },
};

/** DB'den gelen (eksik/eski olabilecek) değeri varsayılanlarla tamamlar. */
export function normalizeClubSettings(value: unknown): ClubSettings {
  const v = (value && typeof value === "object" ? value : {}) as Partial<ClubSettings>;
  const d = defaultClubSettings;
  return {
    ...d,
    ...v,
    school: { ...d.school, ...(v.school ?? {}) },
    nextMatch: { ...d.nextMatch, ...(v.nextMatch ?? {}) },
    about: { ...d.about, ...(v.about ?? {}) },
  };
}

/** "0532 616 00 48" -> "tel:+905326160048" */
export function toPhoneHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("90")) return `tel:+${digits}`;
  if (digits.startsWith("0")) return `tel:+90${digits.slice(1)}`;
  return `tel:+90${digits}`;
}

/** "905326160048" / "05326160048" -> "0532 616 00 48". Biçimlenemezse olduğu gibi döner. */
export function formatTurkishPhone(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("90")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length !== 10) return value;
  return `0${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`;
}

/** Bugünün tarihi (Türkiye saatiyle) "YYYY-MM-DD". */
export function todayInTurkey(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(new Date());
}

/** Sitenin kullandığı birleşik kulüp bilgisi: statik alanlar + admin panelden gelen ayarlar. */
export type ClubInfo = {
  name: string;
  tagline: string;
  motto: string;
  foundedYear: number;
  ageRange: string;
  athleteCount: string;
  athleteStat: string;
  officialMatchCount: string;
  address: string;
  mapsUrl: string;
  mapsEmbedSrc: string;
  geo: { latitude: number; longitude: number };
  phone: string;
  phoneHref: string;
  whatsappNumber: string;
  /** "0532 616 00 48" — whatsappNumber'ın okunur hali */
  whatsappDisplay: string;
  instagramHandle: string;
  instagramUrl: string;
  description: string[];
  highlights: string[];
  mission: string;
  quote: { text: string; author: string; role: string };
  coachNote: { text: string; signature: string };
  footballSchool: {
    name: string;
    athleteCount: string;
    birthYearFrom: number;
    birthYearTo: number;
    /** "2015–2020" */
    birthYears: string;
    registrationUrl: string;
  };
  /** Sıradaki maç; tarih "19 Eylül 2026" biçiminde. show: açık ve tarihi geçmemişse true. */
  nextMatch: { show: boolean; opponent: string; date: string; time: string; location: string; tag: string };
};

export function mergeClubSettings(s: ClubSettings, formatDate: (iso: string) => string): ClubInfo {
  const handle = s.instagramHandle.replace(/^@/, "").trim();
  return {
    name: staticClub.name,
    tagline: staticClub.tagline,
    motto: staticClub.motto,
    foundedYear: s.foundedYear,
    ageRange: s.ageRange,
    athleteCount: s.athleteCount,
    athleteStat: s.athleteStat,
    officialMatchCount: s.officialMatchCount,
    address: s.address,
    mapsUrl: staticClub.mapsUrl,
    mapsEmbedSrc: staticClub.mapsEmbedSrc,
    geo: { ...staticClub.geo },
    phone: s.phone,
    phoneHref: toPhoneHref(s.phone),
    whatsappNumber: s.whatsappNumber.replace(/\D/g, ""),
    whatsappDisplay: formatTurkishPhone(s.whatsappNumber),
    instagramHandle: `@${handle}`,
    instagramUrl: `https://www.instagram.com/${handle}/`,
    description: s.about.description,
    highlights: s.about.highlights,
    mission: s.about.mission,
    quote: { ...staticClub.quote, text: s.about.quoteText },
    coachNote: { ...staticClub.coachNote, text: s.about.coachNoteText },
    footballSchool: {
      name: staticClub.footballSchool.name,
      athleteCount: s.athleteCount,
      birthYearFrom: s.school.birthYearFrom,
      birthYearTo: s.school.birthYearTo,
      birthYears: `${s.school.birthYearFrom}–${s.school.birthYearTo}`,
      registrationUrl: s.school.registrationUrl,
    },
    nextMatch: {
      show: s.nextMatch.enabled && s.nextMatch.date >= todayInTurkey(),
      opponent: s.nextMatch.opponent,
      date: formatDate(s.nextMatch.date),
      time: s.nextMatch.time,
      location: s.nextMatch.location,
      tag: s.nextMatch.tag,
    },
  };
}
