import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { newsItems } from "@/db/schema";
import { requireAdmin } from "@/lib/adminSession";
import { updateNews } from "../actions";
import { NewsForm } from "../NewsForm";
import { AdminFormShell, siteImageOptions } from "../shared";

export const metadata = { title: "Haberi Düzenle — Yönetim Paneli", robots: { index: false, follow: false } };

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const [item] = await getDb().select().from(newsItems).where(eq(newsItems.id, id));
  if (!item) notFound();

  return (
    <AdminFormShell title="Haberi Düzenle">
      <NewsForm
        action={updateNews.bind(null, item.id)}
        initialValues={{
          title: item.title,
          date: item.date,
          summary: item.summary,
          image: item.image ?? "",
          tag: item.tag ?? "",
        }}
        imageOptions={siteImageOptions}
        submitLabel="Değişiklikleri Kaydet"
      />
    </AdminFormShell>
  );
}
