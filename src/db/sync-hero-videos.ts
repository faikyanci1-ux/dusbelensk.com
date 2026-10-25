import { config } from "dotenv";
config({ path: ".env.local" });

import { count } from "drizzle-orm";
import { getDb } from "./client";
import { heroSlides, videoItems } from "./schema";
import { heroImageSlides } from "../data/heroSlides";
import { videos } from "../data/videos";

/** Tek seferlik: hero slider ve video tablolarını src/data içeriğiyle doldurur (tablo boş değilse dokunmaz). */
async function main() {
  const db = getDb();
  const [{ n: heroCount }] = await db.select({ n: count() }).from(heroSlides);
  if (heroCount === 0) {
    await db.insert(heroSlides).values(
      heroImageSlides.map((s, i) => ({ src: s.src, caption: s.caption, focus: s.focus ?? null, sortOrder: i }))
    );
    console.log(`hero_slides: ${heroImageSlides.length} kayıt eklendi`);
  } else console.log(`hero_slides dolu (${heroCount}), atlandı`);

  const [{ n: videoCount }] = await db.select({ n: count() }).from(videoItems);
  if (videoCount === 0) {
    await db.insert(videoItems).values(videos.map((v, i) => ({ src: v.src, caption: v.caption, poster: v.poster, sortOrder: i })));
    console.log(`video_items: ${videos.length} kayıt eklendi`);
  } else console.log(`video_items dolu (${videoCount}), atlandı`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
