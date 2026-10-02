import { useCallback, useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Package } from "lucide-react";
import { ShopContext } from "../context/shop-context";
import SplitText from "../components/motion/SplitText";
import Button from "../components/ui/Button";
import { ease, formatPrice } from "../lib/motion";
import { img } from "../lib/image";

// Must match the admin panel's status <option>s (admin/src/pages/Orders.jsx).
// The old client only knew pending/shipped/delivered, so admin updates like
// "Packing" or "Out For Delivery" never displayed correctly.
const STEPS = ["Order Placed", "Packing", "Shipped", "Out For Delivery", "Delivered"];
const stepIndex = (status = "") => {
  const s = status.toLowerCase();
  if (s === "pending") return 0;
  const i = STEPS.findIndex((x) => x.toLowerCase() === s);
  return i === -1 ? 0 : i;
};

const formatDate = (timestamp) =>
  new Date(timestamp).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const Timeline = ({ status }) => {
  const idx = stepIndex(status);
  return (
    <div className="mt-6">
      <div className="relative h-px bg-ink/10">
        <motion.div
          className="absolute inset-y-0 left-0 h-px origin-left bg-ember"
          style={{ width: "100%" }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: idx / (STEPS.length - 1) }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: ease.inOut, delay: 0.3 }}
        />
        <div className="absolute inset-x-0 -top-[5px] flex justify-between">
          {STEPS.map((s, i) => (
            <motion.span
              key={s}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + (i / (STEPS.length - 1)) * 1.2, type: "spring", stiffness: 400, damping: 20 }}
              className={`relative h-[11px] w-[11px] rounded-full border ${i <= idx ? "border-ember bg-ember" : "border-ink/25 bg-bone"}`}
            >
              {i === idx && idx < STEPS.length - 1 && <span className="absolute inset-0 animate-ping rounded-full bg-ember/60" />}
            </motion.span>
          ))}
        </div>
      </div>
      <ol className="mt-4 hidden justify-between sm:flex">
        {STEPS.map((s, i) => (
          <li key={s} className={`eyebrow !text-[10px] ${i <= idx ? "text-ink" : "text-mute/60"} ${i === 0 ? "text-left" : i === STEPS.length - 1 ? "text-right" : "text-center"}`}>
            {s}
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm sm:hidden">
        Status: <span className="font-medium">{STEPS[idx]}</span>
      </p>
    </div>
  );
};

const Orders = () => {
  const { backendUrl, token, currecy } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    try {
      if (!token) return;
      const res = await axios.post(backendUrl + "/api/order/userorders", {}, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, token]);

  // Initial load + 10s polling (unchanged), so admin status changes appear live.
  useEffect(() => {
    if (!token) return undefined;
    const first = setTimeout(loadOrders, 0);
    const interval = setInterval(loadOrders, 10000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [token, loadOrders]);

  const sorted = [...orders].sort((a, b) => (b.date || 0) - (a.date || 0));

  return (
    <div className="page-top gutter min-h-[80vh] pb-10">
      <header className="pb-10 pt-8 sm:pt-14">
        <p className="eyebrow text-mute">( Account ) — Order history</p>
        <h1 className="display mt-5 text-[clamp(56px,10vw,160px)]">
          <SplitText text="My *orders*" trigger="mount" accentClassName="italic text-ember" />
        </h1>
      </header>

      {!token ? (
        <div className="border-y border-ink/10 py-20 text-center">
          <p className="display text-4xl">Sign in to see your orders</p>
          <div className="mt-6"><Button to="/login">Sign in</Button></div>
        </div>
      ) : loading ? (
        <div className="space-y-4">{[0, 1].map((i) => <div key={i} className="skeleton h-48" />)}</div>
      ) : sorted.length === 0 ? (
        <div className="flex flex-col items-center border-y border-ink/10 py-20 text-center">
          <Package size={32} strokeWidth={1.25} />
          <p className="display mt-4 text-4xl">No orders yet</p>
          <div className="mt-6"><Button to="/collection">Start shopping</Button></div>
        </div>
      ) : (
        <ul className="space-y-6">
          {sorted.map((order, index) => (
            <motion.li
              key={order._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.8, ease: ease.out }}
              className="border border-ink/10 bg-paper p-5 sm:p-8"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <p className="eyebrow text-mute">Order</p>
                  <p className="mt-1 break-all font-mono text-xs">{order._id}</p>
                  <p className="mt-1 text-xs text-mute">Placed {formatDate(order.date)} · {order.paymentMethod || "COD"}</p>
                </div>
                <p className="display text-4xl">{formatPrice(currecy, order.amount)}</p>
              </div>

              <Timeline status={order.status} />

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {order.items.map((product, idx) => (
                  <li key={idx} className="flex items-center gap-4 border-t border-ink/10 pt-3">
                    <img src={img(product.images?.[0], 160)} alt="" loading="lazy" className="h-20 w-16 bg-stone-2 object-cover" />
                    <div className="min-w-0">
                      <p className="truncate text-sm">{product.name}</p>
                      <p className="mt-1 font-mono text-xs text-mute">
                        {formatPrice(currecy, product.price)} · Qty {product.quantity} · Size {product.size}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
