import { asc, desc, gte, lt } from "drizzle-orm";
import { getDb } from "@/db/client";
import { events } from "@/db/schema";
import { DeleteButton } from "@/components/admin/form";
import { AdminPageHeader, EditLink, EmptyState, ListRow, StatusBanner } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/adminSession";
import { formatTurkishDate } from "@/lib/formatDate";
import { todayInTurkey } from "@/lib/siteSettings";
import { deleteEvent } from "./actions";

export const metadata = { title: "Etkinlikler" };

type EventRow = typeof events.$inferSelect;

function EventList({ items, past }: { items: EventRow[]; past?: boolean }) {
  return (
    <ul className={`space-y-3 ${past ? "opacity-60" : ""}`}>
      {items.map((item) => (
        <ListRow
          key={item.id}
          actions={
            <>
              <EditLink href={`/admin/etkinlikler/${item.id}`} />
              <DeleteButton action={deleteEvent} id={item.id}
                confirmText={`“${item.title}” etkinliğini silmek istediğinize emin misiniz?`} />
            </>
          }
        >
          <div className="flex w-16 shrink-0 flex-col items-center rounded-xl bg-white/10 py-2">
            <span className="font-display text-xl leading-none">{item.date.slice(8, 10)}</span>
            <span className="mt-1 text-[10px] uppercase tracking-wide text-white/60">
              {formatTurkishDate(item.date).split(" ")[1]?.slice(0, 3)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="line-clamp-2 font-semibold sm:truncate">{item.title}</p>
            <p className="mt-0.5 text-xs text-white/50">
              {formatTurkishDate(item.date)}
              {item.time ? ` · ${item.time}` : ""} · {item.location} · {item.tag}
            </p>
          </div>
        </ListRow>
      ))}
    </ul>
  );
}

export default async function AdminEventsPage({ searchParams }: { searchParams: Promise<{ durum?: string }> }) {
  await requireAdmin();
  const { durum } = await searchParams;
  const today = todayInTurkey();
  const db = getDb();
  const [upcoming, past] = await Promise.all([
    db.select().from(events).where(gte(events.date, today)).orderBy(asc(events.date), asc(events.id)),
    db.select().from(events).where(lt(events.date, today)).orderBy(desc(events.date), desc(events.id)).limit(20),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Etkinlikler"
        description="Maç, turnuva ve etkinlikler anasayfadaki “Yaklaşan Etkinlikler” bölümünde görünür. Tarihi geçenler sitede otomatik gizlenir."
        action={{ href: "/admin/etkinlikler/yeni", label: "Yeni Etkinlik" }}
      />
      <StatusBanner status={durum} />

      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">Yaklaşan ({upcoming.length})</h2>
      {upcoming.length === 0 ? (
        <EmptyState>Yaklaşan etkinlik yok — anasayfadaki bölüm gizli. Eklemek için “Yeni Etkinlik”e tıklayın.</EmptyState>
      ) : (
        <EventList items={upcoming} />
      )}

      {past.length > 0 && (
        <>
          <h2 className="mt-10 mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">
            Geçmiş (sitede görünmez)
          </h2>
          <EventList items={past} past />
        </>
      )}
    </>
  );
}
