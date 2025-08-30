// LandingPage.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import bgImage from "../assets/images/bg-img1.jpg";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import img1 from "../assets/images/hen.jpg";
import img2 from "../assets/images/pig2.jpg";
import img3 from "../assets/images/hen3.jpg";

const LandingPage = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleRiskClick = () => {
    navigate("/risk-form");
  };

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
          {/* Heading */}
          <h1
            className="text-3xl sm:text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-4 pb-5 
                       opacity-0 animate-fadeIn"
          >
            Empowering Farmers with Technology
          </h1>

          {/* Paragraph */}
          <p
            className="text-base sm:text-lg md:text-xl text-white max-w-2xl mb-8 pb-4 
                      opacity-0 animate-slideUp animation-delay-300"
          >
            A smart platform to simplify farming, health, and productivity.
          </p>

          {/* Show button only if NOT logged in */}
          {!isLoggedIn && (
            <div
              className="flex flex-col sm:flex-row gap-4 sm:space-x-6 opacity-0 animate-popIn"
              style={{ animationDelay: "0.6s" }}
            >
              <button
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/signup")}
                className="px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-md 
                           hover:bg-blue-700 transition transform hover:scale-105"
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
      viewport={{ once: true }}   // ✅ Runs only first time in view
    >
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
        Risk Analysis for Your Farm
      </h2>
      <p className="text-gray-600 text-base sm:text-lg lg:text-xl">
        Identify potential risks on your farm and get actionable insights 
        to improve productivity and reduce losses. Tailored solutions for 
        your farm type.
      </p>
      <motion.button style={{ cursor: "pointer" }}
        onClick={handleRiskClick}
        className="w-full sm:w-48 lg:w-56 bg-blue-600 text-white py-3 rounded-xl shadow-md hover:bg-blue-700 transition transform hover:scale-105"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Do Risk Analysis
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
