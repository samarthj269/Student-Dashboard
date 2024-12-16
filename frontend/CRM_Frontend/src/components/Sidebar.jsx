
import React from 'react';

const Sidebar = ({ isOpen, toggleSidebar, onComponentClick }) => {
  return (
    <div className={`fixed top-0 left-0 h-full ${isOpen ? 'w-64' : 'w-12'} bg-gray-800 text-white transition-all duration-300`}>
      
      <div className="p-4 cursor-pointer" onClick={toggleSidebar}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </div>
      \
      {isOpen && (
        <ul className="mt-8 space-y-4">
          <li className="px-4 py-2 cursor-pointer hover:bg-gray-700" onClick={() => onComponentClick('StudentRecord')}>
            Student Profile
          </li>
          <li className="px-4 py-2 cursor-pointer hover:bg-gray-700" onClick={() => onComponentClick('CommunicationDetails')}>
            Communication Details
          </li>
          <li className="px-4 py-2 cursor-pointer hover:bg-gray-700" onClick={() => onComponentClick('MentoringSessions')}>
            Mentoring Sessions
          </li>
          <li className="px-4 py-2 cursor-pointer hover:bg-gray-700" onClick={() => onComponentClick('OpportunityDetails')}>
            Opportunity Details
          </li>
          <li className="px-4 py-2 cursor-pointer hover:bg-gray-700" onClick={() => onComponentClick('PaymentDetails')}>
            Payment Details
          </li>
          <li className="px-4 py-2 cursor-pointer hover:bg-gray-700" onClick={() => onComponentClick('CourseDetails')}>
            Course Details
          </li>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;

