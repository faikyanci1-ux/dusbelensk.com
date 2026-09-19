"use client";

import { useSyncExternalStore } from "react";

const DESKTOP_QUERY = "(min-width: 640px)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/** 640px altında (mobil) false döner — video gibi ağır medya bu durumda hiç indirilmez. */
export function useIsDesktop() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
