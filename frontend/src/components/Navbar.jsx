import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ import router helpers
import logo from "../assets/images/logo.jpg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const navigate = useNavigate();

  // Scroll hide/show effect
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll for homepage sections
  const handleScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

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
      <div className="hidden md:flex items-center space-x-6">
  {[
    { label: "Risk Analysis", id: "risk-analysis" },
    { label: "Vaccination", id: "vaccination" },
    { label: "Training", id: "Training" },
    { label: "Guidelines", id: "guidelines" },
  ].map((item) => (
    <button
      key={item.id}
      onClick={() => handleScrollToSection(item.id)}
      className="relative group px-2 py-1"
    >
      <span className="transition-colors duration-300 group-hover:text-blue-600">
        {item.label}
      </span>
      <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
    </button>
  ))}

  <Link
    to="/contact"
    className="relative group px-2 py-1"
  >
    <span className="transition-colors duration-300 group-hover:text-blue-600">
      Contact
    </span>
    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
  </Link>

  <button style={{ cursor: "pointer" }}
    onClick={() => navigate("/signin")}
    className="ml-4 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg 
               relative overflow-hidden transition-all duration-300
               hover:text-white hover:border-blue-600
               before:absolute before:top-0 before:left-0 before:w-0 before:h-full before:bg-blue-600 before:transition-all before:duration-300 hover:before:w-full"
  >
    <span className="relative z-10">Sign In</span>
  </button>
</div>


<div className="flex items-center space-x-4 md:hidden">
  <button style={{ cursor: "pointer" }}
    onClick={() => navigate("/signin")}
    className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg 
               relative overflow-hidden transition-all duration-300
               hover:text-white hover:border-blue-600
               before:absolute before:top-0 before:left-0 before:w-0 before:h-full before:bg-blue-600 before:transition-all before:duration-300 hover:before:w-full"
  >
    <span className="relative z-10">Sign In</span>
  </button>

  {/* Hamburger */}
  <button
    className="text-2xl focus:outline-none"
    onClick={() => setIsOpen(!isOpen)}
  >
    {isOpen ? "✖" : "☰"}
  </button>
</div>

      {/* Mobile Menu */}
      {isOpen && (
  <div className="absolute top-full right-0 w-full bg-white shadow-md flex flex-col items-center py-4 space-y-4 md:hidden">
    <button onClick={() => handleScrollToSection("risk-analysis")} className="hover:text-blue-500">Risk Analysis</button>
    <button onClick={() => handleScrollToSection("vaccination")} className="hover:text-blue-500">Vaccination</button>
    <button onClick={() => handleScrollToSection("Training")} className="hover:text-blue-500">Training</button>
    <button onClick={() => handleScrollToSection("guidelines")} className="hover:text-blue-500">Guidelines</button>

    {/* ✅ Contact */}
    <Link to="/contact" className="hover:text-blue-500">Contact</Link>
  </div>
)}
    </nav>
  );
};

export default Navbar;
