"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { events } from "@/db/schema";
import { requireAdmin } from "@/lib/adminSession";
import { orNull, parseId, readForm, revalidateSite, validate, type FormState } from "@/lib/admin/form";

const RULES = {
  title: { label: "Başlık", required: true, max: 120 },
  date: { label: "Tarih", required: true, kind: "date" as const },
  time: { label: "Saat", kind: "time" as const },
  location: { label: "Yer", required: true, max: 120 },
  tag: { label: "Tür", required: true, max: 40 },
};

function toRow(v: Record<string, string>) {
  return { title: v.title, date: v.date, time: orNull(v.time), location: v.location, tag: v.tag };
}

export async function createEvent(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = readForm(formData);
  const fieldErrors = validate(values, RULES);
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };
  try {
    await getDb().insert(events).values(toRow(values));
  } catch (error) {
    console.error("[createEvent]", error);
    return { error: "Etkinlik kaydedilemedi. Lütfen tekrar deneyin.", values };
  }
  revalidateSite();
  redirect("/admin/etkinlikler?durum=eklendi");
}

export async function updateEvent(id: number, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = readForm(formData);
  const fieldErrors = validate(values, RULES);
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };
  try {
    const updated = await getDb().update(events).set(toRow(values)).where(eq(events.id, id)).returning({ id: events.id });
    if (updated.length === 0) return { error: "Bu etkinlik bulunamadı; silinmiş olabilir.", values };
  } catch (error) {
    console.error("[updateEvent]", error);
    return { error: "Değişiklikler kaydedilemedi. Lütfen tekrar deneyin.", values };
  }
  revalidateSite();
  redirect("/admin/etkinlikler?durum=guncellendi");
}

export async function deleteEvent(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  if (!id) return;
  await getDb().delete(events).where(eq(events.id, id));
  revalidateSite();
  redirect("/admin/etkinlikler?durum=silindi");
}
