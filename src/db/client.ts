import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

/** Faz 2'de kullanılacak. DATABASE_URL ayarlanana kadar import edilmemeli. */
export function getDb() {
  // Panele yapıştırırken gelen boşluk/satır sonu ve .env'deki gibi tırnaklar temizlenir;
  // aksi halde Neon bağlantı adresini HTTP başlığına koyarken "Headers.append" hatası verir.
  const url = process.env.DATABASE_URL?.trim().replace(/^(["'])([\s\S]*)\1$/, "$2").trim();
  if (!url) {
    throw new Error("DATABASE_URL tanımlı değil. Vercel Postgres (Neon) bağlantısı .env.local dosyasına eklenmeli.");
  }
  const sql = neon(url);
  return drizzle(sql, { schema });
}
