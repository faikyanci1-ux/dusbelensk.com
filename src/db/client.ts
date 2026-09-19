import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

/** Faz 2'de kullanılacak. DATABASE_URL ayarlanana kadar import edilmemeli. */
export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL tanımlı değil. Vercel Postgres (Neon) bağlantısı .env.local dosyasına eklenmeli.");
  }
  const sql = neon(process.env.DATABASE_URL);
  return drizzle(sql, { schema });
}
