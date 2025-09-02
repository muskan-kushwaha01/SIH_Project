import React from 'react';

const ProgressBar = ({ value, max }) => {
  const percentage = (value / max) * 100;

  return (
    <div className="w-full bg-gray-300 rounded-md h-5 my-2">
      <div
        className="bg-green-500 h-5 rounded-md text-white text-sm text-center leading-5"
        style={{ width: `${percentage}%` }}
      >
        {`${Math.round(percentage)}%`}
      </div>
    </div>
  );
};

export default ProgressBar;
