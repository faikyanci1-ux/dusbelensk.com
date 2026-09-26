"use client";

import { useEffect } from "react";
import Link from "next/link";

/** Panelde beklenmeyen bir hata (ör. silme/sıralama sırasında veritabanı hatası) olursa menü yerinde kalır. */
export default function AdminError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
      <p className="font-display text-5xl text-white/20">Hata</p>
      <h1 className="mt-3 text-lg font-semibold">İşlem tamamlanamadı</h1>
      <p className="mt-2 text-sm text-white/60">
        Bir sorun oluştu, değişiklik kaydedilmemiş olabilir. Lütfen tekrar deneyin.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex rounded-full bg-accent-bright px-5 py-2.5 text-sm font-semibold transition hover:brightness-110"
        >
          Tekrar dene
        </button>
        <Link
          href="/admin"
          className="inline-flex rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/10"
        >
          Genel Bakış&apos;a dön
        </Link>
      </div>
    </div>
  );
}
