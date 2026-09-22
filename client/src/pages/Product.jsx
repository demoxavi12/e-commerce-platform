import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate
import assets from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";
import RelatedProduct from "../components/RelatedProduct";
import { toast } from "react-toastify"; // Assuming you have toast for alerts

const Product = () => {
  const { productId } = useParams();
  // Added 'token' and 'navigate' to handle auth logic
  const { products, currency, addToCart, token } = useContext(ShopContext);
  const navigate = useNavigate();

  const [productData, setProductData] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [activeSize, setActiveSize] = useState(null);
  const [tab, setTab] = useState("desc");

  // State for the "Fly to Cart" animation
  const [isAnimatingCart, setIsAnimatingCart] = useState(false);

  useEffect(() => {
    const product = products.find((p) => p._id === productId);
    if (product) {
      setProductData(product);
      setActiveImage(product.images[0]);
    }
  }, [productId, products]);

  // --- NEW: Handle Add to Cart Logic ---
  const handleAddToCart = () => {
    // 1. Check if logged in
    if (!token) {
      toast.error("Please login to add items to cart");
      navigate("/login"); // Redirect to login page
      return;
    }

    // 2. Check if size is selected
    if (!activeSize) {
      toast.error("Please select a size");
      return;
    }

    // 3. Trigger Animation
    setIsAnimatingCart(true);

    // 4. Add to cart functionality
    addToCart(productData._id, activeSize);

    // 5. Reset animation after it finishes (1 second)
    setTimeout(() => {
      setIsAnimatingCart(false);
    }, 1000);
  };

  if (!productData) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-t pt-10 px-4 sm:px-10 relative"
    >
      
      {/* ================= ADD TO CART ANIMATION LAYER ================= */}
      {/* This image appears only when adding to cart, flies to top-right, then vanishes */}
      <AnimatePresence>
        {isAnimatingCart && (
          <motion.img
            src={activeImage}
            initial={{ 
              opacity: 1, 
              position: "fixed", 
              top: "50%", 
              left: "50%", 
              width: "200px", 
              height: "200px", 
              zIndex: 9999,
              x: "-50%",
              y: "-50%" 
            }}
            animate={{ 
              top: "5%",       // Moves to top of viewport
              left: "95%",     // Moves to right of viewport (Cart location)
              width: "20px",   // Shrinks
              height: "20px", 
              opacity: 0,      // Fades out
              borderRadius: "50%"
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="object-cover shadow-2xl pointer-events-none border-2 border-white"
          />
        )}
      </AnimatePresence>
      {/* =============================================================== */}

      <div className="flex flex-col lg:flex-row gap-14">
        {/* ================= LEFT : IMAGES ================= */}
        <div className="flex-1 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 sm:w-[90px] overflow-x-auto sm:overflow-y-auto scrollbar-hide">
            {productData.images.map((img, idx) => (
              <motion.img
                key={idx}
                src={img}
                alt=""
                onClick={() => setActiveImage(img)}
                whileHover={{ scale: 1.08 }}
                className="w-16 h-16 sm:w-full sm:h-auto flex-shrink-0 object-cover rounded-lg cursor-pointer border transition opacity-70 hover:opacity-100"
                style={{
                  borderColor: activeImage === img ? "black" : "transparent",
                }}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 bg-gray-50 rounded-2xl overflow-hidden aspect-square max-h-[565px]">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={activeImage}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
          </div>
        </div>

        {/* ================= RIGHT : INFO ================= */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1"
        >
          <h1 className="text-3xl font-semibold">{productData.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-3">
            {[1, 2, 3, 4].map((i) => (
              <img key={i} src={assets.star_icon} className="w-4" alt="" />
            ))}
            <img src={assets.star_dull_icon} className="w-4" alt="" />
            <span className="text-sm text-gray-500 ml-2">(122 reviews)</span>
          </div>

          {/* Price */}
          <p className="mt-6 text-3xl font-semibold">
            {currency} {productData.price}
          </p>

          {/* Description */}
          <p className="mt-6 text-gray-600 leading-relaxed max-w-xl">
            {productData.description}
          </p>

          {/* Sizes */}
          <div className="mt-8">
            <p className="font-medium mb-3">Select Size</p>
            <div className="flex gap-3">
              {productData.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setActiveSize(size)}
                  className={`px-4 py-2 rounded-lg border transition cursor-pointer
                    ${
                      activeSize === size
                        ? "bg-black text-white border-black"
                        : "border-gray-300 hover:border-black"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Buttons - UPDATED */}
          <div className="mt-10 flex gap-4">
            <button
              onClick={handleAddToCart} // Changed from inline function to handler
              className="flex-1 py-3 rounded-xl bg-black text-white cursor-pointer hover:opacity-90 transition active:scale-95"
            >
              {token ? "ADD TO CART" : "LOGIN TO BUY"} 
            </button>

            <button className="w-12 h-12 rounded-xl border flex items-center justify-center cursor-pointer hover:bg-gray-100 transition">
              ♡
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 text-sm text-gray-500 space-y-1">
            <p>✔ Free shipping on orders above $99</p>
            <p>✔ Easy 7-day return</p>
            <p>✔ Secure payments</p>
          </div>
        </motion.div>
      </div>

      {/* ================= DESCRIPTION & REVIEWS ================= */}
      <div className="mt-14 border-t pt-8">
        {/* Tabs */}
        <div className="flex gap-8 text-sm font-medium border-b pb-3">
          <button
            onClick={() => setTab("desc")}
            className={`relative pb-2 transition cursor-pointer ${
              tab === "desc" ? "text-black" : "text-gray-400 hover:text-black"
            }`}
          >
            Description
            {tab === "desc" && (
              <span className="absolute left-0 -bottom-[13px] w-full h-[2px] bg-black" />
            )}
          </button>

          <button
            onClick={() => setTab("reviews")}
            className={`relative pb-2 transition cursor-pointer ${
              tab === "reviews" ? "text-black" : "text-gray-400 hover:text-black"
            }`}
          >
            Reviews (3)
            {tab === "reviews" && (
              <span className="absolute left-0 -bottom-[13px] w-full h-[2px] bg-black" />
            )}
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {tab === "desc" && (
            <motion.div
              key="desc"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 text-gray-600 max-w-2xl leading-relaxed"
            >
              {productData.description ||
                "Crafted with premium materials and designed for everyday comfort. This piece blends modern aesthetics with durability, making it a perfect addition to your wardrobe."}
            </motion.div>
          )}

          {tab === "reviews" && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 space-y-5 max-w-2xl"
            >
              {[
                { name: "Aarav", text: "Amazing quality, fits perfectly!" },
                { name: "Riya", text: "Fabric feels premium. Totally worth it." },
                { name: "Kabir", text: "Looks even better in real life." },
              ].map((review, idx) => (
                <div key={idx} className="border rounded-xl p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{review.name}</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <img
                          key={i}
                          src={assets.star_icon}
                          className="w-3"
                          alt=""
                        />
                      ))}
                      <img src={assets.star_dull_icon} className="w-3" alt="" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{review.text}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Display related Product */}
      <RelatedProduct
        category={productData.category}
        subCategory={productData.subCategory}
        currentId={productData._id}
      />
    </motion.div>
  );
};

export default Product;