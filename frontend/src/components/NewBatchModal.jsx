import React, { useState } from 'react';

const NewBatchModal = ({ onClose, onAddBatch }) => {
  const [totalPigs, setTotalPigs] = useState('');
  const [sickPigs, setSickPigs] = useState('');
  const [vaccinatedPigs, setVaccinatedPigs] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!totalPigs) return;
    onAddBatch({
      totalPigs: parseInt(totalPigs),
      sickPigs: parseInt(sickPigs) || 0,
      vaccinatedPigs: parseInt(vaccinatedPigs) || 0,
      diseases: [],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-96">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold">Add New Batch</h2>
          <button onClick={onClose} className="text-xl font-bold">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Total Pigs</label>
              <input
                type="number"
                min='1'
                value={totalPigs}
                onChange={(e) => setTotalPigs(e.target.value)}
                className="w-full border rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Sick Pigs</label>
              <input
                type="number"
                min='1'
                value={sickPigs}
                onChange={(e) => setSickPigs(e.target.value)}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Vaccinated Pigs</label>
              <input
                type="number"
                min='1'
                value={vaccinatedPigs}
                onChange={(e) => setVaccinatedPigs(e.target.value)}
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Add Batch</button>
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBatchModal;
