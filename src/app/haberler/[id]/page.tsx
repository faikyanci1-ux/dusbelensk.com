import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { getNews } from "@/lib/queries";
import { PageHero } from "@/components/PageHero";
import { buildMetadata } from "@/lib/metadata";

type Params = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const news = await getNews();
  return news.map((item) => ({ id: String(item.id) }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const news = await getNews();
  const item = news.find((n) => String(n.id) === id);

  if (!item) {
    return buildMetadata({
      title: "Haber Bulunamadı",
      description: "Aradığınız haber bulunamadı.",
      path: "/haberler",
    });
  }

  return buildMetadata({
    title: item.title,
    description: item.summary,
    path: `/haberler/${item.id}`,
    image: item.image,
  });
}

export default async function NewsDetailPage({ params }: Params) {
  const { id } = await params;
  const news = await getNews();
  const item = news.find((n) => String(n.id) === id);

  if (!item) notFound();

  return (
    <>
      <PageHero eyebrow={item.tag ?? "Haber"} title={item.title} image={item.image} />
      <div className="bg-cream py-16 text-ink">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link href="/haberler" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink">
            <ArrowLeft size={16} />
            Tüm Haberler
          </Link>

          <div className="mt-6 flex items-center gap-1.5 text-sm text-ink-muted">
            <CalendarDays size={16} />
            {item.date}
          </div>

          <p className="mt-8 text-lg leading-relaxed text-ink-muted">{item.summary}</p>
        </div>
      </div>
    </>
  );
}
