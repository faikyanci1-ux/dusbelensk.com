"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { newsItems } from "@/db/schema";
import { requireAdmin } from "@/lib/adminSession";
import { orNull, parseId, readForm, revalidateSite, validate, type FormState } from "@/lib/admin/form";

const RULES = {
  title: { label: "Başlık", required: true, max: 150 },
  date: { label: "Tarih", required: true, kind: "date" as const },
  summary: { label: "Haber metni", required: true, max: 3000 },
  image: { label: "Görsel", kind: "image" as const },
  tag: { label: "Etiket", max: 30 },
};

function toRow(v: Record<string, string>) {
  return { title: v.title, date: v.date, summary: v.summary, image: orNull(v.image), tag: orNull(v.tag) };
}

export async function createNews(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = readForm(formData);
  const fieldErrors = validate(values, RULES);
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };

  try {
    await getDb().insert(newsItems).values(toRow(values));
  } catch (error) {
    console.error("[createNews]", error);
    return { error: "Haber kaydedilemedi. Lütfen tekrar deneyin.", values };
  }
  revalidateSite();
  redirect("/admin/haberler?durum=eklendi");
}

export async function updateNews(id: number, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = readForm(formData);
  const fieldErrors = validate(values, RULES);
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };

  try {
    const updated = await getDb().update(newsItems).set(toRow(values)).where(eq(newsItems.id, id)).returning({ id: newsItems.id });
    if (updated.length === 0) return { error: "Bu haber bulunamadı; silinmiş olabilir.", values };
  } catch (error) {
    console.error("[updateNews]", error);
    return { error: "Değişiklikler kaydedilemedi. Lütfen tekrar deneyin.", values };
  }
  revalidateSite();
  redirect("/admin/haberler?durum=guncellendi");
}

export async function deleteNews(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  if (!id) return;
  await getDb().delete(newsItems).where(eq(newsItems.id, id));
  revalidateSite();
  redirect("/admin/haberler?durum=silindi");
}
