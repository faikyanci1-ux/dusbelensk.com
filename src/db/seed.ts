import "dotenv/config";
import { getDb } from "./client";
import * as schema from "./schema";
import { players } from "../data/players";
import { staff } from "../data/staff";
import { managementBoard, auditBoard } from "../data/board";
import { lineup } from "../data/lineup";
import { gallery } from "../data/gallery";
import { news } from "../data/news";

async function seed() {
  const db = getDb();

  console.log("Seeding players...");
  await db.insert(schema.players).values(
    players.map((p) => ({
      name: p.name,
      position: p.position,
      birthYear: p.birthYear,
      jerseyNumber: p.jerseyNumber,
      isPlaceholder: p.isPlaceholder ?? false,
    }))
  );

  console.log("Seeding staff...");
  await db.insert(schema.staff).values(staff.map(({ id: _id, ...rest }) => rest));

  console.log("Seeding board members...");
  await db.insert(schema.boardMembers).values([
    ...managementBoard.map((m, i) => ({ boardType: "management", name: m.name, role: m.role, sortOrder: i })),
    ...auditBoard.map((m, i) => ({ boardType: "audit", name: m.name, role: m.role, sortOrder: i })),
  ]);

  console.log("Seeding lineup...");
  await db.insert(schema.lineupSlots).values(lineup);

  console.log("Seeding gallery...");
  await db.insert(schema.galleryItems).values(gallery.map(({ id: _id, ...rest }) => rest));

  if (news.length > 0) {
    console.log("Seeding news...");
    await db.insert(schema.newsItems).values(news.map(({ id: _id, ...rest }) => rest));
  }

  console.log("Seed tamamlandı.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
