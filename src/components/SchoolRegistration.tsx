import Image from "next/image";
import { ArrowUpRight, QrCode } from "lucide-react";
import { club } from "@/data/club";

const { footballSchool } = club;

export const schoolBirthYears = `${footballSchool.birthYearFrom}–${footballSchool.birthYearTo}`;

/** "2015–2020 doğumlu sporcular katılabilir" etiketi — her QR'ın üstünde gösterilir. */
export function SchoolEligibilityBadge({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const toneClass =
    tone === "light"
      ? "border-accent/30 bg-accent-soft text-accent-deep"
      : "border-accent-bright/40 bg-accent-bright/10 text-white";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium ${toneClass}`}>
      <span className="font-bold tabular-nums">{schoolBirthYears}</span>
      doğumlu sporcular katılabilir
    </span>
  );
}

/** Etiket + QR + "telefonunuzla okutun" notu — koyu zeminli bölümler için. */
export function SchoolQrBlock({ size = 200 }: { size?: number }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <SchoolEligibilityBadge />
      <SchoolQrCode size={size} />
      <span className="text-xs uppercase tracking-wider text-text-muted">Telefonunuzla okutun</span>
    </div>
  );
}

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

/** Kart: doğum yılı etiketi + QR + açıklama + buton. Açık (cream) zeminler için. */
export function SchoolRegistrationCard({ title = "Online Ön Kayıt" }: { title?: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="text-center sm:text-left">
        <SchoolEligibilityBadge tone="light" />
      </div>
      <div className="mt-5 flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
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
    </div>
  );
}
