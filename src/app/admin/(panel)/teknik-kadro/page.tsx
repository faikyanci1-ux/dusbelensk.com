import Image from "next/image";
import { asc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { staff } from "@/db/schema";
import { DeleteButton, MoveButtons } from "@/components/admin/form";
import { AdminPageHeader, EditLink, EmptyState, ListRow, StatusBanner } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/adminSession";
import { deleteStaff, moveStaff } from "./actions";

export const metadata = { title: "Teknik Kadro" };

export default async function AdminStaffPage({ searchParams }: { searchParams: Promise<{ durum?: string }> }) {
  await requireAdmin();
  const { durum } = await searchParams;
  const items = await getDb().select().from(staff).orderBy(asc(staff.sortOrder), asc(staff.id));

  return (
    <>
      <AdminPageHeader
        title="Teknik Kadro"
        description="Teknik Kadro sayfasındaki kişiler; sıralama sayfadaki sırayla aynıdır."
        action={{ href: "/admin/teknik-kadro/yeni", label: "Kişi Ekle" }}
      />
      <StatusBanner status={durum} />

      {items.length === 0 ? (
        <EmptyState>Teknik kadroda kimse yok. Eklemek için “Kişi Ekle”ye tıklayın.</EmptyState>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <ListRow
              key={item.id}
              actions={
                <>
                  <EditLink href={`/admin/teknik-kadro/${item.id}`} />
                  <DeleteButton action={deleteStaff} id={item.id}
                    confirmText={`${item.name} teknik kadrodan kaldırılsın mı?`} />
                </>
              }
            >
              <MoveButtons action={moveStaff} id={item.id} isFirst={index === 0} isLast={index === items.length - 1} />
              <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-white/10">
                <Image src={item.photo} alt="" fill sizes="48px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{item.name}</p>
                <p className="line-clamp-2 text-xs text-white/50 sm:truncate">{item.role}</p>
                {item.quote && <p className="mt-0.5 text-[11px] text-accent-light">Anasayfa slaytında</p>}
              </div>
            </ListRow>
          ))}
        </ul>
      )}
    </>
  );
}
