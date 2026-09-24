import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { staff } from "@/db/schema";
import { AdminPageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/adminSession";
import { PEOPLE_IMAGES, getImageOptions, isUploadEnabled } from "@/lib/admin/images";
import { updateStaff } from "../actions";
import { StaffForm } from "../StaffForm";

export const metadata = { title: "Kişiyi Düzenle" };

export default async function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const [item] = await getDb().select().from(staff).where(eq(staff.id, id));
  if (!item) notFound();

  return (
    <>
      <AdminPageHeader title={item.name} back={{ href: "/admin/teknik-kadro", label: "Teknik Kadro" }} />
      <StaffForm
        action={updateStaff.bind(null, item.id)}
        initialValues={{ name: item.name, role: item.role, description: item.description, photo: item.photo, quote: item.quote ?? "" }}
        imageOptions={await getImageOptions(PEOPLE_IMAGES)}
        uploadEnabled={isUploadEnabled()}
        submitLabel="Değişiklikleri Kaydet"
      />
    </>
  );
}

