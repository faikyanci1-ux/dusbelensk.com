import { AdminPageHeader } from "@/components/admin/ui";
import { requireModule } from "@/lib/adminSession";
import { getImageOptions, getVideoFiles, isUploadEnabled } from "@/lib/admin/images";
import { createVideo } from "../actions";
import { VideoForm } from "../VideoForm";

export const metadata = { title: "Video Ekle" };

export default async function NewVideoPage() {
  await requireModule("videolar");
  return (
    <>
      <AdminPageHeader title="Video Ekle" back={{ href: "/admin/videolar", label: "Videolar" }} />
      <VideoForm
        action={createVideo}
        initialValues={{ src: "", caption: "", poster: "" }}
        imageOptions={await getImageOptions()}
        uploadEnabled={isUploadEnabled()}
        videoFiles={await getVideoFiles()}
        submitLabel="Video Ekle"
      />
    </>
  );
}
