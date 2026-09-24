import Image from "next/image";
import { asc } from "drizzle-orm";
import { UserRound } from "lucide-react";
import { getDb } from "@/db/client";
import { boardMembers } from "@/db/schema";
import { DeleteButton, MoveButtons } from "@/components/admin/form";
import { AdminPageHeader, EditLink, EmptyState, ListRow, StatusBanner } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/adminSession";
import { deleteBoardMember, moveBoardMember } from "./actions";

export const metadata = { title: "Yönetim Kurulu" };

type Member = typeof boardMembers.$inferSelect;

function MemberList({ members }: { members: Member[] }) {
  if (members.length === 0) return <EmptyState>Bu kurulda üye yok.</EmptyState>;
  return (
    <ul className="space-y-3">
      {members.map((m, index) => (
        <ListRow
          key={m.id}
          actions={
            <>
              <EditLink href={`/admin/yonetim/${m.id}`} />
              <DeleteButton action={deleteBoardMember} id={m.id} confirmText={`${m.name} kuruldan kaldırılsın mı?`} />
            </>
          }
        >
          <MoveButtons action={moveBoardMember} id={m.id} isFirst={index === 0} isLast={index === members.length - 1} />
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 text-white/40">
            {m.photo ? <Image src={m.photo} alt="" fill sizes="48px" className="object-cover" /> : <UserRound size={20} />}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold">{m.name}</p>
            <p className="truncate text-xs text-white/50">
              {m.role}
              {m.photo ? " · Tanıtım kartı" : ""}
            </p>
          </div>
        </ListRow>
      ))}
    </ul>
  );
}

export default async function AdminBoardPage({ searchParams }: { searchParams: Promise<{ durum?: string }> }) {
  await requireAdmin();
  const { durum } = await searchParams;
  const rows = await getDb().select().from(boardMembers).orderBy(asc(boardMembers.sortOrder), asc(boardMembers.id));

  return (
    <>
      <AdminPageHeader
        title="Yönetim Kurulu"
        description="Yönetim sayfasındaki kurullar; her kurul kendi içinde sıralanır."
        action={{ href: "/admin/yonetim/yeni", label: "Üye Ekle" }}
      />
      <StatusBanner status={durum} />

      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">Yönetim Kurulu</h2>
      <MemberList members={rows.filter((r) => r.boardType === "management")} />

      <h2 className="mt-10 mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">Denetleme Kurulu</h2>
      <MemberList members={rows.filter((r) => r.boardType === "audit")} />
    </>
  );
}
