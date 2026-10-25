import Image from "next/image";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { heroSlides } from "@/db/schema";
import { DeleteButton, MoveButtons } from "@/components/admin/form";
import { AdminPageHeader, EditLink, EmptyState, StatusBanner } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/adminSession";
import { deleteHeroSlide, moveHeroSlide } from "./actions";

export const metadata = { title: "Anasayfa Slaytı" };

export default async function AdminHeroPage({ searchParams }: { searchParams: Promise<{ durum?: string }> }) {
  await requireAdmin();
  const { durum } = await searchParams;
  const items = await getDb().select().from(heroSlides).orderBy(asc(heroSlides.sortOrder), asc(heroSlides.id));

  return (
    <>
      <AdminPageHeader
        title="Anasayfa Slaytı"
        description={`${items.length} fotoğraf. Anasayfanın en üstündeki büyük slayt; sıra buradaki sıradır, her iki fotoğraftan sonra bir video gelir (Videolar bölümü). Yalnızca yatay ve yüksek çözünürlüklü fotoğraflar kullanın.`}
        action={{ href: "/admin/hero/yeni", label: "Slayt Ekle" }}
      />
      <StatusBanner status={durum} />

      {items.length === 0 ? (
        <EmptyState>Slaytta fotoğraf yok. Anasayfada yalnızca videolar görünür.</EmptyState>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item, index) => (
            <li key={item.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
              <MoveButtons action={moveHeroSlide} id={item.id} isFirst={index === 0} isLast={index === items.length - 1} />
              <Link href={`/admin/hero/${item.id}`} className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-white/10">
                <Image src={item.src} alt={item.caption} fill sizes="128px" className="object-cover" style={{ objectPosition: item.focus ?? "50% 50%" }} />
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/admin/hero/${item.id}`} className="line-clamp-2 text-sm font-medium hover:underline">
                  {item.caption}
                </Link>
                <p className="mt-0.5 text-xs text-white/50">#{index + 1}</p>
              </div>
              <span className="hidden sm:block">
                <EditLink href={`/admin/hero/${item.id}`} />
              </span>
              <DeleteButton action={deleteHeroSlide} id={item.id} compact
                confirmText={`“${item.caption}” slaytını kaldırmak istediğinize emin misiniz?`} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
