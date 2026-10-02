import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { ShopContext } from "../context/shop-context";
import { useUI } from "../context/ui-context";
import { useOverlay } from "../hooks/useOverlay";
import { useCartLines } from "../hooks/useCartLines";
import CartLineItem from "./CartLineItem";
import AnimatedNumber from "./motion/AnimatedNumber";
import Button from "./ui/Button";
import { ease, formatPrice } from "../lib/motion";

const CartDrawer = () => {
  const { currecy, getCartAmount, getCartCount, shippingCost } = useContext(ShopContext);
  const { cartOpen, setCartOpen } = useUI();
  const navigate = useNavigate();
  const lines = useCartLines().filter((l) => l.details);
  const close = () => setCartOpen(false);
  const panelRef = useOverlay(cartOpen, close);

  const subtotal = getCartAmount();
  const count = getCartCount();

  const go = (path) => {
    close();
    navigate(path);
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={close}
            data-cursor="Close"
          />
          <motion.aside
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            className="absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col bg-bone outline-none shadow-[var(--shadow-float)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.75, ease: ease.inOut }}
          >
            <header className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <div className="flex items-baseline gap-3">
                <h2 className="display text-4xl">Bag</h2>
                <span className="font-mono text-xs text-mute">({count})</span>
              </div>
              <button type="button" onClick={close} aria-label="Close bag" className="flex h-11 w-11 items-center justify-center transition-transform duration-300 hover:rotate-90">
                <X size={20} strokeWidth={1.5} />
              </button>
            </header>

            {lines.length > 0 && (
              <p className="flex items-center gap-2 px-6 pt-4 text-xs text-mute">
                <span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden="true" />
                Cash on delivery available · Flat {formatPrice(currecy, shippingCost)} shipping
              </p>
            )}

            <div className="flex-1 overflow-y-auto px-6" data-lenis-prevent>
              {lines.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.6, ease: ease.out } }}
                  className="flex h-full flex-col items-center justify-center py-16 text-center"
                >
                  <motion.div
                    animate={{ y: [0, -8, 0], rotate: [0, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="flex h-24 w-24 items-center justify-center rounded-full border border-ink/15"
                  >
                    <ShoppingBag size={30} strokeWidth={1.25} />
                  </motion.div>
                  <p className="display mt-6 text-4xl">Your bag is empty</p>
                  <p className="mt-2 max-w-[260px] text-sm text-mute">Nothing here yet — the good stuff is one click away.</p>
                  <div className="mt-8">
                    <Button onClick={() => go("/collection")}>Shop the collection</Button>
                  </div>
                </motion.div>
              ) : (
                <ul>
                  <AnimatePresence initial={false}>
                    {lines.map((item) => (
                      <CartLineItem key={`${item._id}-${item.size}`} item={item} onNavigate={close} compact />
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <footer className="border-t border-ink/10 px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-5">
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-mute">Subtotal</dt>
                    <dd><AnimatedNumber value={subtotal} format={(n) => formatPrice(currecy, n)} className="font-mono" /></dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-mute">Shipping</dt>
                    <dd className="font-mono">{formatPrice(currecy, shippingCost)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between pt-2">
                    <dt className="label-ui">Total</dt>
                    <dd><AnimatedNumber value={subtotal + shippingCost} format={(n) => formatPrice(currecy, n)} className="display text-3xl" /></dd>
                  </div>
                </dl>
                <div className="mt-5 grid gap-2">
                  <Button full size="lg" onClick={() => go("/place-orders")}>Checkout</Button>
                  <button type="button" onClick={() => go("/cart")} className="h-11 label-ui text-mute transition-colors hover:text-ink">
                    View full bag
                  </button>
                </div>
              </footer>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
