import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import assets from "../../assets/assets";
import { editorial } from "../../assets/editorial";
import SplitText from "../motion/SplitText";
import { ease, pad } from "../../lib/motion";

const CATS = [
  { name: "Men", img: editorial.rosesPanel, line: "Structured, easy, built to repeat." },
  { name: "Women", img: assets.women_collection, line: "Fluid lines, sharp details." },
  { name: "Kids", img: assets.kids_collection, line: "Made for mess. Made to last." },
];

// Three tall panels. Desktop: hovered panel widens (flex-grow), image
// parallaxes inside its frame, curtain reveal on entry. Links pre-filter
// /collection via ?category=.
const Panel = ({ cat, i }) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-12%", "12%"]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="group relative min-h-[56vw] flex-1 transition-[flex-grow] duration-[900ms] ease-[var(--ease-out-expo)] sm:min-h-[44vw] lg:h-[78vh] lg:min-h-0 lg:hover:flex-[1.9]"
    >
      <motion.div
        variants={{ hidden: { clipPath: "inset(100% 0% 0% 0%)" }, visible: { clipPath: "inset(0% 0% 0% 0%)" } }}
        transition={{ duration: 1.3, ease: ease.inOut, delay: i * 0.12 }}
        className="absolute inset-0 overflow-hidden bg-ink"
      >
      <Link to={`/collection?category=${cat.name}`} className="absolute inset-0 z-10" data-cursor="Shop" aria-label={`Shop ${cat.name}`} />
      <motion.img
        src={cat.img}
        alt=""
        loading="lazy"
        decoding="async"
        style={{ y }}
        className="absolute inset-[-12%_0] h-[124%] w-full object-cover opacity-80 transition-[transform,opacity] duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-bone sm:p-7">
        <div>
          <p className="eyebrow text-bone/60">{pad(i + 1)} / {pad(CATS.length)}</p>
          <h3 className="display mt-2 text-6xl sm:text-7xl lg:text-8xl">{cat.name}</h3>
          <p className="mt-2 max-w-[220px] translate-y-2 text-sm text-bone/70 opacity-100 transition-all duration-700 ease-[var(--ease-out-expo)] lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
            {cat.line}
          </p>
        </div>
        <span className="glass-chip mb-2 flex h-12 w-12 items-center justify-center rounded-full text-lg transition-all duration-500 group-hover:-rotate-45 group-hover:!bg-ember">
          →
        </span>
      </div>
      </motion.div>
    </motion.div>
  );
};

const CategoryPanels = () => (
  <section className="gutter py-24 sm:py-32" aria-labelledby="cat-title">
    <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-14 sm:flex-row sm:items-end">
      <div>
        <p className="eyebrow text-mute">( 03 ) — Shop by wardrobe</p>
        <h2 id="cat-title" className="display mt-5 text-[clamp(48px,6.5vw,112px)]">
          <SplitText text="Dress *everyone*" accentClassName="italic text-ember" />
        </h2>
      </div>
      <p className="max-w-xs text-[15px] leading-relaxed text-mute">
        Three wardrobes, one point of view. Hover to open a panel, click to step inside.
      </p>
    </div>
    <div className="flex flex-col gap-3 lg:flex-row">
      {CATS.map((c, i) => (
        <Panel key={c.name} cat={c} i={i} />
      ))}
    </div>
  </section>
);

export default CategoryPanels;
