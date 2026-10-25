import { AdminPageHeader } from "@/components/admin/ui";
import { requireModule } from "@/lib/adminSession";
import { todayInTurkey } from "@/lib/siteSettings";
import { createEvent } from "../actions";
import { EventForm } from "../EventForm";

export const metadata = { title: "Yeni Etkinlik" };

export default async function NewEventPage() {
  await requireModule("etkinlikler");
  return (
    <>
      <AdminPageHeader title="Yeni Etkinlik" back={{ href: "/admin/etkinlikler", label: "Etkinlikler" }} />
      <EventForm
        action={createEvent}
        initialValues={{ title: "", date: todayInTurkey(), time: "", location: "Düşbelen SK Tesisleri", tag: "" }}
        submitLabel="Etkinliği Ekle"
      />
    </>
  );
}
