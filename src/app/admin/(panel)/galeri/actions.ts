"use server";

import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { galleryItems } from "@/db/schema";
import { requireAdmin } from "@/lib/adminSession";
import { moveInOrder, nextSortOrder, parseId, readForm, revalidateSite, validate, type FormState } from "@/lib/admin/form";

const RULES = {
  src: { label: "Fotoğraf", required: true, kind: "image" as const },
  alt: { label: "Açıklama", required: true, max: 140 },
};

function toRow(v: Record<string, string>) {
  return { src: v.src, alt: v.alt, size: v.size === "large" || v.size === "wide" ? v.size : null };
}

export async function createGalleryItem(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = readForm(formData);
  const fieldErrors = validate(values, RULES);
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };
  try {
    const db = getDb();
    if (values.position === "end") {
      const sortOrder = await nextSortOrder(galleryItems, galleryItems.sortOrder);
      await db.insert(galleryItems).values({ ...toRow(values), sortOrder });
    } else {
      // Başa ekle: diğerlerini bir sıra kaydırıp yeni fotoğrafı 0'a koy (tek batch).
      await db.batch([
        db.update(galleryItems).set({ sortOrder: sql`${galleryItems.sortOrder} + 1` }),
        db.insert(galleryItems).values({ ...toRow(values), sortOrder: 0 }),
      ]);
    }
  } catch (error) {
    console.error("[createGalleryItem]", error);
    return { error: "Fotoğraf kaydedilemedi. Lütfen tekrar deneyin.", values };
  }
  revalidateSite();
  redirect("/admin/galeri?durum=eklendi");
}

export async function updateGalleryItem(id: number, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = readForm(formData);
  const fieldErrors = validate(values, RULES);
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };
  try {
    const updated = await getDb().update(galleryItems).set(toRow(values)).where(eq(galleryItems.id, id)).returning({ id: galleryItems.id });
    if (updated.length === 0) return { error: "Bu fotoğraf bulunamadı; silinmiş olabilir.", values };
  } catch (error) {
    console.error("[updateGalleryItem]", error);
    return { error: "Değişiklikler kaydedilemedi. Lütfen tekrar deneyin.", values };
  }
  revalidateSite();
  redirect("/admin/galeri?durum=guncellendi");
}

export async function deleteGalleryItem(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  if (!id) return;
  await getDb().delete(galleryItems).where(eq(galleryItems.id, id));
  revalidateSite();
  redirect("/admin/galeri?durum=silindi");
}

export async function moveGalleryItem(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  const direction = formData.get("direction");
  if (!id || (direction !== "up" && direction !== "down")) return;
  await moveInOrder({ table: galleryItems, idColumn: galleryItems.id, orderColumn: galleryItems.sortOrder, id, direction });
  revalidateSite();
}
