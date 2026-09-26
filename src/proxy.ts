import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/adminAuth";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  // Giriş API'si ve giriş sayfası her zaman erişilebilir olmalı. Oturumu açık olanı panele
  // yönlendirme işi giriş sayfasında yapılır (iptal edilmiş oturumları da görebildiği için).
  if (pathname === "/api/admin/login" || pathname === "/admin/login") return NextResponse.next();

  // Burada yalnızca imza/süre kontrolü (Edge); çıkışla iptal kontrolü sayfa/action/route'larda yapılır.
  const authenticated = await verifySessionToken(token);

  if (!authenticated) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }
    // Server Action (form kaydetme) istekleri: her action kendi içinde requireAdmin() ile oturumu
    // doğrular ve oturum yoksa giriş sayfasına düzgün yönlendirir. Burada 307 ile yönlendirmek
    // POST'u giriş sayfasına taşıyıp istemcide "This page couldn't load" hatasına yol açıyordu.
    if (request.method === "POST" && request.headers.has("next-action")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}
