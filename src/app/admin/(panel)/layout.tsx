import type { Metadata } from "next";
import { count, eq } from "drizzle-orm";
import { AdminShell } from "@/components/admin/AdminShell";
import { ADMIN_NAV } from "@/components/admin/nav";
import { getDb } from "@/db/client";
import { contactMessages } from "@/db/schema";
import { requireAdmin } from "@/lib/adminSession";

export const metadata: Metadata = {
  title: { default: "Yönetim Paneli", template: "%s — Yönetim Paneli" },
  robots: { index: false, follow: false },
};

/** Menüde "Gelen Mesajlar" varsa okunmamış sayısı; hata olursa rozet gösterilmez. */
async function getBadges(): Promise<Record<string, number>> {
  if (!ADMIN_NAV.some((item) => (item.href as string) === "/admin/mesajlar")) return {};
  try {
    const [row] = await getDb().select({ n: count() }).from(contactMessages).where(eq(contactMessages.isRead, false));
    return { "/admin/mesajlar": row?.n ?? 0 };
  } catch {
    return {};
  }
}

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <AdminShell badges={await getBadges()}>{children}</AdminShell>;
}
