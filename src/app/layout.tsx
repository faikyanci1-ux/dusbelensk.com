import type { Metadata } from "next";
import { Inter, Anton, Caveat } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { club } from "@/data/club";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const title = "Düşbelen SK | Resmi Web Sitesi";
const description =
  "Düşbelen SK, Köyceğiz/Muğla'da 2022'den beri genç yetenekleri yetiştiren altyapı odaklı futbol kulübü.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Düşbelen SK",
  },
  description,
  keywords: [
    "Köyceğiz futbol okulu",
    "Muğla futbol altyapı",
    "Düşbelen SK",
    "çocuk futbol okulu Köyceğiz",
  ],
  icons: {
    icon: "/favicon.png",
  },
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: club.name,
    locale: "tr_TR",
    type: "website",
    images: [{ url: "/images/hero-bg.jpg", width: 1200, height: 630, alt: club.name }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/hero-bg.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  name: club.name,
  url: siteUrl,
  logo: `${siteUrl}/images/logo.png`,
  sport: "Football",
  foundingDate: String(club.foundedYear),
  telephone: club.phoneHref.replace("tel:", ""),
  address: {
    "@type": "PostalAddress",
    streetAddress: club.address,
    addressLocality: "Köyceğiz",
    addressRegion: "Muğla",
    addressCountry: "TR",
  },
  sameAs: [club.instagramUrl],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${inter.variable} ${anton.variable} ${caveat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
