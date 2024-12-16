
import React from 'react';

const MentoringSessionsTable = ({ sessions }) => (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Mentoring Sessions</h2>
        <table className="min-w-full border-collapse border border-gray-300">
            <thead>
                <tr>
                    <th className="border border-gray-300 px-4 py-2">Session Date</th>
                    <th className="border border-gray-300 px-4 py-2">Start Time</th>
                    <th className="border border-gray-300 px-4 py-2">End Time</th>
                    <th className="border border-gray-300 px-4 py-2">Duration</th>
                    <th className="border border-gray-300 px-4 py-2">Session Type</th>
                    <th className="border border-gray-300 px-4 py-2">Session Sub Type</th>
                    <th className="border border-gray-300 px-4 py-2">Status</th>
                    <th className="border border-gray-300 px-4 py-2">Topic</th>
                    <th className="border border-gray-300 px-4 py-2">Mentor Name</th>
                    <th className="border border-gray-300 px-4 py-2">Mentor Email</th>
                    <th className="border border-gray-300 px-4 py-2">Scheduler Email</th>
                </tr>
            </thead>
            <tbody>
                {sessions.length > 0 ? (
                    sessions.map((session, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                            <td className="border border-gray-300 px-4 py-2">{session.session_date}</td>
                            <td className="border border-gray-300 px-4 py-2">{session.start_time}</td>
                            <td className="border border-gray-300 px-4 py-2">{session.end_time}</td>
                            <td className="border border-gray-300 px-4 py-2">{session.duration}</td>
                            <td className="border border-gray-300 px-4 py-2">{session.session_type}</td>
                            <td className="border border-gray-300 px-4 py-2">{session.session_sub_type}</td>
                            <td className="border border-gray-300 px-4 py-2">{session.session_status}</td>
                            <td className="border border-gray-300 px-4 py-2">{session.topic}</td>
                            <td className="border border-gray-300 px-4 py-2">{session.mentor_name}</td>
                            <td className="border border-gray-300 px-4 py-2">{session.mentor_email}</td>
                            <td className="border border-gray-300 px-4 py-2">{session.scheduler_email}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="11" className="text-center py-4">
                            No mentoring session data available.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

export default MentoringSessionsTable;
