import Link from "next/link";
import { ArrowLeft, CheckCircle2, Plus } from "lucide-react";

/** Admin sayfa başlığı: geri linki, başlık, açıklama ve sağda isteğe bağlı "Yeni ..." butonu. */
export function AdminPageHeader({
  title,
  description,
  back,
  action,
}: {
  title: string;
  description?: string;
  back?: { href: string; label: string };
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-8">
      {back && (
        <Link href={back.href} className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white">
          <ArrowLeft size={14} />
          {back.label}
        </Link>
      )}
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl uppercase tracking-tight sm:text-3xl">{title}</h1>
          {description && <p className="mt-1 max-w-xl text-sm text-white/60">{description}</p>}
        </div>
        {action && (
          <Link
            href={action.href}
            className="inline-flex items-center gap-2 rounded-full bg-accent-bright px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <Plus size={16} />
            {action.label}
          </Link>
        )}
      </div>
    </div>
  );
}

const STATUS_MESSAGES: Record<string, string> = {
  eklendi: "Eklendi ve sitede yayınlandı.",
  guncellendi: "Değişiklikler kaydedildi ve sitede güncellendi.",
  silindi: "Silindi.",
  kaydedildi: "Ayarlar kaydedildi ve sitede güncellendi.",
};

/** ?durum=eklendi gibi işlem sonucu mesajı. */
export function StatusBanner({ status }: { status?: string }) {
  const message = status ? STATUS_MESSAGES[status] : undefined;
  if (!message) return null;
  return (
    <p
      role="status"
      className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200"
    >
      <CheckCircle2 size={16} className="shrink-0" />
      {message}
    </p>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">{children}</p>
  );
}

/** Liste satırı kabı: sol tarafta içerik, sağda butonlar; mobilde butonlar alta iner. */
export function ListRow({ children, actions }: { children: React.ReactNode; actions: React.ReactNode }) {
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-white/10 bg-white/5 p-3 sm:flex-nowrap sm:pr-4">
      <div className="flex min-w-0 flex-1 items-center gap-4">{children}</div>
      <div className="flex w-full shrink-0 items-center justify-end gap-2 sm:w-auto">{actions}</div>
    </li>
  );
}

export function EditLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
    >
      Düzenle
    </Link>
  );
}

/** Form sayfalarının alt kısmı: Kaydet + Vazgeç. */
export function FormFooter({ cancelHref, children }: { cancelHref: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
      {children}
      <Link href={cancelHref} className="rounded-full px-5 py-3 text-sm font-semibold text-white/70 hover:text-white">
        Vazgeç
      </Link>
    </div>
  );
}
