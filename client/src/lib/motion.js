// Motion tokens — every animation in the storefront pulls from here.
// Hierarchy: micro (L1) < component (L2) < section (L3) < hero/story (L4).

export const ease = {
  out: [0.16, 1, 0.3, 1], // expo-out: entrances, reveals
  inOut: [0.76, 0, 0.24, 1], // quart-in-out: curtains, page transitions
  soft: [0.33, 1, 0.68, 1], // gentle follow-through
};

export const dur = {
  micro: 0.2,
  base: 0.45,
  slow: 0.8,
  epic: 1.2,
};

export const spring = {
  snappy: { type: "spring", stiffness: 420, damping: 32, mass: 0.6 },
  soft: { type: "spring", stiffness: 140, damping: 22, mass: 0.8 },
  magnetic: { type: "spring", stiffness: 180, damping: 14, mass: 0.4 },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: dur.slow, ease: ease.out } },
};

export const stagger = (step = 0.06, delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: step, delayChildren: delay } },
});

export const formatPrice = (currency, n) =>
  `${currency}${Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const pad = (n, len = 2) => String(n).padStart(len, "0");
