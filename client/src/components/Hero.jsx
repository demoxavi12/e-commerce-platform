import { useContext, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { ShopContext } from "../context/shop-context";
import ShaderCanvas from "./motion/ShaderCanvas";
import SplitText from "./motion/SplitText";
import Button from "./ui/Button";
import { useFinePointer } from "../hooks/useMedia";
import { ease, pad } from "../lib/motion";
import { img } from "../lib/image";

// Depth layers for the floating product cluster. z = translateZ, d = mouse depth.
const LAYERS = [
  { cls: "left-0 top-[8%] w-[32%] lg:-left-[4%]", z: -140, d: 18, delay: 0.55, float: "0s" },
  { cls: "left-[28%] top-0 aspect-[3/4] h-[88%] lg:left-[24%] lg:h-[74%]", z: 0, d: 34, delay: 0.35, float: "-2.5s" },
  { cls: "right-[2%] top-[18%] w-[30%] lg:right-[4%] lg:top-[36%] lg:w-[25%]", z: 90, d: 60, delay: 0.75, float: "-5s" },
];

const Hero = () => {
  const { products, currecy } = useContext(ShopContext);
  const ref = useRef(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  // Real products: bestsellers first, then latest.
  const featured = useMemo(() => {
    const best = products.filter((p) => p.bestseller);
    const rest = products.filter((p) => !p.bestseller);
    return [...best, ...rest].slice(0, 3);
  }, [products]);

  // Mouse-driven depth (desktop only)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18 });
  const smy = useSpring(my, { stiffness: 60, damping: 18 });
  const rotY = useTransform(smx, [-1, 1], [-9, 9]);
  const rotX = useTransform(smy, [-1, 1], [7, -7]);

  const onMove = (e) => {
    if (!fine || reduced) return;
    mx.set((e.clientX / window.innerWidth) * 2 - 1);
    my.set((e.clientY / window.innerHeight) * 2 - 1);
  };

  // Scroll choreography: headline lifts, cluster recedes, veil darkens.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "-35%"]);
  const clusterY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "18%"]);
  const clusterScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 0.86]);
  const veil = useTransform(scrollYProgress, [0, 0.9], [0, 0.7]);

  return (
    <section
      ref={ref}
      onPointerMove={onMove}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink text-bone"
      aria-label="ELEVÉ — new season"
    >
      <ShaderCanvas palette="ember" />

      {/* Floating product cluster */}
      <motion.div
        className="absolute bottom-[50%] left-[var(--gutter)] right-[var(--gutter)] top-[calc(var(--nav-h)+56px)] lg:bottom-10 lg:left-[46%]"
        style={{ y: clusterY, scale: clusterScale, perspective: 1400 }}
      >
        <motion.div className="absolute inset-0" style={fine && !reduced ? { rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" } : undefined}>
          {LAYERS.map((l, i) => {
            const p = featured[i];
            return (
              <Layer key={i} layer={l} product={p} index={i} smx={smx} smy={smy} currency={currecy} />
            );
          })}
        </motion.div>
      </motion.div>

      {/* Darken + gradient for legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent lg:bg-gradient-to-r lg:from-ink/80 lg:via-ink/20" />
      <motion.div className="pointer-events-none absolute inset-0 bg-ink" style={{ opacity: veil }} />

      {/* Meta row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 1 }}
        className="gutter absolute inset-x-0 top-[calc(var(--nav-h)+20px)] flex items-start justify-between eyebrow text-bone/60"
      >
        <span>( SS—26 ) &nbsp;Collection N°04</span>
        <span className="hidden sm:block">{products.length ? `${pad(products.length, 3)} pieces in store` : "Loading the edit…"}</span>
      </motion.div>

      {/* Headline + CTA */}
      <motion.div style={{ y: titleY }} className="gutter absolute inset-x-0 bottom-0 pb-[clamp(88px,13vh,140px)]">
        <h1 className="display text-[clamp(64px,13.5vw,232px)] leading-[0.84]">
          <SplitText text="Above" trigger="mount" by="char" stagger={0.045} delay={0.25} duration={1.2} className="block" />
          <SplitText
            text="*ordinary.*"
            trigger="mount"
            by="char"
            stagger={0.045}
            delay={0.5}
            duration={1.2}
            className="block pl-[0.6em] sm:pl-[1.4em]"
            accentClassName="italic text-ember"
          />
        </h1>

        <div className="mt-8 flex flex-col gap-6 sm:mt-10 sm:flex-row sm:items-end sm:gap-12 lg:max-w-[46%] lg:flex-col lg:items-start lg:gap-7">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 1, ease: ease.out }}
            className="max-w-sm text-[15px] leading-relaxed text-bone/70"
          >
            Considered garments for people who’d rather be remembered than noticed. Cut in small runs, shipped worldwide.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 1, ease: ease.out }}
            className="flex flex-wrap items-center gap-3"
          >
            <Button to="/collection" variant="light" size="lg" magnetic cursor="">Shop the collection</Button>
            <a href="#latest" className="group flex h-14 items-center gap-2 px-4 label-ui text-bone/80 hover:text-bone">
              <span className="link-line">New arrivals</span>
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-6 right-[var(--gutter)] hidden items-center gap-3 eyebrow text-bone/50 sm:flex"
        aria-hidden="true"
      >
        Scroll
        <span className="relative block h-10 w-px overflow-hidden bg-bone/20">
          <motion.span
            className="absolute left-0 top-0 block h-1/2 w-px bg-ember"
            animate={reduced ? {} : { y: ["-100%", "220%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: ease.inOut }}
          />
        </span>
      </motion.div>
    </section>
  );
};

const Layer = ({ layer, product, index, smx, smy, currency }) => {
  const x = useTransform(smx, [-1, 1], [-layer.d, layer.d]);
  const y = useTransform(smy, [-1, 1], [-layer.d * 0.6, layer.d * 0.6]);

  return (
    <motion.div
      className={`absolute ${layer.cls} ${index !== 1 ? "hidden sm:block" : ""}`}
      style={{ x, y, z: layer.z, transformStyle: "preserve-3d" }}
    >
      <motion.div
        initial={{ opacity: 0, clipPath: "inset(100% 0% 0% 0%)", scale: 1.15 }}
        animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
        transition={{ delay: layer.delay, duration: 1.4, ease: ease.inOut }}
      >
        <div className="animate-float" style={{ animationDelay: layer.float }}>
          {product ? (
            <Link to={`/product/${product._id}`} className="group block" data-cursor="View" tabIndex={-1} aria-hidden="true">
              <div className="aspect-[3/4] overflow-hidden bg-stone-2 shadow-[var(--shadow-float)]">
                <img
                  src={img(product.images?.[0], index === 1 ? 900 : 600)}
                  alt=""
                  fetchPriority={index === 1 ? "high" : "auto"}
                  className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105"
                />
              </div>
              <div className="mt-2 flex justify-between gap-2 font-mono text-[10px] uppercase tracking-wider text-bone/70">
                <span className="truncate">{product.name}</span>
                <span className="shrink-0 text-ember">{currency}{product.price}</span>
              </div>
            </Link>
          ) : (
            <div className="aspect-[3/4] bg-bone/5 ring-1 ring-bone/10" />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Hero;
