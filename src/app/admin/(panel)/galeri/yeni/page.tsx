import { AdminPageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/adminSession";
import { getImageOptions, isUploadEnabled } from "@/lib/admin/images";
import { createGalleryItem } from "../actions";
import { GalleryForm } from "../GalleryForm";

export const metadata = { title: "Galeriye Fotoğraf Ekle" };

export default async function NewGalleryItemPage() {
  await requireAdmin();
  return (
    <>
      <AdminPageHeader title="Galeriye Fotoğraf Ekle" back={{ href: "/admin/galeri", label: "Galeri" }} />
      <GalleryForm
        action={createGalleryItem}
        initialValues={{ src: "", alt: "", size: "" }}
        imageOptions={await getImageOptions()}
        uploadEnabled={isUploadEnabled()}
        submitLabel="Galeriye Ekle"
        isNew
      />
    </>
  );
}
