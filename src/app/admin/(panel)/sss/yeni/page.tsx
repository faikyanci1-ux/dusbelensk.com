import { AdminPageHeader } from "@/components/admin/ui";
import { requireModule } from "@/lib/adminSession";
import { createFaq } from "../actions";
import { FaqForm } from "../FaqForm";

export const metadata = { title: "Soru Ekle" };

export default async function NewFaqPage() {
  await requireModule("sss");
  return (
    <>
      <AdminPageHeader title="Soru Ekle" back={{ href: "/admin/sss", label: "SSS" }} />
      <FaqForm action={createFaq} initialValues={{ question: "", answer: "" }} submitLabel="Soruyu Ekle" />
    </>
  );
}
