import { useContext, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion, useMotionTemplate } from "framer-motion";
import bannerDesktop from "../assets/ninja_masked_banner_desktop.png";
import bannerMobile from "../assets/ninja_masked_banner_mobile.png";
import { ShopContext } from "../context/shop-context";
import SplitText from "./motion/SplitText";
import Button from "./ui/Button";

// Limited edition: the banner starts as a framed window and opens to
// full-bleed as you scroll in (clip-path + counter-scale).
const NInjaMask = () => {
  const { products } = useContext(ShopContext);
  const ref = useRef(null);
  const reduced = useReducedMotion();

  // The old banner linked to a slug route that doesn't exist; resolve the real product.
  const target = useMemo(() => {
    const ninja = products.find((p) => /ninja/i.test(p.name));
    const limited = products.find((p) => p.limitedStocks);
    const p = ninja || limited;
    return p ? `/product/${p._id}` : "/collection";
  }, [products]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const inset = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [16, 0]);
  const round = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [6, 0]);
  const clipPath = useMotionTemplate`inset(${inset}% ${inset}% ${inset}% ${inset}% round ${round}px)`;
  const scale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1.3, 1]);

  return (
    <section ref={ref} className="relative py-16 sm:py-24" aria-labelledby="limited-title">
      <div className="gutter mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow text-mute">( 05 ) — Limited edition · small run</p>
          <h2 id="limited-title" className="display mt-5 text-[clamp(48px,7vw,120px)]">
            <SplitText text="Ninja *masked*" accentClassName="italic text-ember" />
          </h2>
        </div>
        <Button to={target} magnetic>Shop the drop</Button>
      </div>

      <Link to={target} data-cursor="Open" aria-label="Shop the Ninja Masked limited edition" className="block">
        <motion.div style={{ clipPath }} className="relative overflow-hidden bg-ink">
          <motion.picture style={{ scale }} className="block origin-center">
            <source media="(min-width: 768px)" srcSet={bannerDesktop} />
            <img src={bannerMobile} alt="Ninja Masked zipper hoodie, limited edition" loading="lazy" decoding="async" className="block h-auto w-full object-cover" />
          </motion.picture>
          <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 bg-ember px-3 py-1.5 eyebrow !text-[10px] text-ink sm:bottom-8 sm:left-8">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink" /> Few left
          </div>
        </motion.div>
      </Link>
    </section>
  );
};

export default NInjaMask;
