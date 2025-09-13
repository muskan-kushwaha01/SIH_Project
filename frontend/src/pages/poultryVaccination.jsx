import React, { useState } from 'react';
import { Plus, Activity, AlertTriangle, Shield, Calendar, Trash2, Eye } from 'lucide-react';
import Navbar from '../components/Navbar';
import robotImage from "../assets/images/robot.png";
import BioBuddyChatbot from "../components/Chatbot"; 

const PoultryVaccinationDashboard = () => {
  const [batches, setBatches] = useState([
    {
      id: 1,
      name: 'Batch #1',
      type: 'Broiler Chickens',
      totalBirds: 500,
      sickBirds: 3,
      vaccinatedBirds: 485,
      diseases: [
        {
          name: 'Newcastle Disease (ND)',
          status: 'Active',
          lastOutbreak: '2025-08-15',
          action: 'Vaccinate'
        }
      ]
    },
    {
      id: 2,
      name: 'Batch #2',
      type: 'Layer Hens',
      totalBirds: 750,
      sickBirds: 2,
      vaccinatedBirds: 735,
      diseases: [
        {
          name: 'Infectious Bronchitis (IB)',
          status: 'Active',
          lastOutbreak: '2025-09-02',
          action: 'Vaccinate'
        }
      ]
    },
    {
      id: 3,
      name: 'Batch #3',
      type: 'Ducks',
      totalBirds: 300,
      sickBirds: 1,
      vaccinatedBirds: 295,
      diseases: [
        {
          name: 'Duck Hepatitis',
          status: 'Vaccinated',
          lastOutbreak: '2025-07-20',
          action: 'Monitor'
        }
      ]
    }
  ]);

  const [vaccinationSchedule] = useState([
    {
      id: 1,
      timeframe: '1-7 days',
      vaccine: 'Marek\'s Disease Vaccine',
      description: 'Day-old chick vaccination'
    },
    {
      id: 2,
      timeframe: '2-3 weeks',
      vaccine: 'Newcastle Disease (ND)',
      description: 'First ND vaccination'
    },
    {
      id: 3,
      timeframe: '4-5 weeks',
      vaccine: 'Infectious Bronchitis (IB)',
      description: 'Primary IB vaccination'
    },
    {
      id: 4,
      timeframe: '6-8 weeks',
      vaccine: 'Fowl Pox Vaccine',
      description: 'Wing web vaccination'
    },
    {
      id: 5,
      timeframe: '12-16 weeks',
      vaccine: 'Layer Vaccine Booster',
      description: 'Booster for layers'
    }
  ]);

  const [recentHistory] = useState([
    {
      id: 'P001',
      bird: 'Chicken C001',
      disease: 'ND',
      date: '2025-09-10',
      batch: 'Batch B01'
    },
    {
      id: 'P002',
      bird: 'Duck D001',
      disease: 'Duck Hepatitis',
      date: '2025-09-08',
      batch: 'Batch B03'
    },
    {
      id: 'P003',
      bird: 'Chicken C002',
      disease: 'IB',
      date: '2025-09-07',
      batch: 'Batch B02'
    },
    {
      id: 'P004',
      bird: 'Chicken C003',
      disease: 'ND',
      date: '2025-09-05',
      batch: 'Batch B01'
    }
  ]);

  const totalBirds = batches.reduce((sum, batch) => sum + batch.totalBirds, 0);
  const totalSick = batches.reduce((sum, batch) => sum + batch.sickBirds, 0);
  const totalVaccinated = batches.reduce((sum, batch) => sum + batch.vaccinatedBirds, 0);
  const vaccinationRate = Math.round((totalVaccinated / totalBirds) * 100);

  const removeBatch = (batchId) => {
    setBatches(batches.filter(batch => batch.id !== batchId));
  };

  const addNewBatch = () => {
    const newBatch = {
      id: batches.length + 1,
      name: `Batch #${batches.length + 1}`,
      type: 'New Poultry Batch',
      totalBirds: 0,
      sickBirds: 0,
      vaccinatedBirds: 0,
      diseases: []
    };
    setBatches([...batches, newBatch]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
<div className="mb-16">
  <Navbar />
</div>
      {/* Main Title */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-purple-600 mb-2">🐔 Vaccination Dashboard</h2>
        <p className="text-gray-600">Monitor and manage poultry vaccination status across all batches with real-time insights</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-500 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Birds</p>
              <p className="text-3xl font-bold">{totalBirds.toLocaleString()}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-orange-500 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Sick Birds</p>
              <p className="text-3xl font-bold">{totalSick}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-200" />
          </div>
          <div className="mt-2">
            <span className="text-xs bg-orange-400 px-2 py-1 rounded">
              {((totalSick / totalBirds) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="bg-green-500 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Vaccinated Birds</p>
              <p className="text-3xl font-bold">{totalVaccinated.toLocaleString()}</p>
            </div>
            <Shield className="w-8 h-8 text-green-200" />
          </div>
          <div className="mt-2">
            <span className="text-xs bg-green-400 px-2 py-1 rounded">
              {vaccinationRate}%
            </span>
          </div>
        </div>
      </div>

      {/* Batch Management */}
      <div className="bg-white rounded-xl shadow-sm mb-8">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900">Batch Management</h3>
          </div>
          <button 
            onClick={addNewBatch}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Batch</span>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {batches.map((batch) => (
            <div key={batch.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-8 bg-blue-500 rounded"></div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{batch.name}</h4>
                    <p className="text-sm text-gray-600">{batch.type} - {batch.totalBirds} birds total</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeBatch(batch.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1 hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">{batch.totalBirds}</p>
                  <p className="text-sm text-blue-800">Total Birds</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-orange-600">{batch.sickBirds}</p>
                  <p className="text-sm text-orange-800">Sick Birds</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">{batch.vaccinatedBirds}</p>
                  <p className="text-sm text-green-800">Vaccinated</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(batch.vaccinatedBirds / batch.totalBirds) * 100}%` }}
                ></div>
              </div>
              
              {/* Disease Information */}
              {batch.diseases.length > 0 && (
                <div className="border-t pt-4">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-600">
                        <th className="pb-2">Disease</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2">Last Outbreak</th>
                        <th className="pb-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batch.diseases.map((disease, index) => (
                        <tr key={index}>
                          <td className="py-2 text-sm text-gray-900">{disease.name}</td>
                          <td className="py-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              disease.status === 'Active' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {disease.status}
                            </span>
                          </td>
                          <td className="py-2 text-sm text-gray-600">{disease.lastOutbreak}</td>
                          <td className="py-2">
                            <button className={`px-3 py-1 rounded-lg text-xs ${
                              disease.action === 'Vaccinate'
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}>
                              {disease.action}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        {/* Vaccination Schedule */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center space-x-2 p-4 sm:p-6 border-b">
            <Calendar className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Vaccination Schedule</h3>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {vaccinationSchedule.map((schedule) => (
                <div key={schedule.id} className="flex items-start space-x-3 sm:space-x-4 p-3 bg-purple-50 rounded-lg">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0">
                    {schedule.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                      <span className="font-medium text-gray-900 text-sm sm:text-base">{schedule.timeframe}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-purple-700 font-medium">{schedule.vaccine}</p>
                    <p className="text-xs text-gray-600">{schedule.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent History */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center space-x-2 p-4 sm:p-6 border-b">
            <Activity className="w-5 h-5 text-green-600" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Recent History</h3>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-3">
              {recentHistory.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{record.bird}</p>
                    <p className="text-xs sm:text-sm text-green-700">{record.disease}</p>
                  </div>
                  <div className="text-right ml-3 flex-shrink-0">
                    <p className="text-xs sm:text-sm text-gray-900">{record.date}</p>
                    <p className="text-xs text-gray-600">{record.batch}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <BioBuddyChatbot 
        robotImage={robotImage} 
      />
    </div>
  );
};

export default PoultryVaccinationDashboard;