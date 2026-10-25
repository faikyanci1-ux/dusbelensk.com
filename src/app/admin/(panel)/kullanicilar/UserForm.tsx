"use client";

import { useActionState } from "react";
import { Field, FormError, SaveButton, inputClass } from "@/components/admin/form";
import { FormFooter } from "@/components/admin/ui";
import type { FormState } from "@/lib/admin/form";
import { ROLE_LABELS } from "@/lib/permissions";

type UserValues = { username: string; displayName: string; role: string; isActive: boolean };

/** Kullanıcı ekleme (create) ve düzenleme (edit) formu. Düzenlemede kullanıcı adı değiştirilemez, şifre ayrı formdadır. */
export function UserForm({
  action,
  initialValues,
  submitLabel,
  mode,
  selfEdit,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initialValues: UserValues;
  submitLabel: string;
  mode: "create" | "edit";
  /** Yönetici kendi kaydını düzenliyorsa rol/aktiflik kilitli gösterilir (sunucu da reddeder). */
  selfEdit?: boolean;
}) {
  const [state, formAction] = useActionState(action, {});
  const e = state.fieldErrors ?? {};
  const v = { ...initialValues, ...state.values };
  const active = state.values ? state.values.isActive === "on" : initialValues.isActive;

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <FormError message={state.error} />
      <Field label="Kullanıcı adı" htmlFor="username" error={e.username}
        hint={mode === "create" ? "Küçük harf, rakam, nokta, tire, alt çizgi (3-32). Sonradan değiştirilemez." : undefined}>
        <input id="username" name="username" maxLength={32} defaultValue={v.username} readOnly={mode === "edit"}
          autoComplete="off" autoCapitalize="none" spellCheck={false} aria-invalid={!!e.username}
          className={`${inputClass} ${mode === "edit" ? "opacity-60" : ""}`} />
      </Field>
      <Field label="Ad Soyad" htmlFor="displayName" error={e.displayName}>
        <input id="displayName" name="displayName" maxLength={60} defaultValue={v.displayName} aria-invalid={!!e.displayName}
          className={inputClass} />
      </Field>
      <Field label="Rol" htmlFor="role" error={e.role}
        hint="Yönetici: her şeyi yönetir, kullanıcı ekleyebilir. Editör: yalnızca Haberler ve Galeri.">
        <select id="role" name={selfEdit ? undefined : "role"} defaultValue={v.role} disabled={selfEdit} className={inputClass}>
          <option value="editor">{ROLE_LABELS.editor}</option>
          <option value="admin">{ROLE_LABELS.admin}</option>
        </select>
        {selfEdit && <input type="hidden" name="role" value={v.role} />}
      </Field>
      {mode === "edit" && (
        <label className="flex items-center gap-3 text-sm text-white/80">
          <input type="checkbox" name={selfEdit ? undefined : "isActive"} defaultChecked={active} disabled={selfEdit} className="h-4 w-4" />
          Hesap aktif (kapatılırsa kullanıcı giriş yapamaz ve açık oturumları hemen düşer)
          {selfEdit && <input type="hidden" name="isActive" value="on" />}
        </label>
      )}
      {mode === "create" && (
        <>
          <Field label="Başlangıç şifresi" htmlFor="password" error={e.password} hint="En az 10 karakter. Kullanıcıya güvenli bir yoldan iletin; kendisi “Şifremi Değiştir”den değiştirebilir.">
            <input id="password" name="password" type="password" autoComplete="new-password" aria-invalid={!!e.password} className={inputClass} />
          </Field>
          <Field label="Şifre (tekrar)" htmlFor="passwordConfirm" error={e.passwordConfirm}>
            <input id="passwordConfirm" name="passwordConfirm" type="password" autoComplete="new-password" aria-invalid={!!e.passwordConfirm} className={inputClass} />
          </Field>
        </>
      )}
      <FormFooter cancelHref="/admin/kullanicilar">
        <SaveButton label={submitLabel} />
      </FormFooter>
    </form>
  );
}
