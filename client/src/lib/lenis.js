// Module-level handle to the single Lenis instance so any component can
// stop/start/scrollTo without re-rendering through React context.
let instance = null;

export const setLenis = (l) => {
  instance = l;
};
export const getLenis = () => instance;

export const scrollToTop = (immediate = true) => {
  if (instance) instance.scrollTo(0, { immediate, force: true });
  else window.scrollTo(0, 0);
};

// Ref-counted lock so overlapping overlays (menu + drawer) don't fight.
let locks = 0;
export const lockScroll = () => {
  locks += 1;
  if (instance) instance.stop();
  document.documentElement.style.overflow = "hidden";
};
export const unlockScroll = () => {
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;
  if (instance) instance.start();
  document.documentElement.style.overflow = "";
};
