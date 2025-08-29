import React from "react";
import Navbar from "../components/Navbar"
import bgImage from "../assets/images/land-bg.jpg";

const LandingPage = () => {
  return (
    <div
      className="h-screen w-full bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Navbar />

      <div className="flex flex-1 flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
          Empowering Farmers with Technology
        </h1>
        <p className="mt-4 text-lg md:text-xl text-white max-w-2xl">
          A smart platform to simplify farming, health, and productivity.
        </p>

        <div className="mt-8 flex space-x-6">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-md hover:bg-blue-700">
            Sign Up
          </button>
          <button className="px-6 py-3 bg-white text-blue-600 rounded-2xl shadow-md hover:bg-gray-200">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
