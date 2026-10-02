import { useSyncExternalStore } from "react";

const subscribers = new Map();
const getSubscriber = (query) => {
  if (!subscribers.has(query)) {
    subscribers.set(query, (cb) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    });
  }
  return subscribers.get(query);
};

export const useMediaQuery = (query) =>
  useSyncExternalStore(
    getSubscriber(query),
    () => window.matchMedia(query).matches,
    () => false
  );

// Desktop-class pointer: mouse/trackpad. Gates tilt, cursor, magnetic.
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
export const usePrefersReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
