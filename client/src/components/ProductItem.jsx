import { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, useReducedMotion } from "framer-motion";
import { ShopContext } from "../context/shop-context";
import { useFinePointer } from "../hooks/useMedia";
import { ease, formatPrice, pad } from "../lib/motion";
import { img } from "../lib/image";

// Product card.
// Desktop: 3D tilt toward cursor, light sheen that follows the pointer,
// alternate image cross-fade (if the product has one), "View" cursor label,
// sliding info row with price swap. Touch: static, info always visible.
const ProductItem = ({ id, images, name, price, index, category, tag, className = "", sizes = [] }) => {
  const { currecy } = useContext(ShopContext);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const interactive = fine && !reduced;
  const ref = useRef(null);

  const list = Array.isArray(images) ? images : [images];
  const sizeList = Array.isArray(sizes) ? sizes : [];
  const primary = list[0];
  const alt = list[1];

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [5, -5]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const sheen = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, rgba(255,255,255,0.28), transparent 45%)`;

  const onMove = (e) => {
    if (!interactive || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease: ease.out, delay: typeof index === "number" ? (index % 4) * 0.07 : 0 }}
      className={`group ${className}`}
      style={{ perspective: 1000 }}
    >
      <Link to={`/product/${id}`} className="block" data-cursor="View" aria-label={`${name}, ${formatPrice(currecy, price)}`}>
        <motion.div
          ref={ref}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          style={interactive ? { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" } : undefined}
          className="relative aspect-[3/4] overflow-hidden rounded-[6px] bg-stone-2"
        >
          <img
            src={img(primary, 700)}
            alt=""
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-[transform,opacity] duration-[1.1s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06] ${alt ? "group-hover:opacity-0" : ""}`}
          />
          {alt && (
            <img
              src={img(alt, 700)}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full scale-[1.08] object-cover opacity-0 transition-[transform,opacity] duration-[1.1s] ease-[var(--ease-out-expo)] group-hover:scale-100 group-hover:opacity-100"
            />
          )}

          {interactive && (
            <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-500 group-hover:opacity-100" style={{ background: sheen }} />
          )}

          {/* Corner meta */}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-2.5">
            {typeof index === "number" && <span className="glass-chip rounded-full px-2 py-1 eyebrow !text-[9px]">N°{pad(index + 1, 3)}</span>}
            {tag && <span className="glass-dark rounded-full px-2.5 py-1 eyebrow !text-[9px]">{tag}</span>}
          </div>

          {/* Glass quick-action bar (hover devices): real sizes from the API + view */}
          <div className="glass pointer-events-none absolute inset-x-2.5 bottom-2.5 hidden translate-y-[calc(100%+14px)] items-center justify-between gap-2 rounded-[16px] px-3.5 py-2.5 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-y-0 [@media(hover:hover)]:flex">
            {sizeList.length > 0 ? (
              <span className="min-w-0 truncate font-mono text-[11px] text-ink/80">{sizeList.join(" · ")}</span>
            ) : (
              <span className="label-ui !text-[10px]">View piece</span>
            )}
            <span className="flex shrink-0 items-center gap-1 label-ui !text-[10px]">
              View <span aria-hidden="true">→</span>
            </span>
          </div>
        </motion.div>

        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {category && <p className="eyebrow !text-[10px] text-mute">{category}</p>}
            <h3 className="mt-0.5 line-clamp-1 text-[14px] leading-snug sm:text-[15px]">{name}</h3>
          </div>
          <p className="relative shrink-0 overflow-hidden font-mono text-[13px]">
            <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] [@media(hover:hover)]:group-hover:-translate-y-full">{formatPrice(currecy, price)}</span>
            <span aria-hidden="true" className="absolute inset-0 block translate-y-full text-ember transition-transform duration-500 ease-[var(--ease-out-expo)] [@media(hover:hover)]:group-hover:translate-y-0">
              {formatPrice(currecy, price)}
            </span>
          </p>
        </div>
      </Link>
    </motion.article>
  );
};

export default ProductItem;
