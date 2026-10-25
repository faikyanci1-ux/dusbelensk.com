import { AdminPageHeader } from "@/components/admin/ui";
import { requireModule } from "@/lib/adminSession";
import { getImageOptions, isUploadEnabled } from "@/lib/admin/images";
import { createHeroSlide } from "../actions";
import { HeroForm } from "../HeroForm";

export const metadata = { title: "Slayt Ekle" };

export default async function NewHeroSlidePage() {
  await requireModule("hero");
  return (
    <>
      <AdminPageHeader title="Slayt Ekle" back={{ href: "/admin/hero", label: "Anasayfa Slaytı" }} />
      <HeroForm
        action={createHeroSlide}
        initialValues={{ src: "", caption: "", focusX: "50", focusY: "50" }}
        imageOptions={await getImageOptions()}
        uploadEnabled={isUploadEnabled()}
        submitLabel="Slayta Ekle"
      />
    </>
  );
}
