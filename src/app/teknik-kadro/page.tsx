import type { Metadata } from "next";
import { getStaff } from "@/lib/queries";
import { PageHero } from "@/components/PageHero";
import { StaffLightbox } from "@/components/StaffLightbox";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Teknik Kadro",
  description:
    "Düşbelen SK teknik kadrosu: gençlik gelişim direktörü, yaş grubu antrenörleri ve kaleci departmanı sorumlusu.",
  path: "/teknik-kadro",
});

export default async function StaffPage() {
  const staff = await getStaff();

  return (
    <>
    <PageHero
      eyebrow="Kulübün Arkasındaki Ekip"
      title="Teknik Kadromuz"
      description="Düşbelen SK'nın arkasındaki ekip; disiplini, düzeni ve gelişimi planlayan isimler."
      image="/images/coach-bg.jpg"
    />
    <div className="bg-cream py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="sr-only">Teknik Kadro Listesi</h2>
        <StaffLightbox items={staff} />
      </div>
    </div>
    </>
  );
}
