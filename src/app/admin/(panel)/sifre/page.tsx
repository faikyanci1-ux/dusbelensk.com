import { AdminPageHeader, StatusBanner } from "@/components/admin/ui";
import { requireModule } from "@/lib/adminSession";
import { changeOwnPassword } from "./actions";
import { PasswordForm } from "./PasswordForm";

export const metadata = { title: "Şifremi Değiştir" };

export default async function ChangePasswordPage({ searchParams }: { searchParams: Promise<{ durum?: string }> }) {
  const user = await requireModule("sifre");
  const { durum } = await searchParams;

  return (
    <>
      <AdminPageHeader title="Şifremi Değiştir" description={`${user.displayName} (${user.username}) hesabının şifresi.`} />
      <StatusBanner status={durum} />
      {user.isEnv ? (
        <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
          Yerleşik yönetici (admin) şifresi panelden değiştirilemez; sunucudaki ADMIN_PASSWORD ayarıyla belirlenir.
        </p>
      ) : (
        <PasswordForm action={changeOwnPassword} />
      )}
    </>
  );
}
