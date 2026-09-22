import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import { useContext } from "react";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { backendUrl, token, setCartItems } = useContext(ShopContext);

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId) {
        navigate("/");
        return;
      }

      if (success === "true") {
        try {
          // OPTIONAL: you can add a backend verify endpoint later
          setCartItems({});
          toast.success("Payment successful 🎉");
          navigate("/orders");
        } catch (err) {
          toast.error("Payment verification failed");
          navigate("/cart");
        }
      } else {
        toast.error("Payment cancelled");
        navigate("/cart");
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center text-lg">
      Verifying payment...
    </div>
  );
};

export default Verify;
