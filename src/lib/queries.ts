/**
 * Tek giriş noktası: sayfalar veriyi yalnızca buradan alır.
 *
 * Admin panelden yönetilen içerik (site ayarları, haberler, etkinlikler, galeri, teknik kadro,
 * yönetim, SSS, yaş grupları) Postgres'ten okunur (hata davranışı için bkz. dbQuery).
 * Videolar, veli bilgileri ve değerler hâlâ statik dosyalardan gelir.
 *
 * getSiteSettings React cache() ile sarıldığı için aynı istek içinde birden çok bileşen
 * getClubInfo() çağırsa da veritabanına tek sorgu gider.
 */
import { cache } from "react";
import { asc, desc, eq, gte } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  boardMembers,
  events as eventsTable,
  faqItems,
  galleryItems,
  newsItems,
  programGroups,
  siteSettings,
  staff as staffTable,
} from "@/db/schema";
import { formatTurkishDate } from "@/lib/formatDate";
import {
  mergeClubSettings,
  normalizeClubSettings,
  todayInTurkey,
  type ClubInfo,
  type ClubSettings,
} from "@/lib/siteSettings";
import { players, type Player } from "@/data/players";
import type { StaffMember } from "@/data/staff";
import { managementBoardNote, auditBoardNote, type BoardMember } from "@/data/board";
import { lineup, lineupNote, type LineupSlot } from "@/data/lineup";
import type { GalleryItem } from "@/data/gallery";
import type { NewsItem } from "@/data/news";
import { statsBlurb, values, parentInfo, type ValueItem } from "@/data/club";
import { videos, type VideoItem } from "@/data/videos";
import type { FaqItem } from "@/data/faq";
import type { EventItem } from "@/data/events";
import type { ProgramGroup } from "@/data/program";

/**
 * Veritabanı sorgusu; hata olursa loglayıp yeniden fırlatır. Bilerek yedek içerik döndürmüyoruz:
 * sayfalar statik üretilip önbelleğe alınıyor ve yedek/boş içerik başarılı sayılıp kalıcı olarak
 * önbelleğe girerdi. Hata fırlatılınca Next.js son başarılı sayfayı sunmaya devam eder ve bir sonraki
 * istekte yeniden dener (bkz. docs/01-app/02-guides/incremental-static-regeneration.md); derleme
 * sırasında veritabanına ulaşılamazsa da yayın eski içerikle çıkmak yerine başarısız olur.
 */
async function dbQuery<T>(label: string, query: () => Promise<T>): Promise<T> {
  try {
    return await query();
  } catch (error) {
    console.error(`[${label}] veritabanından okunamadı:`, error);
    throw error;
  }
}

// ---------- Site ayarları ----------

export const getSiteSettings = cache(async (): Promise<ClubSettings> =>
  dbQuery(
    "getSiteSettings",
    async () => {
      const [row] = await getDb().select().from(siteSettings).where(eq(siteSettings.key, "club"));
      return normalizeClubSettings(row?.value);
    }
  )
);

export async function getClubInfo(): Promise<ClubInfo> {
  return mergeClubSettings(await getSiteSettings(), formatTurkishDate);
}

export async function getStats(): Promise<{ number: string; label: string }[]> {
  const [club, program] = await Promise.all([getClubInfo(), getProgram()]);
  return [
    { number: club.athleteStat, label: "Sporcu" },
    { number: String(program.length), label: "Yaş Grubu" },
    { number: String(club.foundedYear), label: "Kuruluş Yılı" },
    { number: club.officialMatchCount, label: "Resmi / Özel Maç" },
  ];
}

export async function getStatsBlurb() {
  return statsBlurb;
}

export async function getValues(): Promise<ValueItem[]> {
  return values;
}

export async function getParentInfo() {
  return parentInfo;
}

export async function getPlayers(): Promise<Player[]> {
  return players;
}

// ---------- Teknik kadro & yönetim ----------

export const getStaff = cache(async (): Promise<StaffMember[]> =>
  dbQuery(
    "getStaff",
    async () => {
      const rows = await getDb().select().from(staffTable).orderBy(asc(staffTable.sortOrder), asc(staffTable.id));
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        role: r.role,
        description: r.description,
        photo: r.photo,
        quote: r.quote ?? undefined,
      }));
    }
  )
);

const getBoardMembers = cache(async (): Promise<{ management: BoardMember[]; audit: BoardMember[] }> =>
  dbQuery(
    "getBoardMembers",
    async () => {
      const rows = await getDb()
        .select()
        .from(boardMembers)
        .orderBy(asc(boardMembers.sortOrder), asc(boardMembers.id));
      const toMember = (r: (typeof rows)[number]): BoardMember => ({
        name: r.name,
        role: r.role,
        photo: r.photo ?? undefined,
        quote: r.quote ?? undefined,
        bio: r.bio ?? undefined,
        values: r.values.length ? r.values : undefined,
        mottos: r.mottos.length ? r.mottos : undefined,
      });
      return {
        management: rows.filter((r) => r.boardType === "management").map(toMember),
        audit: rows.filter((r) => r.boardType === "audit").map(toMember),
      };
    }
  )
);

export async function getManagementBoard(): Promise<{ members: BoardMember[]; note: string }> {
  return { members: (await getBoardMembers()).management, note: managementBoardNote };
}

export async function getAuditBoard(): Promise<{ members: BoardMember[]; note: string }> {
  return { members: (await getBoardMembers()).audit, note: auditBoardNote };
}

export async function getLineup(): Promise<{ slots: LineupSlot[]; note: string }> {
  return { slots: lineup, note: lineupNote };
}

// ---------- Galeri ----------

export const getGallery = cache(async (): Promise<GalleryItem[]> =>
  dbQuery(
    "getGallery",
    async () => {
      const rows = await getDb().select().from(galleryItems).orderBy(asc(galleryItems.sortOrder), asc(galleryItems.id));
      return rows.map((r) => ({
        id: r.id,
        src: r.src,
        alt: r.alt,
        size: r.size === "large" || r.size === "wide" ? r.size : undefined,
      }));
    }
  )
);

// ---------- Haberler ----------

/** Haberler (yeniden eskiye). */
export const getNews = cache(async (): Promise<NewsItem[]> =>
  dbQuery(
    "getNews",
    async () => {
      const rows = await getDb().select().from(newsItems).orderBy(desc(newsItems.date), desc(newsItems.id));
      return rows.map((row) => ({
        id: row.id,
        title: row.title,
        date: formatTurkishDate(row.date),
        summary: row.summary,
        image: row.image ?? undefined,
        tag: row.tag ?? undefined,
      }));
    }
  )
);

export async function getVideos(): Promise<VideoItem[]> {
  return videos;
}

// ---------- SSS ----------

export const getFaq = cache(async (): Promise<FaqItem[]> =>
  dbQuery(
    "getFaq",
    async () => {
      const rows = await getDb().select().from(faqItems).orderBy(asc(faqItems.sortOrder), asc(faqItems.id));
      return rows.map((r) => ({ question: r.question, answer: r.answer }));
    }
  )
);

// ---------- Etkinlikler ----------

/** Bugün ve sonrasındaki etkinlikler (yakından uzağa). Tarihi geçenler otomatik gizlenir. */
export const getUpcomingEvents = cache(async (): Promise<EventItem[]> =>
  dbQuery(
    "getUpcomingEvents",
    async () => {
      const rows = await getDb()
        .select()
        .from(eventsTable)
        .where(gte(eventsTable.date, todayInTurkey()))
        .orderBy(asc(eventsTable.date), asc(eventsTable.id));
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        date: formatTurkishDate(r.date),
        detail: r.time ? `${r.time} · ${r.location}` : r.location,
        tag: r.tag,
      }));
    }
  )
);

// ---------- Yaş grupları ----------

export const getProgram = cache(async (): Promise<ProgramGroup[]> =>
  dbQuery(
    "getProgram",
    async () => {
      const rows = await getDb().select().from(programGroups).orderBy(asc(programGroups.sortOrder), asc(programGroups.id));
      return rows.map((r, i) => ({
        code: r.code,
        range: r.range,
        title: r.title,
        description: r.description,
        days: r.days,
        accent: i % 2 === 0 ? ("accent" as const) : ("accent-2" as const),
      }));
    }
  )
);

// ---------- Anasayfa "Yönetim ve Teknik Kadro" slider'ı ----------

export type LeadershipHighlight = {
  name: string;
  role: string;
  quote: string;
  photo: string;
  href: string;
};

/** Yönetim/teknik kadrodan, fotoğrafı ve sözü olan isimler — anasayfa slider'ı için. */
export async function getLeadershipHighlights(): Promise<LeadershipHighlight[]> {
  const [{ members: management }, staff] = await Promise.all([getManagementBoard(), getStaff()]);

  const boardHighlights: LeadershipHighlight[] = management
    .filter((member): member is BoardMember & { photo: string; quote: string } =>
      Boolean(member.photo && member.quote)
    )
    .map((member) => ({ name: member.name, role: member.role, quote: member.quote, photo: member.photo, href: "/yonetim" }));

  const staffHighlights: LeadershipHighlight[] = staff
    .filter((member): member is StaffMember & { quote: string } => Boolean(member.quote))
    .map((member) => ({ name: member.name, role: member.role, quote: member.quote, photo: member.photo, href: "/teknik-kadro" }));

  return [...boardHighlights, ...staffHighlights];
}
