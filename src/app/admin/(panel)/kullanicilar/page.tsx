import { asc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { adminUsers } from "@/db/schema";
import { DeleteButton } from "@/components/admin/form";
import { AdminPageHeader, EditLink, ListRow, StatusBanner } from "@/components/admin/ui";
import { requireRole } from "@/lib/adminSession";
import { ROLE_LABELS, isRole } from "@/lib/permissions";
import { deleteUser } from "./actions";

export const metadata = { title: "Kullanıcılar" };

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ durum?: string }> }) {
  const me = await requireRole("admin");
  const { durum } = await searchParams;
  const users = await getDb().select().from(adminUsers).orderBy(asc(adminUsers.username));

  return (
    <>
      <AdminPageHeader
        title="Kullanıcılar"
        description="Panele giriş yapabilen kişiler. Yönetici her şeyi yönetir; Editör yalnızca Haberler ve Galeri'yi."
        action={{ href: "/admin/kullanicilar/yeni", label: "Yeni Kullanıcı" }}
      />
      <StatusBanner status={durum} />

      <ul className="space-y-3">
        <ListRow actions={<span className="text-xs text-white/40">Düzenlenemez</span>}>
          <div className="min-w-0">
            <p className="truncate font-semibold">admin</p>
            <p className="mt-0.5 text-xs text-white/50">Yerleşik yönetici · şifresi sunucu ayarındadır (ADMIN_PASSWORD)</p>
          </div>
        </ListRow>
        {users.map((user) => (
          <ListRow
            key={user.id}
            actions={
              <>
                <EditLink href={`/admin/kullanicilar/${user.id}`} />
                {me.id !== user.id && (
                  <DeleteButton action={deleteUser} id={user.id}
                    confirmText={`“${user.username}” kullanıcısını silmek istediğinize emin misiniz?`} />
                )}
              </>
            }
          >
            <div className="min-w-0">
              <p className="truncate font-semibold">
                {user.displayName} <span className="font-normal text-white/50">({user.username})</span>
              </p>
              <p className="mt-0.5 text-xs text-white/50">
                {isRole(user.role) ? ROLE_LABELS[user.role] : user.role}
                {user.isActive ? "" : " · Pasif"}
                {user.lastLoginAt
                  ? ` · Son giriş ${user.lastLoginAt.toLocaleDateString("tr-TR", { timeZone: "Europe/Istanbul" })}`
                  : " · Henüz giriş yapmadı"}
              </p>
            </div>
          </ListRow>
        ))}
      </ul>
    </>
  );
}
