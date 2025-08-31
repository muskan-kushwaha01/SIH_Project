import React, { useEffect, useState } from "react";
import ReactSpeedometer from "react-d3-speedometer";

const PigRiskResultPage = () => {
  const [result, setResult] = useState(null);
  const [speedometerWidth, setSpeedometerWidth] = useState(300);

  useEffect(() => {
    const storedResult = localStorage.getItem("riskResult");
    if (storedResult) {
      try {
        setResult(JSON.parse(storedResult));
      } catch (err) {
        console.error("Failed to parse riskResult:", err);
      }}
 

    // Make speedometer responsive
    const updateWidth = () => {
      if (window.innerWidth < 500) setSpeedometerWidth(250);
      else if (window.innerWidth < 768) setSpeedometerWidth(300);
      else setSpeedometerWidth(400);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  if (!result) {
    return (
      <p className="text-center mt-10 text-lg">Loading risk analysis...</p>
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
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center animate-bounceOnce">
        Pig Farm Risk Analysis Result
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
            height={speedometerWidth * 0.6} // proportional height
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
      </div>
    </div>
  );
};

export default PigRiskResultPage;
