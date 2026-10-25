import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE } from "@/lib/adminAuth";
import { isAdminSession } from "@/lib/adminSession";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Yönetici Girişi",
  robots: { index: false, follow: false },
};

/**
 * Oturum zaten açıksa panele yönlendirir. Bu kontrol proxy'de değil burada yapılır: proxy çıkışla
 * iptal edilmiş oturumu göremez ve panel ile giriş sayfası arasında yönlendirme döngüsü oluşurdu.
 */
export default async function AdminLoginPage() {
  if (await isAdminSession((await cookies()).get(ADMIN_SESSION_COOKIE)?.value)) redirect("/admin");
  return <LoginForm />;
}
