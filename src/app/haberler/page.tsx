import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Newspaper } from "lucide-react";
import { getNews } from "@/lib/queries";
import { PageHero } from "@/components/PageHero";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Haberler",
  description: "Düşbelen SK kulüp haberleri, duyurular ve gündem.",
  path: "/haberler",
  image: "/images/gallery/team-1.jpg",
});

export default async function NewsPage() {
  const items = await getNews();

  return (
    <>
    <PageHero
      eyebrow="Kulüp Gündemi"
      title="Haberler & Duyurular"
      description="Maç sonuçları, turnuva duyuruları ve kulüp haberleri burada yayınlanacak."
      image="/images/gallery/team-1.jpg"
    />
    <div className="bg-cream py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-black/15 py-16 text-center">
          <Newspaper className="text-ink-muted" size={32} />
          <p className="text-ink-muted">
            Henüz yayınlanmış bir haber yok. Admin panel devreye girdiğinde kulüp haberleri buradan
            yönetilecek.
          </p>
        </div>
      ) : (
        <>
        <h2 className="sr-only">Haberler Listesi</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              id={`news-${item.id}`}
              className="scroll-mt-24 overflow-hidden rounded-b-2xl border border-t-4 border-black/10 border-t-accent-bright bg-white shadow-sm target:border-accent"
            >
              {item.image && (
                <div className="relative h-40 w-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                  {item.tag && (
                    <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-white">
                      {item.tag}
                    </span>
                  )}
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                  <CalendarDays size={14} />
                  {item.date}
                </div>
                <h3 className="mt-2 font-semibold text-ink">
                  <Link href={`/haberler/${item.id}`} className="hover:text-accent">
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-4 text-sm text-ink-muted">{item.summary}</p>
                <Link
                  href={`/haberler/${item.id}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent underline underline-offset-2"
                >
                  Devamını Oku
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
        </>
      )}
      </div>
    </div>
    </>
  );
}
