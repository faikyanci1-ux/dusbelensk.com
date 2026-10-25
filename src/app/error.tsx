"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw } from "lucide-react";

/** Site genelinde beklenmeyen bir hata olursa Header/Footer yerinde kalır; ziyaretçi sayfayı yeniden deneyebilir. */
export default function SiteError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <p aria-hidden="true" className="font-display text-7xl text-accent-bright/30 sm:text-8xl">
        Hata
      </p>
      <h1 className="mt-2 font-display text-3xl uppercase leading-[1.5] tracking-tight text-white sm:text-4xl">
        Bir şeyler ters gitti
      </h1>
      <p className="mt-4 max-w-md text-text-muted">
        Sayfa yüklenirken beklenmeyen bir sorun oluştu. Lütfen tekrar deneyin; sorun devam ederse bize WhatsApp veya
        telefonla ulaşabilirsiniz.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:brightness-110"
        >
          <RotateCw size={16} aria-hidden="true" />
          Tekrar dene
        </button>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10"
        >
          Anasayfaya dön
        </Link>
      </div>
    </section>
  );
}
