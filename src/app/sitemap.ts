import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { getNews } from "@/lib/queries";

const routes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/hakkimizda", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/futbol-okulu", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/teknik-kadro", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/galeri", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/haberler", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/yonetim", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/veliler-icin", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/sss", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/iletisim", priority: 0.9, changeFrequency: "yearly" as const },
  { path: "/gizlilik-politikasi", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/kullanim-sartlari", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/kvkk", priority: 0.2, changeFrequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const news = await getNews();

  const staticEntries = routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const newsEntries = news.map((item) => ({
    url: `${siteUrl}/haberler/${item.id}`,
    lastModified,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticEntries, ...newsEntries];
}
