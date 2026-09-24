import { pgTable, serial, integer, text, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

/**
 * Admin panelden yönetilen içerik. Site bu tabloları src/lib/queries.ts üzerinden okur;
 * src/data/*.ts dosyaları yalnızca ilk aktarımın (src/db/sync-content.ts) kaynağıdır.
 *
 * Görsel alanları: "/images/..." (sitedeki hazır görsel) ya da Vercel Blob'a yüklenmiş
 * görselin tam URL'si. Sıralanabilir listelerde sort_order küçükten büyüğe gösterilir.
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
  /** Doluysa kişi anasayfadaki "Yönetim ve Teknik Kadro" slider'ında da görünür. */
  quote: text("quote"),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const boardMembers = pgTable("board_members", {
  id: serial("id").primaryKey(),
  boardType: text("board_type").notNull(), // "management" | "audit"
  name: text("name").notNull(),
  role: text("role").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  /** Fotoğrafı olan yönetim kurulu üyesi /yonetim sayfasında büyük kartla (başkan kartı) gösterilir. */
  photo: text("photo"),
  quote: text("quote"),
  bio: text("bio"),
  values: jsonb("values").$type<string[]>().default([]).notNull(),
  mottos: jsonb("mottos").$type<string[]>().default([]).notNull(),
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
  size: text("size"), // null | "large" | "wide"
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const newsItems = pgTable("news_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  /** Yayın tarihi, ISO "YYYY-MM-DD" (metin olarak sıralanabilir). Sitede "19 Eylül 2026" diye gösterilir. */
  date: text("date").notNull(),
  summary: text("summary").notNull(),
  image: text("image"),
  tag: text("tag"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  /** ISO "YYYY-MM-DD". Tarihi geçen etkinlikler sitede otomatik gizlenir. */
  date: text("date").notNull(),
  time: text("time"),
  location: text("location").notNull(),
  tag: text("tag").notNull(),
});

export const faqItems = pgTable("faq_items", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const programGroups = pgTable("program_groups", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  range: text("range").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  days: text("days").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

/** Tek satırlık ayar kayıtları (şimdilik yalnızca key = "club"). value şekli: src/lib/siteSettings.ts */
export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Admin girişinde deneme-yanılmayı sınırlamak için IP başına hatalı deneme sayacı (bkz. api/admin/login). */
export const adminLoginAttempts = pgTable("admin_login_attempts", {
  ip: text("ip").primaryKey(),
  failures: integer("failures").default(0).notNull(),
  windowStart: timestamp("window_start", { withTimezone: true }).defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull(),
});
