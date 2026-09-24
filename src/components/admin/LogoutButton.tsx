"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/65 transition hover:bg-white/5 hover:text-white"
    >
      <LogOut size={16} />
      Çıkış Yap
    </button>
  );
}
