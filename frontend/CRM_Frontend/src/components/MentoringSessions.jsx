import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { FaFileExcel, FaCamera, FaFilter } from 'react-icons/fa';

const MentoringSessions = ({ studentId, showFullScreen, showSummary }) => {
    const [sessionData, setSessionData] = useState([]);
    const [error, setError] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        startDate: '',
        endDate: ''
    });
    const [selectedMentor, setSelectedMentor] = useState(null);

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/session-details?studentId=${studentId}`);
                const sessions = await response.json();

                if (sessions.length) {
                    const enrichedSessions = sessions.map(session => ({
                        session_id: session["mentor_session_id"] || "N/A",
                        student_id: session["Student_Id"] || "N/A",
                        session_date: session["Date of Session"] || "N/A",
                        start_time: session["Start Time"] || "N/A",
                        end_time: session["End Time"] || "N/A",
                        duration: session["Meeting Duration"] || "00:00:00",
                        session_type: session["Type of Session"] || "N/A",
                        session_sub_type: session["Session Sub Type"] || "N/A",
                        session_status: session["Status"] || "N/A",
                        topic: session["Topic"] || "N/A",
                        mentor_name: session.mentorDetails?.["mentor name"] || "N/A",
                        mentor_email: session.mentorDetails?.["mentor_email_id"] || "N/A",
                        mentor_phone: session.mentorDetails?.["mentor_contact_no."] || "N/A",
                        scheduler_email: session["Scheduler Email ID"] || "N/A",
                        mentorDetails: session.mentorDetails || null,
                    }));
                    setSessionData(enrichedSessions);
                    setError('');
                } else {
                    setError("No mentoring session data found for this student.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to fetch data.");
            }
        };

        if (studentId && studentId.length === 3) {
            fetchSessionData();
        } else {
            setSessionData([]);
            setError('');
        }
    }, [studentId]);

    const parseDuration = (duration) => {
        const [hours, minutes, seconds] = duration.split(":").map(Number);
        return hours * 60 + minutes + (seconds / 60);
    };

    const formatDuration = (totalMinutes) => {
        const hrs = Math.floor(totalMinutes / 60);
        const mins = Math.round(totalMinutes % 60);
        return `${hrs} hr${hrs !== 1 ? 's' : ''} ${mins} min${mins !== 1 ? 's' : ''}`;
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const filteredSessions = sessionData.filter(session => {
        const matchesStatus = filters.status ? session.session_status === filters.status : true;
        const sessionDate = new Date(session.session_date);
        const matchesDateRange = (filters.startDate ? sessionDate >= new Date(filters.startDate) : true) &&
                                  (filters.endDate ? sessionDate <= new Date(filters.endDate) : true);
        return matchesStatus && matchesDateRange;
    });

    const openMentorDetails = (mentorDetails) => {
        setSelectedMentor(mentorDetails);
    };

    const closeMentorDetails = () => {
        setSelectedMentor(null);
    };

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredSessions);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'MentoringSessions');
        XLSX.writeFile(workbook, 'mentoring_sessions.xlsx');
    };

    const downloadScreenshot = () => {
        html2canvas(document.body).then((canvas) => {
            canvas.toBlob((blob) => {
                saveAs(blob, 'mentoring_sessions_screenshot.png');
            });
        });
    };

    if (showSummary) {
        const totalSessions = sessionData.length;
        const bookedSessions = sessionData.filter(session => session.session_status !== 'Cancelled').length;
        const attendedSessions = sessionData.filter(session => session.session_status === 'Attended' || session.session_status === 'Completed').length;
        const cancelledSessions = sessionData.filter(session => session.session_status === 'Cancelled').length;
        const upcomingSessions = sessionData.filter(session => session.session_status === 'Scheduled' || session.session_status === 'Upcoming').length;
    
        const attendedDurations = sessionData
            .filter(session => session.session_status === 'Attended' || session.session_status === 'Completed')
            .map(session => parseDuration(session.duration || "00:00:00"));
    
        const totalAttendedMinutes = attendedDurations.reduce((sum, minutes) => sum + minutes, 0);
        const totalAttendedHours = formatDuration(totalAttendedMinutes);
    
        return (
            <div className="p-4 flex justify-center">
                <div className="p-4 border rounded-lg bg-red-50 shadow w-full">
                    <h2 className="text-l font-bold mb-4 text-sky-600  text-center underline underline-offset-4">MENTORING SESSIONS SUMMARY</h2>
                    <ul className="list-none space-y-2 text-sm text-gray-700">
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Total Sessions:</strong>
                            <span className="text-gray-800 ml-1">{totalSessions}</span>
                        </li>
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Booked Sessions:</strong>
                            <span className="text-gray-800 ml-1">{bookedSessions}</span>
                        </li>
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Attended Sessions:</strong>
                            <span className="text-gray-800 ml-1">{attendedSessions}</span>
                        </li>
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Cancelled Sessions:</strong>
                            <span className="text-gray-800 ml-1">{cancelledSessions}</span>
                        </li>
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Upcoming Sessions:</strong>
                            <span className="text-gray-800 ml-1">{upcomingSessions}</span>
                        </li>
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Total Attended Hours:</strong>
                            <span className="text-gray-800 ml-1">{totalAttendedHours}</span>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <div className={`${showFullScreen ? "fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center p-6" : "p-4"} transition-all z-50`} style={{ maxHeight: showFullScreen ? '90vh' : 'auto' }}>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-center">Mentoring Sessions</h2>

                
                <div className="flex justify-end items-center space-x-4 mb-4">
                    <button className="bg-blue-500 text-white px-2 py-2 rounded flex items-center" onClick={downloadExcel} title="Download Excel">
                        <FaFileExcel className="mr-1" />
                    </button>
                    <button className="bg-green-500 text-white px-2 py-2 rounded flex items-center" onClick={downloadScreenshot} title="Download Screenshot">
                        <FaCamera className="mr-1" />
                    </button>
                    <div className="relative">
                        <button className={`bg-gray-300 text-black px-2 py-2 rounded flex items-center ${showFilters ? 'bg-gray-400' : ''}`} onClick={() => setShowFilters(prev => !prev)} title={showFilters ? 'Hide Filters' : 'Show Filters'}>
                            <FaFilter className="mr-1" />
                        </button>
                        {showFilters && (
                            <div className="absolute right-0 mt-2 border p-4 rounded bg-gray-100 shadow-lg z-10">
                                <h3 className="text-lg font-semibold mb-2">Filters</h3>
                                <label className="block mb-2">
                                    Status:
                                    <select name="status" onChange={handleFilterChange} className="ml-2 p-1">
                                        <option value="">All</option>
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </label>
                                <label className="block mb-2">
                                    Start Date:
                                    <input type="date" name="startDate" onChange={handleFilterChange} className="ml-2 p-1" />
                                </label>
                                <label className="block mb-2">
                                    End Date:
                                    <input type="date" name="endDate" onChange={handleFilterChange} className="ml-2 p-1" />
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                
                <div id="sessionsTable">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Session Date</th>
                                <th className="border border-gray-300 px-4 py-2">Start Time</th>
                                <th className="border border-gray-300 px-4 py-2">End Time</th>
                                <th className="border border-gray-300 px-4 py-2">Duration</th>
                                <th className="border border-gray-300 px-4 py-2">Session Type</th>
                                <th className="border border-gray-300 px-4 py-2">Topic</th>
                                <th className="border border-gray-300 px-4 py-2">Mentor Name</th>
                                <th className="border border-gray-300 px-4 py-2">Scheduler Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSessions.length > 0 ? (
                                filteredSessions.map((session, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="border border-gray-300 px-4 py-2">{session.session_date}</td>
                                        <td className="border border-gray-300 px-4 py-2">{session.start_time}</td>
                                        <td className="border border-gray-300 px-4 py-2">{session.end_time}</td>
                                        <td className="border border-gray-300 px-4 py-2">{session.duration}</td>
                                        <td className="border border-gray-300 px-4 py-2">{session.session_type}</td>
                                        <td className="border border-gray-300 px-4 py-2">{session.topic}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-blue-500 cursor-pointer" onClick={() => openMentorDetails(session.mentorDetails)}>
                                            {session.mentor_name}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">{session.scheduler_email}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="12" className="text-center py-4">
                                        {error || 'No mentoring session data available for this student.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            
            {selectedMentor && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                        <h3 className="text-lg font-bold mb-4">Mentor Details</h3>
                        <ul>
                            <li><strong>Mentor Name:</strong> {selectedMentor["mentor name"]}</li>
                            <li><strong>Mentor Email:</strong> {selectedMentor.mentor_email_id}</li>
                            <li><strong>Contact No.:</strong> {selectedMentor["mentor_contact_no."]}</li>
                        </ul>
                        <button onClick={closeMentorDetails} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentoringSessions;
