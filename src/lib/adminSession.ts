import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { siteSettings } from "@/db/schema";
import { ADMIN_SESSION_COOKIE, readSessionToken } from "@/lib/adminAuth";

/** site_settings'te çıkış zamanının tutulduğu anahtar: bu andan önce açılmış oturumlar geçersizdir. */
const REVOKE_KEY = "admin_auth";

const getRevokedBefore = cache(async (): Promise<number> => {
  const [row] = await getDb().select().from(siteSettings).where(eq(siteSettings.key, REVOKE_KEY));
  const value = row?.value as { revokedBefore?: number } | undefined;
  return typeof value?.revokedBefore === "number" ? value.revokedBefore : 0;
});

/**
 * issuedAt (girişi yapan sunucunun saati) ile revokedBefore (çıkışı yapan sunucunun saati) farklı
 * makinelerden gelebilir; küçük saat farkları çıkıştan hemen sonraki yeni girişi reddetmesin diye pay.
 */
const CLOCK_SKEW_MS = 2000;

/** Token imzalı, süresi dolmamış ve çıkış yapılarak iptal edilmemişse true. */
export async function isAdminSession(token: string | undefined): Promise<boolean> {
  const session = await readSessionToken(token);
  if (!session) return false;
  return session.issuedAt > (await getRevokedBefore()) - CLOCK_SKEW_MS;
}

/**
 * Çıkışta çağrılır: o ana kadar açılmış tüm admin oturumlarını geçersiz kılar
 * (tek yönetici hesabı olduğu için "tüm cihazlardan çıkış" anlamına gelir).
 */
export async function revokeAdminSessions(): Promise<void> {
  const value = { revokedBefore: Date.now() };
  await getDb()
    .insert(siteSettings)
    .values({ key: REVOKE_KEY, value })
    .onConflictDoUpdate({ target: siteSettings.key, set: { value, updatedAt: new Date() } });
}

/**
 * Admin sayfalarında ve Server Action'larda oturumu doğrular.
 * proxy.ts sayfaları zaten korur; ama Server Action'lar doğrudan POST ile de
 * çağrılabildiği için her action'ın başında ayrıca kontrol edilmeli.
 */
export async function requireAdmin(): Promise<void> {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!(await isAdminSession(token))) {
    redirect("/admin/login");
  }
}
