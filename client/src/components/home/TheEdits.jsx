import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import SplitText from "../motion/SplitText";
import Button from "../ui/Button";
import Reveal from "../motion/Reveal";
import { editorial, size, edits } from "../../assets/editorial";
import { ease, pad } from "../../lib/motion";

// Asymmetric, overlapping collage of campaign "edits". Each frame reveals
// with a clip wipe; the photo drifts inside its frame at its own speed.
// Layout per item: grid placement + aspect + parallax speed (desktop).
const LAYOUT = [
  { cls: "lg:col-span-7 lg:row-span-2", aspect: "aspect-[4/5] lg:aspect-auto lg:h-full", speed: 10 },
  { cls: "lg:col-span-5 lg:mt-24", aspect: "aspect-[4/5]", speed: 18 },
  { cls: "lg:col-span-5 lg:-mt-10", aspect: "aspect-[5/4]", speed: 14 },
  { cls: "lg:col-span-5 lg:col-start-8 lg:row-start-3 lg:mt-10", aspect: "aspect-[4/5]", speed: 20 },
];

const Frame = ({ edit, i }) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const l = LAYOUT[i];
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : [`-${l.speed}%`, `${l.speed}%`]);
  const [w, h] = size[edit.key];

  return (
    <motion.div
      ref={ref}
      className={`group relative ${l.cls}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    >
      <Link to={edit.to} className="block h-full" data-cursor="Shop" aria-label={`${edit.title} — ${edit.subtitle}`}>
        <motion.div
          variants={{ hidden: { clipPath: "inset(100% 0% 0% 0%)" }, visible: { clipPath: "inset(0% 0% 0% 0%)" } }}
          transition={{ duration: 1.3, ease: ease.inOut, delay: (i % 2) * 0.12 }}
          className={`relative overflow-hidden bg-ink-2 ${l.aspect}`}
        >
          <motion.img
            src={editorial[edit.key]}
            width={w}
            height={h}
            alt=""
            loading="lazy"
            decoding="async"
            style={{ y }}
            className="absolute inset-x-0 -top-[20%] h-[140%] w-full object-cover transition-[scale,filter] duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/5 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
            <div>
              <p className="eyebrow !text-[10px] text-bone/60">Edit {pad(i + 1)}</p>
              <h3 className="display mt-2 text-4xl text-bone sm:text-5xl">{edit.title}</h3>
              <p className="mt-1 text-sm text-bone/75">{edit.subtitle}</p>
            </div>
            <span className="glass-chip flex shrink-0 translate-y-2 items-center gap-1.5 rounded-full px-4 py-2 label-ui !text-[10px] opacity-100 transition-all duration-700 ease-[var(--ease-out-expo)] [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100">
              Shop the edit →
            </span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

const TheEdits = () => (
  <section className="bg-charcoal py-24 text-bone sm:py-32" aria-labelledby="edits-title">
    <div className="gutter mb-12 flex flex-col justify-between gap-6 sm:mb-16 sm:flex-row sm:items-end">
      <div>
        <p className="eyebrow text-bone/50">( 02 ) — Campaign edits</p>
        <h2 id="edits-title" className="display mt-5 text-[clamp(52px,7.5vw,128px)]">
          <SplitText text="The *edits*" accentClassName="italic text-champagne" />
        </h2>
      </div>
      <p className="max-w-xs text-[15px] leading-relaxed text-bone/60">
        Four moods from the season, each a door into the collection.
      </p>
    </div>
    <div className="gutter grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
      {edits.map((e, i) => (
        <Frame key={e.key} edit={e} i={i} />
      ))}
      {/* Typographic tile balances the last row */}
      <Reveal className="flex flex-col justify-center py-10 sm:col-span-2 lg:col-span-6 lg:col-start-1 lg:row-start-3 lg:py-0 lg:pr-10">
        <p className="display text-[clamp(36px,4vw,64px)] leading-[1]">
          Pick the one that <span className="italic text-champagne">sounds like you.</span>
        </p>
        <div className="mt-8">
          <Button to="/collection" variant="light">Shop everything</Button>
        </div>
      </Reveal>
    </div>
  </section>
);

export default TheEdits;
