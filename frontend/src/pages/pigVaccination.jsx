import React, { useState, useEffect } from "react";
import { Trash2, Plus, Calendar, Activity, Shield, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";

import robotImage from "../assets/images/robot.png";
import BioBuddyChatbot from "../components/Chatbot"; 

const NewBatchModal = ({ onClose, onAddBatch }) => {
  const [batchData, setBatchData] = useState({
    totalPigs: 0,
    sickPigs: 0,
    vaccinatedPigs: 0,
    diseases: []
  });

  const [newDisease, setNewDisease] = useState({
    name: "",
    status: "At Risk",
    lastOutbreak: ""
  });

  const handleSubmit = () => {
    if (batchData.totalPigs > 0) {
      onAddBatch(batchData);
      onClose();
    }
  };

  const addDisease = () => {
    if (newDisease.name && newDisease.lastOutbreak) {
      setBatchData(prev => ({
        ...prev,
        diseases: [...prev.diseases, newDisease]
      }));
      setNewDisease({ name: "", status: "At Risk", lastOutbreak: "" });
    }
  };

  return (
  
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800">Add New Batch</h3>
        </div>
        <div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">Sick Pigs</label>
  <input
    type="number"
    required
    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    value={batchData.sickPigs}
    onChange={(e) => setBatchData(prev => ({ ...prev, sickPigs: parseInt(e.target.value) || 0 }))}
  />
</div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Vaccinated Pigs</label>
              <input
                type="number"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={batchData.vaccinatedPigs}
                onChange={(e) => setBatchData(prev => ({ ...prev, vaccinatedPigs: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Add Disease</h4>
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                placeholder="Disease name"
                className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={newDisease.name}
                onChange={(e) => setNewDisease(prev => ({ ...prev, name: e.target.value }))}
              />
              <select
                className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={newDisease.status}
                onChange={(e) => setNewDisease(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="At Risk">At Risk</option>
                <option value="Active">Active</option>
                <option value="Controlled">Controlled</option>
              </select>
              <input
                type="date"
                className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={newDisease.lastOutbreak}
                onChange={(e) => setNewDisease(prev => ({ ...prev, lastOutbreak: e.target.value }))}
              />
              <button
                type="button"
                onClick={addDisease}
                className="px-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all transform hover:scale-105"
              >
                Add Disease
              </button>
            </div>
          </div>

          {batchData.diseases.length > 0 && (
            <div className="space-y-2">
              <h5 className="font-semibold text-gray-700">Added Diseases:</h5>
              {batchData.diseases.map((disease, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                  <span className="text-sm font-medium">{disease.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    disease.status === "Controlled" ? "bg-green-100 text-green-800" :
                    disease.status === "At Risk" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {disease.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105"
            >
              Add Batch
            </button>
          </div>
        </div>



    );
};

const ProgressBar = ({ value, max, className = "" }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  
  return (
    <div className={`w-full bg-gray-200 rounded-full h-3 overflow-hidden ${className}`}>
      <div 
        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000 ease-out animate-pulse"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, percentage, gradient, delay = 0 }) => (
  <div 
    className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 ${gradient} animate-slideInUp`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute top-0 right-0 w-24 h-24 opacity-10 transform rotate-12 translate-x-6 -translate-y-6">
      <Icon size={96} />
    </div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <Icon size={32} className="animate-bounce" />
        {percentage && (
          <span className="text-sm font-bold bg-white/20 px-2 py-1 rounded-full">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium opacity-90 mb-1">{title}</h3>
      <p className="text-3xl font-bold animate-pulse">{value}</p>
    </div>
  </div>
);

const Vaccination = () => {
  const initialData = {
    totalPigs: 150,
    sickPigs: 5,
    vaccinatedPigs: 145,
    batches: [
      {
        batchId: "1",
        totalPigs: 50,
        sickPigs: 2,
        vaccinatedPigs: 48,
        diseases: [
          {
            name: "Classical Swine Fever (CSF)",
            status: "Controlled",
            lastOutbreak: "2025-10-15",
          },
          {
            name: "Foot and Mouth Disease (FMD)",
            status: "At Risk",
            lastOutbreak: "2025-01-20",
          },
        ],
      },
      {
        batchId: "2",
        totalPigs: 50,
        sickPigs: 1,
        vaccinatedPigs: 49,
        diseases: [
          {
            name: "Porcine Reproductive and Respiratory Syndrome (PRRS)",
            status: "Active",
            lastOutbreak: "2025-11-05",
          },
        ],
      },
      {
        batchId: "3",
        totalPigs: 50,
        sickPigs: 2,
        vaccinatedPigs: 48,
        diseases: [
          {
            name: "Classical Swine Fever (CSF)",
            status: "Vaccinated",
            lastOutbreak: "2025-09-20",
          },
        ],
      },
    ],
    schedule: [
      { age: "1-7 days", vaccine: "Iron Dextran Injection" },
      { age: "3 weeks", vaccine: "Mycoplasma Hyopneumoniae" },
      { age: "6 weeks", vaccine: "CSF, FMD" },
      { age: "10 weeks", vaccine: "PRRS" },
      { age: "6 months", vaccine: "Booster for all" },
    ],
    vaccinationHistory: [
      { pigId: "P001", date: "2025-03-10", vaccine: "CSF", batch: "B01" },
      { pigId: "P002", date: "2025-03-10", vaccine: "CSF", batch: "B01" },
      { pigId: "P003", date: "2025-03-10", vaccine: "FMD", batch: "B02" },
      { pigId: "P004", date: "2025-03-12", vaccine: "PRRS", batch: "B02" },
      { pigId: "P005", date: "2025-03-15", vaccine: "Iron Dextran", batch: "B03" },
    ],
  };

  const [vaccinationData, setVaccinationData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const handleAddBatch = (newBatchData) => {
    setVaccinationData((prevData) => {
      const newBatchId =
        prevData.batches.length > 0
          ? Math.max(...prevData.batches.map((batch) => parseInt(batch.batchId))) + 1
          : 1;
      const newBatch = {
        ...newBatchData,
        batchId: newBatchId.toString(),
      };
      return {
        ...prevData,
        batches: [...prevData.batches, newBatch],
        totalPigs: prevData.totalPigs + newBatch.totalPigs,
        sickPigs: prevData.sickPigs + newBatch.sickPigs,
        vaccinatedPigs: prevData.vaccinatedPigs + newBatch.vaccinatedPigs,
      };
    });
    setAnimationKey(prev => prev + 1);
  };

  const handleDeleteBatch = (batchId) => {
    setVaccinationData((prevData) => {
      const batchToDelete = prevData.batches.find((batch) => batch.batchId === batchId);
      if (!batchToDelete) return prevData;

      return {
        ...prevData,
        batches: prevData.batches.filter((batch) => batch.batchId !== batchId),
        totalPigs: prevData.totalPigs - batchToDelete.totalPigs,
        sickPigs: prevData.sickPigs - batchToDelete.sickPigs,
        vaccinatedPigs: prevData.vaccinatedPigs - batchToDelete.vaccinatedPigs,
      };
    });
  };

  const handleVaccinate = (batchId, diseaseName) => {
    setVaccinationData((prevData) => {
      const newBatches = prevData.batches.map((batch) => {
        if (batch.batchId === batchId) {
          const newDiseases = batch.diseases.map((disease) =>
            disease.name === diseaseName ? { ...disease, status: "Vaccinated" } : disease
          );
          return { ...batch, diseases: newDiseases, vaccinatedPigs: batch.totalPigs };
        }
        return batch;
      });

      const newHistory = [
        ...prevData.vaccinationHistory,
        ...Array.from(
          { length: prevData.batches.find((b) => b.batchId === batchId).totalPigs },
          (_, i) => ({
            pigId: `P${(prevData.vaccinationHistory.length + i + 1)
              .toString()
              .padStart(3, "0")}`,
            date: new Date().toISOString().slice(0, 10),
            vaccine: diseaseName,
            batch: batchId,
          })
        ),
      ];

      const newTotalVaccinated = newBatches.reduce((acc, batch) => acc + batch.vaccinatedPigs, 0);

      return {
        ...prevData,
        batches: newBatches,
        vaccinationHistory: newHistory,
        vaccinatedPigs: newTotalVaccinated,
      };
    });
  };

  const sickPercentage = (vaccinationData.sickPigs / vaccinationData.totalPigs) * 100;
  const vaccinatedPercentage = (vaccinationData.vaccinatedPigs / vaccinationData.totalPigs) * 100;

  const getStatusIcon = (status) => {
    switch (status) {
      case "Controlled": return <CheckCircle size={16} className="text-green-500" />;
      case "At Risk": return <AlertTriangle size={16} className="text-yellow-500" />;
      case "Active": return <Activity size={16} className="text-red-500" />;
      case "Vaccinated": return <Shield size={16} className="text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 lg:px-8 py-8">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
        .animate-slideInUp { animation: slideInUp 0.6s ease-out both; }
        .animate-fadeInDown { animation: fadeInDown 0.8s ease-out; }
      `}</style>

      {isModalOpen && (
        <NewBatchModal onClose={() => setIsModalOpen(false)} onAddBatch={handleAddBatch} />
      )}
    <div className="mb-16">
  <Navbar />
</div>
      {/* Header */}
      <div className="text-center mb-12 animate-fadeInDown">
        <h1 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          🐖 Vaccination Dashboard
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Monitor and manage pig vaccination status across all batches with real-time insights
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" key={animationKey}>
        <StatCard
          icon={TrendingUp}
          title="Total Pigs"
          value={vaccinationData.totalPigs}
          gradient="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700"
          delay={0}
        />
        <StatCard
          icon={AlertTriangle}
          title="Sick Pigs"
          value={vaccinationData.sickPigs}
          percentage={sickPercentage}
          gradient="bg-gradient-to-br from-orange-500 via-orange-600 to-red-500"
          delay={200}
        />
        <StatCard
          icon={Shield}
          title="Vaccinated Pigs"
          value={vaccinationData.vaccinatedPigs}
          percentage={vaccinatedPercentage}
          gradient="bg-gradient-to-br from-emerald-500 via-teal-600 to-green-600"
          delay={400}
        />
      </div>

      {/* Batch Management */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Activity className="text-blue-600" />
            Batch Management
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            <Plus size={20} />
            Add New Batch
          </button>
        </div>

        <div className="grid gap-6">
          {vaccinationData.batches.map((batch, index) => (
            <div
              key={batch.batchId}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 animate-slideInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-4 h-16 rounded-full bg-gradient-to-b ${
                      index % 3 === 0 ? "from-blue-400 to-blue-600" :
                      index % 3 === 1 ? "from-teal-400 to-teal-600" :
                      "from-purple-400 to-purple-600"
                    }`} />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Batch #{batch.batchId}
                      </h3>
                      <p className="text-gray-600">
                        {batch.vaccinatedPigs}/{batch.totalPigs} pigs vaccinated
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteBatch(batch.batchId)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{batch.totalPigs}</div>
                    <div className="text-sm text-blue-800 font-medium">Total Pigs</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600">{batch.sickPigs}</div>
                    <div className="text-sm text-orange-800 font-medium">Sick Pigs</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">{batch.vaccinatedPigs}</div>
                    <div className="text-sm text-green-800 font-medium">Vaccinated</div>
                  </div>
                </div>

                <ProgressBar value={batch.vaccinatedPigs} max={batch.totalPigs} className="mb-6" />

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Disease</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Outbreak</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batch.diseases.map((disease, i) => (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4 font-medium text-gray-800">{disease.name}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(disease.status)}
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                disease.status === "Controlled" ? "bg-green-100 text-green-800" :
                                disease.status === "At Risk" ? "bg-yellow-100 text-yellow-800" :
                                disease.status === "Active" ? "bg-red-100 text-red-800" :
                                "bg-blue-100 text-blue-800"
                              }`}>
                                {disease.status}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-600 flex items-center gap-2">
                            <Calendar size={16} />
                            {disease.lastOutbreak}
                          </td>
                          <td className="py-4 px-4">
                            {disease.status !== "Vaccinated" && (
                              <button
                                onClick={() => handleVaccinate(batch.batchId, disease.name)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105"
                              >
                                <Shield size={16} />
                                Vaccinate
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule and History Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Vaccination Schedule */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-6 lg:p-8 animate-slideInUp">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Calendar className="text-purple-600" />
            Vaccination Schedule
          </h2>
          <div className="space-y-4">
            {vaccinationData.schedule.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{item.age}</div>
                    <div className="text-sm text-gray-600">{item.vaccine}</div>
                  </div>
                </div>
                <Shield size={20} className="text-purple-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Vaccination History */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-6 lg:p-8 animate-slideInUp">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Activity className="text-green-600" />
            Recent History
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {vaccinationData.vaccinationHistory.slice(-10).reverse().map((record, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-all duration-300"
              >
                <div>
                  <div className="font-semibold text-gray-800">Pig {record.pigId}</div>
                  <div className="text-sm text-gray-600">{record.vaccine}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-800">{record.date}</div>
                  <div className="text-xs text-gray-500">Batch {record.batch}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BioBuddyChatbot 
        robotImage={robotImage} 
      />
    </div>
  
  );
};

export default Vaccination;