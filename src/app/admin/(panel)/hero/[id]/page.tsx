import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { heroSlides } from "@/db/schema";
import { AdminPageHeader } from "@/components/admin/ui";
import { requireModule } from "@/lib/adminSession";
import { getImageOptions, isUploadEnabled } from "@/lib/admin/images";
import { updateHeroSlide } from "../actions";
import { HeroForm } from "../HeroForm";

export const metadata = { title: "Slaytı Düzenle" };

/** "50% 25%" -> { x: "50", y: "25" } */
function parseFocus(focus: string | null) {
  const m = focus?.match(/^(\d{1,3})% (\d{1,3})%$/);
  return { x: m?.[1] ?? "50", y: m?.[2] ?? "50" };
}

export default async function EditHeroSlidePage({ params }: { params: Promise<{ id: string }> }) {
  await requireModule("hero");
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const [item] = await getDb().select().from(heroSlides).where(eq(heroSlides.id, id));
  if (!item) notFound();
  const focus = parseFocus(item.focus);

  return (
    <>
      <AdminPageHeader title="Slaytı Düzenle" back={{ href: "/admin/hero", label: "Anasayfa Slaytı" }} />
      <HeroForm
        action={updateHeroSlide.bind(null, item.id)}
        initialValues={{ src: item.src, caption: item.caption, focusX: focus.x, focusY: focus.y }}
        imageOptions={await getImageOptions()}
        uploadEnabled={isUploadEnabled()}
        submitLabel="Değişiklikleri Kaydet"
      />
    </>
  );
}
