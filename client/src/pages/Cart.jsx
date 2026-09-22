import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Tittle from '../components/Tittle';
import { motion, AnimatePresence } from 'framer-motion';
import assets from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {
  const { products, currecy, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {

    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
              details: products.find((product) => product._id === items)
            });
          }
        }
      }
      setCartData(tempData);

    }



  }, [cartItems, products]);

  return (
    <div className="border-t border-gray-300 pt-14 ">
      {/* ===== Header ===== */}
      <div className="text-center max-w-3xl mx-auto mb-14 px-4">
        <Tittle text1="YOUR" text2="CART" />
        <p className="mt-4 text-gray-500">
          Review your items before checkout. Adjust quantities anytime.
        </p>
      </div>

      {/* ===== Cart Items ===== */}
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        <AnimatePresence>
          {cartData.map((item, index) => {
            const product = item.details;
            if (!product) return null;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-50 rounded-2xl shadow-md p-4 sm:p-6 flex flex-col sm:flex-row gap-6"
              >
                {/* Image */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="font-medium">
                      {currecy}{product.price}
                    </span>
                    <span className="px-3 py-1 rounded-full border bg-gray-100">
                      Size: {item.size}
                    </span>
                  </div>

                  {/* Quantity */}
                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-sm text-gray-500">Qty</span>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={((e) =>
                        e.target.value === e.target.value == '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value)))
                      }
                      className="w-16 text-center border border-gray-500 rounded-lg py-1
                    focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />


                  </div>


                </div>

                {/* Total */}
                <div className="flex sm:flex-col justify-between sm:justify-center text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-lg font-semibold">
                    {currecy}{(product.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <img onClick={() => updateQuantity(item._id, item.size, 0)} src={assets.bin_icon} className='w-4 h-4 sm:mt-13 cursor-pointer' alt="" />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty Cart */}
        {cartData.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 py-20"
          >
            Your cart is empty 🛒
          </motion.p>
        )}
      </div>


      <div className='flex justify-center my-20'>
        <div className='w-full px-4'>
          <CartTotal />

          <div className='w-full text-center mt-16'>
            <button onClick={() => navigate('/place-orders')} className='className=" cursor-pointer
                                                bg-[#414141] text-white px-6 py-3 rounded-full
                                                text-sm font-medium tracking-wide
                                                hover:bg-black transition-all duration-300
                                                active:scale-95 shadow-lg"'>
              PROCEED TO CHECKOUT
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
