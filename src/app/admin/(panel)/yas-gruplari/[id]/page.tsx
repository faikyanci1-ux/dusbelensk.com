import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { programGroups } from "@/db/schema";
import { AdminPageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/adminSession";
import { updateProgramGroup } from "../actions";
import { ProgramForm } from "../ProgramForm";

export const metadata = { title: "Grubu Düzenle" };

export default async function EditProgramGroupPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const [item] = await getDb().select().from(programGroups).where(eq(programGroups.id, id));
  if (!item) notFound();

  return (
    <>
      <AdminPageHeader title={`${item.code} — ${item.title}`} back={{ href: "/admin/yas-gruplari", label: "Yaş Grupları" }} />
      <ProgramForm
        action={updateProgramGroup.bind(null, item.id)}
        initialValues={{ code: item.code, range: item.range, title: item.title, description: item.description, days: item.days }}
        submitLabel="Değişiklikleri Kaydet"
      />
    </>
  );
}
