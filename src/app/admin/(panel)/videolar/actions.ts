"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { videoItems } from "@/db/schema";
import { requireModule } from "@/lib/adminSession";
import { moveInOrder, nextSortOrder, parseId, readForm, revalidateSite, validate, type FormState } from "@/lib/admin/form";

const RULES = {
  src: { label: "Video", required: true, max: 500 },
  caption: { label: "Başlık", required: true, max: 140 },
  poster: { label: "Kapak fotoğrafı", required: true, kind: "image" as const },
};

/** Sitedeki "/videos/x.mp4" dosyası ya da https:// ile başlayan .mp4/.webm/.mov adresi. */
function isAllowedVideo(value: string): boolean {
  if (/^\/videos\/[\w\-.]+\.(mp4|webm|mov)$/i.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && /\.(mp4|webm|mov)$/i.test(url.pathname);
  } catch {
    return false;
  }
}

function check(values: Record<string, string>) {
  const fieldErrors = validate(values, RULES);
  if (!fieldErrors.src && !isAllowedVideo(values.src)) {
    fieldErrors.src = "Geçerli bir video seçin (/videos/… dosyası ya da https:// ile başlayan .mp4 adresi).";
  }
  return fieldErrors;
}

export async function createVideo(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireModule("videolar");
  const values = readForm(formData);
  const fieldErrors = check(values);
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };
  try {
    const sortOrder = await nextSortOrder(videoItems, videoItems.sortOrder);
    await getDb().insert(videoItems).values({ src: values.src, caption: values.caption, poster: values.poster, sortOrder });
  } catch (error) {
    console.error("[createVideo]", error);
    return { error: "Kaydedilemedi. Lütfen tekrar deneyin.", values };
  }
  revalidateSite();
  redirect("/admin/videolar?durum=eklendi");
}

export async function updateVideo(id: number, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireModule("videolar");
  if (!parseId(id)) return { error: "Geçersiz kayıt." };
  const values = readForm(formData);
  const fieldErrors = check(values);
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };
  try {
    const updated = await getDb()
      .update(videoItems)
      .set({ src: values.src, caption: values.caption, poster: values.poster })
      .where(eq(videoItems.id, id))
      .returning({ id: videoItems.id });
    if (updated.length === 0) return { error: "Bu video bulunamadı; silinmiş olabilir.", values };
  } catch (error) {
    console.error("[updateVideo]", error);
    return { error: "Değişiklikler kaydedilemedi. Lütfen tekrar deneyin.", values };
  }
  revalidateSite();
  redirect("/admin/videolar?durum=guncellendi");
}

export async function deleteVideo(formData: FormData): Promise<void> {
  await requireModule("videolar");
  const id = parseId(formData.get("id"));
  if (!id) return;
  await getDb().delete(videoItems).where(eq(videoItems.id, id));
  revalidateSite();
  redirect("/admin/videolar?durum=silindi");
}

export async function moveVideo(formData: FormData): Promise<void> {
  await requireModule("videolar");
  const id = parseId(formData.get("id"));
  const direction = formData.get("direction");
  if (!id || (direction !== "up" && direction !== "down")) return;
  await moveInOrder({ table: videoItems, idColumn: videoItems.id, orderColumn: videoItems.sortOrder, id, direction });
  revalidateSite();
}
