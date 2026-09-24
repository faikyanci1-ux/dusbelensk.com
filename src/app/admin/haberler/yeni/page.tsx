import { requireAdmin } from "@/lib/adminSession";
import { createNews } from "../actions";
import { NewsForm } from "../NewsForm";
import { AdminFormShell, siteImageOptions, todayInTurkey } from "../shared";

export const metadata = { title: "Yeni Haber — Yönetim Paneli", robots: { index: false, follow: false } };

export default async function NewNewsPage() {
  await requireAdmin();

  return (
    <AdminFormShell title="Yeni Haber">
      <NewsForm
        action={createNews}
        initialValues={{ title: "", date: todayInTurkey(), summary: "", image: "", tag: "" }}
        imageOptions={siteImageOptions}
        submitLabel="Haberi Yayınla"
      />
    </AdminFormShell>
  );
}
