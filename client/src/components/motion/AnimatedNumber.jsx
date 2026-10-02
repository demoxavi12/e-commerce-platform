import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

// Rolls smoothly between numeric values (prices, totals, counts).
const AnimatedNumber = ({ value, format = (n) => Math.round(n).toString(), className = "" }) => {
  const mv = useSpring(value, { stiffness: 120, damping: 20, mass: 0.6 });
  const display = useTransform(mv, (v) => format(v));
  useEffect(() => {
    mv.set(value);
  }, [mv, value]);
  return <motion.span className={`tabular-nums ${className}`}>{display}</motion.span>;
};

export default AnimatedNumber;
