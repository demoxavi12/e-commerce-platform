import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ProductItem = ({ id, images, name, price }) => {
  const { currecy } = useContext(ShopContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <Link
        to={`/product/${id}`}
        className="block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow duration-300"
      >
        {/* Product Image */}
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-gray-50">
          <img
            src={Array.isArray(images) ? images[0] : images}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Luxury Overlay */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-800 truncate">
            {name}
          </h3>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {currecy} {price}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductItem;


