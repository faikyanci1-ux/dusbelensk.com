"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Check, ImageOff, Loader2, Upload } from "lucide-react";

export type ImageOption = { src: string; alt: string };

const MAX_DIMENSION = 1920;

/** Telefondan gelen büyük fotoğrafları yüklemeden önce küçültür (en uzun kenar 1920px, JPEG %85). */
async function resizeImage(file: File): Promise<Blob> {
  if (file.type === "image/gif" || file.type === "image/svg+xml") return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size < 1_500_000) return file;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
  return blob ?? file;
}

function safeFileName(name: string): string {
  const base = name.replace(/\.[^.]+$/, "").toLocaleLowerCase("tr-TR");
  const ascii = base
    .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return ascii || "gorsel";
}

/**
 * Görsel seçici: önizleme + bilgisayardan/telefondan yükleme (Vercel Blob) + sitedeki fotoğraflardan seçme.
 * Seçilen görselin adresi gizli input (name) ile forma eklenir.
 */
export function ImageField({
  name,
  label,
  initialValue,
  options,
  uploadEnabled,
  folder,
  optional = true,
  error,
  aspect = "aspect-[4/3]",
}: {
  name: string;
  label: string;
  initialValue: string;
  options: ImageOption[];
  uploadEnabled: boolean;
  /** Blob'da klasör adı: "haberler", "galeri", "kadro"… */
  folder: string;
  optional?: boolean;
  error?: string;
  aspect?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState<{ state: "idle" | "uploading" | "error"; message?: string; progress?: number }>({
    state: "idle",
  });
  const fileInput = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatus({ state: "error", message: "Lütfen bir fotoğraf dosyası seçin." });
      return;
    }
    setStatus({ state: "uploading", progress: 0 });
    try {
      const body = await resizeImage(file);
      const extension = body.type === "image/jpeg" ? "jpg" : (file.name.split(".").pop() ?? "jpg");
      const result = await upload(`${folder}/${safeFileName(file.name)}.${extension}`, body, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
        contentType: body.type || file.type,
        onUploadProgress: ({ percentage }) => setStatus({ state: "uploading", progress: Math.round(percentage) }),
      });
      setValue(result.url);
      setStatus({ state: "idle" });
    } catch (err) {
      console.error(err);
      setStatus({ state: "error", message: "Yükleme başarısız oldu. İnternet bağlantınızı kontrol edip tekrar deneyin." });
    } finally {
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  const uploading = status.state === "uploading";

  return (
    <fieldset>
      <legend className="mb-2 block text-xs font-medium text-white/70">
        {label} {optional && <span className="text-white/40">(isteğe bağlı)</span>}
      </legend>
      <input type="hidden" name={name} value={value} />

      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3">
        <div className={`relative w-32 shrink-0 overflow-hidden rounded-xl bg-white/10 ${aspect}`}>
          {value ? (
            <Image src={value} alt="Seçili görsel" fill sizes="128px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-white/30">
              <ImageOff size={20} />
            </span>
          )}
          {uploading && (
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 text-xs font-semibold">
              <Loader2 size={18} className="animate-spin" />%{status.progress ?? 0}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2 text-sm">
          <p className="font-medium">{value ? "Seçili görsel" : "Görsel seçilmedi"}</p>
          <div className="flex flex-wrap items-center gap-2">
            {uploadEnabled ? (
              <>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  id={`${name}-file`}
                  onChange={(e) => handleFile(e.target.files?.[0])}
                  disabled={uploading}
                />
                <label
                  htmlFor={`${name}-file`}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold transition hover:bg-white/20 ${
                    uploading ? "pointer-events-none opacity-60" : ""
                  }`}
                >
                  <Upload size={13} />
                  Fotoğraf yükle
                </label>
              </>
            ) : (
              <span className="text-xs text-white/45">
                Fotoğraf yükleme, Vercel Blob depolaması açılınca etkinleşir. Şimdilik sitedeki fotoğraflardan seçebilirsiniz.
              </span>
            )}
            {value && !uploading && (
              <button type="button" onClick={() => setValue("")} className="text-xs text-white/60 underline hover:text-white">
                Görseli kaldır
              </button>
            )}
          </div>
          {status.state === "error" && (
            <p className="text-xs text-red-300" role="alert">
              {status.message}
            </p>
          )}
        </div>
      </div>

      {options.length > 0 && (
        <details className="group mt-3 rounded-2xl border border-white/10 bg-white/5">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-white/80 marker:hidden hover:text-white">
            Sitedeki fotoğraflardan seç <span className="text-white/40 group-open:hidden">↓</span>
          </summary>
          <div className="grid grid-cols-3 gap-2 px-3 pb-3 sm:grid-cols-4">
            {options.map((option) => {
              const selected = option.src === value;
              return (
                <button
                  key={option.src}
                  type="button"
                  onClick={() => setValue(option.src)}
                  aria-pressed={selected}
                  title={option.alt}
                  className={`relative aspect-[4/3] overflow-hidden rounded-lg border-2 transition ${
                    selected ? "border-accent-bright" : "border-transparent hover:border-white/40"
                  }`}
                >
                  <Image src={option.src} alt={option.alt} fill sizes="160px" className="object-cover" />
                  {selected && (
                    <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-bright">
                      <Check size={12} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </details>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-red-300" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
