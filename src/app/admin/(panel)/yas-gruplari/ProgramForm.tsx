"use client";

import { useActionState } from "react";
import { Field, FormError, SaveButton, inputClass } from "@/components/admin/form";
import { FormFooter } from "@/components/admin/ui";
import type { FormState } from "@/lib/admin/form";

export type ProgramFormValues = { code: string; range: string; title: string; description: string; days: string };

export function ProgramForm({
  action,
  initialValues,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initialValues: ProgramFormValues;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, {});
  const e = state.fieldErrors ?? {};
  const v = { ...initialValues, ...state.values };

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <FormError message={state.error} />
      <div className="grid gap-6 sm:grid-cols-3">
        <Field label="Grup kodu" htmlFor="code" error={e.code}>
          <input id="code" name="code" maxLength={12} defaultValue={v.code} aria-invalid={!!e.code} placeholder="U-12" className={inputClass} />
        </Field>
        <Field label="Yaş aralığı" htmlFor="range" error={e.range}>
          <input id="range" name="range" maxLength={30} defaultValue={v.range} aria-invalid={!!e.range} placeholder="11–12 yaş" className={inputClass} />
        </Field>
        <Field label="Seviye adı" htmlFor="title" error={e.title}>
          <input id="title" name="title" maxLength={40} defaultValue={v.title} aria-invalid={!!e.title} placeholder="Temel Teknik" className={inputClass} />
        </Field>
      </div>
      <Field label="Açıklama" htmlFor="description" error={e.description}>
        <textarea id="description" name="description" rows={3} maxLength={300} defaultValue={v.description}
          aria-invalid={!!e.description} className={`${inputClass} resize-y leading-relaxed`} />
      </Field>
      <Field label="Antrenman günleri" htmlFor="days" error={e.days} hint="Anasayfadaki grup kartının altında görünür.">
        <input id="days" name="days" maxLength={60} defaultValue={v.days} aria-invalid={!!e.days} placeholder="Salı · Perşembe" className={inputClass} />
      </Field>
      <FormFooter cancelHref="/admin/yas-gruplari">
        <SaveButton label={submitLabel} />
      </FormFooter>
    </form>
  );
}
