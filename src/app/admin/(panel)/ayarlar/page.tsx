import { AdminPageHeader, StatusBanner } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/adminSession";
import { getSiteSettings } from "@/lib/queries";
import { saveSettings } from "./actions";
import { SettingsForm } from "./SettingsForm";

export const metadata = { title: "Site Ayarları" };

export default async function AdminSettingsPage({ searchParams }: { searchParams: Promise<{ durum?: string }> }) {
  await requireAdmin();
  const { durum } = await searchParams;
  const s = await getSiteSettings();

  return (
    <>
      <AdminPageHeader
        title="Site Ayarları"
        description="Kulübün iletişim bilgileri, sayıları, futbol okulu kaydı, sıradaki maç ve tanıtım metinleri."
      />
      <StatusBanner status={durum} />
      <SettingsForm
        action={saveSettings}
        initialValues={{
          phone: s.phone,
          whatsappNumber: s.whatsappNumber,
          instagramHandle: s.instagramHandle.replace(/^@/, ""),
          address: s.address,
          athleteCount: s.athleteCount,
          athleteStat: s.athleteStat,
          foundedYear: String(s.foundedYear),
          officialMatchCount: s.officialMatchCount,
          ageRange: s.ageRange,
          schoolBirthYearFrom: String(s.school.birthYearFrom),
          schoolBirthYearTo: String(s.school.birthYearTo),
          schoolRegistrationUrl: s.school.registrationUrl,
          nextMatchEnabled: s.nextMatch.enabled ? "on" : "",
          nextMatchOpponent: s.nextMatch.opponent,
          nextMatchDate: s.nextMatch.date,
          nextMatchTime: s.nextMatch.time,
          nextMatchLocation: s.nextMatch.location,
          nextMatchTag: s.nextMatch.tag,
          aboutDescription: s.about.description.join("\n\n"),
          aboutMission: s.about.mission,
          aboutHighlights: s.about.highlights.join("\n"),
          aboutQuote: s.about.quoteText,
          aboutCoachNote: s.about.coachNoteText,
        }}
      />
    </>
  );
}
