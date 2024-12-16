import React from 'react';

const SessionDetails = ({ sessionDetails }) => {
  return (
    <div className="p-4 border rounded shadow bg-white w-full">
      <h2 className="font-bold">Session Details</h2>
      <p>Mentor: {sessionDetails?.Mentor}</p>
      <p>Type of Session: {sessionDetails?.['Type of Session']}</p>
      <p>Topic: {sessionDetails?.Topic}</p>
      <p>Date: {sessionDetails?.['Date of Session']}</p>
      <p>Start Time: {sessionDetails?.['Start Time']}</p>
      <p>End Time: {sessionDetails?.['End Time']}</p>
      <p>Meeting Duration: {sessionDetails?.['Meeting Duration']}</p>
      <p>Session Sub Type: {sessionDetails?.['Session Sub Type']}</p>
      <p>Status: {sessionDetails?.Status}</p>
      <p>Session ID: {sessionDetails?.['Session ID']}</p>
      <p>Scheduler Email ID: {sessionDetails?.['Scheduler Email ID']}</p>
      <p>Mentor Email ID: {sessionDetails?.['Mentor Email ID']}</p>
    </div>
  );
};

export default SessionDetails;
