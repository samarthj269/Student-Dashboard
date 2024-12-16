import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { FaFileExcel, FaCamera, FaFilter } from 'react-icons/fa';

const EarningDetails = ({ studentId, showFullScreen, showSummary }) => {
    const [earningData, setEarningData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        paymentStatus: '',
        earningType: ''
    });
    useEffect(() => {
        const fetchEarningData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/earning?studentId=${studentId}`);
                const earnings = await response.json();
                console.log('Raw earnings data:', earnings); 
    
                if (earnings && earnings.length) {
                    const enrichedEarnings = earnings.map(earning => {
                        
                        const earningDetails = earning.earnings || {};
    
                        return {
                            earning_id: earningDetails.earning_id || 'N/A',
                            opportunity_id: earningDetails.opportunity_id || 'N/A',
                            opportunity_name: earning.opportunity_name || 'Not Available',
                            stipend_paid: earningDetails["Stipend(P/U)"] || 'Not Available',
                            salary_amount: earningDetails["Stipend/Salary Amount"] ? `${earningDetails["Stipend/Salary Amount"]}` : '$N/A',
                            conditional_payment: earningDetails["Stipend(Conditional)Payment"] || 'N/A',
                            total_earning: earningDetails["Total_Earning"] ? `${earningDetails["Total_Earning"]}` : '$N/A',
                        };
                    });
    
                    setEarningData(enrichedEarnings);
                    setError('');
                } else {
                    setError("No earning data found for this student.");
                }
            } catch (error) {
                setError("Failed to fetch data.");
            } finally {
                setLoading(false);
            }
        };
    
        if (studentId && studentId.length === 3) {
            fetchEarningData();
        } else {
            setEarningData([]);
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

    const filteredEarnings = earningData.filter(earning => {
        const matchesStatus = filters.paymentStatus ? earning.payment_status === filters.paymentStatus : true;
        const matchesType = filters.earningType ? earning.earning_type === filters.earningType : true;
        return matchesStatus && matchesType;
    });

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredEarnings);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Earnings');
        XLSX.writeFile(workbook, 'earning_details.xlsx');
    };

    const downloadScreenshot = () => {
        const element = document.body; // Screenshot of entire body
        html2canvas(element).then((canvas) => {
            canvas.toBlob((blob) => {
                saveAs(blob, 'earning_details_screenshot.png');
            });
        });
    };

    // Summary Calculations
    const totalEarnings = earningData.reduce((sum, earning) => sum + (parseFloat(earning.salary_amount.replace('$', '').trim()) || 0), 0);

    if (showSummary) {
        return (
            <div className="p-4 flex justify-center">
                <div className="p-4 border rounded-lg bg-red-50 shadow w-full min-h-[206px]">
                    <h2 className="text-l font-bold mb-4 text-sky-600 text-center underline underline-offset-4">EARNING SUMMARY</h2>
                    <ul className="list-none space-y-2 text-sm text-gray-700">
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Total Earnings:</strong>
                            <span className="text-gray-800 ml-1">{totalEarnings.toFixed(2)}</span>
                        </li>
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Total Records:</strong>
                            <span className="text-gray-800 ml-1">{earningData.length}</span>
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
                <h2 className="text-xl font-bold mb-4 text-center">Earning Details</h2>
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
                            Payment Status:
                            <select name="paymentStatus" onChange={handleFilterChange} className="ml-2 p-1">
                                <option value="">All</option>
                                <option value="paid">paid</option>
                                <option value="pending">pending</option>
                                <option value="Failed">Failed</option>
                            </select>
                        </label>
                        <label className="block mb-2">
                            Earning Type:
                            <select name="earningType" onChange={handleFilterChange} className="ml-2 p-1">
                                <option value="">All</option>
                                <option value="Scholarship">Scholarship</option>
                                <option value="Internship ">Internship</option>
                                <option value="Job Salary">Job Salary</option>
                            </select>
                        </label>
                    </div>
                )}
                {loading ? (
                    <p className="text-center py-4">Loading...</p>
                ) : (
                    <div id="earningsTable">
                        <table className="w-full text-center">
                            <thead>
                                <tr>
                                    {/* <th className="px-4 py-2">Earning ID</th> */}
                                    {/* <th className="px-4 py-2">Opportunity ID</th> */}
                                    <th className="px-4 py-2">Opportunity Name</th>
                                    <th className="px-4 py-2">Stipend Paid</th>
                                    <th className="px-4 py-2">Stipend/Salary Amount</th>
                                    <th className="px-4 py-2">Conditional Payment</th>
                                    <th className="px-4 py-2">Total Earning</th>
                                </tr>
                            </thead>
                            <tbody>
    {filteredEarnings.length > 0 ? (
        filteredEarnings.map((earning) => (
            <tr key={earning.earning_id}>
                {/* <td className="px-4 py-2">{earning.earning_id}</td> */}
                {/* <td className="px-4 py-2">{earning.opportunity_id}</td> */}
                <td className="px-4 py-2">{earning.opportunity_name}</td>
                <td className="px-4 py-2">{earning.stipend_paid}</td>
                <td className="px-4 py-2">{earning.salary_amount}</td>
                <td className="px-4 py-2">{earning.conditional_payment}</td>
                <td className="px-4 py-2">{earning.total_earning}</td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="7" className="text-center py-4">
                {error || 'No earning data available for this student.'}
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

export default EarningDetails;