import { asc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { faqItems } from "@/db/schema";
import { DeleteButton, MoveButtons } from "@/components/admin/form";
import { AdminPageHeader, EditLink, EmptyState, ListRow, StatusBanner } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/adminSession";
import { deleteFaq, moveFaq } from "./actions";

export const metadata = { title: "SSS" };

export default async function AdminFaqPage({ searchParams }: { searchParams: Promise<{ durum?: string }> }) {
  await requireAdmin();
  const { durum } = await searchParams;
  const items = await getDb().select().from(faqItems).orderBy(asc(faqItems.sortOrder), asc(faqItems.id));

  return (
    <>
      <AdminPageHeader
        title="Sık Sorulan Sorular"
        description="SSS sayfasında ve anasayfadaki “Veli Rehberi” bölümünde görünür (anasayfada ilk sorular)."
        action={{ href: "/admin/sss/yeni", label: "Soru Ekle" }}
      />
      <StatusBanner status={durum} />

      {items.length === 0 ? (
        <EmptyState>Henüz soru yok.</EmptyState>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <ListRow
              key={item.id}
              actions={
                <>
                  <EditLink href={`/admin/sss/${item.id}`} />
                  <DeleteButton action={deleteFaq} id={item.id} confirmText={`“${item.question}” sorusu silinsin mi?`} />
                </>
              }
            >
              <MoveButtons action={moveFaq} id={item.id} isFirst={index === 0} isLast={index === items.length - 1} />
              <div className="min-w-0">
                <p className="line-clamp-2 font-semibold">{item.question}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-white/50">{item.answer}</p>
              </div>
            </ListRow>
          ))}
        </ul>
      )}
    </>
  );
}
