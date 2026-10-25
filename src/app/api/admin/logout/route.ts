import { NextRequest, NextResponse } from "next/server";
import { isSameOrigin, ADMIN_SESSION_COOKIE } from "@/lib/adminAuth";
import { getAdminUser, revokeSessions } from "@/lib/adminSession";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Geçersiz istek." }, { status: 403 });
  // Çerez silinse de kopyalanmış bir token 12 saat geçerli kalırdı: o kullanıcının oturumları sunucuda da iptal edilir
  // (yalnızca kendi hesabı; diğer kullanıcılar etkilenmez). Yalnızca geçerli oturumla (başkası dışarıdan tetikleyemesin).
  let revoked = true;
  try {
    const user = await getAdminUser();
    if (user) await revokeSessions(user.id);
  } catch (error) {
    // Veritabanı hatasında da bu cihazdan çıkış yapılır (çerez her durumda silinir).
    console.error("[logout] oturumlar iptal edilemedi:", error);
    revoked = false;
  }
  const response = NextResponse.json({ ok: revoked }, { status: revoked ? 200 : 500 });
  response.cookies.delete(ADMIN_SESSION_COOKIE);
  return response;
}
