import "server-only";
import { asc, eq, sql, type SQL } from "drizzle-orm";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db/client";

/**
 * Admin modüllerinin Server Action'larında ortak kullanılan yardımcılar.
 * Her action başında ayrıca requireAdmin() çağrılmalı (bkz. src/lib/adminSession.ts).
 */

/** useActionState ile form <-> action arasında taşınan durum. */
export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  /** Hata durumunda formu yeniden doldurmak için gönderilen değerler (React formu gönderimden sonra sıfırlar). */
  values?: Record<string, string>;
};

/** Formdaki tüm metin alanlarını (trim'lenmiş) döndürür. */
export function readForm(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && !key.startsWith("$ACTION")) values[key] = value.trim();
  }
  return values;
}

type Rule = {
  label: string;
  required?: boolean;
  max?: number;
  /** "date" -> YYYY-MM-DD, "int" -> tam sayı, "time" -> SS:DD, "url" -> https adresi, "image" -> izinli görsel */
  kind?: "date" | "int" | "time" | "url" | "image";
  min?: number;
  maxValue?: number;
};

const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

/** "/images/..." (sitedeki hazır görsel) veya Vercel Blob'a yüklenmiş https görsel. */
export function isAllowedImage(value: string): boolean {
  if (/^\/images\/[\w\-./]+$/.test(value) && !value.includes("..")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(BLOB_HOST_SUFFIX);
  } catch {
    return false;
  }
}

export function validate(values: Record<string, string>, rules: Record<string, Rule>): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const [name, rule] of Object.entries(rules)) {
    const value = values[name] ?? "";
    if (!value) {
      if (rule.required) errors[name] = `${rule.label} zorunlu.`;
      continue;
    }
    if (rule.max && value.length > rule.max) {
      errors[name] = `${rule.label} en fazla ${rule.max} karakter olabilir.`;
      continue;
    }
    switch (rule.kind) {
      case "date":
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value))) errors[name] = "Geçerli bir tarih seçin.";
        break;
      case "time":
        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) errors[name] = "Saat SS:DD biçiminde olmalı (ör. 15:00).";
        break;
      case "int": {
        const n = Number(value);
        if (!Number.isInteger(n)) errors[name] = `${rule.label} bir tam sayı olmalı.`;
        else if (rule.min !== undefined && n < rule.min) errors[name] = `${rule.label} en az ${rule.min} olabilir.`;
        else if (rule.maxValue !== undefined && n > rule.maxValue) errors[name] = `${rule.label} en fazla ${rule.maxValue} olabilir.`;
        break;
      }
      case "url":
        try {
          const url = new URL(value);
          if (url.protocol !== "https:") errors[name] = "Adres https:// ile başlamalı.";
        } catch {
          errors[name] = "Geçerli bir adres girin (https://…).";
        }
        break;
      case "image":
        if (!isAllowedImage(value)) errors[name] = "Geçersiz görsel.";
        break;
    }
  }
  return errors;
}

/** Çok satırlı alanı satırlara böler (boş satırlar atılır). */
export function lines(value: string | undefined): string[] {
  return (value ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Boş satırla ayrılmış paragrafları böler. */
export function paragraphs(value: string | undefined): string[] {
  return (value ?? "")
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.replace(/\s*\r?\n\s*/g, " ").trim())
    .filter(Boolean);
}

export function orNull(value: string | undefined): string | null {
  return value ? value : null;
}

/** Admin'de yapılan her değişiklik sitenin birçok sayfasını etkiliyor (anasayfa, footer, sitemap…) — hepsini yenile. */
export function revalidateSite() {
  revalidatePath("/", "layout");
}

export function parseId(value: FormDataEntryValue | null | undefined): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

/**
 * Sıralanabilir listelerde bir kaydı bir yukarı/aşağı taşır ve tüm sıra numaralarını
 * 0..n-1 olarak yeniden yazar (tek batch). scope: aynı liste içindeki kayıtlar (ör. yalnızca yönetim kurulu).
 */
export async function moveInOrder(options: {
  table: PgTable;
  idColumn: PgColumn;
  orderColumn: PgColumn;
  id: number;
  direction: "up" | "down";
  scope?: SQL;
}) {
  const { table, idColumn, orderColumn, id, direction, scope } = options;
  const db = getDb();
  const rows = (await db
    .select({ id: idColumn })
    .from(table)
    .where(scope)
    .orderBy(asc(orderColumn), asc(idColumn))) as { id: number }[];

  const ids = rows.map((r) => r.id);
  const index = ids.indexOf(id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || target < 0 || target >= ids.length) return;
  [ids[index], ids[target]] = [ids[target], ids[index]];

  const [first, ...rest] = ids.map((rowId, position) =>
    db.execute(sql`update ${table} set ${sql.identifier(orderColumn.name)} = ${position} where ${eq(idColumn, rowId)}`)
  );
  await db.batch([first, ...rest]);
}

/** Yeni eklenen kaydı listenin sonuna koymak için sıradaki sıra numarası. */
export async function nextSortOrder(table: PgTable, orderColumn: PgColumn, scope?: SQL): Promise<number> {
  const [row] = (await getDb()
    .select({ max: sql<number | null>`max(${orderColumn})` })
    .from(table)
    .where(scope)) as { max: number | null }[];
  return (row?.max ?? -1) + 1;
}
