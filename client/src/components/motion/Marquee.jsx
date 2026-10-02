import { useRef } from "react";
import {
  motion, useAnimationFrame, useMotionValue, useScroll, useSpring,
  useTransform, useVelocity, useReducedMotion, useInView, wrap,
} from "framer-motion";

// Infinite marquee whose speed (and direction) responds to scroll velocity.
// The frame loop idles while the strip is off-screen.
const Marquee = ({ children, baseVelocity = -2.5, className = "", repeat = 4 }) => {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const dir = useRef(1);
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "120px" });
  const x = useTransform(baseX, (v) => `${wrap(-100 / repeat, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced || !inView) return;
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * Math.abs(f);
    baseX.set(baseX.get() + move);
  });

  return (
    <div ref={ref} className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div className="flex w-max flex-nowrap will-change-transform" style={{ x }}>
        {Array.from({ length: repeat }).map((_, i) => (
          <div key={i} className="flex shrink-0 items-center" aria-hidden={i > 0}>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;
