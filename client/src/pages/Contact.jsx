import React from "react";
import { motion } from "framer-motion";
import Tittle from "../components/Tittle";
import NewsLetterBox from "../components/NewsLetterBox";
import assets from "../assets/assets";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Contact = () => {
  return (
    <div className="border-t border-gray-300">
      {/* ================= HEADER ================= */}
      <section className="px-4 items-center sm:px-8 pt-10 sm:pt-14">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Tittle text1="CONTACT" text2="US" />
          <p className="text-gray-500 text-sm mt-3">
            We’d love to hear from you. Let’s get in touch.
          </p>
        </motion.div>

        {/* ================= STORE INFO ================= */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'
        >
          {/* Image */}
          <img
            src={assets.contact_img}
            alt="Contact"
            className="w-full md:max-w-[480px] rounded-2xl shadow-md"
          />

          {/* Info */}
          <div className="flex flex-col  gap-5 text-sm mt-18 text-gray-600">
            <h3 className="text-base font-semibold tracking-widest">
              OUR STORE
            </h3>

            <p className="leading-relaxed">
              54709 Willms Station <br />
              Suite 350, Washington, USA
            </p>

            <p className="leading-relaxed">
              Tel: (415) 555-0132 <br />
              Email: admin@eleve.com
            </p>

            <h3 className="text-base font-semibold tracking-widest mt-4">
              CAREERS AT ELEVÉ
            </h3>

            <p>
              Learn more about our teams and current job openings.
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="mt-3 w-fit px-8 py-3 rounded-xl bg-black text-white text-xs tracking-widest hover:bg-gray-900 transition shadow-md"
            >
              EXPLORE CAREERS
            </motion.button>
          </div>
        </motion.div>

        {/* ================= CONTACT FORM & INFO ================= */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
          >
            <h3 className="text-lg font-semibold mb-6 tracking-wide">
              Send Us a Message
            </h3>

            <form className="space-y-4">
              <Input placeholder="Your Name" />
              <Input type="email" placeholder="Email Address" />
              <textarea
                rows="5"
                placeholder="Your Message"
                className="w-full text-sm border border-gray-300 px-4 py-3 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-black/20 resize-none"
              />

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-4 py-3 rounded-xl bg-black text-white text-sm tracking-widest hover:bg-gray-900 transition shadow-md"
              >
                SEND MESSAGE
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 justify-center"
          >
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h4 className="text-sm font-semibold tracking-widest mb-2">
                CUSTOMER SUPPORT
              </h4>
              <p className="text-gray-600 text-sm">support@eleve.com</p>
              <p className="text-gray-600 text-sm mt-1">
                +91 98765 43210
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h4 className="text-sm font-semibold tracking-widest mb-2">
                BUSINESS HOURS
              </h4>
              <p className="text-gray-600 text-sm">
                Mon – Sat : 10:00 AM – 7:00 PM
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}
      <NewsLetterBox />
    </div>
  );
};

/* ================= REUSABLE INPUT ================= */
const Input = ({ type = "text", placeholder }) => (
  <motion.input
    whileFocus={{ scale: 1.01 }}
    type={type}
    placeholder={placeholder}
    className="w-full text-sm border border-gray-300 px-4 py-3 rounded-xl
               focus:outline-none focus:ring-2 focus:ring-black/20"
    required
  />
);

export default Contact;
