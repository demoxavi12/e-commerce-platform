import { useContext, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion, useMotionTemplate } from "framer-motion";
import bannerDesktop from "../assets/ninja_masked_banner_desktop.png";
import bannerMobile from "../assets/ninja_masked_banner_mobile.png";
import { ShopContext } from "../context/shop-context";
import SplitText from "./motion/SplitText";
import Button from "./ui/Button";
import { useSpecular } from "../hooks/useSpecular";
import { ease, formatPrice } from "../lib/motion";
import { img } from "../lib/image";

// Limited-edition campaign: the banner starts as a framed window and opens
// to full-bleed on scroll (clip-path + counter-scale); a floating glass panel
// presents the real limited product. No inventory claims beyond the API flag.
const NInjaMask = () => {
  const { products, currecy } = useContext(ShopContext);
  const ref = useRef(null);
  const reduced = useReducedMotion();

  // The old banner linked to a slug route that doesn't exist; resolve the real product.
  const product = useMemo(() => products.find((p) => /ninja/i.test(p.name)) || products.find((p) => p.limitedStocks), [products]);
  const target = product ? `/product/${product._id}` : "/collection";
  const sheenRef = useRef(null);
  const specular = useSpecular(sheenRef);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const inset = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [16, 0]);
  const round = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [6, 0]);
  const clipPath = useMotionTemplate`inset(${inset}% ${inset}% ${inset}% ${inset}% round ${round}px)`;
  const scale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1.3, 1]);

  return (
    <section ref={ref} className="relative py-16 sm:py-24" aria-labelledby="limited-title">
      <div className="gutter mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow text-mute">( 06 ) — Limited edition</p>
          <h2 id="limited-title" className="display mt-5 text-[clamp(48px,7vw,120px)]">
            <SplitText text="Ninja *masked*" accentClassName="italic text-ember" />
          </h2>
        </div>
        <Button to={target} magnetic>Shop the drop</Button>
      </div>

      <div className="relative">
        <Link to={target} data-cursor="Open" aria-label="Shop the Ninja Masked limited edition" className="block">
          <motion.div style={{ clipPath }} className="relative overflow-hidden bg-ink">
            <motion.picture style={{ scale }} className="block origin-center">
              <source media="(min-width: 768px)" srcSet={bannerDesktop} width="1100" height="619" />
              <img src={bannerMobile} width="1080" height="1350" alt="Ninja Masked zipper hoodie, limited edition" loading="lazy" decoding="async" className="block h-auto w-full object-cover" />
            </motion.picture>
          </motion.div>
        </Link>

        {/* Floating glass product panel — real catalogue data only */}
        {product && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1, ease: ease.out, delay: 0.2 }}
            className="relative z-10 mx-[var(--gutter)] -mt-16 md:absolute md:bottom-[8%] md:right-[calc(var(--gutter)+2%)] md:mx-0 md:mt-0 md:w-[min(360px,32vw)]"
          >
            <Link
              to={target}
              ref={sheenRef}
              {...specular}
              className="group glass glass-sheen flex items-center gap-4 rounded-[24px] p-3"
              data-cursor="View"
            >
              <div className="aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-[16px] bg-stone-2">
                <img src={img(product.images?.[0], 300)} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="min-w-0 pr-2">
                <p className="eyebrow !text-[10px] text-mute">Limited edition</p>
                <p className="mt-1 line-clamp-2 text-[15px] leading-snug">{product.name}</p>
                <p className="mt-1.5 font-mono text-sm">{formatPrice(currecy, product.price)}</p>
                {product.sizes?.length > 0 && (
                  <p className="mt-1 font-mono text-[11px] text-mute">Sizes {product.sizes.join(" · ")}</p>
                )}
              </div>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default NInjaMask;
