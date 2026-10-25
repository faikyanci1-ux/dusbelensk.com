import {
  CalendarDays,
  HelpCircle,
  KeyRound,
  Images,
  LayoutDashboard,
  Layers,
  Presentation,
  Video,
  Newspaper,
  Settings,
  Shield,
  UserCog,
  Users,
} from "lucide-react";
import { canAccessModule, type AdminRole } from "@/lib/permissions";

/**
 * Not: "Gelen Mesajlar" (/admin/mesajlar) sitede iletişim formu kaldırıldığı için menüden çıkarıldı; sayfa URL'den erişilebilir.
 * Form geri gelirse { href: "/admin/mesajlar", label: "Gelen Mesajlar", icon: Mail } satırını (Mail ikonuyla) buraya ekleyin;
 * okunmamış rozeti layout.tsx'te otomatik çalışır.
 */
/**
 * Yönetim paneli menüsü (sol menü + Genel Bakış kartları). Sunucu ve istemci bileşenleri birlikte kullanır.
 * module: bu öğeyi görebilmek için gereken yetki (null = herkes). Menü yalnızca kolaylıktır; asıl zorlama sayfa/action'lardaki requireModule'dür.
 */
export const ADMIN_NAV = [
  { href: "/admin", label: "Genel Bakış", icon: LayoutDashboard, module: null },
  { href: "/admin/ayarlar", label: "Site Ayarları", icon: Settings, module: "ayarlar" },
  { href: "/admin/hero", label: "Anasayfa Slaytı", icon: Presentation, module: "hero" },
  { href: "/admin/haberler", label: "Haberler", icon: Newspaper, module: "haberler" },
  { href: "/admin/etkinlikler", label: "Etkinlikler", icon: CalendarDays, module: "etkinlikler" },
  { href: "/admin/galeri", label: "Galeri", icon: Images, module: "galeri" },
  { href: "/admin/videolar", label: "Videolar", icon: Video, module: "videolar" },
  { href: "/admin/teknik-kadro", label: "Teknik Kadro", icon: Users, module: "teknik-kadro" },
  { href: "/admin/yonetim", label: "Yönetim Kurulu", icon: Shield, module: "yonetim" },
  { href: "/admin/sss", label: "SSS", icon: HelpCircle, module: "sss" },
  { href: "/admin/yas-gruplari", label: "Yaş Grupları", icon: Layers, module: "yas-gruplari" },
  { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: UserCog, module: "kullanicilar" },
  { href: "/admin/sifre", label: "Şifremi Değiştir", icon: KeyRound, module: "sifre" },
] as const;

export type AdminNavItem = (typeof ADMIN_NAV)[number];

/** Rolün görebildiği menü öğeleri. */
export function navForRole(role: AdminRole): AdminNavItem[] {
  return ADMIN_NAV.filter((item) => item.module === null || canAccessModule(role, item.module));
}
