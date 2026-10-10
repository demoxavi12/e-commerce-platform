import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import SplitText from "../motion/SplitText";
import Button from "../ui/Button";
import { NewsletterForm } from "../NewsLetterBox";
import { useSpecular } from "../../hooks/useSpecular";
import { editorial, size } from "../../assets/editorial";

// Closing scene: a full-bleed campaign photograph that slowly settles as it
// scrolls in, with a dark glass panel carrying the last call to action and
// the newsletter. Ends the page on imagery rather than a plain form.
const FinalCTA = () => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const sheenRef = useRef(null);
  const specular = useSpecular(sheenRef);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.6], reduced ? [1, 1] : [1.18, 1]);
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-8%", "8%"]);

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink py-24 text-bone" aria-labelledby="final-title">
      <motion.img
        src={editorial.portrait}
        width={size.portrait[0]}
        height={size.portrait[1]}
        alt=""
        loading="lazy"
        decoding="async"
        style={{ scale, y }}
        className="absolute inset-0 -z-10 h-full w-full object-cover object-[50%_25%]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/80 via-ink/45 to-ink/10" />

      <div className="gutter w-full">
        <div
          ref={sheenRef}
          {...specular}
          className="glass-dark glass-sheen max-w-xl rounded-[28px] p-7 sm:p-10"
        >
          <p className="eyebrow text-bone/55">The inner circle</p>
          <h2 id="final-title" className="display mt-4 text-[clamp(44px,5.5vw,84px)] leading-[0.95]">
            <SplitText text="Get *20% off* your first order" accentClassName="italic text-ember" />
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-bone/70">
            Early access to drops, restocks before they go public, and nothing you’ll want to unsubscribe from.
          </p>
          <div className="mt-7">
            <NewsletterForm dark id="final-email" />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/collection?category=Women" variant="light" size="sm">Shop women</Button>
            <Button to="/collection?category=Men" variant="outline" size="sm">Shop men</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
