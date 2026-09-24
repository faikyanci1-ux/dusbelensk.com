import { AdminPageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/adminSession";
import { PEOPLE_IMAGES, getImageOptions, isUploadEnabled } from "@/lib/admin/images";
import { createBoardMember } from "../actions";
import { BoardForm } from "../BoardForm";

export const metadata = { title: "Üye Ekle" };

export default async function NewBoardMemberPage({ searchParams }: { searchParams: Promise<{ kurul?: string }> }) {
  await requireAdmin();
  const { kurul } = await searchParams;
  return (
    <>
      <AdminPageHeader title="Kurula Üye Ekle" back={{ href: "/admin/yonetim", label: "Yönetim Kurulu" }} />
      <BoardForm
        action={createBoardMember}
        initialValues={{
          boardType: kurul === "denetleme" ? "audit" : "management",
          name: "",
          role: "",
          photo: "",
          quote: "",
          bio: "",
          values: "",
          mottos: "",
        }}
        imageOptions={await getImageOptions(PEOPLE_IMAGES)}
        uploadEnabled={isUploadEnabled()}
        submitLabel="Üyeyi Ekle"
      />
    </>
  );
}
