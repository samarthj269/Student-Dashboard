import React, { useState } from 'react';
import axios from 'axios';

const AddStudentForm = () => {
  const [studentData, setStudentData] = useState({ name: '', email: '', course: '' });

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/students', studentData);
      alert('Student added successfully!');
      setStudentData({ name: '', email: '', course: '' });
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h2 className="text-xl font-bold mb-2">Add Student</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={studentData.name}
        onChange={handleChange}
        className="p-2 border border-gray-400 rounded mb-2 w-full"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={studentData.email}
        onChange={handleChange}
        className="p-2 border border-gray-400 rounded mb-2 w-full"
      />
      <input
        type="text"
        name="course"
        placeholder="Course"
        value={studentData.course}
        onChange={handleChange}
        className="p-2 border border-gray-400 rounded mb-2 w-full"
      />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Add Student
      </button>
    </form>
  );
};

export default AddStudentForm;
