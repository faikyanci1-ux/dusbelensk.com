"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { heroSlides } from "@/db/schema";
import { requireAdmin } from "@/lib/adminSession";
import { moveInOrder, nextSortOrder, parseId, readForm, revalidateSite, validate, type FormState } from "@/lib/admin/form";

const RULES = {
  src: { label: "Fotoğraf", required: true, kind: "image" as const },
  caption: { label: "Açıklama", required: true, max: 140 },
  focusX: { label: "Yatay odak", kind: "int" as const, min: 0, maxValue: 100 },
  focusY: { label: "Dikey odak", kind: "int" as const, min: 0, maxValue: 100 },
};

/** Odak 50/50 (ortalama) ise kaydedilmez; slider varsayılan ortalamayı kullanır. */
function toRow(v: Record<string, string>) {
  const x = String(Number(v.focusX || "50"));
  const y = String(Number(v.focusY || "50"));
  return { src: v.src, caption: v.caption, focus: x === "50" && y === "50" ? null : `${x}% ${y}%` };
}

export async function createHeroSlide(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = readForm(formData);
  const fieldErrors = validate(values, RULES);
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };
  try {
    const sortOrder = await nextSortOrder(heroSlides, heroSlides.sortOrder);
    await getDb().insert(heroSlides).values({ ...toRow(values), sortOrder });
  } catch (error) {
    console.error("[createHeroSlide]", error);
    return { error: "Kaydedilemedi. Lütfen tekrar deneyin.", values };
  }
  revalidateSite();
  redirect("/admin/hero?durum=eklendi");
}

export async function updateHeroSlide(id: number, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  if (!parseId(id)) return { error: "Geçersiz kayıt." };
  const values = readForm(formData);
  const fieldErrors = validate(values, RULES);
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };
  try {
    const updated = await getDb().update(heroSlides).set(toRow(values)).where(eq(heroSlides.id, id)).returning({ id: heroSlides.id });
    if (updated.length === 0) return { error: "Bu slayt bulunamadı; silinmiş olabilir.", values };
  } catch (error) {
    console.error("[updateHeroSlide]", error);
    return { error: "Değişiklikler kaydedilemedi. Lütfen tekrar deneyin.", values };
  }
  revalidateSite();
  redirect("/admin/hero?durum=guncellendi");
}

export async function deleteHeroSlide(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  if (!id) return;
  await getDb().delete(heroSlides).where(eq(heroSlides.id, id));
  revalidateSite();
  redirect("/admin/hero?durum=silindi");
}

export async function moveHeroSlide(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  const direction = formData.get("direction");
  if (!id || (direction !== "up" && direction !== "down")) return;
  await moveInOrder({ table: heroSlides, idColumn: heroSlides.id, orderColumn: heroSlides.sortOrder, id, direction });
  revalidateSite();
}
