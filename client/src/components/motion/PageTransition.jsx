import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ease } from "../../lib/motion";

// Route wrapper with an ink curtain.
// Exit: curtain rises from the bottom over the old page (0.45s).
// Between: AnimatePresence(onExitComplete) resets scroll while covered.
// Enter: curtain lifts off the top of the new page while content rises in.
// First load skips the curtain so the hero's own entrance is unobstructed.
let navigated = false;

const CURTAIN = "pointer-events-none fixed inset-0 z-[95] flex items-center justify-center bg-ink text-bone";
const MARK = "display text-5xl tracking-[0.18em] sm:text-6xl";

const PageTransition = ({ children }) => {
  const reduced = useReducedMotion();
  // Captured once per mount: was this page reached by navigation?
  const [viaNavigation] = useState(() => {
    const was = navigated;
    navigated = true;
    return was;
  });

  if (reduced) {
    return (
      <motion.main id="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
        {children}
      </motion.main>
    );
  }

  return (
    <>
      <motion.main
        id="main"
        initial={viaNavigation ? { opacity: 0, y: 60 } : false}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.9, ease: ease.out, delay: viaNavigation ? 0.3 : 0 } }}
        exit={{ y: -40, transition: { duration: 0.45, ease: ease.inOut } }}
      >
        {children}
      </motion.main>

      {/* Two curtains with fixed origins (framer would otherwise tween the origin). */}
      {viaNavigation && (
        <motion.div
          aria-hidden="true"
          className={`${CURTAIN} origin-top`}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0, transition: { duration: 0.7, ease: ease.inOut, delay: 0.05 } }}
        >
          <motion.span className={MARK} initial={{ opacity: 1 }} animate={{ opacity: 0, transition: { duration: 0.25 } }}>
            ELEVÉ
          </motion.span>
        </motion.div>
      )}
      <motion.div
        aria-hidden="true"
        className={`${CURTAIN} origin-bottom`}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1, transition: { duration: 0.45, ease: ease.inOut } }}
      >
        <motion.span className={MARK} initial={{ opacity: 0 }} animate={{ opacity: 0 }} exit={{ opacity: 1, transition: { duration: 0.2, delay: 0.25 } }}>
          ELEVÉ
        </motion.span>
      </motion.div>
    </>
  );
};

export default PageTransition;
