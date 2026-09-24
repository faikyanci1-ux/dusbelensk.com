"use client";

import { useFormStatus } from "react-dom";
import { Loader2, Trash2 } from "lucide-react";
import { deleteNews } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-full border border-red-400/30 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:border-red-400/60 hover:text-red-200 disabled:opacity-60"
    >
      {pending ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
      Sil
    </button>
  );
}

export function DeleteNewsButton({ id, title }: { id: number; title: string }) {
  return (
    <form
      action={deleteNews}
      onSubmit={(event) => {
        if (!window.confirm(`“${title}” haberini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <SubmitButton />
    </form>
  );
}
