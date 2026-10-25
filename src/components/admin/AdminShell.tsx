"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ExternalLink, Menu, X } from "lucide-react";
import { ADMIN_NAV } from "./nav";
import { LogoutButton } from "./LogoutButton";
import { UnsavedGuard } from "./UnsavedGuard";

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({ pathname, onNavigate, badges }: { pathname: string; onNavigate?: () => void; badges: Record<string, number> }) {
  return (
    <ul className="space-y-1">
      {ADMIN_NAV.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-accent-bright/15 text-white" : "text-white/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={17} className={active ? "text-accent-bright" : ""} />
              <span className="min-w-0 flex-1 truncate">{label}</span>
              {badges[href] > 0 && (
                <span
                  aria-label={`${badges[href]} okunmamış`}
                  className="rounded-full bg-accent-bright px-2 py-0.5 text-[11px] font-bold leading-none text-white"
                >
                  {badges[href]}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-3">
      <Image src="/images/logo.png" alt="" width={36} height={36} className="h-9 w-9 rounded-md" />
      <span className="leading-tight">
        <span className="block text-sm font-bold">Düşbelen SK</span>
        <span className="block text-[11px] uppercase tracking-wide text-white/50">Yönetim Paneli</span>
      </span>
    </Link>
  );
}

function FooterLinks() {
  return (
    <div className="space-y-2 border-t border-white/10 pt-4">
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/65 transition hover:bg-white/5 hover:text-white"
      >
        <ExternalLink size={16} />
        Siteyi Gör
      </a>
      <LogoutButton />
    </div>
  );
}

/** Yönetim paneli çerçevesi: masaüstünde sabit sol menü, mobilde üst çubuk + açılır menü. */
export function AdminShell({ children, badges = {} }: { children: React.ReactNode; badges?: Record<string, number> }) {
  const pathname = usePathname() ?? "/admin";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-bg-main text-white lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col gap-6 border-r border-white/10 bg-black/20 p-5 lg:flex">
        <Brand />
        <nav aria-label="Yönetim menüsü" className="flex-1 overflow-y-auto">
          <NavLinks pathname={pathname} badges={badges} />
        </nav>
        <FooterLinks />
      </aside>

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-bg-main/95 px-4 py-3 backdrop-blur lg:hidden">
        <Brand />
        <div className="flex items-center gap-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Siteyi görüntüle (yeni sekme)"
          title="Siteyi görüntüle"
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 text-white/80"
        >
          <ExternalLink size={18} />
        </a>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="admin-mobile-menu"
          aria-label="Menüyü aç/kapat"
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/15"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        </div>
      </header>
      {open && (
        <nav
          id="admin-mobile-menu"
          aria-label="Yönetim menüsü"
          className="fixed inset-x-0 bottom-0 top-[69px] z-30 flex flex-col gap-4 overflow-y-auto bg-bg-main p-4 lg:hidden"
        >
          <NavLinks pathname={pathname} badges={badges} onNavigate={() => setOpen(false)} />
          <FooterLinks />
        </nav>
      )}

      <div className="min-w-0 px-4 py-8 sm:px-8 lg:py-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 hidden justify-end lg:flex">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/55 transition hover:text-white"
            >
              <ExternalLink size={13} />
              Siteyi görüntüle
            </a>
          </div>
          {children}
        </div>
      <UnsavedGuard />
      </div>
    </div>
  );
}
