import { AdminPageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/adminSession";
import { createProgramGroup } from "../actions";
import { ProgramForm } from "../ProgramForm";

export const metadata = { title: "Grup Ekle" };

export default async function NewProgramGroupPage() {
  await requireAdmin();
  return (
    <>
      <AdminPageHeader title="Yaş Grubu Ekle" back={{ href: "/admin/yas-gruplari", label: "Yaş Grupları" }} />
      <ProgramForm
        action={createProgramGroup}
        initialValues={{ code: "", range: "", title: "", description: "", days: "" }}
        submitLabel="Grubu Ekle"
      />
    </>
  );
}
