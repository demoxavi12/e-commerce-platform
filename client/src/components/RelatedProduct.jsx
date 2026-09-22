import React, { useContext, useEffect, useRef, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Tittle from "./Tittle";

const RelatedProduct = ({ category, subCategory, currentId }) => {
  const { products, currecy } = useContext(ShopContext);
  const [related, setRelated] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (!products.length) return;

    const filteredProducts = products
      .filter(
        (item) =>
          item.category === category &&
          item.subCategory === subCategory &&
          item._id !== currentId
      )
      .slice(0, 6);

    setRelated(filteredProducts);
  }, [products, category, subCategory, currentId]);

  const slide = (direction) => {
    if (!sliderRef.current) return;

    const cardWidth = 180;
    sliderRef.current.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  if (!related.length) return null; // optional: hide if no related products

  return (
    <div className="mt-16 relative">
      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-14 px-4">
        <Tittle text1={"RELATED"} text2={"PRODUCTS"} />
        <p className="mt-4 text-sm sm:text-base text-gray-500 leading-relaxed">
          Find products similar to what you’re viewing.
        </p>
      </div>

      {/* CAROUSEL */}
      <div className=" mb-2 relative mt-16 px-4 group">
        {/* PREV */}
        <button
          onClick={() => slide("prev")}
          className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20
                     w-12 h-12 rounded-full bg-gray-100 shadow-md items-center justify-center"
        >
          ‹
        </button>

        {/* SCROLLER */}
        <div
          ref={sliderRef}
          className="flex gap-6 pt-6 pb-6 overflow-x-auto scroll-smooth scrollbar-hide"
        >
          {related.map((item) => (
            <motion.div
              key={item._id}
              whileHover={{ y: -6 }}
              className="flex-shrink-0
                         w-[260px] h-[300px]
                         sm:w-[280px] sm:h-[330px]
                         md:w-[300px] md:h-[340px]
                         lg:w-[250px] lg:h-[300px]"
            >
              <Link
                to={`/product/${item._id}`}
                
                className="group w-full h-full rounded-2xl bg-white shadow-sm hover:shadow-xl
                           transition flex flex-col items-center justify-center"
              >
                <div className="relative w-full h-full overflow-hidden rounded-xl bg-gray-50">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="mt-2 text-center">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500 pt-2 pb-3">
                    {currecy}{item.price}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* NEXT */}
        <button
          onClick={() => slide("next")}
          className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20
                     w-12 h-12 rounded-full bg-gray-100 shadow-md items-center justify-center"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default RelatedProduct;
