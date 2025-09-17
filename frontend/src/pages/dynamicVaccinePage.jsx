// DynamicGuidelines.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../config";
import robotImage from "../assets/images/robot.png";
import BioBuddyChatbot from "../components/Chatbot"; 
import Vaccination from "./pigVaccination";
import PoultryVaccinationDashboard from "./poultryVaccination";

const DynamicVaccination = () => {
  const [farmType, setFarmType] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkFarmType = async () => {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        // User not logged in, redirect to sign in
        navigate("/signin");
        return;
      }

      // First check localStorage
      let userFarmType = localStorage.getItem("farmType");
      
      if (!userFarmType) {
        // If not in localStorage, fetch from backend
        try {
          const response = await fetch(`${API_BASE}/auth/me`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) {
            throw new Error("Auth failed");
          }

          const data = await response.json();
          userFarmType = data?.farmType;
          
          if (userFarmType) {
            localStorage.setItem("farmType", userFarmType);
          } else {
            console.error("No farm type found in user profile");
            navigate("/signin");
            return;
          }
        } catch (error) {
          console.error("Error fetching farm type:", error);
          navigate("/signin");
          return;
        }
      }

      setFarmType(userFarmType);
      setLoading(false);
    };

    checkFarmType();
  }, [navigate]);

  // Show loading while determining farm type
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Vaccination...</p>
        </div>
      </div>
    );
  }

  // Render appropriate policy component based on farm type
  const renderGuidelines = () => {
    if (!farmType) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Farm Type Not Found</h2>
            <p className="text-gray-600 mb-6">Please sign in again to access Vaccination.</p>
            <button
              onClick={() => navigate("/signin")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          </div>
        </div>
      );
    }

    // Normalize farm type for comparison
    const normalizedType = farmType.toLowerCase().replace(/\s+/g, '');
    
    if (normalizedType.includes("pig")) {
      return <Vaccination />;
    } else if (normalizedType.includes("poultry")) {
      return <PoultryVaccinationDashboard />;
    } else {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Unknown Farm Type</h2>
            <p className="text-gray-600 mb-6">Farm type "{farmType}" is not supported yet.</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Go Home
            </button>
          </div>
          <BioBuddyChatbot 
        robotImage={robotImage} // Uncomment when you have the robot image
      />
        </div>
      );
    }
  };

  return renderGuidelines();
};

export default DynamicVaccination;