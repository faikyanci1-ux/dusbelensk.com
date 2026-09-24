import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-cream py-24 text-ink">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
        <p className="font-display text-7xl text-accent">404</p>
        <h1 className="mt-4 font-display text-3xl uppercase tracking-tight">Sayfa bulunamadı</h1>
        <p className="mt-3 text-ink-muted">Aradığınız sayfa taşınmış, silinmiş ya da adres hatalı yazılmış olabilir.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:brightness-110"
          >
            Anasayfaya Dön
          </Link>
          <Link
            href="/haberler"
            className="rounded-full border border-black/15 px-6 py-3 text-sm font-semibold uppercase tracking-wide transition hover:border-black/40"
          >
            Haberler
          </Link>
        </div>
      </div>
    </div>
  );
}
