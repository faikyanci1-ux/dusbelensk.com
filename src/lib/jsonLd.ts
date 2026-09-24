/**
 * <script type="application/ld+json"> içine güvenle konacak JSON metni.
 * Admin panelden girilen metinler (adres, haber başlığı…) "</script>" içerebilir; "<" kaçırılmazsa
 * blok erken kapanır ve sonrası HTML/JS olarak çalışır. (Bkz. node_modules/next/dist/docs/01-app/02-guides/json-ld.md)
 */
export function jsonLdHtml(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
