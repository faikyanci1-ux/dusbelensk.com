import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { club } from "@/data/club";
import { navLinks } from "@/lib/nav";

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
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Kulüp</h4>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-text-muted">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">İletişim</h4>
          <a
            href={club.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block text-sm text-text-muted hover:text-white"
          >
            Adres: {club.address}
          </a>
          <a
            href={club.phoneHref}
            className="mt-2 flex items-center gap-2 text-sm text-text-muted hover:text-white"
          >
            <Phone size={16} className="text-accent-2" /> {club.phone}
          </a>
          <a
            href={club.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-2 text-sm text-text-muted hover:text-white"
          >
            <InstagramIcon size={16} className="text-accent-2" /> {club.instagramHandle}
          </a>
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
