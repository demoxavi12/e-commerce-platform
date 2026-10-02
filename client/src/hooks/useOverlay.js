import { useEffect, useRef } from "react";
import { lockScroll, unlockScroll } from "../lib/lenis";

// Shared behaviour for every modal surface: scroll lock (Lenis + native),
// Escape to close, focus moved in on open and restored on close.
export const useOverlay = (open, onClose) => {
  const panelRef = useRef(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    lockScroll();
    const onKey = (e) => {
      if (e.key === "Escape") closeRef.current?.();
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => {
      const target = panelRef.current?.querySelector("[data-autofocus]") || panelRef.current;
      target?.focus({ preventScroll: true });
    }, 60);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      unlockScroll();
      if (previous instanceof HTMLElement) previous.focus({ preventScroll: true });
    };
  }, [open]);

  return panelRef;
};
