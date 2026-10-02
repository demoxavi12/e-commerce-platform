import { useContext, useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
import { Lock } from "lucide-react";
import CartTotal from "../components/CartTotal";
import Field from "../components/ui/Field";
import Button from "../components/ui/Button";
import SplitText from "../components/motion/SplitText";
import assets from "../assets/assets";
import { ShopContext } from "../context/shop-context";
import { useCartLines } from "../hooks/useCartLines";
import { ease, formatPrice } from "../lib/motion";
import { img } from "../lib/image";

// Note: the previous version declared <Input> *inside* this component, so every
// keystroke created a new component type and the field remounted (losing focus).
// Fields now use the module-level <Field>. COD/Stripe logic is unchanged.

const PAYMENTS = [
  { id: "stripe", label: <img src={assets.stripe_logo} alt="Stripe" className="h-5" /> },
  { id: "razorpay", label: <img src={assets.razorpay_logo} alt="Razorpay" className="h-5" /> },
  { id: "cod", label: <span className="label-ui">Cash on delivery</span> },
];

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const [submitting, setSubmitting] = useState(false);

  const handlePaymentSelect = (type) => {
    setMethod(type);
    if (type === "stripe" || type === "razorpay") {
      toast.warning("⚠️ Demo Project: Payments are disabled. Do not use real money.", { position: "top-center", autoClose: 4000 });
    }
  };

  const { cartItems, getCartAmount, navigate, backendUrl, token, setCartItems, shippingCost, products, currecy } = useContext(ShopContext);
  const lines = useCartLines().filter((l) => l.details);

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", Street: "", city: "", state: "", zip: "", country: "", phone: "",
  });

  // Razorpay checkout. Fixed vs. the previous version: the option key is
  // `handler` (it was misspelled, so it never ran), the amount comes from the
  // Razorpay order (`amount`, not `totalAmount`), success is read from the
  // verify response (not react-router's `data` export) and it routes to /orders.
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "ELEVÉ",
      description: "Order Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (paymentResponse) => {
        try {
          const { data } = await axios.post(backendUrl + "/api/order/verifyRazorpay", paymentResponse, { headers: { Authorization: `Bearer ${token}` } });
          if (data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(data.message || "Payment verification failed");
          }
        } catch (error) {
          console.log(error);
          toast.error(error.response?.data?.message || "Payment verification failed");
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onChangeHandeler = (e) => {
    const { name, value } = e.target;
    setFormData((d) => ({ ...d, [name]: value }));
  };

  const onSubmitHandeler = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find((product) => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = { address: formData, items: orderItems, amount: getCartAmount() + shippingCost };

      switch (method) {
        case "cod": {
          const response = await axios.post(backendUrl + "/api/order/place", orderData, { headers: { Authorization: `Bearer ${token}` } });
          if (response.data.success) {
            setCartItems({});
            toast.success("Order placed — thank you!");
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;
        }
        case "stripe": {
          const responseStripe = await axios.post(backendUrl + "/api/order/stripe", orderData, { headers: { Authorization: `Bearer ${token}` } });
          if (!responseStripe.data?.url) {
            console.error("Stripe URL missing ❌", responseStripe.data);
            toast.error("Stripe URL missing");
            return;
          }
          window.location.replace(responseStripe.data.url);
          break;
        }
        case "razorpay": {
          const responseRazorpay = await axios.post(backendUrl + "/api/order/razorpay", orderData, { headers: { Authorization: `Bearer ${token}` } });
          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order);
          } else {
            toast.error(responseRazorpay.data.message || "Could not start Razorpay checkout");
          }
          break;
        }
        default:
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Could not place the order");
    } finally {
      setSubmitting(false);
    }
  };

  const f = (name, label, props = {}) => (
    <Field required name={name} label={label} value={formData[name]} onChange={onChangeHandeler} {...props} />
  );

  return (
    <form onSubmit={onSubmitHandeler} className="page-top gutter pb-10">
      <header className="pb-10 pt-8 sm:pt-14">
        <p className="eyebrow text-mute">( Checkout ) — Step 2 of 2</p>
        <h1 className="display mt-5 text-[clamp(56px,9vw,144px)]">
          <SplitText text="Almost *yours*" trigger="mount" accentClassName="italic text-ember" />
        </h1>
      </header>

      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        {/* Delivery */}
        <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out }} aria-labelledby="delivery-title">
          <h2 id="delivery-title" className="label-ui flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink font-mono text-[11px] text-bone">01</span>
            Delivery information
          </h2>
          <div className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
            {f("firstName", "First name", { autoComplete: "given-name" })}
            {f("lastName", "Last name", { autoComplete: "family-name" })}
            {f("email", "Email address", { type: "email", autoComplete: "email", className: "sm:col-span-2" })}
            {f("Street", "Street", { autoComplete: "street-address", className: "sm:col-span-2" })}
            {f("city", "City", { autoComplete: "address-level2" })}
            {f("state", "State", { autoComplete: "address-level1" })}
            {f("zip", "Zip code", { autoComplete: "postal-code", inputMode: "numeric" })}
            {f("country", "Country", { autoComplete: "country-name" })}
            {f("phone", "Phone number", { type: "tel", autoComplete: "tel", className: "sm:col-span-2" })}
          </div>

          <h2 className="label-ui mt-14 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink font-mono text-[11px] text-bone">02</span>
            Payment method
          </h2>
          <LayoutGroup id="pay">
            <div className="mt-6 grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Payment method">
              {PAYMENTS.map((p) => {
                const on = method === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => (p.id === "cod" ? setMethod("cod") : handlePaymentSelect(p.id))}
                    className={`relative flex h-16 items-center gap-3 border px-4 text-left transition-colors ${on ? "border-ink" : "border-ink/15 hover:border-ink/50"}`}
                  >
                    <span className="relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-ink/40">
                      {on && <motion.span layoutId="pay-dot" className="h-2 w-2 rounded-full bg-ember" />}
                    </span>
                    {p.label}
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
          <p className="mt-3 text-xs text-ember">⚠️ This is a demo project. Online payments are disabled.</p>
        </motion.section>

        {/* Summary */}
        <motion.aside
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: ease.out, delay: 0.1 }}
          className="h-fit bg-ink p-6 text-bone sm:p-8 lg:sticky lg:top-[calc(var(--nav-h)+16px)]"
        >
          <p className="eyebrow text-bone/50">Order summary</p>
          <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1" data-lenis-prevent>
            {lines.map((l) => (
              <li key={`${l._id}-${l.size}`} className="flex items-center gap-3">
                <div className="relative h-16 w-13 shrink-0 bg-ink-3">
                  <img src={img(l.details.images?.[0], 160)} alt="" className="h-full w-full object-cover" />
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-ember px-1 font-mono text-[10px] text-ink">{l.quantity}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{l.details.name}</p>
                  <p className="font-mono text-xs text-bone/50">Size {l.size}</p>
                </div>
                <p className="font-mono text-sm">{formatPrice(currecy, l.details.price * l.quantity)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <CartTotal dark />
          </div>
          <div className="mt-8">
            <Button type="submit" full size="lg" variant="light" loading={submitting} disabled={submitting || lines.length === 0}>
              {submitting ? "Placing order" : "Place order"}
            </Button>
          </div>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-bone/50">
            <Lock size={12} /> Encrypted checkout
          </p>
        </motion.aside>
      </div>
    </form>
  );
};

export default PlaceOrder;
