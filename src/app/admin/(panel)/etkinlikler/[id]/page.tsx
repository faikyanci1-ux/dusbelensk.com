import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { events } from "@/db/schema";
import { AdminPageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/adminSession";
import { updateEvent } from "../actions";
import { EventForm } from "../EventForm";

export const metadata = { title: "Etkinliği Düzenle" };

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const [item] = await getDb().select().from(events).where(eq(events.id, id));
  if (!item) notFound();

  return (
    <>
      <AdminPageHeader title="Etkinliği Düzenle" back={{ href: "/admin/etkinlikler", label: "Etkinlikler" }} />
      <EventForm
        action={updateEvent.bind(null, item.id)}
        initialValues={{ title: item.title, date: item.date, time: item.time ?? "", location: item.location, tag: item.tag }}
        submitLabel="Değişiklikleri Kaydet"
      />
    </>
  );
}
