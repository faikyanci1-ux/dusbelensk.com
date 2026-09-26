"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useIsDesktop } from "@/lib/useIsDesktop";

export type HeroSlide =
  | { type: "video"; src: string; poster: string; caption: string }
  /** focus: kırpılırken korunacak nokta (CSS object-position, ör. "50% 0%"); Ken Burns zoom'u da buradan başlar. */
  | { type: "image"; src: string; caption: string; focus?: string };

const INTERVAL_MS = 6000;

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getReducedMotionServerSnapshot() {
  return false;
}

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  // WCAG 2.2.2 (Pause, Stop, Hide): 5 saniyeden uzun süren, otomatik başlayan
  // hareketli içerik için kullanıcının durdurabileceği bir kontrol gerekir.
  // Ayrıca prefers-reduced-motion tercih edenler için otomatik geçiş kapalı kalır
  // (useSyncExternalStore ile: effect içinde senkron setState gerektirmeden
  // tarayıcı API'sine abone olunur).
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const paused = manuallyPaused || prefersReducedMotion;
  const isDesktop = useIsDesktop();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, paused]);

  function goTo(i: number) {
    setIndex(i);
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
          // LCP elementi genelde bu video (desktop hero, viewport'un çoğunu kaplıyor):
          // poster next/image optimize edicisinden geçiriliyor, preload="auto" ile ilk kare erken hazır olur.
          preload="auto"
          poster={`/_next/image?url=${encodeURIComponent(slide.poster)}&w=1920&q=75`}
          className={`h-full w-full object-cover brightness-110 contrast-105 saturate-110 ${
            prefersReducedMotion ? "" : "animate-ken-burns"
          }`}
        >
          <source src={slide.src} type="video/mp4" />
        </video>
      ) : (
        <Image
          key={slide.type === "video" ? slide.poster : slide.src}
          src={slide.type === "video" ? slide.poster : slide.src}
          style={
            slide.type === "image" && slide.focus
              ? { objectPosition: slide.focus, transformOrigin: slide.focus }
              : undefined
          }
          alt=""
          fill
          sizes="100vw"
          priority={index === 0}
          className={`object-cover brightness-110 contrast-105 saturate-110 ${
            prefersReducedMotion ? "" : "animate-ken-burns"
          }`}
        />
      )}

      <div className="pointer-events-none absolute bottom-20 left-1/2 z-20 hidden -translate-x-1/2 text-xs font-semibold uppercase tracking-wide text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] sm:block sm:bottom-24 lg:left-auto lg:right-36 lg:translate-x-0">
        {slide.caption}
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex items-center justify-center gap-3 sm:bottom-16 lg:justify-end lg:pr-24"
        role="group"
        aria-label="Slayt gösterisi kontrolleri"
      >
        {/* Mobil: slayt çok olunca noktalar ekrana sığmıyor; önceki/sonraki + sayaç gösterilir. */}
        <div className="pointer-events-auto flex items-center gap-1 sm:hidden">
          <button
            type="button"
            aria-label="Önceki görsel"
            onClick={() => goTo((index - 1 + slides.length) % slides.length)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="min-w-12 text-center text-xs font-semibold tabular-nums text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
            {index + 1} / {slides.length}
          </span>
          <button
            type="button"
            aria-label="Sonraki görsel"
            onClick={() => goTo((index + 1) % slides.length)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="pointer-events-auto hidden gap-3 sm:flex">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`${i + 1}. görsele geç`}
              aria-current={i === index}
              onClick={() => goTo(i)}
              className="flex items-center justify-center p-2"
            >
              <span
                className={`block h-1.5 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.6)] transition-[width,background-color] duration-300 ${
                  i === index ? "w-6 bg-accent" : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setManuallyPaused((p) => !p)}
          aria-label={paused ? "Slayt gösterisini oynat" : "Slayt gösterisini duraklat"}
          className="pointer-events-auto relative flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white shadow-[0_1px_3px_rgba(0,0,0,0.6)] outline-none transition hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-bright before:absolute before:-inset-2.5 before:content-['']"
        >
          {paused ? <Play size={12} fill="currentColor" /> : <Pause size={12} fill="currentColor" />}
        </button>
      </div>
    </>
  );
}
