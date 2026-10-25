import { AdminPageHeader } from "@/components/admin/ui";
import { requireRole } from "@/lib/adminSession";
import { createUser } from "../actions";
import { UserForm } from "../UserForm";

export const metadata = { title: "Yeni Kullanıcı" };

export default async function NewUserPage() {
  await requireRole("admin");
  return (
    <>
      <AdminPageHeader title="Yeni Kullanıcı" back={{ href: "/admin/kullanicilar", label: "Kullanıcılar" }} />
      <UserForm
        action={createUser}
        mode="create"
        initialValues={{ username: "", displayName: "", role: "editor", isActive: true }}
        submitLabel="Kullanıcıyı Ekle"
      />
    </>
  );
}
