import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

/** Faz 2'de kullanılacak. DATABASE_URL ayarlanana kadar import edilmemeli. */
export function getDb() {
  // Panele yapıştırılan değer tırnak, satır sonu ya da .env satırlarının tamamını içerebilir;
  // içinden ilk postgres adresi alınır. Aksi halde Neon adresi HTTP başlığına koyarken
  // "Headers.append" hatası verir.
  const raw = process.env.DATABASE_URL ?? "";
  const url = raw.match(/postgres(?:ql)?:\/\/[^\s"']+/)?.[0] ?? raw.trim();
  if (!url) {
    throw new Error("DATABASE_URL tanımlı değil. Vercel Postgres (Neon) bağlantısı .env.local dosyasına eklenmeli.");
  }
  const sql = neon(url);
  return drizzle(sql, { schema });
}
