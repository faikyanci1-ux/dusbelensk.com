// Yetki matrisi. Saf veri/fonksiyon (sunucu + istemci + Edge'de kullanılabilir).
// Asıl zorlama sunucuda: requireModule / requireRole (src/lib/adminSession.ts). Menü gizleme tek başına yetki değildir.

export type AdminRole = "admin" | "editor";

/** Yönetim paneli modülleri (URL parçasıyla aynı: /admin/<modül>). */
export type AdminModule =
  | "ayarlar"
  | "hero"
  | "haberler"
  | "etkinlikler"
  | "galeri"
  | "videolar"
  | "teknik-kadro"
  | "yonetim"
  | "sss"
  | "yas-gruplari"
  | "mesajlar"
  | "kullanicilar"
  | "sifre";

export const ADMIN_ROLES: readonly AdminRole[] = ["admin", "editor"];

export const ROLE_LABELS: Record<AdminRole, string> = {
  admin: "Yönetici",
  editor: "Editör",
};

/** Editörün erişebildiği modüller. "sifre" (kendi şifresini değiştirme) herkese açıktır. */
const EDITOR_MODULES: readonly AdminModule[] = ["haberler", "galeri", "sifre"];

/** Editörün fotoğraf yükleyebildiği Blob klasörleri. */
const EDITOR_UPLOAD_FOLDERS: readonly string[] = ["haberler", "galeri"];
const ADMIN_UPLOAD_FOLDERS: readonly string[] = ["haberler", "galeri", "kadro", "yonetim"];

export function isRole(value: unknown): value is AdminRole {
  return value === "admin" || value === "editor";
}

export function canAccessModule(role: AdminRole, module: AdminModule): boolean {
  if (role === "admin") return true;
  return EDITOR_MODULES.includes(module);
}

export function canUploadTo(role: AdminRole, folder: string): boolean {
  return (role === "admin" ? ADMIN_UPLOAD_FOLDERS : EDITOR_UPLOAD_FOLDERS).includes(folder);
}
