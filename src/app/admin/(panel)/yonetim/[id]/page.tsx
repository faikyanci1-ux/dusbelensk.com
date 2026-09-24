import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { boardMembers } from "@/db/schema";
import { AdminPageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/adminSession";
import { PEOPLE_IMAGES, getImageOptions, isUploadEnabled } from "@/lib/admin/images";
import { updateBoardMember } from "../actions";
import { BoardForm } from "../BoardForm";

export const metadata = { title: "Üyeyi Düzenle" };

export default async function EditBoardMemberPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const [m] = await getDb().select().from(boardMembers).where(eq(boardMembers.id, id));
  if (!m) notFound();

  return (
    <>
      <AdminPageHeader title={m.name} back={{ href: "/admin/yonetim", label: "Yönetim Kurulu" }} />
      <BoardForm
        action={updateBoardMember.bind(null, m.id)}
        initialValues={{
          boardType: m.boardType,
          name: m.name,
          role: m.role,
          photo: m.photo ?? "",
          quote: m.quote ?? "",
          bio: m.bio ?? "",
          values: m.values.join("\n"),
          mottos: m.mottos.join("\n"),
        }}
        imageOptions={await getImageOptions(PEOPLE_IMAGES)}
        uploadEnabled={isUploadEnabled()}
        submitLabel="Değişiklikleri Kaydet"
      />
    </>
  );
}
