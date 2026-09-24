"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { faqItems } from "@/db/schema";
import { requireAdmin } from "@/lib/adminSession";
import { moveInOrder, nextSortOrder, parseId, readForm, revalidateSite, validate, type FormState } from "@/lib/admin/form";

const RULES = {
  question: { label: "Soru", required: true, max: 200 },
  answer: { label: "Cevap", required: true, max: 1500 },
};

export async function createFaq(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = readForm(formData);
  const fieldErrors = validate(values, RULES);
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };
  try {
    const sortOrder = await nextSortOrder(faqItems, faqItems.sortOrder);
    await getDb().insert(faqItems).values({ question: values.question, answer: values.answer, sortOrder });
  } catch (error) {
    console.error("[createFaq]", error);
    return { error: "Kaydedilemedi. Lütfen tekrar deneyin.", values };
  }
  revalidateSite();
  redirect("/admin/sss?durum=eklendi");
}

export async function updateFaq(id: number, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = readForm(formData);
  const fieldErrors = validate(values, RULES);
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };
  try {
    const updated = await getDb()
      .update(faqItems)
      .set({ question: values.question, answer: values.answer })
      .where(eq(faqItems.id, id))
      .returning({ id: faqItems.id });
    if (updated.length === 0) return { error: "Bu soru bulunamadı; silinmiş olabilir.", values };
  } catch (error) {
    console.error("[updateFaq]", error);
    return { error: "Değişiklikler kaydedilemedi. Lütfen tekrar deneyin.", values };
  }
  revalidateSite();
  redirect("/admin/sss?durum=guncellendi");
}

export async function deleteFaq(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  if (!id) return;
  await getDb().delete(faqItems).where(eq(faqItems.id, id));
  revalidateSite();
  redirect("/admin/sss?durum=silindi");
}

export async function moveFaq(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  const direction = formData.get("direction");
  if (!id || (direction !== "up" && direction !== "down")) return;
  await moveInOrder({ table: faqItems, idColumn: faqItems.id, orderColumn: faqItems.sortOrder, id, direction });
  revalidateSite();
}
