import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { FaFileExcel, FaCamera, FaFilter, FaTimes } from 'react-icons/fa';

const CourseDetails = ({ studentId, showFullScreen, showSummary }) => {
    const [courseData, setCourseData] = useState([]);
    const [error, setError] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        startDate: '',
        endDate: '',
        enrollmentCode: '',
        brand: '',
        batch: ''
    });

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/course-details?studentId=${studentId}`);
                const data = await response.json();
                if (data.length) {
                    setCourseData(data);
                    setError('');
                } else {
                    setError("No course data found for this student.");
                }
            } catch (error) {
                console.error("Fetch Error:", error);
                setError("Failed to fetch data.");
            }
        };

        if (studentId && studentId.length === 3) {
            fetchCourseData();
        } else {
            setCourseData([]);
            setError('');
        }
    }, [studentId]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
        if (name === "brand") setSelectedBrand(null); 
    };

    const handleBrandClick = (brand) => {
        setSelectedBrand({
            brand_id: brand.brand_id,
            brand: brand.brand || 'LawSikho',
            domain: brand.domain || 'Legal Education and Professional Training',
            url: brand.url || 'https://lawsikho.com/'
        });
    };

    const filteredCourses = courseData.filter(course => {
        const matchesStatus = filters.status ? course.status === filters.status : true;
        const matchesEnrollmentCode = filters.enrollmentCode ? course.Enrollment_Code.includes(filters.enrollmentCode) : true;
        const matchesBrand = filters.brand ? course.courses[0]?.brand === filters.brand : true;
        const matchesBatch = filters.batch ? course.batch?.Batch === filters.batch : true;
        
        const enrollmentDate = new Date(course.enrollment_date);
        const matchesDateRange = (filters.startDate ? enrollmentDate >= new Date(filters.startDate) : true) &&
                                  (filters.endDate ? enrollmentDate <= new Date(filters.endDate) : true);
        return matchesStatus && matchesEnrollmentCode && matchesBrand && matchesBatch && matchesDateRange;
    });

    // Calculate summary data
    const totalCourses = filteredCourses.length;
    const completedCourses = filteredCourses.filter(course => course.status?.toLowerCase() === 'completed').length;
    const ongoingCourses = filteredCourses.filter(course => course.status?.toLowerCase() === 'continue').length;
    const droppedCourses = filteredCourses.filter(course => course.status?.toLowerCase() === 'pause').length;
    const yetToStartCourses = filteredCourses.filter(course => course.status?.toLowerCase() === 'yet to start').length;

    // Excel download based on filtered data
    const downloadExcel = () => {
        const tableData = filteredCourses.map(course => ({
            'Course Name': course.courses[0]?.Courses || 'N/A',
            'Duration': course.courses[0]?.["Course Duration"] || 'N/A',
            'Fee': course.courses[0]?.Fee || 'N/A',
            'Batch': course.batch?.Batch || 'N/A',
            'Status': course.status,
            'Brand': course.courses[0]?.brand || 'LawSikho',
            'Enrollment Code': course.Enrollment_Code
        }));
        const worksheet = XLSX.utils.json_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Courses');
        XLSX.writeFile(workbook, 'course_details.xlsx');
    };

    // Screenshot download
    const downloadScreenshot = () => {
        const element = document.body;
        html2canvas(element).then((canvas) => {
            canvas.toBlob((blob) => {
                saveAs(blob, 'course_details_screenshot.png');
            });
        });
    };

    // If showSummary is true, display the summary
    if (showSummary) {
        return (
            <div className="p-4 border rounded-lg bg-red-50 shadow w-full mb-6 min-h-[270px]">
                <h2 className="text-l font-bold text-sky-600 mb-4 text-center underline underline-offset-4">COURSE SUMMARY</h2>
                <ul className="list-none space-y-2 text-sm text-gray-700">
                    <li><strong className="text-blue-600">Total Courses:</strong> <span className="text-gray-800">{totalCourses}</span></li>
                    <li><strong className="text-blue-600">Completed Courses:</strong> <span className="text-gray-800">{completedCourses}</span></li>
                    <li><strong className="text-blue-600">Ongoing Courses:</strong> <span className="text-gray-800">{ongoingCourses}</span></li>
                    <li><strong className="text-blue-600">Dropped Courses:</strong> <span className="text-gray-800">{droppedCourses}</span></li>
                    <li><strong className="text-blue-600">Yet to Start:</strong> <span className="text-gray-800">{yetToStartCourses}</span></li>
                </ul>
            </div>
        );
    }
    

    return (
        <div
            className={`${showFullScreen ? "fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center p-6" : "p-4"} transition-all z-50`}
            style={{ maxHeight: showFullScreen ? '90vh' : 'auto' }}
        >
            <div className=" rounded-lg shadow-lg w-full max-w-5xl overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-center">Course Details</h2>

                {/* Action Buttons */}
                <div className="flex justify-end mb-4 space-x-2">
                    <button className="bg-blue-500 text-white p-3 rounded flex items-center" onClick={downloadExcel} title="Download Excel">
                        <FaFileExcel />
                    </button>
                    <button className="bg-green-500 text-white p-3 rounded flex items-center" onClick={downloadScreenshot} title="Download Screenshot">
                        <FaCamera />
                    </button>
                    <button className={`bg-gray-300 text-black p-3 rounded flex items-center ${showFilters ? 'bg-gray-400' : ''}`} onClick={() => setShowFilters(prev => !prev)} title={showFilters ? 'Hide Filters' : 'Show Filters'}>
                        <FaFilter />
                    </button>
                </div>

                {/* Filter UI */}
                {showFilters && (
                    <div className="bg-white shadow-lg p-4 border rounded mb-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Filters</h3>
                            <button onClick={() => setShowFilters(false)} className="text-gray-600 hover:text-gray-900">
                                <FaTimes />
                            </button>
                        </div>
                        {/* Additional filters */}
                        <label className="block mb-2">Status:
                            <select name="status" onChange={handleFilterChange} className="ml-2 p-1">
                                <option value="">All</option>
                                <option value="completed">completed</option>
                                <option value="continue">continue</option>
                                <option value="stopped">stopped</option>
                                <option value="yet to start">yet to start</option>
                            </select>
                        </label>
                        <label className="block mb-2">Enrollment Code:
                            <input type="text" name="enrollmentCode" onChange={handleFilterChange} placeholder="Enter Enrollment Code" className="ml-2 p-1 border rounded" />
                        </label>
                        <label className="block mb-2">Brand:
                            <select name="brand" onChange={handleFilterChange} className="ml-2 p-1">
                                <option value="">All</option>
                                <option value="LawSikho">LawSikho</option>
                                {/* Add other brand options if there are more */}
                            </select>
                        </label>
                        <label className="block mb-2">Batch:
                            <select name="batch" onChange={handleFilterChange} className="ml-2 p-1">
                                <option value="">All</option>
                                <option value="Jan, 2023">Jan, 2023</option>
                                <option value="Apr, 2023">Apr, 2023</option>
                                <option value="Jun, 2023">Jun, 2023</option>
                                {/* Add other batch options if there are more */}
                            </select>
                        </label>
                        <label className="block mb-2">Date Range:
                            <input type="date" name="startDate" onChange={handleFilterChange} className="ml-2 p-1 border rounded" />
                            <input type="date" name="endDate" onChange={handleFilterChange} className="ml-2 p-1 border rounded" />
                        </label>
                    </div>
                )}

                {/* Error Message */}
                {error && <p className="text-red-600">{error}</p>}

                {/* Course Table */}
                <div className="table-responsive">
                    <table className="table-auto w-full border-collapse border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Course Name</th>
                                <th className="border p-2">Duration</th>
                                <th className="border p-2">Fee</th>
                                <th className="border p-2">Batch</th>
                                <th className="border p-2">Status</th>
                                <th className="border p-2">Brand</th>
                                <th className="border p-2">Enrollment Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.map((course, index) => (
                                <tr key={index} className="text-center">
                                    <td className="border p-2">{course.courses[0]?.Courses || 'N/A'}</td>
                                    <td className="border p-2">{course.courses[0]?.["Course Duration"] || 'N/A'}</td>
                                    <td className="border p-2">{course.courses[0]?.Fee || 'N/A'}</td>
                                    <td className="border p-2">{course.batch?.Batch || 'N/A'}</td>
                                    <td className="border p-2">{course.status || 'N/A'}</td>
                                    <td className="border p-2 cursor-pointer" onClick={() => handleBrandClick(course)}>
                                        {course.courses[0]?.brand || 'LawSikho'}
                                    </td>
                                    <td className="border p-2">{course.Enrollment_Code || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Selected Brand Details Overlay */}
                {selectedBrand && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                            <button onClick={() => setSelectedBrand(null)} className="text-gray-600 hover:text-gray-900 absolute top-3 right-3">
                                <FaTimes />
                            </button>
                            <h3 className="text-lg font-semibold mb-2">Brand Details</h3>
                            <p><strong>Brand:</strong> {selectedBrand.brand}</p>
                            <p><strong>Domain:</strong> {selectedBrand.domain}</p>
                            <p><strong>Website:</strong> <a href={selectedBrand.url} target="_blank" className="text-blue-500">{selectedBrand.url}</a></p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseDetails;
