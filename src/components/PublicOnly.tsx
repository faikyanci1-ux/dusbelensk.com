"use client";

import { usePathname } from "next/navigation";

/** Sitenin menü/footer/WhatsApp gibi parçalarını yönetim panelinde (/admin) gizler. */
export function PublicOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
