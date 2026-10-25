import type { NextConfig } from "next";

/**
 * CSP şimdilik YALNIZCA RAPOR MODUNDA (Content-Security-Policy-Report-Only): ihlaller tarayıcı konsoluna yazılır,
 * hiçbir şey engellenmez. Next.js satır içi betikleri (hidrasyon, JSON-LD) nedeniyle 'unsafe-inline' gerekir;
 * nonce'a geçilip zorlayıcı (enforcing) başlığa dönüşmeden önce konsolda ihlal kalmadığı doğrulanmalı.
 */
const isDev = process.env.NODE_ENV !== "production";
const contentSecurityPolicyReportOnly = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://muglaaskf.com",
  "media-src 'self' blob: https://*.public.blob.vercel-storage.com",
  "font-src 'self' data:",
  // Panelden Vercel Blob'a doğrudan yükleme (tarayıcı -> vercel.com/api/blob ve blob depolaması).
  `connect-src 'self' https://vercel.com https://*.public.blob.vercel-storage.com https://blob.vercel-storage.com${isDev ? " ws: wss:" : ""}`,
  "frame-src https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  // /askf/<grup> puan durumu sayfasına form gönderimi (muglaaskf.com) yapar.
  "form-action 'self' https://muglaaskf.com",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicyReportOnly },
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
