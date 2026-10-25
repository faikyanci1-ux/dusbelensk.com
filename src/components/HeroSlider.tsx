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
const ctrlBtn =
  "flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:bg-white/15 focus-visible:outline-white";

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
  // Video, ilk boyamadan (LCP) ve hidrasyondan sonra, tarayıcı boştayken yüklenir;
  // o ana kadar poster statik görsel olarak görünür, video hazır olunca üstüne yumuşakça biner.
  const [videoAllowed, setVideoAllowed] = useState(false);
  const [readyKey, setReadyKey] = useState<string | null>(null);

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setVideoAllowed(true), { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = setTimeout(() => setVideoAllowed(true), 1200);
    return () => clearTimeout(t);
  }, []);

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
  const showVideo = slide.type === "video" && isDesktop && videoAllowed;
  const posterSrc = slide.type === "video" ? slide.poster : slide.src;
  const videoReady = slide.type === "video" && readyKey === slide.src;
  // Video oynarken Ken Burns videonun kendisinde; poster sabit kalır ki geçişte kayma olmasın.
  const animatePoster = !prefersReducedMotion && !(slide.type === "video" && isDesktop);

  return (
    <>
      <Image
        key={posterSrc}
        src={posterSrc}
        style={
          slide.type === "image" && slide.focus
            ? { objectPosition: slide.focus, transformOrigin: slide.focus }
            : undefined
        }
        alt={slide.caption}
        fill
        sizes="100vw"
        priority={index === 0}
        className={`object-cover brightness-110 contrast-105 saturate-110 ${
          animatePoster ? "animate-ken-burns" : ""
        }`}
      />
      {showVideo && (
        <video
          key={slide.src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onPlaying={() => setReadyKey(slide.src)}
          className={`absolute inset-0 h-full w-full object-cover brightness-110 contrast-105 saturate-110 transition-opacity duration-700 ${
            videoReady ? "opacity-100" : "opacity-0"
          } ${prefersReducedMotion ? "" : "animate-ken-burns"}`}
        >
          <source src={slide.src} type="video/mp4" />
        </video>
      )}

      {/* Mobilde metin okunurluğu için ek karartma (sayfadaki gradyanların altında). */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40 sm:hidden" />

      {/* Kontroller: mobilde üst sağ (WhatsApp FAB ve alt içerikle çakışmaz), sm+ altta sağda;
          sabit WhatsApp düğmesinin (sağ 20px + 56px) soluna oturur. Tüm hedefler >= 44px. */}
      <div
        className="absolute right-3 top-3 z-20 flex items-center gap-1 rounded-full bg-black/40 px-1 py-0.5 backdrop-blur-sm sm:bottom-6 sm:right-24 sm:top-auto sm:px-2"
        role="group"
        aria-label="Slayt gösterisi kontrolleri"
      >
        <span className="mr-1 hidden max-w-[10rem] truncate pl-2 text-xs font-semibold uppercase tracking-wide text-white/90 md:block xl:max-w-[16rem]" aria-hidden="true">
          {slide.caption}
        </span>
        <button
          type="button"
          aria-label="Önceki görsel"
          onClick={() => goTo((index - 1 + slides.length) % slides.length)}
          className={ctrlBtn}
        >
          <ChevronLeft size={20} />
        </button>
        <span
          className="min-w-14 text-center text-xs font-semibold tabular-nums text-white"
          aria-live="off"
        >
          {index + 1} / {slides.length}
        </span>
        <button
          type="button"
          aria-label="Sonraki görsel"
          onClick={() => goTo((index + 1) % slides.length)}
          className={ctrlBtn}
        >
          <ChevronRight size={20} />
        </button>
        <button
          type="button"
          onClick={() => setManuallyPaused((p) => !p)}
          aria-label={paused ? "Slayt gösterisini oynat" : "Slayt gösterisini duraklat"}
          className={ctrlBtn}
        >
          {paused ? <Play size={16} fill="currentColor" /> : <Pause size={16} fill="currentColor" />}
        </button>
      </div>
    </>
  );
}
