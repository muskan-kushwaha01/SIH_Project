import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo2.jpg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ track login status
  const navigate = useNavigate();

  // ✅ Check login state from localStorage
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("authToken");
      console.log("Navbar: Token check", !!token); // Debug log
      setIsLoggedIn(!!token);
    };
  
    // Check immediately
    checkLoginStatus();
  
    // Listen for storage changes and focus events
    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("focus", checkLoginStatus);
  
    // Also listen for custom events (in case you want to trigger manually)
    window.addEventListener("authStateChanged", checkLoginStatus);
  
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("focus", checkLoginStatus);
      window.removeEventListener("authStateChanged", checkLoginStatus);
    };
  }, []);
  
  // ✅ Handle Guidelines click with authentication check
  const handleGuidelinesClick = (e) => {
    if (!isLoggedIn) {
      navigate("/signin");
    } else {
      navigate("/guidelines");
    }
    setIsOpen(false); // Close mobile menu if open
  };

  // ✅ Handler for Vaccination click
const handleVaccinationClick = () => {
  if (!isLoggedIn) {
    alert("Please sign in to view vaccination details");
    navigate("/signin");
  } else {
    navigate("/vaccination");
  }
  setIsOpen(false); // Close mobile menu if open
};

// ✅ Handler for Training click
const handleTrainingClick = () => {
  if (!isLoggedIn) {
    alert("Please sign in to view training details");
    navigate("/signin");
  } else {
    navigate("/training");
  }
  setIsOpen(false); // Close mobile menu if open
};

  const handleLogout = () => {
    // Only clear auth data - results stay in database
    localStorage.removeItem("authToken");
    localStorage.removeItem("farmType");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    
    // Clear localStorage flags (will be rebuilt from database on next login)
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (key.startsWith('riskSubmitted_') || key.startsWith('riskResult_')) {
        localStorage.removeItem(key);
      }
    });
    
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("storage"));
    
    console.log("✅ User logged out - results preserved in database");
    navigate("/");
  };

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

  // Smooth scroll to section (works across routes)
  const handleScrollToSection = (sectionId) => {
    if (window.location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full bg-white shadow-md px-6 py-4 flex justify-between items-center transition-transform duration-300 z-50
        ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
    >
      {/* Logo + Text */}
      <div
        className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="w-12 sm:w-16 md:w-20 h-10 sm:h-12 flex items-center">
          <img src={logo} alt="Logo" className="h-full object-contain" />
        </div>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
          <span className="text-green-600">Bio</span>
          <span className="text-blue-900">Raksha</span>
        </h1>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center space-x-6">
        <button
        style={{ cursor: "pointer" }}
          onClick={() => handleScrollToSection("risk-analysis")}
          className="relative group px-2 py-1"
        >
          <span className="transition-colors duration-300 group-hover:text-blue-600">
            Risk Analysis
          </span>
          <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
        </button>

        <button
  onClick={handleVaccinationClick}
  className="relative group px-2 py-1"
>
  <span className="transition-colors duration-300 group-hover:text-blue-600">
    Vaccination
  </span>
  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
</button>

<button
  onClick={handleTrainingClick}
  className="relative group px-2 py-1"
>
  <span className="transition-colors duration-300 group-hover:text-blue-600">
    Interactive Training
  </span>
  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
</button>


        {/* ✅ Guidelines with authentication check */}
        <button
          onClick={handleGuidelinesClick}
          className="relative group px-2 py-1"
        >
          <span className="transition-colors duration-300 group-hover:text-blue-600">
            Schemes
          </span>
          <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
        </button>

        <Link to="/contact" className="relative group px-2 py-1">
          <span className="transition-colors duration-300 group-hover:text-blue-600">
            Contact
          </span>
          <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
        </Link>

        {/* ✅ Show Sign In if not logged in */}
        {!isLoggedIn ? (
          <button
          style={{ cursor: "pointer" }}
            onClick={() => navigate("/signin")}
            className="ml-4 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg 
                     relative overflow-hidden transition-all duration-300
                     hover:text-white hover:border-blue-600
                     before:absolute before:top-0 before:left-0 before:w-0 before:h-full before:bg-blue-600 before:transition-all before:duration-300 hover:before:w-full"
          >
            <span className="relative z-10">Sign In</span>
          </button>
        ) : (
          <button
          style={{ cursor: "pointer" }}
            onClick={handleLogout}
            className="ml-4 px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg 
                     relative overflow-hidden transition-all duration-300
                     hover:text-white hover:border-red-600
                     before:absolute before:top-0 before:left-0 before:w-0 before:h-full before:bg-red-600 before:transition-all before:duration-300 hover:before:w-full"
          >
            <span className="relative z-10">Logout</span>
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="flex items-center space-x-4 md:hidden">
        {!isLoggedIn ? (
          <button
          style={{ cursor: "pointer" }}
            onClick={() => navigate("/signin")}
            className="ml-4 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg 
                     relative overflow-hidden transition-all duration-300
                     hover:text-white hover:border-blue-600
                     active:text-white active:bg-blue-600
                     focus:text-white focus:bg-blue-600
                     before:absolute before:top-0 before:left-0 before:w-0 before:h-full 
                     before:bg-blue-600 before:transition-all before:duration-300 
                     hover:before:w-full"
          >
            <span className="relative z-10">Sign In</span>
          </button>
        ) : (
          <button
          style={{ cursor: "pointer" }}
            onClick={handleLogout}
            className="ml-4 px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg 
                     relative overflow-hidden transition-all duration-300
                     hover:text-white hover:border-red-600
                     active:text-white active:bg-red-600
                     focus:text-white focus:bg-red-600
                     before:absolute before:top-0 before:left-0 before:w-0 before:h-full 
                     before:bg-red-600 before:transition-all before:duration-300 
                     hover:before:w-full"
          >
            <span className="relative z-10">Logout</span>
          </button>
        )}

        {/* Hamburger */}
        <button
        style={{ cursor: "pointer" }}
          className="text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full right-0 w-full bg-white shadow-md flex flex-col items-center py-4 space-y-4 md:hidden">
          <button
            onClick={() => handleScrollToSection("risk-analysis")}
            className="hover:text-blue-500"
          >
            Risk Analysis
          </button>
          <button onClick={handleVaccinationClick} className="hover:text-blue-500">
  Vaccination
</button>

<button onClick={handleTrainingClick} className="hover:text-blue-500">
  Interactive Training
</button>

          {/* ✅ Guidelines with authentication check for mobile */}
          <button
            onClick={handleGuidelinesClick}
            className="hover:text-blue-500"
          >
            Schemes
          </button>
          <Link to="/contact" className="hover:text-blue-500">
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;