"use client";

import { useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";

const ITEMS = [
  "TUTKU",
  "MÜCADELE",
  "TAKIM RUHU",
  "DÜŞBELEN SK",
  "DİSİPLİN",
  "GELİŞİM",
  "BAŞARI",
  "SPORLA BÜYÜYEN NESİLLER",
];

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

export function Marquee() {
  const track = [...ITEMS, ...ITEMS];
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
  const [manuallyPaused, setManuallyPaused] = useState(false);
  // WCAG 2.2.2: 26 saniyelik sonsuz döngü 5 saniyeyi aştığı için duraklatma
  // kontrolü gerekiyor; prefers-reduced-motion zaten CSS tarafında kapatıyor.
  const paused = manuallyPaused || prefersReducedMotion;

  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-bg-pitch py-3 [-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <div
        className="animate-marquee flex w-max gap-8 whitespace-nowrap"
        style={{ animationPlayState: paused ? "paused" : "running" }}
      >
        {[...track, ...track].map((item, i) => (
          <span key={i} className="flex items-center gap-8 text-sm font-bold tracking-[0.3em] text-white">
            {item}
            <span className="text-accent-bright">●</span>
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setManuallyPaused((p) => !p)}
        aria-label={paused ? "Kayan yazıyı oynat" : "Kayan yazıyı duraklat"}
        className="absolute right-2 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white/80 shadow-[0_1px_3px_rgba(0,0,0,0.6)] outline-none transition hover:bg-black/50 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-bright before:absolute before:-inset-2.5 before:content-['']"
      >
        {paused ? <Play size={11} fill="currentColor" /> : <Pause size={11} fill="currentColor" />}
      </button>
    </div>
  );
}
