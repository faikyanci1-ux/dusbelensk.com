"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, ImageOff, Loader2 } from "lucide-react";
import type { NewsFormState } from "./actions";

export type ImageOption = { src: string; alt: string };

export type NewsFormValues = {
  title: string;
  date: string;
  summary: string;
  image: string;
  tag: string;
};

const TAG_SUGGESTIONS = ["Duyuru", "Başarı", "Maç", "Kayıt", "Kulüp", "Etkinlik"];

const inputClass =
  "w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-accent-bright";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs text-red-300" role="alert">
      {message}
    </p>
  );
}

function SaveButton({ label }: { label: string }) {
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

export function NewsForm({
  action,
  initialValues,
  imageOptions,
  submitLabel,
}: {
  action: (state: NewsFormState, formData: FormData) => Promise<NewsFormState>;
  initialValues: NewsFormValues;
  imageOptions: ImageOption[];
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, {});
  const [image, setImage] = useState(initialValues.image);
  const errors = state.fieldErrors ?? {};
  // Hata dönünce React formu sıfırlar; yazılanlar kaybolmasın diye gönderilen değerlerle yeniden doldur.
  const values = state.values ?? initialValues;

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {state.error && (
        <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="title" className="mb-2 block text-xs font-medium text-white/70">
          Başlık
        </label>
        <input
          id="title"
          name="title"
          required
          maxLength={150}
          defaultValue={values.title}
          placeholder="Ör. U-12 Takımımız Çeyrek Finalde!"
          className={inputClass}
        />
        <FieldError message={errors.title} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className="mb-2 block text-xs font-medium text-white/70">
            Tarih
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={values.date}
            className={`${inputClass} [color-scheme:dark]`}
          />
          <FieldError message={errors.date} />
        </div>
        <div>
          <label htmlFor="tag" className="mb-2 block text-xs font-medium text-white/70">
            Etiket <span className="text-white/40">(isteğe bağlı)</span>
          </label>
          <input
            id="tag"
            name="tag"
            list="tag-suggestions"
            maxLength={30}
            defaultValue={values.tag}
            placeholder="Duyuru, Başarı, Maç…"
            className={inputClass}
          />
          <datalist id="tag-suggestions">
            {TAG_SUGGESTIONS.map((tag) => (
              <option key={tag} value={tag} />
            ))}
          </datalist>
          <FieldError message={errors.tag} />
        </div>
      </div>

      <div>
        <label htmlFor="summary" className="mb-2 block text-xs font-medium text-white/70">
          Haber metni
        </label>
        <textarea
          id="summary"
          name="summary"
          required
          rows={6}
          maxLength={3000}
          defaultValue={values.summary}
          placeholder="Haberin tamamı. Anasayfadaki kartta ilk birkaç satırı görünür."
          className={`${inputClass} resize-y leading-relaxed`}
        />
        <FieldError message={errors.summary} />
      </div>

      <fieldset>
        <legend className="mb-2 block text-xs font-medium text-white/70">
          Görsel <span className="text-white/40">(isteğe bağlı)</span>
        </legend>
        <input type="hidden" name="image" value={image} />

        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-white/10">
            {image ? (
              <Image src={image} alt="Seçili görsel" fill sizes="128px" className="object-cover" />
            ) : (
              <span className="flex h-full items-center justify-center text-white/30">
                <ImageOff size={20} />
              </span>
            )}
          </div>
          <div className="min-w-0 text-sm">
            <p className="font-medium">{image ? "Seçili görsel" : "Görsel yok"}</p>
            {image && (
              <button type="button" onClick={() => setImage("")} className="mt-1 text-xs text-white/60 underline hover:text-white">
                Görseli kaldır
              </button>
            )}
          </div>
        </div>

        <details className="group mt-3 rounded-2xl border border-white/10 bg-white/5">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-white/80 marker:hidden hover:text-white">
            Sitedeki fotoğraflardan seç <span className="text-white/40 group-open:hidden">↓</span>
          </summary>
          <div className="grid grid-cols-3 gap-2 px-3 pb-3 sm:grid-cols-4">
            {imageOptions.map((option) => {
              const selected = option.src === image;
              return (
                <button
                  key={option.src}
                  type="button"
                  onClick={() => setImage(option.src)}
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
        <FieldError message={errors.image} />
      </fieldset>

      <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
        <SaveButton label={submitLabel} />
        <Link href="/admin/haberler" className="rounded-full px-5 py-3 text-sm font-semibold text-white/70 hover:text-white">
          Vazgeç
        </Link>
      </div>
    </form>
  );
}
