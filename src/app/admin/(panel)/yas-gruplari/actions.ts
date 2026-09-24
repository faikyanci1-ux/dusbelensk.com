"use server";

import { and, eq, ne, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { programGroups } from "@/db/schema";
import { requireAdmin } from "@/lib/adminSession";
import { moveInOrder, nextSortOrder, parseId, readForm, revalidateSite, validate, type FormState } from "@/lib/admin/form";

const RULES = {
  code: { label: "Grup kodu", required: true, max: 12 },
  range: { label: "Yaş aralığı", required: true, max: 30 },
  title: { label: "Seviye adı", required: true, max: 40 },
  description: { label: "Açıklama", required: true, max: 300 },
  days: { label: "Antrenman günleri", required: true, max: 60 },
};

/** Grup kodları sitede anahtar olarak kullanılıyor; aynı kod iki kez girilemez (büyük/küçük harf fark etmez). */
async function codeTaken(code: string, exceptId?: number): Promise<boolean> {
  const sameCode = sql`lower(${programGroups.code}) = lower(${code})`;
  const [row] = await getDb()
    .select({ id: programGroups.id })
    .from(programGroups)
    .where(exceptId ? and(sameCode, ne(programGroups.id, exceptId)) : sameCode)
    .limit(1);
  return Boolean(row);
}

function toRow(v: Record<string, string>) {
  return { code: v.code, range: v.range, title: v.title, description: v.description, days: v.days };
}

export async function createProgramGroup(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = readForm(formData);
  const fieldErrors = validate(values, RULES);
  if (!fieldErrors.code && (await codeTaken(values.code))) fieldErrors.code = "Bu grup kodu zaten var.";
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };
  try {
    const sortOrder = await nextSortOrder(programGroups, programGroups.sortOrder);
    await getDb().insert(programGroups).values({ ...toRow(values), sortOrder });
  } catch (error) {
    console.error("[createProgramGroup]", error);
    return { error: "Kaydedilemedi. Lütfen tekrar deneyin.", values };
  }
  revalidateSite();
  redirect("/admin/yas-gruplari?durum=eklendi");
}

export async function updateProgramGroup(id: number, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  if (!parseId(id)) return { error: "Geçersiz kayıt." };
  const values = readForm(formData);
  const fieldErrors = validate(values, RULES);
  if (!fieldErrors.code && (await codeTaken(values.code, id))) fieldErrors.code = "Bu grup kodu zaten var.";
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };
  try {
    const updated = await getDb()
      .update(programGroups)
      .set(toRow(values))
      .where(eq(programGroups.id, id))
      .returning({ id: programGroups.id });
    if (updated.length === 0) return { error: "Bu grup bulunamadı; silinmiş olabilir.", values };
  } catch (error) {
    console.error("[updateProgramGroup]", error);
    return { error: "Değişiklikler kaydedilemedi. Lütfen tekrar deneyin.", values };
  }
  revalidateSite();
  redirect("/admin/yas-gruplari?durum=guncellendi");
}

export async function deleteProgramGroup(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  if (!id) return;
  await getDb().delete(programGroups).where(eq(programGroups.id, id));
  revalidateSite();
  redirect("/admin/yas-gruplari?durum=silindi");
}

export async function moveProgramGroup(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  const direction = formData.get("direction");
  if (!id || (direction !== "up" && direction !== "down")) return;
  await moveInOrder({ table: programGroups, idColumn: programGroups.id, orderColumn: programGroups.sortOrder, id, direction });
  revalidateSite();
}
