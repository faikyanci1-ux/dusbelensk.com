import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/adminAuth";
import { isAdminSession, revokeAdminSessions } from "@/lib/adminSession";

export async function POST(request: NextRequest) {
  // Çerez silinse de kopyalanmış bir token 12 saat geçerli kalırdı: oturumlar sunucuda da iptal edilir.
  // Yalnızca geçerli oturumla (başkası dışarıdan tetikleyip yöneticiyi çıkaramasın).
  let revoked = true;
  try {
    if (await isAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)) {
      await revokeAdminSessions();
    }
  } catch (error) {
    // Veritabanı hatasında da bu cihazdan çıkış yapılır (çerez her durumda silinir).
    console.error("[logout] oturumlar iptal edilemedi:", error);
    revoked = false;
  }
  const response = NextResponse.json({ ok: revoked }, { status: revoked ? 200 : 500 });
  response.cookies.delete(ADMIN_SESSION_COOKIE);
  return response;
}
