import React, { useState, useEffect } from "react";
import logo from "../assets/images/logo.jpg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  // Scroll hide/show
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false); // scrolling down → hide
      } else {
        setShowNavbar(true); // scrolling up → show
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full bg-white shadow-md px-6 py-4 flex justify-between items-center transition-transform duration-300 z-50
        ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
    >
      {/* Logo + Text */}
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 shadow-md">
          <img src={logo} alt="Logo" className="w-full h-full object-cover scale-200 object-top" />
        </div>
        <h1 className="text-xl md:text-2xl font-bold">BioRaksha</h1>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-6">
        <a href="#features" className="hover:text-blue-500">Features</a>
        <a href="#about" className="hover:text-blue-500">About</a>
        <a href="#contact" className="hover:text-blue-500">Contact</a>
      </div>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden text-2xl focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✖" : "☰"}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 w-full bg-white shadow-md flex flex-col items-center py-4 space-y-4 md:hidden">
          <a href="#features" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>Features</a>
          <a href="#about" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>About</a>
          <a href="#contact" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>Contact</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
