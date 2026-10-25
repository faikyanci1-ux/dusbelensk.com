import Image from "next/image";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { videoItems } from "@/db/schema";
import { DeleteButton, MoveButtons } from "@/components/admin/form";
import { AdminPageHeader, EditLink, EmptyState, StatusBanner } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/adminSession";
import { deleteVideo, moveVideo } from "./actions";

export const metadata = { title: "Videolar" };

export default async function AdminVideosPage({ searchParams }: { searchParams: Promise<{ durum?: string }> }) {
  await requireAdmin();
  const { durum } = await searchParams;
  const items = await getDb().select().from(videoItems).orderBy(asc(videoItems.sortOrder), asc(videoItems.id));

  return (
    <>
      <AdminPageHeader
        title="Videolar"
        description="Anasayfa slaytında (fotoğrafların arasında) ve Hakkımızda sayfasındaki video bölümünde görünür."
        action={{ href: "/admin/videolar/yeni", label: "Video Ekle" }}
      />
      <StatusBanner status={durum} />

      {items.length === 0 ? (
        <EmptyState>Henüz video yok.</EmptyState>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={item.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
              <MoveButtons action={moveVideo} id={item.id} isFirst={index === 0} isLast={index === items.length - 1} />
              <Link href={`/admin/videolar/${item.id}`} className="relative h-16 w-28 shrink-0 overflow-hidden rounded-xl bg-white/10">
                <Image src={item.poster} alt={item.caption} fill sizes="112px" className="object-cover" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/admin/videolar/${item.id}`} className="line-clamp-1 text-sm font-medium hover:underline">
                  {item.caption}
                </Link>
                <p className="mt-0.5 truncate text-xs text-white/50">{item.src}</p>
              </div>
              <span className="hidden sm:block">
                <EditLink href={`/admin/videolar/${item.id}`} />
              </span>
              <DeleteButton action={deleteVideo} id={item.id} compact
                confirmText={`“${item.caption}” videosunu listeden kaldırmak istediğinize emin misiniz?`} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
