import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { galleryItems } from "@/db/schema";
import { AdminPageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/adminSession";
import { getImageOptions, isUploadEnabled } from "@/lib/admin/images";
import { updateGalleryItem } from "../actions";
import { GalleryForm } from "../GalleryForm";

export const metadata = { title: "Fotoğrafı Düzenle" };

export default async function EditGalleryItemPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const [item] = await getDb().select().from(galleryItems).where(eq(galleryItems.id, id));
  if (!item) notFound();

  return (
    <>
      <AdminPageHeader title="Fotoğrafı Düzenle" back={{ href: "/admin/galeri", label: "Galeri" }} />
      <GalleryForm
        action={updateGalleryItem.bind(null, item.id)}
        initialValues={{ src: item.src, alt: item.alt, size: item.size ?? "" }}
        imageOptions={await getImageOptions()}
        uploadEnabled={isUploadEnabled()}
        submitLabel="Değişiklikleri Kaydet"
      />
    </>
  );
}
