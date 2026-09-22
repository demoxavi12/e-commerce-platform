import React from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import assets from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 bottom-0 w-full mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div>
            
            <Link to={'/'}><img src={assets.logo} className='w-36' alt="logo" draggable={false}/></Link>
            <p className="text-sm leading-relaxed mt-5">
              Premium clothing crafted with care, comfort, and timeless style.
              Designed for everyday elegance.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>Men</li>
              <li>Women</li>
              <li>New Arrivals</li>
              <li>Best Sellers</li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Customer Care</h4>
            <ul className="space-y-2 text-sm">
              <li>Contact Us</li>
              <li>FAQs</li>
              <li>Shipping & Delivery</li>
              <li>Returns & Exchanges</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
              <li>Refund Policy</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} E L E V É. All rights reserved.
          </p>

          {/* Social Media */}
          <div className="flex items-center gap-5">
            <a href="https://www.facebook.com/omm.prasaad"><Facebook className="w-5 h-5 hover:text-gray-800 cursor-pointer" /></a>
            <a href="https://www.instagram.com/0mprasadmaharana/?hl=en"><Instagram className="w-5 h-5 hover:text-gray-800 cursor-pointer" /></a>
            <a href="https://x.com/home"><Twitter className="w-5 h-5 hover:text-gray-800 cursor-pointer" /></a>
            <a href="https://www.youtube.com/@Turning_wheel6608"><Youtube className="w-5 h-5 hover:text-gray-800 cursor-pointer" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;