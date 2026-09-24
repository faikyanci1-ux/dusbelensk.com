import Link from "next/link";
import Image from "next/image";
import { desc } from "drizzle-orm";
import { ArrowLeft, CheckCircle2, ImageOff, Pencil, Plus } from "lucide-react";
import { getDb } from "@/db/client";
import { newsItems } from "@/db/schema";
import { requireAdmin } from "@/lib/adminSession";
import { formatTurkishDate } from "@/lib/formatDate";
import { DeleteNewsButton } from "./DeleteNewsButton";

const STATUS_MESSAGES: Record<string, string> = {
  eklendi: "Haber eklendi ve sitede yayınlandı.",
  guncellendi: "Değişiklikler kaydedildi ve sitede güncellendi.",
  silindi: "Haber silindi.",
};

export const metadata = { title: "Haberler — Yönetim Paneli", robots: { index: false, follow: false } };

export default async function AdminNewsPage({ searchParams }: { searchParams: Promise<{ durum?: string }> }) {
  await requireAdmin();
  const { durum } = await searchParams;
  const statusMessage = durum ? STATUS_MESSAGES[durum] : undefined;

  const items = await getDb().select().from(newsItems).orderBy(desc(newsItems.date), desc(newsItems.id));

  return (
    <div className="min-h-screen bg-bg-main px-4 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white">
          <ArrowLeft size={14} />
          Yönetim Paneli
        </Link>

        <div className="mt-3 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl uppercase tracking-tight">Haberler</h1>
            <p className="text-sm text-white/60">{items.length} haber · yeniden eskiye</p>
          </div>
          <Link
            href="/admin/haberler/yeni"
            className="inline-flex items-center gap-2 rounded-full bg-accent-bright px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <Plus size={16} />
            Yeni Haber
          </Link>
        </div>

        {statusMessage && (
          <p
            role="status"
            className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200"
          >
            <CheckCircle2 size={16} className="shrink-0" />
            {statusMessage}
          </p>
        )}

        {items.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
            Henüz haber yok. İlk haberi eklemek için “Yeni Haber”e tıklayın.
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-white/10 bg-white/5 p-3 sm:flex-nowrap sm:pr-4"
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-white/10">
                  {item.image ? (
                    <Image src={item.image} alt="" fill sizes="96px" className="object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-white/30">
                      <ImageOff size={18} />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 font-semibold sm:truncate">{item.title}</p>
                  <p className="mt-0.5 text-xs text-white/50">
                    {formatTurkishDate(item.date)}
                    {item.tag ? ` · ${item.tag}` : ""}
                  </p>
                </div>
                <div className="flex w-full shrink-0 items-center justify-end gap-2 sm:w-auto">
                  <Link
                    href={`/admin/haberler/${item.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
                  >
                    <Pencil size={13} />
                    Düzenle
                  </Link>
                  <DeleteNewsButton id={item.id} title={item.title} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
