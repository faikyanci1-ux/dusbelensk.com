"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { staff } from "@/db/schema";
import { requireAdmin } from "@/lib/adminSession";
import { moveInOrder, nextSortOrder, orNull, parseId, readForm, revalidateSite, validate, type FormState } from "@/lib/admin/form";

const RULES = {
  name: { label: "Ad soyad", required: true, max: 80 },
  role: { label: "Görev", required: true, max: 120 },
  description: { label: "Açıklama", required: true, max: 600 },
  photo: { label: "Fotoğraf", required: true, kind: "image" as const },
  quote: { label: "Söz", max: 160 },
};

function toRow(v: Record<string, string>) {
  return { name: v.name, role: v.role, description: v.description, photo: v.photo, quote: orNull(v.quote) };
}

export async function createStaff(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = readForm(formData);
  const fieldErrors = validate(values, RULES);
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };
  try {
    const sortOrder = await nextSortOrder(staff, staff.sortOrder);
    await getDb().insert(staff).values({ ...toRow(values), sortOrder });
  } catch (error) {
    console.error("[createStaff]", error);
    return { error: "Kaydedilemedi. Lütfen tekrar deneyin.", values };
  }
  revalidateSite();
  redirect("/admin/teknik-kadro?durum=eklendi");
}

export async function updateStaff(id: number, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = readForm(formData);
  const fieldErrors = validate(values, RULES);
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };
  try {
    const updated = await getDb().update(staff).set(toRow(values)).where(eq(staff.id, id)).returning({ id: staff.id });
    if (updated.length === 0) return { error: "Bu kişi bulunamadı; silinmiş olabilir.", values };
  } catch (error) {
    console.error("[updateStaff]", error);
    return { error: "Değişiklikler kaydedilemedi. Lütfen tekrar deneyin.", values };
  }
  revalidateSite();
  redirect("/admin/teknik-kadro?durum=guncellendi");
}

export async function deleteStaff(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  if (!id) return;
  await getDb().delete(staff).where(eq(staff.id, id));
  revalidateSite();
  redirect("/admin/teknik-kadro?durum=silindi");
}

export async function moveStaff(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  const direction = formData.get("direction");
  if (!id || (direction !== "up" && direction !== "down")) return;
  await moveInOrder({ table: staff, idColumn: staff.id, orderColumn: staff.sortOrder, id, direction });
  revalidateSite();
}
