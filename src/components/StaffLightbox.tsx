"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import type { StaffMember } from "@/data/staff";

export function StaffLightbox({ items }: { items: StaffMember[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (openIndex === null) return;

    closeButtonRef.current?.focus();
    const triggerEl = lastTriggerRef.current;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenIndex(null);
      if (event.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : (i + 1) % items.length));
      if (event.key === "ArrowLeft") setOpenIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length));
      if (event.key === "Tab") {
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

  const active = openIndex === null ? null : items[openIndex];

  return (
    <>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((member, i) => (
          <button
            key={member.id}
            type="button"
            onClick={(e) => {
              lastTriggerRef.current = e.currentTarget;
              setOpenIndex(i);
            }}
            className="group overflow-hidden rounded-b-2xl border border-t-4 border-black/10 border-t-accent-bright bg-white text-left shadow-sm transition hover:-translate-y-1 hover:border-accent-bright hover:shadow-[0_0_30px_rgba(212,30,55,0.15)]"
          >
            <div className="relative aspect-[2/3] w-full overflow-hidden">
              <Image
                src={member.photo}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                <ZoomIn className="text-white" size={24} />
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-accent">{member.role}</h3>
              <p className="mt-2 font-semibold text-ink">{member.name}</p>
              <p className="mt-2 line-clamp-3 text-sm text-ink-muted">{member.description}</p>
              {member.quote && (
                <p className="mt-3 line-clamp-2 border-l-2 border-accent/40 pl-3 text-sm italic text-ink-muted">
                  &ldquo;{member.quote}&rdquo;
                </p>
              )}
              <span className="sr-only"> — detayları gör</span>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setOpenIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${active.name} — ${active.role}`}
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
            aria-label="Önceki"
            className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-accent hover:text-accent"
          >
            <ChevronLeft size={20} />
          </button>

          <div
            className="grid max-h-[85vh] w-full max-w-3xl gap-0 overflow-y-auto rounded-2xl border border-border-soft bg-bg-raised sm:grid-cols-[280px_1fr]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[2/3] w-full self-start">
              <Image
                src={active.photo}
                alt={`${active.name} — ${active.role}`}
                fill
                sizes="280px"
                className="object-cover object-top"
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <span className="text-xs font-semibold uppercase tracking-wide text-accent-light">{active.role}</span>
              <h3 className="mt-2 text-2xl font-bold text-white">{active.name}</h3>
              <p className="mt-4 text-sm leading-relaxed text-text-muted">{active.description}</p>
              {active.quote && (
                <p className="mt-4 border-l-2 border-accent/40 pl-4 text-text-muted italic">
                  &ldquo;{active.quote}&rdquo;
                </p>
              )}
              <p className="mt-6 text-xs text-text-muted/70">
                {openIndex! + 1}/{items.length}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIndex((openIndex! + 1) % items.length);
            }}
            aria-label="Sonraki"
            className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-accent hover:text-accent"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </>
  );
}
