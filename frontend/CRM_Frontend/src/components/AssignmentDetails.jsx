import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { FaFileExcel, FaCamera, FaFilter, FaTimes } from 'react-icons/fa';

const AssignmentDetails = ({ studentId, showFullScreen, showSummary }) => {
    const [assignmentData, setAssignmentData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        submissionStatus: '',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        const fetchAssignmentData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/assignment-details?studentId=${studentId}`);
                const data = await response.json();

                if (data.assignments && data.assignments.length) {
                    setAssignmentData(data.assignments);
                    setError('');
                } else {
                    setError("No assignment data found for this student.");
                }
            } catch (error) {
                setError("Failed to fetch data.");
            } finally {
                setLoading(false);
            }
        };

        if (studentId && studentId.length === 3) {
            fetchAssignmentData();
        } else {
            setAssignmentData([]);
            setError('');
        }
    }, [studentId]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const filteredAssignments = assignmentData.filter(assignment => {
        const matchesStatus = filters.submissionStatus ? assignment["Submit(Y/N)"] === filters.submissionStatus : true;
        const assignmentDate = new Date(assignment["Date of submission"]);
        const matchesDateRange = (filters.startDate ? assignmentDate >= new Date(filters.startDate) : true) &&
                                 (filters.endDate ? assignmentDate <= new Date(filters.endDate) : true);
        return matchesStatus && matchesDateRange;
    });

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredAssignments);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Assignments');
        XLSX.writeFile(workbook, 'assignment_details.xlsx');
    };

    const downloadScreenshot = () => {
        const element = document.body;
        html2canvas(element).then((canvas) => {
            canvas.toBlob((blob) => {
                saveAs(blob, 'assignment_details_screenshot.png');
            });
        });
    };

    
    const totalAssignments = assignmentData.length;
    const completedAssignments = assignmentData.filter(assignment => assignment["Submit(Y/N)"] === 'Y').length;
    const pendingAssignments = assignmentData.filter(assignment => assignment["Submit(Y/N)"] === 'N').length;
    const upcomingAssignments = assignmentData.filter(assignment => new Date(assignment["Date of submission"]) > new Date()).length;
    const totalScore = assignmentData.reduce((sum, assignment) => {
        return sum + (assignment["Submit(Y/N)"] === 'Y' ? (parseFloat(assignment.Result) || 0) : 0);
    }, 0);

    if (showSummary) {
        return (
            <div className="p-4 flex justify-center">
                <div className="p-4 border rounded-lg bg-red-50  shadow w-full">
                    <h2 className="text-l font-bold mb-4 text-sky-600 underline text-center underline-offset-4">ASSIGNMENT SUMMARY</h2>
                    <ul className="list-none space-y-2 text-sm text-gray-700">
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Total Assignments:</strong> 
                            <span className="text-gray-800 ml-1">{totalAssignments}</span>
                        </li>
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Completed Assignments:</strong> 
                            <span className="text-gray-800 ml-1">{completedAssignments}</span>
                        </li>
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Pending Assignments:</strong> 
                            <span className="text-gray-800 ml-1">{pendingAssignments}</span>
                        </li>
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Upcoming Assignments:</strong> 
                            <span className="text-gray-800 ml-1">{upcomingAssignments}</span>
                        </li>
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Total Score:</strong> 
                            <span className="text-gray-800 ml-1">{totalScore}</span>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`${showFullScreen ? "fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center p-6" : "p-4"} transition-all z-50`}
            style={{ maxHeight: showFullScreen ? '90vh' : 'auto' }}
        >
            <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-center">Assignment Details</h2>
                
                
                <div className="flex justify-end mb-4 space-x-2">
                <button
                        className="bg-blue-500 text-white p-3 rounded flex items-center"
                        onClick={downloadExcel}
                        title="Download Excel"
                    >
                        <FaFileExcel />
                    </button>
                    <button
                        className="bg-green-500 text-white p-3 rounded flex items-center"
                        onClick={downloadScreenshot}
                        title="Download Screenshot"
                    >
                        <FaCamera />
                    </button>
                    <button
                        className={`bg-gray-300 text-black p-3 rounded flex items-center ${showFilters ? 'bg-gray-400' : ''}`}
                        onClick={() => setShowFilters(prev => !prev)}
                        title={showFilters ? 'Hide Filters' : 'Show Filters'}
                    >
                        <FaFilter />
                    </button>
                </div>

                
                {showFilters && (
                    <div className="mb-4 border p-4 rounded bg-gray-100">
                        <h3 className="text-lg font-semibold mb-2">Filters</h3>
                        <label className="block mb-2">
                            Submission Status:
                            <select name="submissionStatus" onChange={handleFilterChange} className="ml-2 p-1">
                                <option value="">All</option>
                                <option value="Y">Submitted</option>
                                <option value="N">Not Submitted</option>
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

                
                {loading ? (
                    <p className="text-center py-4">Loading...</p>
                ) : (
                    <div id="assignmentsTable">
                        <table className="min-w-full border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Assignment Name</th>
                                    <th className="border border-gray-300 px-4 py-2">Assignment Code</th>
                                    <th className="border border-gray-300 px-4 py-2">Due Date</th>
                                    <th className="border border-gray-300 px-4 py-2">Submission Status</th>
                                    <th className="border border-gray-300 px-4 py-2">Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAssignments.length > 0 ? (
                                    filteredAssignments.map((assignment) => (
                                        <tr key={assignment.assignment_id} className="hover:bg-gray-100">
                                            <td className="border border-gray-300 px-4 py-2">{assignment["Assignment Name"]}</td>
                                            <td className="border border-gray-300 px-4 py-2">{assignment["Assignment Code"]}</td>
                                            <td className="border border-gray-300 px-4 py-2">{assignment["Date of submission"]}</td>
                                            <td className="border border-gray-300 px-4 py-2">{assignment["Submit(Y/N)"] === "Y" ? "Submitted" : "Not Submitted"}</td>
                                            <td className="border border-gray-300 px-4 py-2">{assignment.Result || "N/A"}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
                                            {error || 'No assignment data available for this student.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignmentDetails;


