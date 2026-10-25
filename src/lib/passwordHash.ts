import "server-only";

// Kullanıcı şifreleri PBKDF2-SHA256 (Web Crypto) ile, kullanıcıya özel rastgele tuzla özetlenir.
// Saklanan biçim: "pbkdf2-sha256$<iterasyon>$<tuz base64>$<özet base64>". Özet hiçbir yere loglanmaz/döndürülmez.
// Yalnızca node tarafında (login route, kullanıcı action'ları) çağrılır; Edge'deki proxy yalnızca oturum imzası doğrular.

const ITERATIONS = 310_000; // OWASP 2023: PBKDF2-HMAC-SHA256 için en az 600k önerilir; ≥210k alt sınır, sunucusuz süre bütçesi için 310k.
const MIN_ITERATIONS = 100_000;
const MAX_ITERATIONS = 2_000_000; // bozuk/zehirli kayıt sunucuyu uzun süre meşgul etmesin
const SALT_BYTES = 16;
const HASH_BYTES = 32;

export const MIN_PASSWORD_LENGTH = 10;
export const MAX_PASSWORD_LENGTH = 200;

const encoder = new TextEncoder();

function toB64(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

function fromB64(value: string): Uint8Array {
  const s = atob(value);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

async function derive(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password.normalize("NFKC")), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations },
    key,
    HASH_BYTES * 8
  );
  return new Uint8Array(bits);
}

/** Sabit zamanlı bayt karşılaştırması. */
function equalBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await derive(password, salt, ITERATIONS);
  return `pbkdf2-sha256$${ITERATIONS}$${toB64(salt)}$${toB64(hash)}`;
}

/** Biçimi bozuk kayıtta false döner (hata fırlatmaz). */
export async function verifyPasswordHash(password: string, stored: string): Promise<boolean> {
  try {
    const [scheme, iter, salt, hash] = stored.split("$");
    const iterations = Number(iter);
    if (scheme !== "pbkdf2-sha256" || !Number.isInteger(iterations) || iterations < MIN_ITERATIONS || iterations > MAX_ITERATIONS) return false;
    const expected = fromB64(hash);
    const actual = await derive(password, fromB64(salt), iterations);
    return equalBytes(actual, expected);
  } catch {
    return false;
  }
}

let dummyHash: Promise<string> | undefined;

/**
 * Kullanıcı yokken/pasifken de gerçek bir PBKDF2 hesaplanır: yanıt süresi "kullanıcı var mı" bilgisini sızdırmasın.
 */
export async function burnPasswordCheck(password: string): Promise<void> {
  dummyHash ??= hashPassword(toB64(crypto.getRandomValues(new Uint8Array(16))));
  await verifyPasswordHash(password, await dummyHash);
}

/** Şifre politikası: en az 10 karakter. Hata mesajı ya da null. */
export function checkPasswordPolicy(password: string, username?: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) return `Şifre en az ${MIN_PASSWORD_LENGTH} karakter olmalı.`;
  if (password.length > MAX_PASSWORD_LENGTH) return `Şifre en fazla ${MAX_PASSWORD_LENGTH} karakter olabilir.`;
  if (username && password.toLowerCase().includes(username.toLowerCase())) return "Şifre kullanıcı adını içermemeli.";
  if (/^(.)\1+$/.test(password)) return "Şifre tek bir karakterin tekrarı olamaz.";
  return null;
}
