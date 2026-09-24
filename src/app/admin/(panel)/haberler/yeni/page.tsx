import { AdminPageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/adminSession";
import { getImageOptions, isUploadEnabled } from "@/lib/admin/images";
import { todayInTurkey } from "@/lib/siteSettings";
import { createNews } from "../actions";
import { NewsForm } from "../NewsForm";

export const metadata = { title: "Yeni Haber" };

export default async function NewNewsPage() {
  await requireAdmin();
  return (
    <>
      <AdminPageHeader title="Yeni Haber" back={{ href: "/admin/haberler", label: "Haberler" }} />
      <NewsForm
        action={createNews}
        initialValues={{ title: "", date: todayInTurkey(), summary: "", image: "", tag: "" }}
        imageOptions={await getImageOptions()}
        uploadEnabled={isUploadEnabled()}
        submitLabel="Haberi Yayınla"
      />
    </>
  );
}
