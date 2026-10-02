import { motion, useReducedMotion } from "framer-motion";
import { dur, ease } from "../../lib/motion";

// Viewport-triggered entrance. `variant` picks the choreography.
const variants = {
  up: { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  left: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.94 }, visible: { opacity: 1, scale: 1 } },
  clip: {
    hidden: { clipPath: "inset(100% 0% 0% 0%)" },
    visible: { clipPath: "inset(0% 0% 0% 0%)" },
  },
};

const Reveal = ({ as = "div", variant = "up", delay = 0, duration = dur.slow, amount = 0.25, once = true, className = "", children, ...rest }) => {
  const reduced = useReducedMotion();
  const Tag = motion[as] || motion.div;
  const v = reduced ? variants.fade : variants[variant];
  const transition = { duration: reduced ? 0.3 : duration, ease: variant === "clip" ? ease.inOut : ease.out, delay };

  // IntersectionObserver ignores a target hidden by its *own* clip-path, so the
  // clip variant observes an outer wrapper and clips an inner layer.
  if (variant === "clip" && !reduced) {
    return (
      <Tag className={className} initial="hidden" whileInView="visible" viewport={{ once, amount }} {...rest}>
        <motion.div className="h-full w-full" variants={v} transition={transition}>
          {children}
        </motion.div>
      </Tag>
    );
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={v}
      transition={transition}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
