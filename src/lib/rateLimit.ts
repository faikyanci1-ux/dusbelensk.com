import "server-only";
import { eq, lt, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { adminLoginAttempts } from "@/db/schema";

/**
 * Anahtar başına (ör. "login:<ip>", "contact:<ip>") sabit pencereli istek sınırı.
 * admin_login_attempts tablosu genel sayaç olarak kullanılır (ip kolonu = anahtar).
 *
 * Sayaç kontrol edilmeden ÖNCE artırılır ve karar dönen değerden verilir: böylece aynı anda
 * gönderilen paralel istekler de tek tek sayılır (önce oku sonra artır yarışı olmaz).
 */
const table = adminLoginAttempts;

export function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

/** İsteği sayar; pencere içinde `max`'ı aştıysa false döner. */
export async function hitRateLimit(key: string, max: number, windowMinutes: number): Promise<boolean> {
  const inWindow = sql`${table.windowStart} > now() - make_interval(mins => ${windowMinutes})`;
  const [row] = await getDb()
    .insert(table)
    .values({ ip: key, failures: 1, windowStart: new Date() })
    .onConflictDoUpdate({
      target: table.ip,
      set: {
        failures: sql`case when ${inWindow} then ${table.failures} + 1 else 1 end`,
        windowStart: sql`case when ${inWindow} then ${table.windowStart} else now() end`,
      },
    })
    .returning({ count: table.failures });
  return row.count <= max;
}

export async function clearRateLimit(key: string): Promise<void> {
  await getDb().delete(table).where(eq(table.ip, key));
}

/** Tablo büyümesin: bir günden eski sayaçları siler. */
export async function pruneRateLimits(): Promise<void> {
  await getDb().delete(table).where(lt(table.windowStart, sql`now() - interval '1 day'`));
}
