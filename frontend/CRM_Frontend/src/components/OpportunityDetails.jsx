import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { FaFileExcel, FaCamera, FaFilter } from 'react-icons/fa';

const OpportunityDetails = ({ studentId, showFullScreen, showSummary }) => {
    const [opportunityData, setOpportunityData] = useState([]);
    const [error, setError] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        offerStatus: '',
        type: ''
    });
    const [showCompanyModal, setShowCompanyModal] = useState(false);
    const [selectedCompanyDetails, setSelectedCompanyDetails] = useState(null);
    const [showJDModal, setShowJDModal] = useState(false);
    const [selectedJDDetails, setSelectedJDDetails] = useState(null);

    useEffect(() => {
        const fetchOpportunityData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/opportunity-details?studentId=${studentId}`);
                const opportunities = await response.json();

                if (opportunities.length) {
                    const enrichedOpportunities = opportunities.map(opp => ({
                        opportunity_id: opp.opportunity_id,
                        opportunity_name: opp.opportunity_name || "N/A",
                        position: opp.Position || "N/A",
                        offer_status: opp["Offer status"] || "N/A",
                        applied: opp.Applied === "Y" ? "Y" : "N",
                        shortlisted: opp.Shortlisted === "Y" ? "Y" : "N",
                        success: opp.Sucess === "Y" ? "Y" : "N",
                        type: opp.Type || "N/A",
                        month_of_joining: opp["Month Of Joining"] || "N/A",
                        month_of_success: opp["Month of Sucess"] || "N/A",
                        legal_status: opp["Legal/Non Legal"] || "N/A",
                        job_description: opp.jobDescription?.["Job Description"] || "N/A",
                        company_name: opp.companyDetails?.company_name || "N/A",
                        ctc: opp.jobDescription?.["Stipend/Salary(Annually)"] || "N/A",
                        contact_number: opp.companyDetails?.contact_number || "N/A",
                        email: opp.companyDetails?.["email id"] || "N/A",
                        company_details: opp.companyDetails,
                        jd_details: opp.jobDescription,
                    }));

                    setOpportunityData(enrichedOpportunities);
                    setError('');
                } else {
                    setError("No opportunity data found for this student.");
                }
            } catch (error) {
                setError("Failed to fetch data.");
            }
        };

        if (studentId && studentId.length === 3) {
            fetchOpportunityData();
        } else {
            setOpportunityData([]);
            setError('');
        }
    }, [studentId]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const filteredOpportunities = opportunityData.filter(opp => {
        const matchesStatus = filters.offerStatus ? opp.offer_status === filters.offerStatus : true;
        const matchesType = filters.type ? opp.type === filters.type : true;
        return matchesStatus && matchesType;
    });

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredOpportunities);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Opportunities');
        XLSX.writeFile(workbook, 'opportunity_details.xlsx');
    };

    const downloadScreenshot = () => {
        const element = document.body; // Screenshot of entire body
        html2canvas(element).then((canvas) => {
            canvas.toBlob((blob) => {
                saveAs(blob, 'course_details_screenshot.png');
            });
        });
    };
    const openCompanyModal = (companyDetails) => {
        const jdCount = opportunityData.filter(
            (opp) => opp.company_details?.company_id === companyDetails.company_id
        ).length;
    
        setSelectedCompanyDetails({ ...companyDetails, total_jd_count: jdCount });
        setShowCompanyModal(true);
    };
    
    const closeCompanyModal = () => {
        setSelectedCompanyDetails(null);
        setShowCompanyModal(false);
    };
    
    const openJDModal = (jdDetails, companyName, opportunityName) => {
        setSelectedJDDetails({ ...jdDetails, company_name: companyName, opportunity_name: opportunityName });
        setShowJDModal(true);
    };

    const closeJDModal = () => {
        setSelectedJDDetails(null);
        setShowJDModal(false);
    };
    if (showSummary) {
        const totalApplied = opportunityData.filter(opp => opp.applied === "Y").length;
        const totalShortlisted = opportunityData.filter(opp => opp.shortlisted === "Y").length;
        const totalSuccess = opportunityData.filter(opp => opp.success === "Y").length;
        const totalAccepted = opportunityData.filter(opp => opp.offer_status === "Accepted").length;
        const heldOpportunity = opportunityData.find(opp => opp.applied === "Y" && opp.shortlisted === "Y" && opp.success === "Y" && opp.offer_status === "Accepted");
        const heldOpportunityName = heldOpportunity ? heldOpportunity.opportunity_name : 'N/A';
    
        return (
            <div className="p-4 flex justify-center">
                <div className="p-4 border rounded-lg bg-red-50 shadow w-full">
                    <h2 className="text-l font-bold mb-4 text-sky-600  text-center underline underline-offset-4">OPPORTUNITY SUMMARY</h2>
                    <ul className="list-none space-y-2 text-sm text-gray-700">
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Total Applied:</strong>
                            <span className="text-gray-800 ml-1">{totalApplied}</span>
                        </li>
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Total Shortlisted:</strong>
                            <span className="text-gray-800 ml-1">{totalShortlisted}</span>
                        </li>
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Total Success:</strong>
                            <span className="text-gray-800 ml-1">{totalSuccess}</span>
                        </li>
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Total Accepted:</strong>
                            <span className="text-gray-800 ml-1">{totalAccepted}</span>
                        </li>
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Currently Held Opportunity Name:</strong>
                            <span className="text-gray-800 ml-1">{heldOpportunityName}</span>
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
                <h2 className="text-xl font-bold mb-4 text-center">Opportunity Details</h2>
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
                            Offer Status:
                            <select name="offerStatus" onChange={handleFilterChange} className="ml-2 p-1">
                                <option value="">All</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Not shortlisted">Not shortlisted</option>
                                <option value="Not Selected">Not Selected</option>
                                
                            </select>
                        </label>
                        <label className="block mb-2">
                            Type:
                            <select name="type" onChange={handleFilterChange} className="ml-2 p-1">
                                <option value="">All</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </label>
                    </div>
                )}
                <table className="w-full text-center" id="opportunitiesTable">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Opportunity Name</th>
                            <th className="px-4 py-2">Applied</th>
                            <th className="px-4 py-2">Shortlisted</th>
                            <th className="px-4 py-2">Success</th>
                            <th className="px-4 py-2">Offer Status</th>
                            <th className="px-4 py-2">Job Description</th>
                            <th className="px-4 py-2">Company Name</th>
                            <th className="px-4 py-2">Month of Joining</th>
                            <th className="px-4 py-2">Month of Success</th>
                            <th className="px-4 py-2">Legal Status</th>
                        </tr>
                    </thead>
                    <tbody>
    {filteredOpportunities.map((opp) => (
        <tr key={opp.opportunity_id}>
            <td className="px-4 py-2">{opp.opportunity_name}</td>
            <td className="px-4 py-2">{opp.applied}</td>
            <td className="px-4 py-2">{opp.shortlisted}</td>
            <td className="px-4 py-2">{opp.success}</td>
            <td className="px-4 py-2">{opp.offer_status}</td>
            <td className="px-4 py-2">
                <button
                    onClick={() => openJDModal(opp.jd_details, opp.company_name, opp.opportunity_name)}
                    className="text-blue-500 underline"
                >
                    {opp.job_description}
                </button>
            </td>
            <td className="px-4 py-2">
                <button
                    onClick={() => openCompanyModal(opp.company_details)}
                    className="text-blue-500 underline"
                >
                    {opp.company_name}
                </button>
            </td>
            <td className="px-4 py-2">{opp.month_of_joining}</td>
            <td className="px-4 py-2">{opp.month_of_success}</td>
            <td className="px-4 py-2">{opp.legal_status}</td>
        </tr>
    ))}
</tbody>
                </table>
            </div>
            {showCompanyModal && selectedCompanyDetails && (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h3 className="text-xl font-semibold mb-4">{selectedCompanyDetails.company_name}</h3>
            {/* Other company details */}
            <p><strong>Type:</strong> {selectedCompanyDetails.type_of_company}</p>
            <p><strong>Organization Category:</strong> {selectedCompanyDetails["Organisation Category"]}</p>
            <p><strong>SPOC:</strong> {selectedCompanyDetails.spoc}</p>
            <p><strong>Contact Number:</strong> {selectedCompanyDetails.contact_number}</p>
            <p><strong>Email:</strong> {selectedCompanyDetails.email_id || "Not available"}</p>
            {/* <p><strong>Total JDs Assigned:</strong> {selectedCompanyDetails.total_jd_count}</p> */}
            <button
                onClick={closeCompanyModal}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
                Close
            </button>
        </div>
    </div>
)}
            {showJDModal && selectedJDDetails && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Job Description Details</h3>
                        {/* <p><strong>JD ID:</strong> {selectedJDDetails.jd_id}</p> */}
                        <p><strong>Opportunity Name:</strong> {selectedJDDetails.opportunity_name}</p>
                        <p><strong>Description:</strong> {selectedJDDetails["Job Description"]}</p>
                        <p><strong>Company Name:</strong> {selectedJDDetails.company_name}</p>
                        
                        <p><strong>Stipend/Salary (Annually):</strong> {selectedJDDetails["Stipend/Salary(Annually)"]}</p>
                        <p><strong>Number of Positions:</strong> {selectedJDDetails.number_of_position}</p>
                        {/* <p><strong>Company ID:</strong> {selectedJDDetails.company_id}</p> */}
                        <p><strong>Outreach Person:</strong> {selectedJDDetails.outreach_person_name}</p>
                        <button
                            onClick={closeJDModal}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OpportunityDetails;







