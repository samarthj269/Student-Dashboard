import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { FaFileExcel, FaCamera, FaFilter, FaTimes } from 'react-icons/fa';

const CommunicationDetails = ({ studentId, showFullScreen, showSummary }) => {
    const [communicationData, setCommunicationData] = useState([]);
    const [error, setError] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        callStatus: '',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        const fetchCommunicationData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/communication-details?studentId=${studentId}`);
                const data = await response.json();
                if (data.length) {
                    const filteredData = data.filter(comm => comm.Student_Id === studentId);
                    setCommunicationData(filteredData);
                    setError('');
                } else {
                    setError("No communication data found for this student.");
                }
            } catch (error) {
                setError("Failed to fetch data.");
            }
        };

        if (studentId) {
            fetchCommunicationData();
        } else {
            setCommunicationData([]);
            setError('');
        }
    }, [studentId]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const filteredCommunications = communicationData.filter(comm => {
        const matchesStatus = filters.callStatus ? comm["Call Status"] === filters.callStatus : true;
        const commDate = new Date(comm.Date);
        const matchesDateRange =
            (filters.startDate ? commDate >= new Date(filters.startDate) : true) &&
            (filters.endDate ? commDate <= new Date(filters.endDate) : true);
        return matchesStatus && matchesDateRange;
    });

    const downloadExcel = () => {
        const displayedData = filteredCommunications.map(comm => ({
            'Category': comm.communication_category,
            'Date': comm.Date,
            'From': comm.From,
            'Call Duration': comm["Call Duration"],
            'Call Status': comm["Call Status"],
            'Call Type': comm["Call Type"],
            'Domestic/International': comm["Domestic/International"],
            'Start Time': comm.Start_Time,
            'Call Details': comm.call_details,
            'Employee Name': comm.employee ? comm.employee.full_name : "N/A",
            'Employee Email': comm.employee ? comm.employee.email : "N/A",
            'Employee Phone': comm.employee ? comm.employee.phone : "N/A"
        }));

        const worksheet = XLSX.utils.json_to_sheet(displayedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Communications');
        XLSX.writeFile(workbook, 'filtered_communication_details.xlsx');
    };

    const downloadScreenshot = () => {
        const element = document.body;
        html2canvas(element).then((canvas) => {
            canvas.toBlob((blob) => {
                saveAs(blob, 'full_screen_communication_details.png');
            });
        });
    };

    if (showSummary) {
        const totalCommunications = communicationData.length;
        const completedCalls = communicationData.filter(comm => comm["Call Status"] === 'Completed').length;
        const missedCalls = communicationData.filter(comm => comm["Call Status"] === 'Missed').length;
    
        const lastCommunication = communicationData.reduce((latest, comm) => {
            const commDate = new Date(comm.Date);
            return commDate > latest ? commDate : latest;
        }, new Date(0));
    
        const lastConnectedBy = communicationData[communicationData.length - 1]?.employee?.full_name || 'N/A';
    
        const totalIssuesRaised = communicationData.filter(comm => comm.call_details).length;
        const activeIssues = communicationData.filter(comm => comm["Call Status"] === 'In Progress').length;
    
        return (
            <div className="p-4 flex justify-center">
                <div className="p-4 border rounded-lg bg-red-50 shadow w-full">
                    <h2 className="text-l font-bold mb-4 text-sky-600 text-center underline underline-offset-4">COMMUNICATION SUMMARY</h2>
                    <ul className="list-none space-y-2 text-sm text-gray-700">
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Total Communications:</strong>
                            <span className="text-gray-800 ml-1">{totalCommunications}</span>
                        </li>
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Completed Calls:</strong>
                            <span className="text-gray-800 ml-1">{completedCalls}</span>
                        </li>
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Missed Calls:</strong>
                            <span className="text-gray-800 ml-1">{missedCalls}</span>
                        </li>
                        {/* <li className="mb-1 text-sm"><strong>Last Communication Date & Time:</strong> {lastCommunication.toLocaleString()}</li> */}
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Last Connected By:</strong>
                            <span className="text-gray-800 ml-1">{lastConnectedBy}</span>
                        </li>
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Total Issues Raised to Support:</strong>
                            <span className="text-gray-800 ml-1">{totalIssuesRaised}</span>
                        </li>
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Active Issues:</strong>
                            <span className="text-gray-800 ml-1">{activeIssues}</span>
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
            <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl overflow-y-auto relative" id="communicationsContainer">
                <h2 className="text-xl font-bold mb-4 text-center">Communication Details</h2>

                {/* Filter button */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-4 ml-auto">
                        <button
                            className="bg-blue-500 text-white px-2 py-2 rounded flex items-center"
                            onClick={downloadExcel}
                            title="Download Excel"
                        >
                            <FaFileExcel className="mr-1" /> 
                        </button>
                        <button
                            className="bg-green-500 text-white px-2 py-2 rounded flex items-center"
                            onClick={downloadScreenshot}
                            title="Download Screenshot"
                        >
                            <FaCamera className="mr-1" /> 
                        </button>
                        <button
                            className={`bg-gray-300 text-black px-2 py-2 rounded flex items-center ${showFilters ? 'bg-gray-400' : ''}`}
                            onClick={() => setShowFilters(prev => !prev)}
                            title={showFilters ? 'Hide Filters' : 'Show Filters'}
                        >
                            <FaFilter className="mr-1" /> 
                        </button>
                    </div>
                </div>

               
                {showFilters && (
                    <div className="absolute top-14 right-0 bg-white shadow-lg p-4 rounded-md w-64 z-10">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">Filters</h3>
                            <button onClick={() => setShowFilters(false)} className="text-gray-500">
                                <FaTimes />
                            </button>
                        </div>
                        <label className="block mb-2">
                            Call Status:
                            <select name="callStatus" onChange={handleFilterChange} className="ml-2 p-1">
                                <option value="">All</option>
                                <option value="Completed">Completed</option>
                                <option value="Missed">Missed</option>
                                <option value="In Progress">In Progress</option>
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

                {/* Table of filtered data */}
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Category</th>
                                <th className="border border-gray-300 px-4 py-2">Date</th>
                                <th className="border border-gray-300 px-4 py-2">From</th>
                                <th className="border border-gray-300 px-4 py-2">Call Duration</th>
                                <th className="border border-gray-300 px-4 py-2">Call Status</th>
                                <th className="border border-gray-300 px-4 py-2">Call Type</th>
                                <th className="border border-gray-300 px-4 py-2">Domestic/International</th>
                                <th className="border border-gray-300 px-4 py-2">Start Time</th>
                                <th className="border border-gray-300 px-4 py-2">Call Details</th>
                                <th className="border border-gray-300 px-4 py-2">Employee Name</th>
                                <th className="border border-gray-300 px-4 py-2">Employee Email</th>
                                <th className="border border-gray-300 px-4 py-2">Employee Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCommunications.length > 0 ? (
                                filteredCommunications.map((comm, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="border border-gray-300 px-4 py-2">{comm.communication_category}</td>
                                        <td className="border border-gray-300 px-4 py-2">{comm.Date}</td>
                                        <td className="border border-gray-300 px-4 py-2">{comm.From}</td>
                                        <td className="border border-gray-300 px-4 py-2">{comm["Call Duration"]}</td>
                                        <td className="border border-gray-300 px-4 py-2">{comm["Call Status"]}</td>
                                        <td className="border border-gray-300 px-4 py-2">{comm["Call Type"]}</td>
                                        <td className="border border-gray-300 px-4 py-2">{comm["Domestic/International"]}</td>
                                        <td className="border border-gray-300 px-4 py-2">{comm.Start_Time}</td>
                                        <td className="border border-gray-300 px-4 py-2">{comm.call_details}</td>
                                        <td className="border border-gray-300 px-4 py-2">{comm.employee ? comm.employee.full_name : "N/A"}</td>
                                        <td className="border border-gray-300 px-4 py-2">{comm.employee ? comm.employee.email : "N/A"}</td>
                                        <td className="border border-gray-300 px-4 py-2">{comm.employee ? comm.employee.phone : "N/A"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="12" className="text-center py-4">
                                        {error || 'No communication data available for this student.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CommunicationDetails;
