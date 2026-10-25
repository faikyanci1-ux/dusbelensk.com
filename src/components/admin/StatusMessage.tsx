"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";

/** İşlem sonucu bandı: görününce ekrana kaydırılır ve odaklanır (ekran okuyucu da duyurur). */
export function StatusMessage({ message }: { message: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ block: "nearest" });
    ref.current?.focus({ preventScroll: true });
  }, [message]);
  return (
    <p
      ref={ref}
      tabIndex={-1}
      role="status"
      className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200 outline-none"
    >
      <CheckCircle2 size={16} className="shrink-0" />
      {message}
    </p>
  );
}
