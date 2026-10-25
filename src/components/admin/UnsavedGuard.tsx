"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Kaydedilmemiş değişiklik uyarısı: sayfadaki herhangi bir formda yazı/seçim değişince, kullanıcı
 * Kaydet'e basmadan sekmeyi kapatmaya ya da sayfayı yenilemeye çalışırsa tarayıcı onay sorar.
 * Tek bir dinleyici ile tüm formları kapsar (olay delegasyonu); sayfa değişince sıfırlanır.
 */
export function UnsavedGuard() {
  const pathname = usePathname();
  const dirty = useRef(false);

  useEffect(() => {
    dirty.current = false;
  }, [pathname]);

  useEffect(() => {
    const isFormField = (target: EventTarget | null) =>
      target instanceof HTMLElement && !!target.closest("form") && target.closest("form")?.dataset.noGuard === undefined;
    const markDirty = (event: Event) => {
      if (isFormField(event.target)) dirty.current = true;
    };
    const clear = () => {
      dirty.current = false;
    };
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty.current) return;
      event.preventDefault();
      event.returnValue = "";
    };
    // Next.js istemci geçişlerinde (menü bağlantıları) beforeunload tetiklenmez: bağlantı tıklamasını yakala.
    const confirmLeave = (event: MouseEvent) => {
      if (!dirty.current || event.defaultPrevented) return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank" || link.origin !== window.location.origin) return;
      if (!window.confirm("Kaydedilmemiş değişiklikleriniz var. Sayfadan ayrılmak istiyor musunuz?")) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    document.addEventListener("click", confirmLeave, true);
    document.addEventListener("input", markDirty);
    document.addEventListener("change", markDirty);
    document.addEventListener("submit", clear);
    window.addEventListener("beforeunload", warn);
    return () => {
      document.removeEventListener("click", confirmLeave, true);
      document.removeEventListener("input", markDirty);
      document.removeEventListener("change", markDirty);
      document.removeEventListener("submit", clear);
      window.removeEventListener("beforeunload", warn);
    };
  }, []);

  return null;
}
