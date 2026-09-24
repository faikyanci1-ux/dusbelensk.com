import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { adminLoginAttempts } from "@/db/schema";
import { ADMIN_SESSION_COOKIE, createSessionToken, verifyPassword } from "@/lib/adminAuth";

/** Aynı IP'den bu süre içinde MAX_FAILURES hatalı denemeden sonra giriş geçici olarak kilitlenir. */
const MAX_FAILURES = 10;
const WINDOW_MINUTES = 15;

function clientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  const ip = clientIp(request);
  const db = getDb();

  const [attempt] = await db.select().from(adminLoginAttempts).where(eq(adminLoginAttempts.ip, ip));
  const windowOpen = attempt && Date.now() - attempt.windowStart.getTime() < WINDOW_MINUTES * 60_000;
  if (windowOpen && attempt.failures >= MAX_FAILURES) {
    return NextResponse.json(
      { error: `Çok fazla hatalı deneme. Lütfen ${WINDOW_MINUTES} dakika sonra tekrar deneyin.` },
      { status: 429 }
    );
  }

  if (!verifyPassword(password)) {
    // Pencere süresi dolduysa sayaç sıfırdan başlar.
    await db
      .insert(adminLoginAttempts)
      .values({ ip, failures: 1, windowStart: new Date() })
      .onConflictDoUpdate({
        target: adminLoginAttempts.ip,
        set: {
          failures: sql`case when ${adminLoginAttempts.windowStart} > now() - make_interval(mins => ${WINDOW_MINUTES}) then ${adminLoginAttempts.failures} + 1 else 1 end`,
          windowStart: sql`case when ${adminLoginAttempts.windowStart} > now() - make_interval(mins => ${WINDOW_MINUTES}) then ${adminLoginAttempts.windowStart} else now() end`,
        },
      });
    // Otomatik denemeleri yavaşlatmak için kısa bekleme.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return NextResponse.json({ error: "Şifre hatalı." }, { status: 401 });
  }

  if (attempt) await db.delete(adminLoginAttempts).where(eq(adminLoginAttempts.ip, ip));

  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 saat
  });
  return response;
}
