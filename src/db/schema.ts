import { pgTable, serial, integer, text, boolean, timestamp } from "drizzle-orm/pg-core";

/**
 * Faz 2 (admin panel) şeması. Şu an sorgulanmıyor — src/lib/queries.ts hâlâ
 * /src/data dosyalarını okuyor. Vercel Postgres bağlanınca:
 *   1) npm run db:generate && npm run db:migrate
 *   2) npm run db:seed   (mevcut /src/data içeriğini DB'ye aktarır)
 *   3) src/lib/queries.ts içindeki fonksiyonları bu tablolara sorgu atacak şekilde güncelle
 */

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  birthYear: integer("birth_year").notNull(),
  jerseyNumber: integer("jersey_number").notNull(),
  isPlaceholder: boolean("is_placeholder").default(false),
});

export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  description: text("description").notNull(),
  photo: text("photo").notNull(),
});

export const boardMembers = pgTable("board_members", {
  id: serial("id").primaryKey(),
  boardType: text("board_type").notNull(), // "management" | "audit"
  name: text("name").notNull(),
  role: text("role").notNull(),
  sortOrder: integer("sort_order").default(0),
});

export const lineupSlots = pgTable("lineup_slots", {
  id: serial("id").primaryKey(),
  position: text("position").notNull(),
  player: text("player").notNull(),
  number: integer("number").notNull(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
});

export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  src: text("src").notNull(),
  alt: text("alt").notNull(),
  size: text("size"),
});

export const newsItems = pgTable("news_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  /** Yayın tarihi, ISO "YYYY-MM-DD" (metin olarak sıralanabilir). Sitede "19 Eylül 2026" diye gösterilir. */
  date: text("date").notNull(),
  summary: text("summary").notNull(),
  /** "/images/..." (sitedeki hazır görsel) ya da Vercel Blob'a yüklenmiş görselin tam URL'si. */
  image: text("image"),
  tag: text("tag"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull(),
});
