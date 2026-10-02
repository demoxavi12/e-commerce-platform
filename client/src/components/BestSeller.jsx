import { useContext, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll,
  useSpring, useTransform, useReducedMotion,
} from "framer-motion";
import { ShopContext } from "../context/shop-context";
import ProductItem from "./ProductItem";
import SplitText from "./motion/SplitText";
import Button from "./ui/Button";
import { useIsDesktop } from "../hooks/useMedia";
import { ease, formatPrice, pad } from "../lib/motion";
import { img } from "../lib/image";
import Rail from "./ui/Rail";

const CARD_W = 230;

// Desktop: a CSS-3D carousel ring of real bestsellers. Scroll rotates it,
// dragging spins it, the front-most piece is named underneath.
// Pure transforms — no WebGL, no Spline runtime, ~0 KB extra.
const Ring = ({ items, currency }) => {
  const ref = useRef(null);
  const n = items.length;
  const step = 360 / n;
  const radius = Math.round((CARD_W / 2 / Math.tan(Math.PI / n)) * 1.35);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const drag = useMotionValue(0);
  const scrollRot = useTransform(scrollYProgress, [0, 1], [0, -(360 - step)]);
  const target = useTransform(() => scrollRot.get() + drag.get());
  const rotation = useSpring(target, { stiffness: 70, damping: 20, mass: 0.6 });
  const tilt = useTransform(scrollYProgress, [0, 0.5, 1], [-14, -6, -14]);

  const [active, setActive] = useState(0);
  useMotionValueEvent(rotation, "change", (r) => {
    const idx = ((Math.round(-r / step) % n) + n) % n;
    if (idx !== active) setActive(idx);
  });

  const current = items[active];

  return (
    <section ref={ref} className="relative h-[280vh] bg-ink text-bone" aria-labelledby="best-title">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="gutter flex items-start justify-between pt-[calc(var(--nav-h)+24px)]">
          <p className="eyebrow text-bone/50">( 04 ) — Most wanted</p>
          <p className="eyebrow hidden text-bone/50 sm:block">Scroll or drag to spin</p>
        </div>

        <h2 id="best-title" className="display pointer-events-none absolute inset-x-0 top-1/2 -translate-y-[60%] select-none text-center text-[clamp(80px,15vw,260px)] leading-none text-bone/[0.07]">
          Best<span className="italic">sellers</span>
        </h2>

        <motion.div
          className="relative flex flex-1 cursor-grab items-center justify-center active:cursor-grabbing"
          style={{ perspective: 1800 }}
          onPan={(_, info) => drag.set(drag.get() + info.delta.x * 0.25)}
          data-cursor="Drag"
        >
          <motion.div className="relative" style={{ width: CARD_W, height: CARD_W * 1.33, transformStyle: "preserve-3d", rotateX: tilt, rotateY: rotation }}>
            {items.map((p, i) => (
              <RingCard key={p._id} p={p} i={i} step={step} radius={radius} rotation={rotation} />
            ))}
          </motion.div>
        </motion.div>

        <div className="gutter flex items-end justify-between gap-6 pb-10">
          <div className="min-h-[72px]" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={current?._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: ease.out }}
              >
                <p className="eyebrow text-bone/50">{pad(active + 1)} / {pad(n)} — {current?.category}</p>
                <Link to={`/product/${current?._id}`} className="display mt-1 block text-3xl link-line sm:text-4xl">
                  {current?.name}
                </Link>
                <p className="mt-1 font-mono text-sm text-ember">{formatPrice(currency, current?.price)}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <Button to="/collection" variant="light" magnetic>All bestsellers</Button>
        </div>
      </div>
    </section>
  );
};

const RingCard = ({ p, i, step, radius, rotation }) => {
  const angle = i * step;
  // How directly this card faces the viewer: 1 = front, -1 = back.
  const facing = useTransform(rotation, (r) => Math.cos(((angle + r) * Math.PI) / 180));
  const opacity = useTransform(facing, [-1, 0, 1], [0.18, 0.45, 1]);
  const brightness = useTransform(facing, [-1, 1], [0.35, 1]);
  const filter = useTransform(brightness, (b) => `brightness(${b})`);

  return (
    <motion.div
      className="absolute inset-0"
      style={{ transform: `rotateY(${angle}deg) translateZ(${radius}px)`, opacity }}
    >
      <Link to={`/product/${p._id}`} draggable={false} className="group block h-full w-full" data-cursor="View" aria-label={p.name}>
        <motion.div className="h-full w-full overflow-hidden bg-stone-2" style={{ filter }}>
          <img src={img(p.images?.[0], 500)} alt="" loading="lazy" draggable={false} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </motion.div>
      </Link>
    </motion.div>
  );
};

const BestSeller = () => {
  const { products, currecy } = useContext(ShopContext);
  const desktop = useIsDesktop();
  const reduced = useReducedMotion();

  const bestSeller = useMemo(() => {
    const best = products.filter((item) => item.bestseller);
    // Ring needs ≥6 to read as a ring — top up with latest pieces if needed.
    const fill = products.filter((p) => !p.bestseller).slice(0, Math.max(0, 6 - best.length));
    return [...best, ...fill].slice(0, 10);
  }, [products]);

  if (!bestSeller.length) return null;

  if (desktop && !reduced && bestSeller.length >= 5) return <Ring items={bestSeller} currency={currecy} />;

  return (
    <section className="bg-ink py-24 text-bone" aria-labelledby="best-title-m">
      <div className="gutter mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow text-bone/50">( 04 ) — Most wanted</p>
          <h2 id="best-title-m" className="display mt-5 text-[clamp(48px,12vw,96px)]">
            <SplitText text="Best *sellers*" accentClassName="italic text-ember" />
          </h2>
        </div>
      </div>
      <Rail label="Bestsellers" className="[&_h3]:text-bone [&_p]:!text-bone/70">
        {bestSeller.map((item, i) => (
          <div key={item._id} className="w-[64vw] shrink-0 snap-start sm:w-[40vw]">
            <ProductItem id={item._id} images={item.images} name={item.name} price={item.price} index={i} />
          </div>
        ))}
      </Rail>
      <div className="gutter mt-10">
        <Button to="/collection" variant="light">All bestsellers</Button>
      </div>
    </section>
  );
};

export default BestSeller;
