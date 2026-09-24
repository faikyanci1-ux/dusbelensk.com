"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("Şifre hatalı. Tekrar deneyin.");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      setErrorMessage(res.status === 429 && data?.error ? data.error : "Şifre hatalı. Tekrar deneyin.");
      setStatus("error");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-pitch px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-bright/15 text-accent-bright">
            <Lock size={18} />
          </span>
          <div>
            <h1 className="font-display text-lg uppercase tracking-tight text-white">Yönetim Paneli</h1>
            <p className="text-xs text-white/60">Düşbelen SK</p>
          </div>
        </div>

        <label htmlFor="password" className="mb-2 block text-xs font-medium text-white/70">
          Şifre
        </label>
        <input
          id="password"
          type="password"
          autoFocus
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-accent-bright"
          placeholder="••••••••"
        />

        {status === "error" && (
          <p className="mt-3 text-sm text-red-400" role="alert">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading" || password.length === 0}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-accent-bright px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : null}
          Giriş Yap
        </button>
      </form>
    </div>
  );
}
