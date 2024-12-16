import React from 'react';

const StudentCard = ({ student }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-xl font-bold">{student.name}</h3>
      <p><strong>Email:</strong> {student.email || 'N/A'}</p>
      <p><strong>Address:</strong> {student.address || 'N/A'}</p>
      <p><strong>Date of Birth:</strong> {student.dob || 'N/A'}</p>
      {student.course && (
        <>
          <h4 className="text-lg font-semibold mt-2">Course Details:</h4>
          <p><strong>Course Name:</strong> {student.course.name}</p>
          <p><strong>Duration:</strong> {student.course.duration}</p>
        </>
      )}
      {student.payment && (
        <>
          <h4 className="text-lg font-semibold mt-2">Payment Details:</h4>
          <p><strong>Bank Name:</strong> {student.payment.bankName}</p>
          <p><strong>Payment Mode:</strong> {student.payment.mode}</p>
        </>
      )}
    </div>
  );
};

export default StudentCard;
