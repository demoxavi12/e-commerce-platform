import React, { useContext, useState, useEffect, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import assets from '../assets/assets';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductItem from '../components/ProductItem';
import Tittle from '../components/Tittle';
import MerchandiseCollections from '../components/MerchandiseCollections';
import BrandCollection from '../components/BrandCollection';
import LimitedStocks from '../components/LimitedStocks';

const Collection = () => {
  const [sortOption, setSortOption] = useState('');
  const [sortOpen, setSortOpen] = useState(false);
  const { products, search, showSearch } = useContext(ShopContext);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeType, setActiveType] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredProducts = products.filter((item) => {
    if (
      activeCategory &&
      item.category?.toLowerCase() !== activeCategory.toLowerCase()
    ) {
      return false;
    }
    if (
      activeType &&
      item.subcategory?.toLowerCase() !== activeType.toLowerCase()
    ) {
      return false;
    }
    if (
      search &&
      !item.name.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  useEffect(() => {
    if (search.trim() === '') return;
    setActiveCategory(null);
    setActiveType(null);
  }, [search]);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'price-low-high':
        return a.price - b.price;
      case 'price-high-low':
        return b.price - a.price;
      case 'rating-high-low':
        return (b.rating || 0) - (a.rating || 0);
      case 'name-az':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const DEFAULT_LIMIT = 12;
  const visibleProducts = activeCategory
    ? sortedProducts
    : sortedProducts.slice(0, DEFAULT_LIMIT);

  const sortRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = [
    {
      name: 'Men',
      types: ['TopWear', 'BottomWear', 'WinterWear'],
      image: assets.men_collection1,
    },
    {
      name: 'Women',
      types: ['TopWear', 'BottomWear', 'WinterWear'],
      image: assets.women_collection,
    },
    {
      name: 'Kids',
      types: ['TopWear', 'BottomWear', 'WinterWear'],
      image: assets.kids_collection,
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pt-10 border-t border-gray-200 flex flex-col items-center min-h-screen overflow-x-hidden bg-gradient-to-b from-gray-50/50 to-white"
    >
      {/* ===== CATEGORY BAR ===== */}
      <div className="relative flex justify-center gap-6 sm:gap-10 text-base sm:text-lg font-medium px-4">
        {categories.map((cat, index) => (
          <motion.div 
            key={cat.name} 
            className="group relative"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* CATEGORY BUTTON */}
            <button
              onClick={() => {
                setActiveCategory(cat.name);
                setActiveType(null);
              }}
              className={`pb-2 border-b-2 transition-all duration-300 cursor-pointer relative ${
                activeCategory === cat.name
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-600 hover:text-black hover:border-gray-300'
              }`}
            >
              <span className="relative z-10">{cat.name.toUpperCase()}</span>
              {activeCategory === cat.name && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 -mb-0.5 border-b-2 border-black"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>

            {/* HOVER BUFFER + MENU */}
            <div
              className="absolute left-1/2 top-full pt-4 z-50 -translate-x-1/2
                opacity-0 scale-95 translate-y-2
                pointer-events-none
                transition-all duration-300 ease-out
                group-hover:opacity-100
                group-hover:scale-100
                group-hover:translate-y-0
                group-hover:pointer-events-auto"
            >
              {/* FLOATING PANEL - FIXED FOR MOBILE */}
              <motion.div
                initial={false}
                className={`
                  flex flex-col sm:flex-row
                  w-[calc(100vw-2rem)] sm:w-[600px] md:w-[680px]
                  max-w-[90vw] sm:max-w-[680px]
                  rounded-2xl
                  bg-white/98 backdrop-blur-xl
                  shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] ring-1 ring-black/5
                  overflow-hidden
                  mx-4 sm:mx-0
                `}
              >
                {/* LEFT OPTIONS */}
                <div className="w-full sm:w-1/2 p-4 sm:p-6">
                  <p className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
                    <span className="w-8 h-0.5 bg-black rounded-full"></span>
                    {cat.name} Clothing
                  </p>

                  <div className="flex flex-col gap-2 sm:gap-3">
                    {cat.types.map((type, idx) => (
                      <motion.button
                        key={type}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => {
                          setActiveCategory(cat.name);
                          setActiveType(type);
                        }}
                        className="
                          text-left px-4 py-3 rounded-xl cursor-pointer
                          text-gray-700 font-medium
                          hover:bg-gray-50 hover:text-black hover:pl-6
                          transition-all duration-200
                          border border-transparent hover:border-gray-200
                          active:scale-95
                        "
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {type}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* RIGHT IMAGE - Responsive handling */}
                <div className="hidden sm:block sm:w-1/2 relative overflow-hidden group/image">
                  <motion.img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover/image:scale-110"
                    whileHover={{ scale: 1.05 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ===== SORT DROPDOWN ===== */}
      <motion.div 
        ref={sortRef} 
        className="relative mt-8 sm:mt-10 px-4 flex justify-center w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="relative">
          {/* SORT BUTTON */}
          <motion.button
            onClick={() => setSortOpen(!sortOpen)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              flex items-center gap-2
              px-5 py-2.5 sm:px-6 sm:py-3
              rounded-xl
              bg-white/95 backdrop-blur-md
              shadow-lg hover:shadow-xl
              ring-1 ring-black/5
              text-sm sm:text-base font-semibold
              text-gray-800
              transition-all duration-200
              cursor-pointer
              ${sortOpen ? 'ring-2 ring-black/10 bg-gray-50' : ''}
            `}
          >
            <span>Sort By</span>
            <motion.span
              animate={{ rotate: sortOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-gray-500"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="sm:w-3.5 sm:h-3.5">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.span>
          </motion.button>

          {/* DROPDOWN PANEL */}
          <AnimatePresence>
            {sortOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="
                  absolute right-0 mt-3 z-50
                  w-[calc(100vw-2rem)] sm:w-72
                  max-w-sm
                  rounded-2xl
                  bg-white/98 backdrop-blur-xl
                  shadow-2xl ring-1 ring-black/5
                  overflow-hidden
                  origin-top-right
                "
              >
                <div className="p-4 sm:p-5">
                  <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">
                    Sort Products
                  </p>

                  <div className="flex flex-col gap-1">
                    {[
                      { label: 'Price: Low → High', value: 'price-low-high' },
                      { label: 'Price: High → Low', value: 'price-high-low' },
                      { label: 'Rating: High → Low', value: 'rating-high-low' },
                      { label: 'Name: A → Z', value: 'name-az' },
                    ].map((opt, idx) => (
                      <motion.button
                        key={opt.value}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => {
                          setSortOption(opt.value);
                          setSortOpen(false);
                        }}
                        className={`
                          text-left px-4 py-3 rounded-xl
                          transition-all duration-200 cursor-pointer
                          font-medium
                          ${sortOption === opt.value
                            ? 'bg-black text-white shadow-md'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                          }
                        `}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <span>{opt.label}</span>
                          {sortOption === opt.value && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-xs"
                            >
                              ✓
                            </motion.span>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ===== SEARCH RESULT INFO ===== */}
      <AnimatePresence>
        {showSearch && search && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 sm:mt-8 text-sm text-gray-500 text-center px-4"
          >
            Showing results for "<span className="font-semibold text-gray-900">{search}</span>"
          </motion.p>
        )}
      </AnimatePresence>

      {/* ===== NO PRODUCTS MESSAGE ===== */}
      <AnimatePresence>
        {visibleProducts.length === 0 && (
          <motion.p 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="col-span-full text-center text-gray-500 mt-10 px-4"
          >
            No products found
            {search && (
              <>
                {' '}for "<span className="font-semibold text-gray-900">{search}</span>"
              </>
            )}
          </motion.p>
        )}
      </AnimatePresence>

      {/* ===== PRODUCT GRID ===== */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 px-4 mb-10 w-full max-w-7xl"
      >
        {visibleProducts.map((item, index) => (
          <motion.div
            key={item._id}
            variants={itemVariants}
            custom={index}
            layoutId={item._id}
          >
            <ProductItem
              id={item._id}
              images={item.images}
              name={item.name}
              price={item.price}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* ===== ADDITIONAL SECTIONS ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full"
      >
        <MerchandiseCollections />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-full"
      >
        <LimitedStocks />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full"
      >
        <BrandCollection />
      </motion.div>
    </motion.div>
  );
};

export default Collection;