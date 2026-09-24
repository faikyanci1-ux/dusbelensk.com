"use client";

import { useActionState } from "react";
import { Field, FormError, SaveButton, inputClass } from "@/components/admin/form";
import type { FormState } from "@/lib/admin/form";

function Section({ id, title, description, children }: { id?: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <h2 className="font-semibold">{title}</h2>
      {description && <p className="mt-1 text-xs text-white/50">{description}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

export function SettingsForm({
  action,
  initialValues,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initialValues: Record<string, string>;
}) {
  const [state, formAction] = useActionState(action, {});
  const e = state.fieldErrors ?? {};
  // Checkbox işaretli değilse formda hiç gönderilmez; hata dönüşünde doğru durumu korumak için ayrıca bak.
  const v = state.values ? { ...initialValues, nextMatchEnabled: "", ...state.values } : initialValues;

  const input = (name: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <input id={name} name={name} defaultValue={v[name]} aria-invalid={!!e[name]} className={inputClass} {...props} />
  );
  const textarea = (name: string, rows: number) => (
    <textarea id={name} name={name} rows={rows} defaultValue={v[name]} aria-invalid={!!e[name]}
      className={`${inputClass} resize-y leading-relaxed`} />
  );

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <FormError message={state.error} />

      <Section title="İletişim" description="Footer, İletişim sayfası, WhatsApp butonları ve Google bilgilerinde kullanılır.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Telefon" htmlFor="phone" error={e.phone}>{input("phone", { inputMode: "tel", placeholder: "0532 616 00 48" })}</Field>
          <Field label="WhatsApp numarası" htmlFor="whatsappNumber" error={e.whatsappNumber} hint="Başında 0 ya da 90 olabilir.">
            {input("whatsappNumber", { inputMode: "tel", placeholder: "0532 616 00 48" })}
          </Field>
          <Field label="Instagram kullanıcı adı" htmlFor="instagramHandle" error={e.instagramHandle}>
            {input("instagramHandle", { placeholder: "dusbelensk" })}
          </Field>
          <Field label="Adres" htmlFor="address" error={e.address}>{input("address")}</Field>
        </div>
      </Section>

      <Section title="Sayılar" description="Anasayfa ve Hakkımızda sayfasındaki istatistik kutuları ve metinler.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Sporcu sayısı (metinlerde)" htmlFor="athleteCount" error={e.athleteCount} hint="Ör. “100'e yakın” → “100'e yakın sporcumuzla…”">
            {input("athleteCount")}
          </Field>
          <Field label="Sporcu sayısı (istatistik kutusu)" htmlFor="athleteStat" error={e.athleteStat} hint="Ör. ~100">
            {input("athleteStat")}
          </Field>
          <Field label="Kuruluş yılı" htmlFor="foundedYear" error={e.foundedYear}>{input("foundedYear", { inputMode: "numeric" })}</Field>
          <Field label="Resmi / özel maç sayısı" htmlFor="officialMatchCount" error={e.officialMatchCount} hint="Ör. +50">
            {input("officialMatchCount")}
          </Field>
          <Field label="Altyapı yaş aralığı" htmlFor="ageRange" error={e.ageRange} hint="Ör. 11-17">{input("ageRange")}</Field>
        </div>
      </Section>

      <Section title="Futbol Okulu" description="Kayıt linki değişirse sitedeki tüm QR kodlar otomatik olarak yeni adrese göre yenilenir.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="İlk doğum yılı" htmlFor="schoolBirthYearFrom" error={e.schoolBirthYearFrom}>
            {input("schoolBirthYearFrom", { inputMode: "numeric" })}
          </Field>
          <Field label="Son doğum yılı" htmlFor="schoolBirthYearTo" error={e.schoolBirthYearTo}>
            {input("schoolBirthYearTo", { inputMode: "numeric" })}
          </Field>
        </div>
        <Field label="Ön kayıt formu adresi" htmlFor="schoolRegistrationUrl" error={e.schoolRegistrationUrl}>
          {input("schoolRegistrationUrl", { inputMode: "url", placeholder: "https://…" })}
        </Field>
      </Section>

      <Section id="siradaki-mac" title="Sıradaki Maç" description="Anasayfanın üstündeki şerit. Maç tarihi geçince kendiliğinden gizlenir.">
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="nextMatchEnabled" defaultChecked={v.nextMatchEnabled === "on"}
            className="h-5 w-5 accent-[var(--color-accent-bright)]" />
          Anasayfada göster
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Rakip" htmlFor="nextMatchOpponent" error={e.nextMatchOpponent}>{input("nextMatchOpponent")}</Field>
          <Field label="Maç türü" htmlFor="nextMatchTag" error={e.nextMatchTag}>
            {input("nextMatchTag", { list: "match-tags", placeholder: "Hazırlık Maçı" })}
            <datalist id="match-tags">
              {["Hazırlık Maçı", "Lig Maçı", "Kupa Maçı", "Turnuva"].map((t) => <option key={t} value={t} />)}
            </datalist>
          </Field>
          <Field label="Tarih" htmlFor="nextMatchDate" error={e.nextMatchDate}>
            {input("nextMatchDate", { type: "date", className: `${inputClass} [color-scheme:dark]` })}
          </Field>
          <Field label="Saat" htmlFor="nextMatchTime" optional error={e.nextMatchTime}>
            {input("nextMatchTime", { type: "time", className: `${inputClass} [color-scheme:dark]` })}
          </Field>
        </div>
        <Field label="Yer" htmlFor="nextMatchLocation" error={e.nextMatchLocation}>{input("nextMatchLocation")}</Field>
      </Section>

      <Section title="Hakkımızda metinleri" description="Anasayfadaki “Bizim Hikayemiz” ve Hakkımızda sayfası.">
        <Field label="Tanıtım metni" htmlFor="aboutDescription" error={e.aboutDescription} hint="Paragrafları boş bir satırla ayırın.">
          {textarea("aboutDescription", 7)}
        </Field>
        <Field label="Misyon cümlesi" htmlFor="aboutMission" error={e.aboutMission}>{textarea("aboutMission", 2)}</Field>
        <Field label="Öne çıkanlar" htmlFor="aboutHighlights" error={e.aboutHighlights} hint="Her satıra bir madde.">
          {textarea("aboutHighlights", 5)}
        </Field>
        <Field label="Başkanın sözü" htmlFor="aboutQuote" error={e.aboutQuote}>{textarea("aboutQuote", 2)}</Field>
        <Field label="Teknik direktör notu" htmlFor="aboutCoachNote" error={e.aboutCoachNote} hint="Hakkımızda sayfasında görünür.">
          {textarea("aboutCoachNote", 4)}
        </Field>
      </Section>

      <div className="sticky bottom-0 -mx-4 flex items-center gap-3 border-t border-white/10 bg-bg-main/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border">
        <SaveButton label="Ayarları Kaydet" />
        <span className="text-xs text-white/50">Tüm bölümler birlikte kaydedilir.</span>
      </div>
    </form>
  );
}
