"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/nav";
import { club } from "@/data/club";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  // Sayfa değişince menü kapanır (render sırasında durum ayarı: effect gerekmez).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Menü açıkken: Esc kapatır ve odağı butona döndürür; Tab menü + buton arasında döner.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const items = [
        buttonRef.current,
        ...(menuRef.current?.querySelectorAll<HTMLElement>("a[href]") ?? []),
      ].filter((el): el is HTMLElement => !!el);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border-soft/60 bg-bg-main/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image src="/images/logo.png" alt="Düşbelen SK Logo" width={40} height={40} className="h-10 w-10" />
          <span className="flex flex-col whitespace-nowrap leading-tight lg:hidden xl:flex">
            <span className="text-sm font-bold tracking-wide text-white sm:text-base">DÜŞBELEN SK</span>
            <span className="text-xs uppercase tracking-wide text-text-muted lg:hidden">{club.tagline}</span>
          </span>
        </Link>

        <nav aria-label="Ana menü" className="hidden items-center gap-5 lg:flex xl:gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-text-muted transition hover:text-accent-bright"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/futbol-okulu"
            className="whitespace-nowrap rounded-full bg-accent px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:brightness-110"
          >
            Ön Kayıt
          </Link>
        </div>

        <button
          ref={buttonRef}
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-border-soft text-white lg:hidden"
          aria-label="Menüyü aç/kapat"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav ref={menuRef} id="mobile-menu" aria-label="Mobil menü" className="border-t border-border-soft/60 bg-bg-main px-4 py-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted hover:bg-white/5 hover:text-accent-bright"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/futbol-okulu"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-accent px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white"
              >
                Ön Kayıt
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
