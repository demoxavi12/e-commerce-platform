import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Tittle from "./Tittle";
import ProductItem from "./ProductItem";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LatestCollection = () => {
    const { products } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        setLatestProducts(products.slice(0, 10));
    }, [products]);

    const navigate = useNavigate();

    return (
        <section className="relative my-20">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-14 px-4">
                <Tittle text1={"LATEST"} text2={"COLLECTION"} />
                <p className="mt-4 text-sm sm:text-base text-gray-500 leading-relaxed">
                    Discover our newest arrivals — thoughtfully designed, premium fabrics,
                    and timeless silhouettes crafted for modern elegance.
                </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4">
                {latestProducts.map((item) => (
                    <ProductItem
                        key={item._id}
                        id={item._id}
                        images={item.images}
                        name={item.name}
                        price={item.price}
                    />
                ))}
            </div>


            {/* View All Button */}
            <div className="flex justify-center mt-14">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/collection")}
                    className="cursor-pointer px-8 py-3 rounded-full bg-[#414141] text-white text-sm tracking-widest hover:bg-black transition-colors shadow-lg"
                >
                    VIEW ALL COLLECTIONS
                </motion.button>
            </div>








        </section>
    );
};

export default LatestCollection;