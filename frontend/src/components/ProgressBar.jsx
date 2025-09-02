import React from 'react';

const ProgressBar = ({ value, max }) => {
  const percentage = Math.min((value / max) * 100, 100); // prevent overflow

  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${percentage}%` }}>
        <span className="progress-text">{`${Math.round(percentage)}%`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
