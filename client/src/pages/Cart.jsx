import { useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { ShopContext } from "../context/shop-context";
import CartLineItem from "../components/CartLineItem";
import CartTotal from "../components/CartTotal";
import SplitText from "../components/motion/SplitText";
import Button from "../components/ui/Button";
import { useCartLines } from "../hooks/useCartLines";
import { ease, pad } from "../lib/motion";

const Cart = () => {
  const { navigate, getCartCount, products } = useContext(ShopContext);
  const cartData = useCartLines().filter((l) => l.details);
  const count = getCartCount();
  const loading = products.length === 0 && count > 0;

  return (
    <div className="page-top gutter pb-10">
      <header className="flex flex-wrap items-end justify-between gap-4 pb-10 pt-8 sm:pt-14">
        <div>
          <p className="eyebrow text-mute">( Bag ) — Review before checkout</p>
          <h1 className="display mt-5 text-[clamp(56px,10vw,160px)]">
            <SplitText text="Your *bag*" trigger="mount" accentClassName="italic text-ember" />
          </h1>
        </div>
        <p className="pb-3 font-mono text-sm text-mute">{pad(count)} item{count === 1 ? "" : "s"}</p>
      </header>

      {loading ? (
        <div className="space-y-4">
          {[0, 1].map((i) => <div key={i} className="skeleton h-40" />)}
        </div>
      ) : cartData.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out }} className="flex flex-col items-center border-y border-ink/10 py-24 text-center">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="flex h-24 w-24 items-center justify-center rounded-full border border-ink/15">
            <ShoppingBag size={30} strokeWidth={1.25} />
          </motion.div>
          <p className="display mt-6 text-5xl">Your bag is empty</p>
          <p className="mt-2 text-mute">Find something worth keeping.</p>
          <div className="mt-8">
            <Button to="/collection" magnetic>Shop the collection</Button>
          </div>
        </motion.div>
      ) : (
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <ul className="border-t border-ink/10">
            <AnimatePresence initial={false}>
              {cartData.map((item) => (
                <CartLineItem key={`${item._id}-${item.size}`} item={item} />
              ))}
            </AnimatePresence>
          </ul>

          <aside className="h-fit bg-ink p-6 text-bone sm:p-8 lg:sticky lg:top-[calc(var(--nav-h)+16px)]">
            <p className="eyebrow mb-4 text-bone/50">Order summary</p>
            <CartTotal dark />
            <div className="mt-8">
              <Button full size="lg" variant="light" onClick={() => navigate("/place-orders")}>Proceed to checkout</Button>
            </div>
            <p className="mt-4 text-center text-xs text-bone/50">Taxes calculated at checkout. Free exchanges within 7 days.</p>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
