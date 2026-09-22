import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Tittle from './Tittle';
import ProductItem from './ProductItem';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';


const BestSeller = () => {
    const { products } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);
     const navigate = useNavigate();

    useEffect(() => {
        const bestProduct = products.filter((item) => item.bestseller);
        setBestSeller(bestProduct.slice(0, 5))
    }, [products]);
    return (
        <div className="relative my-20">
            <div className="text-center max-w-3xl mx-auto mb-14 px-4">
                <Tittle text1={"BEST"} text2={"SELLERS"} />
                <p className="mt-4 text-sm sm:text-base text-gray-500 leading-relaxed">
                    Explore our best sellers — refined designs, superior craftsmanship,
                    and enduring styles loved by customers worldwide.
                </p>
            </div>



            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4">
                {bestSeller.map((item) => (
                    <ProductItem
                        key={item._id}
                        id={item._id}
                        images={item.images}
                        name={item.name}
                        price={item.price}
                    />
                ))}
            </div>

            {/* View more Button */}
            <div className="flex justify-center mt-14">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/collection")}
                    className="cursor-pointer px-8 py-3 rounded-full bg-[#414141] text-white text-sm tracking-widest hover:bg-black transition-colors shadow-lg"
                >
                    VIEW MORE
                </motion.button>
            </div>

        </div>
    )
}

export default BestSeller