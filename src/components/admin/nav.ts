import {
  CalendarDays,
  HelpCircle,
  Images,
  LayoutDashboard,
  Layers,
  Presentation,
  Video,
  Newspaper,
  Settings,
  Shield,
  Users,
} from "lucide-react";

/**
 * Not: "Gelen Mesajlar" (/admin/mesajlar) sitede iletişim formu kaldırıldığı için menüden çıkarıldı; sayfa URL'den erişilebilir.
 * Form geri gelirse { href: "/admin/mesajlar", label: "Gelen Mesajlar", icon: Mail } satırını (Mail ikonuyla) buraya ekleyin;
 * okunmamış rozeti layout.tsx'te otomatik çalışır.
 */
/** Yönetim paneli menüsü (sol menü + Genel Bakış kartları). Sunucu ve istemci bileşenleri birlikte kullanır. */
export const ADMIN_NAV = [
  { href: "/admin", label: "Genel Bakış", icon: LayoutDashboard },
  { href: "/admin/ayarlar", label: "Site Ayarları", icon: Settings },
  { href: "/admin/hero", label: "Anasayfa Slaytı", icon: Presentation },
  { href: "/admin/haberler", label: "Haberler", icon: Newspaper },
  { href: "/admin/etkinlikler", label: "Etkinlikler", icon: CalendarDays },
  { href: "/admin/galeri", label: "Galeri", icon: Images },
  { href: "/admin/videolar", label: "Videolar", icon: Video },
  { href: "/admin/teknik-kadro", label: "Teknik Kadro", icon: Users },
  { href: "/admin/yonetim", label: "Yönetim Kurulu", icon: Shield },
  { href: "/admin/sss", label: "SSS", icon: HelpCircle },
  { href: "/admin/yas-gruplari", label: "Yaş Grupları", icon: Layers },
] as const;
