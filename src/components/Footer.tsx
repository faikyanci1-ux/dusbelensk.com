import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { MapPin, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { SchoolQrCode } from "@/components/SchoolRegistration";
import { club } from "@/data/club";
import { navLinks } from "@/lib/nav";

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
      <span className="h-px w-4 bg-accent-bright" />
      {children}
    </h4>
  );
}

function ContactRow({
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
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-bright/10 text-accent-bright transition group-hover:bg-accent-bright/20">
        <Icon size={16} />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-text-muted/70">
          {label}
        </span>
        <span className="block truncate text-sm text-white transition group-hover:text-accent-bright">
          {value}
        </span>
      </span>
    </a>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border-soft/60 bg-black/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="Düşbelen SK Logo" width={44} height={44} className="h-11 w-11" />
            <div>
              <h3 className="text-lg font-bold text-white">{club.name}</h3>
              <span className="text-[11px] uppercase tracking-wide text-accent-bright">{club.tagline}</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-text-muted">
            Genç yetenekler, güçlü takım ruhu ve aile sıcaklığı ile Düşbelen&apos;in gururu.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <SchoolQrCode size={84} className="rounded-xl p-2" />
            <div>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-text-muted/70">
                Futbol Okulu
              </span>
              <a
                href={club.footballSchool.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-white transition hover:text-accent-bright"
              >
                Online Ön Kayıt →
              </a>
            </div>
          </div>
        </div>

        <div>
          <FooterHeading>Kulüp</FooterHeading>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-text-muted">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-accent-bright">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <FooterHeading>İletişim</FooterHeading>
          <div className="mt-5 flex flex-col gap-4">
            <ContactRow icon={MapPin} label="Konumumuz" value={club.address} href={club.mapsUrl} />
            <ContactRow icon={Phone} label="Telefon" value={club.phone} href={club.phoneHref} />
            <ContactRow
              icon={WhatsAppIcon}
              label="WhatsApp"
              value={club.phone}
              href={`https://wa.me/${club.whatsappNumber}`}
            />
            <ContactRow
              icon={InstagramIcon}
              label="Instagram"
              value={club.instagramHandle}
              href={club.instagramUrl}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-border-soft/40 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center text-xs text-text-muted sm:flex-row sm:justify-between sm:px-6 sm:text-left">
          <span>
            © {new Date().getFullYear()} {club.name}. Tüm hakları saklıdır.
          </span>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link href="/gizlilik-politikasi" className="hover:text-white">
              Gizlilik Politikası
            </Link>
            <Link href="/kullanim-sartlari" className="hover:text-white">
              Kullanım Şartları
            </Link>
            <Link href="/kvkk" className="hover:text-white">
              KVKK Aydınlatma Metni
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
