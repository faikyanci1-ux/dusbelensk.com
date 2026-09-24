"use client";

import { useActionState } from "react";
import { Field, FormError, SaveButton, inputClass } from "@/components/admin/form";
import { ImageField, type ImageOption } from "@/components/admin/ImageField";
import { FormFooter } from "@/components/admin/ui";
import type { FormState } from "@/lib/admin/form";

export type GalleryFormValues = { src: string; alt: string; size: string };

const SIZES = [
  { value: "", label: "Normal", hint: "Tek kare" },
  { value: "wide", label: "Geniş", hint: "Yatayda 2 kare" },
  { value: "large", label: "Büyük", hint: "2×2 kare" },
];

export function GalleryForm({
  action,
  initialValues,
  imageOptions,
  uploadEnabled,
  submitLabel,
  isNew,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initialValues: GalleryFormValues;
  imageOptions: ImageOption[];
  uploadEnabled: boolean;
  submitLabel: string;
  isNew?: boolean;
}) {
  const [state, formAction] = useActionState(action, {});
  const e = state.fieldErrors ?? {};
  const v: Record<string, string> = { ...initialValues, ...state.values };

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <FormError message={state.error} />

      <ImageField name="src" label="Fotoğraf" optional={false} initialValue={initialValues.src} options={imageOptions}
        uploadEnabled={uploadEnabled} folder="galeri" error={e.src} />

      <Field label="Açıklama" htmlFor="alt" error={e.alt} hint="Fotoğrafa tıklanınca altında görünür; görme engelli ziyaretçiler için de okunur.">
        <input id="alt" name="alt" maxLength={140} defaultValue={v.alt} aria-invalid={!!e.alt}
          placeholder="Ör. U-12 takımımız kupa töreninde" className={inputClass} />
      </Field>

      <fieldset>
        <legend className="mb-2 block text-xs font-medium text-white/70">Galerideki kutu boyutu</legend>
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map((size) => (
            <label key={size.value} className="cursor-pointer rounded-xl border border-white/15 p-3 text-sm transition has-[:checked]:border-accent-bright has-[:checked]:bg-accent-bright/10">
              <input type="radio" name="size" value={size.value} defaultChecked={v.size === size.value} className="sr-only" />
              <span className="block font-semibold">{size.label}</span>
              <span className="block text-xs text-white/50">{size.hint}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {isNew && (
        <fieldset>
          <legend className="mb-2 block text-xs font-medium text-white/70">Galerideki yeri</legend>
          <p className="mb-2 text-xs text-white/45">
            Galerinin ilk 6 fotoğrafı anasayfa slaytında da görünür; başa eklenen fotoğraf slayta girer.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" name="position" value="start" defaultChecked={v.position !== "end"} className="accent-[var(--color-accent-bright)]" />
              En başa ekle
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="position" value="end" defaultChecked={v.position === "end"} className="accent-[var(--color-accent-bright)]" />
              En sona ekle
            </label>
          </div>
        </fieldset>
      )}

      <FormFooter cancelHref="/admin/galeri">
        <SaveButton label={submitLabel} />
      </FormFooter>
    </form>
  );
}
