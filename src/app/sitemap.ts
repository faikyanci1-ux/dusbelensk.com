import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { getNews, getProgram } from "@/lib/queries";
import { toIsoDate } from "@/lib/formatDate";
import { ageGroupPath } from "@/lib/ageGroups";

// Statik sayfalar için güvenilir bir "son değişiklik" kaynağı olmadığından lastModified verilmez
// (uydurma lastmod arama motorlarınca güvenilmez sayılır). Yasal sayfalar noindex olduğu için yer almaz.
const routes = [
  "/",
  "/hakkimizda",
  "/futbol-okulu",
  "/yas-gruplari",
  "/teknik-kadro",
  "/galeri",
  "/haberler",
  "/yonetim",
  "/veliler-icin",
  "/sss",
  "/iletisim",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, program] = await Promise.all([getNews(), getProgram()]);

  const staticEntries: MetadataRoute.Sitemap = routes.map((path) => ({
    url: path === "/" ? siteUrl : `${siteUrl}${path}`,
  }));

  const groupEntries: MetadataRoute.Sitemap = program.map((group) => ({
    url: `${siteUrl}${ageGroupPath(group.code)}`,
  }));

  const newsEntries: MetadataRoute.Sitemap = news.map((item) => {
    const iso = toIsoDate(item.date);
    return {
      url: `${siteUrl}/haberler/${item.id}`,
      ...(iso ? { lastModified: new Date(iso) } : {}),
    };
  });

  return [...staticEntries, ...groupEntries, ...newsEntries];
}
