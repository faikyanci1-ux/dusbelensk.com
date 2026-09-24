import { config } from "dotenv";
config({ path: ".env.local" });

import { sql } from "drizzle-orm";
import { getDb } from "./client";
import * as schema from "./schema";
import { news } from "../data/news";
import { toIsoDate } from "../lib/formatDate";

/**
 * Tek seferlik: news_items tablosunu src/data/news.ts içeriğiyle birebir eşitler.
 * Haberlerin id'leri korunur (sitedeki /haberler/<id> linkleri değişmesin diye) ve
 * tarih "19 Eylül 2026" -> "2026-09-19" biçimine çevrilir. Tek bir batch (transaction) içinde çalışır.
 */
async function syncNews() {
  const db = getDb();

  const rows = news.map((item) => {
    const date = toIsoDate(item.date);
    if (!date) throw new Error(`Tarih çevrilemedi: ${item.date}`);
    return { id: item.id, title: item.title, date, summary: item.summary, image: item.image ?? null, tag: item.tag ?? null };
  });

  await db.batch([
    db.delete(schema.newsItems),
    db.insert(schema.newsItems).values(rows),
    db.execute(sql`select setval(pg_get_serial_sequence('news_items', 'id'), (select max(id) from news_items))`),
  ]);

  const result = await db.select().from(schema.newsItems).orderBy(schema.newsItems.id);
  for (const row of result) console.log(row.id, row.date, row.tag, row.title);
}

syncNews().catch((err) => {
  console.error(err);
  process.exit(1);
});
