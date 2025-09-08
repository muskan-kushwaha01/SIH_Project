// LandingPage.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import bgImage from "../assets/images/bg1.jpg";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import img1 from "../assets/images/hen.jpg";
import img2 from "../assets/images/pig2.jpg";
import img3 from "../assets/images/hen3.jpg";

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [riskDone, setRiskDone] = useState(false);
  const [farmType, setFarmType] = useState(null);
  const [loading, setLoading] = useState(true);

  // Scroll handler (when redirected with scrollTo param)
  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        setIsLoggedIn(true);

        try {
          const response = await fetch("http://127.0.0.1:8000/auth/me", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) {
            throw new Error("Auth failed");
          }

          const data = await response.json();
          console.log("Auth data from backend:", data);
          
          // Store farmType
          if (data?.farmType) {
            setFarmType(data.farmType);
            localStorage.setItem("farmType", data.farmType);
          }

          // Store userId 
          const userId = data?.phone;
          if (userId) {
            localStorage.setItem("userId", userId);
          }

          // Check if user has result in database
          if (data?.hasRiskResult) {
            setRiskDone(true);
            // Also store in localStorage for faster offline check
            localStorage.setItem(`riskSubmitted_${userId}`, "true");
            console.log(`User ${userId} has existing risk analysis`);
          } else {
            setRiskDone(false);
            // Clear localStorage flag if no result in database
            localStorage.removeItem(`riskSubmitted_${userId}`);
            console.log(`User ${userId} needs to complete risk analysis`);
          }

        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem("authToken");
          localStorage.removeItem("farmType");
          localStorage.removeItem("userId");
          setIsLoggedIn(false);
          setRiskDone(false);
          setFarmType(null);
        }
      } else {
        setIsLoggedIn(false);
        setRiskDone(false);
        setFarmType(null);
      }
    };

    checkAuth();

    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, []);
  
  // React to login/logout in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");

      if (!token) {
        setIsLoggedIn(false);
        setRiskDone(false);
        setFarmType(null);
        localStorage.removeItem("farmType");
        localStorage.removeItem("userId");
      } else if (userId) {
        const done = localStorage.getItem(`riskSubmitted_${userId}`) === "true";
        setRiskDone(done);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Simplified Risk button logic - just navigate to dynamic route
  // Replace the handleRiskClick function in your LandingPage.jsx with this:

const handleRiskClick = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("Please sign in to access Risk Analysis!");
    navigate("/signin");
    return;
  }

  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("User session error. Please sign in again.");
    navigate("/signin");
    return;
  }

  // Check if user has completed risk analysis
  const hasResult = localStorage.getItem(`riskSubmitted_${userId}`) === "true";
  
  if (hasResult || riskDone) { // Use either localStorage or backend flag
    // Navigate to correct results page based on farm type
    if (farmType && farmType.toLowerCase().includes('poultry')) {
      navigate("/poultry-result"); // Navigate to poultry results
    } else {
      navigate("/risk-result"); // Navigate to pig results  
    }
  } else {
    // Navigate to dynamic risk analysis (will show appropriate form)
    navigate("/risk-analysis");
  }
};
  // Loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section
        className="w-full min-h-screen bg-cover bg-center flex flex-col"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <Navbar />

        <div className="flex flex-col justify-center items-center text-center px-4 py-20 md:py-32 mt-[120px]">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-4 pb-5 opacity-0 animate-fadeIn">
            Empowering Farmers with Technology
          </h1>


  <p className="text-lg sm:text-xl md:text-2xl text-white max-w-2xl mb-8 pb-4 opacity-0 animate-slideUp animation-delay-300 bg-black/40 px-4 py-2 rounded-lg">
  A Smart Platform to help farmers improve biosecurity, productivity, and profitability.
  </p>

          {!isLoggedIn && (
            <div
              className="flex flex-col sm:flex-row gap-4 sm:space-x-6 opacity-0 animate-popIn"
              style={{ animationDelay: "0.6s" }}
            >
              <button
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/signup")}
                className="px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-md hover:bg-blue-700 transition transform hover:scale-105"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Risk Analysis Section */}
      <section id="risk-analysis" className="bg-gray-50 py-16 px-6 lg:px-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left side */}
          <motion.div
            className="flex-1 flex flex-col justify-center space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
              Risk Analysis for Your Farm
            </h2>
            <p className="text-gray-600 text-base sm:text-lg lg:text-xl">
              Identify potential risks on your farm and get actionable insights
              to improve productivity and reduce losses. Tailored solutions for
              your farm type.
            </p>

            <motion.button
              style={{ cursor: "pointer" }}
              onClick={handleRiskClick}
              className="w-full sm:w-48 lg:w-56 bg-blue-600 text-white py-3 rounded-xl shadow-md hover:bg-blue-700 transition transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {riskDone ? "Check Your Result" : "Do Risk Analysis"}
            </motion.button>
          </motion.div>

          {/* Right side - Image collage */}
          <div className="flex-1 relative w-full">
            {/* Mobile/Tablet View */}
            <div className="flex justify-center gap-2 relative lg:hidden">
              {[img1, img2, img3].map((img, i) => (
                <motion.img
                  key={i}
                  src={img}
                  alt={`Risk ${i + 1}`}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-xl shadow-lg object-cover"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, zIndex: 50 }}
                />
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block relative h-[28rem]">
              {[img1, img2, img3].map((img, i) => (
                <motion.img
                  key={i}
                  src={img}
                  alt={`Risk ${i + 1}`}
                  className={`absolute w-60 h-52 rounded-xl shadow-lg object-cover 
                       ${i === 0 ? "top-0 left-15 rotate-[-6deg]" : ""}
                       ${i === 1 ? "top-36 left-50 rotate-[6deg]" : ""}
                       ${i === 2 ? "top-72 left-25 rotate-[-3deg]" : ""}`}
                  initial={{ opacity: 0, x: 80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, zIndex: 50 }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;