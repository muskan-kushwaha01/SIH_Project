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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Batch</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Total Pigs</label>
              <input type="number" value={totalPigs} onChange={(e) => setTotalPigs(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Sick Pigs</label>
              <input type="number" value={sickPigs} onChange={(e) => setSickPigs(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vaccinated Pigs</label>
              <input type="number" value={vaccinatedPigs} onChange={(e) => setVaccinatedPigs(e.target.value)} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn-primary">Add Batch</button>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBatchModal;
