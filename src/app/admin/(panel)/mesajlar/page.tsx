import Link from "next/link";
import { desc } from "drizzle-orm";
import { Info } from "lucide-react";
import { getDb } from "@/db/client";
import { contactMessages } from "@/db/schema";
import { DeleteButton } from "@/components/admin/form";
import { AdminPageHeader, EmptyState, StatusBanner } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/adminSession";
import { deleteMessage } from "./actions";

export const metadata = { title: "Gelen Mesajlar" };

function formatMessageDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Istanbul" }).format(date);
}

export default async function AdminMessagesPage({ searchParams }: { searchParams: Promise<{ durum?: string }> }) {
  await requireAdmin();
  const { durum } = await searchParams;
  const items = await getDb().select().from(contactMessages).orderBy(desc(contactMessages.createdAt), desc(contactMessages.id));
  const unread = items.filter((m) => !m.isRead).length;

  return (
    <>
      <AdminPageHeader
        title="Gelen Mesajlar"
        description={`Formdan gelen mesajlar. ${unread} okunmamış.`}
      />
      <p className="mb-5 flex items-start gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
        <Info size={16} className="mt-0.5 shrink-0" />
        Sitede iletişim formu şu an yayında değil; form eklenirse mesajlar burada görünür.
      </p>
      <StatusBanner status={durum} />

      {items.length === 0 ? (
        <EmptyState>Henüz mesaj yok.</EmptyState>
      ) : (
        <ul className="space-y-3">
          {items.map((m) => (
            <li key={m.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <span
                aria-label={m.isRead ? "Okundu" : "Okunmadı"}
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${m.isRead ? "bg-white/15" : "bg-accent-bright"}`}
              />
              <Link href={`/admin/mesajlar/${m.id}`} className="min-w-0 flex-1">
                <p className={`truncate text-sm ${m.isRead ? "font-medium text-white/80" : "font-semibold"}`}>
                  {m.name}
                  {m.requestType === "trial" && (
                    <span className="ml-2 rounded-full bg-accent-bright/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-accent-bright">
                      Deneme başvurusu
                    </span>
                  )}
                </p>
                <p className="mt-0.5 truncate text-xs text-white/50">
                  {formatMessageDate(m.createdAt)} · {m.message || (m.childName ? `Çocuk: ${m.childName}` : "—")}
                </p>
              </Link>
              <DeleteButton action={deleteMessage} id={m.id} compact confirmText={`${m.name} adlı kişinin mesajı silinsin mi?`} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
