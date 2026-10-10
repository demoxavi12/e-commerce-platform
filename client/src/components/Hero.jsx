import { useContext, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { ShopContext } from "../context/shop-context";
import ShaderCanvas from "./motion/ShaderCanvas";
import SplitText from "./motion/SplitText";
import Button from "./ui/Button";
import { useFinePointer } from "../hooks/useMedia";
import { useSpecular } from "../hooks/useSpecular";
import { ease, formatPrice, pad } from "../lib/motion";
import { img } from "../lib/image";
import { editorial, size } from "../assets/editorial";

// Cinematic opening: atmospheric shader, a large campaign photograph with a
// second image set back in depth, and a floating glass card presenting a
// real catalogue piece. Mouse adds parallax depth; scroll pushes the stage
// back and lifts the headline into the next section.
const Hero = () => {
  const { products, currecy } = useContext(ShopContext);
  const ref = useRef(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const depth = fine && !reduced;

  const featured = useMemo(() => products.find((p) => p.bestseller) || products[0], [products]);
  // Far layer: another real catalogue image (keeps campaign photos for the edits).
  const backdrop = useMemo(() => products.find((p) => p.bestseller && p._id !== featured?._id) || products[1], [products, featured]);

  // Mouse depth (desktop only)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18 });
  const smy = useSpring(my, { stiffness: 60, damping: 18 });
  const rotY = useTransform(smx, [-1, 1], [-6, 6]);
  const rotX = useTransform(smy, [-1, 1], [5, -5]);
  const nearX = useTransform(smx, [-1, 1], [-38, 38]);
  const nearY = useTransform(smy, [-1, 1], [-24, 24]);
  const farX = useTransform(smx, [-1, 1], [14, -14]);
  const farY = useTransform(smy, [-1, 1], [10, -10]);

  const onMove = (e) => {
    if (!depth) return;
    mx.set((e.clientX / window.innerWidth) * 2 - 1);
    my.set((e.clientY / window.innerHeight) * 2 - 1);
  };

  // Scroll choreography
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "-35%"]);
  const stageY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "14%"]);
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 0.9]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.12]);
  const veil = useTransform(scrollYProgress, [0, 0.9], [0, 0.75]);

  return (
    <section
      ref={ref}
      onPointerMove={onMove}
      className="relative h-[100svh] min-h-[660px] w-full overflow-hidden bg-ink text-bone"
      aria-label="ELEVÉ — new season"
    >
      <ShaderCanvas palette="ember" />

      {/* ===== Photographic stage ===== */}
      <motion.div
        className="absolute bottom-[46%] left-[var(--gutter)] right-[var(--gutter)] top-[calc(var(--nav-h)+44px)] lg:bottom-10 lg:left-[52%] lg:top-[calc(var(--nav-h)+28px)]"
        style={{ y: stageY, scale: stageScale, perspective: 1600 }}
      >
        <motion.div className="relative h-full w-full" style={depth ? { rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" } : undefined}>
          {/* Far layer — a second catalogue image, set back in depth */}
          <motion.div
            className="absolute -left-[8%] top-[6%] hidden h-[62%] w-[44%] lg:block"
            style={depth ? { x: farX, y: farY, z: -180 } : undefined}
            initial={{ opacity: 0, clipPath: "inset(10% 10% 10% 10%)" }}
            animate={{ opacity: 0.85, clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 1.4, ease: ease.inOut, delay: 0.35 }}
          >
            {backdrop ? (
              <img src={img(backdrop.images?.[0], 600)} alt="" className="h-full w-full object-cover grayscale-[35%]" />
            ) : (
              <div className="h-full w-full bg-bone/5" />
            )}
          </motion.div>

          {/* Main campaign photograph */}
          <motion.figure
            className="absolute inset-y-0 right-0 m-0 w-[70%] overflow-hidden sm:w-[56%] lg:w-[64%]"
            initial={{ clipPath: "inset(6% 6% 6% 6%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 1.3, ease: ease.inOut, delay: 0.1 }}
          >
            <motion.img
              src={editorial.redWall}
              width={size.redWall[0]}
              height={size.redWall[1]}
              alt="ELEVÉ campaign: model in black against a red wall"
              fetchPriority="high"
              style={{ scale: photoScale }}
              className="h-full w-full object-cover object-[50%_30%]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
            <span className="glass-chip absolute right-3 top-3 rounded-full px-3 py-1.5 eyebrow !text-[10px]">SS—26 · Campaign</span>
          </motion.figure>

          {/* Near layer — floating glass product card (real catalogue item) */}
          <motion.div
            className="absolute left-0 top-[6%] w-[58%] sm:w-[42%] lg:bottom-[10%] lg:left-[4%] lg:top-auto lg:w-[46%]"
            style={depth ? { x: nearX, y: nearY, z: 120 } : undefined}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: ease.out, delay: 0.9 }}
          >
            <FeaturedCard product={featured} currency={currecy} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Legibility: deepen the left/bottom where the copy sits */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent lg:bg-gradient-to-r lg:from-ink/85 lg:via-ink/30 lg:to-transparent" />
      <motion.div className="pointer-events-none absolute inset-0 bg-ink" style={{ opacity: veil }} />

      {/* Meta row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="gutter absolute inset-x-0 top-[calc(var(--nav-h)+20px)] hidden items-start eyebrow text-bone/60 lg:flex"
      >
        <span>( SS—26 ) &nbsp;Collection N°04</span>
      </motion.div>

      {/* Headline + CTA */}
      <motion.div style={{ y: titleY }} className="gutter absolute inset-x-0 bottom-0 pb-[clamp(72px,11vh,128px)] lg:max-w-[54%]">
        <h1 className="display text-[clamp(60px,10vw,180px)] leading-[0.86]">
          <SplitText text="Above" trigger="mount" by="char" stagger={0.04} delay={0.15} duration={1.1} className="block" />
          <SplitText text="*ordinary.*" trigger="mount" by="char" stagger={0.04} delay={0.35} duration={1.1} className="block pl-[0.5em]" accentClassName="italic text-ember" />
        </h1>

        <div className="mt-7 flex flex-col gap-6 sm:mt-9 sm:flex-row sm:items-end sm:gap-10 lg:flex-col lg:items-start lg:gap-7">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1, ease: ease.out }}
            className="max-w-sm text-[15px] leading-relaxed text-bone/75"
          >
            Considered garments for people who’d rather be remembered than noticed. Cut in small runs, shipped worldwide.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 1, ease: ease.out }}
            className="flex flex-wrap items-center gap-3"
          >
            <Button to="/collection" variant="light" size="lg" magnetic>Shop the collection</Button>
            <a href="#latest" className="flex h-14 items-center px-4 label-ui text-bone/80 hover:text-bone">
              <span className="link-line">New arrivals</span>
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue + live count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-5 right-[var(--gutter)] hidden items-center gap-3 eyebrow text-bone/55 sm:flex"
        aria-hidden="true"
      >
        {products.length ? `${pad(products.length, 3)} pieces` : ""}
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

// Glass "now featuring" card. Real product data only; skeleton while loading.
const FeaturedCard = ({ product, currency }) => {
  const sheenRef = useRef(null);
  const specular = useSpecular(sheenRef);
  return (
    <div ref={sheenRef} {...specular} className="glass-dark glass-sheen rounded-[22px] p-2.5">
      {product ? (
        <Link to={`/product/${product._id}`} className="group flex items-center gap-3" data-cursor="View">
          <div className="aspect-[3/4] w-[34%] shrink-0 overflow-hidden rounded-[14px] bg-stone-2">
            <img src={img(product.images?.[0], 400)} alt="" className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105" />
          </div>
          <div className="min-w-0 pr-2">
            <p className="eyebrow !text-[10px] text-bone/55">Now featuring</p>
            <p className="mt-1 line-clamp-2 text-sm leading-snug sm:text-[15px]">{product.name}</p>
            <p className="mt-1.5 font-mono text-xs text-ember">{formatPrice(currency, product.price)}</p>
            <p className="mt-2 hidden items-center gap-1 label-ui !text-[10px] text-bone/70 transition-colors group-hover:text-bone sm:flex">
              Shop piece <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </p>
          </div>
        </Link>
      ) : (
        <div className="flex items-center gap-3" aria-hidden="true">
          <div className="aspect-[3/4] w-[34%] shrink-0 rounded-[14px] bg-bone/10" />
          <div className="flex-1 space-y-2">
            <div className="h-2 w-1/3 rounded bg-bone/15" />
            <div className="h-3 w-3/4 rounded bg-bone/15" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
