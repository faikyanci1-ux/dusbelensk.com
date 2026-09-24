"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { boardMembers } from "@/db/schema";
import { requireAdmin } from "@/lib/adminSession";
import {
  lines,
  moveInOrder,
  nextSortOrder,
  orNull,
  parseId,
  readForm,
  revalidateSite,
  validate,
  type FormState,
} from "@/lib/admin/form";

const RULES = {
  name: { label: "Ad soyad", required: true, max: 80 },
  role: { label: "Görev", required: true, max: 80 },
  photo: { label: "Fotoğraf", kind: "image" as const },
  quote: { label: "Söz", max: 200 },
  bio: { label: "Biyografi", max: 1500 },
};

function boardTypeOf(value: string | undefined): "management" | "audit" {
  return value === "audit" ? "audit" : "management";
}

function toRow(v: Record<string, string>) {
  return {
    boardType: boardTypeOf(v.boardType),
    name: v.name,
    role: v.role,
    photo: orNull(v.photo),
    quote: orNull(v.quote),
    bio: orNull(v.bio),
    values: lines(v.values).slice(0, 10),
    mottos: lines(v.mottos).slice(0, 10),
  };
}

export async function createBoardMember(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = readForm(formData);
  const fieldErrors = validate(values, RULES);
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };
  try {
    const row = toRow(values);
    const sortOrder = await nextSortOrder(boardMembers, boardMembers.sortOrder, eq(boardMembers.boardType, row.boardType));
    await getDb().insert(boardMembers).values({ ...row, sortOrder });
  } catch (error) {
    console.error("[createBoardMember]", error);
    return { error: "Kaydedilemedi. Lütfen tekrar deneyin.", values };
  }
  revalidateSite();
  redirect("/admin/yonetim?durum=eklendi");
}

export async function updateBoardMember(id: number, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = readForm(formData);
  const fieldErrors = validate(values, RULES);
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };
  try {
    const db = getDb();
    const row = toRow(values);
    const [current] = await db.select({ boardType: boardMembers.boardType }).from(boardMembers).where(eq(boardMembers.id, id));
    if (!current) return { error: "Bu üye bulunamadı; silinmiş olabilir.", values };
    // Kurul değiştiyse yeni kurulun sonuna taşı.
    const sortOrder =
      current.boardType === row.boardType
        ? undefined
        : await nextSortOrder(boardMembers, boardMembers.sortOrder, eq(boardMembers.boardType, row.boardType));
    await db
      .update(boardMembers)
      .set(sortOrder === undefined ? row : { ...row, sortOrder })
      .where(eq(boardMembers.id, id));
  } catch (error) {
    console.error("[updateBoardMember]", error);
    return { error: "Değişiklikler kaydedilemedi. Lütfen tekrar deneyin.", values };
  }
  revalidateSite();
  redirect("/admin/yonetim?durum=guncellendi");
}

export async function deleteBoardMember(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  if (!id) return;
  await getDb().delete(boardMembers).where(eq(boardMembers.id, id));
  revalidateSite();
  redirect("/admin/yonetim?durum=silindi");
}

export async function moveBoardMember(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  const direction = formData.get("direction");
  if (!id || (direction !== "up" && direction !== "down")) return;
  const [member] = await getDb().select({ boardType: boardMembers.boardType }).from(boardMembers).where(eq(boardMembers.id, id));
  if (!member) return;
  await moveInOrder({
    table: boardMembers,
    idColumn: boardMembers.id,
    orderColumn: boardMembers.sortOrder,
    id,
    direction,
    scope: and(eq(boardMembers.boardType, member.boardType)),
  });
  revalidateSite();
}
