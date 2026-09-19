"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useIsDesktop } from "@/lib/useIsDesktop";

export type HeroSlide =
  | { type: "video"; src: string; poster: string; caption: string }
  | { type: "image"; src: string; caption: string };

const INTERVAL_MS = 6000;

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const isDesktop = useIsDesktop();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length]);

  function goTo(i: number) {
    setIndex(i);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, INTERVAL_MS);
  }

  const slide = slides[index];
  const showVideo = slide.type === "video" && isDesktop;

  return (
    <>
      {showVideo ? (
        <video
          key={slide.src}
          autoPlay
          muted
          loop
          playsInline
          poster={slide.poster}
          className="animate-ken-burns h-full w-full object-cover brightness-110 contrast-105 saturate-110"
        >
          <source src={slide.src} type="video/mp4" />
        </video>
      ) : (
        <Image
          key={slide.type === "video" ? slide.poster : slide.src}
          src={slide.type === "video" ? slide.poster : slide.src}
          alt=""
          fill
          sizes="100vw"
          priority={index === 0}
          className="animate-ken-burns object-cover brightness-110 contrast-105 saturate-110"
        />
      )}

      <div className="absolute bottom-20 left-1/2 z-20 -translate-x-1/2 text-xs font-semibold uppercase tracking-wide text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] sm:bottom-24">
        {slide.caption}
      </div>

      <div className="absolute inset-x-0 bottom-14 z-20 flex justify-center gap-2 sm:bottom-16">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${i + 1}. görsele geç`}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.6)] transition-all ${
              i === index ? "w-6 bg-accent" : "w-1.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </>
  );
}
