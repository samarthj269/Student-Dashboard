import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { FaFileExcel, FaCamera, FaFilter } from 'react-icons/fa';

const PaymentDetails = ({ studentId, showFullScreen, showSummary }) => {
    const [paymentData, setPaymentData] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        paymentStatus: '',
        partnerName: '',
    });

    useEffect(() => {
        const fetchPaymentData = async () => {
            if (!studentId) {
                setError('Student ID is missing.');
                setLoading(false);
                return;
            }
        
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/payment-details?studentId=${studentId}`);
                const data = await response.json();
        
                const cleanedData = data.map(payment => ({
                    ...payment,
                    stipend: {
                        ...payment.stipend,
                        loan_amount: payment.stipend['loan_amount '] || 'N/A',
                        loan_tenure: payment.stipend['loan_tennure(months)'] || 'N/A',
                    },
                    loanPartner: {
                        ...payment.loanPartner,
                        contact_no: payment.loanPartner['contact. no.'] || 'N/A',
                        partner_id: payment.loanPartner.partner_id || 'N/A',
                        partner_name: payment.loanPartner.partner_name || 'N/A',
                        email_id: payment.loanPartner.email_id || 'N/A'
                    },
                    courseFee: {
                        ...payment.courseFee,
                        fee: payment.courseFee.fee || 'N/A',
                    },
                    courseName: payment.courseName || 'N/A'
                }));
        
                setPaymentData(cleanedData);
                setError('');
            } catch (error) {
                setError("Failed to fetch payment data.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchPaymentData();
    }, [studentId]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const filteredPayments = paymentData.filter(payment => {
        const matchesStatus = filters.paymentStatus ? payment.stipend.status === filters.paymentStatus : true;
        const matchesPartner = filters.partnerName ? payment.loanPartner.partner_name === filters.partnerName : true;
        return matchesStatus && matchesPartner;
    });

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredPayments);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments');
        XLSX.writeFile(workbook, 'filtered_payment_details.xlsx');
    };

    const downloadScreenshot = () => {
        html2canvas(document.body).then((canvas) => {
            canvas.toBlob((blob) => {
                saveAs(blob, 'payment_details_screenshot.png');
            });
        });
    };

    const handlePartnerClick = (partner) => {
        setSelectedPartner(partner);
    };

    const closePartnerPanel = () => {
        setSelectedPartner(null);
    };

    if (showSummary) {
        const totalPaid = paymentData.reduce((sum, payment) => sum + (parseFloat(payment.stipend?.loan_amount) || 0), 0);
        const pendingAmount = paymentData.reduce((sum, payment) => sum + (parseFloat(payment.stipend?.emi) || 0), 0);
        const loanAmount = paymentData.reduce((sum, payment) => sum + (parseFloat(payment.stipend?.loan_amount) || 0), 0);
        const loanPartner = paymentData[0]?.loanPartner?.partner_name || 'N/A';
        const refundAmount = paymentData.reduce((sum, payment) => sum + (parseFloat(payment.Refund_Amount) || 0), 0);

        return (
            <div className="p-4 flex justify-center">
                <div className="p-4 border rounded-lg bg-red-50 shadow w-full">
                    <h2 className="text-l font-bold mb-4 text-sky-600  text-center underline underline-offset-4">COURSE PAYMENT SUMMARY</h2>
                    <ul className="list-none space-y-2 text-sm text-gray-700">
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Total Payment Paid:</strong>
                            <span className="text-gray-800 ml-1">${totalPaid.toFixed(2)}</span>
                        </li>
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Pending Amount:</strong>
                            <span className="text-gray-800 ml-1">${pendingAmount.toFixed(2)}</span>
                        </li>
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Loan Amount:</strong>
                            <span className="text-gray-800 ml-1">${loanAmount.toFixed(2)}</span>
                        </li>
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Loan Partner:</strong>
                            <span className="text-gray-800 ml-1">{loanPartner}</span>
                        </li>
                        <li className="mb-1 text-sm">
                            <strong className="text-blue-600">Refund Amount:</strong>
                            <span className="text-gray-800 ml-1">${refundAmount.toFixed(2)}</span>
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
                <h2 className="text-xl font-bold mb-4 text-center">COURSE PAYMENT</h2>
                
                <div className="flex justify-end items-center space-x-4 mb-4">
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
                    <div className="relative">
                        <button
                            className={`bg-gray-300 text-black px-2 py-2 rounded flex items-center ${showFilters ? 'bg-gray-400' : ''}`}
                            onClick={() => setShowFilters((prev) => !prev)}
                            title={showFilters ? 'Hide Filters' : 'Show Filters'}
                        >
                            <FaFilter className="mr-1" />
                        </button>
                        {showFilters && (
                            <div className="absolute right-0 mt-2 border p-4 rounded bg-gray-100 shadow-lg z-10">
                                <h3 className="text-lg font-semibold mb-2">Filters</h3>
                                <label className="block mb-2">
                                    Payment Status:
                                    <select name="paymentStatus" onChange={handleFilterChange} className="ml-2 p-1">
                                        <option value="">All</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Failed">Failed</option>
                                    </select>
                                </label>
                                <label className="block mb-2">
                                    Partner Name:
                                    <input
                                        type="text"
                                        name="partnerName"
                                        onChange={handleFilterChange}
                                        className="ml-2 p-1"
                                    />
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {error && <div className="text-red-500 text-center">{error}</div>}
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2">Course Name</th>
                                <th className="border px-4 py-2">Course Fee</th>
                                <th className="border px-4 py-2">Loan Amount</th>
                                <th className="border px-4 py-2">Loan Tenure (Months)</th>
                                <th className="border px-4 py-2">EMI</th>
                                <th className="border px-4 py-2">GST</th>
                                <th className="border px-4 py-2">Status</th>
                                <th className="border px-4 py-2">Partner Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map((payment, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2">{payment.courseName}</td>
                                    <td className="border px-4 py-2">{payment.courseFee?.fee}</td>
                                    <td className="border px-4 py-2">{payment.stipend?.loan_amount}</td>
                                    <td className="border px-4 py-2">{payment.stipend?.loan_tenure}</td>
                                    <td className="border px-4 py-2">{payment.stipend?.emi}</td>
                                    <td className="border px-4 py-2">{payment.stipend?.gst}</td>
                                    <td className="border px-4 py-2">{payment.stipend?.status}</td>
                                    <td 
                                        className="border px-4 py-2 text-blue-600 cursor-pointer" 
                                        onClick={() => handlePartnerClick(payment.loanPartner)}
                                    >
                                        {payment.loanPartner?.partner_name}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            {selectedPartner && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center p-6 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md text-center">
                        <h3 className="text-lg font-bold mb-2">{selectedPartner.partner_name}</h3>
                        <p><strong>Partner ID:</strong> {selectedPartner.partner_id}</p>
                        <p><strong>Contact Number:</strong> {selectedPartner.contact_no}</p>
                        <p><strong>Email:</strong> {selectedPartner.email_id}</p>
                        <button onClick={closePartnerPanel} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentDetails;