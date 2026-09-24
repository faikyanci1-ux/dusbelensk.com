import "server-only";
import { asc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { galleryItems } from "@/db/schema";
import type { ImageOption } from "@/components/admin/ImageField";

/** Galeri dışında sitede bulunan genel fotoğraflar. */
const SITE_IMAGES: ImageOption[] = [
  { src: "/images/hero-bg.jpg", alt: "Saha genel görünüm" },
  { src: "/images/facility-1.jpg", alt: "Tesis 1" },
  { src: "/images/facility-2.jpg", alt: "Tesis 2" },
  { src: "/images/facility-3.jpg", alt: "Tesis 3" },
  { src: "/images/hakkinda-1.jpg", alt: "Okaliptüs Tesisleri" },
  { src: "/images/hakkinda-2.jpg", alt: "Saha ve kulüp flaması" },
  { src: "/images/hakkinda-3.jpg", alt: "Yedek kulübesi" },
  { src: "/images/coach-bg.jpg", alt: "Antrenör" },
];

/** Kişi fotoğrafları (teknik kadro / yönetim formlarında listenin başında gösterilir). */
export const PEOPLE_IMAGES: ImageOption[] = [
  { src: "/images/board/baskan-yilmaz-erdogan.jpg", alt: "Yılmaz Erdoğan" },
  { src: "/images/staff/arda-dindar.jpg", alt: "Arda Dindar" },
  { src: "/images/staff/polat-ertek.jpg", alt: "Polat Ertek" },
  { src: "/images/staff/selim-ozkan.jpg", alt: "Selim Özkan" },
  { src: "/images/staff/ferdi-sul.jpg", alt: "Ferdi Sül" },
  { src: "/images/staff/ozan-ozturk.jpg", alt: "Ozan Öztürk" },
  { src: "/images/staff/kaleci-antrenoru.jpg", alt: "Kaleci antrenörü" },
];

/** "Sitedeki fotoğraflardan seç" listesi: galeri (panelden yüklenenler dahil) + genel fotoğraflar, tekrarsız. */
export async function getImageOptions(extra: ImageOption[] = []): Promise<ImageOption[]> {
  const gallery = await getDb()
    .select({ src: galleryItems.src, alt: galleryItems.alt })
    .from(galleryItems)
    .orderBy(asc(galleryItems.sortOrder), asc(galleryItems.id))
    .catch(() => []);
  const all = [...extra, ...gallery, ...SITE_IMAGES];
  return all.filter((option, index) => all.findIndex((o) => o.src === option.src) === index);
}

/** Vercel Blob depolaması bağlı mı? (BLOB_READ_WRITE_TOKEN Vercel'de Blob store projeye bağlanınca eklenir.) */
export function isUploadEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}
