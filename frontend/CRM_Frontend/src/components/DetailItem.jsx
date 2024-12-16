
import React from 'react';

const DetailItem = ({ label, value }) => {
  return (
    <div className="flex justify-between">
      <span className="font-semibold">{label}:</span>
      <span>{value !== undefined && value !== null ? value : 'N/A'}</span>
    </div>
  );
};

export default DetailItem;


