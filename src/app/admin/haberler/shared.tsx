import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { gallery } from "@/data/gallery";
import type { ImageOption } from "./NewsForm";

/** "Sitedeki fotoğraflardan seç" listesi: galeri + sitenin diğer genel fotoğrafları (tekrarsız). */
const allSiteImages: ImageOption[] = [
  ...gallery.map(({ src, alt }) => ({ src, alt })),
  { src: "/images/hero-bg.jpg", alt: "Saha genel görünüm" },
  { src: "/images/facility-1.jpg", alt: "Tesis 1" },
  { src: "/images/facility-2.jpg", alt: "Tesis 2" },
  { src: "/images/facility-3.jpg", alt: "Tesis 3" },
  { src: "/images/hakkinda-1.jpg", alt: "Okaliptüs Tesisleri" },
  { src: "/images/hakkinda-2.jpg", alt: "Saha ve kulüp flaması" },
  { src: "/images/hakkinda-3.jpg", alt: "Yedek kulübesi" },
];

export const siteImageOptions: ImageOption[] = allSiteImages.filter(
  (option, index) => allSiteImages.findIndex((o) => o.src === option.src) === index
);

/** Bugünün tarihi (Türkiye saatiyle) "YYYY-MM-DD". */
export function todayInTurkey(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(new Date());
}

export function AdminFormShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-main px-4 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <Link href="/admin/haberler" className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white">
          <ArrowLeft size={14} />
          Haberler
        </Link>
        <h1 className="mt-3 mb-8 font-display text-2xl uppercase tracking-tight">{title}</h1>
        {children}
      </div>
    </div>
  );
}
