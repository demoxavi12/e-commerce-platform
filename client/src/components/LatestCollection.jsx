import { useContext, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring, useTransform, useVelocity, useReducedMotion } from "framer-motion";
import { ShopContext } from "../context/shop-context";
import ProductItem from "./ProductItem";
import SplitText from "./motion/SplitText";
import { useIsDesktop } from "../hooks/useMedia";
import { pad } from "../lib/motion";
import Rail from "./ui/Rail";

// Desktop: vertical scroll is converted into a horizontal pan across the
// newest pieces (sticky stage + translateX). Mobile/reduced motion: native
// swipe rail with scroll-snap.
const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const latestProducts = useMemo(() => products.slice(0, 10), [products]);
  const desktop = useIsDesktop();
  const reduced = useReducedMotion();
  const pinned = desktop && !reduced;

  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    if (!pinned || !trackRef.current) return undefined;
    const measure = () => setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned, latestProducts.length]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const rawX = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const x = useSpring(rawX, { stiffness: 140, damping: 30, mass: 0.4 });
  // Cards lean into the pan proportionally to its speed, then settle.
  const skewX = useSpring(useTransform(useVelocity(x), [-2500, 0, 2500], [5, 0, -5]), { stiffness: 200, damping: 30 });
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const intro = (
    <div className="flex w-[82vw] shrink-0 flex-col justify-between pr-10 sm:w-[60vw] lg:w-[34vw]">
      <div>
        <p className="eyebrow text-mute">( 01 ) — Just landed</p>
        <h2 className="display mt-6 text-[clamp(56px,7.5vw,128px)]">
          <SplitText text="New" className="block" />
          <SplitText text="*arrivals*" className="block pl-[0.5em]" accentClassName="italic text-ember" delay={0.1} />
        </h2>
      </div>
      <div className="mt-8 max-w-xs">
        <p className="text-[15px] leading-relaxed text-mute">
          The latest drop — heavyweight fabrics, honest construction and silhouettes made to be lived in.
        </p>
        <p className="mt-6 font-mono text-xs">{pad(latestProducts.length)} pieces →</p>
      </div>
    </div>
  );

  const outro = (
    <Link
      to="/collection"
      data-cursor="Open"
      className="group relative flex aspect-[3/4] w-[60vw] shrink-0 flex-col items-center justify-center overflow-hidden bg-ink text-bone sm:w-[36vw] lg:w-[22vw]"
    >
      <span className="absolute inset-0 origin-bottom scale-y-0 bg-ember transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
      <span className="relative display text-5xl transition-colors duration-500 group-hover:text-ink lg:text-6xl">View all</span>
      <span className="relative mt-3 eyebrow text-bone/60 transition-colors duration-500 group-hover:text-ink">{products.length} pieces</span>
    </Link>
  );

  const cards = latestProducts.map((item, i) => (
    <motion.div key={item._id} style={pinned ? { skewX } : undefined} className={`w-[64vw] shrink-0 snap-start sm:w-[38vw] lg:w-[22vw] ${pinned && i % 2 === 1 ? "lg:mt-24" : ""}`}>
      <ProductItem sizes={item.sizes} id={item._id} images={item.images} name={item.name} price={item.price} index={i} category={item.category} tag={i === 0 ? "New" : undefined} />
    </motion.div>
  ));

  if (!pinned) {
    return (
      <section id="latest" ref={sectionRef} className="relative py-24" aria-label="New arrivals">
        <div className="gutter mb-10">{intro}</div>
        <Rail label="New arrivals" className="pb-4">
          {cards}
          {outro}
        </Rail>
      </section>
    );
  }

  return (
    <section
      id="latest"
      ref={sectionRef}
      aria-label="New arrivals"
      className="relative"
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={trackRef} style={{ x }} className="gutter flex w-max items-start gap-8 will-change-transform">
          {intro}
          {cards}
          {outro}
        </motion.div>
        <div className="gutter absolute inset-x-0 bottom-8 flex items-center gap-4">
          <span className="eyebrow text-mute">Scroll</span>
          <div className="h-px flex-1 bg-ink/10">
            <motion.div className="h-px origin-left bg-ink" style={{ scaleX: bar }} />
          </div>
          <span className="eyebrow text-mute">{pad(latestProducts.length)}</span>
        </div>
      </div>
    </section>
  );
};

export default LatestCollection;
