"use client";

import { useActionState } from "react";
import { Field, FormError, SaveButton, inputClass } from "@/components/admin/form";
import { ImageField, type ImageOption } from "@/components/admin/ImageField";
import { FormFooter } from "@/components/admin/ui";
import type { FormState } from "@/lib/admin/form";

export type NewsFormValues = { title: string; date: string; summary: string; image: string; tag: string };

const TAG_SUGGESTIONS = ["Duyuru", "Başarı", "Maç", "Kayıt", "Kulüp", "Etkinlik"];

export function NewsForm({
  action,
  initialValues,
  imageOptions,
  uploadEnabled,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initialValues: NewsFormValues;
  imageOptions: ImageOption[];
  uploadEnabled: boolean;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, {});
  const e = state.fieldErrors ?? {};
  // Hata dönünce React formu sıfırlar; yazılanlar kaybolmasın diye gönderilen değerlerle yeniden doldur.
  const v = { ...initialValues, ...state.values };

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <FormError message={state.error} />

      <Field label="Başlık" htmlFor="title" error={e.title}>
        <input id="title" name="title" maxLength={150} defaultValue={v.title} aria-invalid={!!e.title}
          placeholder="Ör. U-12 Takımımız Çeyrek Finalde!" className={inputClass} />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Tarih" htmlFor="date" error={e.date}>
          <input id="date" name="date" type="date" defaultValue={v.date} aria-invalid={!!e.date}
            className={`${inputClass} [color-scheme:dark]`} />
        </Field>
        <Field label="Etiket" htmlFor="tag" optional error={e.tag}>
          <input id="tag" name="tag" list="tag-suggestions" maxLength={30} defaultValue={v.tag}
            placeholder="Duyuru, Başarı, Maç…" className={inputClass} />
          <datalist id="tag-suggestions">
            {TAG_SUGGESTIONS.map((tag) => (
              <option key={tag} value={tag} />
            ))}
          </datalist>
        </Field>
      </div>

      <Field label="Haber metni" htmlFor="summary" error={e.summary} hint="Paragrafları boş bir satırla ayırın. Anasayfadaki kartta ilk birkaç satırı, haber sayfasında tamamı görünür.">
        <textarea id="summary" name="summary" rows={7} maxLength={3000} defaultValue={v.summary} aria-invalid={!!e.summary}
          className={`${inputClass} resize-y leading-relaxed`} />
      </Field>

      <ImageField name="image" label="Görsel" initialValue={initialValues.image} options={imageOptions}
        uploadEnabled={uploadEnabled} folder="haberler" error={e.image} />

      <FormFooter cancelHref="/admin/haberler">
        <SaveButton label={submitLabel} />
      </FormFooter>
    </form>
  );
}
