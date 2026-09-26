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

/**
 * İmza anahtarı ADMIN_SESSION_SECRET + ADMIN_PASSWORD'dan türetilir: şifre değişince
 * mevcut tüm oturumlar da geçersiz olur.
 */
async function sign(payload: string): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET tanımlı değil.");
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(`${secret}\u0000${process.env.ADMIN_PASSWORD ?? ""}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toHex(signature);
}

/**
 * Girilen şifreyi ADMIN_PASSWORD ile karşılaştırır. İkisinin de SHA-256 özeti karşılaştırılır;
 * özetler sabit uzunlukta olduğu için yanıt süresi şifrenin uzunluğunu da sızdırmaz.
 */
export async function verifyPassword(input: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const [a, b] = await Promise.all([sha256(input), sha256(expected)]);
  return timingSafeStringEqual(a, b);
}

/** İmzalı, süresi dolan bir oturum token'ı üretir: "<issuedAtMs>.<expiryMs>.<hmac>" */
export async function createSessionToken(): Promise<string> {
  const issuedAt = Date.now();
  const payload = `${issuedAt}.${issuedAt + SESSION_TTL_MS}`;
  return `${payload}.${await sign(payload)}`;
}

/** İmzası ve süresi geçerliyse token'ın oluşturulma zamanını, değilse null döner. */
export async function readSessionToken(token: string | undefined): Promise<{ issuedAt: number } | null> {
  if (!token) return null;
  const [issued, expires, signature] = token.split(".");
  if (!issued || !expires || !signature) return null;
  const expected = await sign(`${issued}.${expires}`);
  if (!timingSafeStringEqual(signature, expected)) return null;
  const issuedAt = Number(issued);
  const expiry = Number(expires);
  if (!Number.isFinite(issuedAt) || !Number.isFinite(expiry) || expiry < Date.now()) return null;
  return { issuedAt };
}

/**
 * Yalnızca imza ve süre kontrolü (Edge'de, proxy'de kullanılır). Çıkış yapılınca iptal edilen
 * oturumları da eleyen tam kontrol için sunucuda adminSession.ts'deki isAdminSession kullanılır.
 */
export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  return (await readSessionToken(token)) !== null;
}
