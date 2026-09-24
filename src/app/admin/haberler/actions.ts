"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { newsItems } from "@/db/schema";
import { requireAdmin } from "@/lib/adminSession";

export type NewsFormState = {
  error?: string;
  /** Hata durumunda formun yeniden doldurulması için gönderilen değerler (React formu gönderimden sonra sıfırlar). */
  values?: { title: string; date: string; summary: string; image: string; tag: string };
  fieldErrors?: Partial<Record<"title" | "date" | "summary" | "image" | "tag", string>>;
};

const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

function isAllowedImage(value: string): boolean {
  if (value.startsWith("/images/")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(BLOB_HOST_SUFFIX);
  } catch {
    return false;
  }
}

function parseNewsForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const tag = String(formData.get("tag") ?? "").trim();

  const fieldErrors: NewsFormState["fieldErrors"] = {};
  if (!title) fieldErrors.title = "Başlık zorunlu.";
  else if (title.length > 150) fieldErrors.title = "Başlık en fazla 150 karakter olabilir.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) fieldErrors.date = "Geçerli bir tarih seçin.";
  if (!summary) fieldErrors.summary = "Haber metni zorunlu.";
  else if (summary.length > 3000) fieldErrors.summary = "Haber metni en fazla 3000 karakter olabilir.";
  if (image && !isAllowedImage(image)) fieldErrors.image = "Geçersiz görsel.";
  if (tag.length > 30) fieldErrors.tag = "Etiket en fazla 30 karakter olabilir.";

  return {
    values: { title, date, summary, image: image || null, tag: tag || null },
    submitted: { title, date, summary, image, tag },
    fieldErrors,
    ok: Object.keys(fieldErrors).length === 0,
  };
}

/** Haberler anasayfa, /haberler, haber detayları ve sitemap'te görünüyor — hepsini yenile. */
function revalidateSite() {
  revalidatePath("/", "layout");
}

export async function createNews(_prev: NewsFormState, formData: FormData): Promise<NewsFormState> {
  await requireAdmin();
  const { values, submitted, fieldErrors, ok } = parseNewsForm(formData);
  if (!ok) return { fieldErrors, values: submitted };

  try {
    await getDb().insert(newsItems).values(values);
  } catch (error) {
    console.error("[createNews]", error);
    return { error: "Haber kaydedilemedi. Lütfen tekrar deneyin.", values: submitted };
  }

  revalidateSite();
  redirect("/admin/haberler?durum=eklendi");
}

export async function updateNews(id: number, _prev: NewsFormState, formData: FormData): Promise<NewsFormState> {
  await requireAdmin();
  const { values, submitted, fieldErrors, ok } = parseNewsForm(formData);
  if (!ok) return { fieldErrors, values: submitted };

  try {
    const updated = await getDb().update(newsItems).set(values).where(eq(newsItems.id, id)).returning({ id: newsItems.id });
    if (updated.length === 0) return { error: "Bu haber bulunamadı; silinmiş olabilir.", values: submitted };
  } catch (error) {
    console.error("[updateNews]", error);
    return { error: "Değişiklikler kaydedilemedi. Lütfen tekrar deneyin.", values: submitted };
  }

  revalidateSite();
  redirect("/admin/haberler?durum=guncellendi");
}

export async function deleteNews(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return;

  await getDb().delete(newsItems).where(eq(newsItems.id, id));
  revalidateSite();
  redirect("/admin/haberler?durum=silindi");
}
