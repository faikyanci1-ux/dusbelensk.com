"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { getDateBadge } from "@/lib/formatDate";
import type { NewsItem } from "@/data/news";

export function NewsCarousel({ items }: { items: NewsItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const updateActive = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-card]"));
    if (cards.length === 0) return;
    // Sona yaslandıysa son kartı, aksi halde sol kenara en yakın kartı etkin say.
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) {
      setActive(cards.length - 1);
      return;
    }
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft - track.offsetLeft - track.scrollLeft);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(updateActive);
    return () => cancelAnimationFrame(id);
  }, [updateActive, items.length]);

  function goTo(index: number) {
    const track = trackRef.current;
    const card = track?.querySelectorAll<HTMLElement>("[data-card]")[index];
    if (!track || !card) return;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
  }

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("[data-card]");
    const cardWidth = card instanceof HTMLElement ? card.offsetWidth + 24 : 320;
    track.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  }

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Son haberler">
      <div
        ref={trackRef}
        onScroll={updateActive}
        tabIndex={0}
        aria-label="Haber kartları, yatay kaydırılabilir"
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto rounded-2xl pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => {
          const { day, month } = getDateBadge(item.date);
          return (
            <article
              key={item.id}
              data-card
              role="group"
              aria-roledescription="slayt"
              aria-label={`${index + 1} / ${items.length}`}
              className="group w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border-soft bg-bg-raised/40 transition duration-300 hover:-translate-y-1 hover:border-accent hover:bg-bg-raised/60 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)] sm:w-[340px]"
            >
              {item.image && (
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 640px) 340px, 300px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 rounded-lg bg-accent px-2.5 py-1.5 text-center shadow-lg">
                    <div className="text-base font-extrabold leading-none text-white">{day}</div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-white">{month}</div>
                  </div>
                </div>
              )}
              <div className="p-5">
                {item.tag && (
                  <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent-light">
                    {item.tag}
                  </span>
                )}
                <h3 className="mt-3 font-semibold text-white">{item.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-text-muted">{item.summary}</p>
                <Link
                  href={`/haberler/${item.id}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-light underline underline-offset-2"
                >
                  Devamını Oku
                  <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-1" role="group" aria-label="Haber seçici">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${i + 1}. habere git`}
              aria-current={i === active ? "true" : undefined}
              className="group/dot flex h-6 w-6 items-center justify-center"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-300 ${
                  i === active ? "w-5 bg-accent-bright" : "w-2 bg-white/30 group-hover/dot:bg-white/60"
                }`}
              />
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-xs font-medium tabular-nums text-text-muted" aria-live="polite">
            {active + 1} / {items.length}
          </span>
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Önceki haber"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border-soft text-white transition hover:border-accent-bright hover:text-accent-bright"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Sonraki haber"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border-soft text-white transition hover:border-accent-bright hover:text-accent-bright"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
