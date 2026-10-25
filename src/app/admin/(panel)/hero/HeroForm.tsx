"use client";

import { useActionState } from "react";
import { Field, FormError, SaveButton } from "@/components/admin/form";
import { inputClass } from "@/components/admin/form";
import { ImageField, type ImageOption } from "@/components/admin/ImageField";
import { FormFooter } from "@/components/admin/ui";
import type { FormState } from "@/lib/admin/form";

export type HeroFormValues = { src: string; caption: string; focusX: string; focusY: string };

export function HeroForm({
  action,
  initialValues,
  imageOptions,
  uploadEnabled,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initialValues: HeroFormValues;
  imageOptions: ImageOption[];
  uploadEnabled: boolean;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, {});
  const e = state.fieldErrors ?? {};
  const v: Record<string, string> = { ...initialValues, ...state.values };

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <FormError message={state.error} />

      <ImageField name="src" label="Fotoğraf" optional={false} initialValue={initialValues.src} options={imageOptions}
        uploadEnabled={uploadEnabled} folder="galeri" error={e.src} aspect="aspect-[16/9]" />

      <Field label="Açıklama" htmlFor="caption" error={e.caption} hint="Slaytın altında küçük yazı olarak görünür.">
        <input id="caption" name="caption" maxLength={140} defaultValue={v.caption} aria-invalid={!!e.caption}
          placeholder="Ör. Maç Sonrası · Galibiyet Sevinci" className={inputClass} />
      </Field>

      <fieldset className="rounded-2xl border border-white/10 p-4">
        <legend className="px-2 text-xs font-medium text-white/70">Kadraj: geniş ekranda fotoğraf kırpılırken nereye odaklansın</legend>
        <p className="mb-3 text-xs text-white/45">
          Kişilerin kafası kesiliyorsa dikey odağı yukarı çekin (küçük değer = üst kısım). Emin değilseniz ortada bırakın.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Yatay (0 sol, 100 sağ)" htmlFor="focusX" error={e.focusX}>
            <input id="focusX" name="focusX" type="range" min={0} max={100} defaultValue={v.focusX} className="w-full accent-[var(--color-accent-bright)]" />
          </Field>
          <Field label="Dikey (0 üst, 100 alt)" htmlFor="focusY" error={e.focusY}>
            <input id="focusY" name="focusY" type="range" min={0} max={100} defaultValue={v.focusY} className="w-full accent-[var(--color-accent-bright)]" />
          </Field>
        </div>
      </fieldset>

      <FormFooter cancelHref="/admin/hero">
        <SaveButton label={submitLabel} />
      </FormFooter>
    </form>
  );
}
