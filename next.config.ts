import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // AVIF öncelikli, desteklemeyen tarayıcılarda WebP'ye düşer (next/image varsayılanı sadece webp'dir).
    formats: ["image/avif", "image/webp"],
    // Admin panelden yüklenen haber/galeri görselleri Vercel Blob'da tutulur.
    // muglaaskf.com: puan durumundaki takım logoları.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "muglaaskf.com", pathname: "/images/**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      // Dosya adı aynı kalıp içerik değişebileceği için "immutable" yerine kısa önbellek + arka planda yenileme.
      ...["/videos/:path*", "/images/:path*"].map((source) => ({
        source,
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      })),
    ];
  },
};

export default nextConfig;
