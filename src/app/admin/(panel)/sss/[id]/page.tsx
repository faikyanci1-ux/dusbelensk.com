import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { faqItems } from "@/db/schema";
import { AdminPageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/adminSession";
import { updateFaq } from "../actions";
import { FaqForm } from "../FaqForm";

export const metadata = { title: "Soruyu Düzenle" };

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const [item] = await getDb().select().from(faqItems).where(eq(faqItems.id, id));
  if (!item) notFound();

  return (
    <>
      <AdminPageHeader title="Soruyu Düzenle" back={{ href: "/admin/sss", label: "SSS" }} />
      <FaqForm
        action={updateFaq.bind(null, item.id)}
        initialValues={{ question: item.question, answer: item.answer }}
        submitLabel="Değişiklikleri Kaydet"
      />
    </>
  );
}
