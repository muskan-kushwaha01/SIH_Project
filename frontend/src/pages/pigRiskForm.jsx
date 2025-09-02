import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";


const PigFarmForm = () => {
    const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [farmDetails, setFarmDetails] = useState({
    farmSize: '',
    totalPigs: '',
    nearbyFarms: '',
    properFencing: '',
    cleanDirtyZones: '',
    visitorsPerDay: '',
    newPigsWithoutQuarantine: '',
    separateSpaces: ''
  });

  const [batches, setBatches] = useState([]);

  const steps = [
    { id: 1, title: 'Farm Details', status: currentStep >= 1 ? 'completed' : 'pending' },
    { id: 2, title: 'Pig Details', status: currentStep >= 2 ? 'completed' : 'pending' }
  ];

  const pigVaccinations = [
    "Parvovirus",
    "Erysipelas",
    "Mycoplasma hyopneumoniae",
    "PCV2 (Porcine Circovirus Type 2)"
  ];

  const handleFarmDetailChange = (field, value) => {
    setFarmDetails(prev => ({ ...prev, [field]: value }));
  };

  const addBatch = () => {
    const newBatch = {
      id: Date.now(),
      count: '',
      age: '',
      ageUnit: 'days',
      diseaseInfected: '',
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
    if (batches.length === 0) {
      alert("Please add at least one batch");
      return;
    }
  
    // Convert batch age to weeks
    let ageInWeeks = 0;
    if (batches[0].ageUnit === "days") ageInWeeks = parseFloat(batches[0].age) / 7;
    if (batches[0].ageUnit === "months") ageInWeeks = parseFloat(batches[0].age) * 4;
    if (batches[0].ageUnit === "years") ageInWeeks = parseFloat(batches[0].age) * 52;
    if (batches[0].ageUnit === "weeks") ageInWeeks = parseFloat(batches[0].age);
  
    // Vaccination coverage (normalized 0–1)
    const vaccCoverage = Number((batches[0].vaccinations.length / 4).toFixed(2));
  
    const dataToSend = {
      Farm_Size_Acres_Norm: parseFloat(farmDetails.farmSize) || 0,
      Total_Pigs_Norm: parseFloat(farmDetails.totalPigs) || 0,
      Nearby_Farm_50m: farmDetails.nearbyFarms === "yes" ? 1 : 0,
      Proper_Fencing: farmDetails.properFencing === "yes" ? 1 : 0,
      Clean_Dirty_Zones: farmDetails.cleanDirtyZones === "yes" ? 1 : 0,
      Avg_Visitors_Day_Norm: parseFloat(farmDetails.visitorsPerDay) || 0,
      Introduce_Without_Quarantine: farmDetails.newPigsWithoutQuarantine === "yes" ? 1 : 0,
      Separate_Spaces: farmDetails.separateSpaces === "yes" ? 1 : 0,
      Batch_Age_Weeks_Norm: ageInWeeks || 0,
      Previously_Infected: batches[0].diseaseInfected === "yes" ? 1 : 0,
      Vacc_Coverage_Rate: vaccCoverage,
      Pig_Density_Norm: Number(
        (parseFloat(batches[0].count) / (parseFloat(farmDetails.farmSize) || 1)).toFixed(2)
      ),
    };
  
    try {
      const token = localStorage.getItem("authToken");
  
      const response = await fetch("http://127.0.0.1:8000/predict/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
      console.log("✅ Prediction Result:", result);
  
      // 🔥 NEW: Mark as completed in localStorage for immediate UI update
      const userId = localStorage.getItem("userId");
      if (userId) {
        localStorage.setItem(`riskSubmitted_${userId}`, "true");
        console.log(`✅ Marked risk as completed for user: ${userId}`);
      }
  
      // Force update all components
      window.dispatchEvent(new Event("storage"));
  
      setTimeout(() => {
        alert("Risk analysis completed successfully!");
        navigate("/");
        
        setTimeout(() => {
          const section = document.getElementById("risk-analysis");
          if (section) {
            section.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }, 200);
  
    } catch (error) {
      console.error("❌ Fetch Error:", error);
      alert("Failed to submit form. Check console for details.");
    }
  };
  
  const canProceedToStep2 = () => {
    const required = ['farmSize', 'totalPigs', 'nearbyFarms', 'properFencing', 'cleanDirtyZones', 'visitorsPerDay', 'newPigsWithoutQuarantine', 'separateSpaces'];
    return required.every(field => farmDetails[field]);
  };

  const handlePositiveIntegerInput = (e, field, batchId = null) => {
    const value = e.target.value;
    // Only allow positive integers greater than 0 (no decimals, no negative numbers, no zero)
    if (value === '' || (Number.isInteger(Number(value)) && Number(value) > 0)) {
      if (batchId) {
        updateBatch(batchId, field, value);
      } else {
        handleFarmDetailChange(field, value);
      }
    }
  };

  const handleVisitorsInput = (e) => {
    const value = e.target.value;
    // Allow 0 or positive integers for visitors (0 visitors is valid)
    if (value === '' || (Number.isInteger(Number(value)) && Number(value) >= 0)) {
      handleFarmDetailChange('visitorsPerDay', value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:py-8 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-8 sm:space-x-32">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 
                  ${step.status === 'completed' || step.id === currentStep 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'bg-white border-gray-300 text-gray-500'}`}>
                  {step.status === 'completed' && step.id < currentStep ? (
                    <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <div className="ml-2 sm:ml-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-900">{step.title}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4 sm:mx-16 h-0.5 bg-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Farm Details</h2>
              
              <div className="space-y-4 sm:space-y-6">
              <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Size of farm (in acres):
  </label>
  <input
    type="number"
    value={farmDetails.farmSize}
    onChange={(e) => {
      const value = parseFloat(e.target.value);
      if (value > 0 && value <= 1.5) {
        handleFarmDetailChange('farmSize', value);
      } else if (e.target.value === '') {
        handleFarmDetailChange('farmSize', ''); // allow clearing input
      }
    }}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
    placeholder="Enter farm size"
    min="0.01"
    max="1.5"
    step="0.01"
  />
</div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total no. of pigs in your farm:
                  </label>
                  <input
                    type="number"
                    value={farmDetails.totalPigs}
                    onChange={(e) => handlePositiveIntegerInput(e, 'totalPigs')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="Enter total number of pigs"
                    min="1"
                    step="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Is there any other farm near your around (within 50m):
                  </label>
                  <div className="flex gap-2 sm:gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="nearbyFarms"
                        value="yes"
                        checked={farmDetails.nearbyFarms === 'yes'}
                        onChange={(e) => handleFarmDetailChange('nearbyFarms', e.target.value)}
                        className="mr-1 sm:mr-2"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="nearbyFarms"
                        value="no"
                        checked={farmDetails.nearbyFarms === 'no'}
                        onChange={(e) => handleFarmDetailChange('nearbyFarms', e.target.value)}
                        className="mr-1 sm:mr-2"
                      />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Is there proper fencing available in your farm:
                  </label>
                  <div className="flex gap-2 sm:gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="properFencing"
                        value="yes"
                        checked={farmDetails.properFencing === 'yes'}
                        onChange={(e) => handleFarmDetailChange('properFencing', e.target.value)}
                        className="mr-1 sm:mr-2"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="properFencing"
                        value="no"
                        checked={farmDetails.properFencing === 'no'}
                        onChange={(e) => handleFarmDetailChange('properFencing', e.target.value)}
                        className="mr-1 sm:mr-2"
                      />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Are there separate clean and dirty zones:
                  </label>
                  <div className="flex gap-2 sm:gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="cleanDirtyZones"
                        value="yes"
                        checked={farmDetails.cleanDirtyZones === 'yes'}
                        onChange={(e) => handleFarmDetailChange('cleanDirtyZones', e.target.value)}
                        className="mr-1 sm:mr-2"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="cleanDirtyZones"
                        value="no"
                        checked={farmDetails.cleanDirtyZones === 'no'}
                        onChange={(e) => handleFarmDetailChange('cleanDirtyZones', e.target.value)}
                        className="mr-1 sm:mr-2"
                      />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Average no of visitor per day:
                  </label>
                  <input
                    type="number"
                    value={farmDetails.visitorsPerDay}
                    onChange={(e) => handleVisitorsInput(e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="Enter visitors per day"
                    min="0"
                    step="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Do you introduce new pigs without quarantine:
                  </label>
                  <div className="flex gap-2 sm:gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="newPigsWithoutQuarantine"
                        value="yes"
                        checked={farmDetails.newPigsWithoutQuarantine === 'yes'}
                        onChange={(e) => handleFarmDetailChange('newPigsWithoutQuarantine', e.target.value)}
                        className="mr-1 sm:mr-2"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="newPigsWithoutQuarantine"
                        value="no"
                        checked={farmDetails.newPigsWithoutQuarantine === 'no'}
                        onChange={(e) => handleFarmDetailChange('newPigsWithoutQuarantine', e.target.value)}
                        className="mr-1 sm:mr-2"
                      />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Are there separate spaces for farrowing, nursery, grower, and finisher:
                  </label>
                  <div className="flex gap-2 sm:gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="separateSpaces"
                        value="yes"
                        checked={farmDetails.separateSpaces === 'yes'}
                        onChange={(e) => handleFarmDetailChange('separateSpaces', e.target.value)}
                        className="mr-1 sm:mr-2"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="separateSpaces"
                        value="no"
                        checked={farmDetails.separateSpaces === 'no'}
                        onChange={(e) => handleFarmDetailChange('separateSpaces', e.target.value)}
                        className="mr-1 sm:mr-2"
                      />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 sm:mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!canProceedToStep2()}
                  className={`flex items-center px-4 sm:px-6 py-2 rounded-md font-medium text-sm sm:text-base ${
                    canProceedToStep2()
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Pig Details</h2>
              
              <div className="space-y-4 sm:space-y-6">
                {batches.map((batch) => (
                  <div key={batch.id} className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-base sm:text-lg font-medium text-gray-900">Batch {batches.indexOf(batch) + 1}</h4>
                      <button
                        onClick={() => removeBatch(batch.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          No. of pigs in batch:
                        </label>
                        <input
                          type="number"
                          value={batch.count}
                          onChange={(e) => handlePositiveIntegerInput(e, 'count', batch.id)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                          placeholder="Enter number of pigs"
                          min="1"
                          step="1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Age of pigs:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={batch.age}
                            onChange={(e) => handlePositiveIntegerInput(e, 'age', batch.id)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            placeholder="Enter age"
                            min="1"
                            step="1"
                          />
                          <select
                            value={batch.ageUnit || 'days'}
                            onChange={(e) => updateBatch(batch.id, 'ageUnit', e.target.value)}
                            className="px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                          >
                            <option value="days">Days</option>
                            <option value="months">Months</option>
                            <option value="years">Years</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Is there any pig infected (previously infected) with any disease:
                        </label>
                        <div className="flex gap-2 sm:gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`diseaseInfected-${batch.id}`}
                              value="yes"
                              checked={batch.diseaseInfected === 'yes'}
                              onChange={(e) => updateBatch(batch.id, 'diseaseInfected', e.target.value)}
                              className="mr-1 sm:mr-2"
                            />
                            <span className="text-sm">Yes</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`diseaseInfected-${batch.id}`}
                              value="no"
                              checked={batch.diseaseInfected === 'no'}
                              onChange={(e) => updateBatch(batch.id, 'diseaseInfected', e.target.value)}
                              className="mr-1 sm:mr-2"
                            />
                            <span className="text-sm">No</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Out of following, how many vaccinations are completed:
                        </label>
                        <div className="space-y-2">
                          {pigVaccinations.map((vaccination) => (
                            <label key={vaccination} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={(batch.vaccinations || []).includes(vaccination)}
                                onChange={() => toggleVaccination(batch.id, vaccination)}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">{vaccination}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addBatch}
                  className="flex items-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors w-full justify-center text-sm sm:text-base"
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Add New Batch
                </button>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 sm:mt-8">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center justify-center px-4 sm:px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 sm:px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium text-sm sm:text-base"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PigFarmForm;