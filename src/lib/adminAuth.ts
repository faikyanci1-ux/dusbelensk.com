// Web Crypto API (globalThis.crypto.subtle) kullanılıyor — hem Next.js Edge
// middleware'de hem de Node.js route handler'larında çalışır (node:crypto
// Edge runtime'da desteklenmez).

export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 saat

const encoder = new TextEncoder();

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Sabit zamanlı karşılaştırma. Yalnızca eşit uzunluklu özetler (hex) için kullanılır. */
function timingSafeStringEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function sha256(value: string): Promise<string> {
  return toHex(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
}

export type SessionRole = "admin" | "editor";

/** Oturum sahibi: "env" = ADMIN_PASSWORD ile giren yerleşik süper yönetici, sayı = admin_users.id. */
export type SessionSubject = "env" | number;

export type SessionClaims = { subject: SessionSubject; role: SessionRole; issuedAt: number };

/**
 * İmza anahtarı ADMIN_SESSION_SECRET'tan türetilir. Yerleşik yönetici (env) token'ları ayrıca ADMIN_PASSWORD'a
 * bağlıdır: env şifresi değişince onun oturumları düşer. Kullanıcı token'ları şifreye bağlı değildir
 * (env şifresini değiştirmek diğer kullanıcıları atmasın); onların oturumları DB'deki sessions_valid_after ile iptal edilir.
 */
async function sign(payload: string, subject: SessionSubject): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET tanımlı değil.");
  const material = subject === "env" ? `env\u0000${secret}\u0000${process.env.ADMIN_PASSWORD ?? ""}` : `user\u0000${secret}`;
  const key = await crypto.subtle.importKey("raw", encoder.encode(material), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toHex(signature);
}

/**
 * Girilen şifreyi ADMIN_PASSWORD ile karşılaştırır (yerleşik yönetici). İkisinin de SHA-256 özeti karşılaştırılır;
 * özetler sabit uzunlukta olduğu için yanıt süresi şifrenin uzunluğunu da sızdırmaz.
 */
export async function verifyEnvPassword(input: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const [a, b] = await Promise.all([sha256(input), sha256(expected)]);
  return timingSafeStringEqual(a, b);
}

/**
 * İmzalı, süresi dolan oturum token'ı: "v2.<env|kullanıcıId>.<rol>.<issuedAtMs>.<expiryMs>.<hmac>".
 * Rol token'da yalnızca bilgi amaçlıdır; yetki kararları DB'den yeniden okunan rolle verilir (adminSession.ts).
 */
export async function createSessionToken(subject: SessionSubject, role: SessionRole, issuedAt = Date.now()): Promise<string> {
  const payload = `v2.${subject}.${role}.${issuedAt}.${issuedAt + SESSION_TTL_MS}`;
  return `${payload}.${await sign(payload, subject)}`;
}

/** İmzası ve süresi geçerliyse token'ın iddialarını, değilse null döner. */
export async function readSessionToken(token: string | undefined): Promise<SessionClaims | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 6 || parts[0] !== "v2") return null;
  const [, rawSubject, role, issued, expires, signature] = parts;
  if (role !== "admin" && role !== "editor") return null;
  let subject: SessionSubject;
  if (rawSubject === "env") subject = "env";
  else if (/^\d{1,9}$/.test(rawSubject) && Number(rawSubject) > 0) subject = Number(rawSubject);
  else return null;
  const expected = await sign(`v2.${rawSubject}.${role}.${issued}.${expires}`, subject);
  if (!timingSafeStringEqual(signature, expected)) return null;
  const issuedAt = Number(issued);
  const expiry = Number(expires);
  if (!Number.isFinite(issuedAt) || !Number.isFinite(expiry) || expiry < Date.now()) return null;
  // Yerleşik yönetici her zaman admin'dir.
  if (subject === "env" && role !== "admin") return null;
  return { subject, role, issuedAt };
}

/**
 * Yalnızca imza ve süre kontrolü (Edge'de, proxy'de kullanılır). Çıkışla/pasifleştirmeyle iptal edilen
 * oturumları ve rolü elemek için sunucuda adminSession.ts'deki getAdminUser kullanılır.
 */
export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  return (await readSessionToken(token)) !== null;
}

/**
 * Çapraz site (CSRF) koruması: tarayıcı Origin başlığı gönderiyorsa istek adresiyle aynı site olmalı.
 * (SameSite=Lax çerez zaten korur; bu ikinci katmandır. Origin yoksa — sunucudan sunucuya/curl — izin verilir,
 * çünkü o durumda zaten geçerli çerez gerekir.)
 */
export function isSameOrigin(request: { headers: Headers; nextUrl: { host: string } }): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? request.nextUrl.host;
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
