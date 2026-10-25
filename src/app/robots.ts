import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// /admin burada ENGELLENMEZ: giriş sayfası meta noindex taşır; robots.txt ile de engellenirse
// Google sayfayı hiç tarayamaz ve noindex'i göremez. Yalnızca API uçları kapalıdır.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
