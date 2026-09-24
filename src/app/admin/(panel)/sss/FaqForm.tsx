"use client";

import { useActionState } from "react";
import { Field, FormError, SaveButton, inputClass } from "@/components/admin/form";
import { FormFooter } from "@/components/admin/ui";
import type { FormState } from "@/lib/admin/form";

export function FaqForm({
  action,
  initialValues,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initialValues: { question: string; answer: string };
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, {});
  const e = state.fieldErrors ?? {};
  const v = { ...initialValues, ...state.values };

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <FormError message={state.error} />
      <Field label="Soru" htmlFor="question" error={e.question}>
        <input id="question" name="question" maxLength={200} defaultValue={v.question} aria-invalid={!!e.question}
          placeholder="Ör. Antrenmanlar hangi günler yapılıyor?" className={inputClass} />
      </Field>
      <Field label="Cevap" htmlFor="answer" error={e.answer}>
        <textarea id="answer" name="answer" rows={6} maxLength={1500} defaultValue={v.answer} aria-invalid={!!e.answer}
          className={`${inputClass} resize-y leading-relaxed`} />
      </Field>
      <FormFooter cancelHref="/admin/sss">
        <SaveButton label={submitLabel} />
      </FormFooter>
    </form>
  );
}
