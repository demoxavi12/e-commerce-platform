import { useContext, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { ShopContext } from "../context/shop-context";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setCartItems } = useContext(ShopContext);

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      navigate("/");
      return;
    }
    if (success === "true") {
      setCartItems({});
      toast.success("Payment successful 🎉");
      navigate("/orders");
    } else {
      toast.error("Payment cancelled");
      navigate("/cart");
    }
  }, [orderId, success, navigate, setCartItems]);

  return (
    <div className="flex min-h-[80svh] flex-col items-center justify-center gap-6">
      <motion.span
        className="block h-12 w-12 rounded-full border border-ink/15 border-t-ember"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        aria-hidden="true"
      />
      <p className="eyebrow text-mute" role="status">Verifying payment…</p>
    </div>
  );
};

export default Verify;
