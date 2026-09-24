"use client";

import { useFormStatus } from "react-dom";
import { ArrowDown, ArrowUp, Loader2, Trash2 } from "lucide-react";

/** Admin formlarının ortak parçaları (tüm modüller aynı görünümü kullanır). */

export const inputClass =
  "w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-accent-bright aria-[invalid=true]:border-red-400/70";

export function Field({
  label,
  htmlFor,
  hint,
  optional,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-xs font-medium text-white/70">
        {label} {optional && <span className="text-white/40">(isteğe bağlı)</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-white/45">{hint}</p>}
      {error && (
        <p className="mt-1.5 text-xs text-red-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
      {message}
    </p>
  );
}

export function SaveButton({ label = "Kaydet" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-bright px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending && <Loader2 size={16} className="animate-spin" />}
      {pending ? "Kaydediliyor…" : label}
    </button>
  );
}

function DeleteSubmit({ compact }: { compact?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={compact ? "Sil" : undefined}
      className="inline-flex items-center gap-1.5 rounded-full border border-red-400/30 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:border-red-400/60 hover:text-red-200 disabled:opacity-60"
    >
      {pending ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
      {!compact && "Sil"}
    </button>
  );
}

/** Onay soran sil butonu. action: id'yi FormData'dan okuyan Server Action. */
export function DeleteButton({
  action,
  id,
  confirmText,
  compact,
}: {
  action: (formData: FormData) => Promise<void>;
  id: number;
  confirmText: string;
  compact?: boolean;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`${confirmText}\n\nBu işlem geri alınamaz.`)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <DeleteSubmit compact={compact} />
    </form>
  );
}

function MoveSubmit({ direction, disabled }: { direction: "up" | "down"; disabled: boolean }) {
  const { pending } = useFormStatus();
  const Icon = direction === "up" ? ArrowUp : ArrowDown;
  return (
    <button
      type="submit"
      name="direction"
      value={direction}
      disabled={disabled || pending}
      aria-label={direction === "up" ? "Yukarı taşı" : "Aşağı taşı"}
      title={direction === "up" ? "Yukarı taşı" : "Aşağı taşı"}
      className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
    >
      <Icon size={13} />
    </button>
  );
}

/** Yukarı/aşağı sıralama butonları. action: id + direction ("up" | "down") okuyan Server Action. */
export function MoveButtons({
  action,
  id,
  isFirst,
  isLast,
}: {
  action: (formData: FormData) => Promise<void>;
  id: number;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <form action={action} className="flex flex-col gap-1">
      <input type="hidden" name="id" value={id} />
      <MoveSubmit direction="up" disabled={isFirst} />
      <MoveSubmit direction="down" disabled={isLast} />
    </form>
  );
}
