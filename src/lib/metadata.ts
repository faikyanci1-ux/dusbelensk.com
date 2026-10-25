import type { Metadata } from "next";
import { siteUrl } from "./site";

// src/app/opengraph-image.tsx'in sunduğu varsayılan paylaşım kartı. Alt sayfalar kendi openGraph nesnesini
// verdiğinde dosya tabanlı görsel miras alınmadığı için adres açıkça yazılır.
const DEFAULT_OG_IMAGE = "/opengraph-image";

/**
 * Root layout'taki metadata sadece anasayfa için geçerli kalır; alt sayfalar kendi openGraph'ını
 * tanımlamazsa bu obje miras alınmaz. Her sayfa bu fonksiyonla kendi tam metadata setini üretir.
 * `image` verilmezse varsayılan paylaşım kartı kullanılır.
 * `noindex`: sayfa aranabilir olmasın ama içindeki bağlantılar izlensin (yasal metinler, bulunamadı sayfaları).
 */
export function buildMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
}): Metadata {
  const fullTitle = `${title} | Düşbelen SK`;

  return {
    title,
    description,
    alternates: { canonical: path },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: fullTitle,
      description,
      url: `${siteUrl}${path}`,
      siteName: "Düşbelen SK",
      locale: "tr_TR",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

/** Meta description için: boşlukları sadeleştirir, `max` karakteri aşarsa kelime sınırında keser. */
export function truncateDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 80 ? cut.lastIndexOf(" ") : cut.length).replace(/[\s,.;:–-]+$/, "")}…`;
}
