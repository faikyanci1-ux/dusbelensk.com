import Image from "next/image";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { getClubInfo, getStats, getStatsBlurb, getVideos } from "@/lib/queries";
import { PageHero } from "@/components/PageHero";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { VideoCard } from "@/components/VideoCard";
import { buildMetadata } from "@/lib/metadata";
import type { GalleryItem } from "@/data/gallery";

const aboutGallery: GalleryItem[] = [
  { id: 1, src: "/images/facility-1.jpg", alt: "Düşbelen SK Futbol Tesisi (havadan görünüm)", size: "large" },
  { id: 2, src: "/images/hakkinda-1.jpg", alt: "Düşbelen SK Okaliptüs Tesisleri" },
  { id: 3, src: "/images/hakkinda-2.jpg", alt: "Düşbelen SK sahası ve kulüp flaması" },
  { id: 4, src: "/images/hakkinda-3.jpg", alt: "Düşbelen SK yedek kulübesi ve saha aydınlatması" },
  { id: 5, src: "/images/facility-2.jpg", alt: "Düşbelen SK Kulüp Binası" },
  { id: 6, src: "/images/facility-3.jpg", alt: "Soyunma Odaları" },
];

export const metadata: Metadata = buildMetadata({
  title: "Hakkımızda",
  description:
    "Düşbelen SK'nın hikayesi, tesisleri ve değerleri. Köyceğiz/Muğla'da 2022'den beri genç yetenekleri yetiştiren altyapı odaklı futbol kulübü.",
  path: "/hakkimizda",
  image: "/images/facility-1.jpg",
});

export default async function AboutPage() {
  const [club, stats, statsBlurb, videos] = await Promise.all([
    getClubInfo(),
    getStats(),
    getStatsBlurb(),
    getVideos(),
  ]);
  const yearsActive = new Date().getFullYear() - club.foundedYear;
  const facilityVideo = videos.find((v) => v.caption.includes("Havadan")) ?? videos[1];

  return (
    <>
    <PageHero
      eyebrow={`${club.foundedYear}'den beri sahada`}
      title={`${club.name} Hakkında`}
      description="Mahallenin yüreğinden doğan kulübümüzün hikayesi, tesisleri ve değerleri."
      image="/images/hero-bg.jpg"
    />
    <div className="bg-cream py-16 text-ink">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
              {club.foundedYear}&apos;den beri sahada
            </span>
            <span className="rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
              {club.licensedPlayerCount} lisanslı sporcu
            </span>
            <span className="rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
              Altyapı odaklı kulüp
            </span>
            {yearsActive > 0 && (
              <span className="rounded-full border border-accent-2/30 bg-accent-2-soft px-3 py-1 text-xs font-semibold text-accent-2">
                {yearsActive}+ yıllık tecrübe
              </span>
            )}
          </div>

          {club.description.map((paragraph) => (
            <p key={paragraph} className="mt-5 leading-relaxed text-ink-muted">
              {paragraph}
            </p>
          ))}
          <p className="mt-4 font-semibold text-ink">{club.mission}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {club.highlights.map((item) => (
              <div
                key={item}
                className="flex items-start gap-2.5 rounded-xl border border-black/10 bg-black/[0.02] p-3.5"
              >
                <CheckCircle2 className="mt-0.5 shrink-0 text-accent-2" size={18} strokeWidth={2} />
                <span className="text-sm text-ink">{item}</span>
              </div>
            ))}
          </div>

          <blockquote className="mt-8 rounded-r-xl border-l-2 border-accent bg-accent-soft/30 py-3 pl-4 pr-4 text-ink-muted italic">
            &ldquo;{club.quote.text}&rdquo;
            <span className="mt-2 block font-script text-xl not-italic text-accent-bright">
              {club.quote.author}
            </span>
            <span className="block text-xs not-italic uppercase tracking-wide text-ink-muted/80">
              {club.quote.role}
            </span>
          </blockquote>
        </div>

        <div>
          <VideoCard src={facilityVideo.src} poster={facilityVideo.poster} caption={facilityVideo.caption} />
          <div className="mt-3">
            <GalleryLightbox items={aboutGallery} compact />
          </div>
        </div>
      </div>

      <div className="relative mt-16 overflow-hidden rounded-3xl border border-black/10">
        <Image src="/images/coach-bg.jpg" alt="" fill sizes="100vw" className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-main via-bg-main/80 to-transparent" />
        <div className="relative max-w-xl px-8 py-14">
          <h3 className="text-xl font-bold text-white">Hoca&apos;nın Notu</h3>
          <p className="mt-4 text-text-muted italic">&ldquo;{club.coachNote.text}&rdquo;</p>
          <span className="mt-4 block text-sm font-semibold text-accent">{club.coachNote.signature}</span>
        </div>
      </div>

    </div>
    </div>

    <div className="bg-accent-tint py-12 text-ink">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md">
            <h2 className="font-display text-2xl uppercase tracking-tight text-ink">Düşbelen SK Sayılarla</h2>
            <p className="mt-2 text-sm text-ink-muted">{statsBlurb}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="min-w-[110px] rounded-xl border border-black/10 bg-white px-4 py-3 text-center shadow-sm"
              >
                <div className="font-display text-2xl text-accent-2">{stat.number}</div>
                <div className="mt-1 text-[11px] uppercase tracking-wide text-ink-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
