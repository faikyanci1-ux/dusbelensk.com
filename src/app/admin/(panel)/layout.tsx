import type { Metadata } from "next";
import { count, eq } from "drizzle-orm";
import { AdminShell } from "@/components/admin/AdminShell";
import { navForRole } from "@/components/admin/nav";
import { getDb } from "@/db/client";
import { contactMessages } from "@/db/schema";
import { ROLE_LABELS, type AdminRole } from "@/lib/permissions";
import { requireUser } from "@/lib/adminSession";

export const metadata: Metadata = {
  title: { default: "Yönetim Paneli", template: "%s — Yönetim Paneli" },
  robots: { index: false, follow: false },
};

/** Menüde "Gelen Mesajlar" varsa okunmamış sayısı; hata olursa rozet gösterilmez. */
async function getBadges(role: AdminRole): Promise<Record<string, number>> {
  if (!navForRole(role).some((item) => (item.href as string) === "/admin/mesajlar")) return {};
  try {
    const [row] = await getDb().select({ n: count() }).from(contactMessages).where(eq(contactMessages.isRead, false));
    return { "/admin/mesajlar": row?.n ?? 0 };
  } catch {
    return {};
  }
}

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  // Layout yalnızca oturumu doğrular (rol/modül kontrolü her sayfa ve action'da ayrıca yapılır).
  const user = await requireUser();
  return (
    <AdminShell
      role={user.role}
      userName={user.displayName}
      roleLabel={ROLE_LABELS[user.role]}
      badges={await getBadges(user.role)}
    >
      {children}
    </AdminShell>
  );
}
