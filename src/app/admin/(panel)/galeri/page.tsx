import Image from "next/image";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { galleryItems } from "@/db/schema";
import { DeleteButton, MoveButtons } from "@/components/admin/form";
import { AdminPageHeader, EditLink, EmptyState, StatusBanner } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/adminSession";
import { deleteGalleryItem, moveGalleryItem } from "./actions";

export const metadata = { title: "Galeri" };

const SIZE_LABELS: Record<string, string> = { large: "Büyük", wide: "Geniş" };

export default async function AdminGalleryPage({ searchParams }: { searchParams: Promise<{ durum?: string }> }) {
  await requireAdmin();
  const { durum } = await searchParams;
  const items = await getDb().select().from(galleryItems).orderBy(asc(galleryItems.sortOrder), asc(galleryItems.id));

  return (
    <>
      <AdminPageHeader
        title="Galeri"
        description={`${items.length} fotoğraf. Sıralama Galeri sayfasındaki sırayla aynıdır; ilk 6 fotoğraf anasayfa slaytında da görünür.`}
        action={{ href: "/admin/galeri/yeni", label: "Fotoğraf Ekle" }}
      />
      <StatusBanner status={durum} />

      {items.length === 0 ? (
        <EmptyState>Galeride fotoğraf yok. Eklemek için “Fotoğraf Ekle”ye tıklayın.</EmptyState>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item, index) => (
            <li key={item.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
              <MoveButtons action={moveGalleryItem} id={item.id} isFirst={index === 0} isLast={index === items.length - 1} />
              <Link href={`/admin/galeri/${item.id}`} className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-white/10">
                <Image src={item.src} alt={item.alt} fill sizes="112px" className="object-cover" />
                {index < 6 && (
                  <span className="absolute left-1 top-1 rounded-full bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold">Slayt</span>
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/admin/galeri/${item.id}`} className="line-clamp-2 text-sm font-medium hover:underline">
                  {item.alt}
                </Link>
                <p className="mt-0.5 text-xs text-white/50">
                  #{index + 1}
                  {item.size ? ` · ${SIZE_LABELS[item.size]}` : ""}
                </p>
              </div>
              {/* Mobilde yer yok: fotoğraf ve açıklama da düzenlemeye götürür. */}
              <span className="hidden sm:block">
                <EditLink href={`/admin/galeri/${item.id}`} />
              </span>
              <DeleteButton action={deleteGalleryItem} id={item.id} compact
                confirmText={`“${item.alt}” fotoğrafını galeriden kaldırmak istediğinize emin misiniz?`} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
