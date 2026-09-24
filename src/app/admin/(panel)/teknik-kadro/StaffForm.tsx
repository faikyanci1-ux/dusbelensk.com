"use client";

import { useActionState } from "react";
import { Field, FormError, SaveButton, inputClass } from "@/components/admin/form";
import { ImageField, type ImageOption } from "@/components/admin/ImageField";
import { FormFooter } from "@/components/admin/ui";
import type { FormState } from "@/lib/admin/form";

export type StaffFormValues = { name: string; role: string; description: string; photo: string; quote: string };

export function StaffForm({
  action,
  initialValues,
  imageOptions,
  uploadEnabled,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initialValues: StaffFormValues;
  imageOptions: ImageOption[];
  uploadEnabled: boolean;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, {});
  const e = state.fieldErrors ?? {};
  const v = { ...initialValues, ...state.values };

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <FormError message={state.error} />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Ad soyad" htmlFor="name" error={e.name}>
          <input id="name" name="name" maxLength={80} defaultValue={v.name} aria-invalid={!!e.name} className={inputClass} />
        </Field>
        <Field label="Görev" htmlFor="role" error={e.role}>
          <input id="role" name="role" maxLength={120} defaultValue={v.role} aria-invalid={!!e.role}
            placeholder="Ör. U-11 ve U-12 Teknik Sorumlusu" className={inputClass} />
        </Field>
      </div>

      <Field label="Açıklama" htmlFor="description" error={e.description} hint="Teknik Kadro sayfasında kartın altında görünür.">
        <textarea id="description" name="description" rows={4} maxLength={600} defaultValue={v.description}
          aria-invalid={!!e.description} className={`${inputClass} resize-y leading-relaxed`} />
      </Field>

      <Field label="Söz" htmlFor="quote" optional error={e.quote}
        hint="Doluysa kişi anasayfadaki “Yönetim ve Teknik Kadro” slaytında da bu sözle görünür.">
        <input id="quote" name="quote" maxLength={160} defaultValue={v.quote} className={inputClass}
          placeholder="Ör. Küçük adımlarla büyük yarınlara..." />
      </Field>

      <ImageField name="photo" label="Fotoğraf" optional={false} initialValue={initialValues.photo} options={imageOptions}
        uploadEnabled={uploadEnabled} folder="kadro" error={e.photo} aspect="aspect-[3/4]" />

      <FormFooter cancelHref="/admin/teknik-kadro">
        <SaveButton label={submitLabel} />
      </FormFooter>
    </form>
  );
}
