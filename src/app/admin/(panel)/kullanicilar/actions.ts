"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { adminUsers } from "@/db/schema";
import { ENV_ADMIN_USERNAME, requireRole } from "@/lib/adminSession";
import { isRole } from "@/lib/permissions";
import { checkPasswordPolicy, hashPassword } from "@/lib/passwordHash";
import { parseId, readForm, validate, type FormState } from "@/lib/admin/form";

// Yalnızca "admin" rolü: editör bu action'lara doğrudan POST etse bile requireRole reddeder.

const RULES = {
  displayName: { label: "Ad Soyad", required: true, max: 60 },
};

const USERNAME_PATTERN = /^[a-z0-9._-]{3,32}$/;

/** Hata durumunda formu yeniden doldurmak için değerler; şifre alanları asla geri gönderilmez. */
function safeValues(values: Record<string, string>) {
  const rest = { ...values };
  delete rest.password;
  delete rest.passwordConfirm;
  return rest;
}

function readPasswords(formData: FormData) {
  // Şifreler kırpılmaz (readForm trim yapar): baş/son boşluk şifrenin parçası olabilir.
  const password = formData.get("password");
  const confirm = formData.get("passwordConfirm");
  return { password: typeof password === "string" ? password : "", confirm: typeof confirm === "string" ? confirm : "" };
}

export async function createUser(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireRole("admin");
  const values = readForm(formData);
  const { password, confirm } = readPasswords(formData);
  const username = (values.username ?? "").toLowerCase();
  const fieldErrors = validate(values, RULES);
  if (!USERNAME_PATTERN.test(username)) fieldErrors.username = "Kullanıcı adı 3-32 karakter olmalı (harf, rakam, nokta, tire, alt çizgi).";
  else if (username === ENV_ADMIN_USERNAME) fieldErrors.username = "Bu kullanıcı adı ayrılmıştır.";
  if (!isRole(values.role)) fieldErrors.role = "Geçerli bir rol seçin.";
  const policy = checkPasswordPolicy(password, username);
  if (policy) fieldErrors.password = policy;
  else if (password !== confirm) fieldErrors.passwordConfirm = "Şifreler aynı değil.";
  if (Object.keys(fieldErrors).length) return { fieldErrors, values: safeValues(values) };

  try {
    const db = getDb();
    const [existing] = await db.select({ id: adminUsers.id }).from(adminUsers).where(eq(adminUsers.username, username));
    if (existing) return { fieldErrors: { username: "Bu kullanıcı adı zaten kullanılıyor." }, values: safeValues(values) };
    await db.insert(adminUsers).values({
      username,
      displayName: values.displayName,
      role: values.role,
      passwordHash: await hashPassword(password),
    });
  } catch (error) {
    console.error("[createUser]", error);
    return { error: "Kullanıcı kaydedilemedi. Lütfen tekrar deneyin.", values: safeValues(values) };
  }
  redirect("/admin/kullanicilar?durum=eklendi");
}

export async function updateUser(id: number, _prev: FormState, formData: FormData): Promise<FormState> {
  const me = await requireRole("admin");
  if (!parseId(id)) return { error: "Geçersiz kayıt." };
  const values = readForm(formData);
  const fieldErrors = validate(values, RULES);
  if (!isRole(values.role)) fieldErrors.role = "Geçerli bir rol seçin.";
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };
  const isActive = values.isActive === "on";
  // Kendi kendini kilitlememek için: kendi rolünü düşüremez, kendini pasifleştiremez.
  if (me.id === id && (values.role !== "admin" || !isActive)) {
    return { error: "Kendi rolünüzü düşüremez ya da kendi hesabınızı pasifleştiremezsiniz.", values };
  }

  try {
    // Rol/aktiflik her istekte DB'den okunduğu için değişiklik o kullanıcının açık oturumlarında da hemen etkili olur.
    const updated = await getDb()
      .update(adminUsers)
      .set({ displayName: values.displayName, role: values.role, isActive })
      .where(eq(adminUsers.id, id))
      .returning({ id: adminUsers.id });
    if (updated.length === 0) return { error: "Bu kullanıcı bulunamadı; silinmiş olabilir.", values };
  } catch (error) {
    console.error("[updateUser]", error);
    return { error: "Değişiklikler kaydedilemedi. Lütfen tekrar deneyin.", values };
  }
  redirect("/admin/kullanicilar?durum=guncellendi");
}

export async function resetUserPassword(id: number, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireRole("admin");
  if (!parseId(id)) return { error: "Geçersiz kayıt." };
  const { password, confirm } = readPasswords(formData);
  try {
    const [user] = await getDb().select({ username: adminUsers.username }).from(adminUsers).where(eq(adminUsers.id, id));
    if (!user) return { error: "Bu kullanıcı bulunamadı; silinmiş olabilir." };
    const policy = checkPasswordPolicy(password, user.username);
    if (policy) return { fieldErrors: { password: policy } };
    if (password !== confirm) return { fieldErrors: { passwordConfirm: "Şifreler aynı değil." } };
    // sessions_valid_after güncellenir: kullanıcının açık tüm oturumları (eski şifreyle açılmış olanlar dahil) düşer.
    await getDb()
      .update(adminUsers)
      .set({ passwordHash: await hashPassword(password), sessionsValidAfter: Date.now() })
      .where(eq(adminUsers.id, id));
  } catch (error) {
    console.error("[resetUserPassword]", error);
    return { error: "Şifre güncellenemedi. Lütfen tekrar deneyin." };
  }
  redirect("/admin/kullanicilar?durum=sifre");
}

export async function deleteUser(formData: FormData): Promise<void> {
  const me = await requireRole("admin");
  const id = parseId(formData.get("id"));
  if (!id || me.id === id) return;
  await getDb().delete(adminUsers).where(eq(adminUsers.id, id));
  redirect("/admin/kullanicilar?durum=silindi");
}
