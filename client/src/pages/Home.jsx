import React from 'react';
import { motion } from 'framer-motion'; // Import motion
import Hero from '../components/Hero';
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';
import TopBrands from '../components/TopBrands';
import OurPolicy from '../components/OurPolicy';
import NewsLetterBox from '../components/NewsLetterBox';
import NInjaMask from '../components/NInjaMask';

const Home = () => {

  // 1. Define the Container Variant (Controls the sequence)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delays each child by 0.2 seconds
        delayChildren: 0.1,   // Slight initial delay
      }
    }
  };

  // 2. Define the Child Variant (The actual animation for each section)
  const sectionVariants = {
    hidden: { 
      opacity: 0, 
      y: 50, // Starts 50px down
      scale: 0.95 // Starts slightly smaller
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4" // Optional: adds slight breathing room if needed
    >
      
      {/* Wrap each component in a motion.div to apply the sectionVariants */}
      
      <motion.div variants={sectionVariants}>
        <Hero/>
      </motion.div>

      <motion.div variants={sectionVariants}>
        <LatestCollection/>
      </motion.div>

      <motion.div variants={sectionVariants}>
        <TopBrands/>
      </motion.div>

      <motion.div variants={sectionVariants}>
        <BestSeller/>
      </motion.div>

      <motion.div variants={sectionVariants}>
        <NInjaMask/>
      </motion.div>

      <motion.div variants={sectionVariants}>
        <OurPolicy/>
      </motion.div>

      <motion.div variants={sectionVariants}>
        <NewsLetterBox/>
      </motion.div>
      
    </motion.div>
  )
}

export default Home;