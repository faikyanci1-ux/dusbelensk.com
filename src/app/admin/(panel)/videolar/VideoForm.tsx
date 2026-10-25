"use client";

import { useActionState } from "react";
import { Field, FormError, SaveButton, inputClass } from "@/components/admin/form";
import { ImageField, type ImageOption } from "@/components/admin/ImageField";
import { FormFooter } from "@/components/admin/ui";
import type { FormState } from "@/lib/admin/form";

export type VideoFormValues = { src: string; caption: string; poster: string };

export function VideoForm({
  action,
  initialValues,
  imageOptions,
  uploadEnabled,
  videoFiles,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initialValues: VideoFormValues;
  imageOptions: ImageOption[];
  uploadEnabled: boolean;
  /** Sitede hazır duran video dosyaları (public/videos). */
  videoFiles: string[];
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, {});
  const e = state.fieldErrors ?? {};
  const v: Record<string, string> = { ...initialValues, ...state.values };

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <FormError message={state.error} />

      <Field label="Video" htmlFor="src" error={e.src}
        hint="Listeden sitedeki hazır bir video seçin ya da https:// ile başlayan bir .mp4 adresi yazın. Yeni video dosyası eklemek için dosyanın siteye yüklenmesi gerekir.">
        <input id="src" name="src" list="video-files" defaultValue={v.src} aria-invalid={!!e.src}
          placeholder="/videos/ornek.mp4" className={inputClass} autoComplete="off" />
        <datalist id="video-files">
          {videoFiles.map((file) => (
            <option key={file} value={file} />
          ))}
        </datalist>
      </Field>

      <Field label="Başlık" htmlFor="caption" error={e.caption}>
        <input id="caption" name="caption" maxLength={140} defaultValue={v.caption} aria-invalid={!!e.caption}
          placeholder="Ör. Maç Günü · Drone Görüntüsü" className={inputClass} />
      </Field>

      <ImageField name="poster" label="Kapak fotoğrafı" optional={false} initialValue={initialValues.poster}
        options={imageOptions} uploadEnabled={uploadEnabled} folder="galeri" error={e.poster} aspect="aspect-[16/9]" />

      <FormFooter cancelHref="/admin/videolar">
        <SaveButton label={submitLabel} />
      </FormFooter>
    </form>
  );
}
