import type { Metadata } from "next";
import { MapPin, Phone, ArrowUpRight } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { getClubInfo } from "@/lib/queries";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "İletişim",
  description:
    "Düşbelen SK'ya ulaşın: deneme antrenmanı ve kayıt başvurusu yapın; telefon, WhatsApp, Instagram ve adres bilgileri.",
  path: "/iletisim",
});

export default async function ContactPage() {
  const club = await getClubInfo();

  return (
    <>
    <PageHero
      eyebrow="Kulübe Katıl"
      title="Bize Ulaşın"
      description="Deneme antrenmanı, kayıt veya genel sorularınız için formu doldurun ya da doğrudan bize ulaşın."
      image="/images/facility-1.jpg"
    />
    <div className="bg-cream py-16 text-ink">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            <a
              href={club.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 rounded-2xl border border-black/10 bg-black/[0.02] p-5 text-sm text-ink-muted hover:border-accent-2 hover:text-ink"
            >
              <MapPin className="mt-0.5 shrink-0 text-accent-2" size={20} />
              {club.address}
            </a>
            <a
              href={club.phoneHref}
              className="flex items-center gap-3 rounded-2xl border border-black/10 bg-black/[0.02] p-5 text-sm text-ink-muted hover:border-accent-2 hover:text-ink"
            >
              <Phone className="shrink-0 text-accent-2" size={20} />
              {club.phone}
            </a>
            <a
              href={club.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-black/10 bg-black/[0.02] p-5 text-sm text-ink-muted hover:border-accent-2 hover:text-ink"
            >
              <InstagramIcon className="shrink-0 text-accent-2" size={20} />
              {club.instagramHandle}
            </a>

            <div className="relative overflow-hidden rounded-2xl border border-black/10">
              <iframe
                src={club.mapsEmbedSrc}
                width="100%"
                height="260"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${club.name} Konum`}
              />
              <a
                href={club.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-bg-main/90 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur transition hover:bg-accent-2"
              >
                Haritada Aç
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <ContactForm variant="light" />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
