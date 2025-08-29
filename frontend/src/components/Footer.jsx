import React, { useState } from "react";
import { Link } from "react-router-dom";  
import logo from "../assets/images/logo.jpg";


const Footer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false); // close menu after clicking
  };

  return (
    <footer className="bg-gray-900 text-white py-8 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
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

          {/* Mobile Toggle */}
          <button 
            className="md:hidden px-3 py-2 border rounded-lg text-sm hover:bg-gray-800"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "Close Menu" : "Open Menu"}
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`mt-6 flex flex-col md:flex-row justify-center md:space-x-6 space-y-4 md:space-y-0 
          ${isOpen ? "flex" : "hidden"} md:flex`}
        >
          <button onClick={() => handleScrollToSection("risk-analysis")} className="hover:text-blue-500">Risk Analysis</button>
          <button onClick={() => handleScrollToSection("vaccination")} className="hover:text-blue-500">Vaccination</button>
          <button onClick={() => handleScrollToSection("training")} className="hover:text-blue-500">Training</button>
          <button onClick={() => handleScrollToSection("guidelines")} className="hover:text-blue-500">Guidelines</button>
         
    <Link to="/contact" className="hover:text-blue-500">Contact</Link> </div>

        {/* Bottom Text */}
        <div className="mt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} BioRaksha. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
