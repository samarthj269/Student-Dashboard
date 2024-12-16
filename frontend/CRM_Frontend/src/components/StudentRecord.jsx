import React, { useEffect, useState } from 'react';
import { FaLinkedin, FaFileAlt } from 'react-icons/fa';
import DetailItem from './DetailItem';

const headers = {
  "Student_Id": "Student ID",
  "Name": "Name",
  "Gender": "Gender",
  "LinkedIn_Id": "LinkedIn Profile",
  "Email_Id": "Email",
  "Contact_No": "Contact Number",
  "University_Name": "University",
  "Qualification": "Qualification",
  "cv_Name": "CV Name",
  "CV_Link": "CV Link",
  "address": "Address",
  "skills": "Skills",
  "Brand": "Brand"
};

const StudentRecord = ({ studentId, showFullScreen, showSummary }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/student-profile?studentId=${studentId}`);
        const result = await response.json();

        if (response.ok) {
          setData(result);
          setError('');
        } else {
          setError('No student record available.');
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
        setError('Failed to fetch student data.');
      }
    };

    if (studentId && studentId.length === 3) {
      fetchStudentData();
    } else {
      setData(null);
      setError('Please provide a valid student ID.');
    }
  }, [studentId]);

  const renderTopSkills = (skills) => skills.slice(0, 5).join(', ');

  const renderAddress = (address) => address 
    ? `${address.house_no}, ${address.street_name}, ${address.city}, ${address.district}, ${address.state}, ${address.pincode}, ${address.country}` 
    : 'Address not available';

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!data) {
    return <div>Loading student record...</div>;
  }

  if (showSummary) {
    return (
      <div className="p-4 border rounded-lg bg-red-50 shadow w-full mb-6 min-h-[200px]">
        <h2 className="text-l font-bold text-sky-600 mb-4 text-center underline underline-offset-4">STUDENT PROFILE SUMMARY</h2>
        <ul className="list-none space-y-2 text-sm text-gray-700">
          <li><strong className="text-blue-600">Name:</strong> {data.Name}</li>
          <li><strong className="text-blue-600">Contact:</strong> {data.Contact_No}</li>
          <li><strong className="text-blue-600">Email:</strong> {data.Email_Id}</li>
          <li><strong className="text-blue-600">Top 5 Skills:</strong> {renderTopSkills(data.skills)}</li>
          <li><strong className="text-blue-600">Brand:</strong> {data.Brand}</li>
        </ul>

        {/* LinkedIn and CV Icons at the bottom */}
        <div className="flex space-x-4 mt-4">
          <a href={data.CV_Link} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-lg">
            <FaFileAlt className="text-2xl" /> CV
          </a>
          <a href={data.LinkedIn_Id} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-lg">
            <FaLinkedin className="text-2xl" /> LinkedIn
          </a>
        </div>
      </div>
    );
}

  return (
    <div className={`${showFullScreen ? "fixed inset-0 bg-gray-900 bg-opacity-75 p-6" : "p-4"} bg-white rounded-lg shadow w-full`} id="studentRecordTable">
      <h2 className="text-lg font-bold mb-6 text-sky-600 underline-offset-4">Student Profile</h2>

      {/* Profile Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {Object.keys(headers).map((key) => (
          <DetailItem 
            key={key} 
            label={headers[key]} 
            value={key === 'skills' ? renderTopSkills(data.skills) :
                   key === 'address' ? renderAddress(data.address) : 
                   key === 'LinkedIn_Id' ? <a href={data.LinkedIn_Id} target="_blank" rel="noopener noreferrer" className="text-blue-500">{data.LinkedIn_Id}</a> :
                   key === 'CV_Link' ? <a href={data.CV_Link} target="_blank" rel="noopener noreferrer" className="text-blue-500">{data.CV_Link}</a> :
                   data[key] }
          />
        ))}
      </div>
    </div>
  );
};

export default StudentRecord;
