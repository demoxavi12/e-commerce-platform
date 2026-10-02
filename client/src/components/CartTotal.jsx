import { useContext } from "react";
import { ShopContext } from "../context/shop-context";
import AnimatedNumber from "./motion/AnimatedNumber";
import { formatPrice } from "../lib/motion";

// Totals block (cart page + checkout). Same math as before:
// total = subtotal + shipping, or 0 when the bag is empty.
const CartTotal = ({ dark = false }) => {
  const { currecy, getCartAmount, shippingCost } = useContext(ShopContext);
  const subtotal = getCartAmount();
  const total = subtotal === 0 ? 0 : subtotal + shippingCost;
  const fmt = (n) => formatPrice(currecy, n);
  const line = dark ? "border-bone/15" : "border-ink/10";
  const mute = dark ? "text-bone/60" : "text-mute";

  return (
    <dl className="w-full">
      <div className={`flex justify-between border-b ${line} py-3 text-[15px]`}>
        <dt className={mute}>Subtotal</dt>
        <dd><AnimatedNumber value={subtotal} format={fmt} className="font-mono" /></dd>
      </div>
      <div className={`flex justify-between border-b ${line} py-3 text-[15px]`}>
        <dt className={mute}>Shipping fee</dt>
        <dd className="font-mono">{fmt(shippingCost)}</dd>
      </div>
      <div className="flex items-baseline justify-between pt-5">
        <dt className="label-ui">Total</dt>
        <dd><AnimatedNumber value={total} format={fmt} className="display text-4xl sm:text-5xl" /></dd>
      </div>
    </dl>
  );
};

export default CartTotal;
