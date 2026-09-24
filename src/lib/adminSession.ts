import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/adminAuth";

/**
 * Admin sayfalarında ve Server Action'larda oturumu doğrular.
 * proxy.ts sayfaları zaten korur; ama Server Action'lar doğrudan POST ile de
 * çağrılabildiği için her action'ın başında ayrıca kontrol edilmeli.
 */
export async function requireAdmin(): Promise<void> {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    redirect("/admin/login");
  }
}
