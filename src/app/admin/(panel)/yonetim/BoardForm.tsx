"use client";

import { useActionState } from "react";
import { Field, FormError, SaveButton, inputClass } from "@/components/admin/form";
import { ImageField, type ImageOption } from "@/components/admin/ImageField";
import { FormFooter } from "@/components/admin/ui";
import type { FormState } from "@/lib/admin/form";

export type BoardFormValues = {
  boardType: string;
  name: string;
  role: string;
  photo: string;
  quote: string;
  bio: string;
  values: string;
  mottos: string;
};

export function BoardForm({
  action,
  initialValues,
  imageOptions,
  uploadEnabled,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initialValues: BoardFormValues;
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

      <fieldset>
        <legend className="mb-2 block text-xs font-medium text-white/70">Kurul</legend>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "management", label: "Yönetim Kurulu" },
            { value: "audit", label: "Denetleme Kurulu" },
          ].map((option) => (
            <label key={option.value} className="cursor-pointer rounded-xl border border-white/15 p-3 text-sm font-semibold transition has-[:checked]:border-accent-bright has-[:checked]:bg-accent-bright/10">
              <input type="radio" name="boardType" value={option.value} defaultChecked={v.boardType === option.value} className="sr-only" />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Ad soyad" htmlFor="name" error={e.name}>
          <input id="name" name="name" maxLength={80} defaultValue={v.name} aria-invalid={!!e.name} className={inputClass} />
        </Field>
        <Field label="Görev" htmlFor="role" error={e.role} hint="Kurulu değiştirirseniz görevi de güncellemeyi unutmayın.">
          <input id="role" name="role" list="board-roles" maxLength={80} defaultValue={v.role} aria-invalid={!!e.role} className={inputClass} />
          <datalist id="board-roles">
            {["Kulüp Başkanı", "Başkan Yardımcısı", "Yönetim Kurulu Üyesi", "Denetleme Kurulu Başkanı", "Denetleme Kurulu Üyesi"].map((r) => (
              <option key={r} value={r} />
            ))}
          </datalist>
        </Field>
      </div>

      <details className="group rounded-2xl border border-white/10 bg-white/5 p-4" open={Boolean(v.photo || v.bio || v.quote)}>
        <summary className="cursor-pointer list-none text-sm font-semibold marker:hidden">
          Tanıtım kartı <span className="font-normal text-white/50">(isteğe bağlı — başkan gibi öne çıkan üyeler için)</span>
        </summary>
        <p className="mt-2 text-xs text-white/50">
          Yalnızca <strong>Yönetim Kurulu</strong> üyeleri için: fotoğraf eklenirse üye Yönetim sayfasında büyük kartla
          (söz, biyografi, değerler ve sloganlarla) gösterilir; fotoğraf yoksa bu alanlar görünmez. Fotoğraf ve söz
          birlikte doluysa üye anasayfadaki “Yönetim ve Teknik Kadro” slaytında da yer alır.
        </p>
        <div className="mt-5 space-y-6">
          <ImageField name="photo" label="Fotoğraf" initialValue={initialValues.photo} options={imageOptions}
            uploadEnabled={uploadEnabled} folder="yonetim" error={e.photo} aspect="aspect-[2/3]" />
          <Field label="Söz" htmlFor="quote" optional error={e.quote}>
            <input id="quote" name="quote" maxLength={200} defaultValue={v.quote} className={inputClass} />
          </Field>
          <Field label="Biyografi" htmlFor="bio" optional error={e.bio}>
            <textarea id="bio" name="bio" rows={5} maxLength={1500} defaultValue={v.bio} className={`${inputClass} resize-y leading-relaxed`} />
          </Field>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Değerler" htmlFor="values" optional hint="Her satıra bir değer (ör. Takım Ruhu).">
              <textarea id="values" name="values" rows={5} defaultValue={v.values} className={`${inputClass} resize-y`} />
            </Field>
            <Field label="Sloganlar" htmlFor="mottos" optional hint="Her satıra bir slogan.">
              <textarea id="mottos" name="mottos" rows={5} defaultValue={v.mottos} className={`${inputClass} resize-y`} />
            </Field>
          </div>
        </div>
      </details>

      <FormFooter cancelHref="/admin/yonetim">
        <SaveButton label={submitLabel} />
      </FormFooter>
    </form>
  );
}
