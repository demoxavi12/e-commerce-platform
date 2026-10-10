import { useCallback } from "react";
import { useFinePointer, usePrefersReducedMotion } from "./useMedia";

// Drives the `glass-sheen` highlight: writes the pointer position into
// --gx/--gy on the element itself (no React state, no re-renders).
// Pass the element's ref; spread the returned handlers onto it.
// Inactive on touch devices and with reduced motion.
export const useSpecular = (ref) => {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const active = fine && !reduced;

  const onPointerMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!active || !el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--gx", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--gy", `${((e.clientY - r.top) / r.height) * 100}%`);
    },
    [active, ref]
  );
  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.removeProperty("--gx");
    el.style.removeProperty("--gy");
  }, [ref]);

  return { onPointerMove, onPointerLeave };
};
