import { motion, useReducedMotion } from "framer-motion";
import { ease } from "../../lib/motion";

// Masked word-by-word (or char-by-char) reveal.
// Wrap a word in *asterisks* to set it in the italic display accent.
const SplitText = ({
  text,
  as = "span",
  className = "",
  accentClassName = "italic",
  by = "word",
  stagger = 0.06,
  delay = 0,
  duration = 1,
  trigger = "inView",
  once = true,
}) => {
  const reduced = useReducedMotion();
  const Tag = motion[as] || motion.span;
  const plain = text.replace(/\*/g, "");

  const words = text.split(" ").map((raw) => ({
    word: raw.replace(/\*/g, ""),
    accent: raw.startsWith("*") || raw.endsWith("*"),
  }));

  const parent = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const child = {
    hidden: reduced ? { opacity: 0 } : { y: "110%", rotate: 4 },
    visible: { y: "0%", rotate: 0, opacity: 1, transition: { duration: reduced ? 0.3 : duration, ease: ease.out } },
  };

  const triggerProps =
    trigger === "mount"
      ? { initial: "hidden", animate: "visible" }
      : { initial: "hidden", whileInView: "visible", viewport: { once, amount: 0.4 } };

  return (
    <Tag className={className} aria-label={plain} variants={parent} {...triggerProps}>
      {words.map(({ word, accent }, wi) => (
        <span key={wi} aria-hidden="true" className="inline-block whitespace-nowrap">
          <span className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-top">
            {by === "char" ? (
              [...word].map((ch, ci) => (
                <motion.span key={ci} variants={child} className={`inline-block origin-bottom-left ${accent ? accentClassName : ""}`}>
                  {ch}
                </motion.span>
              ))
            ) : (
              <motion.span variants={child} className={`inline-block origin-bottom-left ${accent ? accentClassName : ""}`}>
                {word}
              </motion.span>
            )}
          </span>
          {wi < words.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
};

export default SplitText;
