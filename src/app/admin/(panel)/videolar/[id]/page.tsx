import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { videoItems } from "@/db/schema";
import { AdminPageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/adminSession";
import { getImageOptions, getVideoFiles, isUploadEnabled } from "@/lib/admin/images";
import { updateVideo } from "../actions";
import { VideoForm } from "../VideoForm";

export const metadata = { title: "Videoyu Düzenle" };

export default async function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const [item] = await getDb().select().from(videoItems).where(eq(videoItems.id, id));
  if (!item) notFound();

  return (
    <>
      <AdminPageHeader title="Videoyu Düzenle" back={{ href: "/admin/videolar", label: "Videolar" }} />
      <VideoForm
        action={updateVideo.bind(null, item.id)}
        initialValues={{ src: item.src, caption: item.caption, poster: item.poster }}
        imageOptions={await getImageOptions()}
        uploadEnabled={isUploadEnabled()}
        videoFiles={await getVideoFiles()}
        submitLabel="Değişiklikleri Kaydet"
      />
    </>
  );
}
