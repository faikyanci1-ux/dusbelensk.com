import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import { MapPin, Phone, ArrowUpRight } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { getClubInfo } from "@/lib/queries";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { SectionHeading } from "@/components/SectionHeading";
import { buildMetadata } from "@/lib/metadata";
import { siteUrl } from "@/lib/site";

function ContactInfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon | typeof InstagramIcon;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group flex items-center gap-3"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-bright/10 text-accent-bright transition group-hover:bg-accent-bright/20">
        <Icon size={17} />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-ink-muted/70">
          {label}
        </span>
        <span className="block truncate text-sm font-medium text-ink transition group-hover:text-accent-bright">
          {value}
        </span>
      </span>
    </a>
  );
}

export const metadata: Metadata = buildMetadata({
  title: "İletişim",
  description:
    "Düşbelen SK'ya ulaşın: deneme antrenmanı ve kayıt başvurusu yapın; telefon, WhatsApp, Instagram ve adres bilgileri.",
  path: "/iletisim",
});

export default async function ContactPage() {
  const club = await getClubInfo();

  // SportsOrganization (layout.tsx) haritada/saat kartında görünmez; konum bilgisi için
  // gerçek adres + koordinat (club.ts -> geo) içeren ayrı bir LocalBusiness kaydı ekliyoruz.
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": ["SportsActivityLocation", "LocalBusiness"],
    name: club.name,
    url: `${siteUrl}/iletisim`,
    telephone: club.phoneHref.replace("tel:", ""),
    image: `${siteUrl}/images/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: club.address,
      addressLocality: "Köyceğiz",
      addressRegion: "Muğla",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: club.geo.latitude,
      longitude: club.geo.longitude,
    },
    hasMap: club.mapsUrl,
    sameAs: [club.instagramUrl],
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
    />
    <PageHero
      eyebrow="Kulübe Katıl"
      title="Bize Ulaşın"
      description="Deneme antrenmanı, kayıt veya genel sorularınız için formu doldurun ya da doğrudan bize ulaşın."
      image="/images/facility-1.jpg"
    />
    <div className="bg-cream py-16 text-ink">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div className="order-2 min-w-0 space-y-8 lg:order-1">
            <SectionHeading
              eyebrow="İletişim Bilgilerimiz"
              title="Bize ulaşın."
              description="Deneme antrenmanı, kayıt veya genel sorularınız için aşağıdaki kanallardan bize kolayca ulaşabilirsiniz."
              tone="light"
              align="left"
            />

            <div className="flex flex-col gap-5 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
              <ContactInfoRow icon={MapPin} label="Konumumuz" value={club.address} href={club.mapsUrl} />
              <ContactInfoRow icon={Phone} label="Telefon" value={club.phone} href={club.phoneHref} />
              <ContactInfoRow
                icon={WhatsAppIcon}
                label="WhatsApp"
                value={club.phone}
                href={`https://wa.me/${club.whatsappNumber}`}
              />
              <ContactInfoRow
                icon={InstagramIcon}
                label="Instagram"
                value={club.instagramHandle}
                href={club.instagramUrl}
              />
            </div>

            <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
              <div className="flex items-center gap-2 px-5 pb-4 pt-5">
                <MapPin size={14} className="text-accent-bright" />
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Konum</span>
              </div>
              <iframe
                src={club.mapsEmbedSrc}
                width="100%"
                height="240"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${club.name} Konum`}
              />
              <a
                href={club.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 border-t border-black/10 py-3 text-xs font-semibold text-accent-2 transition hover:text-accent-bright"
              >
                Haritalar&apos;da Aç
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          <div className="order-1 rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8 lg:order-2">
            <h2 className="sr-only">İletişim Formu</h2>
            <ContactForm variant="light" />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
