import React from "react";
import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import logo from "../assets/images/logo.jpg";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        
        {/* Logo & Name */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
            <img 
              src={logo} 
              alt="Logo" 
              className="w-full h-full object-cover scale-200 object-top"
            />
          </div>
          <h1 className="text-xl font-bold">BioRaksha</h1>
        </div>

        {/* Navigation Links */}
        <div className="flex justify-center space-x-6">
          <a href="#features" className="hover:text-blue-400 transition">Features</a>
          <a href="#about" className="hover:text-blue-400 transition">About</a>
          <a href="#contact" className="hover:text-blue-400 transition">Contact</a>
        </div>

        {/* Social Links */}
        <div className="flex justify-center md:justify-end space-x-4 text-2xl">
          <a href="#" className="hover:text-blue-500 transition"><FaFacebookF /></a>
          <a href="#" className="hover:text-blue-500 transition"><FaLinkedinIn /></a>
          <a href="#" className="hover:text-pink-500 transition"><FaInstagram /></a>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} BioRaksha. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
