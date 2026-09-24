import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
      <p className="font-display text-5xl text-white/20">404</p>
      <h1 className="mt-3 text-lg font-semibold">Kayıt bulunamadı</h1>
      <p className="mt-2 text-sm text-white/60">Aradığınız kayıt silinmiş ya da adres hatalı olabilir.</p>
      <Link
        href="/admin"
        className="mt-6 inline-flex rounded-full bg-accent-bright px-5 py-2.5 text-sm font-semibold transition hover:brightness-110"
      >
        Genel Bakış&apos;a dön
      </Link>
    </div>
  );
}
