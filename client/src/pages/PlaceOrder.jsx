import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import Tittle from "../components/Tittle";
import CartTotal from "../components/CartTotal";
import assets from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";
import { data } from "react-router-dom";







const PlaceOrder = () => {


  const [method, setMethod] = useState("cod");


  const handlePaymentSelect = (type) => {
    setMethod(type);

    if (type === "stripe" || type === "razorpay") {
      toast.warning(
        "⚠️ Demo Project: Payments are disabled. Do not use real money.",
        {
          position: "top-center",
          autoClose: 4000,
        }
      );
    }
  };




  const { cartItems, addToCart, getCartCount, updateQuantity,
    getCartAmount, navigate, backendUrl, limitedProduct, token, setToken, setCartItems, shippingCost, products } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    Street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",


  })

  const Input = ({ type = "text", ...props }) => (
    <motion.input
      whileFocus={{ scale: 1.01 }}
      type={type}
      {...props}
      className="w-full text-sm border border-gray-300 px-4 py-3 rounded-xl
               focus:outline-none focus:ring-2 focus:ring-black/20"
    />
  );



  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.totalAmount,
      currency: order.currency,
      name: "order Payment",
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      hadeler: async (response) => {
        console.log(response);
        try {
          const response = await axios.post(backendUrl + '/api/order/verifyRazorpay', response, {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (data.success) {
            navigate('/order')
            setCartItems({})

          }
        } catch (error) {
          console.log(error)
          toast.error(error.response.data.message)

        }
      }

    }

    const rzp = new window.Razorpay(options);
    rzp.open()
  }

  const onChangeHandeler = (e) => {
    const name = e.target.name;
    const value = e.target.value;


    setFormData(data => ({ ...data, [name]: value }));
  }

  const onSubmitHandeler = async (e) => {
    e.preventDefault();
    try {

      let orderItems = []
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData =
      {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + shippingCost,



      }

      switch (method) {
        //api call for cash on delivery
        case "cod": {
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          console.log(response.data)
          if (response.data.success) {
            setCartItems({});
            navigate("/orders")
          } else {
            toast.error(response.data.message)
          }
          break;
        }

        case "stripe": {
          const responseStripe = await axios.post(
            backendUrl + "/api/order/stripe",
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          console.log("FULL Stripe response:", responseStripe.data);

          if (!responseStripe.data?.url) {
            console.error("Stripe URL missing ❌", responseStripe.data);
            toast.error("Stripe URL missing");
            return;
          }

          window.location.replace(responseStripe.data.url);
          break;
        }

        case "razorpay": {

          const responseRazorpay = await axios.post(backendUrl + "/api/order/razorpay", orderData, { headers: { Authorization: `Bearer ${token}` } })
          if (responseRazorpay.data.success) {
            initPay("Razorpay response:", responseRazorpay.data.order);
          }
          break;


        }
        default:
        // ...existing code...
      }

    } catch (error) {
      console.log(error);

    }

  }



  return (
    <form onSubmit={onSubmitHandeler} className="min-h-[80vh] border-t border-gray-300 px-4 sm:px-8 pt-8 sm:pt-14">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <div className="text-center mb-12">
          <Tittle text1="CHECKOUT" text2="DETAILS" />
        </div>

        {/* ===== MAIN GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ================= LEFT : DELIVERY INFO ================= */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 sm:p-8"
          >
            <h2 className="text-lg text-center text-gray-500 font-semibold mb-15 tracking-wide">
              DELIVERY INFORMATION
            </h2>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input required onChange={onChangeHandeler} name='firstName' value={formData.firstName} placeholder="First Name" />
                <Input required onChange={onChangeHandeler} name='lastName' value={formData.lastName} placeholder="Last Name" />
              </div>

              <Input required onChange={onChangeHandeler} name='email' value={formData.email} type="email" placeholder="Email Address" />
              <Input required onChange={onChangeHandeler} name='Street' value={formData.Street} placeholder="Street" />
              <Input required onChange={onChangeHandeler} name='city' value={formData.city} placeholder="City" />
              <Input required onChange={onChangeHandeler} name='country' value={formData.country} placeholder="country" />
              <Input required onChange={onChangeHandeler} name='phone' value={formData.phone} type="tel" placeholder="Phone Number" />


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input required onChange={onChangeHandeler} name='state' value={formData.state} placeholder="State" />
                <Input required onChange={onChangeHandeler} name='zip' value={formData.zip} placeholder="Zip Code" />
              </div>
            </div>
          </motion.div>

          {/* ================= RIGHT : ORDER SUMMARY ================= */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6 h-fit lg:sticky lg:top-24"
          >
            {/* Cart Total */}
            <CartTotal />

            {/* Payment */}
            <div className="mt-10">
              <h3 className="text-sm font-semibold mb-4 tracking-widest text-gray-700">
                PAYMENT METHOD
              </h3>

              <div className="space-y-3">
                <PaymentOption
                  active={method === "stripe"}
                  onClick={() => handlePaymentSelect("stripe")}
                >
                  <img src={assets.stripe_logo} className="h-5" />
                </PaymentOption>

                <PaymentOption
                  active={method === "razorpay"}
                  onClick={() => handlePaymentSelect("razorpay")}
                >
                  <img src={assets.razorpay_logo} className="h-5" />
                </PaymentOption>

                <PaymentOption
                  active={method === "cod"}
                  onClick={() => setMethod("cod")}
                >
                  <span className="text-sm text-gray-600 font-medium">
                    CASH ON DELIVERY
                  </span>
                </PaymentOption>
              </div>

              {/* Place Order Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}

                type='submit'
                className="w-full mt-8 py-3 rounded-xl bg-black text-white text-sm tracking-widest hover:bg-gray-900 transition shadow-md"
              >
                PLACE ORDER
              </motion.button>
              <p className="text-xs text-red-500 text-center mb-3">
                ⚠️ This is a demo project. Online-Payments are disabled.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </form>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const Input = ({ type = "text", ...props }) => (
  <motion.input
    whileFocus={{ scale: 1.01 }}
    type={type}
    {...props}
    className="w-full text-sm border border-gray-300 px-4 py-3 rounded-xl
               focus:outline-none focus:ring-2 focus:ring-black/20"
  />
);

const PaymentOption = ({ active, onClick, children }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
    className={`flex items-center gap-4 p-3 border rounded-xl cursor-pointer transition
      ${active ? "border-black bg-gray-50" : "border-gray-300"}`}
  >
    <span
      className={`w-3.5 h-3.5 rounded-full border ${active ? "bg-green-500 border-green-500" : ""
        }`}
    />
    {children}
  </motion.div>
);

export default PlaceOrder;
