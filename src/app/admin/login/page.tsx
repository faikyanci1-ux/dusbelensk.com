import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/adminSession";
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
  if (await getAdminUser()) redirect("/admin");
  return <LoginForm />;
}
