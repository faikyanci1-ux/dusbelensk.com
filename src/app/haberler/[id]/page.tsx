import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { getNews } from "@/lib/queries";
import { PageHero } from "@/components/PageHero";
import { buildMetadata } from "@/lib/metadata";
import { siteUrl } from "@/lib/site";
import { club } from "@/data/club";
import { toIsoDate } from "@/lib/formatDate";

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

  const isoDate = toIsoDate(item.date);
  const articleUrl = `${siteUrl}/haberler/${item.id}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: item.summary,
    datePublished: isoDate,
    dateModified: isoDate,
    image: item.image ? [`${siteUrl}${item.image}`] : undefined,
    author: { "@type": "Organization", name: club.name, url: siteUrl },
    publisher: {
      "@type": "Organization",
      name: club.name,
      logo: { "@type": "ImageObject", url: `${siteUrl}/images/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Anasayfa", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Haberler", item: `${siteUrl}/haberler` },
      { "@type": "ListItem", position: 3, name: item.title, item: articleUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PageHero eyebrow={item.tag ?? "Haber"} title={item.title} image={item.image} />
      <div className="bg-cream py-16 text-ink">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link href="/haberler" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink">
            <ArrowLeft size={16} />
            Tüm Haberler
          </Link>

          <div className="mt-6 flex items-center gap-1.5 text-sm text-ink-muted">
            <CalendarDays size={16} />
            <time dateTime={isoDate}>{item.date}</time>
          </div>

          <p className="mt-8 text-lg leading-relaxed text-ink-muted">{item.summary}</p>
        </div>
      </div>
    </>
  );
}
