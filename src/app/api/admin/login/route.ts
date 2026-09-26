import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createSessionToken, verifyPassword } from "@/lib/adminAuth";
import { clearRateLimit, clientIp, hitRateLimit, pruneRateLimits } from "@/lib/rateLimit";

/** Aynı IP'den bu süre içinde MAX_ATTEMPTS denemeden sonra giriş geçici olarak kilitlenir. */
const MAX_ATTEMPTS = 10;
const WINDOW_MINUTES = 15;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  const key = `login:${clientIp(request)}`;

  // Her deneme önce sayılır (paralel isteklerle sınır aşılamasın); başarılı girişte sayaç silinir.
  if (!(await hitRateLimit(key, MAX_ATTEMPTS, WINDOW_MINUTES))) {
    return NextResponse.json(
      { error: `Çok fazla hatalı deneme. Lütfen ${WINDOW_MINUTES} dakika sonra tekrar deneyin.` },
      { status: 429 }
    );
  }

  if (!(await verifyPassword(password))) {
    // Otomatik denemeleri yavaşlatmak için kısa bekleme.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return NextResponse.json({ error: "Şifre hatalı." }, { status: 401 });
  }

  await clearRateLimit(key);
  if (Math.random() < 0.1) await pruneRateLimits().catch((error) => console.error("[login] prune", error));

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
