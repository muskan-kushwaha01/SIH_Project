import React, { useEffect, useState } from "react";
import ReactSpeedometer from "react-d3-speedometer";
import { useNavigate } from "react-router-dom";

const PigRiskResultPage = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [speedometerWidth, setSpeedometerWidth] = useState(300);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResult = async () => {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        alert("Please sign in to view your results");
        navigate("/signin");
        return;
      }

      try {
        // Fetch result from your existing database API
        const response = await fetch("http://127.0.0.1:8000/risk/result", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const error = await response.json();
          console.error("API Error:", error);
          
          if (response.status === 404) {
            alert("No risk analysis found. Please complete the risk analysis first.");
          } else {
            alert("Error loading your results. Please try again.");
          }
          navigate("/");
          return;
        }

        const data = await response.json();
        setResult(data.prediction); // Use 'prediction' field from your backend
        console.log("Loaded result from database:", data.prediction);

      } catch (error) {
        console.error("Fetch Error:", error);
        alert("Failed to load your results. Please try again.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();

    // Make speedometer responsive
    const updateWidth = () => {
      if (window.innerWidth < 500) setSpeedometerWidth(250);
      else if (window.innerWidth < 768) setSpeedometerWidth(300);
      else setSpeedometerWidth(400);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading your risk analysis...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">No results found</p>
          <button
          style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const riskValueMap = { Low: 25, Medium: 50, High: 75 };
  const riskColorMap = {
    Low: "#4ade80",
    Medium: "#facc15",
    High: "#f87171"
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
        Your Pig Farm Risk Analysis Result
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 w-full max-w-xl">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4 text-center">
          Risk Level: {result.risk_level}
        </h2>

        <div className="flex justify-center mb-6 w-full">
          <ReactSpeedometer
            maxValue={100}
            minValue={0}
            value={riskValueMap[result.risk_level]}
            needleColor="#1f2937"
            startColor={riskColorMap[result.risk_level]}
            endColor={riskColorMap[result.risk_level]}
            segments={3}
            textColor="#111827"
            height={speedometerWidth * 0.6}
            width={speedometerWidth}
          />
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Confidence:</h3>
          <ul className="list-disc list-inside text-gray-600">
            <li>Low: {(result.confidence.Low * 100).toFixed(2)}%</li>
            <li>Medium: {(result.confidence.Medium * 100).toFixed(2)}%</li>
            <li>High: {(result.confidence.High * 100).toFixed(2)}%</li>
          </ul>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold text-gray-700 mb-2">Recommendation:</h3>
          <p className="text-gray-600">{result.recommendation}</p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PigRiskResultPage;