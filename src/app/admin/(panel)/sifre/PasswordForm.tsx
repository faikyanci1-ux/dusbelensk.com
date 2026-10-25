"use client";

import { useActionState } from "react";
import { Field, FormError, SaveButton, inputClass } from "@/components/admin/form";
import type { FormState } from "@/lib/admin/form";

export function PasswordForm({ action }: { action: (state: FormState, formData: FormData) => Promise<FormState> }) {
  const [state, formAction] = useActionState(action, {});
  const e = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <FormError message={state.error} />
      <Field label="Mevcut şifre" htmlFor="current" error={e.current}>
        <input id="current" name="current" type="password" autoComplete="current-password" aria-invalid={!!e.current} className={inputClass} />
      </Field>
      <Field label="Yeni şifre" htmlFor="password" error={e.password} hint="En az 10 karakter. Diğer cihazlardaki oturumlarınız kapatılır.">
        <input id="password" name="password" type="password" autoComplete="new-password" aria-invalid={!!e.password} className={inputClass} />
      </Field>
      <Field label="Yeni şifre (tekrar)" htmlFor="passwordConfirm" error={e.passwordConfirm}>
        <input id="passwordConfirm" name="passwordConfirm" type="password" autoComplete="new-password" aria-invalid={!!e.passwordConfirm} className={inputClass} />
      </Field>
      <SaveButton label="Şifreyi Değiştir" />
    </form>
  );
}
