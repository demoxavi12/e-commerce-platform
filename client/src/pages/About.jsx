import React from "react";
import { motion } from "framer-motion";
import Tittle from "../components/Tittle";
import assets from "../assets/assets";
import NewsLetterBox from "../components/NewsLetterBox";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const About = () => {
  return (
    <div className="border-t border-gray-300">
      {/* ================= ABOUT HEADER ================= */}
      <section className="px-4 sm:px-8 pt-10 sm:pt-14">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <Tittle text1="ABOUT" text2="US" />
        </motion.div>

        {/* ================= ABOUT CONTENT ================= */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row gap-12 items-center"
          >
            {/* Image */}
            <img
              src={assets.about_img}
              alt="About us"
              className="w-full md:max-w-[450px] rounded-2xl shadow-md"
            />

            {/* Text */}
            <div className="flex flex-col gap-6 text-gray-700 text-[15px] leading-relaxed">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi
                nihil adipisci atque fugiat quidem. Voluptatibus corrupti,
                impedit cumque debitis perspiciatis amet minima facere
                molestias.
              </p>

              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
                molestias fuga tenetur culpa mollitia optio voluptatum magnam
                earum cupiditate.
              </p>

              <h3 className="text-lg font-semibold mt-6 tracking-wide">
                OUR MISSION
              </h3>

              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos
                consequatur consectetur illo, dolores amet dicta pariatur ex
                hic dolore laudantium officiis reiciendis.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="px-4 sm:px-8 mt-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Tittle text1="WHY" text2="CHOOSE US" />
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {[
            {
              title: "Quality Assurance",
              text: "We ensure every product meets strict quality standards before reaching you.",
            },
            {
              title: "Convenience",
              text: "Shop effortlessly with smooth navigation, fast delivery, and secure checkout.",
            },
            {
              title: "Exceptional Support",
              text: "Our support team is always available to help you at every step.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -6 }}
              className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition"
            >
              <h4 className="text-sm font-semibold tracking-widest mb-3">
                {item.title}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}
      <NewsLetterBox />
    </div>
  );
};

export default About;
