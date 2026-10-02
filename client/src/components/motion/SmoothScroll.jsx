import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "../../lib/lenis";
import { usePrefersReducedMotion } from "../../hooks/useMedia";

// Lenis drives the *native* window scroll, so sticky positioning, framer's
// useScroll, browser back/forward and find-in-page all keep working.
// Touch devices keep native momentum (syncTouch off). Reduced motion = no Lenis.
const SmoothScroll = () => {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: { offset: -90 },
      autoRaf: true,
    });
    setLenis(lenis);
    return () => {
      lenis.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return null;
};

export default SmoothScroll;
