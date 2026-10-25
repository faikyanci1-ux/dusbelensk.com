"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { contactMessages } from "@/db/schema";
import { requireModule } from "@/lib/adminSession";
import { parseId } from "@/lib/admin/form";

export async function deleteMessage(formData: FormData): Promise<void> {
  await requireModule("mesajlar");
  const id = parseId(formData.get("id"));
  if (!id) return;
  await getDb().delete(contactMessages).where(eq(contactMessages.id, id));
  revalidatePath("/admin", "layout");
  redirect("/admin/mesajlar?durum=silindi");
}

/** Okundu / okunmadı durumunu değiştirir. read=1 -> okundu. */
export async function setMessageRead(formData: FormData): Promise<void> {
  await requireModule("mesajlar");
  const id = parseId(formData.get("id"));
  if (!id) return;
  await getDb()
    .update(contactMessages)
    .set({ isRead: formData.get("read") === "1" })
    .where(eq(contactMessages.id, id));
  revalidatePath("/admin", "layout");
  redirect("/admin/mesajlar");
}
