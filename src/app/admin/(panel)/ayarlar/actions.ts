"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { siteSettings } from "@/db/schema";
import { requireAdmin } from "@/lib/adminSession";
import { lines, paragraphs, readForm, revalidateSite, validate, type FormState } from "@/lib/admin/form";
import type { ClubSettings } from "@/lib/siteSettings";

const RULES = {
  phone: { label: "Telefon", required: true, max: 20 },
  whatsappNumber: { label: "WhatsApp numarası", required: true, max: 20 },
  instagramHandle: { label: "Instagram kullanıcı adı", required: true, max: 40 },
  address: { label: "Adres", required: true, max: 160 },
  athleteCount: { label: "Sporcu sayısı (metin)", required: true, max: 30 },
  athleteStat: { label: "Sporcu sayısı (kutu)", required: true, max: 8 },
  foundedYear: { label: "Kuruluş yılı", required: true, kind: "int" as const, min: 1900, maxValue: 2100 },
  officialMatchCount: { label: "Maç sayısı", required: true, max: 8 },
  ageRange: { label: "Altyapı yaş aralığı", required: true, max: 12 },
  schoolBirthYearFrom: { label: "İlk doğum yılı", required: true, kind: "int" as const, min: 1990, maxValue: 2100 },
  schoolBirthYearTo: { label: "Son doğum yılı", required: true, kind: "int" as const, min: 1990, maxValue: 2100 },
  schoolRegistrationUrl: { label: "Kayıt formu adresi", required: true, kind: "url" as const, max: 300 },
  nextMatchOpponent: { label: "Rakip", max: 60 },
  nextMatchDate: { label: "Maç tarihi", kind: "date" as const },
  nextMatchTime: { label: "Maç saati", kind: "time" as const },
  nextMatchLocation: { label: "Maç yeri", max: 80 },
  nextMatchTag: { label: "Maç türü", max: 40 },
  aboutDescription: { label: "Tanıtım metni", required: true, max: 2000 },
  aboutMission: { label: "Misyon cümlesi", required: true, max: 400 },
  aboutHighlights: { label: "Öne çıkanlar", required: true, max: 800 },
  aboutQuote: { label: "Başkanın sözü", required: true, max: 300 },
  aboutCoachNote: { label: "Teknik direktör notu", required: true, max: 800 },
};

export async function saveSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const v = readForm(formData);
  const fieldErrors = validate(v, RULES);

  if (v.phone && v.phone.replace(/\D/g, "").length < 10) fieldErrors.phone = "Geçerli bir telefon numarası girin.";
  if (v.instagramHandle && !/^@?[A-Za-z0-9._]{1,30}$/.test(v.instagramHandle)) {
    fieldErrors.instagramHandle = "Yalnızca harf, rakam, nokta ve alt çizgi kullanılabilir (ör. dusbelensk).";
  }
  if (v.whatsappNumber && v.whatsappNumber.replace(/\D/g, "").length < 10) {
    fieldErrors.whatsappNumber = "Geçerli bir WhatsApp numarası girin.";
  }
  if (!fieldErrors.schoolBirthYearFrom && !fieldErrors.schoolBirthYearTo && Number(v.schoolBirthYearFrom) > Number(v.schoolBirthYearTo)) {
    fieldErrors.schoolBirthYearTo = "Son doğum yılı ilk doğum yılından küçük olamaz.";
  }
  const nextMatchEnabled = v.nextMatchEnabled === "on";
  if (nextMatchEnabled) {
    if (!v.nextMatchOpponent) fieldErrors.nextMatchOpponent = "Sıradaki maç gösterilecekse rakip zorunlu.";
    if (!v.nextMatchDate) fieldErrors.nextMatchDate = "Sıradaki maç gösterilecekse tarih zorunlu.";
  }
  if (Object.keys(fieldErrors).length) {
    return { fieldErrors, values: v, error: "Bazı alanlar hatalı — kırmızı işaretli alanları kontrol edin." };
  }

  const settings: ClubSettings = {
    phone: v.phone,
    whatsappNumber: v.whatsappNumber.replace(/\D/g, ""),
    address: v.address,
    instagramHandle: v.instagramHandle.replace(/^@/, ""),
    athleteCount: v.athleteCount,
    athleteStat: v.athleteStat,
    foundedYear: Number(v.foundedYear),
    officialMatchCount: v.officialMatchCount,
    ageRange: v.ageRange,
    school: {
      birthYearFrom: Number(v.schoolBirthYearFrom),
      birthYearTo: Number(v.schoolBirthYearTo),
      registrationUrl: v.schoolRegistrationUrl,
    },
    nextMatch: {
      enabled: nextMatchEnabled,
      opponent: v.nextMatchOpponent ?? "",
      date: v.nextMatchDate ?? "",
      time: v.nextMatchTime ?? "",
      location: v.nextMatchLocation ?? "",
      tag: v.nextMatchTag ?? "",
    },
    about: {
      description: paragraphs(v.aboutDescription),
      mission: v.aboutMission,
      highlights: lines(v.aboutHighlights),
      quoteText: v.aboutQuote,
      coachNoteText: v.aboutCoachNote,
    },
  };

  try {
    await getDb()
      .insert(siteSettings)
      .values({ key: "club", value: settings })
      .onConflictDoUpdate({ target: siteSettings.key, set: { value: settings, updatedAt: new Date() } });
  } catch (error) {
    console.error("[saveSettings]", error);
    return { error: "Ayarlar kaydedilemedi. Lütfen tekrar deneyin.", values: v };
  }

  revalidateSite();
  redirect("/admin/ayarlar?durum=kaydedildi");
}
