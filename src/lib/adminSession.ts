import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { adminUsers, siteSettings } from "@/db/schema";
import { ADMIN_SESSION_COOKIE, readSessionToken, type SessionSubject } from "@/lib/adminAuth";
import { canAccessModule, type AdminModule, type AdminRole } from "@/lib/permissions";

/** site_settings'te yerleşik yöneticinin (env) çıkış zamanının tutulduğu anahtar: bu andan önce açılmış env oturumları geçersizdir. */
const REVOKE_KEY = "admin_auth";

/** Oturum açmış panel kullanıcısı. id "env" ise ADMIN_PASSWORD ile giren yerleşik süper yönetici (düzenlenemez/silinemez). */
export type AdminUser = {
  id: SessionSubject;
  username: string;
  displayName: string;
  role: AdminRole;
  isEnv: boolean;
};

export const ENV_ADMIN_USERNAME = "admin";

const getRevokedBefore = cache(async (): Promise<number> => {
  const [row] = await getDb().select().from(siteSettings).where(eq(siteSettings.key, REVOKE_KEY));
  const value = row?.value as { revokedBefore?: number } | undefined;
  return typeof value?.revokedBefore === "number" ? value.revokedBefore : 0;
});

/**
 * issuedAt (girişi yapan sunucunun saati) ile revokedBefore (çıkışı yapan sunucunun saati) farklı
 * makinelerden gelebilir; küçük saat farkları çıkıştan hemen sonraki yeni girişi reddetmesin diye pay.
 * (Yalnızca env oturumları için; kullanıcı oturumlarında giriş anında issuedAt > sessions_valid_after garanti edilir.)
 */
const CLOCK_SKEW_MS = 2000;

/**
 * Çerezdeki oturumu çözer ve DB'den yeniden doğrular: imza/süre, çıkışla iptal, kullanıcının hâlâ var ve aktif olması.
 * Rol token'dan değil DB'den okunur; rol değişikliği/pasifleştirme bir sonraki istekte hemen etkili olur.
 * İstek başına bir kez çalışır (cache). Geçerli oturum yoksa null.
 */
export const getAdminUser = cache(async (): Promise<AdminUser | null> => {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  const claims = await readSessionToken(token);
  if (!claims) return null;

  if (claims.subject === "env") {
    if (claims.issuedAt <= (await getRevokedBefore()) - CLOCK_SKEW_MS) return null;
    return { id: "env", username: ENV_ADMIN_USERNAME, displayName: "Yönetici", role: "admin", isEnv: true };
  }

  const [row] = await getDb().select().from(adminUsers).where(eq(adminUsers.id, claims.subject));
  if (!row || !row.isActive) return null;
  if (claims.issuedAt <= row.sessionsValidAfter) return null;
  if (row.role !== "admin" && row.role !== "editor") return null;
  return { id: row.id, username: row.username, displayName: row.displayName, role: row.role, isEnv: false };
});

/** Oturumu olan herhangi bir kullanıcı; yoksa giriş sayfasına yönlendirir. */
export async function requireUser(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}

/** Yetkisiz erişimde kullanıcıyı Genel Bakış'a (nazik bir uyarıyla) yönlendirir. */
const FORBIDDEN_URL = "/admin?yetki=yok";

/** Yalnızca belirtilen rol (admin tüm yetkilere sahiptir; "admin" gerektiren yerlerde editor reddedilir). */
export async function requireRole(role: AdminRole): Promise<AdminUser> {
  const user = await requireUser();
  if (role === "admin" && user.role !== "admin") redirect(FORBIDDEN_URL);
  return user;
}

/**
 * Admin sayfalarında ve Server Action'larda modül yetkisini doğrular.
 * proxy.ts ve layout yalnızca oturumu denetler; Server Action'lar doğrudan POST ile de
 * çağrılabildiği ve layout/sayfalar paralel render olduğu için HER action ve HER sayfa kendi başında çağırmalı.
 */
export async function requireModule(module: AdminModule): Promise<AdminUser> {
  const user = await requireUser();
  if (!canAccessModule(user.role, module)) redirect(FORBIDDEN_URL);
  return user;
}

/** Bu kullanıcının tüm oturumlarını geçersiz kılar (çıkış, şifre sıfırlama, rol/pasif değişikliği). Başka kullanıcılara dokunmaz. */
export async function revokeSessions(subject: SessionSubject): Promise<void> {
  const now = Date.now();
  if (subject === "env") {
    const value = { revokedBefore: now };
    await getDb()
      .insert(siteSettings)
      .values({ key: REVOKE_KEY, value })
      .onConflictDoUpdate({ target: siteSettings.key, set: { value, updatedAt: new Date() } });
    return;
  }
  await getDb().update(adminUsers).set({ sessionsValidAfter: now }).where(eq(adminUsers.id, subject));
}
