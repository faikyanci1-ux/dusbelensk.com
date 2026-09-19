import type { Metadata } from "next";
import { siteUrl } from "./site";

const DEFAULT_OG_IMAGE = "/images/hero-bg.jpg";

/**
 * Root layout sadece anasayfa için tam OpenGraph/Twitter kartı tanımlıyordu;
 * alt sayfalar kendi openGraph'ını tanımlamazsa bu obje hiç miras alınmaz ve
 * paylaşım kartlarında anasayfanın başlığı görünür. Her sayfa bu fonksiyonla
 * kendi tam metadata setini üretir.
 */
export function buildMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const fullTitle = `${title} | Düşbelen SK`;

  return {
    title,
    description,
    alternates: { canonical: path },
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
