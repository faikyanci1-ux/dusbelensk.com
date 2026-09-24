import Image from "next/image";
import { ArrowUpRight, QrCode } from "lucide-react";
import { club } from "@/data/club";

const { footballSchool } = club;

/** QR kod + ortasında kulüp logosu. QR "H" hata toleransıyla üretildi, ortadaki logo okumayı bozmaz. */
export function SchoolQrCode({ size = 200, className = "" }: { size?: number; className?: string }) {
  const logoSize = Math.round(size * 0.22);

  return (
    <a
      href={footballSchool.registrationUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${footballSchool.name} ön kayıt formu (QR kod)`}
      className={`relative block shrink-0 rounded-2xl bg-white p-3 shadow-lg ${className}`}
      style={{ width: size + 24 }}
    >
      <Image
        src={footballSchool.qrImage}
        alt={`${footballSchool.name} ön kayıt QR kodu`}
        width={size}
        height={size}
        className="h-auto w-full"
      />
      <span
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-white p-1"
        style={{ width: logoSize + 8, height: logoSize + 8 }}
      >
        <Image src="/images/logo.png" alt="" width={logoSize} height={logoSize} />
      </span>
    </a>
  );
}

export function SchoolRegisterButton({
  label = "Hemen Ön Kayıt Ol",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={footballSchool.registrationUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:brightness-110 ${className}`}
    >
      {label}
      <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

/** Kart: QR + "telefonunuzla okutun" notu + buton. Açık (cream) zeminler için. */
export function SchoolRegistrationCard({ title = "Online Ön Kayıt" }: { title?: string }) {
  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-black/10 bg-white p-6 text-center shadow-sm sm:flex-row sm:text-left">
      <SchoolQrCode size={140} className="border border-black/10 shadow-none" />
      <div>
        <h3 className="font-display text-xl uppercase tracking-tight text-ink">{title}</h3>
        <p className="mt-2 text-sm text-ink-muted">
          {footballSchool.name} kaydı için QR kodu telefonunuzun kamerasıyla okutun ya da butona dokunun.
        </p>
        <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-ink-muted sm:justify-start">
          <QrCode size={14} className="text-accent" />
          Kayıt formu birkaç dakika sürer.
        </p>
        <SchoolRegisterButton className="mt-4" />
      </div>
    </div>
  );
}
