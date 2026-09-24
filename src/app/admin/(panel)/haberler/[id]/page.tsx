import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { newsItems } from "@/db/schema";
import { AdminPageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/adminSession";
import { getImageOptions, isUploadEnabled } from "@/lib/admin/images";
import { updateNews } from "../actions";
import { NewsForm } from "../NewsForm";

export const metadata = { title: "Haberi Düzenle" };

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const [item] = await getDb().select().from(newsItems).where(eq(newsItems.id, id));
  if (!item) notFound();

  return (
    <>
      <AdminPageHeader title="Haberi Düzenle" back={{ href: "/admin/haberler", label: "Haberler" }} />
      <NewsForm
        action={updateNews.bind(null, item.id)}
        initialValues={{ title: item.title, date: item.date, summary: item.summary, image: item.image ?? "", tag: item.tag ?? "" }}
        imageOptions={await getImageOptions()}
        uploadEnabled={isUploadEnabled()}
        submitLabel="Değişiklikleri Kaydet"
      />
    </>
  );
}
