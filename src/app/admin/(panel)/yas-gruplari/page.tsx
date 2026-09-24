import { asc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { programGroups } from "@/db/schema";
import { DeleteButton, MoveButtons } from "@/components/admin/form";
import { AdminPageHeader, EditLink, EmptyState, ListRow, StatusBanner } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/adminSession";
import { deleteProgramGroup, moveProgramGroup } from "./actions";

export const metadata = { title: "Yaş Grupları" };

export default async function AdminProgramPage({ searchParams }: { searchParams: Promise<{ durum?: string }> }) {
  await requireAdmin();
  const { durum } = await searchParams;
  const items = await getDb().select().from(programGroups).orderBy(asc(programGroups.sortOrder), asc(programGroups.id));

  return (
    <>
      <AdminPageHeader
        title="Yaş Grupları"
        description="Anasayfadaki “Gelişim Programı” kartları. Grup sayısı istatistiklerdeki “Yaş Grubu” sayısını da belirler."
        action={{ href: "/admin/yas-gruplari/yeni", label: "Grup Ekle" }}
      />
      <StatusBanner status={durum} />

      {items.length === 0 ? (
        <EmptyState>Henüz yaş grubu yok.</EmptyState>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <ListRow
              key={item.id}
              actions={
                <>
                  <EditLink href={`/admin/yas-gruplari/${item.id}`} />
                  <DeleteButton action={deleteProgramGroup} id={item.id} confirmText={`${item.code} grubu silinsin mi?`} />
                </>
              }
            >
              <MoveButtons action={moveProgramGroup} id={item.id} isFirst={index === 0} isLast={index === items.length - 1} />
              <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-xl bg-white/10 font-display text-lg">{item.code}</span>
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {item.title} <span className="font-normal text-white/50">· {item.range}</span>
                </p>
                <p className="truncate text-xs text-white/50">{item.days}</p>
              </div>
            </ListRow>
          ))}
        </ul>
      )}
    </>
  );
}
