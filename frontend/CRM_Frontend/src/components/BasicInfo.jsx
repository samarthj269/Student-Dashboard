import React from 'react';

const BasicInfo = ({ studentProfile }) => {
  if (!studentProfile) return null;

  return (
    <div className="text-s text-bold text-gray-700 flex items-center space-x-4">
      <div><strong>Name:</strong> {studentProfile.Name}</div>
      <div><strong>Student ID:</strong> {studentProfile.Student_Id}</div>
      <div><strong>Email:</strong> {studentProfile.Email_Id}</div>
    </div>
  );
};

export default BasicInfo;
