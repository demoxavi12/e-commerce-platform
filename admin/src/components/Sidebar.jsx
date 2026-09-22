import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import assets from "../assets/assets";

const sidebarAnim = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
};

const itemAnim = {
  hover: { scale: 1.03, x: 4 },
  tap: { scale: 0.97 },
};

const Sidebar = () => {
  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={sidebarAnim}
      transition={{ duration: 0.6 }}
      className="w-[18%] min-h-screen border-r border-gray-300 bg-white"
    >
      <div className="flex flex-col gap-3 pt-8 px-2 text-[15px]">
        <SidebarItem to="/add" icon={assets.add_icon} label="ADD ITEMS" />
        <SidebarItem to="/list" icon={assets.order_icon} label="LIST ITEMS" />
        <SidebarItem to="/orders" icon={assets.order_icon} label="ORDERS" />
      </div>
    </motion.aside>
  );
};

/* ================= SIDEBAR ITEM ================= */

const SidebarItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `
      sidebar-link
      ${isActive ? "active" : ""}
      `
    }
  >
    <motion.div
      whileHover="hover"
      whileTap="tap"
      variants={itemAnim}
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
    >
      <img src={icon} alt="" className="w-5 h-5" />
      <p className="hidden md:block tracking-wide">{label}</p>
    </motion.div>
  </NavLink>
);

export default Sidebar;
