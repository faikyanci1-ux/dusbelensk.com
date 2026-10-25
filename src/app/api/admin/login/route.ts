import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { adminUsers } from "@/db/schema";
import { isSameOrigin, ADMIN_SESSION_COOKIE, createSessionToken, verifyEnvPassword, type SessionRole, type SessionSubject } from "@/lib/adminAuth";
import { ENV_ADMIN_USERNAME } from "@/lib/adminSession";
import { burnPasswordCheck, verifyPasswordHash } from "@/lib/passwordHash";
import { clearRateLimit, clientIp, hitRateLimit, pruneRateLimits } from "@/lib/rateLimit";

/** Aynı IP'den ve ayrıca aynı kullanıcı adına bu süre içinde MAX_ATTEMPTS denemeden sonra giriş geçici olarak kilitlenir. */
const MAX_ATTEMPTS = 10;
const WINDOW_MINUTES = 15;

/** Hesap var/yok, şifre yanlış/hesap pasif ayrımı yapılmaz: hepsi aynı mesaj. */
const GENERIC_ERROR = "Kullanıcı adı veya şifre hatalı.";

/** Kullanıcı adı sayacının anahtarı: ham kullanıcı adı (uzun/özel karakterli olabilir) yerine özeti saklanır. */
async function usernameKey(username: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(username));
  const hex = Array.from(new Uint8Array(digest).slice(0, 16), (b) => b.toString(16).padStart(2, "0")).join("");
  return `loginu:${hex}`;
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Geçersiz istek." }, { status: 403 });
  const body = await request.json().catch(() => null);
  const username = (typeof body?.username === "string" ? body.username : "").trim().toLowerCase().slice(0, 64);
  const password = typeof body?.password === "string" ? body.password.slice(0, 200) : "";
  const ipKey = `login:${clientIp(request)}`;
  const userKey = await usernameKey(username);

  // Her deneme önce sayılır (paralel isteklerle sınır aşılamasın); başarılı girişte sayaçlar silinir.
  const [ipOk, userOk] = await Promise.all([
    hitRateLimit(ipKey, MAX_ATTEMPTS, WINDOW_MINUTES),
    hitRateLimit(userKey, MAX_ATTEMPTS, WINDOW_MINUTES),
  ]);
  if (!ipOk || !userOk) {
    return NextResponse.json(
      { error: `Çok fazla hatalı deneme. Lütfen ${WINDOW_MINUTES} dakika sonra tekrar deneyin.` },
      { status: 429 }
    );
  }

  let subject: SessionSubject | null = null;
  let role: SessionRole = "editor";
  let issuedAt = Date.now();

  if (username === ENV_ADMIN_USERNAME) {
    // Yerleşik süper yönetici: ADMIN_PASSWORD (env). Veritabanına hiç dokunmaz — DB sorunlarında bile kilitlenmeyin.
    if (await verifyEnvPassword(password)) {
      subject = "env";
      role = "admin";
    }
  } else {
    let user: typeof adminUsers.$inferSelect | undefined;
    try {
      [user] = username ? await getDb().select().from(adminUsers).where(eq(adminUsers.username, username)) : [];
    } catch (error) {
      console.error("[login] kullanıcı sorgulanamadı", error);
    }
    if (user && user.isActive) {
      if (await verifyPasswordHash(password, user.passwordHash)) {
        subject = user.id;
        role = user.role === "admin" ? "admin" : "editor";
        // Şifre sıfırlama/çıkıştan hemen sonraki giriş, sunucu saat farkı yüzünden iptal edilmiş sayılmasın.
        issuedAt = Math.max(issuedAt, user.sessionsValidAfter + 1);
        await getDb()
          .update(adminUsers)
          .set({ lastLoginAt: new Date() })
          .where(eq(adminUsers.id, user.id))
          .catch((error) => console.error("[login] son giriş yazılamadı", error));
      }
    } else {
      // Kullanıcı yok/pasif: yine de gerçek bir PBKDF2 hesapla ki süre "kullanıcı var mı" bilgisini sızdırmasın.
      await burnPasswordCheck(password);
    }
  }

  if (subject === null) {
    // Otomatik denemeleri yavaşlatmak için kısa bekleme.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  await Promise.all([clearRateLimit(ipKey), clearRateLimit(userKey)]);
  if (Math.random() < 0.1) await pruneRateLimits().catch((error) => console.error("[login] prune", error));

  const token = await createSessionToken(subject, role, issuedAt);
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
