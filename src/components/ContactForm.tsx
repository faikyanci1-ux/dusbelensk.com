"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

const AGE_GROUPS = ["U-11", "U-12", "U-13", "U-14", "U-15", "U-16", "Emin değilim / Bilgi almak istiyorum"];

type Status = "idle" | "sending" | "success" | "error";
type RequestType = "trial" | "general";

export function ContactForm({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const [requestType, setRequestType] = useState<RequestType>("trial");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isLight = variant === "light";
  const labelColor = isLight ? "text-ink-muted" : "text-text-muted";
  const fieldClass = isLight
    ? "mt-1 w-full rounded-lg border border-black/10 bg-black/[0.03] px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
    : "mt-1 w-full rounded-lg border border-border-soft bg-bg-raised/60 px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none";
  const toggleWrapClass = isLight
    ? "flex gap-2 rounded-full border border-black/10 bg-black/[0.03] p-1 text-sm"
    : "flex gap-2 rounded-full border border-border-soft bg-bg-main/40 p-1 text-sm";
  const toggleInactiveClass = isLight ? "text-ink-muted hover:text-ink" : "text-text-muted hover:text-white";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const form = event.currentTarget;
    const data = { ...Object.fromEntries(new FormData(form).entries()), requestType };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Mesaj gönderilemedi.");
      }

      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-accent/40 bg-accent-soft p-6 text-center text-sm text-accent">
        {requestType === "trial"
          ? "Talebiniz için teşekkürler! Deneme antrenmanı ve kayıt süreciyle ilgili en kısa sürede size dönüş yapacağız."
          : "Mesajınız için teşekkürler! En kısa sürede size dönüş yapacağız."}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot: botlar bu alanı doldurur, insan kullanıcılar görmez. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className={toggleWrapClass}>
        <button
          type="button"
          onClick={() => setRequestType("trial")}
          className={`flex-1 rounded-full px-4 py-2 font-medium transition ${
            requestType === "trial" ? "bg-accent text-bg-main" : toggleInactiveClass
          }`}
        >
          Deneme Antrenmanı / Kayıt
        </button>
        <button
          type="button"
          onClick={() => setRequestType("general")}
          className={`flex-1 rounded-full px-4 py-2 font-medium transition ${
            requestType === "general" ? "bg-accent text-bg-main" : toggleInactiveClass
          }`}
        >
          Genel Mesaj
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={`text-xs font-medium ${labelColor}`} htmlFor="name">
            Veli Ad Soyad
          </label>
          <input id="name" name="name" required className={fieldClass} />
        </div>
        <div>
          <label className={`text-xs font-medium ${labelColor}`} htmlFor="phone">
            Telefon
          </label>
          <input id="phone" name="phone" className={fieldClass} />
        </div>
      </div>

      <div>
        <label className={`text-xs font-medium ${labelColor}`} htmlFor="email">
          E-posta
        </label>
        <input id="email" name="email" type="email" className={fieldClass} />
      </div>

      {requestType === "trial" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={`text-xs font-medium ${labelColor}`} htmlFor="childName">
              Çocuğun Adı Soyadı
            </label>
            <input id="childName" name="childName" className={fieldClass} />
          </div>
          <div>
            <label className={`text-xs font-medium ${labelColor}`} htmlFor="ageGroup">
              Yaş Grubu
            </label>
            <select id="ageGroup" name="ageGroup" defaultValue="" className={fieldClass}>
              <option value="" disabled>
                Seçiniz
              </option>
              {AGE_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div>
        <label className={`text-xs font-medium ${labelColor}`} htmlFor="message">
          {requestType === "trial" ? "Eklemek İstediğiniz Not (opsiyonel)" : "Mesajınız"}
        </label>
        <textarea
          id="message"
          name="message"
          required={requestType === "general"}
          rows={requestType === "trial" ? 3 : 5}
          className={fieldClass}
        />
      </div>

      <label className={`flex items-start gap-2.5 text-xs ${labelColor}`}>
        <input
          type="checkbox"
          name="kvkkConsent"
          required
          className={`mt-0.5 h-4 w-4 shrink-0 rounded accent-accent ${
            isLight ? "border-black/10 bg-black/[0.03]" : "border-border-soft bg-bg-raised/60"
          }`}
        />
        <span>
          <Link href="/kvkk" target="_blank" className="text-accent hover:underline">
            KVKK Aydınlatma Metni
          </Link>
          &apos;ni okudum, kişisel verilerimin işlenmesini kabul ediyorum.
        </span>
      </label>

      {status === "error" && <p className="text-sm text-red-400">{errorMessage}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-bg-main transition hover:brightness-110 disabled:opacity-60"
      >
        {status === "sending" ? "Gönderiliyor..." : requestType === "trial" ? "Talebi Gönder" : "Mesajı Gönder"}
      </button>
    </form>
  );
}
