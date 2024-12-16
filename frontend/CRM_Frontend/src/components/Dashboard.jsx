import React, { useEffect, useState } from 'react';
import Sidebar from './SideBar';
import SearchBar from './SearchBar';
import Timeline from './Timeline';
import StudentRecord from './StudentRecord';
import CommunicationDetails from './CommunicationDetails';
import MentoringSessions from './MentoringSessions';
import OpportunityDetails from './OpportunityDetails';
import PaymentDetails from './PaymentDetails';
import CourseDetails from './CourseDetails';
import ErrorBoundary from './ErrorBoundary';
import AssignmentDetails from './AssignmentDetails';
import EarningDetails from './EarningDetails';
import BasicInfo from './BasicInfo';

const Dashboard = () => {
  const [studentProfile, setStudentProfile] = useState(null);
  const [communicationDetails, setCommunicationDetails] = useState([]);
  const [sessionDetails, setSessionDetails] = useState([]);
  const [opportunityDetails, setOpportunityDetails] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [courseDetails, setCourseDetails] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [timelineData, setTimelineData] = useState([]); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [assignmentDetails, setAssignmentDetails] = useState([]);
  const [earningDetails , setEarningDetails] = useState([]);

  
  const fetchStudentData = async () => {
    if (!studentId) {
      setErrorMessage("No student ID provided.");
      return;
    }
  
    try {
      
      const endpoints = [
        { key: 'profile', url: `http://localhost:5000/api/student-profile?studentId=${studentId}` },
        
        { key: 'communication', url: `http://localhost:5000/api/communication-details?studentId=${studentId}` },
        { key: 'session', url: `http://localhost:5000/api/session-details?studentId=${studentId}` },
        { key: 'opportunity', url: `http://localhost:5000/api/opportunity-details?studentId=${studentId}` },
        { key: 'payment', url: `http://localhost:5000/api/payment-details?studentId=${studentId}` },
        { key: 'course', url: `http://localhost:5000/api/course-details?studentId=${studentId}` },
        { key: 'assignment', url :`http://localhost:5000/api/assignment-details?studentId=${studentId}`},
        { key: 'earning', url :`http://localhost:5000/api/earning?studentId=${studentId}`},
      ];
  
      const responses = await Promise.all(
        endpoints.map(endpoint => fetch(endpoint.url).then(res => res.json()))
      );
  
      const filteredData = {
        profile: responses[0],
        communication: responses[1].filter(comm => comm.Student_Id === studentId),
        session: responses[2].filter(session => session.Student_Id === studentId),
        opportunity: responses[3].filter(opportunity => opportunity.Student_Id === studentId),
        payment: responses[4].filter(payment => payment.Student_Id === studentId),
        course: responses[5].filter(course => course.Student_Id === studentId),
        assignment: responses[6],
        earning: responses[7],
      };
      console.log('Filtered Data:', filteredData); 
  
      setStudentProfile(filteredData.profile);
      setCommunicationDetails(filteredData.communication);
      setSessionDetails(filteredData.session);
      setOpportunityDetails(filteredData.opportunity);
      setPaymentDetails(filteredData.payment);
      setCourseDetails(filteredData.course ); 
    setAssignmentDetails(filteredData.assignment);
    setEarningDetails(filteredData.earning);
  
      
      const timelineResponse = await fetch(`http://localhost:5000/api/timeline?studentId=${studentId}`);
      const timelineJson = await timelineResponse.json();
  
      const filteredTimeline = timelineJson.filter(timeline => timeline.Student_Id === studentId);
      setTimelineData(filteredTimeline);
  
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  
  useEffect(() => {
    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  const handleSearchInputChange = (e) => {
    setStudentId(e.target.value); 
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev); 
  };

  const handleComponentClick = (component) => {
    setSelectedDetail(component); 
    setIsSidebarOpen(false); 
  };

  
  const handleGoToDetails = (component, category) => {
    setSelectedDetail(component);
    
    
    const filteredTimelineData = timelineData.filter(item => item.category === category);
    setTimelineData(filteredTimelineData); 
  };

  const handleCloseDetails = () => {
    setSelectedDetail(null);
    fetchStudentData(); 
  };

  
  const renderComponentDetails = () => {
    const componentMap = {
      'StudentRecord': <StudentRecord  studentId={studentId}  showFullTable={true}/>,
      'CommunicationDetails': <CommunicationDetails studentId={studentId} showFullTable={true} />,
      'MentoringSessions': <MentoringSessions studentId={studentId} showFullTable={true} />,
      'OpportunityDetails': <OpportunityDetails studentId={studentId} showFullTable={true} />,
      'PaymentDetails': <PaymentDetails studentId={studentId} showFullTable={true} />,
      'CourseDetails': <CourseDetails studentId={studentId} showFullTable={true} />,
      'AssignmentDetails': <AssignmentDetails studentId={studentId} showFullTable={true} />,
      'EarningDetails': <EarningDetails studentId={studentId} showFullTable={true} />,
    };
    return componentMap[selectedDetail] || null;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        onComponentClick={handleComponentClick}
      />
      

<div className={`flex-1 flex flex-col p-4 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Search Bar and Basic Info */}
        <div className="flex items-center justify-between mb-4">
          <SearchBar 
            searchTerm={studentId}
            handleSearchInputChange={handleSearchInputChange} 
          />
          
          
          {studentProfile && studentId && (
            <div className="ml-2 p-2 border rounded-lg bg-white shadow-md text-s flex items-center">
              <BasicInfo studentProfile={studentProfile} />
            </div>
          )}
        </div>

        {/* Render selected component details or grid of components */}
        {selectedDetail ? (
          <div className="mt-4 flex-1 p-4 border rounded-lg bg-white shadow overflow-y-auto">
            <button onClick={handleCloseDetails} className="mb-2 bg-red-500 text-white px-4 py-2 rounded">
              Close
            </button>
            {renderComponentDetails()}
          </div>
          
        ) : (
          <div className="mt-4 flex-1 grid grid-cols-2 gap-4 overflow-y-auto">
            <div className="p-4 border rounded-lg bg-red-50 shadow">
              <StudentRecord studentId={studentId} showSummary={true} />
              <button 
                onClick={() => handleGoToDetails('StudentRecord', 'StudentRecord')} 
                className="mt-1 bg-blue-500 text-white px-1 py-1 rounded text-sm"
              >
                Go to Details
              </button>
            </div>
            <div className="p-4 border rounded-lg bg-red-50 shadow">
              <CourseDetails studentId={studentId} showSummary={true} />
              <button 
                onClick={() => handleGoToDetails('CourseDetails', 'CourseDetails')} 
                className="mt-1 bg-blue-500 text-white px-1 py-1 rounded text-sm"
              >
                Go to Details
              </button>
            </div>

            <div className="p-1 border rounded-lg bg-red-50 shadow">
              <AssignmentDetails studentId={studentId} showSummary={true} />
              <button 
                onClick={() => handleGoToDetails('AssignmentDetails', 'AssignmentDetails')} 
                className="mt-1 bg-blue-500 text-white px-1 py-1 rounded text-sm"
              >
                Go to Details
              </button>
            </div>

            <div className="p-1 border rounded-lg bg-red-50 shadow">
              <OpportunityDetails studentId={studentId} showSummary={true} />
              <button 
                onClick={() => handleGoToDetails('OpportunityDetails', 'OpportunityDetails')} 
                className="mt-1 bg-blue-500 text-white px-1 py-1 rounded text-sm"
              >
                Go to Details
              </button>
            </div>
            
              
            
            <div className="p-1 border rounded-lg bg-red-50 shadow">
              <MentoringSessions studentId={studentId} showSummary={true} />
              <button 
                onClick={() => handleGoToDetails('MentoringSessions', 'MentoringSessions')} 
                className="mt-1 bg-blue-500 text-white px-1 py-1 rounded text-sm"
              >
                Go to Details
              </button>
            </div>
            <div className="p-1 border rounded-lg bg-red-50 shadow">
                <CommunicationDetails studentId={studentId} showSummary={true} />
                <button onClick={() => handleGoToDetails('CommunicationDetails', 'CommunicationDetails')} className="mt-1 bg-blue-500 text-white px-1 py-1 rounded text-sm">
                  Go to Details
                </button>
              </div>

            
            

            
            <div className="p-1 border rounded-lg bg-red-50 shadow">
              <EarningDetails studentId={studentId} showSummary={true} />
              <button 
                onClick={() => handleGoToDetails('EarningDetails', 'EarningDetails')} 
                className="mt-1 bg-blue-500 text-white px-1 py-1 rounded text-sm"
              >
                Go to Details
              </button>
            </div>
            <div className="p-1 border rounded-lg bg-red-50 shadow">
              <PaymentDetails studentId={studentId} showSummary={true} />
              <button 
                onClick={() => handleGoToDetails('PaymentDetails', 'PaymentDetails')} 
                className="mt-1 bg-blue-500 text-white px-1 py-1 rounded text-sm"
              >
                Go to Details
              </button>
              
            </div>
            
          </div>
          
          
         
                  
    )
  }
                
    </div>
    

      {/* Timeline Component */}
      <div className="w-1/3">
        <Timeline 
          timelineData={timelineData} 
          selectedComponent={selectedDetail}
        />
      </div>
      
    </div>
    
  );
};

export default Dashboard;




