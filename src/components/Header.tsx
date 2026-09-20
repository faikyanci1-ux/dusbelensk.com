"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/nav";
import { club } from "@/data/club";

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border-soft/60 bg-bg-main/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image src="/images/logo.png" alt="Düşbelen SK Logo" width={40} height={40} className="h-10 w-10" />
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-wide text-white sm:text-base">DÜŞBELEN SK</span>
            <span className="text-[11px] uppercase tracking-wide text-text-muted sm:text-xs">{club.tagline}</span>
          </span>
        </Link>

        <nav aria-label="Ana menü" className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-semibold uppercase tracking-wider text-text-muted transition hover:text-accent-bright"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/iletisim"
            className="rounded-full bg-accent px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:brightness-110"
          >
            Kulübe Katıl
          </Link>
        </div>

        <button
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
        <nav id="mobile-menu" aria-label="Mobil menü" className="border-t border-border-soft/60 bg-bg-main px-4 py-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-text-muted hover:bg-white/5 hover:text-accent-bright"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/iletisim"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-accent px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-white"
              >
                Kulübe Katıl
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
