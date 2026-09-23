import Link from "next/link";
import { Newspaper, Images, Users, Shield, UserSquare2 } from "lucide-react";
import { LogoutButton } from "./LogoutButton";

const MODULES = [
  { title: "Haberler", href: "/admin/haberler", icon: Newspaper, available: false },
  { title: "Galeri", href: "/admin/galeri", icon: Images, available: false },
  { title: "Teknik Kadro", href: "/admin/teknik-kadro", icon: Users, available: false },
  { title: "Yönetim Kurulu", href: "/admin/yonetim", icon: Shield, available: false },
  { title: "Sporcularımız", href: "/admin/sporcular", icon: UserSquare2, available: false },
];

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-bg-main px-4 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl uppercase tracking-tight">Yönetim Paneli</h1>
            <p className="text-sm text-white/60">Düşbelen SK içerik yönetimi</p>
          </div>
          <LogoutButton />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.title}
                className={`flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 ${
                  mod.available ? "" : "opacity-50"
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-bright/15 text-accent-bright">
                  <Icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{mod.title}</p>
                  <p className="text-xs text-white/50">{mod.available ? "Yönet" : "Yakında"}</p>
                </div>
                {mod.available ? (
                  <Link href={mod.href} className="text-xs font-semibold text-accent-bright">
                    Aç →
                  </Link>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const metadata = { robots: { index: false, follow: false } };
