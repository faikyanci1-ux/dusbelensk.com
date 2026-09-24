import { AdminPageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/adminSession";
import { PEOPLE_IMAGES, getImageOptions, isUploadEnabled } from "@/lib/admin/images";
import { createStaff } from "../actions";
import { StaffForm } from "../StaffForm";

export const metadata = { title: "Kişi Ekle" };

export default async function NewStaffPage() {
  await requireAdmin();
  return (
    <>
      <AdminPageHeader title="Teknik Kadroya Kişi Ekle" back={{ href: "/admin/teknik-kadro", label: "Teknik Kadro" }} />
      <StaffForm
        action={createStaff}
        initialValues={{ name: "", role: "", description: "", photo: "", quote: "" }}
        imageOptions={await getImageOptions(PEOPLE_IMAGES)}
        uploadEnabled={isUploadEnabled()}
        submitLabel="Kişiyi Ekle"
      />
    </>
  );
}
