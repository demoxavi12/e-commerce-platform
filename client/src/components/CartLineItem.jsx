import { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { ShopContext } from "../context/shop-context";
import AnimatedNumber from "./motion/AnimatedNumber";
import { ease, formatPrice } from "../lib/motion";
import { img } from "../lib/image";

// One bag line — shared by the drawer and the /cart page.
// Uses ShopContext.updateQuantity exactly as before (0 = remove).
export const QtyStepper = ({ value, onChange, min = 1, size = "md" }) => {
  const h = size === "sm" ? "h-9" : "h-11";
  return (
    <div className={`inline-flex ${h} items-center rounded-full border border-ink/15 bg-white/40 p-0.5`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={`flex h-full w-9 items-center justify-center rounded-full transition-colors hover:bg-ink hover:text-bone disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current`}
      >
        <Minus size={14} />
      </button>
      <span className="relative w-8 overflow-hidden text-center font-mono text-sm" aria-live="polite">
        <motion.span key={value} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3, ease: ease.out }} className="block">
          {value}
        </motion.span>
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label="Increase quantity"
        className={`flex h-full w-9 items-center justify-center rounded-full transition-colors hover:bg-ink hover:text-bone`}
      >
        <Plus size={14} />
      </button>
    </div>
  );
};

const CartLineItem = ({ item, onNavigate, compact = false }) => {
  const { currecy, updateQuantity } = useContext(ShopContext);
  const product = item.details;
  if (!product) return null;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 60, transition: { duration: 0.35, ease: ease.inOut } }}
      transition={{ duration: 0.6, ease: ease.out }}
      className="flex gap-4 border-b border-ink/10 py-5"
    >
      <Link to={`/product/${product._id}`} onClick={onNavigate} className={`group shrink-0 overflow-hidden rounded-[14px] bg-stone-2 ${compact ? "h-28 w-22" : "h-36 w-28 sm:h-44 sm:w-36"}`}>
        <img src={img(product.images?.[0], 320)} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/product/${product._id}`} onClick={onNavigate} className={`block leading-snug link-line ${compact ? "text-sm" : "text-base sm:text-lg"}`}>
              {product.name}
            </Link>
            <p className="mt-1 font-mono text-xs text-mute">
              Size {item.size} · {formatPrice(currecy, product.price)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => updateQuantity(item._id, item.size, 0)}
            aria-label={`Remove ${product.name}, size ${item.size}`}
            className="-mr-2 -mt-2 flex h-10 w-10 shrink-0 items-center justify-center text-mute transition-all hover:rotate-90 hover:text-ember"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-auto flex items-end justify-between pt-4">
          <QtyStepper size={compact ? "sm" : "md"} value={item.quantity} onChange={(q) => updateQuantity(item._id, item.size, q)} />
          <AnimatedNumber value={product.price * item.quantity} format={(n) => formatPrice(currecy, n)} className="font-mono text-sm" />
        </div>
      </div>
    </motion.li>
  );
};

export default CartLineItem;
