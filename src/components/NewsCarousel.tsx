"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { getDateBadge } from "@/lib/formatDate";
import type { NewsItem } from "@/data/news";

export function NewsCarousel({ items }: { items: NewsItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("[data-card]");
    const cardWidth = card instanceof HTMLElement ? card.offsetWidth + 24 : 320;
    track.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  }

  return (
    <div>
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const { day, month } = getDateBadge(item.date);
          return (
            <article
              key={item.id}
              data-card
              className="w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border-soft bg-bg-raised/40 sm:w-[340px]"
            >
              {item.image && (
                <div className="relative h-44 w-full">
                  <Image src={item.image} alt={item.title} fill sizes="340px" className="object-cover" />
                  <div className="absolute left-3 top-3 rounded-lg bg-accent px-2.5 py-1.5 text-center shadow-lg">
                    <div className="text-base font-extrabold leading-none text-bg-main">{day}</div>
                    <div className="text-[9px] font-semibold uppercase tracking-wide text-bg-main">{month}</div>
                  </div>
                </div>
              )}
              <div className="p-5">
                {item.tag && (
                  <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-medium text-accent">
                    {item.tag}
                  </span>
                )}
                <h3 className="mt-3 font-semibold text-white">{item.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-text-muted">{item.summary}</p>
                <Link
                  href={`/haberler/${item.id}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                >
                  Devamını Oku
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </article>
          );
        })}
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
