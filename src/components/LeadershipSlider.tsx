"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { LeadershipHighlight } from "@/lib/queries";

export function LeadershipSlider({ items }: { items: LeadershipHighlight[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("[data-card]");
    const cardWidth = card instanceof HTMLElement ? card.offsetWidth + 24 : 300;
    track.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <Link
            key={item.name}
            data-card
            href={item.href}
            className="group relative aspect-[2/3] w-[220px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border-soft bg-black shadow-lg transition duration-300 hover:-translate-y-1 hover:border-accent sm:w-[260px]"
          >
            <Image
              src={item.photo}
              alt={`${item.name} — ${item.role}`}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(min-width: 640px) 260px, 220px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-accent">{item.role}</span>
              <p className="mt-1 font-bold text-white">{item.name}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Önceki"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border-soft text-white transition hover:border-accent hover:text-accent"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Sonraki"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border-soft text-white transition hover:border-accent hover:text-accent"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
