import { useRef } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";
import { useFinePointer } from "../../hooks/useMedia";
import { spring } from "../../lib/motion";

// Pulls its child toward the cursor while hovered. Desktop pointers only.
const Magnetic = ({ strength = 0.35, className = "", children }) => {
  const ref = useRef(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const x = useSpring(0, spring.magnetic);
  const y = useSpring(0, spring.magnetic);
  const active = fine && !reduced;

  const onMove = (e) => {
    if (!active || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div ref={ref} onPointerMove={onMove} onPointerLeave={reset} style={active ? { x, y } : undefined} className={`inline-block ${className}`}>
      {children}
    </motion.div>
  );
};

export default Magnetic;
