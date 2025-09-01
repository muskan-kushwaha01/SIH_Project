import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactSpeedometer from "react-d3-speedometer";

const PoultryResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { risk_level } = location.state || { risk_level: "Unknown" };

  const getColor = (level) => {
    if (level === "Low") return "green";
    if (level === "Medium") return "orange";
    if (level === "High") return "red";
    return "gray";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h2 className="text-3xl font-bold mb-6">Poultry Farm Risk Result</h2>
      <ReactSpeedometer
        maxValue={3}
        value={risk_level === "Low" ? 1 : risk_level === "Medium" ? 2 : 3}
        segments={3}
        segmentColors={["green", "orange", "red"]}
        needleColor="black"
        startColor="green"
        endColor="red"
        currentValueText={`Risk Level: ${risk_level}`}
      />
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-md"
      >
        Go Back
      </button>
    </div>
  );
};

export default PoultryResultPage;
