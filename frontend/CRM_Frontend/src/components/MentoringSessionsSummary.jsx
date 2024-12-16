
import React from 'react';

const MentoringSessionsSummary = ({ sessions }) => {
    
    const totalSessions = sessions.length;
    const bookedSessions = sessions.filter(session => session.session_status === 'Booked').length;
    const attendedSessions = sessions.filter(session => session.session_status === 'Completed').length;
    const cancelledSessions = sessions.filter(session => session.session_status === 'Cancelled').length;
    const upcomingSessions = sessions.filter(session => session.session_status === 'Scheduled').length;
    const totalAttendedHours = sessions
        .filter(session => session.session_status === 'Completed')
        .reduce((sum, session) => sum + (parseFloat(session.duration) || 0), 0);

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4 text-sky-600 underline-offset-4">Mentoring Sessions Summary</h2>
            <div className="space-y-2 text-sm text-gray-700">
                <div><strong>Total Sessions:</strong> {totalSessions}</div>
                <div><strong>Booked Sessions:</strong> {bookedSessions}</div>
                <div><strong>Attended Sessions:</strong> {attendedSessions}</div>
                <div><strong>Cancelled Sessions:</strong> {cancelledSessions}</div>
                <div><strong>Upcoming Sessions:</strong> {upcomingSessions}</div>
                <div><strong>Total Attended Hours:</strong> {totalAttendedHours} hrs</div>
            </div>
        </div>
    );
};

export default MentoringSessionsSummary;
