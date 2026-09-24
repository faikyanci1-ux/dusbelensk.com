import Link from "next/link";
import { count, desc, gte } from "drizzle-orm";
import { AlertTriangle, CalendarPlus, CheckCircle2, ImagePlus, PenSquare } from "lucide-react";
import { getDb } from "@/db/client";
import { boardMembers, events, faqItems, galleryItems, newsItems, programGroups, staff } from "@/db/schema";
import { ADMIN_NAV } from "@/components/admin/nav";
import { requireAdmin } from "@/lib/adminSession";
import { isUploadEnabled } from "@/lib/admin/images";
import { formatTurkishDate } from "@/lib/formatDate";
import { getClubInfo } from "@/lib/queries";
import { todayInTurkey } from "@/lib/siteSettings";

export const metadata = { title: "Genel Bakış" };

const QUICK_ACTIONS = [
  { href: "/admin/haberler/yeni", label: "Yeni Haber", icon: PenSquare },
  { href: "/admin/etkinlikler/yeni", label: "Yeni Etkinlik", icon: CalendarPlus },
  { href: "/admin/galeri/yeni", label: "Galeriye Fotoğraf", icon: ImagePlus },
];

export default async function AdminDashboardPage() {
  await requireAdmin();
  const db = getDb();
  const today = todayInTurkey();

  const [club, [news], [upcoming], [gallery], [staffCount], [board], [faq], [program], latestNews] = await Promise.all([
    getClubInfo(),
    db.select({ n: count() }).from(newsItems),
    db.select({ n: count() }).from(events).where(gte(events.date, today)),
    db.select({ n: count() }).from(galleryItems),
    db.select({ n: count() }).from(staff),
    db.select({ n: count() }).from(boardMembers),
    db.select({ n: count() }).from(faqItems),
    db.select({ n: count() }).from(programGroups),
    db.select().from(newsItems).orderBy(desc(newsItems.date), desc(newsItems.id)).limit(3),
  ]);

  const counts: Record<string, string> = {
    "/admin/ayarlar": "İletişim, sayılar, futbol okulu, sıradaki maç",
    "/admin/haberler": `${news.n} haber`,
    "/admin/etkinlikler": `${upcoming.n} yaklaşan etkinlik`,
    "/admin/galeri": `${gallery.n} fotoğraf`,
    "/admin/teknik-kadro": `${staffCount.n} kişi`,
    "/admin/yonetim": `${board.n} kurul üyesi`,
    "/admin/sss": `${faq.n} soru`,
    "/admin/yas-gruplari": `${program.n} grup`,
  };

  const uploadEnabled = isUploadEnabled();

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-2xl uppercase tracking-tight sm:text-3xl">Hoş geldiniz</h1>
        <p className="mt-1 text-sm text-white/60">
          Sitedeki her şeyi buradan güncelleyebilirsiniz. Kaydettiğiniz değişiklikler sitede hemen görünür.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        {QUICK_ACTIONS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="inline-flex items-center gap-2 rounded-full bg-accent-bright px-5 py-2.5 text-sm font-semibold transition hover:brightness-110"
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Sıradaki Maç</p>
          {club.nextMatch.show ? (
            <p className="mt-2 text-sm">
              <span className="font-semibold">Düşbelen SK – {club.nextMatch.opponent}</span>
              <br />
              <span className="text-white/60">
                {club.nextMatch.date}
                {club.nextMatch.time ? ` · ${club.nextMatch.time}` : ""} · {club.nextMatch.location}
              </span>
            </p>
          ) : (
            <p className="mt-2 text-sm text-white/60">Anasayfada gösterilmiyor.</p>
          )}
          <Link href="/admin/ayarlar#siradaki-mac" className="mt-3 inline-block text-xs font-semibold text-accent-bright">
            Düzenle →
          </Link>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Fotoğraf yükleme</p>
          {uploadEnabled ? (
            <p className="mt-2 flex items-center gap-2 text-sm text-emerald-200">
              <CheckCircle2 size={16} /> Açık — panelden fotoğraf yükleyebilirsiniz.
            </p>
          ) : (
            <p className="mt-2 flex items-start gap-2 text-sm text-amber-200">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              Kapalı. Vercel&apos;de Blob depolaması açılınca etkinleşir; şimdilik sitedeki fotoğraflardan seçilebilir.
            </p>
          )}
        </div>
      </div>

      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">Bölümler</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {ADMIN_NAV.filter((item) => item.href !== "/admin").map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/25 hover:bg-white/[0.08]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-bright/15 text-accent-bright">
              <Icon size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{label}</span>
              <span className="block truncate text-xs text-white/50">{counts[href]}</span>
            </span>
            <span className="text-white/30 transition group-hover:translate-x-0.5 group-hover:text-white/70">→</span>
          </Link>
        ))}
      </div>

      {latestNews.length > 0 && (
        <>
          <h2 className="mt-10 mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">Son haberler</h2>
          <ul className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">
            {latestNews.map((item) => (
              <li key={item.id}>
                <Link href={`/admin/haberler/${item.id}`} className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-white/5">
                  <span className="truncate text-sm font-medium">{item.title}</span>
                  <span className="shrink-0 text-xs text-white/50">{formatTurkishDate(item.date)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
