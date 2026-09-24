import { config } from "dotenv";
config({ path: ".env.local" });

import { sql } from "drizzle-orm";
import { getDb } from "./client";
import * as schema from "./schema";
import { staff } from "../data/staff";
import { managementBoard, auditBoard } from "../data/board";
import { gallery } from "../data/gallery";
import { events } from "../data/events";
import { faq } from "../data/faq";
import { program } from "../data/program";
import { toIsoDate } from "../lib/formatDate";
import { defaultClubSettings } from "../lib/siteSettings";

/**
 * Tek seferlik: admin panelden yönetilecek tabloları src/data/*.ts içeriğiyle birebir eşitler
 * (teknik kadro, yönetim, galeri, etkinlikler, SSS, yaş grupları, site ayarları).
 * Haberlere dokunmaz (onlar src/db/sync-news.ts ile aktarıldı). Tek batch (transaction) içinde çalışır.
 */
function resetSequence(table: string) {
  return sql.raw(`select setval(pg_get_serial_sequence('${table}', 'id'), coalesce((select max(id) from ${table}), 1))`);
}

async function syncContent() {
  const db = getDb();

  await db.batch([
    db.delete(schema.staff),
    db.insert(schema.staff).values(
      staff.map((m, i) => ({
        name: m.name,
        role: m.role,
        description: m.description,
        photo: m.photo,
        quote: m.quote ?? null,
        sortOrder: i,
      }))
    ),
    db.execute(resetSequence("staff")),

    db.delete(schema.boardMembers),
    db.insert(schema.boardMembers).values([
      ...managementBoard.map((m, i) => ({
        boardType: "management",
        name: m.name,
        role: m.role,
        sortOrder: i,
        photo: m.photo ?? null,
        quote: m.quote ?? null,
        bio: m.bio ?? null,
        values: m.values ?? [],
        mottos: m.mottos ?? [],
      })),
      ...auditBoard.map((m, i) => ({ boardType: "audit", name: m.name, role: m.role, sortOrder: i })),
    ]),
    db.execute(resetSequence("board_members")),

    db.delete(schema.galleryItems),
    db.insert(schema.galleryItems).values(
      gallery.map((g, i) => ({ src: g.src, alt: g.alt, size: g.size ?? null, sortOrder: i }))
    ),
    db.execute(resetSequence("gallery_items")),

    db.delete(schema.events),
    db.insert(schema.events).values(
      events.map((e) => {
        const date = toIsoDate(e.date);
        if (!date) throw new Error(`Etkinlik tarihi çevrilemedi: ${e.date}`);
        return { title: e.title, date, time: null, location: e.detail, tag: e.tag };
      })
    ),
    db.execute(resetSequence("events")),

    db.delete(schema.faqItems),
    db.insert(schema.faqItems).values(faq.map((f, i) => ({ question: f.question, answer: f.answer, sortOrder: i }))),
    db.execute(resetSequence("faq_items")),

    db.delete(schema.programGroups),
    db.insert(schema.programGroups).values(
      program.map((p, i) => ({
        code: p.code,
        range: p.range,
        title: p.title,
        description: p.description,
        days: p.days,
        sortOrder: i,
      }))
    ),
    db.execute(resetSequence("program_groups")),

    db
      .insert(schema.siteSettings)
      .values({ key: "club", value: defaultClubSettings })
      .onConflictDoUpdate({ target: schema.siteSettings.key, set: { value: defaultClubSettings, updatedAt: new Date() } }),
  ]);

  const counts = await db.execute(sql`
    select 'staff' t, count(*) from staff union all
    select 'board_members', count(*) from board_members union all
    select 'gallery_items', count(*) from gallery_items union all
    select 'events', count(*) from events union all
    select 'faq_items', count(*) from faq_items union all
    select 'program_groups', count(*) from program_groups union all
    select 'site_settings', count(*) from site_settings union all
    select 'news_items', count(*) from news_items`);
  console.log(counts.rows);
}

syncContent().catch((err) => {
  console.error(err);
  process.exit(1);
});
