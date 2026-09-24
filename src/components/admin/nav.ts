import {
  CalendarDays,
  HelpCircle,
  Images,
  LayoutDashboard,
  Layers,
  Newspaper,
  Settings,
  Shield,
  Users,
} from "lucide-react";

/** Yönetim paneli menüsü (sol menü + Genel Bakış kartları). Sunucu ve istemci bileşenleri birlikte kullanır. */
export const ADMIN_NAV = [
  { href: "/admin", label: "Genel Bakış", icon: LayoutDashboard },
  { href: "/admin/ayarlar", label: "Site Ayarları", icon: Settings },
  { href: "/admin/haberler", label: "Haberler", icon: Newspaper },
  { href: "/admin/etkinlikler", label: "Etkinlikler", icon: CalendarDays },
  { href: "/admin/galeri", label: "Galeri", icon: Images },
  { href: "/admin/teknik-kadro", label: "Teknik Kadro", icon: Users },
  { href: "/admin/yonetim", label: "Yönetim Kurulu", icon: Shield },
  { href: "/admin/sss", label: "SSS", icon: HelpCircle },
  { href: "/admin/yas-gruplari", label: "Yaş Grupları", icon: Layers },
] as const;
