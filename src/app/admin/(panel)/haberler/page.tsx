import Image from "next/image";
import { desc } from "drizzle-orm";
import { ImageOff } from "lucide-react";
import { getDb } from "@/db/client";
import { newsItems } from "@/db/schema";
import { DeleteButton } from "@/components/admin/form";
import { AdminPageHeader, EditLink, EmptyState, ListRow, StatusBanner } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/adminSession";
import { formatTurkishDate } from "@/lib/formatDate";
import { deleteNews } from "./actions";

export const metadata = { title: "Haberler" };

export default async function AdminNewsPage({ searchParams }: { searchParams: Promise<{ durum?: string }> }) {
  await requireAdmin();
  const { durum } = await searchParams;
  const items = await getDb().select().from(newsItems).orderBy(desc(newsItems.date), desc(newsItems.id));

  return (
    <>
      <AdminPageHeader
        title="Haberler"
        description={`${items.length} haber · yeniden eskiye. Anasayfada, Haberler sayfasında ve haber detayında görünür.`}
        action={{ href: "/admin/haberler/yeni", label: "Yeni Haber" }}
      />
      <StatusBanner status={durum} />

      {items.length === 0 ? (
        <EmptyState>Henüz haber yok. İlk haberi eklemek için “Yeni Haber”e tıklayın.</EmptyState>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <ListRow
              key={item.id}
              actions={
                <>
                  <EditLink href={`/admin/haberler/${item.id}`} />
                  <DeleteButton action={deleteNews} id={item.id}
                    confirmText={`“${item.title}” haberini silmek istediğinize emin misiniz?`} />
                </>
              }
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
              <div className="min-w-0">
                <p className="line-clamp-2 font-semibold sm:truncate">{item.title}</p>
                <p className="mt-0.5 text-xs text-white/50">
                  {formatTurkishDate(item.date)}
                  {item.tag ? ` · ${item.tag}` : ""}
                </p>
              </div>
            </ListRow>
          ))}
        </ul>
      )}
    </>
  );
}
