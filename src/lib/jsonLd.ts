import { siteUrl } from "./site";

/**
 * <script type="application/ld+json"> içine güvenle konacak JSON metni.
 * Admin panelden girilen metinler (adres, haber başlığı…) "</script>" içerebilir; "<" kaçırılmazsa
 * blok erken kapanır ve sonrası HTML/JS olarak çalışır. (Bkz. node_modules/next/dist/docs/01-app/02-guides/json-ld.md)
 */
export function jsonLdHtml(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Kulüp varlığının (SportsClub/LocalBusiness) tek ve değişmez kimliği; diğer şemalar buna @id ile bağlanır. */
export const clubId = `${siteUrl}/#club`;
export const websiteId = `${siteUrl}/#website`;

/** BreadcrumbList. `path` "/" ile başlar; ilk öğe olarak Anasayfa otomatik eklenir. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Anasayfa", path: "" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}
