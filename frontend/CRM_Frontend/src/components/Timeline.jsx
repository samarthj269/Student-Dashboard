
import React from 'react';

const getCircleColor = (status) => {
  if (status.toLowerCase() === 'incomplete' || status.toLowerCase() === 'failed') {
    return 'bg-red-500';  // Red for failed or incomplete events
  }
  return 'bg-green-500';    // Green for completed or successful events
};

const getIcon = (status) => {
  if (status.toLowerCase() === 'incomplete' || status.toLowerCase() === 'failed') {
    return (
      <svg
        className="w-4 h-4 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        ></path> 
      </svg>
    );
  }
  return (
    <svg
      className="w-4 h-4 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"
      ></path> 
    </svg>
  );
};

const Timeline = ({ timelineData }) => {
  const formatDateTime = (date, time) => {
    // Combine date and time into a single string and create a Date object
    const dateTimeString = `${date}T${time}`; // ISO 8601 format
    return new Date(dateTimeString);
  };

  return (
    <div className="p-4 h-full  overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Timeline</h3>
      {timelineData.length === 0 ? (
        <p>No timeline data available.</p>
      ) : (
        <ul className="space-y-8 relative">
          <div className="absolute w-0.5 bg-gray-300 h-full left-5 top-1"></div>
          {timelineData.map((event, index) => (
            <li key={index} className="relative flex items-start">
              <div className={`absolute w-6 h-6 rounded-full flex items-center justify-center -left-1 ${getCircleColor(event.status)}`}>
                {getIcon(event.status)} 
              </div>
              <div className="ml-10">
                <div className="text-sm font-medium">{event.event}</div>
                <div className="text-sm text-gray-700">{event.category}</div>
                <div className="text-sm text-gray-600 mt-1">{event.status}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {/* Display time directly from the event data */}
                  {event.time} | {new Date(event.date).toLocaleDateString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Timeline;