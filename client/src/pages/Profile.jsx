import React from "react";
import { motion } from "framer-motion";
import Tittle from "../components/Tittle";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Profile = () => {
  return (
    <div className="border-t border-gray-300 px-4 sm:px-8 py-10">
      
      {/* ================= HEADER ================= */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <Tittle text1="MY" text2="PROFILE" />
        <p className="text-gray-500 text-sm mt-3">
          Manage your personal information & orders
        </p>
      </motion.div>

      {/* ================= PROFILE LAYOUT ================= */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-24">

        {/* ================= LEFT SIDEBAR ================= */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center"
        >
          <img
            src="https://i.pravatar.cc/150"
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover mb-4"
          />

          <h3 className="text-lg font-semibold tracking-wide">
            John Doe
          </h3>
          <p className="text-sm text-gray-500">
            johndoe@email.com
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer mt-6 w-full py-3 rounded-xl bg-black text-white text-sm tracking-widest hover:bg-gray-900 transition shadow-md"
          >
            EDIT PROFILE
          </motion.button>


          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
             className="cursor-pointer mt-6 w-full py-3 rounded-xl text-sm bg-red-500  text-white hover:underline">
            LOGOUT
          </motion.button>
        </motion.div>

        {/* ================= RIGHT CONTENT ================= */}
        <div className="md:col-span-2 flex flex-col gap-10">

          {/* ================= ACCOUNT DETAILS ================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h4 className="text-sm font-semibold tracking-widest mb-6">
              ACCOUNT DETAILS
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <Info label="Full Name" value="John Doe" />
              <Info label="Email" value="johndoe@email.com" />
              <Info label="Phone" value="+91 98765 43210" />
              <Info label="Member Since" value="March 2024" />
            </div>
          </motion.div>

          {/* ================= ORDER SUMMARY ================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            <StatCard title="TOTAL ORDERS" value="12" />
            <StatCard title="PENDING" value="2" />
            <StatCard title="DELIVERED" value="10" />
          </motion.div>

          {/* ================= ADDRESS ================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h4 className="text-sm font-semibold tracking-widest mb-4">
              DEFAULT ADDRESS
            </h4>

            <p className="text-sm text-gray-600 leading-relaxed">
              54709 Willms Station <br />
              Suite 350 <br />
              Washington, USA
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer mt-6 px-6 py-3 rounded-xl bg-black text-white text-sm tracking-widest hover:bg-gray-900 transition shadow-md"
            >
              MANAGE ADDRESSES
            </motion.button>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

/* ================= SMALL COMPONENTS ================= */

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs tracking-widest text-gray-400 mb-1">
      {label}
    </p>
    <p className="text-gray-700 font-medium">
      {value}
    </p>
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
    <p className="text-xs tracking-widest text-gray-400 mb-2">
      {title}
    </p>
    <h3 className="text-2xl font-semibold">
      {value}
    </h3>
  </div>
);

export default Profile;
