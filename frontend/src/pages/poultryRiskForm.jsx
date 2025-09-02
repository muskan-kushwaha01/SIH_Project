import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const FarmBirdForm = () => {
  const navigate = useNavigate();
 const [currentStep, setCurrentStep] = useState(1);
 const [farmDetails, setFarmDetails] = useState({
 farmSize: '',
 totalBirds: '',
 nearbyFarms: '',
 waterBodies: '',
 properFencing: '',
 cleanDirtyZones: '',
 visitorsPerDay: '',
 visitorsPerMonth: '',
 visitorsPerYear: '',
 newFlocksWithoutQuarantine: ''
 });

 const [batches, setBatches] = useState([]);

 const steps = [
 { id: 1, title: 'Farm Details', status: currentStep >= 1 ? 'completed' : 'pending' },
 { id: 2, title: 'Birds Details', status: currentStep >= 2 ? 'completed' : 'pending' }
 ];

 const birdVaccinations = {
 Broilers: [
 "Marek's disease",
 "Newcastle disease (ND) + Infectious Bronchitis (IB)",
 "Gumboro disease (Infectious Bursal Disease – IBD)",
 "Newcastle booster + IBD booster"
 ],
 Layers: [
 "Marek's disease + Infectious Bronchitis (IB)",
 "Newcastle disease (ND)",
 "Gumboro disease (Infectious Bursal Disease – IBD)",
 "ND booster + IB booster",
 "Fowl Pox",
 "Avian Encephalomyelitis (AE)"
 ],
 Duck: [
 "Duck Viral Hepatitis (DVH)",
 "Duck Plague (DP)",
 "Riemerella anatipestifer (RA) vaccination",
 "Duck Plague booster (for layers)"
 ]
 };

 const handleFarmDetailChange = (field, value) => {
 setFarmDetails(prev => ({ ...prev, [field]: value }));
 };

 const addBatch = () => {
 const newBatch = {
 id: Date.now(),
 birdType: '',
 chickenType: '',
 count: '',
 age: '',
 ageUnit: 'days',
 diseaseAffected: '',
 vaccinations: []
 };
 setBatches([...batches, newBatch]);
 };

 const removeBatch = (batchId) => {
 setBatches(batches.filter(batch => batch.id !== batchId));
 };

 const updateBatch = (batchId, field, value) => {
 setBatches(batches.map(batch =>
 batch.id === batchId ? { ...batch, [field]: value } : batch
 ));
 };

 const toggleVaccination = (batchId, vaccination) => {
 setBatches(batches.map(batch => {
 if (batch.id === batchId) {
 const currentVaccinations = batch.vaccinations || [];
 const isSelected = currentVaccinations.includes(vaccination);
 return {
 ...batch,
 vaccinations: isSelected
 ? currentVaccinations.filter(v => v !== vaccination)
 : [...currentVaccinations, vaccination]
 };
 }
 return batch;
 }));
 };
const handleSubmit = async () => {
  // --- Farm-level validations ---
  if (Number(farmDetails.farmSize) < 1) {
    alert("Farm size must be at least 1 acre.");
    return;
  }
  if (Number(farmDetails.totalBirds) < 1) {
    alert("Total birds must be at least 1.");
    return;
  }
  if (Number(farmDetails.visitorsPerDay) < 1) {
    alert("Visitors per day must be at least 1.");
    return;
  }

  // --- Batch-level validations ---
  if (batches.length === 0) {
    alert("Please add at least one batch before submitting.");
    return;
  }

  for (let batch of batches) {
    if (Number(batch.count) < 1) {
      alert("Batch count must be at least 1.");
      return;
    }
    if (Number(batch.age) < 1) {
      alert("Batch age must be at least 1.");
      return;
    }
  }

  const batch = batches[0]; // use first batch for prediction
  let ageInWeeks = 0;
  switch (batch.ageUnit) {
    case "days": ageInWeeks = Number(batch.age) / 7; break;
    case "months": ageInWeeks = Number(batch.age) * 4; break;
    case "years": ageInWeeks = Number(batch.age) * 52; break;
    default: ageInWeeks = Number(batch.age);
  }

  // Vaccines: compute individual flags and missing count
  const vaccineList = ['Mareks','Newcastle_ND','ND_IB','Gumboro_IBD','ND_IBD_Booster','Fowl_Pox','AE'];
  const vaccsDone = batch.vaccinations || [];
  const vaccFlags = {};
  vaccineList.forEach(v => { vaccFlags[v] = vaccsDone.includes(v) ? 1 : 0; });
  const missingVaccsCount = vaccineList.length - vaccsDone.length;

  const dataToSend = {
    Farm_Size_Acres: Number(farmDetails.farmSize) || 0,
    Total_Birds: Number(farmDetails.totalBirds) || 0,
    Nearby_Farm_50m: farmDetails.nearbyFarms === "yes" ? 1 : 0,
    Water_Bodies_Nearby: farmDetails.waterBodies === "yes" ? 1 : 0,
    Proper_Fencing: farmDetails.properFencing === "yes" ? 1 : 0,
    Clean_Dirty_Zones: farmDetails.cleanDirtyZones === "yes" ? 1 : 0,
    Avg_Visitors_Day: Number(farmDetails.visitorsPerDay) || 0,
    Introduce_New_Flocks_Without_Quarantine: farmDetails.newFlocksWithoutQuarantine === "yes" ? 1 : 0,
    Batch_Size: Number(batch.count) || 0,
    Batch_Age_Weeks: ageInWeeks || 0,
    Previously_Infected: batch.diseaseAffected === "yes" ? 1 : 0,
    Mareks: vaccFlags['Mareks'],
    Newcastle_ND: vaccFlags['Newcastle_ND'],
    ND_IB: vaccFlags['ND_IB'],
    Gumboro_IBD: vaccFlags['Gumboro_IBD'],
    ND_IBD_Booster: vaccFlags['ND_IBD_Booster'],
    Fowl_Pox: vaccFlags['Fowl_Pox'],
    AE: vaccFlags['AE'],
    Birds_Per_Acre: Number((Number(batch.count) / (Number(farmDetails.farmSize) || 1)).toFixed(2)),
    Vacc_Coverage_Rate: Number((vaccsDone.length / vaccineList.length).toFixed(2)),
    Missing_Vaccines_Count: missingVaccsCount
  };

  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch("http://127.0.0.1:8000/predict-risk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("API Error:", err);
      alert("Failed to submit form. Check console for details.");
      return;
    }

    const result = await response.json();
    console.log("✅ Poultry Prediction Result:", result);

    // 🔥 ADD THIS: Mark as completed in localStorage for immediate UI update
    const userId = localStorage.getItem("userId");
    if (userId) {
      localStorage.setItem(`riskSubmitted_${userId}`, "true");
      console.log(`✅ Marked poultry risk as completed for user: ${userId}`);
    }

    // Force update all components
    window.dispatchEvent(new Event("storage"));

    alert("Poultry risk analysis completed successfully!");
    navigate("/"); // This will now show "Check Your Result" button

  } catch (error) {
    console.error("❌ Fetch Error:", error);
    alert("Failed to submit form. Check console for details.");
  }
};

 const canProceedToStep2 = () => {
 const required = ['farmSize', 'totalBirds', 'nearbyFarms', 'waterBodies', 'properFencing', 'cleanDirtyZones', 'visitorsPerDay', 'newFlocksWithoutQuarantine'];
 return required.every(field => farmDetails[field]);
 };

 return (
    <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-16 space-y-6 sm:space-y-0">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center w-full sm:w-auto">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2
                  ${
                    step.status === "completed" || step.id === currentStep
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-white border-gray-300 text-gray-500"
                  }`}
              >
                {step.status === "completed" && step.id < currentStep ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{step.title}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden sm:block flex-1 mx-16 h-0.5 bg-gray-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>
  
      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Farm Details
            </h2>
  
            <div className="space-y-6">
              {/* Size of farm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size of farm (in acres):
                </label>
                <input
                  type="number"
                  min="1"
                  value={farmDetails.farmSize}
                  onChange={(e) =>
                    handleFarmDetailChange("farmSize", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter farm size"
                />
              </div>
  
              {/* Total birds */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total no. of birds in your farm:
                </label>
                <input
                  type="number"
                  min="1"
                  value={farmDetails.totalBirds}
                  onChange={(e) =>
                    handleFarmDetailChange("totalBirds", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter total number of birds"
                />
              </div>
  
              {/* Nearby farms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Is there any other farm near your around (within 50m):
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="nearbyFarms"
                      value="yes"
                      checked={farmDetails.nearbyFarms === "yes"}
                      onChange={(e) =>
                        handleFarmDetailChange("nearbyFarms", e.target.value)
                      }
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="nearbyFarms"
                      value="no"
                      checked={farmDetails.nearbyFarms === "no"}
                      onChange={(e) =>
                        handleFarmDetailChange("nearbyFarms", e.target.value)
                      }
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
  
              {/* Water bodies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Are there any water bodies near your farm attracting wild birds:
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="waterBodies"
                      value="yes"
                      checked={farmDetails.waterBodies === "yes"}
                      onChange={(e) =>
                        handleFarmDetailChange("waterBodies", e.target.value)
                      }
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="waterBodies"
                      value="no"
                      checked={farmDetails.waterBodies === "no"}
                      onChange={(e) =>
                        handleFarmDetailChange("waterBodies", e.target.value)
                      }
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
  
              {/* Proper fencing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Is there proper fencing available in your farm:
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="properFencing"
                      value="yes"
                      checked={farmDetails.properFencing === "yes"}
                      onChange={(e) =>
                        handleFarmDetailChange("properFencing", e.target.value)
                      }
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="properFencing"
                      value="no"
                      checked={farmDetails.properFencing === "no"}
                      onChange={(e) =>
                        handleFarmDetailChange("properFencing", e.target.value)
                      }
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
  
              {/* Clean dirty zones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Are there separate clean and dirty zones:
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="cleanDirtyZones"
                      value="yes"
                      checked={farmDetails.cleanDirtyZones === "yes"}
                      onChange={(e) =>
                        handleFarmDetailChange("cleanDirtyZones", e.target.value)
                      }
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="cleanDirtyZones"
                      value="no"
                      checked={farmDetails.cleanDirtyZones === "no"}
                      onChange={(e) =>
                        handleFarmDetailChange("cleanDirtyZones", e.target.value)
                      }
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
  
              {/* Visitors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Average no of visitor per day:
                </label>
                <input
                  type="number"
                  min="1"
                  value={farmDetails.visitorsPerDay}
                  onChange={(e) =>
                    handleFarmDetailChange("visitorsPerDay", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter visitors per day"
                />
              </div>
  
              {/* New flocks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Do you introduce new flocks without quarantine:
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="newFlocksWithoutQuarantine"
                      value="yes"
                      checked={
                        farmDetails.newFlocksWithoutQuarantine === "yes"
                      }
                      onChange={(e) =>
                        handleFarmDetailChange(
                          "newFlocksWithoutQuarantine",
                          e.target.value
                        )
                      }
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="newFlocksWithoutQuarantine"
                      value="no"
                      checked={
                        farmDetails.newFlocksWithoutQuarantine === "no"
                      }
                      onChange={(e) =>
                        handleFarmDetailChange(
                          "newFlocksWithoutQuarantine",
                          e.target.value
                        )
                      }
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
  
            {/* Next Button */}
            <div className="flex flex-col sm:flex-row justify-end mt-8">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!canProceedToStep2()}
                className={`flex items-center justify-center px-6 py-2 rounded-md font-medium ${
                  canProceedToStep2()
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        )}

  
{currentStep === 2 && (
  <div className="w-full">
    <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center sm:text-left">
      Birds Details
    </h2>
    <h3 className="text-lg font-medium text-gray-700 mb-6 text-center sm:text-left">
      Create batches of birds based on their age
    </h3>

    <div className="space-y-6">
      {batches.map((batch) => (
        <div
          key={batch.id}
          className="border border-gray-200 rounded-lg p-6 bg-gray-50"
        >
          {/* Batch Heading */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h4 className="text-lg font-medium text-gray-900">
              Batch {batches.indexOf(batch) + 1}
            </h4>
            <button
              onClick={() => removeBatch(batch.id)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Batch Details */}
          <div className="space-y-4">
            {/* Bird Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type of bird:
              </label>
              <select
                value={batch.birdType}
                onChange={(e) =>
                  updateBatch(batch.id, "birdType", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select bird type</option>
                <option value="Chicken">Chicken</option>
                <option value="Duck">Duck</option>
              </select>
            </div>

            {/* Chicken Type */}
            {batch.birdType === "Chicken" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select chicken type:
                </label>
                <select
                  value={batch.chickenType}
                  onChange={(e) =>
                    updateBatch(batch.id, "chickenType", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select chicken type</option>
                  <option value="Broilers">Broilers</option>
                  <option value="Layers">Layers</option>
                </select>
              </div>
            )}

            {/* Number + Age + Disease + Vaccinations */}
            {((batch.birdType === "Chicken" && batch.chickenType) ||
              batch.birdType === "Duck") && (
              <>
                {/* Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {batch.birdType === "Chicken"
                      ? `No. of ${batch.chickenType.toLowerCase()} in batch:`
                      : `No. of ${batch.birdType.toLowerCase()} in batch:`}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={batch.count}
                    onChange={(e) =>
                      updateBatch(batch.id, "count", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={
                      batch.birdType === "Chicken"
                        ? `Enter number of ${batch.chickenType.toLowerCase()}`
                        : `Enter number of ${batch.birdType.toLowerCase()}`
                    }
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {batch.birdType === "Chicken"
                      ? `Age of ${batch.chickenType.toLowerCase()} in batch:`
                      : `Age of ${batch.birdType.toLowerCase()} in batch:`}
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="number"
                      min="1"
                      value={batch.age}
                      onChange={(e) =>
                        updateBatch(batch.id, "age", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter age"
                    />
                    <select
                      value={batch.ageUnit || "days"}
                      onChange={(e) =>
                        updateBatch(batch.id, "ageUnit", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="days">Days</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                </div>

                {/* Disease Affected */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {batch.birdType === "Chicken"
                      ? `Is there any ${batch.chickenType.toLowerCase()} affected with disease:`
                      : `Is there any ${batch.birdType.toLowerCase()} affected with disease:`}
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`diseaseAffected-${batch.id}`}
                        value="yes"
                        checked={batch.diseaseAffected === "yes"}
                        onChange={(e) =>
                          updateBatch(batch.id, "diseaseAffected", e.target.value)
                        }
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`diseaseAffected-${batch.id}`}
                        value="no"
                        checked={batch.diseaseAffected === "no"}
                        onChange={(e) =>
                          updateBatch(batch.id, "diseaseAffected", e.target.value)
                        }
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>

                {/* Vaccinations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Out of following, how many vaccinations are completed:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(batch.birdType === "Chicken" && batch.chickenType
                      ? birdVaccinations[batch.chickenType]
                      : birdVaccinations[batch.birdType] || []
                    ).map((vaccination) => (
                      <label
                        key={vaccination}
                        className="flex items-center text-sm text-gray-700"
                      >
                        <input
                          type="checkbox"
                          checked={(batch.vaccinations || []).includes(
                            vaccination
                          )}
                          onChange={() =>
                            toggleVaccination(batch.id, vaccination)
                          }
                          className="mr-2"
                        />
                        {vaccination}
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ))}

      {/* Add Batch Button */}
      <button
        onClick={addBatch}
        className="flex items-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors w-full justify-center"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add New Batch
      </button>
    </div>

    {/* Navigation */}
    <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4">
      <button
      style={{ cursor: "pointer" }}
        onClick={() => setCurrentStep(1)}
        className="flex items-center justify-center px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </button>
      <button
      style={{ cursor: "pointer" }}
        onClick={handleSubmit}
        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium"
      >
        Submit
      </button>
    </div>
  </div>
)}
</div></div></div>
 );
};

export default FarmBirdForm;