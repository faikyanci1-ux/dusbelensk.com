"use client";

import { useActionState } from "react";
import { Field, FormError, SaveButton, inputClass } from "@/components/admin/form";
import { FormFooter } from "@/components/admin/ui";
import type { FormState } from "@/lib/admin/form";

export type EventFormValues = { title: string; date: string; time: string; location: string; tag: string };

const TAG_SUGGESTIONS = ["Hazırlık Maçı", "Lig Maçı", "Turnuva", "Deneme Antrenmanı", "Kayıt Günü", "Veli Toplantısı"];

export function EventForm({
  action,
  initialValues,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initialValues: EventFormValues;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, {});
  const e = state.fieldErrors ?? {};
  const v = { ...initialValues, ...state.values };

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <FormError message={state.error} />

      <Field label="Başlık" htmlFor="title" error={e.title} hint="Maçlar için ör. “Düşbelen SK – Köyceğiz Belediyespor”">
        <input id="title" name="title" maxLength={120} defaultValue={v.title} aria-invalid={!!e.title} className={inputClass} />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Tarih" htmlFor="date" error={e.date}>
          <input id="date" name="date" type="date" defaultValue={v.date} aria-invalid={!!e.date}
            className={`${inputClass} [color-scheme:dark]`} />
        </Field>
        <Field label="Saat" htmlFor="time" optional error={e.time}>
          <input id="time" name="time" type="time" defaultValue={v.time} aria-invalid={!!e.time}
            className={`${inputClass} [color-scheme:dark]`} />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Yer" htmlFor="location" error={e.location}>
          <input id="location" name="location" maxLength={120} defaultValue={v.location} aria-invalid={!!e.location}
            placeholder="Düşbelen SK Tesisleri" className={inputClass} />
        </Field>
        <Field label="Tür" htmlFor="tag" error={e.tag}>
          <input id="tag" name="tag" list="event-tags" maxLength={40} defaultValue={v.tag} aria-invalid={!!e.tag}
            placeholder="Hazırlık Maçı, Turnuva…" className={inputClass} />
          <datalist id="event-tags">
            {TAG_SUGGESTIONS.map((tag) => (
              <option key={tag} value={tag} />
            ))}
          </datalist>
        </Field>
      </div>

      <FormFooter cancelHref="/admin/etkinlikler">
        <SaveButton label={submitLabel} />
      </FormFooter>
    </form>
  );
}
