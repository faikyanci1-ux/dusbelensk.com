import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { adminUsers } from "@/db/schema";
import { AdminPageHeader } from "@/components/admin/ui";
import { requireRole } from "@/lib/adminSession";
import { resetUserPassword, updateUser } from "../actions";
import { ResetPasswordForm } from "../ResetPasswordForm";
import { UserForm } from "../UserForm";

export const metadata = { title: "Kullanıcıyı Düzenle" };

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireRole("admin");
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const [user] = await getDb().select().from(adminUsers).where(eq(adminUsers.id, id));
  if (!user) notFound();

  return (
    <>
      <AdminPageHeader title="Kullanıcıyı Düzenle" back={{ href: "/admin/kullanicilar", label: "Kullanıcılar" }} />
      <UserForm
        mode="edit"
        selfEdit={me.id === user.id}
        action={updateUser.bind(null, user.id)}
        initialValues={{ username: user.username, displayName: user.displayName, role: user.role, isActive: user.isActive }}
        submitLabel="Değişiklikleri Kaydet"
      />
      <h2 className="mt-12 mb-4 border-t border-white/10 pt-8 text-xs font-semibold uppercase tracking-wider text-white/50">Şifre sıfırla</h2>
      <ResetPasswordForm action={resetUserPassword.bind(null, user.id)} />
    </>
  );
}
