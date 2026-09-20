"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import type { GalleryItem } from "@/data/gallery";

export function GalleryLightbox({ items, compact = false }: { items: GalleryItem[]; compact?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (openIndex === null) return;

    // Modal açılınca odağı kapat düğmesine taşı; kapanınca tetikleyen öğeye geri döndür.
    closeButtonRef.current?.focus();
    const triggerEl = lastTriggerRef.current;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenIndex(null);
      if (event.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : (i + 1) % items.length));
      if (event.key === "ArrowLeft") setOpenIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length));
      if (event.key === "Tab") {
        // Odak tuzağı: Tab ile modal dışına çıkılmasın (WCAG 2.1.2 No Keyboard Trap'in
        // tersi bir gereksinim değil, aksine bir modal için beklenen 2.4.3 davranışı).
        const container = dialogRef.current;
        if (!container) return;
        const focusable = container.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      triggerEl?.focus();
    };
  }, [openIndex, items.length]);

  const activeItem = openIndex === null ? null : items[openIndex];

  return (
    <>
      <div
        className={`grid auto-rows-[130px] grid-cols-2 gap-3 sm:auto-rows-[170px] sm:grid-cols-4 sm:gap-4 ${
          compact ? "" : "mt-12"
        }`}
      >
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={(e) => {
              lastTriggerRef.current = e.currentTarget;
              setOpenIndex(i);
            }}
            aria-label={`${item.alt} — büyüt`}
            className={`group relative overflow-hidden rounded-xl border border-black/10 transition duration-300 hover:border-accent-2 hover:shadow-[0_0_30px_rgba(46,92,153,0.25)] ${
              item.size === "large" ? "col-span-2 row-span-2" : ""
            } ${item.size === "wide" ? "col-span-2" : ""}`}
          >
            <Image
              src={item.src}
              alt=""
              fill
              sizes="(min-width: 640px) 25vw, 50vw"
              className="object-cover transition duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 transition duration-300 group-hover:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-end justify-between gap-2 p-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="text-xs font-semibold leading-tight text-white sm:text-sm">{item.alt}</span>
              <ZoomIn className="shrink-0 text-accent-bright" size={18} />
            </div>
          </button>
        ))}
      </div>

      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setOpenIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeItem.alt} — fotoğraf görüntüleyici`}
          ref={dialogRef}
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Kapat"
            ref={closeButtonRef}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-accent hover:text-accent"
          >
            <X size={20} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIndex((openIndex! - 1 + items.length) % items.length);
            }}
            aria-label="Önceki fotoğraf"
            className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-accent hover:text-accent"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="relative max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={activeItem.src}
              alt={activeItem.alt}
              width={1400}
              height={1000}
              className="max-h-[85vh] w-auto rounded-lg object-contain"
            />
            <p className="mt-3 text-center text-sm text-text-muted">
              {activeItem.alt} · {openIndex! + 1}/{items.length}
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIndex((openIndex! + 1) % items.length);
            }}
            aria-label="Sonraki fotoğraf"
            className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-accent hover:text-accent"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </>
  );
}
