import { useContext, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Tittle from "./Tittle";

const LimitedStocks = () => {
    const { products, currecy } = useContext(ShopContext);
    const sliderRef = useRef(null);

    // ✅ FILTER LIMITED STOCK PRODUCTS
    const limitedProducts = products.filter(
        (item) => item.limitedStocks === true
    );

    const slide = (direction) => {
        if (!sliderRef.current) return;

        const cardWidth = 180;
        sliderRef.current.scrollBy({
            left: direction === "next" ? cardWidth : -cardWidth,
            behavior: "smooth",
        });
    };

    return (
        <div className="mt-16 px-4 relative">
            {/* ===== HEADER ===== */}
            <div className="text-center max-w-3xl mx-auto mb-14 px-4">
                <Tittle text1={"LIMITED"} text2={"EDITIONS"} />
                <p className="mt-4 text-sm sm:text-base text-gray-500 leading-relaxed">
                    Explore our Limited Stocks collection — exclusive, rare finds that won't last long.
                </p>
            </div>

            {/* ===== CAROUSEL ===== */}
            <div className=" relative mt-5 group">
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
                    {limitedProducts.map((item) => (
                        <motion.div
                            key={item._id}
                            whileHover={{ y: -6 }}
                            className="flex-shrink-0
                         w-[160px] h-[160px]
                         sm:w-[190px] sm:h-[190px]
                         md:w-[220px] md:h-[220px]
                         lg:w-[250px] lg:h-[250px]"
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

                                {/* OPTIONAL INFO */}
                                
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

export default LimitedStocks;
