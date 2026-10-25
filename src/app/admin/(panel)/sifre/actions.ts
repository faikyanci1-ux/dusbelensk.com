"use server";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { adminUsers } from "@/db/schema";
import { ADMIN_SESSION_COOKIE, createSessionToken } from "@/lib/adminAuth";
import { requireUser } from "@/lib/adminSession";
import { checkPasswordPolicy, hashPassword, verifyPasswordHash } from "@/lib/passwordHash";
import { clearRateLimit, hitRateLimit } from "@/lib/rateLimit";
import type { FormState } from "@/lib/admin/form";

/** Mevcut şifre tahmini için: kullanıcı başına 10 deneme / 15 dakika. */
const MAX_ATTEMPTS = 10;
const WINDOW_MINUTES = 15;

/** Herkesin (editör dahil) kendi şifresini değiştirmesi. Yerleşik yönetici (env) şifresi panelden değiştirilemez. */
export async function changeOwnPassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const me = await requireUser();
  if (me.id === "env") return { error: "Yerleşik yönetici şifresi sunucu ayarından (ADMIN_PASSWORD) değiştirilir." };

  // Şifreler kırpılmaz.
  const read = (name: string) => {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  };
  const current = read("current");
  const password = read("password");
  const confirm = read("passwordConfirm");

  const fieldErrors: Record<string, string> = {};
  const policy = checkPasswordPolicy(password, me.username);
  if (policy) fieldErrors.password = policy;
  else if (password !== confirm) fieldErrors.passwordConfirm = "Şifreler aynı değil.";
  else if (password === current) fieldErrors.password = "Yeni şifre mevcut şifreden farklı olmalı.";
  if (!current) fieldErrors.current = "Mevcut şifrenizi girin.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const rateKey = `pwchange:${me.id}`;
  if (!(await hitRateLimit(rateKey, MAX_ATTEMPTS, WINDOW_MINUTES))) {
    return { error: `Çok fazla deneme. Lütfen ${WINDOW_MINUTES} dakika sonra tekrar deneyin.` };
  }

  try {
    const db = getDb();
    const [row] = await db.select({ passwordHash: adminUsers.passwordHash }).from(adminUsers).where(eq(adminUsers.id, me.id));
    if (!row || !(await verifyPasswordHash(current, row.passwordHash))) {
      return { fieldErrors: { current: "Mevcut şifre hatalı." } };
    }
    // Başka cihazlardaki oturumlar düşer; bu oturum için aşağıda yeni çerez verilir.
    const now = Date.now();
    await db.update(adminUsers).set({ passwordHash: await hashPassword(password), sessionsValidAfter: now }).where(eq(adminUsers.id, me.id));
    const token = await createSessionToken(me.id, me.role, now + 1);
    (await cookies()).set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    await clearRateLimit(rateKey);
  } catch (error) {
    console.error("[changeOwnPassword]", error);
    return { error: "Şifre değiştirilemedi. Lütfen tekrar deneyin." };
  }
  redirect("/admin/sifre?durum=sifre");
}
