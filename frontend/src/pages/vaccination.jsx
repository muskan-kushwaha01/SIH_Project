import React, { useState, useEffect } from 'react';
import NewBatchModal from '../components/NewBatchModal';
import ProgressBar from '../components/ProgressBar';

const Vaccination = () => {
  const initialData = {
    totalPigs: 150,
    sickPigs: 5,
    vaccinatedPigs: 145,
    batches: [
      {
        batchId: '1',
        totalPigs: 50,
        sickPigs: 2,
        vaccinatedPigs: 48,
        diseases: [
          { name: 'Classical Swine Fever (CSF)', status: 'Controlled', lastOutbreak: '2025-10-15' },
          { name: 'Foot and Mouth Disease (FMD)', status: 'At Risk', lastOutbreak: '2025-01-20' },
        ],
      },
      {
        batchId: '2',
        totalPigs: 50,
        sickPigs: 1,
        vaccinatedPigs: 49,
        diseases: [
          { name: 'Porcine Reproductive and Respiratory Syndrome (PRRS)', status: 'Active', lastOutbreak: '2025-11-05' },
        ],
      },
      {
        batchId: '3',
        totalPigs: 50,
        sickPigs: 2,
        vaccinatedPigs: 48,
        diseases: [
          { name: 'Classical Swine Fever (CSF)', status: 'Vaccinated', lastOutbreak: '2025-09-20' },
        ],
      },
    ],
    schedule: [
      { age: '1-7 days', vaccine: 'Iron Dextran Injection' },
      { age: '3 weeks', vaccine: 'Mycoplasma Hyopneumoniae' },
      { age: '6 weeks', vaccine: 'CSF, FMD' },
      { age: '10 weeks', vaccine: 'PRRS' },
      { age: '6 months', vaccine: 'Booster for all' },
    ],
    vaccinationHistory: [
      { pigId: 'P001', date: '2025-03-10', vaccine: 'CSF', batch: 'B01' },
      { pigId: 'P002', date: '2025-03-10', vaccine: 'CSF', batch: 'B01' },
      { pigId: 'P003', date: '2025-03-10', vaccine: 'FMD', batch: 'B02' },
      { pigId: 'P004', date: '2025-03-12', vaccine: 'PRRS', batch: 'B02' },
      { pigId: 'P005', date: '2025-03-15', vaccine: 'Iron Dextran', batch: 'B03' },
    ],
  };

  const [vaccinationData, setVaccinationData] = useState(() => {
    const savedData = localStorage.getItem('vaccinationData');
    return savedData ? JSON.parse(savedData) : initialData;
  });

  useEffect(() => {
    localStorage.setItem('vaccinationData', JSON.stringify(vaccinationData));
  }, [vaccinationData]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddBatch = (newBatchData) => {
    setVaccinationData((prevData) => {
      const newBatchId = prevData.batches.length > 0 ? Math.max(...prevData.batches.map((batch) => parseInt(batch.batchId))) + 1 : 1;
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
          const newDiseases = batch.diseases.map((disease) => {
            if (disease.name === diseaseName) {
              return { ...disease, status: 'Vaccinated' };
            }
            return disease;
          });
          return { ...batch, diseases: newDiseases, vaccinatedPigs: batch.totalPigs };
        }
        return batch;
      });

      const newHistory = [
        ...prevData.vaccinationHistory,
        ...Array.from({ length: prevData.batches.find(b => b.batchId === batchId).totalPigs }, (_, i) => ({
          pigId: `P${(prevData.vaccinationHistory.length + i + 1).toString().padStart(3, '0')}`,
          date: new Date().toISOString().slice(0, 10),
          vaccine: diseaseName,
          batch: batchId,
        })),
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

  return (
    <div className="px-10 py-10 bg-gray-100 min-h-screen font-sans">
      {isModalOpen && <NewBatchModal onClose={() => setIsModalOpen(false)} onAddBatch={handleAddBatch} />}
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">Pig Vaccination Dashboard</h1>

      {/* Summary Section */}
      <div className="flex flex-wrap justify-center gap-6 mb-12">
        <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white p-8 rounded-xl w-72 shadow-lg transform transition hover:-translate-y-2 hover:shadow-2xl text-center">
          <div className="text-4xl mb-4">🐖</div>
          <h2 className="text-lg font-medium">Total Pigs</h2>
          <p className="text-3xl font-bold mt-2">{vaccinationData.totalPigs}</p>
        </div>
        <div className="bg-gradient-to-tr from-red-500 to-red-700 text-white p-8 rounded-xl w-72 shadow-lg transform transition hover:-translate-y-2 hover:shadow-2xl text-center">
          <div className="text-4xl mb-4">🤒</div>
          <h2 className="text-lg font-medium">Sick Pigs</h2>
          <p className="text-3xl font-bold mt-2">{vaccinationData.sickPigs}</p>
          <p className="mt-2 font-medium">{`${Math.round(sickPercentage)}%`}</p>
        </div>
        <div className="bg-gradient-to-tr from-green-500 to-green-700 text-white p-8 rounded-xl w-72 shadow-lg transform transition hover:-translate-y-2 hover:shadow-2xl text-center">
          <div className="text-4xl mb-4">💉</div>
          <h2 className="text-lg font-medium">Vaccinated Pigs</h2>
          <p className="text-3xl font-bold mt-2">{vaccinationData.vaccinatedPigs}</p>
          <p className="mt-2 font-medium">{`${Math.round(vaccinatedPercentage)}%`}</p>
        </div>
      </div>

      {/* Batch Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Batch-wise Disease Information</h2>
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
            onClick={() => setIsModalOpen(true)}
          >
            + Add New Batch
          </button>
        </div>

        {vaccinationData.batches.map((batch, index) => (
          <div key={index} className={`p-6 rounded-xl mb-6 shadow-md border-l-4 ${index % 3 === 0 ? 'border-blue-600' : index % 3 === 1 ? 'border-green-500' : 'border-yellow-500'} bg-white`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`font-semibold ${index % 3 === 0 ? 'text-blue-600' : index % 3 === 1 ? 'text-green-500' : 'text-yellow-500'}`}>Batch ID: {batch.batchId}</h3>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                onClick={() => handleDeleteBatch(batch.batchId)}
              >
                Remove
              </button>
            </div>
            <div className="flex justify-around bg-gray-50 p-4 rounded-md mb-4">
              <p className="font-medium text-gray-600">Total Pigs: {batch.totalPigs}</p>
              <p className="font-medium text-gray-600">Sick Pigs: {batch.sickPigs}</p>
              <p className="font-medium text-gray-600">Vaccinated Pigs: {batch.vaccinatedPigs}</p>
            </div>

            <ProgressBar value={batch.vaccinatedPigs} max={batch.totalPigs} />

            <h4 className="font-semibold mt-4 mb-2 text-gray-700">Disease Status</h4>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white text-sm uppercase">
                  <th className="px-4 py-2">Disease</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Last Outbreak</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {batch.diseases.map((disease, i) => (
                  <tr key={i} className="hover:bg-gray-100">
                    <td className="px-4 py-2">{disease.name}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-white text-sm ${disease.status.toLowerCase().replace(' ', '-') === 'controlled' ? 'bg-green-500' : disease.status.toLowerCase().replace(' ', '-') === 'at-risk' ? 'bg-yellow-500' : disease.status.toLowerCase().replace(' ', '-') === 'active' ? 'bg-red-500' : 'bg-blue-600'}`}>
                        {disease.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{disease.lastOutbreak}</td>
                    <td className="px-4 py-2">
                      {disease.status !== 'Vaccinated' && (
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                          onClick={() => handleVaccinate(batch.batchId, disease.name)}
                        >
                          Vaccinate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Vaccination Schedule */}
      <div className="mb-12 overflow-x-auto">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Vaccination Schedule</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white text-sm uppercase">
              <th className="px-4 py-2">Age</th>
              <th className="px-4 py-2">Vaccine</th>
            </tr>
          </thead>
          <tbody>
            {vaccinationData.schedule.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-2">{item.age}</td>
                <td className="px-4 py-2">{item.vaccine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vaccination History */}
      <div className="overflow-x-auto">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Vaccination History</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white text-sm uppercase">
              <th className="px-4 py-2">Pig ID</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Vaccine</th>
              <th className="px-4 py-2">Batch</th>
            </tr>
          </thead>
          <tbody>
            {vaccinationData.vaccinationHistory.map((record, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-2">{record.pigId}</td>
                <td className="px-4 py-2">{record.date}</td>
                <td className="px-4 py-2">{record.vaccine}</td>
                <td className="px-4 py-2">{record.batch}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vaccination;
