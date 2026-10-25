import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { contactMessages } from "@/db/schema";
import { DeleteButton } from "@/components/admin/form";
import { AdminPageHeader } from "@/components/admin/ui";
import { requireModule } from "@/lib/adminSession";
import { deleteMessage, setMessageRead } from "../actions";

export const metadata = { title: "Mesaj" };

const dateFormat = new Intl.DateTimeFormat("tr-TR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Istanbul" });

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-white/10 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wider text-white/50">{label}</dt>
      <dd className="min-w-0 break-words text-sm">{children}</dd>
    </div>
  );
}

export default async function MessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireModule("mesajlar");
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const db = getDb();
  const [m] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
  if (!m) notFound();
  // Açıldığında okundu say (listedeki sayaç bir sonraki ziyarette güncellenir).
  if (!m.isRead) await db.update(contactMessages).set({ isRead: true }).where(eq(contactMessages.id, id));

  const created = new Date(m.createdAt);

  return (
    <>
      <AdminPageHeader title={m.name} back={{ href: "/admin/mesajlar", label: "Gelen Mesajlar" }} />

      <dl className="rounded-2xl border border-white/10 bg-white/5 px-5">
        <Row label="Tür">{m.requestType === "trial" ? "Deneme antrenmanı / kayıt başvurusu" : "Genel mesaj"}</Row>
        <Row label="Tarih">{Number.isNaN(created.getTime()) ? m.createdAt : dateFormat.format(created)}</Row>
        <Row label="Telefon">
          {m.phone ? <a className="text-accent-bright hover:underline" href={`tel:${m.phone.replace(/[^\d+]/g, "")}`}>{m.phone}</a> : "—"}
        </Row>
        <Row label="E-posta">
          {m.email ? <a className="text-accent-bright hover:underline" href={`mailto:${encodeURI(m.email)}`}>{m.email}</a> : "—"}
        </Row>
        {m.requestType === "trial" && (
          <>
            <Row label="Çocuğun adı">{m.childName || "—"}</Row>
            <Row label="Yaş grubu">{m.ageGroup || "—"}</Row>
          </>
        )}
        <Row label="Mesaj">
          <p className="whitespace-pre-wrap">{m.message || "—"}</p>
        </Row>
      </dl>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <form action={setMessageRead}>
          <input type="hidden" name="id" value={m.id} />
          <input type="hidden" name="read" value="0" />
          <button type="submit" className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/80 hover:border-white/30 hover:text-white">
            Okunmadı olarak işaretle
          </button>
        </form>
        <DeleteButton action={deleteMessage} id={m.id} confirmText={`${m.name} adlı kişinin mesajı silinsin mi?`} />
      </div>
    </>
  );
}
